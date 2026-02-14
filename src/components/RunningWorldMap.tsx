import { useEffect, useRef, useMemo } from 'react';
import type { RunEntry } from '../lib/strava';

interface Props {
  runs: RunEntry[];
}

// --- City coordinates (matching strava.ts LOCATIONS) ---

const CITIES = [
  { name: 'Seoul', flag: '\u{1F1F0}\u{1F1F7}', lat: 37.4, lng: 127.0 },
  { name: 'Hyderabad', flag: '\u{1F1EE}\u{1F1F3}', lat: 17.4, lng: 78.4 },
  { name: 'Busan', flag: '\u{1F1F0}\u{1F1F7}', lat: 35.2, lng: 129.2 },
  { name: 'London', flag: '\u{1F1EC}\u{1F1E7}', lat: 51.5, lng: -0.1 },
  { name: 'Lisbon', flag: '\u{1F1F5}\u{1F1F9}', lat: 38.7, lng: -9.1 },
  { name: 'Porto', flag: '\u{1F1F5}\u{1F1F9}', lat: 41.1, lng: -8.6 },
  { name: 'Chennai', flag: '\u{1F1EE}\u{1F1F3}', lat: 13.1, lng: 80.3 },
  { name: 'Jakarta', flag: '\u{1F1EE}\u{1F1E9}', lat: -6.2, lng: 106.8 },
  { name: 'Yantai', flag: '\u{1F1E8}\u{1F1F3}', lat: 37.6, lng: 121.2 },
] as const;

// Chronological route order
const ROUTE_ORDER = [
  'Yantai', 'Jakarta', 'Chennai', 'Lisbon', 'Porto',
  'London', 'Busan', 'Hyderabad', 'Seoul',
];

// --- Mercator projection ---

const MAP_W = 1080;
const MAP_H = 600;

function lerp(val: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  const t = Math.max(0, Math.min(1, (val - inMin) / (inMax - inMin)));
  return outMin + (outMax - outMin) * t;
}

function project(lat: number, lng: number): [number, number] {
  const x = lerp(lng, -30, 150, 40, MAP_W - 40);
  const latRad = (lat * Math.PI) / 180;
  const mercY = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = lerp(mercY, -0.2, 1.2, MAP_H - 40, 40);
  return [x, y];
}

// --- Simplified continent outlines [lat, lng][] ---
// Covers the visible viewport: lng -30..150, lat -12..63

const LAND: [number, number][][] = [
  // Europe mainland (clockwise from SW Portugal)
  [
    [36,-9],[37,-7],[38,-3],[43,-2],[44,0],[46,-2],[48,-5],[50,-1],
    [51,2],[53,5],[54,8],[55,10],[54,14],[54,19],[56,21],[58,24],
    [60,28],[60,32],[58,40],[54,40],[50,40],[47,38],[44,40],
    [42,29],[41,29],[40,26],[38,24],[37,22],[38,20],[40,20],
    [43,17],[44,15],[46,14],[46,7],[44,3],[43,0],[43,-2],[42,-9],
    [40,-9],[36,-9],
  ],
  // Italy
  [
    [46,8],[46,13],[44,13],[43,11],[42,12],[41,15],[40,16],
    [38,16],[38,13],[40,10],[42,10],[44,8],[46,8],
  ],
  // British Isles
  [
    [50,-6],[51,-5],[52,-1],[53,0],[55,-1],[57,-2],[58,-5],
    [57,-6],[55,-5],[54,-4],[52,-5],[50,-6],
  ],
  // Scandinavia
  [
    [56,8],[58,5],[60,5],[63,10],[66,14],[70,20],[71,28],
    [68,28],[64,20],[60,18],[57,14],[56,12],[56,8],
  ],
  // Africa (visible portion above lat ~ -12)
  [
    [37,-2],[37,10],[33,10],[32,20],[31,32],[30,33],
    [25,37],[20,40],[12,44],[10,50],[5,44],[0,42],
    [-5,40],[-10,40],[-10,15],[-5,5],[0,5],[5,0],
    [5,-8],[10,-15],[15,-17],[22,-17],[28,-13],[33,-8],[37,-2],
  ],
  // Arabian Peninsula
  [
    [31,32],[30,35],[28,37],[25,38],[20,41],[15,43],
    [13,48],[16,52],[22,56],[26,56],[28,50],[30,48],
    [33,45],[37,40],[37,36],[35,36],[33,35],[31,32],
  ],
  // India
  [
    [33,75],[30,70],[28,68],[25,65],[23,69],[20,73],
    [15,74],[8,77],[8,80],[15,80],[20,85],[23,89],
    [26,89],[28,87],[30,78],[33,75],
  ],
  // Southeast Asia mainland
  [
    [28,97],[25,90],[23,89],[20,93],[16,98],[13,100],
    [10,99],[5,100],[3,101],[1,104],[5,104],[10,106],
    [13,109],[16,108],[20,106],[22,103],[24,98],[28,97],
  ],
  // China / East Asia
  [
    [48,75],[42,80],[40,75],[35,70],[33,75],[30,78],
    [28,87],[28,97],[24,98],[22,100],[22,108],[25,115],
    [28,120],[30,122],[34,120],[38,118],[40,122],[41,122],
    [43,125],[45,130],[48,135],[50,140],[54,138],
    [55,135],[53,130],[50,128],[48,130],[46,130],
    [43,120],[40,117],[42,110],[45,95],[48,85],[48,75],
  ],
  // Korean Peninsula
  [
    [34,126],[35,129],[37,129],[39,128],[42,130],
    [40,124],[38,126],[36,126],[34,126],
  ],
  // Japan (Honshu + Hokkaido simplified)
  [
    [31,131],[33,131],[34,133],[35,136],[37,140],
    [40,140],[42,141],[44,145],[43,146],[41,141],
    [38,139],[36,137],[35,134],[33,132],[31,131],
  ],
  // Sumatra
  [[5,95],[3,98],[0,101],[-3,104],[-6,105],[-5,103],[-2,100],[2,97],[5,95]],
  // Java
  [[-6,106],[-7,108],[-8,112],[-8,115],[-7,114],[-6,110],[-6,106]],
  // Borneo
  [[7,117],[4,115],[1,109],[-1,109],[-3,116],[0,118],[4,118],[7,117]],
];

