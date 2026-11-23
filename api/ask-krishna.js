import { db, ai } from "hatchable";

export const access = "public";
export const methods = ["POST"];

export default async function (req, res) {
  const question = req.body?.question;
  if (typeof question !== "string" || question.trim().length < 8 || question.length > 1800) {
    return res.status(400).json({ error: "Please share a little more about your situation (8–1,800 characters)." });
  }
  const terms = [...new Set(question.toLowerCase().split(/[^a-z]+/).filter(w => w.length > 3))].slice(0, 10);
  if (!terms.length) return res.status(400).json({ error: "Please describe your situation using a little more detail." });
  const clauses = terms.map((_, i) => "(lower(translation_en) LIKE $" + (i + 1) + " OR lower(translation_hi) LIKE $" + (i + 1) + " OR lower(translation_te) LIKE $" + (i + 1) + " OR lower(transliteration) LIKE $" + (i + 1) + ")");
  const params = terms.map(t => "%" + t + "%");
  const found = await db.query(
    "SELECT chapter_number, verse_number, sanskrit, transliteration, translation_en, translation_hi, translation_te, word_by_word FROM gita_corpus WHERE " + clauses.join(" OR ") + " ORDER BY chapter_number, verse_number LIMIT 12",
    params
  );
  if (!found.rows.length) return res.status(404).json({ error: "I could not find a close textual match in the verse collection. Try describing the situation with different words." });
  const context = found.rows.map(v => "Bhagavad Gita " + v.chapter_number + "." + v.verse_number + "\nSanskrit: " + v.sanskrit + "\nEnglish: " + v.translation_en + "\nHindi: " + v.translation_hi + "\nTelugu: " + v.translation_te + "\nWord meanings: " + (v.word_by_word || []).join("; ")).join("\n\n");
  let result;
  try {
    result = await ai.generateText({
      purpose: "gita-situation-guidance",
      model: "gpt",
      maxTokens: 1000,
      system: "You are a careful study companion for the Bhagavad Gita. Select the most relevant verse ONLY from the supplied records. Never invent, alter, or combine Sanskrit text. Clearly distinguish the original verse, translation and your own interpretation. Do not claim to speak as Krishna. Offer a compassionate practical reflection, not medical, legal or financial advice. Return valid JSON only with keys title, reference (format Chapter X, Verse Y), meaning (plain-language meaning based only on the selected translation), application (practical reflection for the user's situation).",
      prompt: "User situation: " + question + "\n\nVerified source records:\n" + context + "\n\nChoose one record and return JSON only."
    });
  } catch (err) {
    return res.status(503).json({ error: "The scripture search is ready, but the AI provider is not connected yet. Add an OpenAI provider key in the GitaMitra project Setup to enable personalized explanations." });
  }
  if (result.finishReason === "length") return res.status(502).json({ error: "The response was incomplete. Please try a shorter question." });
  let parsed;
  try { parsed = JSON.parse(result.text); } catch { return res.status(502).json({ error: "The explanation could not be safely parsed. Please try again." }); }
  const selected = found.rows.find(v => parsed.reference?.includes(v.chapter_number + ", Verse " + v.verse_number) || parsed.reference?.includes(v.chapter_number + "." + v.verse_number)) || found.rows[0];
  return res.json({
    title: parsed.title || "A teaching from the Bhagavad Gita",
    reference: "Bhagavad Gita " + selected.chapter_number + "." + selected.verse_number,
    sanskrit: selected.sanskrit,
    meaning: parsed.meaning || selected.translation_en,
    application: parsed.application || "",
    word_by_word: selected.word_by_word
  });
}
