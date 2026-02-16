import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring } from 'remotion';

const subtitles = [
  { text: 'The future of video is code.', style: 'box' as const },
  { text: 'Edit config. Render MP4.', style: 'outline' as const },
  { text: 'No After Effects needed.', style: 'glow' as const },
];

const ShortsReelsDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const kenBurns = interpolate(frame, [0, durationInFrames], [1, 1.15], { extrapolateRight: 'clamp' });
  const panX = interpolate(frame, [0, durationInFrames], [0, -3], { extrapolateRight: 'clamp' });

  const cycleLength = 60;
  const activeIdx = Math.floor(frame / cycleLength) % subtitles.length;
  const localFrame = frame % cycleLength;
  const fadeIn = interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(localFrame, [cycleLength - 8, cycleLength], [1, 0], { extrapolateRight: 'clamp' });
  const opacity = Math.min(fadeIn, fadeOut);
  const sub = subtitles[activeIdx];

  const subtitleStyle: React.CSSProperties = {
    fontFamily: "'Inter',sans-serif", fontSize: 22, fontWeight: 700,
    textAlign: 'center', padding: '10px 20px', letterSpacing: -0.3,
    ...(sub.style === 'box' ? {
      background: 'rgba(0,0,0,0.7)', color: '#fff', borderRadius: 6,
    } : sub.style === 'outline' ? {
      color: '#fff', WebkitTextStroke: '1px rgba(249,115,22,0.8)',
      textShadow: '0 2px 8px rgba(0,0,0,0.8)',
    } : {
      color: '#fff', textShadow: '0 0 20px rgba(249,115,22,0.6), 0 0 40px rgba(249,115,22,0.3)',
    }),
  };

  return (
    <AbsoluteFill style={{ background: '#0a0a0f' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, #f97316, #ea580c, #7c2d12)',
        transform: `scale(${kenBurns}) translateX(${panX}%)`,
        opacity: 0.4,
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8) 100%)' }} />

      <div style={{
        position: 'absolute', bottom: 80, left: 24, right: 24,
        display: 'flex', justifyContent: 'center', opacity,
      }}>
        <div style={subtitleStyle}>{sub.text}</div>
      </div>

      <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
        {subtitles.map((_, i) => (
          <div key={i} style={{
            width: i === activeIdx ? 20 : 6, height: 6, borderRadius: 3,
            background: i === activeIdx ? '#f97316' : 'rgba(255,255,255,0.2)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export default ShortsReelsDemo;
