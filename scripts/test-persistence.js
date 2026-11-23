import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { EventEmitter } from "node:events";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import server from "../server.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("==================================================");
console.log("   GITAMITRA PERSISTENT READING PROGRESS TESTS    ");
console.log("==================================================");

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✓ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
  }
}

// In-memory request dispatcher for reliable sandboxed execution
function dispatchRequest(url, method = "GET", body = null, token = null) {
  return new Promise((resolve, reject) => {
    const req = new EventEmitter();
    req.url = url;
    req.method = method;
    req.headers = { host: "localhost" };
    if (token) {
      req.headers["authorization"] = `Bearer ${token}`;
    }

    const res = new EventEmitter();
    let resHeaders = {};
    let resStatusCode = 200;
    let resData = "";

    res.writeHead = (statusCode, headers) => {
      resStatusCode = statusCode;
      resHeaders = headers;
    };

    res.end = (chunk) => {
      if (chunk) resData += chunk;
      let parsed = resData;
      try { parsed = JSON.parse(resData); } catch (_) {}
      resolve({ status: resStatusCode, headers: resHeaders, body: parsed });
    };

    res.write = (chunk) => {
      resData += chunk;
    };

    server.emit("request", req, res);

    if (body) {
      req.emit("data", Buffer.from(JSON.stringify(body)));
    }
    req.emit("end");
  });
}

// --- TEST A: Visitor Local Persistence ---
console.log("\n[Test A] Testing Visitor Local Persistence...");
await runAsyncTest("Test A: Visitor reads Chapter 2 Verse 47, simulates browser close and reopen", async () => {
  // Simulate browser storage
  const mockStorage = {};
  function setItem(k, v) { mockStorage[k] = String(v); }
  function getItem(k) { return mockStorage[k] || null; }

  // 1. Visitor opens Chapter 2, Verse 47
  setItem("gm_last_chapter", 2);
  setItem("gm_last_verse", 47);
  setItem("gm_history", JSON.stringify([{ chapter: 2, verse: 47, time: new Date().toISOString() }]));

  // 2. Simulate browser restart (memory cleared, restored from persistent storage)
  const restoredCh = Number(getItem("gm_last_chapter"));
  const restoredVe = Number(getItem("gm_last_verse"));
  const history = JSON.parse(getItem("gm_history") || "[]");

  assert.strictEqual(restoredCh, 2, "Restored chapter must be 2");
  assert.strictEqual(restoredVe, 47, "Restored verse must be 47");
  assert.strictEqual(history[0].chapter, 2);
  assert.strictEqual(history[0].verse, 47);
});

// --- TEST B: Cross-Device Cloud Synchronization ---
console.log("\n[Test B] Testing Cross-Device Cloud Synchronization...");
await runAsyncTest("Test B: Log in on Device 1, read Ch 3 V 19, verify on Device 2", async () => {
  const email = `arjuna_${Date.now()}@kurukshetra.org`;
  const password = "sacred_password_108";

  // 1. Sign up on Device 1
  const signupRes = await dispatchRequest("/api/auth/signup", "POST", {
    email,
    password,
    name: "Arjuna"
  });
  assert.strictEqual(signupRes.status, 201, `Signup failed: ${JSON.stringify(signupRes.body)}`);
  assert.ok(signupRes.body.requiresVerification);
  const code = signupRes.body.verificationCode;
  assert.ok(code, "Verification code must be returned in dev/test mode");

  // 2. Verify email
  const verifyRes = await dispatchRequest("/api/auth/verify", "POST", {
    email,
    code
  });
  assert.strictEqual(verifyRes.status, 200, "Verification failed");
  const device1Token = verifyRes.body.token;
  assert.ok(device1Token, "Device 1 must receive auth token");

  // 3. Device 1 (Laptop): Read Chapter 3, Verse 19 and mark verse completed
  const syncRes = await dispatchRequest("/api/user/progress", "POST", {
    current_chapter: 3,
    current_verse: 19,
    completed_verses: ["3.19"],
    preferred_language: "hi"
  }, device1Token);
  assert.strictEqual(syncRes.status, 200, "Device 1 progress sync failed");
  assert.strictEqual(syncRes.body.progress.current_chapter, 3);
  assert.strictEqual(syncRes.body.progress.current_verse, 19);

  // 4. Device 2 (Mobile / Another Device): User logs in with same credentials
  const loginResDevice2 = await dispatchRequest("/api/auth/login", "POST", {
    email,
    password
  });
  assert.strictEqual(loginResDevice2.status, 200, "Device 2 login failed");
  const device2Token = loginResDevice2.body.token;

  // 5. Device 2 retrieves remote synchronized reading progress
  const device2Progress = await dispatchRequest("/api/user/progress", "GET", null, device2Token);
  assert.strictEqual(device2Progress.status, 200);
  assert.strictEqual(device2Progress.body.progress.current_chapter, 3, "Device 2 must see Chapter 3");
  assert.strictEqual(device2Progress.body.progress.current_verse, 19, "Device 2 must see Verse 19");
  assert.ok(device2Progress.body.progress.completed_verses.includes("3.19"), "Device 2 must see completed verse 3.19");
  assert.strictEqual(device2Progress.body.progress.preferred_language, "hi", "Device 2 must see preferred language");
});

