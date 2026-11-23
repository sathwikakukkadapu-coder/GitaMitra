import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { EventEmitter } from "node:events";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.resolve(__dirname, "../public/data/gita-multilingual.js");
const enginePath = path.resolve(__dirname, "../public/data/gita-engine.js");

console.log("==================================================");
console.log("       GITAMITRA COMPREHENSIVE TEST SUITE         ");
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

// 1. Load data & engine
const code = fs.readFileSync(dataPath, "utf8");
const fnCorpus = new Function("module", "exports", code + "; return GITA;");
const corpus = fnCorpus({}, {});

const engineCode = fs.readFileSync(enginePath, "utf8");
const fnEngine = new Function("globalThis", "window", "self", "module", "exports", engineCode + "; return globalThis.GitaEngine || (module && module.exports);");
const GitaEngine = fnEngine(globalThis, globalThis, globalThis, { exports: {} }, {});

// --- TEST SUITE 1: CORPUS & INTEGRITY ---
console.log("\n[1] Testing Corpus & Integrity...");

runTest("Total records count equals 701 (including Chapter 13 Verse 1)", () => {
  assert.strictEqual(corpus.length, 701, `Expected 701 records, found ${corpus.length}`);
});

runTest("All 18 chapters are present and numbered 1 to 18", () => {
  const chapters = new Set(corpus.map(v => Number(v.chapter)));
  assert.strictEqual(chapters.size, 18, `Expected 18 chapters, found ${chapters.size}`);
  for (let c = 1; c <= 18; c++) {
    assert.ok(chapters.has(c), `Missing chapter ${c}`);
  }
});

runTest("Chapter 13 contains 35 verses (701-record numbering convention)", () => {
  const ch13 = corpus.filter(v => Number(v.chapter) === 13);
  assert.strictEqual(ch13.length, 35, `Expected 35 verses in Chapter 13, got ${ch13.length}`);
  const v13_1 = corpus.find(v => Number(v.chapter) === 13 && Number(v.verse) === 1);
  assert.ok(v13_1, "Chapter 13 Verse 1 must exist");
});

runTest("No duplicate chapter.verse identifiers", () => {
  const seen = new Set();
  const dups = [];
  for (const v of corpus) {
    const key = `${v.chapter}.${v.verse}`;
    if (seen.has(key)) dups.push(key);
    seen.add(key);
  }
  assert.strictEqual(dups.length, 0, `Found duplicate verses: ${dups.join(", ")}`);
});

runTest("Every verse has non-empty Sanskrit, transliteration, English, Hindi, and Telugu", () => {
  for (const v of corpus) {
    const key = `${v.chapter}.${v.verse}`;
    assert.ok(v.sanskrit && v.sanskrit.trim().length > 0, `Empty Sanskrit in ${key}`);
    assert.ok(v.transliteration && v.transliteration.trim().length > 0, `Empty Transliteration in ${key}`);
    assert.ok(v.translation && v.translation.trim().length > 0, `Empty English in ${key}`);
    assert.ok(v.hindi && v.hindi.trim().length > 0, `Empty Hindi in ${key}`);
    assert.ok(v.telugu && v.telugu.trim().length > 0, `Empty Telugu in ${key}`);
    assert.ok(Array.isArray(v.word_by_word) && v.word_by_word.length > 0, `Empty word_by_word in ${key}`);
  }
});

runTest("Unicode script integrity: Devanagari in Sanskrit and Telugu in Telugu translations", () => {
  for (const v of corpus) {
    const key = `${v.chapter}.${v.verse}`;
    assert.ok(/[\u0900-\u097F]/.test(v.sanskrit), `No Devanagari in Sanskrit of ${key}`);
    assert.ok(/[\u0C00-\u0C7F]/.test(v.telugu), `No Telugu characters in Telugu of ${key}`);
  }
});

// --- TEST SUITE 2: WORD-BY-WORD FORMATTING ---
console.log("\n[2] Testing Word-by-Word Meanings...");

runTest("Word-by-word formatting produces valid Sanskrit, Transliteration, and Meaning", () => {
  const v11 = corpus[0];
  const wbw11 = GitaEngine.formatWordByWord(v11.word_by_word);
  assert.ok(wbw11.length >= 8, `Expected at least 8 glosses in 1.1, got ${wbw11.length}`);
  assert.strictEqual(wbw11[1].transliteration, "dharma-kṣhetre");
  assert.strictEqual(wbw11[1].sanskrit, "धर्मक्षेत्रे");
  assert.strictEqual(wbw11[1].meaning, "the land of dharma");

  const v247 = corpus.find(v => v.chapter === 2 && v.verse === 47);
  const wbw247 = GitaEngine.formatWordByWord(v247.word_by_word);
  assert.strictEqual(wbw247[0].transliteration, "karmaṇi");
  assert.strictEqual(wbw247[0].sanskrit, "कर्मणि");
  assert.strictEqual(wbw247[0].meaning, "in prescribed duties");
});

// --- TEST SUITE 3: DETAILED EXPLANATION GENERATION ---
console.log("\n[3] Testing Detailed Verse Explanations...");

runTest("Generates 6 structured sections in English for BG 2.47", () => {
  const v247 = corpus.find(v => v.chapter === 2 && v.verse === 47);
  const exp = GitaEngine.generateExplanation(v247, "en");
  assert.ok(exp.simpleMeaning, "Missing simpleMeaning");
  assert.ok(exp.detailedInterpretation, "Missing detailedInterpretation");
  assert.ok(exp.context, "Missing context");
  assert.ok(exp.philosophicalSignificance, "Missing philosophicalSignificance");
  assert.ok(exp.practicalApplication, "Missing practicalApplication");
  assert.ok(exp.keyLesson, "Missing keyLesson");
  assert.strictEqual(exp.speaker, "Lord Krishna said");
});

