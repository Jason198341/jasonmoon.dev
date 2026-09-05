/**
 * 과학 — 현상 앵커 모형 유닛
 *
 * ⚠️ 개념을 단위로 쪼개면(온도·열·전도·대류) 결국 암기 카드가 된다.
 *    과학 지식은 명제만이 아니라 **"우리는 왜 그걸 믿는가"가 지식의 절반**이다.
 *    개념 노드에는 증거가 붙을 자리가 없다.
 *
 * 그래서 유닛마다 관찰 가능한 현상에 닻을 내리고, 순서를 강제한다:
 *   ① 이상한 일이 벌어진다 (앵커)
 *   ② 너는 어떻게 설명할래? (아이의 초기 모형 = 오개념 노출)
 *   ③ 과학자의 설명 (모형)
 *   ④ 왜 그걸 믿나 (증거)
 *   ⑤ 이름은 이렇게 부른다 (용어 — 한/영)
 *
 * ★ 용어가 마지막에 온다. 한국 학교는 거꾸로(용어 먼저)라서 암기가 된다.
 */

/* ---------------- 거대 모형 ----------------
   교과 영역(물·화·생·지)은 학교의 서랍일 뿐 자연의 구조가 아니다.
   실제로 영역을 가로지르는 것은 소수의 거대 모형이다. */
export type BigModel =
  | 'particle' | 'energy' | 'force' | 'wave'
  | 'system' | 'diversity' | 'scale' | 'balance';

export const BIG_MODEL: Record<BigModel, { name: string; one: string }> = {
  particle:  { name: '입자 모형',     one: '모든 것은 아주 작은 알갱이로 되어 있다.' },
  energy:    { name: '에너지 보존',   one: '사라지지 않고 모양만 바뀐다.' },
  force:     { name: '힘과 상호작용', one: '움직임이 바뀌면 반드시 힘이 있었다.' },
  wave:      { name: '파동과 빛',     one: '흔들림이 퍼져 나간다.' },
  system:    { name: '시스템과 흐름', one: '들어오고 나가고 순환한다.' },
  diversity: { name: '다양성과 변이', one: '조금씩 다르고, 그 차이가 쌓인다.' },
  scale:     { name: '규모와 주기',   one: '아주 크고 아주 길게 보면 규칙이 보인다.' },
  balance:   { name: '평형과 되먹임', one: '한쪽이 기울면 되돌리는 힘이 생긴다.' },
};

export type Band = 'E' | 'M' | 'H' | 'U';
export const BAND_LABEL: Record<Band, string> = {
  E: '초등', M: '중등', H: '고등', U: '대학',
};

/** 교과 영역 — 색으로만 쓴다. 구조가 아니다 */
export type Field = 'phys' | 'chem' | 'bio' | 'earth';
export const FIELD_LABEL: Record<Field, string> = {
  phys: '물리', chem: '화학', bio: '생물', earth: '지구',
};

/* ---------------- 증거 ----------------
   증거는 유닛의 필드가 아니라 별도 엔티티다.
   하나의 증거가 여러 유닛을 지탱하기 때문. */
export type EvidenceKind = 'home' | 'proxy' | 'demo' | 'historical';

export const EVIDENCE_LABEL: Record<EvidenceKind, string> = {
  home: '집에서 직접',
  proxy: '모형으로 대신',   // 태양계·지층처럼 실물 확인 불가한 것
  demo: '영상·시뮬레이션',
  historical: '역사적 결정 실험',
};

export interface Evidence {
  id: string;
  kind: EvidenceKind;
  title: string;
  /** 무엇을 하면 되나 */
  how: string;
  /** 무엇이 보이면 모형이 맞는 것인가 */
  expect: string;
  /** 준비물 */
  props?: string;
  /** 안전 주의 */
  safety?: string;
  /** 실패하면 대개 이것 때문 */
  ifFails?: string;
}

