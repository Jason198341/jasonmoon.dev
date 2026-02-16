import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring } from 'remotion';

const PortfolioTrailerDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kenBurns = interpolate(frame, [0, 180], [1, 1.12], { extrapolateRight: 'clamp' });
  const panX = interpolate(frame, [0, 180], [0, -2], { extrapolateRight: 'clamp' });
  const panY = interpolate(frame, [0, 180], [0, -1.5], { extrapolateRight: 'clamp' });

  const cardEnter = spring({ frame: frame - 20, fps, config: { damping: 14, stiffness: 80 } });
  const titleEnter = spring({ frame: frame - 30, fps, config: { damping: 12 } });
  const badgesEnter = spring({ frame: frame - 50, fps, config: { damping: 14 } });

  const tags = ['React', 'TypeScript', 'Remotion'];

  return (
    <AbsoluteFill style={{ background: '#0a0a14' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, #1a1a3e, #16213e, #0f3460)',
        backgroundSize: '100% 100%',
        transform: `scale(${kenBurns}) translate(${panX}%, ${panY}%)`,
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.4) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />
      </div>

      <div style={{
        position: 'absolute', bottom: 60, left: 50, right: 50,
        background: 'rgba(10,10,20,0.75)', backdropFilter: 'blur(16px)',
        borderRadius: 16, border: '1px solid rgba(99,102,241,0.2)',
        padding: '28px 32px',
        opacity: cardEnter, transform: `translateY(${(1 - cardEnter) * 30}px)`,
      }}>
        <div style={{
          fontSize: 22, fontWeight: 800, color: '#fff',
          fontFamily: "'Inter',sans-serif", letterSpacing: -0.5,
          opacity: titleEnter, transform: `translateY(${(1 - titleEnter) * 10}px)`,
        }}>
          Prompt Garden
        </div>
        <div style={{
          fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 6,
          fontFamily: "'Inter',sans-serif",
        }}>
          Visual prompt engineering with node-based workflows
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14, opacity: badgesEnter }}>
          {tags.map((tag, i) => (
            <span key={i} style={{
              fontSize: 11, padding: '3px 10px', borderRadius: 20,
              background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
              color: '#818cf8', fontFamily: "'Inter',sans-serif", fontWeight: 600,
            }}>{tag}</span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default PortfolioTrailerDemo;
