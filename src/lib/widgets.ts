/**
 * 인터랙티브 위젯 엔진 — 순수 SVG + JS, 외부 라이브러리 없음
 *
 * 수학은 같은 시각 메커니즘이 반복된다.
 * 넓이 모델 하나가 곱셈 → 분배법칙 → 전개 → 인수분해를 전부 덮는다.
 * 그래서 개념마다 새로 만들지 않고, 타입을 파라미터로 재사용한다.
 */

export interface Control {
  key: string;
  label: string;
  /** 이산 값 목록 (있으면 슬라이더가 인덱스로 동작) */
  values?: number[];
  min?: number;
  max?: number;
  step?: number;
  def: number;
  /** 값 표시 포맷 */
  fmt?: (v: number) => string;
}

export interface WidgetDef {
  title: string;
  hint?: string;
  controls: Control[];
  /** SVG viewBox */
  vb: string;
  render: (p: Record<string, number>, opt: Record<string, any>) => string;
  caption?: (p: Record<string, number>, opt: Record<string, any>) => string;
}

/* ---------------- 팔레트 (본문과 동일 계열) ---------------- */
const INK = '#2C2C2A';
const SUB = '#5F5E5A';
const MINT = '#5DCAA5';
const CORAL = '#F0997B';
const BLUE = '#1D4F9C';
const RED = '#C8102E';
const GREY = '#C9CDD4';
const HL = '#FFF3A3';

const n2 = (x: number) => Number(x).toFixed(2);
const esc = (s: unknown) =>
  String(s).replace(/[&<>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]!));

const txt = (
  x: number, y: number, s: string,
  o: { size?: number; fill?: string; anchor?: string; weight?: number } = {},
) =>
  `<text x="${n2(x)}" y="${n2(y)}" font-size="${o.size ?? 13}" fill="${o.fill ?? INK}"` +
  ` text-anchor="${o.anchor ?? 'middle'}" font-weight="${o.weight ?? 400}">${esc(s)}</text>`;

const line = (x1: number, y1: number, x2: number, y2: number, c = INK, w = 1, dash = '') =>
  `<line x1="${n2(x1)}" y1="${n2(y1)}" x2="${n2(x2)}" y2="${n2(y2)}" stroke="${c}"` +
  ` stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;

const rect = (x: number, y: number, w: number, h: number, fill: string, stroke = '#fff', sw = 0.8) =>
  `<rect x="${n2(x)}" y="${n2(y)}" width="${n2(Math.max(0, w))}" height="${n2(Math.max(0, h))}"` +
  ` fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;

const circ = (cx: number, cy: number, r: number, fill: string, stroke = 'none', sw = 1) =>
  `<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(r)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;

const path = (d: string, fill: string, stroke = 'none', sw = 1) =>
  `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;

/** 가로 브래킷 */
const hBracket = (x1: number, x2: number, y: number, label: string, c = SUB) =>
  `<path d="M ${n2(x1)} ${n2(y - 5)} L ${n2(x1)} ${n2(y)} L ${n2(x2)} ${n2(y)} L ${n2(x2)} ${n2(y - 5)}"` +
  ` fill="none" stroke="${c}" stroke-width="1"/>` +
  txt((x1 + x2) / 2, y + 16, label, { size: 12.5, weight: 500 });

/** 세로 브래킷 */
const vBracket = (y1: number, y2: number, x: number, label: string, c = SUB) =>
  `<path d="M ${n2(x + 5)} ${n2(y1)} L ${n2(x)} ${n2(y1)} L ${n2(x)} ${n2(y2)} L ${n2(x + 5)} ${n2(y2)}"` +
  ` fill="none" stroke="${c}" stroke-width="1"/>` +
  txt(x - 8, (y1 + y2) / 2 + 4, label, { size: 12.5, weight: 500, anchor: 'end' });

/* ============================================================
   1. 자릿값 — 10개 모이면 왼쪽으로
   ============================================================ */
const placeValue: WidgetDef = {
  title: '자릿값 — 몇 개씩 묶느냐',
  hint: '묶는 개수(밑)를 바꾸면 같은 수가 다르게 적힌다. 컴퓨터는 2씩 묶는다.',
  vb: '0 0 680 240',
  controls: [
    { key: 'n', label: '수', min: 5, max: 120, step: 1, def: 37 },
    { key: 'base', label: '몇 개씩 묶기', values: [2, 3, 5, 10], def: 3 },
  ],
  render: (p) => {
    const N = Math.round(p.n), B = Math.round(p.base);
    const digits: number[] = [];
    let v = N;
    while (v > 0) { digits.unshift(v % B); v = Math.floor(v / B); }
    if (!digits.length) digits.push(0);

    let s = txt(340, 24, `${N}개를 ${B}개씩 묶으면`, { size: 14, weight: 500 });
    // 점 그리기
    const per = 10, r = 4.2;
    let idx = 0, x0 = 40, y0 = 46;
    const groups = Math.floor(N / B), rest = N % B;
    for (let gi = 0; gi < groups; gi++) {
      const gx = x0 + (gi % per) * 62, gy = y0 + Math.floor(gi / per) * 34;
      s += rect(gx - 4, gy - 12, Math.min(B, 12) * 8 + 8, 24, '#F2F6F4', MINT, 1);
      for (let k = 0; k < Math.min(B, 12); k++) s += circ(gx + k * 8 + 2, gy, r, MINT);
      idx++;
    }
    const restY = y0 + Math.floor(groups / per) * 34 + 40;
    for (let k = 0; k < rest; k++) s += circ(40 + k * 10, restY, r, CORAL);
    if (rest) s += txt(40 + rest * 10 + 22, restY + 4, `남은 ${rest}개`, { size: 12, fill: SUB, anchor: 'start' });

    // 자릿값 표
    const tw = 54, tx = 340 - (digits.length * tw) / 2, ty = 176;
    digits.forEach((d, i) => {
      const x = tx + i * tw;
      s += rect(x, ty, tw - 4, 34, i % 2 ? '#FFF' : '#FAFAF7', GREY, 1);
      s += txt(x + (tw - 4) / 2, ty + 23, String(d), { size: 18, weight: 500 });
      const pw = digits.length - 1 - i;
      s += txt(x + (tw - 4) / 2, ty + 50, pw === 0 ? '1' : `${B}${pw > 1 ? '^' + pw : ''}`,
        { size: 11.5, fill: SUB });
    });
    return s;
  },
  caption: (p) => {
    const N = Math.round(p.n), B = Math.round(p.base);
    const d: number[] = []; let v = N;
    while (v > 0) { d.unshift(v % B); v = Math.floor(v / B); }
    return `${N} = ${d.join('')}${B === 10 ? '' : `(${B}진법)`} — 자리는 ${B}의 거듭제곱`;
  },
};

/* ============================================================
   2. 수직선 — 방향·경계·절댓값
   ============================================================ */
