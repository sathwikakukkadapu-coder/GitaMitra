import { db, ai } from "hatchable";

export const access = "public";
export const methods = ["POST"];

export default async function (req, res) {
  const question = req.body?.question;
  const lang = req.body?.lang || "en";

  if (typeof question !== "string" || question.trim().length < 5 || question.length > 1800) {
    return res.status(400).json({ error: "Please share a little more about your situation (5–1,800 characters)." });
  }

  const terms = [...new Set(question.toLowerCase().split(/[^a-z0-9\u0900-\u097F\u0C00-\u0C7F]+/).filter(w => w.length >= 3))].slice(0, 10);
  if (!terms.length) {
    return res.status(400).json({ error: "Please describe your situation using a little more detail." });
  }

  const clauses = terms.map((_, i) =>
    "(lower(translation_en) LIKE $" + (i + 1) +
    " OR lower(translation_hi) LIKE $" + (i + 1) +
    " OR lower(translation_te) LIKE $" + (i + 1) +
    " OR lower(transliteration) LIKE $" + (i + 1) +
    " OR sanskrit LIKE $" + (i + 1) + ")"
  );
  const params = terms.map(t => "%" + t + "%");

  let found = { rows: [] };
  try {
    found = await db.query(
      "SELECT chapter_number, verse_number, sanskrit, transliteration, translation_en, translation_hi, translation_te, word_by_word FROM gita_corpus WHERE " + clauses.join(" OR ") + " ORDER BY chapter_number, verse_number LIMIT 12",
      params
    );
  } catch (err) {
    console.error("DB Query error:", err);
  }

  // Fallback to primary verses if keyword search had no results
  if (!found.rows.length) {
    try {
      found = await db.query(
        "SELECT chapter_number, verse_number, sanskrit, transliteration, translation_en, translation_hi, translation_te, word_by_word FROM gita_corpus WHERE (chapter_number = 2 AND verse_number = 47) OR (chapter_number = 6 AND verse_number = 35) LIMIT 2"
      );
    } catch (_) {}
  }

  if (!found.rows.length) {
    return res.status(404).json({ error: "I could not find a close textual match in the verse collection. Try describing your question with different words." });
  }

  const selected = found.rows[0];
  const translation = lang === "hi" ? selected.translation_hi : (lang === "te" ? selected.translation_te : selected.translation_en);

  // If AI is configured, generate contextual grounding
  if (ai && typeof ai.generateText === "function") {
    try {
      const context = found.rows.map(v => `BG ${v.chapter_number}.${v.verse_number}: ${v.translation_en}`).join("\n");
      const result = await ai.generateText({
        purpose: "gita-situation-guidance",
        model: "gpt",
        maxTokens: 1000,
        system: "You are an educational study companion for the Bhagavad Gita. Select the most relevant verse ONLY from the supplied records. Never invent Sanskrit text. Clearly distinguish the original verse translation and your own educational application. Do not claim to speak as Krishna. Return valid JSON only with keys: title, reference, meaning, application.",
        prompt: `User question: ${question}\n\nAvailable records:\n${context}`
      });
      if (result && result.text) {
        try {
          const parsed = JSON.parse(result.text);
          return res.json({
            title: parsed.title || "A teaching from the Bhagavad Gita",
            reference: parsed.reference || `Bhagavad Gita ${selected.chapter_number}.${selected.verse_number}`,
            chapter: selected.chapter_number,
            verse: selected.verse_number,
            sanskrit: selected.sanskrit,
            transliteration: selected.transliteration,
            translation,
            meaning: parsed.meaning || translation,
            application: parsed.application,
            word_by_word: selected.word_by_word,
            disclaimer: "The verse is sourced directly from the Bhagavad Gita. The explanation is an educational study reflection."
          });
        } catch (_) {}
      }
    } catch (aiErr) {
      // Graceful fallback
    }
  }

  return res.json({
    title: "A teaching from the Bhagavad Gita",
    reference: `Bhagavad Gita ${selected.chapter_number}.${selected.verse_number}`,
    chapter: selected.chapter_number,
    verse: selected.verse_number,
    sanskrit: selected.sanskrit,
    transliteration: selected.transliteration,
    translation,
    meaning: translation,
    application: `In the Bhagavad Gita, this teaching reminds us that inner clarity comes from focusing on one's sincere duty, letting go of anxious attachment to results, and maintaining composure amidst life's dualities.`,
    word_by_word: selected.word_by_word,
    disclaimer: "The verse is sourced directly from the Bhagavad Gita. The explanation is an educational study reflection."
  });
}
