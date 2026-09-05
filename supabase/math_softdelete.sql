-- 삭제를 되돌릴 수 있게 — deleted_at 방식으로 전환
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['math_journal','math_posts','math_notes','math_records','math_files']
  LOOP
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ', t);
  END LOOP;
END $$;

-- 삭제 RPC를 soft delete로 교체
CREATE OR REPLACE FUNCTION math_journal_delete(p_pass TEXT, p_id UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM math_guard(p_pass);
  UPDATE math_journal SET deleted_at = now() WHERE id = p_id;
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions;

CREATE OR REPLACE FUNCTION math_post_delete(p_pass TEXT, p_id UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM math_guard(p_pass);
  UPDATE math_posts SET deleted_at = now() WHERE id = p_id;
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions;

CREATE OR REPLACE FUNCTION math_note_delete(p_pass TEXT, p_id UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM math_guard(p_pass);
  UPDATE math_notes SET deleted_at = now() WHERE id = p_id;
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions;

CREATE OR REPLACE FUNCTION math_record_delete(p_pass TEXT, p_id UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM math_guard(p_pass);
  UPDATE math_records SET deleted_at = now() WHERE id = p_id;
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions;

CREATE OR REPLACE FUNCTION math_file_delete(p_pass TEXT, p_id UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM math_guard(p_pass);
  UPDATE math_files SET deleted_at = now() WHERE id = p_id;
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions;

-- 복원
CREATE OR REPLACE FUNCTION math_restore(p_pass TEXT, p_table TEXT, p_id UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM math_guard(p_pass);
  IF p_table NOT IN ('math_journal','math_posts','math_notes','math_records','math_files') THEN
    RAISE EXCEPTION '허용되지 않은 테이블';
  END IF;
  EXECUTE format('UPDATE %I SET deleted_at = NULL WHERE id = $1', p_table) USING p_id;
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions;

GRANT EXECUTE ON FUNCTION math_restore TO anon, authenticated;

-- 통계는 살아있는 것만
CREATE OR REPLACE FUNCTION math_stats()
RETURNS JSON AS $$
  SELECT json_build_object(
    'done',        (SELECT count(*) FROM math_progress WHERE status = 'done'),
    'doing',       (SELECT count(*) FROM math_progress WHERE status = 'doing'),
    'records',     (SELECT count(*) FROM math_records  WHERE deleted_at IS NULL),
    'journals',    (SELECT count(*) FROM math_journal  WHERE deleted_at IS NULL),
    'posts',       (SELECT count(*) FROM math_posts    WHERE deleted_at IS NULL),
    'notes',       (SELECT count(*) FROM math_notes    WHERE deleted_at IS NULL),
    'files',       (SELECT count(*) FROM math_files    WHERE deleted_at IS NULL),
    'trash',       (SELECT (SELECT count(*) FROM math_journal WHERE deleted_at IS NOT NULL)
                         + (SELECT count(*) FROM math_posts   WHERE deleted_at IS NOT NULL)
                         + (SELECT count(*) FROM math_notes   WHERE deleted_at IS NOT NULL)
                         + (SELECT count(*) FROM math_records WHERE deleted_at IS NOT NULL)
                         + (SELECT count(*) FROM math_files   WHERE deleted_at IS NOT NULL)),
    'prep_ready',  (SELECT count(*) FROM math_prep WHERE status IN ('ready','taught')),
    'prep_draft',  (SELECT count(*) FROM math_prep WHERE status = 'drafting'),
    'prep_taught', (SELECT count(*) FROM math_prep WHERE status = 'taught'),
    'last_date',   (SELECT max(session_date) FROM math_records WHERE deleted_at IS NULL)
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;
GRANT EXECUTE ON FUNCTION math_stats TO anon, authenticated;
