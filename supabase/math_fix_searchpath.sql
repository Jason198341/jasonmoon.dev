-- pgcrypto가 extensions 스키마에 있어 search_path에 추가
CREATE OR REPLACE FUNCTION math_check(p_pass TEXT)
RETURNS BOOLEAN AS $$
DECLARE h TEXT;
BEGIN
  SELECT value INTO h FROM math_config WHERE key = 'passcode_hash';
  RETURN h IS NOT NULL AND h = crypt(p_pass, h);
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions;

CREATE OR REPLACE FUNCTION math_guard(p_pass TEXT) RETURNS VOID AS $$
BEGIN
  IF NOT math_check(p_pass) THEN
    RAISE EXCEPTION '패스코드가 올바르지 않습니다';
  END IF;
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions;

CREATE OR REPLACE FUNCTION math_passcode_change(p_old TEXT, p_new TEXT)
RETURNS VOID AS $$
BEGIN
  PERFORM math_guard(p_old);
  UPDATE math_config SET value = crypt(p_new, gen_salt('bf')) WHERE key = 'passcode_hash';
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions;

-- 나머지 쓰기 RPC도 동일 적용
DO $$
DECLARE f TEXT;
BEGIN
  FOREACH f IN ARRAY ARRAY[
    'math_progress_set(text,text,text,integer)',
    'math_record_add(text,text,date,text,text,text,integer,text,text[])',
    'math_record_delete(text,uuid)',
    'math_journal_add(text,date,text,text,text,text[])',
    'math_journal_delete(text,uuid)',
    'math_post_add(text,text,text,text,text,text)',
    'math_post_delete(text,uuid)',
    'math_comment_add(text,uuid,text,text)',
    'math_note_save(text,uuid,text,text,text,text,text[])',
    'math_note_delete(text,uuid)',
    'math_file_add(text,text,text,text,text,bigint,text,text,text)',
    'math_file_delete(text,uuid)']
  LOOP
    EXECUTE format('ALTER FUNCTION %s SET search_path = public, extensions', f);
  END LOOP;
END $$;

-- 패스코드 해시가 제대로 들어갔는지 재설정 (멱등)
UPDATE math_config SET value = crypt('rnrud9881@@HH', gen_salt('bf'))
 WHERE key = 'passcode_hash';