// Convert [lat,lng] polygon to SVG path string
function polygonToPath(points: [number, number][]): string {
  return points
    .map(([lat, lng], i) => {
      const [x, y] = project(lat, lng);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join('') + 'Z';
}

// --- SVG path length estimation ---

function pathLength(d: string): number {
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

// --- Component ---

export default function RunningWorldMap({ runs }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const hasAnimated = useRef(false);

  // Aggregate runs by city
  const cityStats = useMemo(() => {
    const map = new Map<string, { count: number; totalKm: number }>();
    for (const r of runs) {
      if (r.location === 'Unknown' || r.location === 'Other') continue;
      const existing = map.get(r.location) || { count: 0, totalKm: 0 };
      existing.count += 1;
      existing.totalKm += r.distanceKm;
      map.set(r.location, existing);
    }
    return map;
  }, [runs]);

  // Filter route to only cities that have runs in current data
  const activeCities = useMemo(() => {
    return ROUTE_ORDER
      .map((name) => CITIES.find((c) => c.name === name))
      .filter((c): c is typeof CITIES[number] => c != null && cityStats.has(c.name));
  }, [cityStats]);

  // Build route path
  const routePath = useMemo(() => {
    if (activeCities.length === 0) return '';
    return activeCities
      .map((c, i) => {
        const [x, y] = project(c.lat, c.lng);
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }, [activeCities]);

  const routeLen = useMemo(() => pathLength(routePath), [routePath]);

  // Grid lines
  const latLines = [0, 20, 40, 60].map((lat) => ({ lat, y: project(lat, 0)[1] }));
  const lngLines = [-20, 0, 30, 60, 90, 120].map((lng) => ({ lng, x: project(0, lng)[0] }));

  // IntersectionObserver: add .animate class when visible
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          svg.classList.add('animate');
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  // Reset animation trigger when data changes (period filter)
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    hasAnimated.current = false;
    svg.classList.remove('animate');
    // Re-trigger if already in viewport
    const rect = svg.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      requestAnimationFrame(() => {
        hasAnimated.current = true;
        svg.classList.add('animate');
      });
    }
  }, [runs]);

  if (activeCities.length === 0) return null;

  const totalCities = activeCities.length;
  const totalCountries = new Set(activeCities.map((c) => c.flag)).size;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Running World Map</h2>
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 overflow-hidden">
        <style>{`
          /* Route line animation */
          .world-map-route {
            stroke-dasharray: ${routeLen};
            stroke-dashoffset: ${routeLen};
            transition: none;
          }
          svg.animate .world-map-route {
            stroke-dashoffset: 0;
            transition: stroke-dashoffset 2s ease-out;
          }

          /* Route glow */
          .world-map-glow {
            stroke-dasharray: ${routeLen};
            stroke-dashoffset: ${routeLen};
            transition: none;
          }
          svg.animate .world-map-glow {
            stroke-dashoffset: 0;
            transition: stroke-dashoffset 2s ease-out;
          }

          /* City marker pop-in */
          .city-marker {
            transform: scale(0);
            transform-origin: center;
            transform-box: fill-box;
            transition: none;
          }
          svg.animate .city-marker {
            transform: scale(1);
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          /* City label fade-in */
          .city-label {
            opacity: 0;
            transition: none;
          }
          svg.animate .city-label {
            opacity: 1;
            transition: opacity 0.3s ease-out;
          }
        `}</style>

        <svg
          ref={svgRef}
          width="100%"
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="block"
        >
          {/* Grid lines */}
          {latLines.map((l) => (
            <line
              key={`lat-${l.lat}`}
              x1={0} y1={l.y} x2={MAP_W} y2={l.y}
              stroke="rgba(255,255,255,0.04)" strokeWidth={1}
            />
          ))}
          {lngLines.map((l) => (
            <line
              key={`lng-${l.lng}`}
              x1={l.x} y1={0} x2={l.x} y2={MAP_H}
              stroke="rgba(255,255,255,0.04)" strokeWidth={1}
            />
          ))}

          {/* Continent outlines */}
          {LAND.map((poly, i) => (
            <path
              key={`land-${i}`}
              d={polygonToPath(poly)}
              fill="rgba(255,255,255,0.03)"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={0.8}
              strokeLinejoin="round"
            />
          ))}

          {/* Route glow */}
          {routePath && (
            <path
              d={routePath}
              fill="none"
              stroke="rgba(99, 102, 241, 0.3)"
              strokeWidth={6}
              strokeLinecap="round"
              className="world-map-glow"
              style={{ filter: 'blur(4px)' }}
            />
          )}

          {/* Route line */}
          {routePath && (
            <path
              d={routePath}
              fill="none"
              stroke="#6366f1"
              strokeWidth={2.5}
              strokeLinecap="round"
              className="world-map-route"
            />
          )}

          {/* City markers + labels */}
          {activeCities.map((city, i) => {
            const [cx, cy] = project(city.lat, city.lng);
            const stats = cityStats.get(city.name);
            const delay = `${i * 0.2}s`;
            // Label positioning: above by default, below for high-latitude cities near others
            const labelAbove = city.name !== 'Porto'; // Porto goes below to avoid overlap with Lisbon

            return (
              <g key={city.name}>
                {/* Marker dot */}
                <circle
                  cx={cx} cy={cy} r={6}
                  fill="#6366f1" stroke="white" strokeWidth={2}
                  className="city-marker"
                  style={{ transitionDelay: delay }}
                />

                {/* City name */}
                <text
                  x={cx}
                  y={labelAbove ? cy - 14 : cy + 24}
                  textAnchor="middle"
                  fill="white"
                  fontSize={15}
                  fontWeight={600}
                  fontFamily="'Pretendard', 'Inter', sans-serif"
                  className="city-label"
                  style={{ transitionDelay: `${i * 0.2 + 0.15}s` }}
                >
                  {city.flag} {city.name}
                </text>

                {/* Run stats */}
                {stats && (
                  <text
                    x={cx}
                    y={labelAbove ? cy - 14 + 16 : cy + 24 + 16}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.5)"
                    fontSize={12}
                    fontFamily="'SF Mono', 'Consolas', monospace"
                    className="city-label"
                    style={{ transitionDelay: `${i * 0.2 + 0.2}s` }}
                  >
                    {stats.count} runs · {stats.totalKm.toFixed(1)}km
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Summary footer */}
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-[var(--color-text-muted)]">
          <span>{totalCities} cities</span>
          <span className="opacity-30">|</span>
          <span>{totalCountries} countries</span>
          <span className="opacity-30">|</span>
          <span>{runs.filter((r) => r.location !== 'Unknown' && r.location !== 'Other').length} runs mapped</span>
        </div>
      </div>
    </div>
  );
}
