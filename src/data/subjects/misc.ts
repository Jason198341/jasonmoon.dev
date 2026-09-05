/**
 * 지리 · 컴퓨터 · 경제 · 생각하는 법 · 영어
 *
 * 뼈대가 다 다르다:
 *   지리   = 공간축.   장소가 단위. 역사와 Place를 공유한다.
 *   컴퓨터 = 실천축.   "만든 것"이 단위. 돌아가야 안 것이다.
 *   경제   = 도구상자. "실제 돈 결정에 써봤나"가 검증.
 *   논리   = 도구상자. 다른 전 과목의 상위 도구.
 *   영어   = 유지.     11과목 중 유일하게 목표가 「잃지 않기」다.
 */

/* ============================================================
   지리 — 장소와 패턴. 역사 Scene 이 placeIds 로 여기를 가리킨다
   ============================================================ */
export interface Place {
  id: string;
  name: string;
  en?: string;
  /** 나라/지역 */
  region: string;
  /** 대략 좌표 [경도, 위도] — SVG 지도용 */
  lonlat?: [number, number];
  /** 이 장소를 규정하는 자연 조건 */
  nature?: string;
  /** ★ 왜 하필 여기서 그 일이 일어났나 — 지리가 역사에 답하는 부분 */
  whyHere?: string;
  /** 이 장소가 나오는 역사 Scene id들 */
  historyRefs?: string[];
}

export const PLACES: Place[] = [
  {
    id: 'busan', name: '부산', en: 'Busan', region: '한국 경상남도',
    lonlat: [129.08, 35.18],
    nature: '남해와 만나는 깊은 항구. 일본과 가장 가깝다.',
    whyHere:
      '일본에서 배로 가장 빨리 닿는 조선 땅이다. 그래서 임진왜란의 첫 상륙지였고, ' +
      '개항의 첫 항구였고, 6·25 때 마지막 피란 수도였다. 같은 지리 조건이 400년간 같은 역할을 만들었다.',
    historyRefs: ['kr-1592-busan'],
  },
  {
    id: 'hansan', name: '한산도', en: 'Hansando', region: '한국 경상남도 통영',
    lonlat: [128.48, 34.78],
    nature: '좁은 물목과 넓은 앞바다가 붙어 있다.',
    whyHere: '좁은 데서 꾀어내 넓은 데서 에워쌀 수 있는 지형. 학익진이 가능했던 이유가 땅에 있다.',
    historyRefs: ['kr-1592-hansan'],
  },
];

export const PLACE_BY_ID: Record<string, Place> =
  Object.fromEntries(PLACES.map((p) => [p.id, p]));

/** 백지도 훈련 — 지리의 검증 */
export interface BlankMapDrill {
  id: string;
  date: string;
  /** 무엇을 백지도에 그렸나 */
  task: string;
  /** 맞은 것 / 틀린 것 */
  got?: string;
  missed?: string;
  note?: string;
}

export const MAP_DRILLS: BlankMapDrill[] = [
  {
    id: 'md-2026-09-08',
    date: '2026-09-08',
    task: '한국 백지도에 도(道) 8개 이름 쓰기',
    got: '경기, 강원, 제주',
    missed: '충청·전라·경상의 남북을 헷갈림. 「도」 개념 자체가 처음이었다.',
    note: '⭐ 국제학교 아이라 행정구역이 백지다. 세계 지도는 오히려 잘 안다. 여기가 갭.',
  },
];

/* ============================================================
   컴퓨터 — "만든 것"이 단위. 돌아가야 안 것이다
   ============================================================ */
export type BuildStack = 'scratch' | 'python' | 'web' | 'paper';

export const STACK_LABEL: Record<BuildStack, string> = {
  scratch: '스크래치', python: '파이썬', web: '웹(HTML/JS)', paper: '종이·손',
};

export interface Build {
  id: string;
  title: string;
  stack: BuildStack;
  /** 무엇을 만드나 — 한 문장 */
  what: string;
  /** 이걸 만들면 무엇을 알게 되나 */
  learns: string[];
  /** 수학 사이트의 어느 개념과 이어지나 */
  mathRefs?: string[];
  /** 만들다 반드시 만나는 에러 — 에러는 정상 상태다 */
  expectedBugs?: string[];
  /** 다 만든 뒤 스스로 답할 질문 */
  checks?: string[];
  done?: boolean;
  doneDate?: string;
  /** 실제 코드나 결과물 링크 */
  link?: string;
}

