import { Player } from '@remotion/player';
import { useCallback, useState } from 'react';

type TemplateId =
  | 'music-visualizer'
  | 'portfolio-trailer'
  | 'presentation'
  | 'shorts-reels'
  | 'youtube-intro'
  | 'sns-ad'
  | 'product-showcase'
  | 'data-viz';

const CONFIGS: Record<TemplateId, { w: number; h: number; frames: number }> = {
  'music-visualizer': { w: 1080, h: 1920, frames: 180 },
  'portfolio-trailer': { w: 1920, h: 1080, frames: 180 },
  'presentation': { w: 1920, h: 1080, frames: 150 },
  'shorts-reels': { w: 1080, h: 1920, frames: 180 },
  'youtube-intro': { w: 1920, h: 1080, frames: 150 },
  'sns-ad': { w: 1080, h: 1920, frames: 150 },
  'product-showcase': { w: 1920, h: 1080, frames: 180 },
  'data-viz': { w: 1920, h: 1080, frames: 150 },
};

const importMap: Record<TemplateId, () => Promise<{ default: React.FC }>> = {
  'music-visualizer': () => import('./demos/MusicVisualizerDemo'),
  'portfolio-trailer': () => import('./demos/PortfolioTrailerDemo'),
  'presentation': () => import('./demos/PresentationDemo'),
  'shorts-reels': () => import('./demos/ShortsReelsDemo'),
  'youtube-intro': () => import('./demos/YoutubeIntroDemo'),
  'sns-ad': () => import('./demos/SnsAdDemo'),
  'product-showcase': () => import('./demos/ProductShowcaseDemo'),
  'data-viz': () => import('./demos/DataVizDemo'),
};

export default function TemplatePlayer({ templateId }: { templateId: TemplateId }) {
  const cfg = CONFIGS[templateId];
  const isVertical = cfg.h > cfg.w;
  const [loaded, setLoaded] = useState(false);

  const lazyComponent = useCallback(() => {
    return importMap[templateId]().then((mod) => {
      setLoaded(true);
      return mod;
    });
  }, [templateId]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: isVertical ? 260 : '100%',
      margin: '0 auto',
    }}>
      {/* Device frame */}
      <div style={{
        borderRadius: isVertical ? 28 : 10,
        padding: isVertical ? 10 : 6,
        background: '#1a1a1a',
        border: '2px solid rgba(255,255,255,0.08)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}>
        {/* Screen */}
        <div style={{
          borderRadius: isVertical ? 20 : 6,
          overflow: 'hidden',
          position: 'relative',
          background: '#000',
        }}>
          {!loaded && (
            <div style={{
              aspectRatio: `${cfg.w}/${cfg.h}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#0a0a14',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.1)',
                borderTopColor: 'rgba(255,255,255,0.4)',
                animation: 'spin 0.8s linear infinite',
              }} />
            </div>
          )}
          <Player
            lazyComponent={lazyComponent}
            compositionWidth={cfg.w}
            compositionHeight={cfg.h}
            durationInFrames={cfg.frames}
            fps={30}
            loop
            autoPlay
            style={{ width: '100%', display: loaded ? 'block' : 'none' }}
          />
        </div>
      </div>

      {/* Device stand (monitor only) */}
      {!isVertical && (
        <div style={{
          width: '35%', height: 4, margin: '10px auto 0',
          background: 'rgba(255,255,255,0.06)', borderRadius: 2,
        }} />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
