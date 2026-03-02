-- ============================================
-- jasonmoon.dev — Cloudflare D1 Migration
-- Converted from Supabase PostgreSQL to SQLite
-- ============================================

-- Admin config (stores hashed admin password)
CREATE TABLE IF NOT EXISTS admin_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  content TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Inquiry comments table
CREATE TABLE IF NOT EXISTS inquiry_comments (
  id TEXT PRIMARY KEY,
  inquiry_id TEXT NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  is_admin INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Book notes table
CREATE TABLE IF NOT EXISTS book_notes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  year INTEGER,
  reading_period TEXT,
  cover_color TEXT DEFAULT '#818cf8',
  cover_emoji TEXT DEFAULT '📖',
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('reading', 'completed', 'planned')),
  rating INTEGER CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  quote TEXT,
  sq3r TEXT DEFAULT '{}',
  permanent_notes TEXT DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Book comments table
CREATE TABLE IF NOT EXISTS book_comments (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES book_notes(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'insight',
  created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================
-- Seed: Admin passwords (SHA-256 hashed)
-- These will be set via API or wrangler secret
-- ============================================

-- Seed: Sample inquiries
INSERT OR IGNORE INTO inquiries (id, title, name, content, password_hash, created_at) VALUES
  ('seed-1', 'AI-Powered Learning Platform', 'Park J.', 'Looking for a developer to build an adaptive learning platform with AI tutoring capabilities.', '', '2025-10-12T09:00:00'),
  ('seed-2', 'Chrome Extension Development', 'Kim S.', 'Need a Chrome extension for productivity tracking with cross-tab sync.', '', '2025-11-03T14:30:00'),
  ('seed-3', 'Investment Dashboard with AI Agents', 'Lee M.', 'Want to build a multi-agent stock analysis dashboard with real-time data.', '', '2025-12-08T11:00:00'),
  ('seed-4', 'Education Platform Prototype', 'Choi Y.', 'Building a prototype for an English learning platform with AI sentence correction.', '', '2026-01-15T16:00:00'),
  ('seed-5', 'Enterprise Decision System Demo', 'Hong D.', 'Need a demo for an enterprise multi-agent decision-making system.', '', '2026-02-01T10:00:00');
