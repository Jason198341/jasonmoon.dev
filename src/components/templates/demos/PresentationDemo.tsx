import { useCurrentFrame, useVideoConfig, AbsoluteFill, spring } from 'remotion';

const bullets = [
  'Composable React components for every scene',
  'Spring-based animations with frame precision',
  'TypeScript config → production video',
  'Render MP4 with a single command',
];

const PresentationDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleEnter = spring({ frame: frame - 8, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(160deg, #1e1b4b, #312e81)' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, rgba(168,85,247,0.5) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div style={{ position: 'absolute', top: 30, left: 40, right: 40, height: 3, background: 'rgba(168,85,247,0.2)', borderRadius: 2 }}>
        <div style={{ width: `${Math.min(100, (frame / 150) * 100)}%`, height: '100%', background: '#a855f7', borderRadius: 2, transition: 'width 0.1s' }} />
      </div>

      <div style={{ padding: '70px 60px 40px', fontFamily: "'Inter',sans-serif" }}>
        <div style={{
          fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: -0.8,
          opacity: titleEnter, transform: `translateY(${(1 - titleEnter) * 20}px)`,
        }}>
          Why Remotion?
        </div>
        <div style={{ width: 60, height: 3, background: '#a855f7', borderRadius: 2, marginTop: 14, opacity: titleEnter }} />

        <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {bullets.map((text, i) => {
            const enter = spring({ frame: frame - 25 - i * 12, fps, config: { damping: 14, stiffness: 100 } });
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                opacity: enter, transform: `translateX(${(1 - enter) * -20}px)`,
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 12, flexShrink: 0, marginTop: 1,
                  background: 'rgba(168,85,247,0.15)', border: '1.5px solid rgba(168,85,247,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{text}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 24, right: 40, fontSize: 13, color: 'rgba(168,85,247,0.5)', fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>
        01 / 04
      </div>
    </AbsoluteFill>
  );
};

export default PresentationDemo;