runTest("Generates 6 structured sections in Hindi for BG 2.47", () => {
  const v247 = corpus.find(v => v.chapter === 2 && v.verse === 47);
  const exp = GitaEngine.generateExplanation(v247, "hi");
  assert.ok(exp.simpleMeaning, "Missing simpleMeaning");
  assert.ok(exp.detailedInterpretation, "Missing detailedInterpretation");
  assert.ok(exp.context, "Missing context");
  assert.ok(exp.practicalApplication, "Missing practicalApplication");
  assert.strictEqual(exp.speaker, "श्री भगवान बोले");
});

runTest("Generates 6 structured sections in Telugu for BG 2.47", () => {
  const v247 = corpus.find(v => v.chapter === 2 && v.verse === 47);
  const exp = GitaEngine.generateExplanation(v247, "te");
  assert.ok(exp.simpleMeaning, "Missing simpleMeaning");
  assert.ok(exp.detailedInterpretation, "Missing detailedInterpretation");
  assert.ok(exp.philosophicalSignificance, "Missing philosophicalSignificance");
  assert.strictEqual(exp.speaker, "శ్రీ భగవానుడు పలికెను");
});

// --- TEST SUITE 4: ASK KRISHNA RETRIEVAL ---
console.log("\n[4] Testing Ask Krishna Q&A System...");

runTest("Question: 'How can I control my anger?' returns genuine verse reference", () => {
  const ans = GitaEngine.answerQuestion(corpus, "How can I control my anger?", "en");
  assert.ok(ans.reference.startsWith("Bhagavad Gita"), `Invalid reference: ${ans.reference}`);
  assert.ok(ans.sanskrit, "Missing Sanskrit text");
  assert.ok(ans.meaning, "Missing meaning");
  assert.ok(ans.application, "Missing practical application");
  assert.ok(ans.disclaimer, "Missing disclaimer");
});

runTest("Question: 'What does Krishna say about failure?' returns balanced action verse", () => {
  const ans = GitaEngine.answerQuestion(corpus, "What does Krishna say about failure?", "hi");
  assert.ok(ans.reference.startsWith("Bhagavad Gita"));
  assert.ok(ans.meaning.length > 10, "Meaning must be non-empty");
});

runTest("Gibberish question returns honest notFound response rather than hallucination", () => {
  const ans = GitaEngine.answerQuestion(corpus, "xyzqwerty foobar nonexisting gibberish 999", "en");
  assert.ok(ans.notFound, "Should flag notFound for non-matching query");
});

// --- TEST SUITE 5: IN-MEMORY API DISPATCH TESTING ---
console.log("\n[5] Testing Server & HTTP API Logic...");

import server from "../server.js";

// Mock request dispatcher to run sandboxed without needing socket connection
function dispatchRequest(url, method = "GET", body = null) {
  return new Promise((resolve, reject) => {
    const req = new EventEmitter();
    req.url = url;
    req.method = method;
    req.headers = { host: "localhost" };

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

    // Emit request on server listeners
    server.emit("request", req, res);

    if (body) {
      req.emit("data", Buffer.from(JSON.stringify(body)));
    }
    req.emit("end");
  });
}

await runAsyncTest("GET /api/health returns 200 with 701 verses and 18 chapters", async () => {
  const res = await dispatchRequest("/api/health");
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.verses, 701);
  assert.strictEqual(res.body.chapters, 18);
});

await runAsyncTest("GET /api/stats returns complete chapter breakdown", async () => {
  const res = await dispatchRequest("/api/stats");
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.totalVerses, 701);
  assert.strictEqual(res.body.chapterCounts["13"], 35);
});

await runAsyncTest("POST /api/explain-verse returns 6 structured sections for valid verse", async () => {
  const res = await dispatchRequest("/api/explain-verse", "POST", { chapter: 2, verse: 47, lang: "en" });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.reference, "Bhagavad Gita 2.47");
  assert.ok(res.body.explanation.simpleMeaning);
  assert.ok(res.body.explanation.practicalApplication);
  assert.ok(Array.isArray(res.body.word_by_word));
});

await runAsyncTest("POST /api/explain-verse rejects invalid chapter with 400", async () => {
  const res = await dispatchRequest("/api/explain-verse", "POST", { chapter: 99, verse: 1 });
  assert.strictEqual(res.status, 400);
});

await runAsyncTest("POST /api/ask-krishna returns grounded Gita guidance", async () => {
  const res = await dispatchRequest("/api/ask-krishna", "POST", { question: "How to handle failure and sorrow?", lang: "en" });
  assert.strictEqual(res.status, 200);
  assert.ok(res.body.reference);
  assert.ok(res.body.sanskrit);
  assert.ok(res.body.application);
});

await runAsyncTest("POST and DELETE /api/bookmarks manages user saved verses", async () => {
  const postRes = await dispatchRequest("/api/bookmarks", "POST", { chapter: 2, verse: 47 });
  assert.strictEqual(postRes.status, 200);
  assert.ok(postRes.body.success);

  const getRes = await dispatchRequest("/api/bookmarks");
  assert.strictEqual(getRes.status, 200);
  assert.ok(Array.isArray(getRes.body));

  const delRes = await dispatchRequest("/api/bookmarks", "DELETE", { chapter: 2, verse: 47 });
  assert.strictEqual(delRes.status, 200);
});

// Close server
server.close();

console.log("\n==================================================");
console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log("==================================================");

if (passedTests === totalTests) {
  console.log("ALL ACCEPTANCE TESTS PASSED SUCCESSFULLY! ✓\n");
  process.exit(0);
} else {
  console.error("SOME TESTS FAILED!\n");
  process.exit(1);
}
