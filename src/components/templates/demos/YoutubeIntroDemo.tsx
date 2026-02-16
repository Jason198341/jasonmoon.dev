import { useCurrentFrame, useVideoConfig, AbsoluteFill, spring, interpolate } from 'remotion';

const YoutubeIntroDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame: frame - 5, fps, config: { damping: 8, stiffness: 100, mass: 0.8 } });
  const nameReveal = interpolate(frame, [18, 40], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const glowPulse = 0.3 + Math.sin(frame * 0.08) * 0.2;
  const taglineEnter = spring({ frame: frame - 45, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ background: '#0a0a0f' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 50% 45%, rgba(239,68,68,${glowPulse * 0.15}) 0%, transparent 50%)`,
      }} />

      <div style={{
        position: 'absolute', top: '38%', left: '50%',
        transform: `translate(-50%, -50%) scale(${logoScale})`,
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 20,
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 ${30 + glowPulse * 20}px rgba(239,68,68,${glowPulse})`,
        }}>
          <svg width={36} height={36} viewBox="0 0 24 24" fill="#fff">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      <div style={{
        position: 'absolute', top: '56%', left: '50%', transform: 'translateX(-50%)',
        fontFamily: "'Inter',sans-serif", fontSize: 36, fontWeight: 900,
        color: '#fff', letterSpacing: -1.5, whiteSpace: 'nowrap',
        clipPath: `inset(0 ${100 - nameReveal}% 0 0)`,
      }}>
        CREATOR<span style={{ color: '#ef4444' }}>HUB</span>
      </div>

      <div style={{
        position: 'absolute', top: '66%', left: '50%',
        transform: `translateX(-50%) translateY(${(1 - taglineEnter) * 10}px)`,
        fontFamily: "'Inter',sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)',
        letterSpacing: 3, textTransform: 'uppercase',
        opacity: taglineEnter,
      }}>
        Make It Happen
      </div>
    </AbsoluteFill>
  );
};

export default YoutubeIntroDemo;
