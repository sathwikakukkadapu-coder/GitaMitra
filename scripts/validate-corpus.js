import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.resolve(__dirname, "../public/data/gita-multilingual.js");

if (!fs.existsSync(dataPath)) {
  console.error("Dataset file not found at:", dataPath);
  process.exit(1);
}

// Load data
const code = fs.readFileSync(dataPath, "utf8");
const fn = new Function("module", "exports", code + "\nreturn typeof GITA !== 'undefined' ? GITA : (typeof module !== 'undefined' && module.exports ? module.exports : []);");
const moduleObj = { exports: [] };
const data = fn(moduleObj, moduleObj.exports);

const totalRecords = data.length;
const chapterCounts = {};
const duplicates = [];
const missingFields = {
  sanskrit: 0,
  transliteration: 0,
  translation: 0,
  hindi: 0,
  telugu: 0,
  word_by_word: 0
};
const invalidUnicode = [];
const seenKeys = new Set();
let totalWordGlosses = 0;

// Standard Gita chapter verse counts (using the 701-verse tradition with 13.1)
const expectedCounts701 = {
  1: 47, 2: 72, 3: 43, 4: 42, 5: 29, 6: 47,
  7: 30, 8: 28, 9: 34, 10: 42, 11: 55, 12: 20,
  13: 35, 14: 27, 15: 20, 16: 24, 17: 28, 18: 78
};

// Check records
for (const v of data) {
  const key = `${v.chapter}.${v.verse}`;
  if (seenKeys.has(key)) {
    duplicates.push(key);
  }
  seenKeys.add(key);

  chapterCounts[v.chapter] = (chapterCounts[v.chapter] || 0) + 1;

  if (!v.sanskrit || typeof v.sanskrit !== "string" || !v.sanskrit.trim()) missingFields.sanskrit++;
  if (!v.transliteration || typeof v.transliteration !== "string" || !v.transliteration.trim()) missingFields.transliteration++;
  if (!v.translation || typeof v.translation !== "string" || !v.translation.trim()) missingFields.translation++;
  if (!v.hindi || typeof v.hindi !== "string" || !v.hindi.trim()) missingFields.hindi++;
  if (!v.telugu || typeof v.telugu !== "string" || !v.telugu.trim()) missingFields.telugu++;
  if (!v.word_by_word || !Array.isArray(v.word_by_word) || v.word_by_word.length === 0) {
    missingFields.word_by_word++;
  } else {
    totalWordGlosses += v.word_by_word.length;
  }

  // Unicode check for Sanskrit (Devanagari \u0900-\u097F)
  if (v.sanskrit && !/[\u0900-\u097F]/.test(v.sanskrit)) {
    invalidUnicode.push({ key, issue: "No Devanagari characters in sanskrit" });
  }
  // Unicode check for Telugu (\u0C00-\u0C7F)
  if (v.telugu && !/[\u0C00-\u0C7F]/.test(v.telugu)) {
    invalidUnicode.push({ key, issue: "No Telugu characters in telugu translation" });
  }
}

// Generate report
const report = {
  timestamp: new Date().toISOString(),
  totalRecords,
  uniqueVerses: seenKeys.size,
  duplicatesCount: duplicates.length,
  duplicates,
  totalChapters: Object.keys(chapterCounts).length,
  chapterCounts,
  expectedCounts701,
  countsMatchExpected: Object.entries(expectedCounts701).every(([ch, count]) => chapterCounts[ch] === count),
  missingFields,
  invalidUnicodeCount: invalidUnicode.length,
  invalidUnicode,
  totalWordGlosses,
  avgGlossesPerVerse: +(totalWordGlosses / totalRecords).toFixed(1),
  numberingConvention: "701 verses (includes Chapter 13 Verse 1; traditional 700-verse editions omit Chapter 13 Verse 1)",
  sources: {
    sanskritAndTransliteration: "Gita Initiative / gita-gita (Public Domain / Unlicense)",
    englishTranslation: "Gita Initiative (Public Domain / Unlicense)",
    wordByWordEnglish: "Gita Initiative (Public Domain / Unlicense)",
    hindiTranslation: "VedicScriptures Bhagavad Gita dataset",
    teluguTranslation: "prasadkuruma/BhagavadGitaTelugu (Research attribution noted in SOURCES.md)"
  }
};

console.log("=== GITA MITRA CORPUS AUDIT REPORT ===");
console.log(JSON.stringify(report, null, 2));

// Save report to file
fs.writeFileSync(path.resolve(__dirname, "corpus-validation-report.json"), JSON.stringify(report, null, 2), "utf8");
console.log("Saved report to scripts/corpus-validation-report.json");