const numberLine: WidgetDef = {
  title: '수직선 — 방향이 곧 부호',
  hint: '오른쪽은 더하기, 왼쪽은 빼기. 0 왼쪽으로 나가면 음수.',
  vb: '0 0 680 190',
  controls: [
    { key: 'a', label: '시작', min: -10, max: 10, step: 1, def: 3 },
    { key: 'b', label: '이동', min: -10, max: 10, step: 1, def: -5 },
  ],
  render: (p) => {
    const A = Math.round(p.a), B = Math.round(p.b), R = A + B;
    const lo = -12, hi = 12, x0 = 40, x1 = 640;
    const X = (v: number) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
    const Y = 110;
    let s = line(x0, Y, x1, Y, INK, 1.4);
    for (let v = lo; v <= hi; v++) {
      const big = v % 5 === 0 || v === 0;
      s += line(X(v), Y - (big ? 8 : 4), X(v), Y + (big ? 8 : 4), v === 0 ? INK : GREY, v === 0 ? 1.6 : 1);
      if (big) s += txt(X(v), Y + 26, String(v), { size: 11.5, fill: v === 0 ? INK : SUB });
    }
    // 화살표
    const dir = B >= 0 ? 1 : -1;
    const ax0 = X(A), ax1 = X(R);
    s += `<path d="M ${n2(ax0)} ${n2(Y - 30)} Q ${n2((ax0 + ax1) / 2)} ${n2(Y - 62)} ${n2(ax1)} ${n2(Y - 30)}"` +
         ` fill="none" stroke="${B >= 0 ? MINT : CORAL}" stroke-width="2.4"/>`;
    s += path(`M ${n2(ax1)} ${n2(Y - 30)} l ${dir * -7} -7 l 0 14 Z`, B >= 0 ? MINT : CORAL);
    s += circ(ax0, Y, 5.5, '#fff', INK, 1.6);
    s += circ(ax1, Y, 6, B >= 0 ? MINT : CORAL);
    s += txt((ax0 + ax1) / 2, Y - 68, `${B >= 0 ? '+' : ''}${B}`, { size: 14, weight: 500, fill: B >= 0 ? MINT : CORAL });
    s += txt(340, 26, `${A} ${B >= 0 ? '+' : '−'} ${Math.abs(B)} = ${R}`, { size: 17, weight: 500 });
    s += txt(340, 166, `|${R}| = ${Math.abs(R)}  (0에서 떨어진 거리)`, { size: 12.5, fill: SUB });
    return s;
  },
};

/* ============================================================
   3. 넓이 모델 — 곱셈 = 직사각형
   ============================================================ */
const areaModel: WidgetDef = {
  title: '넓이 모델 — 곱셈은 직사각형이다',
  hint: '가로를 (a+b), 세로를 (c+d)로 쪼개면 네 조각이 나온다. 이 그림이 분배법칙이고 전개이고 인수분해다.',
  vb: '0 0 680 320',
  controls: [
    { key: 'a', label: '가로 첫 조각', min: 1, max: 12, step: 1, def: 10 },
    { key: 'b', label: '가로 둘째 조각', min: 1, max: 12, step: 1, def: 2 },
    { key: 'c', label: '세로 첫 조각', min: 1, max: 12, step: 1, def: 10 },
    { key: 'd', label: '세로 둘째 조각', min: 1, max: 12, step: 1, def: 3 },
  ],
  render: (p) => {
    const a = Math.round(p.a), b = Math.round(p.b), c = Math.round(p.c), d = Math.round(p.d);
    const W = 420, H = 210, x0 = 130, y0 = 50;
    const wa = (a / (a + b)) * W, wb = W - wa;
    const hc = (c / (c + d)) * H, hd = H - hc;
    let s = '';
    s += rect(x0, y0, wa, hc, '#DCF0E8', '#fff', 1);
    s += rect(x0 + wa, y0, wb, hc, '#FCE7DC', '#fff', 1);
    s += rect(x0, y0 + hc, wa, hd, '#FCE7DC', '#fff', 1);
    s += rect(x0 + wa, y0 + hc, wb, hd, '#F3E9F7', '#fff', 1);
    const lab = (cx: number, cy: number, t: string, v: number) =>
      txt(cx, cy - 2, t, { size: 13.5, weight: 500 }) + txt(cx, cy + 16, String(v), { size: 12, fill: SUB });
    s += lab(x0 + wa / 2, y0 + hc / 2, `${a}×${c}`, a * c);
    s += lab(x0 + wa + wb / 2, y0 + hc / 2, `${b}×${c}`, b * c);
    s += lab(x0 + wa / 2, y0 + hc + hd / 2, `${a}×${d}`, a * d);
    s += lab(x0 + wa + wb / 2, y0 + hc + hd / 2, `${b}×${d}`, b * d);
    s += hBracket(x0, x0 + wa, y0 - 12, String(a));
    s += hBracket(x0 + wa, x0 + W, y0 - 12, String(b));
    s += vBracket(y0, y0 + hc, x0 - 14, String(c));
    s += vBracket(y0 + hc, y0 + H, x0 - 14, String(d));
    s += txt(340, y0 + H + 44,
      `(${a}+${b}) × (${c}+${d}) = ${a * c} + ${b * c} + ${a * d} + ${b * d} = ${(a + b) * (c + d)}`,
      { size: 15, weight: 500 });
    s += txt(340, y0 + H + 66, '문자로 바꾸면 (x+b)(x+d) = x² + (b+d)x + bd — 같은 그림', { size: 12, fill: SUB });
    return s;
  },
};

/* ============================================================
   4. 분수 막대 — 통분과 비교
   ============================================================ */
const fractionBars: WidgetDef = {
  title: '분수 막대 — 조각 크기를 맞춰야 더한다',
  hint: '분모가 다르면 조각 크기가 달라서 그냥 더할 수 없다.',
  vb: '0 0 680 260',
  controls: [
    { key: 'n1', label: '① 분자', min: 1, max: 11, step: 1, def: 1 },
    { key: 'd1', label: '① 분모', min: 2, max: 12, step: 1, def: 2 },
    { key: 'n2', label: '② 분자', min: 1, max: 11, step: 1, def: 1 },
    { key: 'd2', label: '② 분모', min: 2, max: 12, step: 1, def: 3 },
  ],
  render: (p) => {
    const n1 = Math.round(p.n1), d1 = Math.round(p.d1);
    const n2v = Math.round(p.n2), d2 = Math.round(p.d2);
    const gcd = (x: number, y: number): number => (y ? gcd(y, x % y) : x);
    const L = d1 * d2 / gcd(d1, d2);
    const X0 = 60, W = 560;
    const bar = (y: number, n: number, d: number, col: string, label: string) => {
      let t = '';
      const w = W / d;
      for (let i = 0; i < d; i++) t += rect(X0 + i * w, y, w, 34, i < n ? col : '#F4F5F6', '#fff', 1.2);
      t += txt(X0 - 12, y + 23, label, { size: 13.5, anchor: 'end', weight: 500 });
      return t;
    };
    let s = bar(40, n1, d1, MINT, `${n1}/${d1}`);
    s += bar(96, n2v, d2, CORAL, `${n2v}/${d2}`);
    const a = n1 * (L / d1), b = n2v * (L / d2);
    s += bar(160, Math.min(a + b, L), L, BLUE, `${a}/${L} + ${b}/${L}`);
    s += txt(340, 226, `${n1}/${d1} + ${n2v}/${d2} = ${a}/${L} + ${b}/${L} = ${a + b}/${L}`,
      { size: 15, weight: 500 });
    s += txt(340, 248, `공통 조각 크기(통분) = 1/${L}`, { size: 12, fill: SUB });
    return s;
  },
};

/* ============================================================
   5. 원 조각 재배열 — 넓이 πr²
   ============================================================ */
