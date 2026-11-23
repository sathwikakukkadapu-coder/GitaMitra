CREATE TABLE IF NOT EXISTS gita_corpus (
  chapter_number INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  sanskrit TEXT NOT NULL,
  transliteration TEXT NOT NULL DEFAULT '',
  translation_en TEXT NOT NULL DEFAULT '',
  translation_hi TEXT NOT NULL DEFAULT '',
  translation_te TEXT NOT NULL DEFAULT '',
  word_by_word JSONB NOT NULL DEFAULT '[]'::jsonb,
  source_notes JSONB NOT NULL DEFAULT '{}'::jsonb,
  PRIMARY KEY (chapter_number, verse_number)
);
