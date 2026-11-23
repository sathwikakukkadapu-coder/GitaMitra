-- Chapters table
CREATE TABLE IF NOT EXISTS chapters (
  chapter_number INTEGER PRIMARY KEY CHECK (chapter_number BETWEEN 1 AND 18),
  name_sa TEXT NOT NULL,
  name_translit TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  name_te TEXT NOT NULL,
  summary_en TEXT NOT NULL,
  summary_hi TEXT NOT NULL,
  summary_te TEXT NOT NULL,
  verse_count INTEGER NOT NULL
);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_number INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT DEFAULT '',
  UNIQUE (chapter_number, verse_number)
);

-- Reading History table
CREATE TABLE IF NOT EXISTS reading_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_number INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  read_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  pref_key TEXT PRIMARY KEY,
  pref_value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gita_corpus_chapter ON gita_corpus(chapter_number);
CREATE INDEX IF NOT EXISTS idx_gita_corpus_verse ON gita_corpus(chapter_number, verse_number);
CREATE INDEX IF NOT EXISTS idx_history_read_at ON reading_history(read_at DESC);
