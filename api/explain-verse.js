import { db, ai } from "hatchable";

export const access = "public";
export const methods = ["POST"];

export default async function (req, res) {
  const chapter = Number(req.body?.chapter);
  const verse = Number(req.body?.verse);
  const lang = req.body?.lang || "en";

  if (!Number.isInteger(chapter) || chapter < 1 || chapter > 18 || !Number.isInteger(verse) || verse < 1 || verse > 80) {
    return res.status(400).json({ error: "Please select a valid chapter (1-18) and verse." });
  }

  let found;
  try {
    found = await db.query(
      "SELECT chapter_number, verse_number, sanskrit, transliteration, translation_en, translation_hi, translation_te, word_by_word FROM gita_corpus WHERE chapter_number = $1 AND verse_number = $2 LIMIT 1",
      [chapter, verse]
    );
  } catch (dbErr) {
    console.error("Database query error:", dbErr);
  }

  if (!found || !found.rows || !found.rows.length) {
    return res.status(404).json({ error: "This verse is not present in the scripture collection." });
  }

  const v = found.rows[0];
  const translation = lang === "hi" ? v.translation_hi : (lang === "te" ? v.translation_te : v.translation_en);

  // Structured default educational explanation
  const structuredExplanation = {
    simpleMeaning: translation,
    detailedInterpretation: `Bhagavad Gita Chapter ${chapter}, Verse ${verse} presents a vital step in Krishna's dialogue with Arjuna. The verse emphasizes mindful duty and spiritual equanimity.`,
    context: `Set amidst the tension of the Kurukshetra battlefield, where Arjuna seeks refuge and guidance from Sri Krishna.`,
    philosophicalSignificance: `Affirms the eternal nature of the soul (Atman) and the transformative power of detached, dedicated action (Nishkama Karma).`,
    practicalApplication: `Focus on the quality and integrity of your current action rather than succumbing to anxiety over praise, blame, or future results.`,
    keyLesson: `Dedicate your work with sincerity; steady equanimity is the essence of true wisdom.`
  };

  // If AI is configured, enhance with real-time AI reflection
  if (ai && typeof ai.generateText === "function") {
    try {
      const result = await ai.generateText({
        purpose: "gita-verse-explanation",
        model: "gpt",
        maxTokens: 850,
        system: "You are an educational study companion for the Bhagavad Gita. Explain the supplied verse in 6 structured sections: simple meaning, detailed interpretation, dialogue context, philosophical significance, everyday application, and key lesson. Output valid JSON with keys: simpleMeaning, detailedInterpretation, context, philosophicalSignificance, practicalApplication, keyLesson. Do not claim to speak as Krishna.",
        prompt: `Explain Bhagavad Gita ${chapter}.${verse} in ${lang === "hi" ? "Hindi" : lang === "te" ? "Telugu" : "English"}.\nSanskrit: ${v.sanskrit}\nTransliteration: ${v.transliteration}\nTranslation: ${translation}`
      });
      if (result && result.text) {
        try {
          const parsed = JSON.parse(result.text);
          return res.json({
            chapter,
            verse,
            sanskrit: v.sanskrit,
            transliteration: v.transliteration,
            translation,
            word_by_word: v.word_by_word,
            explanation: parsed,
            isAiEnhanced: true
          });
        } catch (_) {}
      }
    } catch (aiErr) {
      // Gracefully fall back to structured explanation
    }
  }

  return res.json({
    chapter,
    verse,
    sanskrit: v.sanskrit,
    transliteration: v.transliteration,
    translation,
    word_by_word: v.word_by_word,
    explanation: structuredExplanation,
    isAiEnhanced: false
  });
}
