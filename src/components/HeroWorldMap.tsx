import { useEffect, useRef, useState, useMemo } from 'react';
import { WORLD_LAND_PATH } from '../data/world-land-paths';

// 9 cities (hardcoded — no Strava API call on homepage)
const CITIES = [
  { name: 'Seoul', lat: 37.4, lng: 127.0 },
  { name: 'Hyderabad', lat: 17.4, lng: 78.4 },
  { name: 'Busan', lat: 35.2, lng: 129.2 },
  { name: 'London', lat: 51.5, lng: -0.1 },
  { name: 'Lisbon', lat: 38.7, lng: -9.1 },
  { name: 'Porto', lat: 41.1, lng: -8.6 },
  { name: 'Chennai', lat: 13.1, lng: 80.3 },
  { name: 'Jakarta', lat: -6.2, lng: 106.8 },
  { name: 'Yantai', lat: 37.6, lng: 121.2 },
] as const;

const ROUTE_ORDER = [
  'Yantai', 'Jakarta', 'Chennai', 'Lisbon', 'Porto',
  'London', 'Busan', 'Hyderabad', 'Seoul',
];

const orderedCities = ROUTE_ORDER.map((n) => CITIES.find((c) => c.name === n)!);

// --- Projection helpers ---

function lerp(v: number, a: number, b: number, c: number, d: number) {
  return c + (d - c) * Math.max(0, Math.min(1, (v - a) / (b - a)));
}

function makeProj(
  w: number, h: number,
  lngMin: number, lngMax: number,
  mercMin: number, mercMax: number,
  padX: number, padY: number,
) {
  return (lat: number, lng: number): [number, number] => {
    const x = lerp(lng, lngMin, lngMax, padX, w - padX);
    const latRad = (lat * Math.PI) / 180;
    const mercY = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = lerp(mercY, mercMin, mercMax, h - padY, padY);
    return [x, y];
  };
}

function pathLen(d: string): number {
  const nums = d.match(/-?\d+(\.\d+)?/g);
  if (!nums || nums.length < 4) return 0;
  let total = 0;
  for (let i = 2; i < nums.length; i += 2) {
    const dx = parseFloat(nums[i]) - parseFloat(nums[i - 2]);
    const dy = parseFloat(nums[i + 1]) - parseFloat(nums[i - 1]);
    total += Math.sqrt(dx * dx + dy * dy);
  }
  return total;
}

// Affine transforms: remap WORLD_LAND_PATH (generated for 1080x600 canvas) to hero viewBoxes
// Land projection: lng[-30,150]→x[40,1040], mercY[-0.2,1.2]→y[560,40]
// Desktop hero:    lng[-30,150]→x[40,1160], mercY[-0.2,1.2]→y[470,30]
// Mobile hero:     lng[-20,140]→x[20,480],  mercY[-0.15,1.1]→y[380,20]
const LAND_TX_DESKTOP = 'matrix(1.12,0,0,0.8462,-4.8,-3.85)';
const LAND_TX_MOBILE = 'matrix(0.5175,0,0,0.7753,-29.45,-39.82)';

// --- Component ---

