import { useCurrentFrame, useVideoConfig, AbsoluteFill, spring, interpolate } from 'remotion';

const SnsAdDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const badgeEnter = spring({ frame: frame - 5, fps, config: { damping: 10, stiffness: 120 } });
  const productEnter = spring({ frame: frame - 15, fps, config: { damping: 12 } });
  const priceEnter = spring({ frame: frame - 30, fps, config: { damping: 14 } });
  const ctaEnter = spring({ frame: frame - 45, fps, config: { damping: 10, stiffness: 80 } });

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(160deg, #1a0a1e, #2d0a3e, #1a0a2e)' }}>
      <div style={{ position: 'absolute', top: 30, right: 24, opacity: badgeEnter, transform: `translateY(${(1 - badgeEnter) * -20}px) scale(${badgeEnter})` }}>
        <div style={{
          background: '#ec4899', borderRadius: 8, padding: '6px 14px',
          fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 800, color: '#fff',
          boxShadow: '0 4px 15px rgba(236,72,153,0.4)',
        }}>
          50% OFF
        </div>
      </div>

      <div style={{
        position: 'absolute', top: '28%', left: '50%',
        transform: `translate(-50%, -50%) scale(${0.8 + productEnter * 0.2})`,
        opacity: productEnter,
      }}>
        <div style={{
          width: 160, height: 160, borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(168,85,247,0.15))',
          border: '2px solid rgba(236,72,153,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        }}>
          <div style={{ fontSize: 64 }}>{"\u2728"}</div>
        </div>
      </div>

      <div style={{
        position: 'absolute', top: '52%', left: '50%',
        transform: `translateX(-50%) translateY(${(1 - priceEnter) * 15}px)`,
        textAlign: 'center', fontFamily: "'Inter',sans-serif",
        opacity: priceEnter,
      }}>
        <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: -1 }}>ProWidget X</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>Premium Design Tool</div>
        <div style={{ marginTop: 14, display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'baseline' }}>
          <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>$49</span>
          <span style={{ fontSize: 32, fontWeight: 900, color: '#ec4899' }}>$24</span>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 60, left: 30, right: 30,
        opacity: ctaEnter, transform: `translateY(${(1 - ctaEnter) * 20}px)`,
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #ec4899, #d946ef)',
          borderRadius: 16, padding: '16px 0', textAlign: 'center',
          fontFamily: "'Inter',sans-serif", fontSize: 16, fontWeight: 800, color: '#fff',
          boxShadow: '0 8px 30px rgba(236,72,153,0.3)',
        }}>
          Shop Now
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default SnsAdDemo;
