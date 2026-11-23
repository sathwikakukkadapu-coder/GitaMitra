import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import {
  hashPassword,
  verifyPassword,
  generateVerificationCode,
  createToken,
  verifyToken,
  extractBearerToken
} from "./lib/auth-service.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const DB_PATH = path.join(__dirname, "data", "gita.db");

// Load GitaEngine
let GitaEngine = {};
try {
  const engineCode = fs.readFileSync(path.join(PUBLIC_DIR, "data", "gita-engine.js"), "utf8");
  const fnEngine = new Function("globalThis", "window", "self", "module", "exports", engineCode + "; return globalThis.GitaEngine || (module && module.exports);");
  const mod = { exports: {} };
  GitaEngine = fnEngine(globalThis, globalThis, globalThis, mod, mod.exports);
} catch (err) {
  console.error("Failed to load gita-engine.js:", err.message);
}

// Initialize or connect to SQLite database
let db = null;
try {
  if (fs.existsSync(DB_PATH)) {
    db = new DatabaseSync(DB_PATH);
    db.exec("PRAGMA journal_mode = WAL;");
  }
} catch (err) {
  console.warn("SQLite database not found or error opening. Serving from memory corpus.", err.message);
}

// Load in-memory corpus
let corpus = [];
try {
  const dataPath = path.join(PUBLIC_DIR, "data", "gita-multilingual.js");
  const code = fs.readFileSync(dataPath, "utf8");
  const fnCorpus = new Function("module", "exports", code + "; return GITA;");
  corpus = fnCorpus({}, {});
  console.log(`Loaded ${corpus.length} Gita verses into server memory.`);
} catch (err) {
  console.error("Failed to load gita-multilingual.js:", err.message);
}

// MIME types
const MIME_TYPES = {
  ".html": "text/html; charset=UTF-8",
  ".css": "text/css; charset=UTF-8",
  ".js": "application/javascript; charset=UTF-8",
  ".mjs": "application/javascript; charset=UTF-8",
  ".json": "application/json; charset=UTF-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=UTF-8"
};

