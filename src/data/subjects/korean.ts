/**
 * 국어 — 직조(織造) 구조
 *
 * ⚠️ 수학의 "지도"를 쓰지 않는다.
 *    수학 지도의 힘은 "여기 뚫려 있으면 저 위로 못 간다"는 차단 정보인데,
 *    국어 텍스트에는 차단이 없다. 「소나기」를 안 읽어도 다른 글을 읽는 데 지장 없다.
 *    차단 없는 곳에 지도를 그리면 아이에게 잘못된 부채감만 남는다.
 *
 * 대신 세 층이 교차한다:
 *   A. 텍스트(씨줄) — 일회적, 순서 없음        → 책장으로 쌓인다
 *   B. 렌즈(날줄)   — 나선형, 졸업 없음        → 레이더로 추이를 본다
 *   C. 재료         — 누적, 약한 위계          → 낱말 성좌
 *
 * 학습의 실체 = 교차점(Session) = "텍스트 × 렌즈".
 * 같은 렌즈를 다른 텍스트에 대는 것이 나선형 반복이다.
 */

/* ============================================================
   B. 렌즈 — 읽고 쓰는 행위. 2022 개정 6영역에 매핑
   ============================================================ */
export type LensArea =
  | 'read' | 'lit' | 'write' | 'grammar' | 'speak' | 'media';

export const LENS_AREA_LABEL: Record<LensArea, string> = {
  read: '읽기', lit: '문학', write: '쓰기',
  grammar: '문법', speak: '듣기·말하기', media: '매체',
};

export interface Lens {
  id: string;
  name: string;
  area: LensArea;
  /** 이 렌즈로 무엇을 하는가 — 한 문장 */
  what: string;
  /** 통과했다고 보는 기준. 애매하면 이 렌즈는 못 쓴다 */
  pass: string;
}

/** 렌즈 20개. 난이도는 오르되 목록 자체는 12년 내내 같다 */
export const LENSES: Lens[] = [
  { id: 'genre', name: '갈래 판정', area: 'read',
    what: '이 글이 무슨 종류인지 알아보고 근거를 댄다.',
    pass: '갈래를 맞히고, 그렇게 본 근거를 글 안에서 지목한다.' },
  { id: 'gist', name: '중심 생각 한 문장', area: 'read',
    what: '글 전체를 30자 이내로 줄인다.',
    pass: '원문 문장을 그대로 베끼지 않고 자기 말로 쓴다.' },
  { id: 'para-role', name: '단락 역할 라벨링', area: 'read',
    what: '단락마다 무슨 일을 하는지(도입·주장·근거·반론·마무리) 이름 붙인다.',
    pass: '단락 수만큼 라벨을 달고 하나도 「그냥 설명」으로 도망가지 않는다.' },
  { id: 'infer', name: '생략된 정보 추론', area: 'read',
    what: '글에 안 쓰여 있지만 알 수 있는 것을 말한다.',
    pass: '추론과 상상을 구분한다. 근거가 되는 문장을 댈 수 있다.' },
  { id: 'evidence', name: '근거 지목', area: 'read',
    what: '"왜 그렇게 생각해?"에 몇 번째 문장인지 손가락으로 짚는다.',
    pass: '문단·문장 번호를 정확히 댄다. ★ 이 렌즈가 국어 검증의 핵심.' },
  { id: 'fact-opinion', name: '사실과 의견 분리', area: 'read',
    what: '확인할 수 있는 것과 글쓴이 생각을 갈라낸다.',
    pass: '섞여 있는 문장에서도 갈라낸다.' },
  { id: 'unknown-word', name: '어려운 낱말 뚫기', area: 'read',
    what: '모르는 낱말의 뜻을 앞뒤 문맥과 한자로 추측한다.',
    pass: '사전 없이 추측하고, 나중에 확인해서 맞았는지 스스로 채점한다.' },

  { id: 'feeling-arc', name: '인물의 마음 변화 추적', area: 'lit',
    what: '인물의 마음이 언제 어떻게 바뀌었는지 짚는다.',
    pass: '바뀌는 지점의 문장을 지목한다.' },
  { id: 'pov', name: '시점 바꿔 보기', area: 'lit',
    what: '다른 인물의 눈으로 같은 장면을 본다.',
    pass: '그 인물이 모를 정보를 빼고 쓴다.' },
  { id: 'image', name: '심상·비유 포착', area: 'lit',
    what: '무엇을 무엇에 빗댔는지, 왜 그렇게 빗댔는지 말한다.',
    pass: '"예쁘다"로 끝내지 않고 빗댄 이유를 댄다.' },
  { id: 'conflict', name: '갈등 구조 파악', area: 'lit',
    what: '누가 무엇 때문에 부딪히는지 정리한다.',
    pass: '갈등의 양쪽을 다 말한다. 한쪽 편만 들지 않는다.' },

  { id: 'outline', name: '개요 짜기', area: 'write',
    what: '쓰기 전에 뼈대를 먼저 만든다.',
    pass: '개요만 보고 남이 대신 쓸 수 있을 만큼 구체적이다.' },
  { id: 'support', name: '근거 대기', area: 'write',
    what: '주장에 이유를 붙인다.',
    pass: '근거가 주장의 반복이 아니다.' },
  { id: 'expand', name: '문단 늘려쓰기', area: 'write',
    what: '한 문장을 한 문단으로 키운다.',
    pass: '같은 말을 늘이지 않고 새 정보를 넣는다.' },
  { id: 'transform', name: '갈래 바꿔 쓰기', area: 'write',
    what: '설명문을 안내문으로, 이야기를 기사로 바꾼다.',
    pass: '원문 문장을 그대로 쓰지 않는다. ★ 요약보다 강한 검증.' },
  { id: 'revise', name: '고쳐쓰기', area: 'write',
    what: '자기 글에서 고칠 곳을 스스로 찾는다.',
    pass: '맞춤법 말고 내용·구조를 고친다.' },

  { id: 'agreement', name: '문장 성분 호응', area: 'grammar',
    what: '주어와 서술어가 맞는지 본다.',
    pass: '어색한 문장을 찾아 고친다.' },
  { id: 'word-build', name: '낱말의 짜임', area: 'grammar',
    what: '낱말을 뜻 단위로 쪼갠다.',
    pass: '한자어의 각 글자 뜻을 댄다. → 한자 과목과 연결.' },
  { id: 'honorific', name: '높임·시간 표현', area: 'grammar',
    what: '누구를 높이는지, 언제 일인지 표현으로 안다.',
    pass: '틀린 높임을 찾아 고친다.' },

  { id: 'read-aloud', name: '소리내어 읽기', area: 'speak',
    what: '끊어읽기로 뜻을 드러낸다.',
    pass: '뜻이 달라지는 자리에서 끊는다.' },
  { id: 'rebut', name: '반론하기', area: 'speak',
    what: '글쓴이에게 딴지를 건다.',
    pass: '"싫다"가 아니라 이유가 있는 반론이다.' },

  { id: 'source-check', name: '출처·의도 의심하기', area: 'media',
    what: '누가 왜 이걸 썼는지 묻는다.',
    pass: '글에 안 나온 이해관계를 짚어낸다. ★ 세연이 강점 영역.' },
];