export const EVIDENCES: Evidence[] = [
  {
    id: 'ev-ink-spread',
    kind: 'home',
    title: '물에 잉크 한 방울',
    how: '찬물과 더운물 두 컵에 잉크를 동시에 한 방울씩 떨어뜨리고 젓지 말고 본다.',
    expect: '더운물에서 훨씬 빨리 퍼진다. 젓지 않았는데도 저절로 퍼진다.',
    props: '투명 컵 2개, 잉크나 물감, 찬물·더운물',
    ifFails: '컵을 건드리면 물이 흔들려 대류로 퍼진다. 놓고 손대지 말 것.',
  },
  {
    id: 'ev-spoon-cold',
    kind: 'home',
    title: '쇠 숟가락과 나무 숟가락 만져보기',
    how: '같은 방에 오래 둔 쇠 숟가락과 나무 숟가락을 동시에 만진다.',
    expect: '쇠가 더 차갑게 느껴진다. 그런데 온도계로 재면 둘이 같다.',
    props: '쇠 숟가락, 나무 숟가락, 온도계',
    ifFails: '한쪽을 손에 오래 쥐고 있었으면 안 된다. 둘 다 방에 오래 두고 시작.',
  },
  {
    id: 'ev-lavoisier',
    kind: 'historical',
    title: '라부아지에의 밀폐 연소',
    how: '(재현 불가 — 역사 기록으로 본다) 밀폐 용기 안에서 태우고 전후 무게를 쟀다.',
    expect: '타서 없어진 것 같은데 전체 무게가 그대로였다.',
  },
];

export const EVIDENCE_BY_ID: Record<string, Evidence> =
  Object.fromEntries(EVIDENCES.map((e) => [e.id, e]));

/* ---------------- 오개념 : 1급 엔티티 ----------------
   과학 교육에서 오개념은 부가 정보가 아니라 학습의 주인공이다. */
export interface Misconception {
  id: string;
  /** 아이가 실제로 갖는 틀린 생각 */
  wrong: string;
  /** 왜 그렇게 생각하는가 — 대개 일상 경험에서 온다 */
  why: string;
  /** 무엇을 보여주면 무너지는가 */
  breaker: string;
  /** 어른도 자주 틀리는가 */
  adultsToo?: boolean;
}

export const MISCONCEPTIONS: Misconception[] = [
  { id: 'mc-metal-cold',
    wrong: '쇠는 원래 차갑다.',
    why: '만지면 실제로 차갑게 느껴진다. 감각이 그렇게 말한다.',
    breaker: '온도계로 재면 나무와 같다. 느낌은 온도가 아니라 「열이 빠져나가는 속도」다.',
    adultsToo: true },
  { id: 'mc-dissolve-gone',
    wrong: '설탕이 물에 녹으면 없어진다.',
    why: '눈에 안 보이니까.',
    breaker: '녹이기 전후로 전체 무게를 재면 똑같다. 맛도 난다.',
    adultsToo: false },
  { id: 'mc-heat-is-temp',
    wrong: '열과 온도는 같은 말이다.',
    why: '일상어에서 섞어 쓴다.',
    breaker: '목욕물 한 컵과 욕조 가득은 온도가 같아도 열의 양이 다르다.',
    adultsToo: true },
];

export const MC_BY_ID: Record<string, Misconception> =
  Object.fromEntries(MISCONCEPTIONS.map((m) => [m.id, m]));

/* ---------------- 유닛 ---------------- */
export interface Term {
  ko: string;
  /** ★ 학교가 영어라 필수. photosynthesis ↔ 광합성 */
  en: string;
  note?: string;
}

export interface ScienceUnit {
  id: string;
  model: BigModel;
  band: Band;
  field: Field;
  /** ① 앵커 현상 — 이상한 일. 질문 형태로 */
  anchor: string;
  /** ② 아이에게 먼저 묻는다 (설명을 주기 전에) */
  askFirst: string;
  /** ③ 과학자의 설명 */
  modelSays: string;
  /** ④ 증거 id들. home 또는 proxy 최소 1개 필수 */
  evidenceIds: string[];
  /** ⑤ 용어는 마지막 */
  terms: Term[];
  /** 이 유닛에서 무너뜨려야 할 오개념 */
  mcIds?: string[];
  /** 학교 진도 연결 */
  school?: string;
  /** 다음 유닛 */
  next?: string[];
}

