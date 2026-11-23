-- 004_user_reading_progress.sql

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  name TEXT DEFAULT '',
  is_verified INTEGER DEFAULT 0,
  verification_code TEXT,
  verification_sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User reading progress table
CREATE TABLE IF NOT EXISTS user_reading_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_chapter INTEGER NOT NULL DEFAULT 1,
  current_verse INTEGER NOT NULL DEFAULT 1,
  completed_verses JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed_chapters JSONB NOT NULL DEFAULT '[]'::jsonb,
  bookmarks JSONB NOT NULL DEFAULT '[]'::jsonb,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User reading history table
CREATE TABLE IF NOT EXISTS user_reading_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  read_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(lower(email));
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_history_user_time ON user_reading_history(user_id, read_at DESC);