const circleSlices: WidgetDef = {
  title: '원을 잘라 네모로 — 넓이 πr²',
  hint: '잘게 자를수록 직사각형에 가까워진다. 가로 πr, 세로 r은 조각 수와 무관하게 고정.',
  vb: '0 0 680 270',
  controls: [{ key: 'n', label: '조각 수', values: [4, 8, 16, 32, 64], def: 1 }],
  render: (p) => {
    const N = Math.round(p.n);
    const R = 90, CX = 120, CY = 150, RX = 270, TOP = 60, BOT = 150;
    const PIR = Math.PI * R;
    let s = '';
    const step = (Math.PI * 2) / N;
    for (let k = 0; k < N; k++) {
      const a0 = k * step - Math.PI / 2, a1 = a0 + step;
      const x0 = CX + R * Math.cos(a0), y0 = CY + R * Math.sin(a0);
      const x1 = CX + R * Math.cos(a1), y1 = CY + R * Math.sin(a1);
      s += path(`M ${CX} ${CY} L ${n2(x0)} ${n2(y0)} A ${R} ${R} 0 ${step > Math.PI ? 1 : 0} 1 ${n2(x1)} ${n2(y1)} Z`,
        k % 2 === 0 ? MINT : CORAL, '#fff', 0.8);
    }
    s += line(CX, CY, CX + R, CY, INK, 1.2) + txt(CX + R / 2, CY - 7, 'r', { weight: 500 });
    s += txt(CX, CY + R + 28, `원을 ${N}조각으로`, { size: 13, fill: SUB });

    const half = step / 2, b = 2 * R * Math.sin(half), h = R * Math.cos(half);
    const wedge = (ax: number, ay: number, up: boolean) => {
      const sg = up ? 1 : -1;
      return `M ${n2(ax)} ${n2(ay)} L ${n2(ax - b / 2)} ${n2(ay + sg * h)}` +
             ` A ${R} ${R} 0 0 ${up ? 1 : 0} ${n2(ax + b / 2)} ${n2(ay + sg * h)} Z`;
    };
    const hf = Math.floor(N / 2);
    for (let k = 0; k < hf; k++) s += path(wedge(RX + b / 2 + k * b, TOP, true), MINT, '#fff', 0.8);
    for (let j = 0; j < N - hf; j++) s += path(wedge(RX + (j + 1) * b, BOT, false), CORAL, '#fff', 0.8);

    s += vBracket(TOP, BOT, 252, 'r');
    s += hBracket(RX, RX + PIR, 170, 'πr = 껍질의 절반');
    s += txt(RX + PIR / 2, 206, '아래 줄 껍질 + 위 줄 껍질 = 원 둘레 2πr', { size: 12, fill: SUB });
    s += txt(RX + PIR / 2, 230,
      N < 32 ? '넓이 ≈ πr × r = πr²  (아직 울퉁불퉁)' : '넓이 = πr × r = πr²  (거의 딱 맞는 직사각형)',
      { size: 14, weight: 500 });
    return s;
  },
};

/* ============================================================
   6. 함수 그래프 플로터
   ============================================================ */
type PlotKind = 'linear' | 'quad' | 'inverse' | 'exp' | 'log' | 'abs' | 'sqrt' | 'sin';

const functionPlot: WidgetDef = {
  title: '그래프 — 계수를 바꾸면 모양이 어떻게 변하나',
  vb: '0 0 680 380',
  controls: [
    { key: 'a', label: 'a', min: -30, max: 30, step: 1, def: 10, fmt: (v) => (v / 10).toFixed(1) },
    { key: 'b', label: 'b', min: -50, max: 50, step: 1, def: 0, fmt: (v) => (v / 10).toFixed(1) },
  ],
  render: (p, o) => {
    const kind: PlotKind = o.kind ?? 'linear';
    const a = p.a / 10, b = p.b / 10;
    const X0 = 40, X1 = 640, Y0 = 30, Y1 = 340;
    const lo = -6, hi = 6, vlo = -6, vhi = 6;
    const PX = (x: number) => X0 + ((x - lo) / (hi - lo)) * (X1 - X0);
    const PY = (y: number) => Y1 - ((y - vlo) / (vhi - vlo)) * (Y1 - Y0);

    let s = '';
    for (let v = lo; v <= hi; v++) s += line(PX(v), Y0, PX(v), Y1, v === 0 ? '#9AA0A6' : '#EDEFF2', v === 0 ? 1.4 : 1);
    for (let v = vlo; v <= vhi; v++) s += line(X0, PY(v), X1, PY(v), v === 0 ? '#9AA0A6' : '#EDEFF2', v === 0 ? 1.4 : 1);
    for (let v = lo; v <= hi; v++) if (v) s += txt(PX(v), PY(0) + 15, String(v), { size: 10.5, fill: SUB });
    for (let v = vlo; v <= vhi; v++) if (v) s += txt(PX(0) - 8, PY(v) + 4, String(v), { size: 10.5, fill: SUB, anchor: 'end' });

    const f = (x: number): number => {
      switch (kind) {
        case 'linear': return a * x + b;
        case 'quad': return a * x * x + b;
        case 'inverse': return x === 0 ? NaN : a / x;
        case 'exp': return Math.pow(Math.max(a, 0.1) + 1, x) + b;
        case 'log': return x <= 0 ? NaN : Math.log(x) / Math.log(Math.max(a, 0.2) + 1) + b;
        case 'abs': return a * Math.abs(x) + b;
        case 'sqrt': return x < 0 ? NaN : a * Math.sqrt(x) + b;
        case 'sin': return a * Math.sin(x * (b === 0 ? 1 : Math.abs(b))) ;
        default: return a * x + b;
      }
    };

    let d = '', pen = false;
    for (let i = 0; i <= 600; i++) {
      const x = lo + (i / 600) * (hi - lo);
      const y = f(x);
      if (!isFinite(y) || y < vlo - 2 || y > vhi + 2) { pen = false; continue; }
      d += `${pen ? 'L' : 'M'} ${n2(PX(x))} ${n2(PY(y))} `;
      pen = true;
    }
    s += path(d, 'none', BLUE, 2.4);

    const NAME: Record<PlotKind, string> = {
      linear: `y = ${a.toFixed(1)}x ${b >= 0 ? '+' : '−'} ${Math.abs(b).toFixed(1)}`,
      quad: `y = ${a.toFixed(1)}x² ${b >= 0 ? '+' : '−'} ${Math.abs(b).toFixed(1)}`,
      inverse: `y = ${a.toFixed(1)} / x`,
      exp: `y = ${(Math.max(a, 0.1) + 1).toFixed(1)}^x ${b >= 0 ? '+' : '−'} ${Math.abs(b).toFixed(1)}`,
      log: `y = log_${(Math.max(a, 0.2) + 1).toFixed(1)} x ${b >= 0 ? '+' : '−'} ${Math.abs(b).toFixed(1)}`,
      abs: `y = ${a.toFixed(1)}|x| ${b >= 0 ? '+' : '−'} ${Math.abs(b).toFixed(1)}`,
      sqrt: `y = ${a.toFixed(1)}√x ${b >= 0 ? '+' : '−'} ${Math.abs(b).toFixed(1)}`,
      sin: `y = ${a.toFixed(1)} sin(${(b === 0 ? 1 : Math.abs(b)).toFixed(1)}x)`,
    };
    s += rect(X0 + 8, Y0 + 6, 210, 26, '#FFFFFFCC', GREY, 1);
    s += txt(X0 + 113, Y0 + 24, NAME[kind], { size: 14, weight: 500 });
    if (kind === 'linear') {
      s += txt(340, 366, `기울기 ${a.toFixed(1)} — x가 1 늘면 y가 ${a.toFixed(1)} 는다 · y절편 ${b.toFixed(1)}`,
        { size: 12.5, fill: SUB });
    }
    return s;
  },
};

/* ============================================================
   7. 할선 → 접선 (미분계수)
   ============================================================ */
