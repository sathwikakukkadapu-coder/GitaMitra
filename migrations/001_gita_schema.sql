CREATE TABLE IF NOT EXISTS gita_verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_number INTEGER NOT NULL CHECK (chapter_number BETWEEN 1 AND 18),
  verse_number INTEGER NOT NULL CHECK (verse_number > 0),
  sanskrit TEXT NOT NULL,
  transliteration TEXT,
  translation_en TEXT,
  translation_hi TEXT,
  explanation TEXT,
  source_name TEXT,
  source_url TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (chapter_number, verse_number)
);
