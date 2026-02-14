import { useEffect, useRef, useMemo } from 'react';
import type { RunEntry } from '../lib/strava';
import { WORLD_LAND_PATH } from '../data/world-land-paths';

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
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

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

          {/* Continent outlines (Natural Earth 110m) */}
          <path
            d={WORLD_LAND_PATH}
            fill="rgba(255,255,255,0.04)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={isMobile ? 1.5 : 0.8}
            strokeLinejoin="round"
          />

          {/* Route glow */}
          {routePath && (
            <path
              d={routePath}
              fill="none"
              stroke="rgba(99, 102, 241, 0.3)"
              strokeWidth={isMobile ? 10 : 6}
              strokeLinecap="round"
              className="world-map-glow"
              style={{ filter: `blur(${isMobile ? 6 : 4}px)` }}
            />
          )}

          {/* Route line */}
          {routePath && (
            <path
              d={routePath}
              fill="none"
              stroke="#818cf8"
              strokeWidth={isMobile ? 4 : 2.5}
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
            const markerR = isMobile ? 10 : 6;
            const nameSize = isMobile ? 26 : 15;
            const statsSize = isMobile ? 20 : 12;
            const nameOffset = isMobile ? 22 : 14;
            const statsGap = isMobile ? 24 : 16;

            return (
              <g key={city.name}>
                {/* Marker dot */}
                <circle
                  cx={cx} cy={cy} r={markerR}
                  fill="#818cf8" stroke="white" strokeWidth={isMobile ? 3 : 2}
                  className="city-marker"
                  style={{ transitionDelay: delay }}
                />

                {/* City name */}
                <text
                  x={cx}
                  y={labelAbove ? cy - nameOffset : cy + nameOffset + markerR}
                  textAnchor="middle"
                  fill="white"
                  fontSize={nameSize}
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
                    y={labelAbove ? cy - nameOffset + statsGap : cy + nameOffset + markerR + statsGap}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.6)"
                    fontSize={statsSize}
                    fontFamily="'SF Mono', 'Consolas', monospace"
                    className="city-label"
                    style={{ transitionDelay: `${i * 0.2 + 0.2}s` }}
                  >
                    {stats.count} runs · {stats.totalKm.toFixed(0)}km
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