const secantTangent: WidgetDef = {
  title: '평균 기울기 → 순간 기울기',
  hint: 'h를 0에 가깝게 줄이면 두 점을 잇는 직선(할선)이 접선이 된다. 이게 미분이다.',
  vb: '0 0 680 360',
  controls: [
    { key: 'x', label: '점 위치 a', min: -20, max: 20, step: 1, def: 10, fmt: (v) => (v / 10).toFixed(1) },
    { key: 'h', label: '간격 h', values: [20, 10, 5, 2, 1], def: 1, fmt: (v) => (v / 10).toFixed(1) },
  ],
  render: (p) => {
    const A = p.x / 10, H = p.h / 10;
    const X0 = 40, X1 = 640, Y0 = 30, Y1 = 300;
    const lo = -3, hi = 3, vlo = -1, vhi = 9;
    const PX = (x: number) => X0 + ((x - lo) / (hi - lo)) * (X1 - X0);
    const PY = (y: number) => Y1 - ((y - vlo) / (vhi - vlo)) * (Y1 - Y0);
    const f = (x: number) => x * x;

    let s = '';
    for (let v = lo; v <= hi; v++) s += line(PX(v), Y0, PX(v), Y1, v === 0 ? '#9AA0A6' : '#EDEFF2', v === 0 ? 1.4 : 1);
    for (let v = vlo; v <= vhi; v++) s += line(X0, PY(v), X1, PY(v), v === 0 ? '#9AA0A6' : '#EDEFF2', v === 0 ? 1.4 : 1);

    let d = '';
    for (let i = 0; i <= 400; i++) {
      const x = lo + (i / 400) * (hi - lo);
      d += `${i ? 'L' : 'M'} ${n2(PX(x))} ${n2(PY(f(x)))} `;
    }
    s += path(d, 'none', GREY, 2);

    const x2 = A + H, y1v = f(A), y2v = f(x2);
    const slope = (y2v - y1v) / H;
    // 할선
    const ext = 3.2;
    s += line(PX(A - ext), PY(y1v - slope * ext), PX(A + ext), PY(y1v + slope * ext), CORAL, 2.2);
    // 접선 (2a)
    const t = 2 * A;
    s += line(PX(A - ext), PY(y1v - t * ext), PX(A + ext), PY(y1v + t * ext), MINT, 2.2, '5 4');
    // Δ 삼각형
    s += line(PX(A), PY(y1v), PX(x2), PY(y1v), SUB, 1, '4 3');
    s += line(PX(x2), PY(y1v), PX(x2), PY(y2v), SUB, 1, '4 3');
    s += txt((PX(A) + PX(x2)) / 2, PY(y1v) + 16, `h=${H.toFixed(1)}`, { size: 11.5, fill: SUB });
    s += txt(PX(x2) + 22, (PY(y1v) + PY(y2v)) / 2, `Δy=${(y2v - y1v).toFixed(2)}`, { size: 11.5, fill: SUB, anchor: 'start' });
    s += circ(PX(A), PY(y1v), 5.5, BLUE);
    s += circ(PX(x2), PY(y2v), 5, CORAL);

    s += rect(X0 + 8, Y0 + 6, 250, 26, '#FFFFFFCC', GREY, 1);
    s += txt(X0 + 133, Y0 + 24, `y = x² · a = ${A.toFixed(1)}`, { size: 13.5, weight: 500 });
    s += txt(340, 330, `할선 기울기 = Δy/Δx = ${slope.toFixed(3)}`, { size: 15, weight: 500, fill: CORAL });
    s += txt(340, 350, `h → 0 이면 접선 기울기 2a = ${t.toFixed(1)}`, { size: 13, fill: MINT });
    return s;
  },
};

/* ============================================================
   8. 리만 합 — 적분
   ============================================================ */
const riemann: WidgetDef = {
  title: '잘게 쪼개 더하기 — 정적분',
  hint: '직사각형을 늘릴수록 곡선 아래 넓이에 가까워진다. 초등 "칸 세기"의 최종 형태.',
  vb: '0 0 680 320',
  controls: [{ key: 'n', label: '직사각형 수', values: [2, 4, 8, 16, 32, 64], def: 2 }],
  render: (p) => {
    const N = Math.round(p.n);
    const X0 = 60, X1 = 620, Y0 = 30, YB = 250;
    const a = 0, b = 1;
    const f = (x: number) => x * x;
    const PX = (x: number) => X0 + ((x - a) / (b - a)) * (X1 - X0);
    const PY = (y: number) => YB - y * (YB - Y0);

    let s = '';
    const w = (b - a) / N;
    let sum = 0;
    for (let i = 0; i < N; i++) {
      const xm = a + (i + 0.5) * w, h = f(xm);
      sum += h * w;
      s += rect(PX(a + i * w), PY(h), (X1 - X0) / N, YB - PY(h), i % 2 ? '#DCF0E8' : '#C9E9DC', '#fff', 0.8);
    }
    let d = '';
    for (let i = 0; i <= 300; i++) {
      const x = a + (i / 300) * (b - a);
      d += `${i ? 'L' : 'M'} ${n2(PX(x))} ${n2(PY(f(x)))} `;
    }
    s += path(d, 'none', BLUE, 2.4);
    s += line(X0, YB, X1, YB, INK, 1.4);
    s += txt(X0, YB + 18, '0', { size: 11.5, fill: SUB });
    s += txt(X1, YB + 18, '1', { size: 11.5, fill: SUB });
    s += txt(340, 20, 'y = x²', { size: 14, weight: 500 });
    s += txt(340, 284, `직사각형 ${N}개 합 = ${sum.toFixed(5)}`, { size: 15, weight: 500 });
    s += txt(340, 306, `참값 ∫₀¹x²dx = 1/3 ≈ 0.33333 · 오차 ${Math.abs(sum - 1 / 3).toFixed(5)}`,
      { size: 12.5, fill: SUB });
    return s;
  },
};

/* ============================================================
   9. 삼각형 내각의 합
   ============================================================ */
const triangleAngles: WidgetDef = {
  title: '삼각형 세 각을 모으면 일직선',
  hint: '꼭짓점을 아무리 움직여도 세 각의 합은 180°. 찢어 붙이면 눈으로 보인다.',
  vb: '0 0 680 320',
  controls: [
    { key: 'ax', label: '꼭짓점 A 가로', min: 60, max: 400, step: 5, def: 150 },
    { key: 'ay', label: '꼭짓점 A 높이', min: 20, max: 150, step: 5, def: 40 },
  ],
  render: (p) => {
    const A = { x: p.ax, y: p.ay }, B = { x: 70, y: 200 }, C = { x: 420, y: 200 };
    const ang = (P: any, Q: any, R: any) => {
      const v1 = { x: Q.x - P.x, y: Q.y - P.y }, v2 = { x: R.x - P.x, y: R.y - P.y };
      const c = (v1.x * v2.x + v1.y * v2.y) / (Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y));
      return (Math.acos(Math.max(-1, Math.min(1, c))) * 180) / Math.PI;
    };
    const a1 = ang(A, B, C), a2 = ang(B, A, C), a3 = ang(C, A, B);
    let s = path(`M ${A.x} ${A.y} L ${B.x} ${B.y} L ${C.x} ${C.y} Z`, '#F2F6F4', INK, 1.6);
    const mark = (P: any, col: string, lbl: string, v: number) =>
      circ(P.x, P.y, 15, col + '55') + txt(P.x, P.y + 4, `${Math.round(v)}°`, { size: 11.5, weight: 500 });
    s += mark(A, MINT, 'A', a2) + mark(B, CORAL, 'B', a1) + mark(C, BLUE, 'C', a3);

    // 오른쪽: 세 각을 한 점에 모음
    const OX = 545, OY = 200;
    s += line(OX - 110, OY, OX + 110, OY, INK, 1.6);
    let acc = 180;
    const cols = [MINT, CORAL, BLUE], vals = [a2, a1, a3];
    for (let i = 0; i < 3; i++) {
      const st = acc, en = acc - vals[i];
      const r = 78;
      const p0 = { x: OX + r * Math.cos((st * Math.PI) / 180), y: OY - r * Math.sin((st * Math.PI) / 180) };
      const p1 = { x: OX + r * Math.cos((en * Math.PI) / 180), y: OY - r * Math.sin((en * Math.PI) / 180) };
      s += path(`M ${OX} ${OY} L ${n2(p0.x)} ${n2(p0.y)} A ${r} ${r} 0 0 1 ${n2(p1.x)} ${n2(p1.y)} Z`,
        cols[i] + '99', '#fff', 1);
      acc = en;
    }
    s += txt(OX, OY + 26, '세 각을 모으면 평각', { size: 12.5, fill: SUB });
    s += txt(340, 286, `${Math.round(a2)}° + ${Math.round(a1)}° + ${Math.round(a3)}° = ${Math.round(a1 + a2 + a3)}°`,
      { size: 16, weight: 500 });
    s += txt(340, 308, '꼭짓점을 어디로 옮겨도 항상 180° (평평한 종이에서만)', { size: 12, fill: SUB });
    return s;
  },
};

