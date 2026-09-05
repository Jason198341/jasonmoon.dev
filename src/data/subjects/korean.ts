import type { Status } from './status';

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
   아빠 예습 — ★ 제1원칙 대본이 아니다

   수학은 아빠가 말하고 아이가 듣는다.
   국어는 아이가 말하고 아빠가 받는다. 대본을 짜면 오히려 방해가 된다.
   국어 수업의 성패는 아빠의 설명이 아니라
   **질문의 순서**와 **예상 못 한 답을 받아치는 능력**에 있다.

   ⚠️ ⑤ 채점선이 국어 가정학습 붕괴의 1순위 원인이다.
      기준을 미리 안 적으면 아빠가 그날 컨디션대로 채점하고,
      아이는 규칙을 알 수 없어 학습을 포기한다.
   ============================================================ */
export interface LessonCard {
  textId: string;
  status: Status;
  updated?: string;

  /** ① 미지어 예보 — 세연이가 모를 낱말 후보를 아빠가 먼저 뽑는다 */
  predictedUnknown: string[];
  /** 실제 초견 결과와 대조한 적중률. ★ 아빠의 성장 지표 */
  hitRate?: number;

  /** ② 문화 배경 브리핑 — ★ 국제학교 아이 최대 함정
      낱말은 다 아는데 상황을 모른다 (시골 외갓집, 반장선거, 차례, 이산가족) */
  cultural: { item: string; howToExplain: string }[];

  /** ③ 질문 사다리 — 순서가 곧 수업. 추론을 먼저 물으면 아이가 얼어붙는다 */
  ladder: {
    tier: '사실확인' | '관계파악' | '추론' | '평가' | '전이';
    q: string;
    /** 기대하는 답의 하한선 */
    ok: string;
  }[];

  /** ④ 오독 예보 — 아이의 오독은 대부분 예측 가능하다.
      미리 준비하면 "틀렸어" 대신 "왜 그렇게 읽었어?"로 받을 수 있다 */
  misread: { likely: string; why: string; sayThis: string }[];

  /** ⑤ ★ 채점선 — 수업 前에 문장으로 적는다. 붕괴 방지 장치 */
  rubric: { criterion: string; passLine: string }[];

  /** ⑥ 아빠가 직접 해본 답 — 국어는 시범이 설명보다 강하다 */
  dadAnswer?: string;

  /** ⑦ 착지 문장 — 수업 끝에 세연이 입에서 나와야 할 한 문장.
      없으면 수다로 끝난다 */
  landing: string;

  /** 수업 전 5초 자기점검 */
  selfCheck?: { rubricWritten: boolean; dadAnsweredFirst: boolean; culturalChecked: boolean };
}

export const LESSON_CARDS: LessonCard[] = [
  {
    textId: 't-sonagi',
    status: 'ready',
    updated: '2026-09-05',
    predictedUnknown: ['윤 초시', '증손녀', '개울', '비단', '대추', '갈밭', '수숫단'],
    cultural: [
      { item: '시골 외갓집·개울',
        howToExplain: '지금 아파트 사는 아이에겐 "개울에서 논다"가 안 그려진다. 사진 한 장 보여주고 시작.' },
      { item: '윤 초시 — 옛날 마을의 어른',
        howToExplain: '"초시"는 과거 1차 시험 합격자. 마을에서 존경받던 집안이라는 뜻이지 벼슬이 아니다.' },
      { item: '소녀가 서울에서 왔다는 것의 의미',
        howToExplain: '그 시절 서울/시골 격차. 세연이가 국제학교/한국학교 사이에 있는 것과 비슷하다고 이어줄 것.' },
    ],
    ladder: [
      { tier: '사실확인', q: '소년과 소녀가 처음 만난 곳은?', ok: '개울가' },
      { tier: '사실확인', q: '소녀가 소년에게 던진 건 뭐야?', ok: '조약돌' },
      { tier: '관계파악', q: '소년의 태도가 언제부터 달라졌어?', ok: '어느 장면을 지목하면 통과' },
      { tier: '추론', q: '소녀가 아프다는 걸 작가는 어디서 흘렸을까?', ok: '앞쪽 단서 하나라도 문장으로 지목' },
      { tier: '평가', q: '결말을 어른들 대화로 전한 건 좋은 선택이었을까?', ok: '이유가 있으면 어느 쪽이든 통과' },
      { tier: '전이', q: '네가 작가라면 마지막을 어떻게 썼을 것 같아?', ok: '원작과 다른 선택 + 이유' },
    ],
    misread: [
      { likely: '소녀가 그냥 갑자기 죽었다고 읽는다',
        why: '복선을 못 잡음. 추론 렌즈가 아직 약함.',
        sayThis: '"갑자기였을까? 앞에서 소녀가 힘들어 보인 데가 있었나 다시 찾아볼래?"' },
      { likely: '소년이 무뚝뚝해서 소녀를 싫어한 줄 안다',
        why: '한국 문학의 「내색 안 함」 관습을 모름. 국제학교 배경 함정.',
        sayThis: '"싫으면 왜 계속 개울에 갔을까? 좋아하는데 말 못 하는 걸 본 적 있어?"' },
    ],
    rubric: [
      { criterion: '복선 지목', passLine: '앞부분에서 단서 문장 1개 이상을 정확히 짚으면 통과. 개수는 안 본다.' },
      { criterion: '인물 마음 변화', passLine: '바뀐 지점을 장면으로 말하면 통과. "좋아하게 됐다"만으로는 미통과.' },
      { criterion: '결말 평가', passLine: '어느 쪽이든 이유가 본문에 근거하면 통과. 취향은 채점하지 않는다.' },
    ],
    dadAnswer:
      '(아빠가 먼저 써본 복선 목록) 소녀가 개울물에 발을 담그다 감기 든 장면 / 산에서 비를 맞은 뒤 얼굴이 창백해진 묘사 / ' +
      '"그날 소나기가…"로 시작하는 어른의 말. — 직접 써보니 3개 찾는 것도 쉽지 않다. 아이에게 1개면 충분하다.',
    landing: '"작가는 소녀가 아플 거라는 걸 미리 조금씩 흘려놨어."',
    selfCheck: { rubricWritten: true, dadAnsweredFirst: true, culturalChecked: true },
  },
];

export const CARD_OF = (textId: string) => LESSON_CARDS.find((c) => c.textId === textId);

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
