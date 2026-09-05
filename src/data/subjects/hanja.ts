import type { Status } from './status';

/**
 * 한자 — 부품 조립 그래프
 *
 * ⚠️ 이 파일의 규칙 하나:
 *    「推(밀 추)」는 설명이 아니라 **이름 붙이기**다.
 *    왜 밀 추인지를 말하지 않으면 아이는 결국 외운다.
 *    모든 글자는 공리 3개에서 원자 단위로 도출되어야 한다.
 *
 * 글자 선정은 임의로 하지 않는다.
 * 국어 초견에서 세연이가 모른다고 표시한 낱말에서 역산해 고른다.
 */

/* ============================================================
   공리 — 더 안 쪼개지는 출발점 3개
   이 셋만 있으면 처음 보는 한자도 쪼갤 수 있다
   ============================================================ */
export const AXIOMS = [
  {
    n: 1,
    title: '한자는 처음에 그림이었다',
    body: '해를 그리면 日, 나무를 그리면 木, 사람이 서 있으면 人. 그림이라 보면 안다.',
  },
  {
    n: 2,
    title: '그런데 그림으로 못 그리는 게 너무 많았다',
    body:
      '"생각하다", "느리다", "밀다"를 어떻게 그리나. 그래서 방법을 하나 만들었다 —\n' +
      '뜻을 알려주는 부품 + 소리를 알려주는 부품을 붙인다.\n' +
      '지금 쓰는 한자의 대부분(80~90%)이 이 방식이다. [정설]\n' +
      '★ 그래서 부품을 볼 때 "이건 뜻이야, 저건 소리야"를 먼저 갈라야 한다.',
  },
  {
    n: 3,
    title: '뜻은 구체적인 것에서 추상적인 것으로 넓어진다',
    body:
      '손으로 물건을 미는 것(구체) → 생각을 밀고 나가는 것(추상).\n' +
      '이건 한자만의 습관이 아니다. 영어도 똑같다 — infer = in(안으로) + ferre(나르다).\n' +
      '★ 세연이는 영어를 아니까 이 다리를 쓸 수 있다.',
  },
] as const;

/** 글자가 어떻게 만들어졌나 — 이걸 먼저 알아야 부품을 읽는 법이 정해진다 */
export type CharType =
  | 'pictograph'  // 상형 — 그림. 보면 안다
  | 'ideograph'   // 회의 — 뜻 + 뜻. 둘을 합쳐 새 뜻
  | 'phonetic';   // 형성 — 뜻 + 소리. 가장 많다

export const CHAR_TYPE: Record<CharType, { name: string; how: string }> = {
  pictograph: { name: '그림 글자', how: '그림이니까 보면 안다' },
  ideograph:  { name: '뜻 + 뜻',   how: '두 뜻을 합쳐 새 뜻을 만든다' },
  phonetic:   { name: '뜻 + 소리', how: '뜻 부품이 갈래를 알려주고, 소리 부품은 발음만 빌려준다' },
};

/** 부품이 무슨 일을 하나 */
export type PartRole = 'meaning' | 'sound' | 'both';

export const PART_ROLE_LABEL: Record<PartRole, string> = {
  meaning: '뜻', sound: '소리', both: '뜻+소리',
};

export type Conf = '정설' | '유력' | '추측' | '갈림';

export interface Part {
  c: string;
  role: PartRole;
  /** 이 부품이 무엇을 알려주는가 */
  says: string;
}

export interface Char {
  c: string;
  mean: string;
  sound: string;
  strokes?: number;
  level?: 8 | 7 | 6 | 5 | 4 | 3;
  status: Status;

  type: CharType;
  /** 부품과 각자의 역할 */
  parts: Part[];

  /** ★ 왜 그 뜻이 되는가 — 원자 단위 설명. 이게 없으면 이름 붙이기다 */
  whyMean: string;
  /** 자원 설명의 확신도 */
  conf: Conf;
  /** 설이 갈리면 왜 갈리는지 */
  confNote?: string;

