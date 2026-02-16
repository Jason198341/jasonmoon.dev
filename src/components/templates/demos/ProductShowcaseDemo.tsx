import { useCurrentFrame, useVideoConfig, AbsoluteFill, spring } from 'remotion';

const features = [
  { icon: '\u26A1', label: 'Lightning Fast', desc: 'Sub-second render times' },
  { icon: '\uD83C\uDFA8', label: 'Fully Themeable', desc: 'Match your brand in seconds' },
  { icon: '\uD83D\uDD12', label: 'Enterprise Ready', desc: 'SOC2 compliant infrastructure' },
  { icon: '\uD83C\uDF0D', label: 'Global CDN', desc: '99.99% uptime guarantee' },
];

const ProductShowcaseDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const heroEnter = spring({ frame: frame - 5, fps, config: { damping: 12 } });
  const tagEnter = spring({ frame: frame - 15, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(160deg, #052e16, #064e3b, #0f172a)' }}>
      <div style={{ padding: '50px 60px', fontFamily: "'Inter',sans-serif" }}>
        <div style={{ opacity: heroEnter, transform: `translateY(${(1 - heroEnter) * 20}px)` }}>
          <div style={{ fontSize: 14, color: '#22c55e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Introducing</div>
          <div style={{ fontSize: 40, fontWeight: 900, color: '#fff', letterSpacing: -1.5, marginTop: 8 }}>CloudSync Pro</div>
          <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>The next generation of file synchronization</div>
        </div>

        <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, opacity: tagEnter }}>
          {features.map((f, i) => {
            const enter = spring({ frame: frame - 30 - i * 10, fps, config: { damping: 14 } });
            return (
              <div key={i} style={{
                padding: '18px 20px', borderRadius: 14,
                background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)',
                opacity: enter, transform: `translateY(${(1 - enter) * 15}px)`,
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{f.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{f.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{f.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default ProductShowcaseDemo;