/* ============================================================
   10. 피타고라스 — 넓이 관계
   ============================================================ */
const pythagoras: WidgetDef = {
  title: '피타고라스 — 길이가 아니라 넓이의 관계',
  hint: 'a+b=c 가 아니다. 각 변 위 정사각형의 넓이를 세면 a²+b²=c².',
  vb: '0 0 680 400',
  controls: [
    { key: 'a', label: '밑변 a', min: 2, max: 6, step: 1, def: 3 },
    { key: 'b', label: '높이 b', min: 2, max: 6, step: 1, def: 4 },
  ],
  render: (p) => {
    const a = Math.round(p.a), b = Math.round(p.b);
    const c = Math.hypot(a, b);
    const u = 26;
    const OX = 250, OY = 250;
    const A = { x: OX, y: OY }, B = { x: OX + a * u, y: OY }, C = { x: OX, y: OY - b * u };
    let s = path(`M ${A.x} ${A.y} L ${B.x} ${B.y} L ${C.x} ${C.y} Z`, '#EEF2F6', INK, 1.6);
    // a² 아래
    s += rect(OX, OY, a * u, a * u, '#DCF0E8', '#fff', 1);
    for (let i = 1; i < a; i++) {
      s += line(OX + i * u, OY, OX + i * u, OY + a * u, '#fff', 1);
      s += line(OX, OY + i * u, OX + a * u, OY + i * u, '#fff', 1);
    }
    s += txt(OX + (a * u) / 2, OY + (a * u) / 2 + 5, `a² = ${a * a}`, { size: 13, weight: 500 });
    // b² 왼쪽
    s += rect(OX - b * u, OY - b * u, b * u, b * u, '#FCE7DC', '#fff', 1);
    for (let i = 1; i < b; i++) {
      s += line(OX - b * u + i * u, OY - b * u, OX - b * u + i * u, OY, '#fff', 1);
      s += line(OX - b * u, OY - b * u + i * u, OX, OY - b * u + i * u, '#fff', 1);
    }
    s += txt(OX - (b * u) / 2, OY - (b * u) / 2 + 5, `b² = ${b * b}`, { size: 13, weight: 500 });
    // c² 빗변 위
    const ang = Math.atan2(-b, a) * 180 / Math.PI;
    s += `<g transform="translate(${B.x} ${B.y}) rotate(${n2(ang)})">` +
         rect(0, -c * u, c * u, c * u, '#F3E9F7', '#fff', 1) +
         txt((c * u) / 2, -(c * u) / 2 + 5, `c² = ${(c * c).toFixed(0)}`, { size: 13, weight: 500 }) +
         '</g>';
    s += txt(340, 360, `${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b} = c²`, { size: 16, weight: 500 });
    s += txt(340, 382, `c = √${a * a + b * b} = ${c.toFixed(2)}   (a+b = ${a + b} 이 아니다)`, { size: 12.5, fill: SUB });
    return s;
  },
};

/* ============================================================
   11. 단위원 → 삼각함수 그래프
   ============================================================ */
const unitCircle: WidgetDef = {
  title: '단위원 위의 점 그림자 = sin, cos',
  hint: '원 위를 도는 점의 세로 좌표를 옆으로 펼치면 sin 곡선이 된다.',
  vb: '0 0 680 300',
  controls: [{ key: 't', label: '각도 θ', min: 0, max: 360, step: 3, def: 60 }],
  render: (p) => {
    const deg = p.t, rad = (deg * Math.PI) / 180;
    const R = 95, CX = 130, CY = 150;
    const px = CX + R * Math.cos(rad), py = CY - R * Math.sin(rad);
    let s = circ(CX, CY, R, 'none', GREY, 1.4);
    s += line(CX - R - 12, CY, CX + R + 12, CY, '#B9BEC7', 1);
    s += line(CX, CY - R - 12, CX, CY + R + 12, '#B9BEC7', 1);
    s += path(`M ${CX + 30} ${CY} A 30 30 0 ${deg > 180 ? 1 : 0} 0 ${n2(CX + 30 * Math.cos(rad))} ${n2(CY - 30 * Math.sin(rad))}`,
      'none', CORAL, 2);
    s += line(CX, CY, px, py, BLUE, 2);
    s += line(px, py, px, CY, MINT, 2, '4 3');
    s += line(CX, CY, px, CY, CORAL, 2);
    s += circ(px, py, 5.5, BLUE);
    s += txt(CX, CY + R + 32, `θ = ${deg}°`, { size: 13.5, weight: 500 });

    const GX = 270, GW = 370, GY = 150, AMP = 95;
    s += line(GX, GY, GX + GW, GY, '#B9BEC7', 1);
    let d = '';
    for (let i = 0; i <= 360; i += 2) {
      const x = GX + (i / 360) * GW, y = GY - AMP * Math.sin((i * Math.PI) / 180);
      d += `${i ? 'L' : 'M'} ${n2(x)} ${n2(y)} `;
    }
    s += path(d, 'none', GREY, 1.8);
    let d2 = '';
    for (let i = 0; i <= deg; i += 2) {
      const x = GX + (i / 360) * GW, y = GY - AMP * Math.sin((i * Math.PI) / 180);
      d2 += `${i ? 'L' : 'M'} ${n2(x)} ${n2(y)} `;
    }
    s += path(d2, 'none', MINT, 2.6);
    const gx = GX + (deg / 360) * GW, gy = GY - AMP * Math.sin(rad);
    s += line(px, py, gx, gy, MINT, 1, '3 3');
    s += circ(gx, gy, 5, MINT);
    [0, 90, 180, 270, 360].forEach((t) =>
      { s += txt(GX + (t / 360) * GW, GY + 18, `${t}°`, { size: 10.5, fill: SUB }); });

    s += txt(340, 270, `sin ${deg}° = ${Math.sin(rad).toFixed(3)}   cos ${deg}° = ${Math.cos(rad).toFixed(3)}`,
      { size: 15, weight: 500 });
    s += txt(340, 292, 'sin²θ + cos²θ = 1 — 피타고라스를 원 위에 쓴 것', { size: 12, fill: SUB });
    return s;
  },
};

/* ============================================================
   12. 확률 시뮬레이터
   ============================================================ */
