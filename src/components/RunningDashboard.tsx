import { useState, useMemo } from 'react';
import type { EnrichedRunData, RunEntry } from '../lib/strava';
import { computeTodaysPlan } from '../lib/strava-analytics';

interface Props {
  data: EnrichedRunData;
}

// --- Constants ---

const DISTANCE_FILTERS = [
  { key: 'all', label: 'All' },
  { key: '1-5', label: '1–5 km' },
  { key: '5-10', label: '5–10 km' },
  { key: '10-20', label: '10–20 km' },
  { key: '20-30', label: '20–30 km' },
  { key: '30+', label: '30+ km' },
] as const;

const PERIOD_FILTERS = [
  { key: '1y', label: 'Last 1 Year' },
  { key: 'all', label: 'All Time' },
] as const;

// --- Helpers ---

function matchesDistance(km: number, filter: string): boolean {
  switch (filter) {
    case '1-5': return km >= 1 && km < 5;
    case '5-10': return km >= 5 && km < 10;
    case '10-20': return km >= 10 && km < 20;
    case '20-30': return km >= 20 && km < 30;
    case '30+': return km >= 30;
    default: return true;
  }
}

function groupByMonth(runs: RunEntry[]): { month: string; runs: RunEntry[] }[] {
  const map = new Map<string, RunEntry[]>();
  for (const r of runs) {
    const d = new Date(r.dateFull);
    const key = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  return Array.from(map.entries()).map(([month, entries]) => ({ month, runs: entries }));
}

function computeStats(runs: RunEntry[]) {
  if (runs.length === 0) return { count: 0, km: '0', pace: '-' };
  const totalKm = runs.reduce((s, r) => s + r.distanceKm, 0);
  const totalSec = runs.reduce((s, r) => s + r.timeSeconds, 0);
  const avgMps = (totalKm * 1000) / totalSec;
  const secsPerKm = 1000 / avgMps;
  const mins = Math.floor(secsPerKm / 60);
  const secs = Math.round(secsPerKm % 60);
  return {
    count: runs.length,
    km: totalKm.toFixed(1),
    pace: `${mins}'${secs.toString().padStart(2, '0')}"/km`,
  };
}

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDateRange(from: Date, to: Date): string {
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${fmt(from)} — ${fmt(to)}`;
}

// --- Milestones ---

function getMilestones(data: EnrichedRunData) {
  const badges: { emoji: string; label: string; detail: string }[] = [];
  const totalKm = parseFloat(data.stats.totalDistance);

  if (data.runs.some((r) => r.distanceKm >= 42)) {
    badges.push({ emoji: '🏅', label: 'Marathon Finisher', detail: '42.195km completed' });
  }

  const uniqueLocations = new Set(data.runs.map((r) => r.location).filter((l) => l !== 'Unknown' && l !== 'Other'));
  if (uniqueLocations.size >= 3) {
    badges.push({ emoji: '🌍', label: `${uniqueLocations.size}-City Runner`, detail: `Ran in ${uniqueLocations.size} cities` });
  }

  if (totalKm >= 1000) {
    badges.push({ emoji: '🎯', label: '1000km Club', detail: `${totalKm.toFixed(0)}km total` });
  }

  if (data.runs.some((r) => {
    if (r.distanceKm < 3) return false;
    return r.timeSeconds / r.distanceKm < 300;
  })) {
    badges.push({ emoji: '⚡', label: 'Sub-5 Pacer', detail: "Under 5'/km achieved" });
  }

  badges.push({ emoji: '🔥', label: `${data.stats.totalRuns} Runs`, detail: 'And counting...' });

  return badges;
}

// --- Heatmap data builder (last 52 weeks) ---

function buildHeatmapData(runs: RunEntry[]) {
  // Build lookup: dateKey → total km that day
  const dayMap = new Map<string, number>();
  for (const r of runs) {
    const key = toDateKey(new Date(r.dateFull));
    dayMap.set(key, (dayMap.get(key) || 0) + r.distanceKm);
  }

  // Build 52-week grid ending today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find the Sunday that starts the week containing (today - 51 weeks)
  const start = new Date(today);
  start.setDate(start.getDate() - (51 * 7 + start.getDay()));

  const weeks: { date: Date; km: number }[][] = [];
  let current = new Date(start);

  while (current <= today) {
    const weekStart = new Date(current);
    const week: { date: Date; km: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(current);
      const km = dayMap.get(toDateKey(day)) || 0;
      week.push({ date: day, km });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}

function getHeatmapColor(km: number): string {
  if (km === 0) return 'var(--color-surface-hover)';
  if (km < 5) return '#93c5fd';   // blue-300
  if (km < 10) return '#3b82f6';  // blue-500
  if (km < 20) return '#1d4ed8';  // blue-700
  return '#1e3a8a';                // blue-900
}

function getHeatmapTooltip(date: Date, km: number): string {
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  if (km === 0) return `${dateStr}: Rest day`;
  return `${dateStr}: ${km.toFixed(1)} km`;
}

// --- Training status ---

function getTrainingStatus(runs: RunEntry[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Current streak: consecutive weeks with at least 1 run (going backwards from this week)
  const weekMap = new Map<string, boolean>();
  for (const r of runs) {
    const d = new Date(r.dateFull);
    // Week key = year-weekNumber
    const jan1 = new Date(d.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
    weekMap.set(`${d.getFullYear()}-${weekNum}`, true);
  }

  let weekStreak = 0;
  const checkDate = new Date(today);
  for (let i = 0; i < 200; i++) {
    const jan1 = new Date(checkDate.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((checkDate.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
    if (weekMap.has(`${checkDate.getFullYear()}-${weekNum}`)) {
      weekStreak++;
      checkDate.setDate(checkDate.getDate() - 7);
    } else {
      break;
    }
  }

  // This week stats
  const dayOfWeek = today.getDay(); // 0=Sun
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - dayOfWeek);
  const thisWeekRuns = runs.filter((r) => {
    const d = new Date(r.dateFull);
    d.setHours(0, 0, 0, 0);
    return d >= weekStart && d <= today;
  });
  const thisWeekKm = thisWeekRuns.reduce((s, r) => s + r.distanceKm, 0);

  // Avg runs per week (over last 12 weeks)
  const twelveWeeksAgo = new Date(today);
  twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);
  const recentRuns = runs.filter((r) => new Date(r.dateFull) >= twelveWeeksAgo);
  const avgPerWeek = recentRuns.length / 12;

  return { weekStreak, thisWeekRuns: thisWeekRuns.length, thisWeekKm, avgPerWeek };
}

// --- Month labels for heatmap ---

function getMonthLabels(weeks: { date: Date; km: number }[][]) {
  const labels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  for (let i = 0; i < weeks.length; i++) {
    const month = weeks[i][0].date.getMonth();
    if (month !== lastMonth) {
      labels.push({
        label: weeks[i][0].date.toLocaleDateString('en-US', { month: 'short' }),
        col: i,
      });
      lastMonth = month;
    }
  }
  return labels;
}

// ============================================================
// Component
// ============================================================

export default function RunningDashboard({ data }: Props) {
  const [periodFilter, setPeriodFilter] = useState<'1y' | 'all'>('1y');
  const [distanceFilter, setDistanceFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  // Period boundary
  const periodBounds = useMemo(() => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    if (periodFilter === 'all' && data.runs.length > 0) {
      const oldest = new Date(data.runs[data.runs.length - 1].dateFull);
      oldest.setHours(0, 0, 0, 0);
      return { from: oldest, to: now };
    }
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    oneYearAgo.setHours(0, 0, 0, 0);
    return { from: oneYearAgo, to: now };
  }, [periodFilter, data.runs]);

  // Period-filtered runs (base for everything except PRs/milestones)
  const periodRuns = useMemo(() => {
    return data.runs.filter((r) => {
      const d = new Date(r.dateFull);
      return d >= periodBounds.from && d <= periodBounds.to;
    });
  }, [data.runs, periodBounds]);

  // Apply distance + location filters on top of period
  const filtered = useMemo(() => {
    return periodRuns.filter((r) => {
      if (!matchesDistance(r.distanceKm, distanceFilter)) return false;
      if (locationFilter !== 'all' && r.location !== locationFilter) return false;
      return true;
    });
  }, [periodRuns, distanceFilter, locationFilter]);

  const filteredStats = useMemo(() => computeStats(filtered), [filtered]);
  const periodStats = useMemo(() => computeStats(periodRuns), [periodRuns]);
  const filteredMonths = useMemo(() => groupByMonth(filtered), [filtered]);
  const milestones = useMemo(() => getMilestones(data), [data]);

  // Monthly volume — recompute from period-filtered runs
  const periodMonthlyVolume = useMemo(() => {
    const volMap = new Map<string, { km: number; count: number }>();
    for (const r of periodRuns) {
      const d = new Date(r.dateFull);
      const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const existing = volMap.get(key) || { km: 0, count: 0 };
      existing.km += r.distanceKm;
      existing.count += 1;
      volMap.set(key, existing);
    }
    // We need chronological order. The runs are newest-first, so entries are added newest-first.
    // Reverse to get oldest-first for the chart.
    return Array.from(volMap.entries())
      .map(([month, v]) => ({ month, km: Math.round(v.km * 10) / 10, count: v.count }))
      .reverse();
  }, [periodRuns]);

  const maxMonthlyKm = useMemo(
    () => Math.max(...periodMonthlyVolume.map((m) => m.km), 1),
    [periodMonthlyVolume],
  );

  // Heatmap (always last 52 weeks regardless of period filter)
  const heatmapWeeks = useMemo(() => buildHeatmapData(data.runs), [data.runs]);
  const monthLabels = useMemo(() => getMonthLabels(heatmapWeeks), [heatmapWeeks]);

  // Training status (from period-filtered runs)
  const training = useMemo(() => getTrainingStatus(periodRuns), [periodRuns]);

  // Today's Plan (always visible, computed from all runs)
  const todaysPlan = useMemo(() => computeTodaysPlan(data.runs), [data.runs]);

  const isFiltered = distanceFilter !== 'all' || locationFilter !== 'all';

  return (
    <div className="space-y-8">

      {/* ── Period Filter + Date Range ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5">
          {PERIOD_FILTERS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriodFilter(p.key as '1y' | 'all')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                periodFilter === p.key
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-[var(--color-text-muted)] font-mono">
          {formatDateRange(periodBounds.from, periodBounds.to)}
        </span>
      </div>

      {/* ── Today's Plan (always visible) ── */}
      <div className="rounded-xl border-2 border-[var(--color-accent)]/30 bg-[var(--color-surface)] p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-xl">
              {todaysPlan.currentRatio >= 1.5 ? '🛑' :
               todaysPlan.currentRatio >= 1.3 ? '⚠️' :
               todaysPlan.currentRatio >= 0.8 ? '✅' : '💤'}
            </span>
            Today's Plan
          </h2>
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: todaysPlan.currentColor + '18',
              color: todaysPlan.currentColor,
            }}
          >
            ACWR {todaysPlan.currentRatio.toFixed(2)}
          </span>
        </div>

        <p className="text-base font-medium mb-3">{todaysPlan.headline}</p>

        {/* Mini boundary bar */}
        {(todaysPlan.safeMaxKm > 0 || todaysPlan.dangerKm > 0) ? (
          <div className="mb-3">
            <div className="flex h-3 rounded-full overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${(todaysPlan.safeMaxKm / Math.max(todaysPlan.dangerKm * 1.5, 15)) * 100}%`,
                  backgroundColor: '#22c55e33',
                }}
              />
              <div
                className="h-full"
                style={{
                  width: `${(Math.max(0, todaysPlan.dangerKm - todaysPlan.safeMaxKm) / Math.max(todaysPlan.dangerKm * 1.5, 15)) * 100}%`,
                  backgroundColor: '#f59e0b33',
                }}
              />
              <div className="flex-1" style={{ backgroundColor: '#ef444433' }} />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-[var(--color-text-muted)]">
              <span>0 km</span>
              {todaysPlan.safeMaxKm > 0 && <span style={{ color: '#22c55e' }}>{todaysPlan.safeMaxKm} km safe</span>}
              {todaysPlan.dangerKm > 0 && <span style={{ color: '#ef4444' }}>{todaysPlan.dangerKm} km limit</span>}
            </div>
          </div>
        ) : (
          <p className="text-sm text-red-500 mb-3">Training load is very high — rest is recommended.</p>
        )}

        {/* Advice snippet */}
        {todaysPlan.advice[0] && (
          <p className="text-sm text-[var(--color-text-muted)]">{todaysPlan.advice[0]}</p>
        )}

        <a
          href="/archive/running-intelligence"
          className="inline-flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline mt-3"
        >
          Full analysis
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
        </a>
      </div>

      {/* ── Personal Records (all-time) ── */}
      {data.prs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Personal Records</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {data.prs.map((pr) => (
              <div
                key={pr.label}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center"
              >
                <p className="text-xs font-mono text-[var(--color-text-muted)] mb-1">{pr.label}</p>
                <p className="text-xl font-bold text-[var(--color-accent)]">{pr.time}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{pr.pace}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{pr.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Milestones (all-time) ── */}
      {milestones.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Milestones</h2>
          <div className="flex flex-wrap gap-2">
            {milestones.map((m) => (
              <div
                key={m.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm"
                title={m.detail}
              >
                <span>{m.emoji}</span>
                <span className="font-medium">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Training Frequency Heatmap ── */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Training Frequency</h2>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 overflow-x-auto">
          {/* Month labels */}
          <div className="flex mb-1" style={{ paddingLeft: 28 }}>
            {monthLabels.map((ml, i) => (
              <span
                key={i}
                className="text-[10px] text-[var(--color-text-muted)] absolute"
                style={{
                  position: 'relative',
                  left: `${ml.col * 13}px`,
                  width: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                {ml.label}
              </span>
            ))}
          </div>
          {/* We need a relative container for month labels + grid */}
          <div className="relative" style={{ paddingTop: 16 }}>
            {/* Month label row */}
            <div className="flex" style={{ marginLeft: 28, height: 14, position: 'relative' }}>
              {monthLabels.map((ml, i) => (
                <span
                  key={i}
                  className="text-[10px] text-[var(--color-text-muted)]"
                  style={{
                    position: 'absolute',
                    left: `${ml.col * 13}px`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {ml.label}
                </span>
              ))}
            </div>
            {/* Grid: 7 rows (Mon–Sun) x N columns (weeks) */}
            <div className="flex gap-[1px]">
              {/* Day labels */}
              <div className="flex flex-col gap-[1px] shrink-0" style={{ width: 24 }}>
                {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, i) => (
                  <div key={i} className="h-[11px] flex items-center">
                    <span className="text-[9px] text-[var(--color-text-muted)]">{label}</span>
                  </div>
                ))}
              </div>
              {/* Week columns */}
              {heatmapWeeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[1px]">
                  {week.map((day, di) => {
                    const isFuture = day.date > new Date();
                    return (
                      <div
                        key={di}
                        className="rounded-[2px] transition-colors"
                        style={{
                          width: 11,
                          height: 11,
                          backgroundColor: isFuture
                            ? 'transparent'
                            : getHeatmapColor(day.km),
                          opacity: isFuture ? 0 : 1,
                        }}
                        title={isFuture ? '' : getHeatmapTooltip(day.date, day.km)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            {/* Legend */}
            <div className="flex items-center justify-end gap-1 mt-2">
              <span className="text-[10px] text-[var(--color-text-muted)] mr-1">Less</span>
              {[0, 3, 7, 15, 25].map((km) => (
                <div
                  key={km}
                  className="rounded-[2px]"
                  style={{
                    width: 11,
                    height: 11,
                    backgroundColor: getHeatmapColor(km),
                  }}
                />
              ))}
              <span className="text-[10px] text-[var(--color-text-muted)] ml-1">More</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Training Status Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center">
          <p className="text-2xl font-bold text-[var(--color-accent)]">{training.weekStreak}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Week Streak</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center">
          <p className="text-2xl font-bold text-[var(--color-accent)]">{training.thisWeekRuns}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">This Week</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center">
          <p className="text-2xl font-bold text-[var(--color-accent)]">{training.thisWeekKm.toFixed(1)}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">km This Week</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center">
          <p className="text-2xl font-bold text-[var(--color-accent)]">{training.avgPerWeek.toFixed(1)}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Avg Runs/Week</p>
        </div>
      </div>

      {/* ── Monthly Volume Chart (period-filtered) ── */}
      {periodMonthlyVolume.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Monthly Volume</h2>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-1.5">
            {periodMonthlyVolume.map((m) => (
              <div key={m.month} className="flex items-center gap-3 text-sm">
                <span className="w-20 text-xs text-[var(--color-text-muted)] font-mono shrink-0 text-right">
                  {m.month}
                </span>
                <div className="flex-1 h-5 rounded bg-[var(--color-surface-hover)] overflow-hidden">
                  <div
                    className="h-full rounded bg-[var(--color-accent)] transition-all duration-300"
                    style={{ width: `${(m.km / maxMonthlyKm) * 100}%` }}
                  />
                </div>
                <span className="w-20 text-xs text-[var(--color-text-muted)] shrink-0">
                  {m.km} km · {m.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Activity Log: Filter Bar ── */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Activity Log</h2>

        {/* Distance filter */}
        <div className="flex flex-wrap gap-1.5">
          {DISTANCE_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setDistanceFilter(f.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                distanceFilter === f.key
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Location filter */}
        {data.locations.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setLocationFilter('all')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                locationFilter === 'all'
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              All Locations
            </button>
            {data.locations.map((loc) => {
              const flag = data.runs.find((r) => r.location === loc)?.locationFlag ?? '📍';
              return (
                <button
                  key={loc}
                  onClick={() => setLocationFilter(loc)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    locationFilter === loc
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'
                  }`}
                >
                  {flag} {loc}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Filtered Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center">
          <p className="text-2xl font-bold text-[var(--color-accent)]">{filteredStats.count}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            {isFiltered ? 'Filtered Runs' : 'Runs'}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center">
          <p className="text-2xl font-bold text-[var(--color-accent)]">{filteredStats.km}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            {isFiltered ? 'Filtered km' : 'km'}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center">
          <p className="text-2xl font-bold text-[var(--color-accent)]">{filteredStats.pace}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Avg Pace</p>
        </div>
      </div>

      {/* ── Monthly Grouped Table ── */}
      {filteredMonths.length > 0 ? (
        <div className="space-y-4">
          {filteredMonths.map((m) => (
            <div key={m.month} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <h3 className="font-mono font-semibold text-[var(--color-accent)] mb-3">
                {m.month}
                <span className="text-xs font-normal text-[var(--color-text-muted)] ml-2">
                  {m.runs.length} run{m.runs.length > 1 ? 's' : ''}
                </span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[var(--color-text-muted)] text-xs border-b border-[var(--color-border)]">
                      <th className="text-left py-2 pr-3">Date</th>
                      <th className="text-left py-2 pr-3">Distance</th>
                      <th className="text-left py-2 pr-3">Time</th>
                      <th className="text-left py-2 pr-3">Pace</th>
                      <th className="text-left py-2">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {m.runs.map((r, i) => (
                      <tr key={i} className="border-b border-[var(--color-border)]/50">
                        <td className="py-2 pr-3 font-mono text-xs">{r.date}</td>
                        <td className="py-2 pr-3">{r.distance}</td>
                        <td className="py-2 pr-3">{r.time}</td>
                        <td className="py-2 pr-3 text-[var(--color-text-muted)]">{r.pace}</td>
                        <td className="py-2 text-xs">
                          <span title={r.name}>{r.locationFlag} {r.location}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-[var(--color-text-muted)]">No runs match the current filter.</p>
          <button
            onClick={() => { setDistanceFilter('all'); setLocationFilter('all'); }}
            className="mt-3 text-sm text-[var(--color-accent)] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