export const BUILDS: Build[] = [
  {
    id: 'b-guess',
    title: '숫자 맞히기',
    stack: 'python',
    what: '컴퓨터가 1~100 중 하나를 고르면 사람이 맞히는 게임.',
    learns: ['변수', '반복(while)', '조건(if)', '입력받기'],
    mathRefs: ['e-est'],
    expectedBugs: [
      'input()으로 받은 값이 글자라서 숫자와 비교가 안 된다 → int() 필요',
      '반복이 안 끝난다 → 맞혔을 때 break를 안 넣음',
    ],
    checks: [
      '컴퓨터가 고른 수를 사람이 못 보게 하려면?',
      '7번 안에 반드시 맞히는 방법이 있을까? (→ 이분 탐색)',
    ],
  },
  {
    id: 'b-dice',
    title: '주사위 1만 번 던지기',
    stack: 'python',
    what: '주사위를 1만 번 던져 각 눈이 몇 번 나오는지 세고 막대로 그린다.',
    learns: ['난수', '리스트', '반복', '집계'],
    mathRefs: ['e-prob-intro', 'u-clt'],
    expectedBugs: ['리스트 인덱스가 0부터라 눈금과 1 차이 난다'],
    checks: [
      '10번 던졌을 때와 1만 번 던졌을 때 뭐가 다른가?',
      '주사위 2개 합을 세면 모양이 왜 달라지나?',
    ],
  },
];

export const BUILD_BY_ID: Record<string, Build> =
  Object.fromEntries(BUILDS.map((b) => [b.id, b]));

/* ============================================================
   경제 — 도구 상자. 「실제 돈 결정에 써봤나」가 검증
   ============================================================ */
export interface MoneyTool {
  id: string;
  name: string;
  en?: string;
  /** 한 문장 정의 */
  one: string;
  /** 언제 꺼내 쓰나 */
  useWhen: string;
  /** 수학 개념 연결 */
  mathRefs?: string[];
  /** 흔한 오해 */
  wrong?: { claim: string; fix: string };
}

export const MONEY_TOOLS: MoneyTool[] = [
  {
    id: 'opportunity-cost',
    name: '기회비용', en: 'opportunity cost',
    one: '무언가를 고르면 포기한 것이 값이다.',
    useWhen: '뭘 살까 고민할 때. "이걸 사면 못 사는 게 뭐지?"',
    wrong: {
      claim: '안 쓰면 손해가 아니다.',
      fix: '시간도 기회비용이 있다. 3시간 줄 서서 산 것은 공짜가 아니다.',
    },
  },
  {
    id: 'compound',
    name: '복리', en: 'compound interest',
    one: '이자에 다시 이자가 붙는다.',
    useWhen: '저축·투자를 볼 때. 그리고 빚을 볼 때 더 중요하다.',
    mathRefs: ['e-pow', 'h-exp', 'h-exp-log-func'],
    wrong: {
      claim: '10%씩 10년이면 100% 늘어난다.',
      fix: '약 159% 늘어난다. 곱하기라서 더하기보다 훨씬 커진다. → 수학 「거듭제곱」과 같은 그림.',
    },
  },
];

/** 실제 돈 결정 기록 — 이게 이 과목의 검증 */
export interface MoneyDecision {
  id: string;
  date: string;
  /** 무슨 결정이었나 */
  what: string;
  /** 어떤 도구를 썼나 */
  toolIds: string[];
  /** 세연이가 한 선택과 이유 */
  chose?: string;
  /** 나중에 돌아보니 */
  hindsight?: string;
}

export const MONEY_DECISIONS: MoneyDecision[] = [
  {
    id: 'mn-2026-09-05',
    date: '2026-09-05',
    what: '용돈 2만원으로 인형을 살까, 모을까',
    toolIds: ['opportunity-cost'],
    chose: '샀다. "지금 갖고 싶으니까".',
    hindsight: '(2주 뒤 다시 물어볼 것 — 아직 갖고 노나?)',
  },
];

/* ============================================================
   생각하는 법 — 다른 전 과목의 상위 도구
   ============================================================ */
export interface ThinkTool {
  id: string;
  name: string;
  en?: string;
  /** 한 문장 */
  one: string;
  /** 아이 말로 */
  kidWords: string;
  /** 어느 과목에서 쓰이나 */
  usedIn?: string[];
  /** 연습 문제 */
  drill?: string;
}

