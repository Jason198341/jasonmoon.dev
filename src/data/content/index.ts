import type { Progress, RecordEntry, JournalEntry } from './types';

export * from './types';

/* ============================================================
   백지 숙달도 — 학교 진도와 별개.
   "백지에 아무것도 없이 다시 그릴 수 있는가"만 센다.
   ============================================================ */
export const PROGRESS: Record<string, Progress> = {
  // 'e-circle': { status: 'doing', mastery: 2, reviewed: '2026-09-05' },
};

/* ============================================================
   백지 훈련 기록
   ============================================================ */
export const RECORDS: RecordEntry[] = [
  // {
  //   conceptId: 'e-circle', date: '2026-09-06', who: '세연',
  //   before: '원 넓이는… 반지름 곱하기 반지름?',
  //   after: '피자로 잘라서 네모 만들면 가로가 πr, 세로가 r',
  //   score: 4, note: '실 자르기에서 3개 나온 순간 표정이 바뀜',
  //   images: ['/files/photo/2026-09-06_원.jpg'],
  // },
];

/* ============================================================
   일지
   ============================================================ */
export const JOURNAL: JournalEntry[] = [
  // {
  //   id: '2026-09-06-circle', date: '2026-09-06', mood: 'break',
  //   title: '실을 잘랐더니 3개가 나왔다',
  //   body: '…', conceptIds: ['e-circle'],
  // },
];




/* ---------------- 파생 ---------------- */
export const recordsOf = (conceptId: string) =>
  RECORDS.filter((r) => r.conceptId === conceptId)
         .sort((a, b) => b.date.localeCompare(a.date));

export const byDateDesc = <T extends { date: string }>(xs: T[]) =>
  [...xs].sort((a, b) => b.date.localeCompare(a.date));
