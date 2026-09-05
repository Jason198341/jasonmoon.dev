import type { Prep, PrepMap } from './types';
import { PREP_E } from './E';

export * from './types';

/** 아빠 예습 노트 — 전부 정적 코드. DB 안 씀. */
export const PREP: PrepMap = { ...PREP_E };

export const getPrep = (id: string): Prep | undefined => PREP[id];

export const prepCount = (s: Prep['status']) =>
  Object.values(PREP).filter((p) => p.status === s).length;
