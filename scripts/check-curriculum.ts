import { CONCEPTS } from '../src/data/concepts';
import { stageOf, schoolStatus, SEYEON, STAGE_BY_N } from '../src/data/curriculum';

const g: Record<string, number> = {};
CONCEPTS.forEach((c) => { const s = schoolStatus(c); g[s] = (g[s] || 0) + 1; });
console.log('세연이 기준 분포:', JSON.stringify(g), '/ 총', CONCEPTS.length);
console.log('현재 위치:', STAGE_BY_N[SEYEON.stage].label, SEYEON.unit + '단원', SEYEON.unitName);
console.log('--- 지금 여기 ---');
CONCEPTS.filter((c) => schoolStatus(c) === 'current').forEach((c) => console.log('  ', c.id, c.name));
console.log('--- 바로 다음 (초5-2 잔여 + 초6) ---');
CONCEPTS.filter((c) => schoolStatus(c) === 'upcoming' && stageOf(c) <= 12)
  .forEach((c) => console.log('  ', STAGE_BY_N[stageOf(c)].short, c.id, c.name));
console.log('미매핑:', CONCEPTS.filter((c) => !stageOf(c)).length);