const probSim: WidgetDef = {
  title: '많이 해보면 이론값에 가까워진다',
  hint: '적게 던지면 들쭉날쭉하다. 큰 수의 법칙 — 횟수를 늘리면 비율이 안정된다.',
  vb: '0 0 680 300',
  controls: [
    { key: 'n', label: '시행 횟수', values: [10, 50, 200, 1000, 5000], def: 1 },
    { key: 'seed', label: '다시 굴리기', min: 1, max: 40, step: 1, def: 1 },
  ],
  render: (p, o) => {
    const N = Math.round(p.n);
    const faces: number = o.faces ?? 6;
    const target: number = o.target ?? 1;
    let sd = Math.round(p.seed) * 9301 + 49297;
    const rnd = () => { sd = (sd * 9301 + 49297) % 233280; return sd / 233280; };
    const counts = new Array(faces).fill(0);
    for (let i = 0; i < N; i++) counts[Math.floor(rnd() * faces)]++;

    const X0 = 70, X1 = 620, YB = 210, H = 150;
    const bw = (X1 - X0) / faces;
    const mx = Math.max(...counts, 1);
    let s = '';
    const expected = N / faces;
    s += line(X0, YB - (expected / mx) * H, X1, YB - (expected / mx) * H, CORAL, 1.4, '6 4');
    s += txt(X1 + 4, YB - (expected / mx) * H + 4, '이론', { size: 11, fill: CORAL, anchor: 'start' });
    counts.forEach((c, i) => {
      const h = (c / mx) * H;
      s += rect(X0 + i * bw + 6, YB - h, bw - 12, h, i + 1 === target ? MINT : '#D9E4F0', '#fff', 1);
      s += txt(X0 + i * bw + bw / 2, YB + 18, String(i + 1), { size: 12, fill: SUB });
      s += txt(X0 + i * bw + bw / 2, YB - h - 7, String(c), { size: 11, fill: SUB });
    });
    s += line(X0, YB, X1, YB, INK, 1.4);
    const got = counts[target - 1] / N;
    s += txt(340, 258, `${target}이 나온 비율 = ${counts[target - 1]}/${N} = ${got.toFixed(4)}`,
      { size: 15, weight: 500 });
    s += txt(340, 280, `이론값 1/${faces} = ${(1 / faces).toFixed(4)} · 차이 ${Math.abs(got - 1 / faces).toFixed(4)}`,
      { size: 12.5, fill: SUB });
    return s;
  },
};

/* ============================================================
   13. 중심극한정리 — 주사위 합 분포
   ============================================================ */
const cltSim: WidgetDef = {
  title: '무엇을 더하든 많이 더하면 종 모양',
  hint: '주사위 1개는 평평한데, 여러 개를 더한 합은 가운데가 볼록해진다.',
  vb: '0 0 680 300',
  controls: [
    { key: 'k', label: '주사위 개수', values: [1, 2, 3, 5, 8], def: 1 },
    { key: 'seed', label: '다시 굴리기', min: 1, max: 40, step: 1, def: 1 },
  ],
  render: (p) => {
    const K = Math.round(p.k), TRIALS = 4000;
    let sd = Math.round(p.seed) * 7919 + 104729;
    const rnd = () => { sd = (sd * 9301 + 49297) % 233280; return sd / 233280; };
    const lo = K, hi = K * 6;
    const hist = new Array(hi - lo + 1).fill(0);
    for (let t = 0; t < TRIALS; t++) {
      let sum = 0;
      for (let i = 0; i < K; i++) sum += 1 + Math.floor(rnd() * 6);
      hist[sum - lo]++;
    }
    const X0 = 60, X1 = 620, YB = 220, H = 165;
    const bw = (X1 - X0) / hist.length;
    const mx = Math.max(...hist, 1);
    let s = '';
    hist.forEach((c, i) => {
      const h = (c / mx) * H;
      s += rect(X0 + i * bw + Math.min(3, bw / 6), YB - h, bw - Math.min(6, bw / 3), h, MINT, '#fff', 0.8);
    });
    s += line(X0, YB, X1, YB, INK, 1.4);
    s += txt(X0, YB + 18, String(lo), { size: 11, fill: SUB });
    s += txt(X1, YB + 18, String(hi), { size: 11, fill: SUB });
    s += txt(340, 24, `주사위 ${K}개의 합 (${TRIALS}번 반복)`, { size: 14, weight: 500 });
    s += txt(340, 262, K === 1 ? '1개면 어느 눈이나 똑같이 나온다 — 평평한 분포' :
      `${K}개를 더하니 가운데가 볼록 — 정규분포에 가까워진다`, { size: 14, weight: 500 });
    s += txt(340, 284, '이것이 중심극한정리. 정규분포가 자연에 흔한 이유.', { size: 12, fill: SUB });
    return s;
  },
};

/* ============================================================
   14. 에라토스테네스의 체
   ============================================================ */
const sieve: WidgetDef = {
  title: '소수 찾기 — 배수를 지우면 남는 것',
  hint: '2의 배수, 3의 배수… 차례로 지우면 더 이상 쪼개지지 않는 수만 남는다.',
  vb: '0 0 680 340',
  controls: [{ key: 'step', label: '지우는 단계', values: [0, 1, 2, 3, 4], def: 0 }],
  render: (p) => {
    const STEP = Math.round(p.step);
    const primes = [2, 3, 5, 7];
    const N = 100, cols = 10, cw = 62, ch = 28, X0 = 30, Y0 = 40;
    const killed = new Set<number>();
    for (let i = 0; i < STEP; i++) {
      const q = primes[i];
      for (let m = q * 2; m <= N; m += q) killed.add(m);
    }
    let s = txt(340, 22, STEP === 0 ? '1~100' : `${primes.slice(0, STEP).join(', ')}의 배수를 지운 뒤`,
      { size: 14, weight: 500 });
    for (let v = 1; v <= N; v++) {
      const i = v - 1, x = X0 + (i % cols) * cw, y = Y0 + Math.floor(i / cols) * ch;
      const dead = v === 1 || killed.has(v);
      const isP = primes.slice(0, STEP).includes(v);
      s += rect(x, y, cw - 3, ch - 3, dead ? '#F4F5F6' : isP ? '#FCE7DC' : '#DCF0E8', '#fff', 1);
      s += txt(x + (cw - 3) / 2, y + 19, String(v),
        { size: 12, fill: dead ? '#BFC3C9' : INK, weight: dead ? 400 : 500 });
    }
    const left = [];
    for (let v = 2; v <= N; v++) if (!killed.has(v)) left.push(v);
    s += txt(340, 328, STEP === 0 ? '아직 아무것도 안 지웠다' : `남은 수 ${left.length}개 — 전부 소수`,
      { size: 13, fill: SUB });
    return s;
  },
};

/* ============================================================
   15. 대칭 — 선대칭 / 점대칭
   ============================================================ */
const symmetry: WidgetDef = {
  title: '대칭 — 접거나 돌려서 겹치는가',
  hint: '대응하는 점끼리 이으면 대칭축과 수직이고, 축이 그 선을 반으로 나눈다.',
  vb: '0 0 680 300',
  controls: [
    { key: 'mode', label: '0=선대칭 1=점대칭', values: [0, 1], def: 0 },
    { key: 'rot', label: '돌리기', min: 0, max: 180, step: 5, def: 0 },
  ],
  render: (p) => {
    const mode = Math.round(p.mode), rot = p.rot;
    const CX = 340, CY = 150;
    const pts = [[-70, -50], [-20, -80], [30, -35], [10, 30], [-50, 45]];
    const poly = (arr: number[][], fill: string, st: string) =>
      path('M ' + arr.map((q) => `${n2(CX + q[0])} ${n2(CY + q[1])}`).join(' L ') + ' Z', fill, st, 1.6);
    let s = '';
    if (mode === 0) {
      s += line(CX, 30, CX, 270, RED, 1.6, '6 4');
      s += txt(CX, 22, '대칭축', { size: 11.5, fill: RED });
      s += poly(pts.map((q) => [q[0] - 30, q[1]]), MINT + 'AA', INK);
      s += poly(pts.map((q) => [-(q[0] - 30), q[1]]), CORAL + 'AA', INK);
      pts.forEach((q) => {
        const x1 = CX + q[0] - 30, x2 = CX - (q[0] - 30), y = CY + q[1];
        s += line(x1, y, x2, y, SUB, 1, '3 3');
        s += circ(x1, y, 3.2, INK) + circ(x2, y, 3.2, INK);
      });
      s += txt(340, 286, '대응점을 이은 선은 대칭축과 수직이고, 축이 그것을 이등분한다', { size: 12.5, fill: SUB });
    } else {
      const th = (rot * Math.PI) / 180;
      s += circ(CX, CY, 4, RED);
      s += txt(CX + 14, CY - 8, '대칭의 중심', { size: 11.5, fill: RED, anchor: 'start' });
      s += poly(pts, MINT + 'AA', INK);
      s += poly(pts.map((q) => [
        q[0] * Math.cos(th) - q[1] * Math.sin(th),
        q[0] * Math.sin(th) + q[1] * Math.cos(th),
      ]), CORAL + '99', INK);
      s += txt(340, 264, `${rot}° 돌림`, { size: 14, weight: 500 });
      s += txt(340, 286, rot === 180 ? '180°에서 완전히 겹치면 점대칭도형' : '180°까지 돌려보라',
        { size: 12.5, fill: rot === 180 ? MINT : SUB });
    }
    return s;
  },
};

