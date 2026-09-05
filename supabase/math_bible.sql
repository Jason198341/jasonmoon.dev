-- ============================================================
-- 수학 바이블 (jasonmoon.dev) — Supabase 스키마
-- 접두사 math_ 로 기존 shiplink 테이블과 완전 분리
-- 읽기: 공개(anon SELECT) / 쓰기: SECURITY DEFINER RPC + 패스코드
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------- 설정(패스코드) ----------
CREATE TABLE IF NOT EXISTS math_config (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT INTO math_config (key, value)
VALUES ('passcode_hash', crypt('rnrud9881@@HH', gen_salt('bf')))
ON CONFLICT (key) DO NOTHING;

-- ---------- 개념별 진행 상태 ----------
CREATE TABLE IF NOT EXISTS math_progress (
  concept_id    TEXT PRIMARY KEY,
  status        TEXT NOT NULL DEFAULT 'todo'
                CHECK (status IN ('todo','doing','done')),
  mastery       INT  NOT NULL DEFAULT 0 CHECK (mastery BETWEEN 0 AND 5),
  last_reviewed DATE,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- 백지 훈련 기록 ----------
CREATE TABLE IF NOT EXISTS math_records (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id   TEXT NOT NULL,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  who          TEXT NOT NULL DEFAULT '딸',
  blank_before TEXT,          -- 백지에 먼저 쓴 것 (설명 전)
  blank_after  TEXT,          -- 설명 후 다시 쓴 것
  self_score   INT CHECK (self_score BETWEEN 0 AND 5),
  note         TEXT,          -- 아빠 관찰
  images       TEXT[] DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_math_records_concept ON math_records(concept_id);
CREATE INDEX IF NOT EXISTS idx_math_records_date    ON math_records(session_date DESC);

-- ---------- 일지 ----------
CREATE TABLE IF NOT EXISTS math_journal (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  mood        TEXT,
  concept_ids TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_math_journal_date ON math_journal(entry_date DESC);

-- ---------- 게시판 ----------
CREATE TABLE IF NOT EXISTS math_posts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category   TEXT NOT NULL DEFAULT 'thought'
             CHECK (category IN ('thought','feedback','question','notice')),
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  author     TEXT NOT NULL DEFAULT '아빠',
  concept_id TEXT,
  pinned     BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_math_posts_cat  ON math_posts(category, created_at DESC);

CREATE TABLE IF NOT EXISTS math_comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID NOT NULL REFERENCES math_posts(id) ON DELETE CASCADE,
  author     TEXT NOT NULL,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_math_comments_post ON math_comments(post_id, created_at);

-- ---------- 강의 노트 ----------
CREATE TABLE IF NOT EXISTS math_notes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id TEXT,
  lv         TEXT,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,          -- markdown
  tags       TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_math_notes_concept ON math_notes(concept_id);

-- ---------- 자료실(숙제/파일) ----------
CREATE TABLE IF NOT EXISTS math_files (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  category     TEXT NOT NULL DEFAULT 'material'
               CHECK (category IN ('homework','material','photo','worksheet')),
  storage_path TEXT NOT NULL,
  mime         TEXT,
  size_bytes   BIGINT,
  concept_id   TEXT,
  uploaded_by  TEXT NOT NULL DEFAULT '아빠',
  note         TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_math_files_cat ON math_files(category, created_at DESC);

-- ============================================================
-- RLS: 읽기 공개, 쓰기 차단 (쓰기는 아래 RPC로만)
-- ============================================================
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['math_progress','math_records','math_journal',
                           'math_posts','math_comments','math_notes','math_files']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t||'_read', t);
    EXECUTE format('CREATE POLICY %I ON %I FOR SELECT USING (true)', t||'_read', t);
  END LOOP;
END $$;

ALTER TABLE math_config ENABLE ROW LEVEL SECURITY;  -- 정책 없음 = 완전 차단

-- ============================================================
-- 패스코드 검증
-- ============================================================
CREATE OR REPLACE FUNCTION math_check(p_pass TEXT)
RETURNS BOOLEAN AS $$
DECLARE h TEXT;
BEGIN
  SELECT value INTO h FROM math_config WHERE key = 'passcode_hash';
  RETURN h IS NOT NULL AND h = crypt(p_pass, h);
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION math_guard(p_pass TEXT) RETURNS VOID AS $$
BEGIN
  IF NOT math_check(p_pass) THEN
    RAISE EXCEPTION '패스코드가 올바르지 않습니다';
  END IF;
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- 쓰기 RPC
-- ============================================================

-- 진행 상태
CREATE OR REPLACE FUNCTION math_progress_set(
  p_pass TEXT, p_concept_id TEXT, p_status TEXT, p_mastery INT
) RETURNS VOID AS $$
BEGIN
  PERFORM math_guard(p_pass);
  INSERT INTO math_progress (concept_id, status, mastery, last_reviewed, updated_at)
  VALUES (p_concept_id, p_status, p_mastery, CURRENT_DATE, now())
  ON CONFLICT (concept_id) DO UPDATE
    SET status = EXCLUDED.status, mastery = EXCLUDED.mastery,
        last_reviewed = CURRENT_DATE, updated_at = now();
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 백지 기록
CREATE OR REPLACE FUNCTION math_record_add(
  p_pass TEXT, p_concept_id TEXT, p_session_date DATE, p_who TEXT,
  p_blank_before TEXT, p_blank_after TEXT, p_self_score INT,
  p_note TEXT, p_images TEXT[]
) RETURNS UUID AS $$
DECLARE new_id UUID;
BEGIN
  PERFORM math_guard(p_pass);
  INSERT INTO math_records (concept_id, session_date, who, blank_before,
                            blank_after, self_score, note, images)
  VALUES (p_concept_id, COALESCE(p_session_date, CURRENT_DATE),
          COALESCE(p_who,'딸'), p_blank_before, p_blank_after,
          p_self_score, p_note, COALESCE(p_images,'{}'))
  RETURNING id INTO new_id;
  RETURN new_id;
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION math_record_delete(p_pass TEXT, p_id UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM math_guard(p_pass);
  DELETE FROM math_records WHERE id = p_id;
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 일지
CREATE OR REPLACE FUNCTION math_journal_add(
  p_pass TEXT, p_entry_date DATE, p_title TEXT, p_body TEXT,
  p_mood TEXT, p_concept_ids TEXT[]
) RETURNS UUID AS $$
DECLARE new_id UUID;
BEGIN
  PERFORM math_guard(p_pass);
  INSERT INTO math_journal (entry_date, title, body, mood, concept_ids)
  VALUES (COALESCE(p_entry_date, CURRENT_DATE), p_title, p_body,
          p_mood, COALESCE(p_concept_ids,'{}'))
  RETURNING id INTO new_id;
  RETURN new_id;
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION math_journal_delete(p_pass TEXT, p_id UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM math_guard(p_pass);
  DELETE FROM math_journal WHERE id = p_id;
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 게시판
CREATE OR REPLACE FUNCTION math_post_add(
  p_pass TEXT, p_category TEXT, p_title TEXT, p_body TEXT,
  p_author TEXT, p_concept_id TEXT
) RETURNS UUID AS $$
DECLARE new_id UUID;
BEGIN
  PERFORM math_guard(p_pass);
  INSERT INTO math_posts (category, title, body, author, concept_id)
  VALUES (COALESCE(p_category,'thought'), p_title, p_body,
          COALESCE(p_author,'아빠'), p_concept_id)
  RETURNING id INTO new_id;
  RETURN new_id;
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION math_post_delete(p_pass TEXT, p_id UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM math_guard(p_pass);
  DELETE FROM math_posts WHERE id = p_id;
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION math_comment_add(
  p_pass TEXT, p_post_id UUID, p_author TEXT, p_body TEXT
) RETURNS UUID AS $$
DECLARE new_id UUID;
BEGIN
  PERFORM math_guard(p_pass);
  INSERT INTO math_comments (post_id, author, body)
  VALUES (p_post_id, COALESCE(p_author,'익명'), p_body)
  RETURNING id INTO new_id;
  RETURN new_id;
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 강의 노트
CREATE OR REPLACE FUNCTION math_note_save(
  p_pass TEXT, p_id UUID, p_concept_id TEXT, p_lv TEXT,
  p_title TEXT, p_body TEXT, p_tags TEXT[]
) RETURNS UUID AS $$
DECLARE new_id UUID;
BEGIN
  PERFORM math_guard(p_pass);
  IF p_id IS NULL THEN
    INSERT INTO math_notes (concept_id, lv, title, body, tags)
    VALUES (p_concept_id, p_lv, p_title, p_body, COALESCE(p_tags,'{}'))
    RETURNING id INTO new_id;
  ELSE
    UPDATE math_notes
       SET concept_id = p_concept_id, lv = p_lv, title = p_title,
           body = p_body, tags = COALESCE(p_tags,'{}'), updated_at = now()
     WHERE id = p_id
    RETURNING id INTO new_id;
  END IF;
  RETURN new_id;
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION math_note_delete(p_pass TEXT, p_id UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM math_guard(p_pass);
  DELETE FROM math_notes WHERE id = p_id;
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 자료실
CREATE OR REPLACE FUNCTION math_file_add(
  p_pass TEXT, p_title TEXT, p_category TEXT, p_storage_path TEXT,
  p_mime TEXT, p_size BIGINT, p_concept_id TEXT,
  p_uploaded_by TEXT, p_note TEXT
) RETURNS UUID AS $$
DECLARE new_id UUID;
BEGIN
  PERFORM math_guard(p_pass);
  INSERT INTO math_files (title, category, storage_path, mime, size_bytes,
                          concept_id, uploaded_by, note)
  VALUES (p_title, COALESCE(p_category,'material'), p_storage_path, p_mime,
          p_size, p_concept_id, COALESCE(p_uploaded_by,'아빠'), p_note)
  RETURNING id INTO new_id;
  RETURN new_id;
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION math_file_delete(p_pass TEXT, p_id UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM math_guard(p_pass);
  DELETE FROM math_files WHERE id = p_id;
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 패스코드 변경
CREATE OR REPLACE FUNCTION math_passcode_change(p_old TEXT, p_new TEXT)
RETURNS VOID AS $$
BEGIN
  PERFORM math_guard(p_old);
  UPDATE math_config SET value = crypt(p_new, gen_salt('bf'))
   WHERE key = 'passcode_hash';
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ---------- 대시보드 통계 ----------
CREATE OR REPLACE FUNCTION math_stats()
RETURNS JSON AS $$
  SELECT json_build_object(
    'done',       (SELECT count(*) FROM math_progress WHERE status = 'done'),
    'doing',      (SELECT count(*) FROM math_progress WHERE status = 'doing'),
    'records',    (SELECT count(*) FROM math_records),
    'journals',   (SELECT count(*) FROM math_journal),
    'posts',      (SELECT count(*) FROM math_posts),
    'notes',      (SELECT count(*) FROM math_notes),
    'files',      (SELECT count(*) FROM math_files),
    'last_date',  (SELECT max(session_date) FROM math_records)
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- 권한
GRANT EXECUTE ON FUNCTION math_check, math_stats TO anon, authenticated;
GRANT EXECUTE ON FUNCTION math_progress_set, math_record_add, math_record_delete,
  math_journal_add, math_journal_delete, math_post_add, math_post_delete,
  math_comment_add, math_note_save, math_note_delete, math_file_add,
  math_file_delete, math_passcode_change TO anon, authenticated;
REVOKE EXECUTE ON FUNCTION math_guard(TEXT) FROM anon, authenticated;
