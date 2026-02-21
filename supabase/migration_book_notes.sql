-- ============================================
-- jasonmoon.dev Book Notes (SQ3R) — Supabase Migration
-- ============================================

-- Requires pgcrypto (already enabled by main migration)

-- Book notes table
CREATE TABLE book_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  year INT,
  reading_period TEXT,
  cover_color TEXT DEFAULT '#818cf8',
  cover_emoji TEXT DEFAULT '📖',
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('reading', 'completed', 'planned')),
  rating INT CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  quote TEXT,
  sq3r JSONB DEFAULT '{}'::jsonb,
  permanent_notes TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Book comments table (public, no auth needed)
CREATE TABLE book_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES book_notes(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (block all direct table access)
ALTER TABLE book_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_comments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Admin password for book notes
-- ============================================
INSERT INTO admin_config (key, value)
VALUES ('book_admin_password_hash', crypt('9883', gen_salt('bf')));

-- ============================================
-- RPC Functions
-- ============================================

-- 1. List books (public — metadata only, no sq3r)
CREATE OR REPLACE FUNCTION list_books()
RETURNS TABLE (
  id UUID,
  title TEXT,
  author TEXT,
  year INT,
  reading_period TEXT,
  cover_color TEXT,
  cover_emoji TEXT,
  status TEXT,
  rating INT,
  quote TEXT,
  sort_order INT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT b.id, b.title, b.author, b.year, b.reading_period,
         b.cover_color, b.cover_emoji, b.status, b.rating, b.quote,
         b.sort_order, b.created_at
  FROM book_notes b
  ORDER BY b.sort_order ASC, b.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Get book detail (public — full row with sq3r)
CREATE OR REPLACE FUNCTION get_book_detail(p_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  author TEXT,
  year INT,
  reading_period TEXT,
  cover_color TEXT,
  cover_emoji TEXT,
  status TEXT,
  rating INT,
  quote TEXT,
  sq3r JSONB,
  permanent_notes TEXT[],
  sort_order INT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT b.id, b.title, b.author, b.year, b.reading_period,
         b.cover_color, b.cover_emoji, b.status, b.rating, b.quote,
         b.sq3r, b.permanent_notes, b.sort_order, b.created_at, b.updated_at
  FROM book_notes b
  WHERE b.id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Verify book admin password
CREATE OR REPLACE FUNCTION verify_book_admin(p_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_config ac
    WHERE ac.key = 'book_admin_password_hash'
    AND ac.value = crypt(p_password, ac.value)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create book note (admin-only)
CREATE OR REPLACE FUNCTION create_book_note(
  p_password TEXT,
  p_title TEXT,
  p_author TEXT,
  p_year INT DEFAULT NULL,
  p_reading_period TEXT DEFAULT NULL,
  p_cover_color TEXT DEFAULT '#818cf8',
  p_cover_emoji TEXT DEFAULT '📖',
  p_status TEXT DEFAULT 'planned',
  p_rating INT DEFAULT NULL,
  p_quote TEXT DEFAULT NULL,
  p_sq3r JSONB DEFAULT '{}'::jsonb,
  p_permanent_notes TEXT[] DEFAULT '{}',
  p_sort_order INT DEFAULT 0
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  -- Verify admin password
  IF NOT EXISTS (
    SELECT 1 FROM admin_config ac
    WHERE ac.key = 'book_admin_password_hash'
    AND ac.value = crypt(p_password, ac.value)
  ) THEN
    RETURN NULL;
  END IF;

  INSERT INTO book_notes (title, author, year, reading_period, cover_color, cover_emoji,
                          status, rating, quote, sq3r, permanent_notes, sort_order)
  VALUES (p_title, p_author, p_year, p_reading_period, p_cover_color, p_cover_emoji,
          p_status, p_rating, p_quote, p_sq3r, p_permanent_notes, p_sort_order)
  RETURNING book_notes.id INTO v_id;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Update book note (admin-only)
CREATE OR REPLACE FUNCTION update_book_note(
  p_password TEXT,
  p_id UUID,
  p_title TEXT DEFAULT NULL,
  p_author TEXT DEFAULT NULL,
  p_year INT DEFAULT NULL,
  p_reading_period TEXT DEFAULT NULL,
  p_cover_color TEXT DEFAULT NULL,
  p_cover_emoji TEXT DEFAULT NULL,
  p_status TEXT DEFAULT NULL,
  p_rating INT DEFAULT NULL,
  p_quote TEXT DEFAULT NULL,
  p_sq3r JSONB DEFAULT NULL,
  p_permanent_notes TEXT[] DEFAULT NULL,
  p_sort_order INT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Verify admin password
  IF NOT EXISTS (
    SELECT 1 FROM admin_config ac
    WHERE ac.key = 'book_admin_password_hash'
    AND ac.value = crypt(p_password, ac.value)
  ) THEN
    RETURN false;
  END IF;

  UPDATE book_notes SET
    title = COALESCE(p_title, title),
    author = COALESCE(p_author, author),
    year = COALESCE(p_year, year),
    reading_period = COALESCE(p_reading_period, reading_period),
    cover_color = COALESCE(p_cover_color, cover_color),
    cover_emoji = COALESCE(p_cover_emoji, cover_emoji),
    status = COALESCE(p_status, status),
    rating = COALESCE(p_rating, rating),
    quote = COALESCE(p_quote, quote),
    sq3r = COALESCE(p_sq3r, sq3r),
    permanent_notes = COALESCE(p_permanent_notes, permanent_notes),
    sort_order = COALESCE(p_sort_order, sort_order),
    updated_at = now()
  WHERE id = p_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. List book comments (public)
CREATE OR REPLACE FUNCTION list_book_comments(p_book_id UUID)
RETURNS TABLE (
  id UUID,
  author TEXT,
  content TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.author, c.content, c.created_at
  FROM book_comments c
  WHERE c.book_id = p_book_id
  ORDER BY c.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Add book comment (public, no password needed)
CREATE OR REPLACE FUNCTION add_book_comment(
  p_book_id UUID,
  p_author TEXT,
  p_content TEXT
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  -- Verify book exists
  IF NOT EXISTS (SELECT 1 FROM book_notes WHERE id = p_book_id) THEN
    RETURN NULL;
  END IF;

  INSERT INTO book_comments (book_id, author, content)
  VALUES (p_book_id, p_author, p_content)
  RETURNING book_comments.id INTO v_id;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Seed Data: "Lessons in Self-Esteem" (migrated from static page)
-- ============================================

SELECT create_book_note(
  '9883',
  'Lessons in Self-Esteem',
  'Yoon Honggyun',
  2024,
  'Jan 2026 — Present',
  '#10b981',
  '📗',
  'reading',
  5,
  'The goal isn''t the number of reads — it''s discovering sentences that hit differently each time.',
  '{
    "survey": {
      "text": "A transformative self-help book about building genuine self-esteem through repeated reading and internalization. The 100-Read Project: not about counting pages, but about letting each re-read reveal something new."
    },
    "question": {
      "items": [
        "Why do I keep hearing the voice that tears me down instead of the one that builds me up?",
        "Can reading the same book 100 times actually rewire how I see myself?",
        "What does it mean to end the day loving my imperfect self?"
      ]
    },
    "read": {
      "sessions": [
        {
          "round": 1,
          "date": "1/23",
          "sentence": "Grow the voice that supports you, not the one that torments you.",
          "change": "An old drawer opened — facing emotions I''d been avoiding",
          "note": "A book my wife casually handed me sent unexpected ripples through my daily life. With each page, it felt like opening old drawers one by one. The anxiety that had always lived inside me came into sharp focus. The author said I should be the one cheering on the version of me that struggles with low self-esteem. This isn''t a book you read once — I decided to read it at least 100 times."
        },
        {
          "round": 2,
          "date": "1/28",
          "sentence": "The entire \"Me, Here, Now\" chapter",
          "change": "Nights of self-punishment → ending the day with self-love",
          "note": "I used to spend all day living as someone with low self-esteem, then come home to an empty heart and punish myself. But now I end each day in conversation with the part of me that fully loves my imperfect self. I smile at myself, walk with confidence, and whisper words of encouragement — ending the day as if I were someone overflowing with self-worth."
        },
        {
          "round": 3,
          "date": "2/5",
          "sentence": "(I hugged the book)",
          "change": "Knowledge in my head started becoming action in my life",
          "note": "After the third read, knowledge stopped staying in my head and started showing up as natural behavioral changes. I offered heartfelt words to a struggling colleague. When my son asked me something, I immediately washed my hands and headed to the living room. My wife says my irritability has noticeably decreased."
        }
      ]
    },
    "recite": {
      "items": [
        "Self-esteem isn''t about being perfect — it''s about growing the supportive inner voice",
        "Repeated reading transforms knowledge into embodied behavior",
        "Ending each day with self-love instead of self-punishment changes everything"
      ]
    },
    "review": {
      "text": "Three reads in, and this book is already changing how I show up in daily life. The shift from intellectual understanding to behavioral change happened around the 3rd reading. The 100-Read Project continues — each pass reveals new layers."
    }
  }'::jsonb,
  ARRAY[
    'Self-esteem is built through daily practice, not sudden insight',
    'The voice you grow strongest is the one you hear most'
  ],
  1
);

-- Set the created_at to match when reading actually started
UPDATE book_notes SET created_at = '2026-01-23T00:00:00+09:00' WHERE title = 'Lessons in Self-Esteem';
