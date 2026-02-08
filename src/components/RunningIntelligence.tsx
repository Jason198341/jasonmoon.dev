import { useState, useEffect, useRef, useMemo } from 'react';
import type { IntelligenceData } from '../lib/strava-analytics';

interface Props {
  data: IntelligenceData;
}

// ============================================================
// Constants
// ============================================================

const SECTIONS = [
  { id: 'todays-plan', label: "Today's Plan", icon: '🎯' },
  { id: 'training-load', label: 'Training Load', icon: '⚡' },
  { id: 'ai-coach', label: 'AI Coach', icon: '🤖' },
  { id: 'race-predictor', label: 'Race Predictor', icon: '🏁' },
  { id: 'pace-trend', label: 'Pace Trend', icon: '📈' },
  { id: 'best-conditions', label: 'Best Conditions', icon: '🏆' },
  { id: 'personality', label: 'Personality', icon: '🧬' },
  { id: 'year-over-year', label: 'Year over Year', icon: '📊' },
  { id: 'distribution', label: 'Distribution', icon: '🎯' },
  { id: 'recovery', label: 'Recovery', icon: '💤' },
  { id: 'routes', label: 'Routes', icon: '🗺' },
  { id: 'milestones', label: 'Milestones', icon: '🎖' },
];

const c = {
  accent: 'var(--color-accent)',
  surface: 'var(--color-surface)',
  surfaceHover: 'var(--color-surface-hover)',
  border: 'var(--color-border)',
  text: 'var(--color-text)',
  muted: 'var(--color-text-muted)',
  bg: 'var(--color-bg)',
};

// ============================================================
// Helpers
// ============================================================

function fmtPace(secsPerKm: number): string {
  if (!secsPerKm || !isFinite(secsPerKm)) return '-';
  const mins = Math.floor(secsPerKm / 60);
  const secs = Math.round(secsPerKm % 60);
  return `${mins}'${secs.toString().padStart(2, '0')}"`;
}

// ============================================================
// Section Wrapper
// ============================================================

function Section({ id, title, icon, children }: { id: string; title: string; icon: string; children: React.ReactNode }) {
  return (
    <section data-section={id} className="scroll-mt-24">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h2>
      {children}
    </section>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-[${c.border}] bg-[${c.surface}] p-4 ${className}`}>
      {children}
    </div>
  );
}

// ============================================================
// SVG Charts
// ============================================================

function PaceTrendChart({ points }: { points: IntelligenceData['paceTrend'] }) {
  if (points.length < 3) return <p className={`text-sm text-[${c.muted}]`}>Not enough data for trend chart.</p>;

  const W = 600, H = 200;
  const pad = { top: 15, right: 15, bottom: 28, left: 42 };
  const iW = W - pad.left - pad.right;
  const iH = H - pad.top - pad.bottom;

  const paces = points.map(p => p.avgPace);
  const minP = Math.floor(Math.min(...paces) / 30) * 30 - 15;
  const maxP = Math.ceil(Math.max(...paces) / 30) * 30 + 15;
  const range = maxP - minP || 1;

  const x = (i: number) => pad.left + (i / (points.length - 1)) * iW;
  const y = (pace: number) => pad.top + ((pace - minP) / range) * iH;

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.avgPace).toFixed(1)}`).join(' ');
  const areaD = pathD + ` L${x(points.length - 1).toFixed(1)},${(pad.top + iH).toFixed(1)} L${x(0).toFixed(1)},${(pad.top + iH).toFixed(1)} Z`;

  // Y axis labels (4 ticks)
  const yTicks = Array.from({ length: 5 }, (_, i) => minP + (range * i) / 4);

  // X axis labels (every ~8 weeks)
  const step = Math.max(1, Math.floor(points.length / 6));
  const xTicks = points.filter((_, i) => i % step === 0 || i === points.length - 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      {/* Grid lines */}
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={pad.left} y1={y(t)} x2={W - pad.right} y2={y(t)} stroke={c.border} strokeWidth="0.5" strokeDasharray="4,4" />
          <text x={pad.left - 4} y={y(t)} textAnchor="end" dominantBaseline="middle" fontSize="9" fill={c.muted}>
            {fmtPace(t)}
          </text>
        </g>
      ))}
      {/* Area fill */}
      <path d={areaD} fill={c.accent} opacity="0.08" />
      {/* Line */}
      <path d={pathD} fill="none" stroke={c.accent} strokeWidth="2" strokeLinejoin="round" />
      {/* X labels */}
      {xTicks.map((p, i) => {
        const idx = points.indexOf(p);
        return (
          <text key={i} x={x(idx)} y={H - 4} textAnchor="middle" fontSize="8" fill={c.muted}>
            {p.week}
          </text>
        );
      })}
      {/* Arrow label */}
      <text x={W - pad.right} y={pad.top - 4} textAnchor="end" fontSize="8" fill={c.muted}>
        ↑ Slower
      </text>
      <text x={W - pad.right} y={pad.top + iH + 2} textAnchor="end" fontSize="8" fill={c.muted} dominantBaseline="hanging">
        ↓ Faster
      </text>
    </svg>
  );
}

