-- math-bible 버킷: 공개 읽기 + anon 업로드 허용 (삭제는 service_role만)
DROP POLICY IF EXISTS math_bible_read   ON storage.objects;
DROP POLICY IF EXISTS math_bible_insert ON storage.objects;

CREATE POLICY math_bible_read ON storage.objects
  FOR SELECT USING (bucket_id = 'math-bible');

CREATE POLICY math_bible_insert ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'math-bible');