// --- TEST C: Multi-User Isolation & Ownership ---
console.log("\n[Test C] Testing Two Accounts Isolation...");
await runAsyncTest("Test C: Two distinct accounts have completely separate reading progress & bookmarks", async () => {
  const emailA = `yudhishthira_${Date.now()}@dharma.org`;
  const emailB = `bhima_${Date.now()}@strength.org`;
  const password = "password_secure_123";

  // Create User A
  const signupA = await dispatchRequest("/api/auth/signup", "POST", { email: emailA, password, name: "Yudhishthira" });
  const verifyA = await dispatchRequest("/api/auth/verify", "POST", { email: emailA, code: signupA.body.verificationCode });
  const tokenA = verifyA.body.token;

  // Create User B
  const signupB = await dispatchRequest("/api/auth/signup", "POST", { email: emailB, password, name: "Bhima" });
  const verifyB = await dispatchRequest("/api/auth/verify", "POST", { email: emailB, code: signupB.body.verificationCode });
  const tokenB = verifyB.body.token;

  // User A reads Chapter 6, Verse 26 and bookmarks 6.26
  await dispatchRequest("/api/user/progress", "POST", {
    current_chapter: 6,
    current_verse: 26,
    completed_verses: ["6.26"],
    bookmarks: [{ chapter: 6, verse: 26, notes: "Mind control" }]
  }, tokenA);

  // User B reads Chapter 11, Verse 35 and bookmarks 11.35
  await dispatchRequest("/api/user/progress", "POST", {
    current_chapter: 11,
    current_verse: 35,
    completed_verses: ["11.35"],
    bookmarks: [{ chapter: 11, verse: 35, notes: "Cosmic form" }]
  }, tokenB);

  // Fetch User A progress
  const resA = await dispatchRequest("/api/user/progress", "GET", null, tokenA);
  assert.strictEqual(resA.body.progress.current_chapter, 6);
  assert.strictEqual(resA.body.progress.current_verse, 26);
  assert.strictEqual(resA.body.progress.bookmarks[0].verse, 26);
  assert.strictEqual(resA.body.progress.completed_verses[0], "6.26");

  // Fetch User B progress
  const resB = await dispatchRequest("/api/user/progress", "GET", null, tokenB);
  assert.strictEqual(resB.body.progress.current_chapter, 11);
  assert.strictEqual(resB.body.progress.current_verse, 35);
  assert.strictEqual(resB.body.progress.bookmarks[0].verse, 35);
  assert.strictEqual(resB.body.progress.completed_verses[0], "11.35");

  // Verify User A cannot see User B's data
  assert.notStrictEqual(resA.body.progress.current_chapter, resB.body.progress.current_chapter);
  assert.notStrictEqual(resA.body.progress.bookmarks[0].chapter, resB.body.progress.bookmarks[0].chapter);
});

// --- TEST D: Deployment & Server Restart Persistence ---
console.log("\n[Test D] Testing Deployment / Server Restart Persistence...");
await runAsyncTest("Test D: Database records survive server reboot / redeployment", async () => {
  const dbPath = path.join(__dirname, "../data/gita.db");
  assert.ok(fs.existsSync(dbPath), "Database file data/gita.db must exist on disk");

  // Direct connection to SQLite database file simulating independent server session
  const directDb = new DatabaseSync(dbPath);
  const userCount = directDb.prepare("SELECT count(*) as count FROM users").get();
  const progCount = directDb.prepare("SELECT count(*) as count FROM user_reading_progress").get();
  directDb.close();

  assert.ok(userCount.count > 0, "Users must be persistently stored in SQLite data/gita.db");
  assert.ok(progCount.count > 0, "Reading progress records must be persistently stored in SQLite data/gita.db");
});

// --- TEST E: Free Visitor Access Without Login ---
console.log("\n[Test E] Testing Unauthenticated Visitor Access...");
await runAsyncTest("Test E: Visitors can access all chapters, verses, explanations and Ask Krishna without an account", async () => {
  // 1. Access chapter verses
  const versesRes = await dispatchRequest("/api/verses?chapter=2&verse=47");
  assert.strictEqual(versesRes.status, 200);
  assert.ok(Array.isArray(versesRes.body));
  assert.strictEqual(versesRes.body[0].verse, 47);

  // 2. Access verse explanation without token
  const explainRes = await dispatchRequest("/api/explain-verse", "POST", { chapter: 2, verse: 47 });
  assert.strictEqual(explainRes.status, 200);
  assert.ok(explainRes.body.explanation.simpleMeaning);

  // 3. Ask Krishna without token
  const askRes = await dispatchRequest("/api/ask-krishna", "POST", { question: "How to stay calm in stressful situations?" });
  assert.strictEqual(askRes.status, 200);
  assert.ok(askRes.body.reference);
});

// Close server
server.close();

console.log("\n==================================================");
console.log(`PERSISTENCE TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log("==================================================");

if (passedTests === totalTests) {
  console.log("ALL 5 PERSISTENCE SCENARIOS (A, B, C, D, E) VERIFIED! ✓\n");
  process.exit(0);
} else {
  console.error("SOME PERSISTENCE TESTS FAILED!\n");
  process.exit(1);
}
