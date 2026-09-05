/**
 * 아빠 예습 — 정적 데이터 (DB 아님)
 *
 * DB 읽기 비용 때문에 코드에 하드코딩한다.
 * 새 예습을 쓸 때는 이 폴더의 파일에 추가하고 배포하면 된다.
 *
 * 제1원칙 프로토콜 순서를 그대로 필드로 둔다:
 *   출발점(공리) → 원자 분해 → 인과 사슬 → 메커니즘 → 경계
 */

export type PrepStatus = 'todo' | 'drafting' | 'ready' | 'taught';

/** 자기 점검 7항목 — 하나라도 아니오면 고치고 나서 가르친다 */
export const CHECK_ITEMS = [
  { key: 'axiom',    label: '출발점(공리)을 명시했는가' },
  { key: 'undef',    label: '정의 없이 쓴 용어가 없는가' },
  { key: 'leap',     label: '"따라서/당연히"로 건너뛴 단계가 없는가' },
  { key: 'naming',   label: '이름 붙이기로 설명을 대신하지 않았는가' },
  { key: 'analogy',  label: '비유의 깨지는 지점을 말했는가' },
  { key: 'boundary', label: '이 설명이 틀릴 조건을 말했는가' },
  { key: 'rederive', label: '아이가 나 없이 재도출할 수 있는가' },
] as const;

export type CheckKey = typeof CHECK_ITEMS[number]['key'];

export const PREP_LABEL: Record<PrepStatus, string> = {
  todo: '예습 전',
  drafting: '대본 작성 중',
  ready: '준비 완료',
  taught: '가르침',
};

export interface Prep {
  status: PrepStatus;
  /** ① 출발점 — 이 설명이 전제하는 공리·사실 */
  axioms?: string;
  /** ② 원자 분해 — 정의되지 않은 용어 없게 */
  atoms?: string;
  /** ③ 인과 사슬 — A이므로 B, 매 단계 왜 */
  chain?: string;
  /** ④ 메커니즘 — 무엇이 아니라 어떻게 */
  mechanism?: string;
  /** ⑤ 경계 — 언제 성립하고 언제 깨지는가 + 흔한 오해 */
  boundary?: string;
  /** 비유 + 이 비유가 깨지는 지점 */
  analogy?: string;
  /** 실제로 말할 대본 */
  script?: string;
  /** 아이에게 던질 확인 질문 */
  questions?: string;
  /** 준비물·교구 */
  props?: string;
  /** 설계 메모 (AI와 짠 초안 등) */
  notes?: string;
  /** 예상 소요(분) */
  minutes?: number;
  /** 자기 점검 */
  checklist?: Partial<Record<CheckKey, boolean>>;
  /** 가르친 날 */
  taughtAt?: string;
  /** 마지막 수정일 */
  updated?: string;
}

export type PrepMap = Record<string, Prep>;

/** 필드 표시 순서와 제목 */
export const PREP_FIELDS = [
  ['axioms',    '① 출발점 — 전제하는 공리·사실'],
  ['atoms',     '② 원자 분해 — 정의되지 않은 용어 금지'],
  ['chain',     '③ 인과 사슬 — 논리 비약 제거'],
  ['mechanism', '④ 메커니즘 — 무엇이 아니라 어떻게'],
  ['boundary',  '⑤ 경계 — 언제 깨지는가 · 흔한 오해'],
  ['analogy',   '비유 + 깨지는 지점'],
  ['script',    '말할 대본'],
  ['questions', '확인 질문'],
  ['props',     '준비물'],
  ['notes',     '설계 메모'],
] as const;