export const LENS_BY_ID: Record<string, Lens> =
  Object.fromEntries(LENSES.map((l) => [l.id, l]));

/* ============================================================
   A. 텍스트 — 저작권 때문에 전문은 싣지 않는다.
      서지정보 + 발췌 + 아빠 메모만.
   ============================================================ */
export type TextGenre =
  | 'story' | 'poem' | 'essay' | 'explain' | 'argue' | 'news' | 'media';

export const GENRE_LABEL: Record<TextGenre, string> = {
  story: '이야기', poem: '시', essay: '수필', explain: '설명문',
  argue: '논설문', news: '기사', media: '매체 자료',
};

export interface Text {
  id: string;
  title: string;
  author?: string;
  genre: TextGenre;
  /** 어디서 구했나 — 교과서·책·웹 */
  where: string;
  /** 글자 수 대략 */
  length?: number;
  /** 저작권상 전문 대신 짧은 발췌만 */
  excerpt?: string;
  /** 아빠가 이 글을 고른 이유 */
  whyPicked?: string;
  /** 이 글에 잘 맞는 렌즈 */
  goodFor?: string[];
}

export const TEXTS: Text[] = [
  {
    id: 't-sonagi',
    title: '소나기',
    author: '황순원',
    genre: 'story',
    where: '초등 국어 교과서 수록 / 단편집',
    length: 8000,
    excerpt: '소년은 개울가에서 소녀를 보자 곧 윤 초시네 증손녀딸이라는 걸 알 수 있었다.',
    whyPicked:
      '첫 문장부터 "알 수 있었다"로 추론이 들어간다. 생략된 정보 추론(infer) 렌즈를 처음 대기 좋다.\n' +
      '결말이 인물의 입이 아니라 어른의 대화로 전해진다 — 시점 바꿔 보기(pov)로 이어진다.',
    goodFor: ['infer', 'feeling-arc', 'pov', 'image'],
  },
  {
    id: 't-plastic',
    title: '바다로 간 플라스틱',
    genre: 'explain',
    where: '초6 국어 교과서 설명문 단원 (예시)',
    length: 900,
    excerpt: '(교과서 지문 — 전문은 싣지 않음. 발췌만 기록)',
    whyPicked:
      '설명문인데 마지막 문단에서 슬쩍 주장으로 넘어간다. 사실과 의견 분리(fact-opinion)의 좋은 재료.\n' +
      '세연이가 국제학교에서 환경 주제를 영어로 다뤘을 가능성이 높다 — 아는 내용을 한국어로 다시 만나게 한다.',
    goodFor: ['fact-opinion', 'para-role', 'gist', 'transform'],
  },
];

