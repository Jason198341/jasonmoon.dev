import type { Deep, DeepMap } from './types';
import { DEEP_E } from './E';
import { DEEP_M } from './M';
import { DEEP_H } from './H';
import { DEEP_U } from './U';

export * from './types';

export const DEEP: DeepMap = {
  ...DEEP_E,
  ...DEEP_M,
  ...DEEP_H,
  ...DEEP_U,
};

export const getDeep = (id: string): Deep | undefined => DEEP[id];

/** 심층 데이터가 채워진 개념 수 */
export const DEEP_COUNT = Object.keys(DEEP).length;
