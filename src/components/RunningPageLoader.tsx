import { useState, useEffect, useRef } from 'react';
import type { EnrichedRunData } from '../lib/strava';
import RunningDashboard from './RunningDashboard';

export default function RunningPageLoader() {
  const [data, setData] = useState<EnrichedRunData | null>(null);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const startTime = useRef(Date.now());

  useEffect(() => {
    // Simulated progress: accelerates to ~30%, cruises to ~85%, then slows
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime.current) / 1000;
      setProgress((prev) => {
        if (prev >= 90) return prev; // Cap at 90 until real data arrives
        // Fast start, then decelerate
        if (prev < 30) return prev + 3;
        if (prev < 60) return prev + 1.5;
        if (prev < 80) return prev + 0.5;
        return prev + 0.1;
      });
    }, 80);

    // Fetch real data
    fetch('/api/strava-data')
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
      })
      .then((json: EnrichedRunData) => {
        clearInterval(intervalRef.current);
        // Animate to 100% then show data
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

  // Loading state
  if (!data && !error) {
    const pct = Math.min(Math.round(progress), 100);
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        {/* Animated runner icon */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-[var(--color-border)] flex items-center justify-center">
            <span className="text-2xl animate-bounce" style={{ animationDuration: '1.2s' }}>
              🏃
            </span>
          </div>
          {/* Orbiting dot */}
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
        <div className="w-48 space-y-2">
          <div className="h-1.5 rounded-full bg-[var(--color-surface-hover)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-100 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[var(--color-text-muted)] font-mono">
            <span>Loading Strava data</span>
            <span>{pct}%</span>
          </div>
        </div>

        {/* Status messages */}
        <p className="text-xs text-[var(--color-text-muted)]">
          {pct < 20 && 'Connecting to Strava...'}
          {pct >= 20 && pct < 50 && 'Fetching activities...'}
          {pct >= 50 && pct < 80 && 'Processing run data...'}
          {pct >= 80 && pct < 100 && 'Building visualizations...'}
          {pct === 100 && 'Almost ready...'}
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 mb-6 text-sm text-amber-200">
        Could not load Strava data. Please try refreshing the page.
      </div>
    );
  }

  // Loaded
  return <RunningDashboard data={data!} />;
}