function RadarChart({ scores }: { scores: IntelligenceData['personality']['scores'] }) {
  const cats = ['consistency', 'speed', 'endurance', 'variety', 'volume'] as const;
  const labels = ['Consistency', 'Speed', 'Endurance', 'Variety', 'Volume'];
  const cx = 100, cy = 100, r = 70;

  const pt = (i: number, val: number) => {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const radius = (val / 5) * r;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  };

  const rings = [1, 2, 3, 4, 5].map(level =>
    cats.map((_, i) => pt(i, level)).map(p => `${p.x},${p.y}`).join(' ')
  );
  const dataPoly = cats.map((cat, i) => pt(i, scores[cat])).map(p => `${p.x},${p.y}`).join(' ');
  const labelPts = cats.map((_, i) => pt(i, 5.8));

  return (
    <svg viewBox="0 0 200 200" className="w-52 h-52 mx-auto">
      {rings.map((ring, i) => (
        <polygon key={i} points={ring} fill="none" stroke={c.border} strokeWidth="0.5" />
      ))}
      {cats.map((_, i) => {
        const p = pt(i, 5);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={c.border} strokeWidth="0.5" />;
      })}
      <polygon points={dataPoly} fill={c.accent} fillOpacity="0.15" stroke={c.accent} strokeWidth="2" />
      {cats.map((cat, i) => (
        <circle key={i} cx={pt(i, scores[cat]).x} cy={pt(i, scores[cat]).y} r="3" fill={c.accent} />
      ))}
      {labels.map((label, i) => (
        <text key={i} x={labelPts[i].x} y={labelPts[i].y} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill={c.muted}>
          {label}
        </text>
      ))}
    </svg>
  );
}

