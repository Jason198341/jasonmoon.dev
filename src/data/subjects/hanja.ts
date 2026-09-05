/**
 * 한자 — 부품 조립 그래프
 *
 * 11과목 중 수학 틀을 가장 많이 계승하는 과목.
 * 다만 "선수/후속 DAG"를 "부품 포함 그래프"로 교체한다.
 *   日 + 月 = 明   ← 수학의 선수관계보다 오히려 엄격하다
 *
 * 글자를 외우는 과목이 아니다.
 * 검증은 훈음 암기가 아니라 **처음 보는 낱말의 뜻을 추론하는 것**이다.
 *
 * 글자 선정은 임의로 하지 않는다.
 * 국어 초견에서 세연이가 모른다고 표시한 낱말(미지어)에서 역산해 고른다.
 */

/** 글자 하나 */
export interface Char {
  /** 한자 */
  c: string;
  /** 훈 (뜻) */
  mean: string;
  /** 음 (소리) */
  sound: string;
  /** 획수 */
  strokes?: number;
  /** 급수 (8급이 가장 쉬움) */
  level?: 8 | 7 | 6 | 5 | 4;
  /** 이 글자를 이루는 부품들. 부품이 없으면(기초 글자) 빈 배열 */
  parts: string[];
  /** 왜 그 부품들이 그 뜻을 만드는가 — 자원(字源) 이야기 */
  origin?: string;
  /** ⚠️ 지어낸 이야기는 금지. 근거가 약하면 여기에 명시 */
  originNote?: string;
  /** 이 글자가 들어간 낱말 (국어 어휘와 잇는 다리) */
  words?: string[];
  /** 국어 미지어에서 왔다면 그 낱말 */
  fromUnknown?: string[];
}

export const CHARS: Char[] = [
  /* --- 기초 부품 (더 안 쪼개짐) --- */
  { c: '日', mean: '날', sound: '일', strokes: 4, level: 8, parts: [],
    origin: '해를 그린 그림. 가운데 점은 해의 무늬.',
    words: ['일요일', '생일', '매일'] },
  { c: '月', mean: '달', sound: '월', strokes: 4, level: 8, parts: [],
    origin: '초승달을 그린 그림. 해(日)와 구분하려고 이지러진 모양으로 그렸다.',
    words: ['월요일', '개월', '세월'] },
  { c: '木', mean: '나무', sound: '목', strokes: 4, level: 8, parts: [],
    origin: '나무를 그린 그림. 가운데 줄기, 위는 가지, 아래는 뿌리.',
    words: ['목재', '식목일'] },
  { c: '人', mean: '사람', sound: '인', strokes: 2, level: 8, parts: [],
    origin: '사람이 옆으로 서 있는 모습.',
    words: ['인간', '한국인'] },
  { c: '言', mean: '말씀', sound: '언', strokes: 7, level: 6, parts: [],
    origin: '입에서 소리가 나오는 모양.',
    words: ['언어', '방언'] },
  { c: '数', mean: '셈', sound: '수', strokes: 13, level: 7, parts: [],
    words: ['수학', '점수', '추산'] },

  /* --- 조립된 글자 --- */
  { c: '明', mean: '밝을', sound: '명', strokes: 8, level: 6, parts: ['日', '月'],
    origin: '해(日)와 달(月)을 나란히 놓았다. 둘 다 밝은 것이니 「밝다」.',
    originNote: '가장 널리 알려진 설명이지만, 원래는 창문(囧)과 달이었다는 설도 있다. ' +
                '세연이에게는 두 설을 다 말해주고 "어느 쪽이 더 그럴듯해?"를 묻는다.',
    words: ['명확', '설명', '발명', '분명'] },
  { c: '林', mean: '수풀', sound: '림', strokes: 8, level: 7, parts: ['木', '木'],
    origin: '나무(木) 둘이면 숲. 셋이면 森(빽빽할 삼).',
    words: ['산림', '밀림'] },
  { c: '休', mean: '쉴', sound: '휴', strokes: 6, level: 7, parts: ['人', '木'],
    origin: '사람(人)이 나무(木)에 기대어 있다.',
    words: ['휴식', '휴일', '연휴'] },

  /* --- 국어 미지어에서 역산해 고른 글자 --- */
  { c: '推', mean: '밀', sound: '추', strokes: 11, level: 4, parts: [],
    origin: '손(扌)으로 미는 것. 「밀어서 알아낸다」로 뜻이 넓어져 추측·추론에 쓴다.',
    words: ['추산', '추측', '추론', '추진'],
    fromUnknown: ['추산'] },
  { c: '緩', mean: '느릴', sound: '완', strokes: 15, level: 4, parts: [],
    origin: '실(糸)이 느슨한 것. 그래서 「늦추다·풀다」.',
    words: ['완화', '완만', '완충'],
    fromUnknown: ['완화'] },
  { c: '微', mean: '작을', sound: '미', strokes: 13, level: 4, parts: [],
    origin: '아주 작아 눈에 잘 안 띄는 것.',
    words: ['미묘', '미세', '현미경'],
    fromUnknown: ['미묘하다'] },
];

export const CHAR_BY_C: Record<string, Char> =
  Object.fromEntries(CHARS.map((c) => [c.c, c]));

/** 이 글자를 부품으로 쓰는 글자들 (역방향) */
export const usedIn = (c: string) => CHARS.filter((x) => x.parts.includes(c));

/** 부품이 없는 기초 글자 */
export const atoms = () => CHARS.filter((c) => c.parts.length === 0);

/* ============================================================
   검증 — 훈음 암기가 아니라 「처음 보는 낱말 뚫기」
   ============================================================ */
export interface WordGuess {
  id: string;
  date: string;
  /** 처음 보는 낱말 */
  word: string;
  /** 세연이가 쪼갠 결과 */
  split?: string;
  /** 세연이가 추측한 뜻 */
  guess?: string;
  /** 실제 뜻 */
  actual?: string;
  /** 맞았나 */
  hit?: boolean;
  note?: string;
}

export const WORD_GUESSES: WordGuess[] = [
  {
    id: 'wg-2026-09-08',
    date: '2026-09-08',
    word: '추산',
    split: '推(밀 추) + 算(셈 산)',
    guess: '밀어서 세는 것? → 대충 세보는 것',
    actual: '어림잡아 계산함',
    hit: true,
    note:
      '「밀어서 센다」에서 「어림잡는다」로 스스로 건너뛰었다. 이게 목표한 능력이다. ' +
      '외운 게 아니라 부품에서 추론했다.',
  },
];

/** 추론 정답률 */
export const guessRate = () => {
  const done = WORD_GUESSES.filter((g) => g.hit !== undefined);
  if (!done.length) return null;
  return done.filter((g) => g.hit).length / done.length;
};