export const UNITS: ScienceUnit[] = [
  {
    id: 'sci-dissolve',
    model: 'particle',
    band: 'E',
    field: 'chem',
    anchor: '설탕을 물에 넣으면 사라진다. 어디로 갔을까?',
    askFirst: '없어진 걸까, 어디 있는 걸까? 없어졌다면 무게는 어떻게 될까? 먼저 예상을 말해봐.',
    modelSays:
      '설탕은 눈에 안 보일 만큼 작은 알갱이로 쪼개져 물 알갱이 사이사이에 흩어졌다. ' +
      '사라진 게 아니라 흩어진 것이다.',
    evidenceIds: ['ev-ink-spread'],
    terms: [
      { ko: '용해', en: 'dissolving' },
      { ko: '용액', en: 'solution' },
      { ko: '용질', en: 'solute', note: '녹는 것 (설탕)' },
      { ko: '용매', en: 'solvent', note: '녹이는 것 (물)' },
    ],
    mcIds: ['mc-dissolve-gone'],
    school: '초5-1 과학 · 용해와 용액',
    next: ['sci-heat'],
  },
  {
    id: 'sci-heat',
    model: 'energy',
    band: 'E',
    field: 'phys',
    anchor: '같은 방에 있었는데 왜 쇠 숟가락만 차가울까?',
    askFirst: '쇠가 원래 차가운 걸까? 온도계로 재면 몇 도가 나올 것 같아? 먼저 적어봐.',
    modelSays:
      '둘 다 방 온도로 똑같다. 다만 쇠는 손의 열을 빨리 가져가고 나무는 천천히 가져간다. ' +
      '「차갑다」는 느낌은 온도가 아니라 열이 빠져나가는 속도다.',
    evidenceIds: ['ev-spoon-cold'],
    terms: [
      { ko: '온도', en: 'temperature' },
      { ko: '열', en: 'heat' },
      { ko: '전도', en: 'conduction' },
    ],
    mcIds: ['mc-metal-cold', 'mc-heat-is-temp'],
    school: '초5-1 과학 · 온도와 열',
    next: [],
  },
];

export const UNIT_BY_ID: Record<string, ScienceUnit> =
  Object.fromEntries(UNITS.map((u) => [u.id, u]));

/* ---------------- 예측 기록 ----------------
   ⚠️ 이 사이트에는 DB가 없다. 아이는 종이에 예측을 쓰고,
      사이트에서는 정답이 <details> 로 접혀 있다(명예제도).
      아빠가 나중에 여기에 옮겨 적는다. 실시간 잠금은 포기했다. */
export interface Prediction {
  id: string;
  date: string;
  unitId: string;
  /** 세연이가 실험 전에 쓴 예측 */
  predicted: string;
  /** 실제로 일어난 일 */
  observed: string;
  /** 어긋났다면 왜 그렇게 생각했었나 — 여기가 학습의 핵심 */
  explained?: string;
  hit?: boolean;
  note?: string;
}

export const PREDICTIONS: Prediction[] = [
  {
    id: 'pr-2026-09-06-spoon',
    date: '2026-09-06',
    unitId: 'sci-heat',
    predicted: '쇠가 더 낮게 나올 것 같다. 15도쯤?',
    observed: '둘 다 24도로 똑같았다.',
    explained:
      '"만지면 차가우니까 온도가 낮은 줄 알았다"고 함. ' +
      '느낌과 온도를 같은 것으로 보고 있었다.',
    hit: false,
    note:
      '⭐ 틀린 예측이 정답보다 값지다. 어긋난 순간에 표정이 바뀌었다. ' +
      '여기서 「느낌 ≠ 온도」를 스스로 말하게 했다.',
  },
];

/* ---------------- 파생 ---------------- */
export const unitsOfModel = (m: BigModel) => UNITS.filter((u) => u.model === m);
export const unitsOfBand = (b: Band) => UNITS.filter((u) => u.band === b);
export const evidencesOf = (u: ScienceUnit) =>
  u.evidenceIds.map((id) => EVIDENCE_BY_ID[id]).filter(Boolean);
export const mcsOf = (u: ScienceUnit) =>
  (u.mcIds ?? []).map((id) => MC_BY_ID[id]).filter(Boolean);
export const predictionsOf = (unitId: string) =>
  PREDICTIONS.filter((p) => p.unitId === unitId);

/** home 또는 proxy 증거가 있는가 — 유닛의 필수 조건 */
export const hasHandsOn = (u: ScienceUnit) =>
  evidencesOf(u).some((e) => e.kind === 'home' || e.kind === 'proxy');
