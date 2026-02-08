-- ============================================
-- jasonmoon.dev Board — Supabase Migration
-- ============================================

-- Enable pgcrypto for bcrypt password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Admin config (stores hashed admin password)
CREATE TABLE admin_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Insert admin password hash (bcrypt)
INSERT INTO admin_config (key, value)
VALUES ('admin_password_hash', crypt('rnrud9881@@HH', gen_salt('bf')));

-- Inquiries table
CREATE TABLE inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  content TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Comments table
CREATE TABLE inquiry_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inquiry_id UUID REFERENCES inquiries(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (block all direct table access)
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiry_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

-- No policies = all direct access blocked
-- All access goes through SECURITY DEFINER RPC functions

-- ============================================
-- RPC Functions (SECURITY DEFINER = runs as owner, bypasses RLS)
-- ============================================

-- List inquiries (public — only title, name, date)
CREATE OR REPLACE FUNCTION list_inquiries()
RETURNS TABLE (
  id UUID,
  title TEXT,
  name TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT i.id, i.title, i.name, i.created_at
  FROM inquiries i
  ORDER BY i.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify password and return full inquiry
CREATE OR REPLACE FUNCTION verify_inquiry(p_id UUID, p_password TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  name TEXT,
  email TEXT,
  phone TEXT,
  content TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT i.id, i.title, i.name, i.email, i.phone, i.content, i.created_at
  FROM inquiries i
  WHERE i.id = p_id
  AND (
    i.password_hash = crypt(p_password, i.password_hash)
    OR EXISTS (
      SELECT 1 FROM admin_config ac
      WHERE ac.key = 'admin_password_hash'
      AND ac.value = crypt(p_password, ac.value)
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new inquiry
CREATE OR REPLACE FUNCTION create_inquiry(
  p_title TEXT,
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_content TEXT,
  p_password TEXT
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO inquiries (title, name, email, phone, content, password_hash)
  VALUES (p_title, p_name, p_email, p_phone, p_content, crypt(p_password, gen_salt('bf')))
  RETURNING inquiries.id INTO v_id;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get comments (requires password)
CREATE OR REPLACE FUNCTION get_inquiry_comments(p_inquiry_id UUID, p_password TEXT)
RETURNS TABLE (
  id UUID,
  author TEXT,
  content TEXT,
  is_admin BOOLEAN,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  -- Verify password first
  IF NOT EXISTS (
    SELECT 1 FROM inquiries i
    WHERE i.id = p_inquiry_id
    AND (
      i.password_hash = crypt(p_password, i.password_hash)
      OR EXISTS (
        SELECT 1 FROM admin_config ac
        WHERE ac.key = 'admin_password_hash'
        AND ac.value = crypt(p_password, ac.value)
      )
    )
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT c.id, c.author, c.content, c.is_admin, c.created_at
  FROM inquiry_comments c
  WHERE c.inquiry_id = p_inquiry_id
  ORDER BY c.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment (requires password)
CREATE OR REPLACE FUNCTION add_inquiry_comment(
  p_inquiry_id UUID,
  p_password TEXT,
  p_author TEXT,
  p_content TEXT
)
RETURNS UUID AS $$
DECLARE
  v_is_admin BOOLEAN := false;
  v_comment_id UUID;
BEGIN
  -- Check admin password
  IF EXISTS (
    SELECT 1 FROM admin_config ac
    WHERE ac.key = 'admin_password_hash'
    AND ac.value = crypt(p_password, ac.value)
  ) THEN
    v_is_admin := true;
  -- Check post password
  ELSIF NOT EXISTS (
    SELECT 1 FROM inquiries i
    WHERE i.id = p_inquiry_id
    AND i.password_hash = crypt(p_password, i.password_hash)
  ) THEN
    RETURN NULL;
  END IF;

  INSERT INTO inquiry_comments (inquiry_id, author, content, is_admin)
  VALUES (p_inquiry_id, p_author, p_content, v_is_admin)
  RETURNING inquiry_comments.id INTO v_comment_id;

  RETURN v_comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Seed Data (Historical inquiries from Oct 2025)
-- ============================================

SELECT create_inquiry(
  'AI-Powered Learning Platform',
  'Park J.',
  NULL, NULL,
  'Looking for a developer to build an adaptive learning platform with AI tutoring capabilities.',
  'seed2025'
);
UPDATE inquiries SET created_at = '2025-10-12T09:00:00+09:00' WHERE title = 'AI-Powered Learning Platform';

SELECT create_inquiry(
  'Chrome Extension Development',
  'Kim S.',
  NULL, NULL,
  'Need a Chrome extension for productivity tracking with cross-tab sync.',
  'seed2025'
);
UPDATE inquiries SET created_at = '2025-11-03T14:30:00+09:00' WHERE title = 'Chrome Extension Development';

SELECT create_inquiry(
  'Investment Dashboard with AI Agents',
  'Lee M.',
  NULL, NULL,
  'Want to build a multi-agent stock analysis dashboard with real-time data.',
  'seed2025'
);
UPDATE inquiries SET created_at = '2025-12-08T11:00:00+09:00' WHERE title = 'Investment Dashboard with AI Agents';

SELECT create_inquiry(
  'Education Platform Prototype',
  'Choi Y.',
  NULL, NULL,
  'Building a prototype for an English learning platform with AI sentence correction.',
  'seed2025'
);
UPDATE inquiries SET created_at = '2026-01-15T16:00:00+09:00' WHERE title = 'Education Platform Prototype';

SELECT create_inquiry(
  'Enterprise Decision System Demo',
  'Hong D.',
  NULL, NULL,
  'Need a demo for an enterprise multi-agent decision-making system.',
  'seed2025'
);
UPDATE inquiries SET created_at = '2026-02-01T10:00:00+09:00' WHERE title = 'Enterprise Decision System Demo';
