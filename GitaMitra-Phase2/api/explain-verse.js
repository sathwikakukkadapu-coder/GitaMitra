import { db, ai } from "hatchable";

export const access = "public";
export const methods = ["POST"];

export default async function (req, res) {
  const chapter = Number(req.body?.chapter);
  const verse = Number(req.body?.verse);
  if (!Number.isInteger(chapter) || chapter < 1 || chapter > 18 || !Number.isInteger(verse) || verse < 1 || verse > 80) {
    return res.status(400).json({ error: "Please select a valid chapter and verse." });
  }
  const found = await db.query(
    "SELECT chapter_number, verse_number, sanskrit, transliteration, translation_en, word_by_word FROM gita_corpus WHERE chapter_number = $1 AND verse_number = $2 LIMIT 1",
    [chapter, verse]
  );
  if (!found.rows.length) return res.status(404).json({ error: "This verse is not present in the scripture collection." });
  const v = found.rows[0];
  let result;
  try {
    result = await ai.generateText({
      purpose: "gita-verse-explanation",
      model: "gpt",
      maxTokens: 850,
      system: "You are an educational study companion for the Bhagavad Gita. Explain only the supplied verse. Use the supplied translation and word meanings; do not invent Sanskrit, quote other verses, or present your explanation as a traditional commentary. Write a clear, balanced explanation in 2–4 short paragraphs, explain key terms and the verse's immediate idea, and mention that interpretations can differ among traditions. Do not claim to speak as Krishna.",
      prompt: "Explain Bhagavad Gita " + chapter + "." + verse + " for a beginner.\nSanskrit: " + v.sanskrit + "\nTransliteration: " + v.transliteration + "\nEnglish translation: " + v.translation_en + "\nWord-by-word glosses: " + (v.word_by_word || []).join("; ") + "\nReturn the explanation only."
    });
  } catch (err) {
    return res.status(503).json({ error: "The verse and word meanings are available. Connect an OpenAI provider in the GitaMitra project Setup to enable detailed AI explanations." });
  }
  if (result.finishReason === "length") return res.status(502).json({ error: "The explanation was incomplete. Please try again." });
  return res.json({ chapter, verse, explanation: result.text });
}