/* ============================================================
   16. 닮음비 — 길이 k, 넓이 k², 부피 k³
   ============================================================ */
const scaling: WidgetDef = {
  title: '2배로 키우면 넓이는 4배, 부피는 8배',
  hint: '길이만 비례한다. 차원이 올라가면 지수가 붙는다.',
  vb: '0 0 680 300',
  controls: [{ key: 'k', label: '몇 배로', values: [1, 2, 3, 4], def: 1 }],
  render: (p) => {
    const k = Math.round(p.k), u = 30;
    let s = '';
    // 선
    s += txt(90, 40, '길이', { size: 13, weight: 500, anchor: 'start' });
    s += line(90, 58, 90 + k * u, 58, MINT, 5);
    s += txt(90 + k * u + 14, 62, `${k}배`, { size: 12, fill: SUB, anchor: 'start' });
    // 넓이
    s += txt(90, 96, '넓이', { size: 13, weight: 500, anchor: 'start' });
    for (let i = 0; i < k; i++) for (let j = 0; j < k; j++)
      s += rect(90 + i * u, 108 + j * u, u, u, '#DCF0E8', '#fff', 1.2);
    s += txt(90 + k * u + 14, 108 + (k * u) / 2, `${k * k}칸`, { size: 12, fill: SUB, anchor: 'start' });
    // 부피
    const VX = 400, VY = 108, d = 11;
    s += txt(VX, 96, '부피', { size: 13, weight: 500, anchor: 'start' });
    for (let z = k - 1; z >= 0; z--)
      for (let j = 0; j < k; j++)
        for (let i = 0; i < k; i++)
          s += rect(VX + i * u + z * d, VY + j * u - z * d, u, u, z === 0 ? '#FCE7DC' : '#F7D9C7', '#fff', 1);
    s += txt(VX + k * u + k * d + 14, VY + (k * u) / 2, `${k * k * k}덩이`, { size: 12, fill: SUB, anchor: 'start' });

    s += txt(340, 262, `길이 ${k}배 → 넓이 ${k * k}배 → 부피 ${k * k * k}배`, { size: 16, weight: 500 });
    s += txt(340, 284, '큰 동물의 다리가 굵은 이유 — 무게는 세제곱, 뼈 단면은 제곱으로 는다', { size: 12, fill: SUB });
    return s;
  },
};

/* ============================================================
   17. 벡터 덧셈
   ============================================================ */
const vectorAdd: WidgetDef = {
  title: '벡터 — 크기와 방향을 함께',
  hint: '두 화살표를 이어 붙이면 합. 내적이 0이면 수직.',
  vb: '0 0 680 320',
  controls: [
    { key: 'ax', label: 'a 가로', min: -6, max: 6, step: 1, def: 3 },
    { key: 'ay', label: 'a 세로', min: -6, max: 6, step: 1, def: 1 },
    { key: 'bx', label: 'b 가로', min: -6, max: 6, step: 1, def: -1 },
    { key: 'by', label: 'b 세로', min: -6, max: 6, step: 1, def: 3 },
  ],
  render: (p) => {
    const ax = p.ax, ay = p.ay, bx = p.bx, by = p.by;
    const CX = 340, CY = 160, u = 22;
    const PX = (x: number) => CX + x * u, PY = (y: number) => CY - y * u;
    let s = '';
    for (let v = -7; v <= 7; v++) {
      s += line(PX(v), PY(-6), PX(v), PY(6), v === 0 ? '#9AA0A6' : '#EDEFF2', v === 0 ? 1.4 : 1);
      s += line(PX(-7), PY(v), PX(7), PY(v), v === 0 ? '#9AA0A6' : '#EDEFF2', v === 0 ? 1.4 : 1);
    }
    const arrow = (x1: number, y1: number, x2: number, y2: number, col: string, lbl: string) => {
      const a = Math.atan2(y2 - y1, x2 - x1);
      return line(x1, y1, x2, y2, col, 2.6) +
        path(`M ${n2(x2)} ${n2(y2)} L ${n2(x2 - 10 * Math.cos(a - 0.4))} ${n2(y2 - 10 * Math.sin(a - 0.4))}` +
             ` L ${n2(x2 - 10 * Math.cos(a + 0.4))} ${n2(y2 - 10 * Math.sin(a + 0.4))} Z`, col) +
        txt((x1 + x2) / 2 + 12, (y1 + y2) / 2 - 8, lbl, { size: 13, weight: 500, fill: col });
    };
    s += arrow(PX(0), PY(0), PX(ax), PY(ay), MINT, 'a');
    s += arrow(PX(ax), PY(ay), PX(ax + bx), PY(ay + by), CORAL, 'b');
    s += arrow(PX(0), PY(0), PX(ax + bx), PY(ay + by), BLUE, 'a+b');
    s += line(PX(0), PY(0), PX(bx), PY(by), CORAL, 1.2, '4 3');
    s += line(PX(bx), PY(by), PX(ax + bx), PY(ay + by), MINT, 1.2, '4 3');
    const dot = ax * bx + ay * by;
    s += txt(340, 284, `a=(${ax},${ay})  b=(${bx},${by})  a+b=(${ax + bx},${ay + by})`, { size: 14, weight: 500 });
    s += txt(340, 306, `내적 a·b = ${ax}×${bx} + ${ay}×${by} = ${dot}${dot === 0 ? '  → 수직!' : ''}`,
      { size: 12.5, fill: dot === 0 ? MINT : SUB });
    return s;
  },
};

/* ============================================================
   18. 경사하강법 — AI가 배우는 방법
   ============================================================ */