export default function HeroWorldMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mobile, setMobile] = useState(false);

  // Responsive breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    setMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Trigger entrance animation
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.classList.remove('on');
    const t = setTimeout(() => svg.classList.add('on'), 250);
    return () => clearTimeout(t);
  }, [mobile]);

  // Mode-specific config
  const cfg = useMemo(() => {
    if (mobile) {
      return {
        w: 500, h: 400,
        proj: makeProj(500, 400, -20, 140, -0.15, 1.1, 20, 20),
        landTx: LAND_TX_MOBILE,
        latLats: [0, 20, 40, 60],
        lngLngs: [0, 30, 60, 90, 120],
      };
    }
    return {
      w: 1200, h: 500,
      proj: makeProj(1200, 500, -30, 150, -0.2, 1.2, 40, 30),
      landTx: LAND_TX_DESKTOP,
      latLats: [0, 20, 40, 60],
      lngLngs: [-20, 0, 30, 60, 90, 120],
    };
  }, [mobile]);

  const { w, h, proj, landTx } = cfg;

  // Route path & length
  const routePath = useMemo(
    () =>
      orderedCities
        .map((c, i) => {
          const [x, y] = proj(c.lat, c.lng);
          return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(' '),
    [proj],
  );
  const routeLen = useMemo(() => Math.ceil(pathLen(routePath)), [routePath]);

  // Grid lines
  const latLines = cfg.latLats.map((lat) => proj(lat, 0)[1]);
  const lngLines = cfg.lngLngs.map((lng) => proj(0, lng)[0]);

  return (
    <>
      <style>{`
        .hero-map .land{opacity:0;transition:opacity 1.2s ease-out .1s}
        .hero-map.on .land{opacity:1}
        .hero-map .grid-line{opacity:0;transition:opacity .8s ease-out}
        .hero-map.on .grid-line{opacity:1}
        .hero-map .route-glow{stroke-dasharray:${routeLen};stroke-dashoffset:${routeLen}}
        .hero-map.on .route-glow{stroke-dashoffset:0;transition:stroke-dashoffset 3.5s ease-in-out .5s}
        .hero-map .route-line{stroke-dasharray:${routeLen};stroke-dashoffset:${routeLen}}
        .hero-map.on .route-line{stroke-dashoffset:0;transition:stroke-dashoffset 3.5s ease-in-out .5s}
        .hero-map .route-head{stroke-dasharray:50 ${routeLen + 50};stroke-dashoffset:${routeLen + 100}}
        .hero-map.on .route-head{stroke-dashoffset:0;transition:stroke-dashoffset 3.5s ease-in-out .5s}
        .hero-map .dot{transform:scale(0);transform-origin:center;transform-box:fill-box}
        .hero-map.on .dot{transform:scale(1);transition:transform .5s cubic-bezier(.34,1.56,.64,1)}
        @keyframes hero-ping{0%{r:3;opacity:.5}100%{r:18;opacity:0}}
        .hero-map.on .ping{animation:hero-ping 3s ease-out infinite}
        .hero-map .orbit{opacity:0}
        .hero-map.on .orbit{opacity:1;transition:opacity .5s ease-out 4s}
      `}</style>

      <svg
        ref={svgRef}
        className="hero-map"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <radialGradient id="hg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity=".12" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* Background glow */}
        <rect width={w} height={h} fill="url(#hg)" />

        {/* Grid */}
        {latLines.map((y, i) => (
          <line
            key={`lat${i}`}
            x1={0} y1={y} x2={w} y2={y}
            stroke="rgba(99,102,241,.04)" strokeWidth={.5}
            className="grid-line"
            style={{ transitionDelay: `${i * 0.05}s` }}
          />
        ))}
        {lngLines.map((x, i) => (
          <line
            key={`lng${i}`}
            x1={x} y1={0} x2={x} y2={h}
            stroke="rgba(99,102,241,.04)" strokeWidth={.5}
            className="grid-line"
            style={{ transitionDelay: `${i * 0.05}s` }}
          />
        ))}

        {/* Continent outlines (affine-transformed from generated land data) */}
        <g transform={landTx}>
          <path
            d={WORLD_LAND_PATH}
            className="land"
            fill="rgba(129,140,248,.08)"
            stroke="rgba(165,180,252,.22)"
            strokeWidth={mobile ? 1.4 : .8}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* Route glow */}
        <path
          d={routePath}
          fill="none"
          stroke="rgba(99,102,241,.15)"
          strokeWidth={mobile ? 8 : 10}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="route-glow"
          style={{ filter: `blur(${mobile ? 6 : 8}px)` }}
        />

        {/* Route line */}
        <path
          d={routePath}
          fill="none"
          stroke="#6366f1"
          strokeWidth={mobile ? 2 : 1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="route-line"
          opacity={.5}
        />

        {/* Comet head */}
        <path
          d={routePath}
          fill="none"
          stroke="#a5b4fc"
          strokeWidth={mobile ? 4 : 3}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="route-head"
          opacity={.7}
          style={{ filter: 'blur(2px)' }}
        />

        {/* City markers */}
        {orderedCities.map((city, i) => {
          const [cx, cy] = proj(city.lat, city.lng);
          const dotDelay = `${0.5 + i * 0.35}s`;
          const pingDelay = `${1.5 + i * 0.4}s`;
          const r = mobile ? 4 : 3;

          return (
            <g key={city.name}>
              <circle
                cx={cx} cy={cy} r={r}
                fill="none" stroke="#6366f1" strokeWidth={1}
                className="ping"
                style={{ animationDelay: pingDelay }}
              />
              <circle
                cx={cx} cy={cy} r={r}
                fill="#6366f1" stroke="#c7d2fe" strokeWidth={1.2}
                className="dot"
                style={{ transitionDelay: dotDelay }}
              />
            </g>
          );
        })}

        {/* Orbiting glow dot */}
        <g className="orbit">
          <circle r={mobile ? 5 : 4} fill="#818cf8" opacity={.5} filter="url(#glow)">
            <animateMotion dur="10s" repeatCount="indefinite" path={routePath} />
          </circle>
          <circle r={mobile ? 3 : 2} fill="#c7d2fe" opacity={.7}>
            <animateMotion dur="10s" repeatCount="indefinite" path={routePath} />
          </circle>
        </g>
      </svg>
    </>
  );
}
