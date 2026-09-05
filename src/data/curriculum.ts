/**
 * 교육과정 학년 매핑 + 세연이 현재 진도
 *
 * ⚠️ 학교 진도(여기, 정적 데이터)와 백지 훈련 숙달도(Supabase math_progress)는
 *    완전히 다른 축입니다. 학교에서 배운 것 ≠ 백지에 재구성할 수 있는 것.
 *    이 사이트의 존재 이유가 그 격차를 메우는 것입니다.
 *
 * 진도가 나가면 아래 SEYEON 값 하나만 고치면 사이트 전체가 따라옵니다.
 */

export interface Stage {
  n: number;
  label: string;
  short: string;
  band: 'E' | 'M' | 'H' | 'U';
}

export const STAGES: Stage[] = [
  { n: 1,  label: '초등 1학년 1학기', short: '초1-1', band: 'E' },
  { n: 2,  label: '초등 1학년 2학기', short: '초1-2', band: 'E' },
  { n: 3,  label: '초등 2학년',       short: '초2',   band: 'E' },
  { n: 4,  label: '초등 2학년 2학기', short: '초2-2', band: 'E' },
  { n: 5,  label: '초등 3학년',       short: '초3',   band: 'E' },
  { n: 6,  label: '초등 3학년 2학기', short: '초3-2', band: 'E' },
  { n: 7,  label: '초등 4학년',       short: '초4',   band: 'E' },
  { n: 8,  label: '초등 4학년 2학기', short: '초4-2', band: 'E' },
  { n: 9,  label: '초등 5학년 1학기', short: '초5-1', band: 'E' },
  { n: 10, label: '초등 5학년 2학기', short: '초5-2', band: 'E' },
  { n: 11, label: '초등 6학년 1학기', short: '초6-1', band: 'E' },
  { n: 12, label: '초등 6학년 2학기', short: '초6-2', band: 'E' },
  { n: 13, label: '중학교 1학년',     short: '중1',   band: 'M' },
  { n: 14, label: '중학교 2학년',     short: '중2',   band: 'M' },
  { n: 15, label: '중학교 3학년',     short: '중3',   band: 'M' },
  { n: 16, label: '고1 공통수학',     short: '고1',   band: 'H' },
  { n: 17, label: '고2 수학Ⅰ·Ⅱ',     short: '고2',   band: 'H' },
  { n: 18, label: '고3 미적분·확통·기하', short: '고3', band: 'H' },
  { n: 19, label: '대학',             short: '대학', band: 'U' },
];

export const STAGE_BY_N: Record<number, Stage> =
  Object.fromEntries(STAGES.map((s) => [s.n, s]));

/** 초5-2 단원 (세연이가 지금 있는 학기) */
export const UNITS_5_2 = [
  { unit: 1, name: '수의 범위와 어림하기', concepts: ['e-est'] },
  { unit: 2, name: '분수의 곱셈',         concepts: ['e-frac-op'] },
  { unit: 3, name: '합동과 대칭',         concepts: ['e-sym'] },
  { unit: 4, name: '소수의 곱셈',         concepts: ['e-dec'] },
  { unit: 5, name: '직육면체',            concepts: ['e-solid'] },
  { unit: 6, name: '평균과 가능성',       concepts: ['e-avg', 'e-prob-intro'] },
];

/** 세연이 현재 위치 — 진도 나가면 여기만 수정 */
export const SEYEON = {
  name: '세연',
  grade: '초등 5학년',
  stage: 10,          // 초5-2
  unit: 4,            // 4단원 진행 중
  unitName: '소수의 곱셈',
  updated: '2026-09-05',
};

/** 개념 → 처음 배우는 학년(stage). 5-2 개념은 단원 번호까지. */
type Place = number | { stage: number; unit: number };

export const PLACE: Record<string, Place> = {
  // ── 초등 ──
  'e-count': 1, 'e-pattern': 1, 'e-add-sub': 1,
  'e-shape': 3, 'e-unit': 3,
  'e-mul-div': 5, 'e-frac': 5, 'e-box': 5,
  'e-est': 7, 'e-angle': 7, 'e-table-graph': 7,
  'e-order': 9, 'e-factor': 9, 'e-gcd-lcm': 9, 'e-perim-area': 9,
  'e-frac-op': { stage: 10, unit: 2 },
  'e-sym':     { stage: 10, unit: 3 },
  'e-dec':     { stage: 10, unit: 4 },   // 3학년 도입 → 5-2에서 소수의 곱셈으로 심화
  'e-solid':   { stage: 10, unit: 5 },
  'e-avg':     { stage: 10, unit: 6 },
  'e-prob-intro': { stage: 10, unit: 6 },
  'e-ratio': 11, 'e-frac-dec-pct': 11, 'e-time-speed': 11,
  'e-circle': 12, 'e-prop': 12,
  'e-neg': 13, 'e-pow': 13, 'e-coord': 13,

  // ── 중학교 ──
  'm-int': 13, 'm-prime': 13, 'm-var': 13, 'm-expr': 13, 'm-eq1': 13,
  'm-coord': 13, 'm-func': 13, 'm-inv': 13, 'm-basic-geo': 13,
  'm-angle-par': 13, 'm-poly-angle': 13, 'm-circle-basic': 13,
  'm-solid': 13, 'm-stat': 13,

  'm-rational-dec': 14, 'm-ineq1': 14, 'm-sim': 14, 'm-lin': 14,
  'm-slope': 14, 'm-lin-sys': 14, 'm-tri-cong': 14, 'm-tri-prop': 14,
  'm-quad-prop': 14, 'm-proof': 14, 'm-count': 14, 'm-prob': 14,

  'm-sqrt': 15, 'm-real': 15, 'm-approx': 15, 'm-poly-mul': 15,
  'm-factor': 15, 'm-eq2': 15, 'm-quad-formula': 15, 'm-quad': 15,
  'm-quad-shift': 15, 'm-quad-general': 15, 'm-abs': 15,
  'm-similar': 15, 'm-pyth': 15, 'm-trig-ratio': 15,
  'm-circle-prop': 15, 'm-scatter': 15,
};

/** H/U는 area 규칙으로 자동 배치 */
function placeFromArea(lv: string, area: string): number {
  if (lv === 'U') return 19;
  if (lv === 'H') {
    if (area.startsWith('공통수학')) return 16;
    if (area.startsWith('수학Ⅰ') || area.startsWith('수학Ⅱ')) return 17;
    return 18; // 미적분 / 확률과 통계 / 기하
  }
  return 19;
}

export function stageOf(c: { id: string; lv: string; area: string }): number {
  const p = PLACE[c.id];
  if (typeof p === 'number') return p;
  if (p) return p.stage;
  return placeFromArea(c.lv, c.area);
}

export function unitOf(c: { id: string }): number | null {
  const p = PLACE[c.id];
  return p && typeof p === 'object' ? p.unit : null;
}

export type SchoolStatus = 'learned' | 'current' | 'upcoming';

/** 세연이 기준: 학교에서 배웠는가? */
export function schoolStatus(c: { id: string; lv: string; area: string }): SchoolStatus {
  const st = stageOf(c);
  const un = unitOf(c);
  if (st < SEYEON.stage) return 'learned';
  if (st > SEYEON.stage) return 'upcoming';
  if (un === null) return 'current';
  if (un < SEYEON.unit) return 'learned';
  if (un === SEYEON.unit) return 'current';
  return 'upcoming';
}

export const SCHOOL_LABEL: Record<SchoolStatus, string> = {
  learned:  '배운 곳',
  current:  '지금 여기',
  upcoming: '앞으로',
};
