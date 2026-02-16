import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

const BARS = 48;
const PARTICLES = 25;

function fakeAudio(frame: number, i: number): number {
  const t = frame / 30;
  return Math.abs(Math.sin(t * (1 + (i % 8) * 0.4) * Math.PI + i * 0.5));
}

const MusicVisualizerDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const cx = width / 2;
  const cy = height / 2 - 40;
  const progress = (frame % durationInFrames) / durationInFrames;

  return (
    <AbsoluteFill style={{ background: '#080812' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at ${cx}px ${cy}px, rgba(6,182,212,0.12) 0%, transparent 55%)` }} />

      <svg width={width} height={height} style={{ position: 'absolute' }}>
        {Array.from({ length: BARS }).map((_, i) => {
          const angle = (i / BARS) * Math.PI * 2 - Math.PI / 2;
          const val = fakeAudio(frame, i);
          const len = 20 + val * 70;
          const r1 = 90;
          return (
            <line
              key={i}
              x1={cx + r1 * Math.cos(angle)}
              y1={cy + r1 * Math.sin(angle)}
              x2={cx + (r1 + len) * Math.cos(angle)}
              y2={cy + (r1 + len) * Math.sin(angle)}
              stroke={`rgba(6,182,212,${0.35 + val * 0.65})`}
              strokeWidth={4.5}
              strokeLinecap="round"
            />
          );
        })}
        <circle cx={cx} cy={cy} r={68} fill="rgba(6,182,212,0.06)" stroke="rgba(6,182,212,0.2)" strokeWidth={1.5} />
      </svg>

      {Array.from({ length: PARTICLES }).map((_, i) => {
        const seed = i * 137.5;
        const angle = (seed % 360) * (Math.PI / 180) + frame * 0.006;
        const radius = 130 + (seed % 90);
        const size = 1.5 + (seed % 3);
        const opacity = 0.2 + Math.sin(frame * 0.04 + i) * 0.3;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: cx + radius * Math.cos(angle),
            top: cy + radius * Math.sin(angle),
            width: size, height: size,
            borderRadius: '50%',
            background: `rgba(6,182,212,${Math.max(0, opacity)})`,
          }} />
        );
      })}

      <div style={{ position: 'absolute', left: cx - 70, top: cy - 18, width: 140, textAlign: 'center', fontFamily: "'Inter',sans-serif" }}>
        <div style={{ color: '#fff', fontSize: 15, fontWeight: 700, letterSpacing: -0.3 }}>Midnight Run</div>
        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 2 }}>synthwave.wav</div>
      </div>

      <div style={{ position: 'absolute', bottom: 55, left: 36, right: 36, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
        <div style={{ width: `${progress * 100}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #22d3ee)', borderRadius: 2 }} />
      </div>
      <div style={{ position: 'absolute', bottom: 36, left: 36, fontFamily: "'Inter',sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
        {Math.floor(progress * 30)}:{String(Math.floor((progress * 30 * 60) % 60)).padStart(2, '0')}
      </div>
    </AbsoluteFill>
  );
};

export default MusicVisualizerDemo;
