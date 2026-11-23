import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

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
    "Access-Control-Allow-Headers": "Content-Type"
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