// Helper to parse JSON body
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  });
  res.end(JSON.stringify(data));
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(urlObj.pathname);

  // Handle CORS Preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    return res.end();
  }

  // --- API ROUTES ---

  // Health check
  if (pathname === "/api/health") {
    return sendJson(res, 200, {
      status: "ok",
      verses: corpus.length,
      chapters: 18,
      timestamp: new Date().toISOString()
    });
  }

  // Stats
  if (pathname === "/api/stats") {
    const chapterCounts = {};
    for (const v of corpus) {
      chapterCounts[v.chapter] = (chapterCounts[v.chapter] || 0) + 1;
    }
    return sendJson(res, 200, {
      totalVerses: corpus.length,
      totalChapters: 18,
      chapterCounts,
      numberingConvention: "701 records (including Chapter 13 Verse 1)",
      sources: {
        sanskrit: "Gita Initiative / gita-gita (Unlicense)",
        english: "Gita Initiative (Unlicense)",
        hindi: "VedicScriptures Bhagavad Gita dataset",
        telugu: "prasadkuruma/BhagavadGitaTelugu"
      }
    });
  }

  // Chapters list
  if (pathname === "/api/chapters" && req.method === "GET") {
    if (db) {
      try {
        const rows = db.prepare("SELECT * FROM chapters ORDER BY chapter_number").all();
        return sendJson(res, 200, rows);
      } catch (err) {
        console.error("DB query failed:", err);
      }
    }
    // Fallback if db not initialized
    return sendJson(res, 200, Array.from({ length: 18 }, (_, i) => ({ chapter_number: i + 1 })));
  }

  // Verses list / query
  if (pathname === "/api/verses" && req.method === "GET") {
    const ch = urlObj.searchParams.get("chapter");
    const ve = urlObj.searchParams.get("verse");
    const q = urlObj.searchParams.get("q");

    let results = corpus;
    if (ch) results = results.filter(v => Number(v.chapter) === Number(ch));
    if (ve) results = results.filter(v => Number(v.verse) === Number(ve));
    if (q) {
      const query = q.toLowerCase();
      results = results.filter(v =>
        `${v.chapter}.${v.verse}`.includes(query) ||
        (v.sanskrit && v.sanskrit.includes(q)) ||
        (v.transliteration && v.transliteration.toLowerCase().includes(query)) ||
        (v.translation && v.translation.toLowerCase().includes(query)) ||
        (v.hindi && v.hindi.includes(q)) ||
        (v.telugu && v.telugu.includes(q))
      );
    }
    return sendJson(res, 200, results.slice(0, 100));
  }

  // Explain verse API
  if (pathname === "/api/explain-verse" && req.method === "POST") {
    try {
      const body = await parseJsonBody(req);
      const ch = Number(body.chapter);
      const ve = Number(body.verse);
      const lang = body.lang || "en";

      if (!ch || ch < 1 || ch > 18 || !ve || ve < 1 || ve > 80) {
        return sendJson(res, 400, { error: "Please provide a valid chapter (1-18) and verse number." });
      }

      const verse = corpus.find(v => Number(v.chapter) === ch && Number(v.verse) === ve);
      if (!verse) {
        return sendJson(res, 404, { error: `Verse ${ch}.${ve} is not present in the scripture collection.` });
      }

      const explanation = GitaEngine.generateExplanation(verse, lang);
      const wbw = GitaEngine.formatWordByWord(verse.word_by_word);
      const speaker = GitaEngine.getSpeaker(ch, ve, verse.sanskrit);
      const related = GitaEngine.getRelatedVerses(corpus, ch, ve);

      return sendJson(res, 200, {
        chapter: ch,
        verse: ve,
        reference: `Bhagavad Gita ${ch}.${ve}`,
        speaker: speaker[lang] || speaker.en,
        sanskrit: verse.sanskrit,
        transliteration: verse.transliteration,
        translation: lang === "hi" ? verse.hindi : (lang === "te" ? verse.telugu : verse.translation),
        word_by_word: wbw,
        explanation,
        relatedVerses: related.map(r => ({
          chapter: r.chapter,
          verse: r.verse,
          sanskrit: r.sanskrit,
          translation: lang === "hi" ? r.hindi : (lang === "te" ? r.telugu : r.translation)
        })),
        sourceNotes: {
          numberingConvention: "701-verse tradition with Chapter 13 Verse 1 included",
          disclaimer: "The translation and Sanskrit are authenticated source text. The structured explanation is an educational study guide."
        }
      });
    } catch (err) {
      return sendJson(res, 500, { error: "Internal server error: " + err.message });
    }
  }

  // Ask Krishna API
  if (pathname === "/api/ask-krishna" && req.method === "POST") {
    try {
      const body = await parseJsonBody(req);
      const question = body.question;
      const lang = body.lang || "en";

      if (typeof question !== "string" || question.trim().length < 5 || question.length > 1800) {
        return sendJson(res, 400, { error: "Please share a little more about your question or situation (5–1,800 characters)." });
      }

      const answer = GitaEngine.answerQuestion(corpus, question, lang);
      if (answer.notFound) {
        return sendJson(res, 404, { error: answer.message });
      }

      return sendJson(res, 200, answer);
    } catch (err) {
      return sendJson(res, 500, { error: "Failed to process reflection: " + err.message });
    }
  }

  // Bookmarks API
  if (pathname === "/api/bookmarks") {
    if (!db) return sendJson(res, 200, []);
    try {
      if (req.method === "GET") {
        const rows = db.prepare("SELECT * FROM bookmarks ORDER BY created_at DESC").all();
        return sendJson(res, 200, rows);
      }
      if (req.method === "POST") {
        const body = await parseJsonBody(req);
        const ch = Number(body.chapter);
        const ve = Number(body.verse);
        const notes = body.notes || "";
        const id = `bm_${ch}_${ve}`;
        const createdAt = new Date().toISOString();

        db.prepare("INSERT OR REPLACE INTO bookmarks (id, chapter_number, verse_number, created_at, notes) VALUES (?, ?, ?, ?, ?)").run(
          id, ch, ve, createdAt, notes
        );
        return sendJson(res, 200, { success: true, id, chapter: ch, verse: ve });
      }
      if (req.method === "DELETE") {
        const body = await parseJsonBody(req);
        const ch = Number(body.chapter);
        const ve = Number(body.verse);
        db.prepare("DELETE FROM bookmarks WHERE chapter_number = ? AND verse_number = ?").run(ch, ve);
        return sendJson(res, 200, { success: true, removed: `${ch}.${ve}` });
      }
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // Reading history API
  if (pathname === "/api/history") {
    if (!db) return sendJson(res, 200, []);
    try {
      if (req.method === "GET") {
        const rows = db.prepare("SELECT chapter_number, verse_number, MAX(read_at) as read_at FROM reading_history GROUP BY chapter_number, verse_number ORDER BY read_at DESC LIMIT 30").all();
        return sendJson(res, 200, rows);
      }
      if (req.method === "POST") {
        const body = await parseJsonBody(req);
        const ch = Number(body.chapter);
        const ve = Number(body.verse);
        const id = `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        db.prepare("INSERT INTO reading_history (id, chapter_number, verse_number, read_at) VALUES (?, ?, ?, ?)").run(
          id, ch, ve, new Date().toISOString()
        );
        return sendJson(res, 200, { success: true });
      }
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // Helper to authenticate request via JWT Bearer Token
  function authenticateUser(req) {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    const token = extractBearerToken(authHeader);
    if (!token) return null;
    return verifyToken(token);
  }

  // Format progress row from DB
  function formatProgress(row) {
    if (!row) return null;
    return {
      current_chapter: row.current_chapter,
      current_verse: row.current_verse,
      completed_verses: typeof row.completed_verses === "string" ? JSON.parse(row.completed_verses || "[]") : (row.completed_verses || []),
      completed_chapters: typeof row.completed_chapters === "string" ? JSON.parse(row.completed_chapters || "[]") : (row.completed_chapters || []),
      bookmarks: typeof row.bookmarks === "string" ? JSON.parse(row.bookmarks || "[]") : (row.bookmarks || []),
      preferred_language: row.preferred_language || "en",
      last_read_at: row.last_read_at,
      updated_at: row.updated_at
    };
  }

  // --- AUTHENTICATION API ROUTES ---

  // Sign Up
  if (pathname === "/api/auth/signup" && req.method === "POST") {
    if (!db) return sendJson(res, 500, { error: "Database service unavailable" });
    try {
      const body = await parseJsonBody(req);
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const name = String(body.name || "").trim();
      const initialProgress = body.initialProgress || {};

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return sendJson(res, 400, { error: "Please provide a valid email address." });
      }
      if (password.length < 6) {
        return sendJson(res, 400, { error: "Password must be at least 6 characters long." });
      }

      const existingUser = db.prepare("SELECT * FROM users WHERE lower(email) = lower(?)").get(email);
      const now = new Date().toISOString();
      const code = generateVerificationCode();

      if (existingUser) {
        if (existingUser.is_verified) {
          return sendJson(res, 409, { error: "An account with this email already exists. Please log in." });
        }
        // User exists but unverified: update code and re-send
        db.prepare("UPDATE users SET verification_code = ?, verification_sent_at = ?, updated_at = ? WHERE id = ?").run(
          code, now, now, existingUser.id
        );
        return sendJson(res, 200, {
          success: true,
          message: "A verification code has been sent to your email.",
          email: existingUser.email,
          userId: existingUser.id,
          requiresVerification: true,
          verificationCode: code
        });
      }

      const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const { salt, hash } = hashPassword(password);

      db.prepare(`
        INSERT INTO users (id, email, password_hash, salt, name, is_verified, verification_code, verification_sent_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?)
      `).run(userId, email, hash, salt, name, code, now, now, now);

      // Initialize persistent reading progress (migrating any guest state)
      const progId = `prog_${userId}`;
      const curCh = Number(initialProgress.chapter) || 1;
      const curVe = Number(initialProgress.verse) || 1;
      const completedVerses = JSON.stringify(Array.isArray(initialProgress.completedVerses) ? initialProgress.completedVerses : []);
      const completedChapters = JSON.stringify(Array.isArray(initialProgress.completedChapters) ? initialProgress.completedChapters : []);
      const bookmarks = JSON.stringify(Array.isArray(initialProgress.bookmarks) ? initialProgress.bookmarks : []);
      const prefLang = initialProgress.preferredLanguage || "en";

      db.prepare(`
        INSERT INTO user_reading_progress (id, user_id, current_chapter, current_verse, completed_verses, completed_chapters, bookmarks, preferred_language, last_read_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(progId, userId, curCh, curVe, completedVerses, completedChapters, bookmarks, prefLang, now, now);

      return sendJson(res, 201, {
        success: true,
        message: "Account created! Please verify your email to synchronize reading progress.",
        email,
        userId,
        requiresVerification: true,
        verificationCode: code // Provided in dev/response for verification testing
      });
    } catch (err) {
      return sendJson(res, 500, { error: "Failed to sign up: " + err.message });
    }
  }

  // Verify Email
  if (pathname === "/api/auth/verify" && req.method === "POST") {
    if (!db) return sendJson(res, 500, { error: "Database service unavailable" });
    try {
      const body = await parseJsonBody(req);
      const email = String(body.email || "").trim().toLowerCase();
      const code = String(body.code || "").trim();

      if (!email || !code) {
        return sendJson(res, 400, { error: "Email and verification code are required." });
      }

      const user = db.prepare("SELECT * FROM users WHERE lower(email) = lower(?)").get(email);
      if (!user) {
        return sendJson(res, 404, { error: "No account found with this email." });
      }

      if (user.is_verified) {
        const token = createToken({ userId: user.id, email: user.email });
        const progRow = db.prepare("SELECT * FROM user_reading_progress WHERE user_id = ?").get(user.id);
        return sendJson(res, 200, {
          success: true,
          message: "Email is already verified.",
          token,
          user: { id: user.id, email: user.email, name: user.name, is_verified: 1 },
          progress: formatProgress(progRow)
        });
      }

      if (user.verification_code !== code) {
        return sendJson(res, 400, { error: "Incorrect verification code. Please check and try again." });
      }

      const now = new Date().toISOString();
      db.prepare("UPDATE users SET is_verified = 1, verification_code = NULL, updated_at = ? WHERE id = ?").run(now, user.id);

      const token = createToken({ userId: user.id, email: user.email });
      const progRow = db.prepare("SELECT * FROM user_reading_progress WHERE user_id = ?").get(user.id);

      return sendJson(res, 200, {
        success: true,
        message: "Email successfully verified! Your progress will now sync across devices.",
        token,
        user: { id: user.id, email: user.email, name: user.name, is_verified: 1 },
        progress: formatProgress(progRow)
      });
    } catch (err) {
      return sendJson(res, 500, { error: "Verification failed: " + err.message });
    }
  }

  // Resend Verification Code
  if (pathname === "/api/auth/resend-code" && req.method === "POST") {
    if (!db) return sendJson(res, 500, { error: "Database service unavailable" });
    try {
      const body = await parseJsonBody(req);
      const email = String(body.email || "").trim().toLowerCase();
      if (!email) return sendJson(res, 400, { error: "Email is required." });

      const user = db.prepare("SELECT * FROM users WHERE lower(email) = lower(?)").get(email);
      if (!user) return sendJson(res, 404, { error: "No account found with this email." });

      const code = generateVerificationCode();
      const now = new Date().toISOString();
      db.prepare("UPDATE users SET verification_code = ?, verification_sent_at = ?, updated_at = ? WHERE id = ?").run(code, now, now, user.id);

      return sendJson(res, 200, {
        success: true,
        message: "A new verification code has been generated.",
        email: user.email,
        verificationCode: code
      });
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // Log In
  if (pathname === "/api/auth/login" && req.method === "POST") {
    if (!db) return sendJson(res, 500, { error: "Database service unavailable" });
    try {
      const body = await parseJsonBody(req);
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const initialProgress = body.initialProgress || null;

      if (!email || !password) {
        return sendJson(res, 400, { error: "Email and password are required." });
      }

      const user = db.prepare("SELECT * FROM users WHERE lower(email) = lower(?)").get(email);
      if (!user || !verifyPassword(password, user.salt, user.password_hash)) {
        return sendJson(res, 401, { error: "Invalid email or password." });
      }

      if (!user.is_verified) {
        return sendJson(res, 403, {
          error: "Please verify your email address to continue.",
          requiresVerification: true,
          email: user.email,
          verificationCode: user.verification_code
        });
      }

      const token = createToken({ userId: user.id, email: user.email });
      let progRow = db.prepare("SELECT * FROM user_reading_progress WHERE user_id = ?").get(user.id);

      // If initial progress was provided from visitor's browser and cloud has default ch 1 v 1, merge it
      if (initialProgress && progRow && progRow.current_chapter === 1 && progRow.current_verse === 1) {
        const guestCh = Number(initialProgress.chapter);
        const guestVe = Number(initialProgress.verse);
        if (guestCh > 1 || guestVe > 1) {
          const now = new Date().toISOString();
          db.prepare(`
            UPDATE user_reading_progress
            SET current_chapter = ?, current_verse = ?, last_read_at = ?, updated_at = ?
            WHERE user_id = ?
          `).run(guestCh, guestVe, now, now, user.id);
          progRow = db.prepare("SELECT * FROM user_reading_progress WHERE user_id = ?").get(user.id);
        }
      }

      return sendJson(res, 200, {
        success: true,
        message: "Welcome back!",
        token,
        user: { id: user.id, email: user.email, name: user.name, is_verified: user.is_verified },
        progress: formatProgress(progRow)
      });
    } catch (err) {
      return sendJson(res, 500, { error: "Login failed: " + err.message });
    }
  }

  // Current User Profile (Me)
  if (pathname === "/api/auth/me" && req.method === "GET") {
    if (!db) return sendJson(res, 500, { error: "Database service unavailable" });
    const auth = authenticateUser(req);
    if (!auth) return sendJson(res, 401, { error: "Authentication token required or expired." });

    const user = db.prepare("SELECT id, email, name, is_verified, created_at FROM users WHERE id = ?").get(auth.userId);
    if (!user) return sendJson(res, 404, { error: "User not found." });

    const progRow = db.prepare("SELECT * FROM user_reading_progress WHERE user_id = ?").get(auth.userId);
    return sendJson(res, 200, {
      user,
      progress: formatProgress(progRow)
    });
  }

  // --- PERSISTENT USER READING PROGRESS ROUTES ---

  // Get User Progress (Cloud Sync)
  if (pathname === "/api/user/progress" && req.method === "GET") {
    if (!db) return sendJson(res, 500, { error: "Database service unavailable" });
    const auth = authenticateUser(req);
    if (!auth) return sendJson(res, 401, { error: "Authentication required to retrieve synchronized progress." });

    const progRow = db.prepare("SELECT * FROM user_reading_progress WHERE user_id = ?").get(auth.userId);
    if (!progRow) {
      // Create empty progress row if not present
      const now = new Date().toISOString();
      const progId = `prog_${auth.userId}`;
      db.prepare(`
        INSERT INTO user_reading_progress (id, user_id, current_chapter, current_verse, completed_verses, completed_chapters, bookmarks, preferred_language, last_read_at, updated_at)
        VALUES (?, ?, 1, 1, '[]', '[]', '[]', 'en', ?, ?)
      `).run(progId, auth.userId, now, now);
      const newRow = db.prepare("SELECT * FROM user_reading_progress WHERE user_id = ?").get(auth.userId);
      return sendJson(res, 200, { success: true, progress: formatProgress(newRow) });
    }

    return sendJson(res, 200, { success: true, progress: formatProgress(progRow) });
  }

  // Save / Sync User Progress
  if (pathname === "/api/user/progress" && req.method === "POST") {
    if (!db) return sendJson(res, 500, { error: "Database service unavailable" });
    const auth = authenticateUser(req);
    if (!auth) return sendJson(res, 401, { error: "Authentication required to save progress." });

    try {
      const body = await parseJsonBody(req);
      const ch = Number(body.current_chapter);
      const ve = Number(body.current_verse);
      const now = new Date().toISOString();

      if (!Number.isInteger(ch) || ch < 1 || ch > 18 || !Number.isInteger(ve) || ve < 1 || ve > 80) {
        return sendJson(res, 400, { error: "Invalid chapter or verse number." });
      }

      // Existing progress row
      let existing = db.prepare("SELECT * FROM user_reading_progress WHERE user_id = ?").get(auth.userId);

      let completedVerses = body.completed_verses !== undefined
        ? JSON.stringify(Array.isArray(body.completed_verses) ? body.completed_verses : [])
        : (existing ? existing.completed_verses : "[]");

      let completedChapters = body.completed_chapters !== undefined
        ? JSON.stringify(Array.isArray(body.completed_chapters) ? body.completed_chapters : [])
        : (existing ? existing.completed_chapters : "[]");

      let bookmarks = body.bookmarks !== undefined
        ? JSON.stringify(Array.isArray(body.bookmarks) ? body.bookmarks : [])
        : (existing ? existing.bookmarks : "[]");

      let prefLang = body.preferred_language || (existing ? existing.preferred_language : "en");

      const progId = existing ? existing.id : `prog_${auth.userId}`;

      db.prepare(`
        INSERT OR REPLACE INTO user_reading_progress (
          id, user_id, current_chapter, current_verse, completed_verses, completed_chapters, bookmarks, preferred_language, last_read_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(progId, auth.userId, ch, ve, completedVerses, completedChapters, bookmarks, prefLang, now, now);

      // Record to user reading history
      const histId = `uhist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      db.prepare(`
        INSERT INTO user_reading_history (id, user_id, chapter_number, verse_number, read_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(histId, auth.userId, ch, ve, now);

      const updated = db.prepare("SELECT * FROM user_reading_progress WHERE user_id = ?").get(auth.userId);

      return sendJson(res, 200, {
        success: true,
        message: "Reading progress synced to cloud.",
        progress: formatProgress(updated)
      });
    } catch (err) {
      return sendJson(res, 500, { error: "Failed to save reading progress: " + err.message });
    }
  }

  // Toggle or Mark Verse Completed
  if (pathname === "/api/user/mark-completed" && req.method === "POST") {
    if (!db) return sendJson(res, 500, { error: "Database service unavailable" });
    const auth = authenticateUser(req);
    if (!auth) return sendJson(res, 401, { error: "Authentication required." });

    try {
      const body = await parseJsonBody(req);
      const ch = Number(body.chapter);
      const ve = Number(body.verse);
      const markAs = body.completed !== undefined ? Boolean(body.completed) : true;

      const verseRef = `${ch}.${ve}`;
      let row = db.prepare("SELECT * FROM user_reading_progress WHERE user_id = ?").get(auth.userId);
      let completedVerses = row ? JSON.parse(row.completed_verses || "[]") : [];
      let completedChapters = row ? JSON.parse(row.completed_chapters || "[]") : [];

      if (markAs && !completedVerses.includes(verseRef)) {
        completedVerses.push(verseRef);
      } else if (!markAs && completedVerses.includes(verseRef)) {
        completedVerses = completedVerses.filter(r => r !== verseRef);
      }

      // Check if all verses in chapter are completed
      const chapterVerses = corpus.filter(v => Number(v.chapter) === ch);
      const allInChCompleted = chapterVerses.length > 0 && chapterVerses.every(v => completedVerses.includes(`${ch}.${v.verse}`));

      if (allInChCompleted && !completedChapters.includes(ch)) {
        completedChapters.push(ch);
      } else if (!allInChCompleted && completedChapters.includes(ch)) {
        completedChapters = completedChapters.filter(c => c !== ch);
      }

      const now = new Date().toISOString();
      const progId = row ? row.id : `prog_${auth.userId}`;

      db.prepare(`
        INSERT OR REPLACE INTO user_reading_progress (
          id, user_id, current_chapter, current_verse, completed_verses, completed_chapters, bookmarks, preferred_language, last_read_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        progId,
        auth.userId,
        row ? row.current_chapter : ch,
        row ? row.current_verse : ve,
        JSON.stringify(completedVerses),
        JSON.stringify(completedChapters),
        row ? row.bookmarks : "[]",
        row ? row.preferred_language : "en",
        now,
        now
      );

      return sendJson(res, 200, {
        success: true,
        verseRef,
        isCompleted: markAs,
        completed_verses: completedVerses,
        completed_chapters: completedChapters
      });
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // --- STATIC FILE SERVING ---
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, "");
  if (safePath === "/" || safePath === "\\") safePath = "/index.html";

  const filePath = path.join(PUBLIC_DIR, safePath);

  // Check if file exists inside PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    return res.end("Forbidden");
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
      return res.end("<h1>404 Not Found</h1><p>The requested page or file does not exist.</p>");
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=3600"
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`GitaMitra server running at http://localhost:${PORT}`);
});

export default server;
