/**
 * Generate SVG path data from Natural Earth 110m land boundaries.
 * Uses our exact Mercator projection to match RunningWorldMap.tsx.
 * Clips to visible geographic bounds before projection.
 *
 * Usage: node scripts/generate-world-paths.mjs > src/data/world-land-paths.ts
 */

import { feature } from 'topojson-client';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load 110m land TopoJSON from world-atlas package
const topoPath = resolve(__dirname, '../node_modules/world-atlas/land-110m.json');
const topo = JSON.parse(readFileSync(topoPath, 'utf-8'));
const land = feature(topo, topo.objects.land);

// --- Projection (must match RunningWorldMap.tsx) ---
const MAP_W = 1080;
const MAP_H = 600;

// Geographic bounds we want to show
const LNG_MIN = -30;
const LNG_MAX = 150;
const LAT_MIN = -15;  // Cut off southern hemisphere below this
const LAT_MAX = 72;   // Cut off Arctic above this

function lerp(val, inMin, inMax, outMin, outMax) {
  const t = Math.max(0, Math.min(1, (val - inMin) / (inMax - inMin)));
  return outMin + (outMax - outMin) * t;
}

function project(lat, lng) {
  const x = lerp(lng, -30, 150, 40, MAP_W - 40);
  const latRad = (lat * Math.PI) / 180;
  const mercY = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = lerp(mercY, -0.2, 1.2, MAP_H - 40, 40);
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

// Check if a geographic point is within our visible bounds
function inBounds(lng, lat) {
  return lng >= LNG_MIN - 5 && lng <= LNG_MAX + 5 &&
         lat >= LAT_MIN - 5 && lat <= LAT_MAX + 5;
}

// Convert a GeoJSON ring [[lng,lat], ...] → SVG path segment
function ringToPath(ring) {
  // Filter to points within geographic bounds
  const clipped = ring.filter(([lng, lat]) => inBounds(lng, lat));

  // Need at least 3 visible points to form a polygon
  if (clipped.length < 3) return '';

  // Project all visible points
  const projected = clipped.map(([lng, lat]) => {
    // Clamp lat/lng to our bounds before projection
    const cLat = Math.max(LAT_MIN, Math.min(LAT_MAX, lat));
    const cLng = Math.max(LNG_MIN, Math.min(LNG_MAX, lng));
    return project(cLat, cLng);
  });

  // Douglas-Peucker simplification (threshold = 2px for smoother lines)
  const simplified = douglasPeucker(projected, 2.0);

  if (simplified.length < 3) return '';

  return simplified
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`)
    .join('') + 'Z';
}

// Douglas-Peucker line simplification
function douglasPeucker(points, epsilon) {
  if (points.length <= 2) return points;

  // Find the point with maximum distance from the line (first → last)
  let maxDist = 0;
  let maxIdx = 0;
  const [x1, y1] = points[0];
  const [x2, y2] = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDist(points[i], [x1, y1], [x2, y2]);
    if (d > maxDist) {
      maxDist = d;
      maxIdx = i;
    }
  }

  if (maxDist > epsilon) {
    const left = douglasPeucker(points.slice(0, maxIdx + 1), epsilon);
    const right = douglasPeucker(points.slice(maxIdx), epsilon);
    return [...left.slice(0, -1), ...right];
  }

  return [points[0], points[points.length - 1]];
}

function perpendicularDist([px, py], [x1, y1], [x2, y2]) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
  const nearX = x1 + t * dx;
  const nearY = y1 + t * dy;
  return Math.sqrt((px - nearX) ** 2 + (py - nearY) ** 2);
}

// Process all geometries
const paths = [];

for (const feat of land.features ?? [land]) {
  const geom = feat.geometry ?? feat;

  const processRings = (rings) => {
    for (const ring of rings) {
      const d = ringToPath(ring);
      if (d && d.length > 20) paths.push(d);  // Skip tiny fragments
    }
  };

  if (geom.type === 'Polygon') {
    processRings(geom.coordinates);
  } else if (geom.type === 'MultiPolygon') {
    for (const polygon of geom.coordinates) {
      processRings(polygon);
    }
  }
}

// Output each path separately for readability, but combine for rendering
const combined = paths.join('');

console.log('// Auto-generated from Natural Earth 110m land boundaries');
console.log('// Regenerate: node scripts/generate-world-paths.mjs > src/data/world-land-paths.ts');
console.log(`// ${paths.length} polygons, ${combined.length} chars`);
console.log('');
console.log('export const WORLD_LAND_PATH =');

// Split into multiple string literals for readability
const CHUNK = 200;
const lines = [];
for (let i = 0; i < combined.length; i += CHUNK) {
  lines.push(`  "${combined.slice(i, i + CHUNK)}"`);
}
console.log(lines.join(' +\n') + ';');
