import { useCurrentFrame, useVideoConfig, AbsoluteFill, spring, interpolate } from 'remotion';

const data = [
  { label: 'Q1', value: 72, color: '#eab308' },
  { label: 'Q2', value: 91, color: '#f59e0b' },
  { label: 'Q3', value: 58, color: '#d97706' },
  { label: 'Q4', value: 85, color: '#b45309' },
  { label: 'Q5', value: 67, color: '#92400e' },
];

const DataVizDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleEnter = spring({ frame: frame - 5, fps, config: { damping: 14 } });
  const maxVal = Math.max(...data.map(d => d.value));

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(160deg, #0f172a, #1e293b)' }}>
      <div style={{ padding: '45px 50px', fontFamily: "'Inter',sans-serif" }}>
        <div style={{ opacity: titleEnter, transform: `translateY(${(1 - titleEnter) * 15}px)` }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: -0.8 }}>Revenue Growth</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Quarterly performance (in millions)</div>
        </div>

        <div style={{ marginTop: 40, display: 'flex', alignItems: 'flex-end', gap: 20, height: 260 }}>
          {data.map((d, i) => {
            const barGrow = spring({ frame: frame - 15 - i * 8, fps, config: { damping: 14, stiffness: 60 } });
            const barH = (d.value / maxVal) * 220 * barGrow;
            const countVal = interpolate(frame, [15 + i * 8, 15 + i * 8 + 30], [0, d.value], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: d.color, opacity: barGrow, fontVariantNumeric: 'tabular-nums' }}>
                  ${Math.round(countVal)}M
                </div>
                <div style={{
                  width: '100%', height: barH, borderRadius: '6px 6px 0 0',
                  background: `linear-gradient(to top, ${d.color}, ${d.color}cc)`,
                  boxShadow: `0 0 15px ${d.color}25`,
                }} />
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>{d.label}</div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 24, height: 1, background: 'rgba(255,255,255,0.06)' }} />

        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>FY 2025</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17l5-5 5 5M7 7l5 5 5-5" />
            </svg>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#22c55e' }}>+23.4%</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default DataVizDemo;