export const THINK_TOOLS: ThinkTool[] = [
  {
    id: 'naming-not-explaining',
    name: '이름 붙이기는 설명이 아니다', en: 'naming is not explaining',
    one: '"관성 때문이야"는 답이 아니라 질문의 반복이다.',
    kidWords: '이름을 말하는 건 설명이 아니야. 그게 뭔지, 왜 그런지 말해야 설명이야.',
    usedIn: ['science', 'math'],
    drill: '"왜 잠이 와?" → "졸려서"는 설명일까 이름 붙이기일까?',
  },
  {
    id: 'counterexample',
    name: '반례 하나면 무너진다', en: 'counterexample',
    one: '"모든 ~이다"는 예 하나로 깨진다. 예를 많이 드는 건 증명이 아니다.',
    kidWords: '"백조는 다 하얗다"를 무너뜨리려면 까만 백조 하나만 찾으면 돼.',
    usedIn: ['math', 'logic', 'korean'],
    drill: 'n²+n+41 은 n=0부터 39까지 전부 소수다. 그럼 항상 소수일까?',
  },
  {
    id: 'correlation',
    name: '같이 움직인다고 원인은 아니다', en: 'correlation is not causation',
    one: '두 가지가 함께 변해도 하나가 다른 하나를 만든 건 아니다.',
    kidWords: '아이스크림이 많이 팔리는 날 물에 빠지는 사람도 많아. 아이스크림 때문일까?',
    usedIn: ['science', 'economy', 'khistory'],
    drill: '숨은 제3의 원인을 찾아봐. (→ 여름)',
  },
];

/* ============================================================
   영어 — 11과목 중 유일하게 목표가 「잃지 않기」
   ============================================================
   ⚠️ 아빠는 영어 원어민이 아니다. 세연이가 아빠보다 잘할 수 있다.
      다른 과목의 "아빠가 예습해서 가르친다" 모델이 여기서는 성립하지 않는다.
      아빠 역할 = 관리자·기록자·상대. 그리고 때로는 배우는 쪽.
*/
export type EnKind = 'read' | 'write' | 'listen' | 'speak' | 'bridge' | 'exam';

export const EN_KIND_LABEL: Record<EnKind, string> = {
  read: '읽기', write: '쓰기', listen: '듣기', speak: '말하기',
  bridge: '한↔영 다리', exam: '한국 시험 형식',
};

export interface EnLog {
  id: string;
  date: string;
  kind: EnKind;
  /** 무엇을 했나 */
  what: string;
  /** 분량 (쪽수·분) */
  amount?: string;
  note?: string;
}

/** 귀국 후 무너지는 순서: 말하기 → 듣기 → 쓰기 → 읽기.
 *  그래서 말하기·듣기 로그를 특히 본다 */
export const EN_LOGS: EnLog[] = [
  {
    id: 'en-2026-09-05',
    date: '2026-09-05',
    kind: 'read',
    what: 'Wonder (R.J. Palacio) 3장까지',
    amount: '28쪽',
    note: '막힘 없이 읽는다. 이 수준을 귀국 후에도 유지하는 게 목표.',
  },
  {
    id: 'en-2026-09-06',
    date: '2026-09-06',
    kind: 'bridge',
    what: '과학에서 배운 dissolving / solution / solute / solvent 를 한국어 용어와 짝지음',
    note:
      '⭐ solvent 를 「용매」로 옮기는 데 시간이 걸렸다. 영어 뜻은 정확히 아는데 한국어 이름이 없다. ' +
      '이게 이 과목의 진짜 일이다 — 아는 것에 한국어 이름표 붙이기.',
  },
];

/** 한↔영 다리 — 다른 과목에서 배운 것을 한국어 이름과 짝짓기 */
export interface Bridge {
  en: string;
  ko: string;
  /** 어느 과목에서 나왔나 */
  from: string;
  /** 세연이가 어느 쪽을 먼저 알았나 */
  knewFirst: 'en' | 'ko';
}

export const BRIDGES: Bridge[] = [
  { en: 'dissolving', ko: '용해', from: 'science', knewFirst: 'en' },
  { en: 'solvent', ko: '용매', from: 'science', knewFirst: 'en' },
  { en: 'the derivative', ko: '미분계수', from: 'math', knewFirst: 'en' },
  { en: 'estimation', ko: '어림', from: 'math', knewFirst: 'en' },
];