  /** ⚠️ 여기서 더 못 쪼갠다 — 경계를 명시한다 */
  boundary?: string;

  /** 구체 → 추상 확장 경로 */
  extension?: string;
  /** 영어에 같은 확장이 있나 (세연이 강점을 다리로) */
  enBridge?: string;

  words?: string[];
  fromUnknown?: string[];
}

export const CHARS: Char[] = [
  /* ─────────── 그림 글자 (더 안 쪼개짐) ─────────── */
  {
    c: '日', mean: '날·해', sound: '일', strokes: 4, level: 8, status: 'ready',
    type: 'pictograph', parts: [],
    whyMean: '해를 그린 그림. 동그라미 안의 점은 해의 무늬를 나타냈다.',
    conf: '정설',
    boundary: '그림이라 여기서 끝. 더 쪼갤 부품이 없다.',
    words: ['일요일', '생일', '매일'],
  },
  {
    c: '月', mean: '달', sound: '월', strokes: 4, level: 8, status: 'ready',
    type: 'pictograph', parts: [],
    whyMean: '초승달을 그린 그림. 해(日)와 헷갈리지 않게 일부러 이지러진 모양으로 그렸다.',
    conf: '정설',
    boundary: '그림이라 여기서 끝.',
    words: ['월요일', '개월', '세월'],
  },
  {
    c: '木', mean: '나무', sound: '목', strokes: 4, level: 8, status: 'ready',
    type: 'pictograph', parts: [],
    whyMean: '나무를 그린 그림. 가운데 세로가 줄기, 위로 뻗은 게 가지, 아래로 뻗은 게 뿌리.',
    conf: '정설',
    boundary: '그림이라 여기서 끝.',
    words: ['목재', '식목일'],
  },
  {
    c: '人', mean: '사람', sound: '인', strokes: 2, level: 8, status: 'ready',
    type: 'pictograph', parts: [],
    whyMean: '사람이 옆으로 서 있는 모습. 다리 둘이 보인다.',
    conf: '정설',
    boundary: '그림이라 여기서 끝.',
    extension: '왼쪽에 쓸 때는 亻로 눌러 쓴다. 모양이 바뀌어도 같은 글자다.',
    words: ['인간', '한국인'],
  },
  {
    c: '手', mean: '손', sound: '수', strokes: 4, level: 7, status: 'ready',
    type: 'pictograph', parts: [],
    whyMean: '손가락을 펼친 손을 그린 그림.',
    conf: '정설',
    boundary: '그림이라 여기서 끝.',
    extension:
      '★ 왼쪽에 붙일 때는 扌로 눌러 쓴다(재방변).\n' +
      '扌가 보이면 "손으로 하는 동작"이라는 뜻이다 — 밀다·잡다·던지다·치다.',
    words: ['수술', '박수', '가수'],
  },
  {
    c: '竹', mean: '대나무', sound: '죽', strokes: 6, level: 6, status: 'ready',
    type: 'pictograph', parts: [],
    whyMean: '대나무 잎 두 갈래가 아래로 처진 모습을 그렸다.',
    conf: '정설',
    boundary: '그림이라 여기서 끝.',
    extension:
      '★ 위에 얹힐 때는 ⺮로 납작해진다.\n' +
      '⺮가 보이면 대나무로 만든 것 — 붓(筆), 종이 이전의 책(簡), 그리고 셈 막대.',
    words: ['죽순', '폭죽'],
  },
  {
    c: '隹', mean: '새', sound: '추', strokes: 8, level: 3, status: 'ready',
    type: 'pictograph', parts: [],
    whyMean: '꽁지가 짧은 새를 그린 그림.',
    conf: '정설',
    boundary: '그림이라 여기서 끝.',
    extension:
      '⚠️ 중요 — 이 글자는 다른 글자 안에서 대개 뜻이 아니라 소리로 쓰인다.\n' +
      '"추"라는 발음을 빌려주는 역할. 그래서 隹가 들어간 글자가 새와 상관없을 때가 많다.',
    words: ['척추'],
  },

  /* ─────────── 뜻 + 뜻 (회의) ─────────── */
  {
    c: '林', mean: '수풀', sound: '림', strokes: 8, level: 7, status: 'ready',
    type: 'ideograph',
    parts: [
      { c: '木', role: 'meaning', says: '나무' },
      { c: '木', role: 'meaning', says: '나무' },
    ],
    whyMean: '나무(木)를 둘 나란히 놓았다. 나무가 여럿이면 숲. 셋을 놓으면 森(빽빽할 삼)이 된다.',
    conf: '정설',
    boundary: '木이 그림 글자라 여기가 바닥이다.',
    words: ['산림', '밀림'],
  },
  {
    c: '休', mean: '쉴', sound: '휴', strokes: 6, level: 7, status: 'ready',
    type: 'ideograph',
    parts: [
      { c: '人', role: 'meaning', says: '사람 (亻로 눌러 씀)' },
      { c: '木', role: 'meaning', says: '나무' },
    ],
    whyMean: '사람(亻)이 나무(木) 옆에 있는 그림. 일하다 나무 그늘에 기대는 모습이라 「쉬다」.',
    conf: '정설',
    boundary: '두 부품 다 그림 글자라 여기가 바닥이다.',
    words: ['휴식', '휴일', '연휴'],
  },
  {
    c: '明', mean: '밝을', sound: '명', strokes: 8, level: 6, status: 'ready',
    type: 'ideograph',
    parts: [
      { c: '日', role: 'meaning', says: '해' },
      { c: '月', role: 'meaning', says: '달' },
    ],
    whyMean: '해(日)와 달(月)을 나란히 놓았다. 둘 다 밝은 것이니 합치면 「밝다」.',
    conf: '갈림',
    confNote:
      '가장 널리 알려진 설명이지만, 옛 글자(갑골문)에는 왼쪽이 해가 아니라 창문(囧)인 형태도 있다.\n' +
      '그쪽이면 "창문으로 달빛이 들어온다"가 된다.\n' +
      '★ 세연이에게는 두 설을 다 말해주고 "어느 쪽이 더 그럴듯해?"를 물을 것.\n' +
      '자원 설명은 정답이 하나가 아닐 수 있다는 걸 여기서 배운다.',
    words: ['명확', '설명', '발명', '분명'],
  },

  /* ─────────── 뜻 + 소리 (형성) — 여기가 핵심 ─────────── */
  {
    c: '推', mean: '밀', sound: '추', strokes: 11, level: 4, status: 'ready',
    type: 'phonetic',
    parts: [
      { c: '扌', role: 'meaning', says: '손(手). 손으로 하는 동작이라는 뜻' },
      { c: '隹', role: 'sound', says: '새(隹). 여기서는 뜻이 아니라 「추」라는 발음만 빌려줌' },
    ],
    whyMean:
      '扌(손)가 갈래를 알려준다 — 이건 손으로 하는 동작이다.\n' +
      '隹는 뜻이 아니라 소리다 — 「추」라고 읽으라는 표시일 뿐, 새와는 아무 상관이 없다.\n' +
      '합치면: 손으로 하는 동작 중에 「추」라고 발음하는 것 = 밀다.',
    conf: '정설',
    boundary:
      '⚠️ 여기서 멈춘다. "왜 하필 미는 동작이 「추」라는 소리였나"는 더 안 쪼개진다.\n' +
      '소리는 빌려온 것이라 그 이상의 이유가 없다. 아주 옛날 말소리가 그랬을 뿐이다.\n' +
      '★ 이걸 아이에게 정직하게 말해줄 것 — 어디까지가 설명이고 어디부터가 약속인지.',
    extension:
      '손으로 물건을 민다 (구체)\n' +
      '  → 생각을 밀고 나간다 (추상)\n' +
      '  → 추측(推測) 밀어서 재본다 · 추론(推論) 밀어서 따진다 · 추진(推進) 밀어서 나아간다',
    enBridge:
      '영어도 똑같이 한다.\n' +
      '· infer = in(안으로) + ferre(나르다) — 생각을 안으로 날라온다\n' +
      '· deduce = de(~로부터) + ducere(이끌다) — 앞의 것에서 이끌어낸다\n' +
      '★ 생각을 몸의 동작으로 말하는 건 한국어·한자·영어가 다 같다.',
    words: ['추산', '추측', '추론', '추진', '추천'],
    fromUnknown: ['추산'],
  },
  {
    c: '算', mean: '셈', sound: '산', strokes: 14, level: 7, status: 'ready',
    type: 'ideograph',
    parts: [
      { c: '竹', role: 'meaning', says: '대나무(⺮). ★ 왜 대나무인지가 이 글자의 핵심' },
      { c: '目', role: 'meaning', says: '눈. 보면서 헤아린다' },
      { c: '廾', role: 'meaning', says: '두 손. 막대를 두 손으로 다룬다' },
    ],
    whyMean:
      '★ 왜 셈에 대나무가 들어갈까?\n' +
      '옛날에는 계산기도 주판도 없었다. 대나무 막대(산가지)를 바닥에 늘어놓고 셌다.\n' +
      '한 개, 두 개… 자리마다 막대를 놓아 큰 수도 계산했다.\n' +
      '그래서 「셈」이라는 글자에 대나무(⺮)가 들어간다.\n' +
      '아래는 두 손(廾)으로 그 막대를 다루는 모양이다.\n' +
      '합치면: 대나무 막대를 두 손으로 늘어놓고 눈으로 헤아리는 것 = 셈.',
    conf: '유력',
    confNote:
      '竹이 산가지에서 왔다는 건 [정설]이다.\n' +
      '가운데를 目(눈)으로 볼지 具(갖출 구)의 일부로 볼지는 설이 갈린다 [유력].\n' +
      '어느 쪽이든 "대나무 막대로 센다"는 뼈대는 같다.',
    boundary: '竹이 그림 글자라 그쪽은 바닥이다. 가운데 부분의 정확한 해석은 학자들도 갈린다.',
    extension:
      '막대로 센다 (구체)\n' +
      '  → 계산하다 · 헤아리다 (추상)\n' +
      '  → 예산(豫算) 미리 셈 · 정산(精算) 정확히 셈 · 산수(算數)',
    enBridge:
      '영어 calculate도 같은 길을 걸었다.\n' +
      'calculus = 라틴어로 작은 돌멩이. 로마 사람들은 돌로 셌다.\n' +
      '★ 한쪽은 대나무, 한쪽은 돌. 도구는 달라도 "물건을 늘어놓고 센다"는 생각은 같다.',
    words: ['계산', '추산', '예산', '산수'],
    fromUnknown: ['추산'],
  },
  {
    c: '緩', mean: '느릴', sound: '완', strokes: 15, level: 3, status: 'ready',
    type: 'phonetic',
    parts: [
      { c: '糸', role: 'meaning', says: '실. 실타래를 그린 그림' },
      { c: '爰', role: 'sound', says: '「원」에서 온 소리. 뜻은 거의 안 쓴다' },
    ],
    whyMean:
      '糸(실)이 갈래를 알려준다 — 실과 관련된 것.\n' +
      '팽팽하게 당긴 실이 아니라 느슨하게 풀린 실의 상태가 「느리다·늦추다」가 됐다.\n' +
      '실이 느슨하면 천천히 움직인다.',
    conf: '유력',
    boundary: '소리 부품 爰이 왜 「완」으로 읽히는지는 옛 발음의 문제라 더 안 쪼개진다.',
    extension:
      '실이 느슨하다 (구체)\n' +
      '  → 팽팽하던 것을 풀다 (추상)\n' +
      '  → 완화(緩和) 풀어서 부드럽게 · 완만(緩慢) 기울기가 느슨함',
    enBridge: 'relax도 라틴어 re(다시) + laxare(느슨하게 하다). 「느슨함」이 「편안함」이 되는 길이 같다.',
    words: ['완화', '완만', '완충'],
    fromUnknown: ['완화'],
  },
  {
    c: '微', mean: '작을·희미할', sound: '미', strokes: 13, level: 3, status: 'draft',
    type: 'ideograph',
    parts: [
      { c: '彳', role: 'meaning', says: '조금 걷다. 길을 나타내는 부품' },
    ],
    whyMean:
      '"길을 조금씩 간다"에서 「아주 조금」, 「눈에 잘 안 띈다」로 넓어졌다는 설명이 있다.',
    conf: '갈림',
    confNote:
      '⚠️ 이 글자는 자원 설명이 복잡하고 학자마다 갈린다.\n' +
      '★ 지어내지 않는다. 확실하지 않으면 "아직 잘 모른다"고 말하는 게 정직하다.\n' +
      '지금은 뜻과 쓰임만 알고 넘어간다. 나중에 아빠가 더 찾아보고 채운다.',
    boundary: '자원을 확실히 모른다. 여기서 멈춘다.',
    extension: '아주 작다 → 눈에 잘 안 띈다 → 미묘(微妙) 알아채기 어려울 만큼 섬세함',
    words: ['미묘', '미세', '현미경'],
    fromUnknown: ['미묘하다'],
  },
];

