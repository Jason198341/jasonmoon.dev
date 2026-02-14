import { useState, useEffect, useRef } from 'react';
import type { IntelligenceData } from '../lib/strava-analytics';
import RunningIntelligence from './RunningIntelligence';

export default function IntelligencePageLoader() {
  const [data, setData] = useState<IntelligenceData | null>(null);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const startTime = useRef(Date.now());

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        if (prev < 25) return prev + 2.5;
        if (prev < 55) return prev + 1.2;
        if (prev < 75) return prev + 0.6;
        if (prev < 85) return prev + 0.3;
        return prev + 0.1;
      });
    }, 80);

    fetch('/api/intelligence-data')
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
      })
      .then((json: IntelligenceData) => {
        clearInterval(intervalRef.current);
        setProgress(100);
        setTimeout(() => setData(json), 400);
      })
      .catch(() => {
        clearInterval(intervalRef.current);
        setProgress(100);
        setTimeout(() => setError(true), 400);
      });

    return () => clearInterval(intervalRef.current);
  }, []);

  if (!data && !error) {
    const pct = Math.min(Math.round(progress), 100);
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        {/* Animated brain icon */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-[var(--color-border)] flex items-center justify-center">
            <span className="text-2xl" style={{
              animation: 'pulse 2s ease-in-out infinite',
            }}>
              🧠
            </span>
          </div>
          <div
            className="absolute w-2 h-2 rounded-full bg-[var(--color-accent)]"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${pct * 3.6}deg) translateY(-28px)`,
              transition: 'transform 0.08s linear',
            }}
          />
        </div>

        {/* Progress bar */}
        <div className="w-56 space-y-2">
          <div className="h-1.5 rounded-full bg-[var(--color-surface-hover)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-100 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[var(--color-text-muted)] font-mono">
            <span>Analyzing</span>
            <span>{pct}%</span>
          </div>
        </div>

        <p className="text-xs text-[var(--color-text-muted)]">
          {pct < 15 && 'Connecting to Strava...'}
          {pct >= 15 && pct < 35 && 'Fetching all activities...'}
          {pct >= 35 && pct < 55 && 'Computing training load & ACWR...'}
          {pct >= 55 && pct < 70 && 'Predicting race times...'}
          {pct >= 70 && pct < 85 && 'Analyzing pace trends & recovery...'}
          {pct >= 85 && pct < 100 && 'Generating coach advice...'}
          {pct === 100 && 'Almost ready...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 mb-6 text-sm text-amber-200">
        Could not load running analytics. Please try refreshing the page.
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-[var(--color-text-muted)] mb-10">
        {data!.totalRuns} runs · {data!.totalKm.toFixed(0)} km · {data!.dateRange}
      </p>
      <RunningIntelligence data={data!} />
    </>
  );
}
