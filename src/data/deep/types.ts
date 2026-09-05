/**
 * 심층 개념 데이터 스키마
 *
 * concepts.ts 는 "지도"이고, 여기는 "본문"입니다.
 * 개념 하나를 백지에서 완전히 재구성하는 데 필요한 모든 것.
 */

export interface Formula {
  /** KaTeX 수식 */
  tex: string;
  /** 이 수식이 말하는 것 — 한국어 한 줄 */
  say: string;
}

export interface Misconception {
  /** 아이가 흔히 갖는 틀린 생각 */
  wrong: string;
  /** 왜 그렇게 생각하게 되는가 (원인) */
  why: string;
  /** 어떻게 깨뜨리는가 — 반례나 그림 */
  fix: string;
}

export interface Example {
  q: string;
  a: string;
  /** 이 문제가 무엇을 시험하는가 */
  note?: string;
}

export interface Deep {
  /** 한 문장 직관 — 이것만 남으면 성공 */
  intuition: string;
  /** 형식적 정의 (중등 이상은 엄밀하게) */
  formal?: string;
  /** 핵심 공식·정리 */
  formulas?: Formula[];
  /** 흔한 오개념 */
  misconceptions?: Misconception[];
  /** 시험·문제풀이 함정 */
  traps?: string[];
  /** 대표 예제 */
  examples?: Example[];
  /** 왜 이 개념이 태어났는가 — 발견의 순서 */
  history?: string;
  /** 실생활·다른 분야 연결 */
  realworld?: string[];
  /** 백지 훈련 단계 — 순서대로 시키면 됨 */
  blankSteps?: string[];
  /** 아빠가 물어볼 확인 질문 (답할 수 있으면 통과) */
  checks?: string[];
  /** 다음 개념으로 어떻게 이어지는가 */
  bridge?: string;
  /** 이 개념을 설명할 때 쓸 도구·교구 */
  props?: string[];
}

export type DeepMap = Record<string, Deep>;
