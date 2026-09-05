-- ============================================================
-- 아빠 예습(Prep) — 제1원칙 기반 설명 대본 작성
-- ============================================================

CREATE TABLE IF NOT EXISTS math_prep (
  concept_id  TEXT PRIMARY KEY,
  status      TEXT NOT NULL DEFAULT 'todo'
              CHECK (status IN ('todo','drafting','ready','taught')),

  -- 제1원칙 프로토콜 (deepexplain 구조 그대로)
  axioms      TEXT,   -- ① 출발점: 이 설명이 전제하는 공리·사실
  atoms       TEXT,   -- ② 원자 분해: 정의되지 않은 용어 없게
  chain       TEXT,   -- ③ 인과 사슬: A이므로 B, 매 단계 왜
  mechanism   TEXT,   -- ④ 메커니즘: 어떻게 작동하는가
  boundary    TEXT,   -- ⑤ 경계: 언제 성립하고 언제 깨지는가
  analogy     TEXT,   -- 비유 + 이 비유가 깨지는 지점
  script      TEXT,   -- 실제 말할 대본 (통짜)
  questions   TEXT,   -- 아이에게 던질 확인 질문
  props       TEXT,   -- 준비물·교구
  ai_notes    TEXT,   -- AI와 함께 짠 메모·초안

  est_minutes INT,
  checklist   JSONB NOT NULL DEFAULT '{}'::jsonb,  -- 자기점검 7항목
  taught_at   DATE,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE math_prep ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS math_prep_read ON math_prep;
CREATE POLICY math_prep_read ON math_prep FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION math_prep_save(
  p_pass TEXT, p_concept_id TEXT, p_status TEXT,
  p_axioms TEXT, p_atoms TEXT, p_chain TEXT, p_mechanism TEXT,
  p_boundary TEXT, p_analogy TEXT, p_script TEXT, p_questions TEXT,
  p_props TEXT, p_ai_notes TEXT, p_est_minutes INT, p_checklist JSONB
) RETURNS VOID AS $$
BEGIN
  PERFORM math_guard(p_pass);
  INSERT INTO math_prep (concept_id, status, axioms, atoms, chain, mechanism,
    boundary, analogy, script, questions, props, ai_notes, est_minutes,
    checklist, taught_at, updated_at)
  VALUES (p_concept_id, COALESCE(p_status,'todo'), p_axioms, p_atoms, p_chain,
    p_mechanism, p_boundary, p_analogy, p_script, p_questions, p_props,
    p_ai_notes, p_est_minutes, COALESCE(p_checklist,'{}'::jsonb),
    CASE WHEN p_status = 'taught' THEN CURRENT_DATE ELSE NULL END, now())
  ON CONFLICT (concept_id) DO UPDATE SET
    status = EXCLUDED.status, axioms = EXCLUDED.axioms, atoms = EXCLUDED.atoms,
    chain = EXCLUDED.chain, mechanism = EXCLUDED.mechanism,
    boundary = EXCLUDED.boundary, analogy = EXCLUDED.analogy,
    script = EXCLUDED.script, questions = EXCLUDED.questions,
    props = EXCLUDED.props, ai_notes = EXCLUDED.ai_notes,
    est_minutes = EXCLUDED.est_minutes, checklist = EXCLUDED.checklist,
    taught_at = COALESCE(EXCLUDED.taught_at, math_prep.taught_at),
    updated_at = now();
END $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions;

GRANT EXECUTE ON FUNCTION math_prep_save TO anon, authenticated;

-- 통계에 예습 현황 추가
CREATE OR REPLACE FUNCTION math_stats()
RETURNS JSON AS $$
  SELECT json_build_object(
    'done',        (SELECT count(*) FROM math_progress WHERE status = 'done'),
    'doing',       (SELECT count(*) FROM math_progress WHERE status = 'doing'),
    'records',     (SELECT count(*) FROM math_records),
    'journals',    (SELECT count(*) FROM math_journal),
    'posts',       (SELECT count(*) FROM math_posts),
    'notes',       (SELECT count(*) FROM math_notes),
    'files',       (SELECT count(*) FROM math_files),
    'prep_ready',  (SELECT count(*) FROM math_prep WHERE status IN ('ready','taught')),
    'prep_draft',  (SELECT count(*) FROM math_prep WHERE status = 'drafting'),
    'prep_taught', (SELECT count(*) FROM math_prep WHERE status = 'taught'),
    'last_date',   (SELECT max(session_date) FROM math_records)
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;
GRANT EXECUTE ON FUNCTION math_stats TO anon, authenticated;