const gradientDescent: WidgetDef = {
  title: '기울기 반대로 내려가기 — AI 학습',
  hint: '기울기를 재고, 그 반대 방향으로 조금 이동. 이걸 반복하면 바닥에 도착한다.',
  vb: '0 0 680 330',
  controls: [
    { key: 'start', label: '시작 위치', min: -40, max: 40, step: 1, def: 32, fmt: (v) => (v / 10).toFixed(1) },
    { key: 'lr', label: '보폭 (학습률)', values: [5, 15, 30, 60, 95], def: 1, fmt: (v) => (v / 100).toFixed(2) },
    { key: 'steps', label: '반복 횟수', min: 0, max: 20, step: 1, def: 6 },
  ],
  render: (p) => {
    const x0 = p.start / 10, lr = p.lr / 100, steps = Math.round(p.steps);
    const X0 = 50, X1 = 630, Y0 = 30, YB = 250;
    const lo = -4.5, hi = 4.5;
    const f = (x: number) => 0.5 * x * x + 1;
    const df = (x: number) => x;
    const PX = (x: number) => X0 + ((x - lo) / (hi - lo)) * (X1 - X0);
    const PY = (y: number) => YB - (y / 12) * (YB - Y0);
    let s = '';
    let d = '';
    for (let i = 0; i <= 300; i++) {
      const x = lo + (i / 300) * (hi - lo);
      d += `${i ? 'L' : 'M'} ${n2(PX(x))} ${n2(PY(f(x)))} `;
    }
    s += path(d, 'none', GREY, 2.2);
    s += line(X0, PY(f(0)), X1, PY(f(0)), '#EDEFF2', 1);

    let x = x0;
    const pts: number[] = [x];
    for (let i = 0; i < steps; i++) { x = x - lr * df(x); pts.push(x); }
    pts.forEach((v, i) => {
      if (i > 0) s += line(PX(pts[i - 1]), PY(f(pts[i - 1])), PX(v), PY(f(v)), CORAL, 1.6, '3 3');
      s += circ(PX(v), PY(f(v)), i === pts.length - 1 ? 6 : 3.6,
        i === pts.length - 1 ? BLUE : CORAL + 'AA');
    });
    const last = pts[pts.length - 1];
    const g = df(last);
    s += line(PX(last) - 45, PY(f(last)) + 45 * g * ((YB - Y0) / 12) / ((X1 - X0) / (hi - lo)),
              PX(last) + 45, PY(f(last)) - 45 * g * ((YB - Y0) / 12) / ((X1 - X0) / (hi - lo)), MINT, 2.2);
    s += txt(340, 284, `${steps}번 이동 후 x = ${last.toFixed(4)} · 기울기 = ${g.toFixed(4)}`,
      { size: 15, weight: 500 });
    s += txt(340, 306,
      lr >= 0.9 ? '보폭이 너무 크면 튕겨나간다 (발산)' : '기울기가 0에 가까워질수록 바닥에 도착',
      { size: 12.5, fill: lr >= 0.9 ? RED : SUB });
    s += txt(340, 326, '신경망 학습이 정확히 이것이다', { size: 11.5, fill: SUB });
    return s;
  },
};

/* ============================================================
   19. 성장 경쟁 — 지수 vs 다항
   ============================================================ */
const growthRace: WidgetDef = {
  title: '결국 지수가 이긴다',
  hint: '처음엔 x²가 크지만 2^x가 반드시 추월한다.',
  vb: '0 0 680 320',
  controls: [{ key: 'n', label: 'x 범위', min: 4, max: 20, step: 1, def: 10 }],
  render: (p) => {
    const N = Math.round(p.n);
    const X0 = 55, X1 = 630, Y0 = 30, YB = 250;
    const maxY = Math.max(Math.pow(2, N), N * N);
    const PX = (x: number) => X0 + (x / N) * (X1 - X0);
    const PY = (y: number) => YB - (y / maxY) * (YB - Y0);
    let s = line(X0, YB, X1, YB, INK, 1.4);
    const plot = (f: (x: number) => number, col: string) => {
      let d = '';
      for (let i = 0; i <= 200; i++) {
        const x = (i / 200) * N;
        d += `${i ? 'L' : 'M'} ${n2(PX(x))} ${n2(PY(f(x)))} `;
      }
      return path(d, 'none', col, 2.4);
    };
    s += plot((x) => x * x, CORAL);
    s += plot((x) => Math.pow(2, x), MINT);
    s += plot((x) => 10 * x, BLUE);
    let cross = 0;
    for (let x = 0.1; x <= N; x += 0.05) if (Math.pow(2, x) > x * x) { cross = x; break; }
    s += txt(X1 - 6, PY(N * N) - 8, 'x²', { size: 13, fill: CORAL, anchor: 'end', weight: 500 });
    s += txt(X1 - 6, PY(Math.pow(2, N)) + 16, '2ˣ', { size: 13, fill: MINT, anchor: 'end', weight: 500 });
    s += txt(X1 - 6, PY(10 * N) + 16, '10x', { size: 12, fill: BLUE, anchor: 'end' });
    s += txt(340, 284, `x = ${N} 에서  2^${N} = ${Math.pow(2, N).toLocaleString()}  vs  ${N}² = ${N * N}`,
      { size: 15, weight: 500 });
    s += txt(340, 306, '종이를 42번 접으면 달에 닿는다 — 지수의 위력', { size: 12, fill: SUB });
    return s;
  },
};

/* ============================================================
   20. 극한 수렴표
   ============================================================ */
const limitTable: WidgetDef = {
  title: '가까이 갈수록 어떤 값에 다가가나',
  hint: '그 점의 값이 아니라, 그 점으로 가는 길에서 무엇에 다가가는지를 본다.',
  vb: '0 0 680 300',
  controls: [{ key: 'k', label: '얼마나 가까이', values: [1, 2, 3, 4, 5], def: 2 }],
  render: (p, o) => {
    const K = Math.round(p.k);
    const kind = o.limitKind ?? 'poly';
    const a = 1;
    const f = (x: number) => (kind === 'sinx' ? Math.sin(x) / x : (x * x - 1) / (x - 1));
    const center = kind === 'sinx' ? 0 : 1;
    const L = kind === 'sinx' ? 1 : 2;
    const rows: [number, number][] = [];
    for (let i = 1; i <= K; i++) {
      const d = Math.pow(10, -i);
      rows.push([center - d, f(center - d)]);
    }
    for (let i = K; i >= 1; i--) {
      const d = Math.pow(10, -i);
      rows.push([center + d, f(center + d)]);
    }
    const X0 = 130, W = 420, RH = 24, Y0 = 60;
    let s = txt(340, 30, kind === 'sinx' ? 'f(x) = sin x / x  (x → 0)' : 'f(x) = (x²−1)/(x−1)  (x → 1)',
      { size: 15, weight: 500 });
    s += rect(X0, Y0, W, RH, '#F2F4F6', GREY, 1);
    s += txt(X0 + W * 0.25, Y0 + 16, 'x', { size: 12.5, weight: 500 });
    s += txt(X0 + W * 0.72, Y0 + 16, 'f(x)', { size: 12.5, weight: 500 });
    rows.forEach((r, i) => {
      const y = Y0 + RH + i * RH;
      s += rect(X0, y, W, RH, i % 2 ? '#fff' : '#FAFAF7', GREY, 0.6);
      s += txt(X0 + W * 0.25, y + 16, r[0].toFixed(6), { size: 12 });
      s += txt(X0 + W * 0.72, y + 16, r[1].toFixed(6), { size: 12, fill: BLUE, weight: 500 });
    });
    const yEnd = Y0 + RH + rows.length * RH;
    s += txt(340, yEnd + 26, `→ ${L} 에 다가간다`, { size: 15, weight: 500, fill: MINT });
    s += txt(340, yEnd + 48,
      kind === 'sinx' ? 'x = 0 에서는 0/0 이라 값이 없다. 그래도 극한은 1.'
                      : 'x = 1 에서는 0/0 이라 값이 없다. 그래도 극한은 2.',
      { size: 12, fill: SUB });
    return s;
  },
};

/* ============================================================
   레지스트리
   ============================================================ */
export const WIDGETS: Record<string, WidgetDef> = {
  'place-value': placeValue,
  'number-line': numberLine,
  'area-model': areaModel,
  'fraction-bars': fractionBars,
  'circle-slices': circleSlices,
  'function-plot': functionPlot,
  'secant-tangent': secantTangent,
  'riemann': riemann,
  'triangle-angles': triangleAngles,
  'pythagoras': pythagoras,
  'unit-circle': unitCircle,
  'prob-sim': probSim,
  'clt-sim': cltSim,
  'sieve': sieve,
  'symmetry': symmetry,
  'scaling': scaling,
  'vector-add': vectorAdd,
  'gradient-descent': gradientDescent,
  'growth-race': growthRace,
  'limit-table': limitTable,
};

export type WidgetType = keyof typeof WIDGETS;