export const TEXT_BY_ID: Record<string, Text> =
  Object.fromEntries(TEXTS.map((t) => [t.id, t]));

/* ============================================================
   교차점(Session) — 학습의 실체. "텍스트 × 렌즈" 1회
   ============================================================ */
export interface Session {
  id: string;
  date: string;
  textId: string;
  lensIds: string[];
  /** 세연이가 한 것 */
  did?: string;
  /** 아빠 관찰 — 어디서 막혔나 */
  note?: string;
  /** 0~5. 렌즈가 여럿이면 대표값 */
  score?: number;
}

export const SESSIONS: Session[] = [
  {
    id: 's-2026-09-06-sonagi',
    date: '2026-09-06',
    textId: 't-sonagi',
    lensIds: ['infer', 'evidence'],
    did: '소녀가 아픈 걸 언제 알았냐고 물으니 "마지막에"라고 답함. ' +
         '다시 읽으며 앞쪽에 단서가 있는지 찾게 했더니 개울물에 젖은 장면을 짚음.',
    note: '근거 지목(evidence)이 약하다. "느낌이 그랬어"로 도망간다. ' +
          '문장 번호를 대라고 강제하니 그제야 본문을 다시 봄. 이 강제가 효과 있었다.',
    score: 3,
  },
];

/* ============================================================
   초견(初見) 프로토콜 — 국어의 "백지 훈련"
   처음 보는 글 · 혼자 · 15분 · 사전 없음
   ============================================================ */
export interface SightRead {
  id: string;
  date: string;
  /** 글 제목 (처음 보는 것) */
  title: string;
  genre?: TextGenre;
  /** ① 갈래 판정 + 근거 */
  step1?: string;
  /** ② 모르는 낱말 전부 — ★ 이 사이트의 엔진 */
  unknownWords: string[];
  /** ③ 한 문장 요약 (30자) */
  step3?: string;
  /** ④ 단락 역할 라벨 */
  step4?: string;
  /** ⑤ 근거 지목 — 문단·문장 번호 */
  step5?: string;
  /** ⑥ 글쓴이에게 딴지 */
  step6?: string;
  /** 아빠 채점 */
  note?: string;
}

export const SIGHT_READS: SightRead[] = [
  {
    id: 'sr-2026-09-07',
    date: '2026-09-07',
    title: '(첫 초견 — 신문 기사 1편)',
    genre: 'news',
    step1: '기사. "~라고 밝혔다"가 반복돼서.',
    unknownWords: ['미묘하다', '불가피하다', '추산', '완화'],
    step3: '정부가 값을 내리려 하지만 쉽지 않다는 이야기.',
    step4: '1문단 사실 / 2문단 이유 / 3문단 전문가 말 / 4문단 전망',
    step5: '"쉽지 않다"의 근거로 3문단 두 번째 문장을 지목함. 정확했다.',
    step6: '전문가 한 명 말만 실렸다. 반대 의견은 왜 없나?',
    note:
      '⭐ 미지어가 전부 한자어다. 「알고리즘」은 알면서 「추산」을 모른다. ' +
      '국제학교 아이의 결핍이 어디 있는지 정확히 드러났다. → 한자 과목의 글자 선정에 반영할 것.',
  },
];

/* ---------------- 파생 ---------------- */
export const sessionsOfLens = (lensId: string) =>
  SESSIONS.filter((s) => s.lensIds.includes(lensId));

export const sessionsOfText = (textId: string) =>
  SESSIONS.filter((s) => s.textId === textId);

/** 렌즈별 적용 횟수 — 몇 개의 서로 다른 텍스트에 대봤는가가 숙달 지표 */
export const lensReach = (lensId: string) =>
  new Set(sessionsOfLens(lensId).map((s) => s.textId)).size;

/** 초견에서 모은 미지어 전체 — 한자·어휘의 재료 */
export const allUnknownWords = (): string[] =>
  [...new Set(SIGHT_READS.flatMap((s) => s.unknownWords))];