export const CHAR_BY_C: Record<string, Char> =
  Object.fromEntries(CHARS.map((c) => [c.c, c]));

export const usedIn = (c: string) =>
  CHARS.filter((x) => x.parts.some((p) => p.c === c));

export const atoms = () => CHARS.filter((c) => c.parts.length === 0);

/* ============================================================
   검증 — 처음 보는 낱말 뚫기
   ⚠️ "推(밀 추) + 算(셈 산)"으로 끝나면 실패다.
      왜 밀 추이고 왜 셈 산인지까지 말해야 통과.
   ============================================================ */
export interface WordGuess {
  id: string;
  date: string;
  word: string;
  /** 어떤 글자로 쪼갰나 */
  split?: string;
  /** ★ 각 글자가 왜 그 뜻인지 말했나 — 이게 진짜 검증 */
  saidWhy?: boolean;
  guess?: string;
  actual?: string;
  hit?: boolean;
  note?: string;
}

export const WORD_GUESSES: WordGuess[] = [
  {
    id: 'wg-2026-09-08',
    date: '2026-09-08',
    word: '추산',
    split: '推 + 算',
    saidWhy: true,
    guess:
      '推는 손(扌)으로 미는 것 — 생각을 밀고 나가는 것.\n' +
      '算은 대나무 막대(⺮)를 늘어놓고 세는 것.\n' +
      '→ 다 못 셀 때 아는 데서 밀고 나가 세는 것? 대충 세보는 것.',
    actual: '어림잡아 계산함',
    hit: true,
    note:
      '⭐ 처음엔 "밀어서 세는 것"이라고만 했다. 그건 이름 붙이기다.\n' +
      '扌가 손이고 隹는 소리만 빌린 거라는 걸 짚어주니 "아, 손으로 미는 거구나"가 나왔고,\n' +
      '⺮가 왜 있냐고 물으니 몰랐다. 산가지 이야기를 해주자 표정이 바뀌었다.\n' +
      '"옛날엔 계산기가 없어서 대나무로 셌어"가 이 수업의 착지 문장이었다.',
  },
];

export const guessRate = () => {
  const done = WORD_GUESSES.filter((g) => g.hit !== undefined);
  if (!done.length) return null;
  return done.filter((g) => g.hit).length / done.length;
};

/** 「왜」까지 말한 비율 — 이게 진짜 지표 */
export const whyRate = () => {
  const done = WORD_GUESSES.filter((g) => g.saidWhy !== undefined);
  if (!done.length) return null;
  return done.filter((g) => g.saidWhy).length / done.length;
};