function YearChart({ years }: { years: IntelligenceData['yearComparison'] }) {
  if (years.length === 0) return null;

  const W = 600, H = 220;
  const pad = { top: 20, right: 15, bottom: 28, left: 42 };
  const iW = W - pad.left - pad.right;
  const iH = H - pad.top - pad.bottom;

  const maxKm = Math.max(...years.flatMap(yr => yr.months.map(m => m.cumulativeKm)), 1);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const x = (m: number) => pad.left + (m / 11) * iW;
  const y = (km: number) => pad.top + iH - (km / maxKm) * iH;

  const colors = ['#93c5fd', '#60a5fa', '#3b82f6', '#1d4ed8', '#1e3a8a'];
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
        const km = Math.round(maxKm * pct);
        return (
          <g key={i}>
            <line x1={pad.left} y1={y(km)} x2={W - pad.right} y2={y(km)} stroke={c.border} strokeWidth="0.5" strokeDasharray="4,4" />
            <text x={pad.left - 4} y={y(km)} textAnchor="end" dominantBaseline="middle" fontSize="9" fill={c.muted}>{km}</text>
          </g>
        );
      })}
      {/* Month labels */}
      {monthNames.map((name, i) => (
        <text key={i} x={x(i)} y={H - 4} textAnchor="middle" fontSize="8" fill={c.muted}>{name}</text>
      ))}
      {/* Year lines */}
      {years.map((yr, yi) => {
        const isCurrentYear = yr.year === currentYear;
        const lastMonth = isCurrentYear ? currentMonth : 11;
        const pts = yr.months
          .filter(m => m.month <= lastMonth)
          .map(m => `${x(m.month).toFixed(1)},${y(m.cumulativeKm).toFixed(1)}`);
        if (pts.length < 2) return null;
        const color = colors[yi % colors.length];
        return (
          <g key={yr.year}>
            <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={isCurrentYear ? 2.5 : 1.5} strokeDasharray={isCurrentYear ? '' : '6,3'} />
            {/* Year label at end */}
            <text
              x={x(lastMonth) + 4}
              y={y(yr.months[lastMonth].cumulativeKm)}
              fontSize="9"
              fontWeight={isCurrentYear ? '600' : '400'}
              fill={color}
              dominantBaseline="middle"
            >
              {String(yr.year).slice(-2)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================
// Boundary Gauge (Today's Plan)
// ============================================================

function BoundaryGauge({ plan }: { plan: IntelligenceData['todaysPlan'] }) {
  const safeKm = plan.safeMaxKm;
  const dKm = plan.dangerKm;

  if (safeKm <= 0 && dKm <= 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-[var(--color-text-muted)]">Training load is very high. All distances are in the danger zone.</p>
        <p className="text-sm font-medium text-red-500 mt-1">Rest is strongly recommended today.</p>
      </div>
    );
  }

  const maxKm = Math.max(dKm * 1.4, safeKm * 2, 15);
  const W = 560, H = 80;
  const barX = 30, barW = W - 60;
  const barY = 8, barH = 20;

  const xPos = (km: number) => barX + Math.min(km / maxKm, 1) * barW;
  const safeX = xPos(safeKm);
  const dangerX = xPos(dKm);

  const activeScenarios = plan.scenarios.filter(sc => parseFloat(sc.distance) > 0);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      {/* Safe zone */}
      <rect x={barX} y={barY} width={Math.max(0, safeX - barX)} height={barH} rx={barH / 2} fill="#22c55e" opacity={0.2} />
      {/* Caution zone */}
      {dKm > safeKm && (
        <rect x={safeX} y={barY} width={dangerX - safeX} height={barH} fill="#f59e0b" opacity={0.2} />
      )}
      {/* Danger zone */}
      <rect x={dangerX} y={barY} width={barX + barW - dangerX} height={barH} rx={barH / 2} fill="#ef4444" opacity={0.2} />
      {/* Border */}
      <rect x={barX} y={barY} width={barW} height={barH} rx={barH / 2} fill="none" stroke={c.border} strokeWidth={0.5} />

      {/* Zone labels */}
      {safeKm > 1 && (
        <text x={(barX + safeX) / 2} y={barY + barH / 2 + 1} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="#22c55e" fontWeight="500">SAFE</text>
      )}
      {dKm > safeKm + 2 && (
        <text x={(safeX + dangerX) / 2} y={barY + barH / 2 + 1} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="#f59e0b" fontWeight="500">CAUTION</text>
      )}
      <text x={(dangerX + barX + barW) / 2} y={barY + barH / 2 + 1} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="#ef4444" fontWeight="500">DANGER</text>

      {/* Safe limit marker */}
      {safeKm > 0 && (
        <g>
          <line x1={safeX} y1={barY - 2} x2={safeX} y2={barY + barH + 2} stroke="#22c55e" strokeWidth={2} />
          <text x={safeX} y={barY + barH + 13} textAnchor="middle" fontSize="9" fill="#22c55e" fontWeight="600">{safeKm} km</text>
        </g>
      )}

      {/* Danger limit marker */}
      {dKm > 0 && (
        <g>
          <line x1={dangerX} y1={barY - 2} x2={dangerX} y2={barY + barH + 2} stroke="#ef4444" strokeWidth={2} />
          <text x={dangerX} y={barY + barH + 13} textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="600">{dKm} km</text>
        </g>
      )}

      {/* 0 km label */}
      <text x={barX} y={barY + barH + 13} textAnchor="start" fontSize="8" fill={c.muted}>0</text>

      {/* Scenario markers */}
      {activeScenarios.map((sc, i) => {
        const km = parseFloat(sc.distance);
        const sx = xPos(km);
        const isRec = sc === plan.recommended;
        return (
          <g key={i}>
            <line x1={sx} y1={barY + barH + 20} x2={sx} y2={barY + barH + 4} stroke={sc.projectedColor} strokeWidth={0.8} opacity={0.4} />
            <circle cx={sx} cy={barY + barH + 24} r={isRec ? 5 : 3} fill={sc.projectedColor} stroke={isRec ? c.text : 'none'} strokeWidth={isRec ? 1.5 : 0} />
            <text x={sx} y={barY + barH + 36} textAnchor="middle" fontSize="7" fill={c.muted}>{sc.label}</text>
            {isRec && <text x={sx} y={barY + barH + 17} textAnchor="middle" fontSize="8" fill={sc.projectedColor} fontWeight="700">★</text>}
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================
// Training Load Gauge
// ============================================================

function LoadGauge({ load }: { load: IntelligenceData['trainingLoad'] }) {
  // Gauge from 0 to 2.0
  const min = 0, max = 2.0;
  const pos = Math.min(Math.max(load.ratio, min), max);
  const pct = ((pos - min) / (max - min)) * 100;

  const zones = [
    { start: 0, end: 40, color: '#9ca3af', label: 'Detraining' },    // 0-0.8
    { start: 40, end: 50, color: '#3b82f6', label: 'Recovery' },      // 0.8-1.0
    { start: 50, end: 65, color: '#22c55e', label: 'Optimal' },       // 1.0-1.3
    { start: 65, end: 75, color: '#f59e0b', label: 'Overreaching' },  // 1.3-1.5
    { start: 75, end: 100, color: '#ef4444', label: 'Injury Risk' },  // 1.5-2.0
  ];

  return (
    <div>
      <div className="relative h-8 rounded-full overflow-hidden flex">
        {zones.map((z, i) => (
          <div
            key={i}
            style={{ width: `${z.end - z.start}%`, backgroundColor: z.color }}
            className="h-full opacity-30"
          />
        ))}
        {/* Marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[var(--color-text)]"
          style={{ left: `${pct}%`, transition: 'left 0.3s' }}
        >
          <div
            className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap"
            style={{ color: load.zoneColor }}
          >
            {load.ratio.toFixed(2)}
          </div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-l-transparent border-r-transparent border-b-[var(--color-text)]" style={{ transform: 'rotate(180deg)', bottom: 'auto', top: '-2px' }} />
        </div>
      </div>
      {/* Zone labels */}
      <div className="flex mt-3 text-[10px] text-[var(--color-text-muted)]">
        {zones.map((z, i) => (
          <div key={i} className="text-center" style={{ width: `${z.end - z.start}%` }}>
            {z.label}
          </div>
        ))}
      </div>
      <p className="text-center mt-3 text-sm">
        Status: <span className="font-semibold" style={{ color: load.zoneColor }}>{load.zoneLabel}</span>
      </p>
    </div>
  );
}

// ============================================================
// Day-of-Week Heatmap
// ============================================================

function DayHeatmap({ data }: { data: IntelligenceData['conditions']['dayOfWeekData'] }) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const allDays = days.map(day => {
    const found = data.find(d => d.day === day);
    return { day, avgPace: found?.avgPace ?? 0, count: found?.count ?? 0 };
  });
  const paces = allDays.filter(d => d.count > 0).map(d => d.avgPace);
  const minPace = Math.min(...paces);
  const maxPace = Math.max(...paces);
  const range = maxPace - minPace || 1;

  return (
    <div className="flex gap-1.5">
      {allDays.map(d => {
        if (d.count === 0) return (
          <div key={d.day} className="flex-1 text-center">
            <div className="h-8 rounded bg-[var(--color-surface-hover)] mb-1" />
            <span className="text-[10px] text-[var(--color-text-muted)]">{d.day}</span>
          </div>
        );
        // Lower pace = faster = more blue
        const intensity = 1 - (d.avgPace - minPace) / range;
        const alpha = 0.2 + intensity * 0.8;
        return (
          <div key={d.day} className="flex-1 text-center" title={`${d.day}: ${fmtPace(d.avgPace)} (${d.count} runs)`}>
            <div className="h-8 rounded flex items-center justify-center text-[10px] text-white font-medium" style={{ backgroundColor: `rgba(37, 99, 235, ${alpha})` }}>
              {d.count}
            </div>
            <span className="text-[10px] text-[var(--color-text-muted)]">{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Main Component
// ============================================================

export default function RunningIntelligence({ data }: Props) {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const contentRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for active section tracking
  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute('data-section') || '');
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(`[data-section="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const maxDistCount = useMemo(
    () => Math.max(...data.distribution.map(d => d.count), 1),
    [data.distribution],
  );

  return (
    <div className="flex gap-8">
      {/* ── Desktop Sidebar ── */}
      <nav className="hidden lg:block w-44 shrink-0">
        <div className="sticky top-24 space-y-0.5">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                activeSection === s.id
                  ? 'bg-[var(--color-accent)] text-white font-medium'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]'
              }`}
            >
              <span className="mr-1.5">{s.icon}</span>{s.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Mobile Horizontal Nav ── */}
      <div className="lg:hidden fixed top-14 left-0 right-0 z-20 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 py-2 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                activeSection === s.id
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)]'
              }`}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div ref={contentRef} className="flex-1 min-w-0 space-y-14 lg:pt-0 pt-12">

        {/* 0. Today's Plan */}
        <Section id="todays-plan" title="Today's Plan" icon="🎯">
          {/* Headline */}
          <Card className="!border-[var(--color-accent)]/30">
            <div className="flex items-start gap-3">
              <div className="text-3xl shrink-0">
                {data.todaysPlan.currentRatio >= 1.5 ? '🛑' :
                 data.todaysPlan.currentRatio >= 1.3 ? '⚠️' :
                 data.todaysPlan.currentRatio >= 0.8 ? '✅' : '💤'}
              </div>
              <div>
                <h3 className="text-lg font-bold">{data.todaysPlan.headline}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-[var(--color-text-muted)]">
                  <span>
                    ACWR:{' '}
                    <strong style={{ color: data.todaysPlan.currentColor }}>
                      {data.todaysPlan.currentRatio.toFixed(2)}
                    </strong>{' '}
                    ({data.todaysPlan.currentZone})
                  </span>
                  <span>
                    Last run:{' '}
                    {data.todaysPlan.daysSinceLastRun === 0
                      ? 'Today'
                      : `${data.todaysPlan.daysSinceLastRun}d ago`}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{data.todaysPlan.lastRunSummary}</p>
              </div>
            </div>
          </Card>

          {/* Boundary Gauge */}
          <div className="mt-4">
            <p className="text-xs text-[var(--color-text-muted)] mb-2">
              Training Boundary — Distance vs. Injury Risk
            </p>
            <Card>
              <BoundaryGauge plan={data.todaysPlan} />
            </Card>
          </div>

          {/* Scenario Cards */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.todaysPlan.scenarios.map((sc, i) => {
              const isRec = sc === data.todaysPlan.recommended;
              return (
                <div
                  key={i}
                  className={`relative rounded-xl border-2 p-3 transition-all ${isRec ? 'shadow-md' : ''}`}
                  style={{
                    borderColor: isRec ? 'var(--color-accent)' : sc.projectedColor + '40',
                    backgroundColor: isRec ? 'var(--color-accent)08' : undefined,
                  }}
                >
                  {isRec && (
                    <span className="absolute -top-2.5 left-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }}>
                      BEST
                    </span>
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sc.projectedColor }} />
                    <p className="text-sm font-semibold truncate">{sc.label}</p>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    {sc.distance !== '-' ? `${sc.distance} · ${sc.duration}` : 'No activity'}
                  </p>
                  <p className="text-xs mt-1.5" style={{ color: sc.projectedColor }}>
                    ACWR → {sc.projectedRatio.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{sc.reason}</p>
                </div>
              );
            })}
          </div>

          {/* Advice */}
          {data.todaysPlan.advice.length > 0 && (
            <Card className="mt-4">
              <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-2">Today's Advice</p>
              <div className="space-y-1.5">
                {data.todaysPlan.advice.map((line, i) => (
                  <p key={i} className="text-sm leading-relaxed">{line}</p>
                ))}
              </div>
            </Card>
          )}
        </Section>

        {/* 1. Training Load */}
        <Section id="training-load" title="Training Load" icon="⚡">
          <Card>
            <LoadGauge load={data.trainingLoad} />
            <div className="grid grid-cols-3 gap-4 mt-4 text-center text-sm">
              <div>
                <p className="text-xl font-bold text-[var(--color-accent)]">{data.trainingLoad.acute.toFixed(0)}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Acute (7d)</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[var(--color-accent)]">{data.trainingLoad.chronic.toFixed(0)}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Chronic (42d avg)</p>
              </div>
              <div>
                <p className="text-xl font-bold" style={{ color: data.trainingLoad.zoneColor }}>{data.trainingLoad.ratio.toFixed(2)}</p>
                <p className="text-xs text-[var(--color-text-muted)]">ACWR Ratio</p>
              </div>
            </div>
          </Card>
        </Section>

        {/* 2. AI Coach */}
        <Section id="ai-coach" title="AI Coach" icon="🤖">
          <Card>
            <div className="space-y-2">
              {data.coachAdvice.map((line, i) => (
                <p key={i} className="text-sm leading-relaxed">{line}</p>
              ))}
            </div>
          </Card>
        </Section>

        {/* 3. Race Predictor */}
        <Section id="race-predictor" title="Race Predictor" icon="🏁">
          {data.racePredictions.length > 0 ? (
            <>
              <p className="text-xs text-[var(--color-text-muted)] mb-3">Based on your best recent effort (Riegel formula)</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {data.racePredictions.map(rp => (
                  <Card key={rp.label} className="text-center">
                    <p className="text-xs font-mono text-[var(--color-text-muted)] mb-1">{rp.label}</p>
                    <p className="text-xl font-bold text-[var(--color-accent)]">{rp.time}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{rp.pace}</p>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card><p className="text-sm text-[var(--color-text-muted)]">Need recent runs (3+ km) to predict race times.</p></Card>
          )}
        </Section>

        {/* 4. Pace Trend */}
        <Section id="pace-trend" title="Pace Trend" icon="📈">
          <Card>
            <p className="text-xs text-[var(--color-text-muted)] mb-3">4-week rolling average (distance-weighted)</p>
            <PaceTrendChart points={data.paceTrend} />
            <p className="text-sm text-center mt-3 font-medium">{data.paceImprovement}</p>
          </Card>
        </Section>

        {/* 5. Best Conditions */}
        <Section id="best-conditions" title="Best Conditions" icon="🏆">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Card className="text-center">
              <p className="text-xs text-[var(--color-text-muted)]">Best Day</p>
              <p className="text-lg font-bold text-[var(--color-accent)]">{data.conditions.bestDay.day}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{data.conditions.bestDay.pace}</p>
            </Card>
            <Card className="text-center">
              <p className="text-xs text-[var(--color-text-muted)]">Best Time</p>
              <p className="text-lg font-bold text-[var(--color-accent)]">{data.conditions.bestHour.hour}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{data.conditions.bestHour.pace}</p>
            </Card>
            <Card className="text-center">
              <p className="text-xs text-[var(--color-text-muted)]">Sweet Spot</p>
              <p className="text-lg font-bold text-[var(--color-accent)]">{data.conditions.sweetSpotDistance.range}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{data.conditions.sweetSpotDistance.pace}</p>
            </Card>
          </div>
          <Card>
            <p className="text-xs text-[var(--color-text-muted)] mb-2">Pace by day of week</p>
            <DayHeatmap data={data.conditions.dayOfWeekData} />
          </Card>
        </Section>

        {/* 6. Personality */}
        <Section id="personality" title="Running Personality" icon="🧬">
          <Card className="text-center">
            <RadarChart scores={data.personality.scores} />
            <p className="text-xl font-bold text-[var(--color-accent)] mt-2">{data.personality.type}</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-sm mx-auto">{data.personality.description}</p>
            <div className="flex justify-center gap-4 mt-4">
              {(Object.entries(data.personality.scores) as [string, number][]).map(([key, val]) => (
                <div key={key} className="text-center">
                  <div className="flex gap-0.5 justify-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: i < val ? 'var(--color-accent)' : 'var(--color-surface-hover)' }}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-1 capitalize">{key}</p>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        {/* 7. Year-over-Year */}
        <Section id="year-over-year" title="Year over Year" icon="📊">
          <Card>
            <p className="text-xs text-[var(--color-text-muted)] mb-3">Cumulative distance (km) by year</p>
            <YearChart years={data.yearComparison} />
            <div className="flex flex-wrap gap-4 mt-3 justify-center">
              {data.yearComparison.map(yr => (
                <div key={yr.year} className="text-center text-xs">
                  <span className="font-semibold">'{String(yr.year).slice(-2)}</span>
                  <span className="text-[var(--color-text-muted)] ml-1">{yr.totalKm} km · {yr.totalRuns} runs</span>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        {/* 8. Distribution */}
        <Section id="distribution" title="Distance Distribution" icon="🎯">
          <Card>
            <div className="space-y-2">
              {data.distribution.map(d => (
                <div key={d.label} className="flex items-center gap-3">
                  <span className="w-16 text-xs text-[var(--color-text-muted)] text-right shrink-0">{d.label}</span>
                  <div className="flex-1 h-6 rounded bg-[var(--color-surface-hover)] overflow-hidden relative">
                    <div
                      className="h-full rounded bg-[var(--color-accent)] transition-all duration-300"
                      style={{ width: `${(d.count / maxDistCount) * 100}%` }}
                    />
                    {d.count > 0 && (
                      <span className="absolute inset-0 flex items-center pl-2 text-[10px] font-medium text-white mix-blend-difference">
                        {d.count} runs ({d.percentage}%)
                      </span>
                    )}
                  </div>
                  <span className="w-16 text-xs text-[var(--color-text-muted)] shrink-0">{d.totalKm} km</span>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        {/* 9. Recovery */}
        <Section id="recovery" title="Recovery Analysis" icon="💤">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="text-center">
              <p className="text-xl font-bold text-[var(--color-accent)]">{data.recovery.avgRestDays}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Avg Rest Days</p>
            </Card>
            <Card className="text-center">
              <p className="text-xl font-bold text-[var(--color-accent)]">{data.recovery.avgRestAfterHard}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Rest After Hard</p>
            </Card>
            <Card className="text-center">
              <p className="text-xl font-bold text-[var(--color-accent)]">{data.recovery.longestStreak}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Day Streak Record</p>
            </Card>
            <Card className="text-center">
              <p className="text-xl font-bold text-[var(--color-accent)]">{data.recovery.longestRest}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Longest Rest (days)</p>
            </Card>
          </div>
        </Section>

        {/* 10. Routes */}
        <Section id="routes" title="Route Familiarity" icon="🗺">
          {data.routes.length > 0 ? (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[var(--color-text-muted)] text-xs border-b border-[var(--color-border)]">
                      <th className="text-left py-2 pr-3">Location</th>
                      <th className="text-left py-2 pr-3">Runs</th>
                      <th className="text-left py-2 pr-3">Best Pace</th>
                      <th className="text-left py-2 pr-3">Latest</th>
                      <th className="text-left py-2">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.routes.map(r => (
                      <tr key={r.location} className="border-b border-[var(--color-border)]/50">
                        <td className="py-2 pr-3 font-medium">{r.flag} {r.location}</td>
                        <td className="py-2 pr-3">{r.count}</td>
                        <td className="py-2 pr-3 font-mono text-xs">{r.bestPace}</td>
                        <td className="py-2 pr-3 font-mono text-xs">{r.latestPace}</td>
                        <td className="py-2">
                          <span className={`text-xs font-medium ${r.improvedSecs > 0 ? 'text-green-600' : r.improvedSecs < 0 ? 'text-red-500' : 'text-[var(--color-text-muted)]'}`}>
                            {r.improvement}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Card><p className="text-sm text-[var(--color-text-muted)]">Need runs in multiple locations to analyze routes.</p></Card>
          )}
        </Section>

        {/* 11. Milestones */}
        <Section id="milestones" title="Milestone Countdown" icon="🎖">
          {data.milestones.length > 0 ? (
            <div className="space-y-3">
              {data.milestones.map(m => (
                <Card key={m.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">{m.label}</span>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {m.current} / {m.target} · ETA {m.estimatedDate}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-[var(--color-surface-hover)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500"
                      style={{ width: `${Math.min(m.progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{m.remaining} remaining · {m.progress}% complete</p>
                </Card>
              ))}
            </div>
          ) : (
            <Card><p className="text-sm text-[var(--color-text-muted)]">All milestones achieved! 🎉</p></Card>
          )}
        </Section>

      </div>
    </div>
  );
}
