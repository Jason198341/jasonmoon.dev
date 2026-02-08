// Strava API utility — token refresh + enriched activity fetch

interface StravaTokenResponse {
  access_token: string;
  expires_at: number;
  refresh_token: string;
}

interface StravaActivity {
  id: number;
  name: string;
  type: string;
  sport_type: string;
  start_date_local: string;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number;
  average_speed: number; // m/s
  start_latlng?: [number, number] | null;
}

// --- Exported types ---

export interface RunEntry {
  date: string;         // e.g. "Feb 8"
  dateFull: string;     // ISO date for sorting
  distance: string;     // e.g. "5.23 km"
  distanceKm: number;   // 5.23 (for filtering)
  time: string;         // e.g. "28:15"
  timeSeconds: number;  // raw seconds (for PR detection)
  pace: string;         // e.g. "5'24\"/km"
  location: string;     // e.g. "Hyderabad"
  locationFlag: string; // e.g. "🇮🇳"
  name: string;         // Strava activity name
}

export interface RunStats {
  totalRuns: number;
  totalDistance: string;  // e.g. "1197.3"
  avgPace: string;       // e.g. "5'30\"/km"
}

export interface PersonalRecord {
  label: string;      // "5K", "10K", "Half", "Full"
  time: string;       // "22:48"
  pace: string;       // "4'36\"/km"
  date: string;       // "Feb 8"
  distanceKm: number; // actual distance
}

export interface MonthlyBar {
  month: string;   // "Jan 2026"
  km: number;
  count: number;
}

export interface EnrichedRunData {
  runs: RunEntry[];
  stats: RunStats;
  prs: PersonalRecord[];
  monthlyVolume: MonthlyBar[];
  locations: string[];
}

// Legacy types (kept for compatibility)
export interface MonthGroup {
  month: string;
  runs: RunEntry[];
}

export interface StravaData {
  stats: RunStats;
  months: MonthGroup[];
}

// --- Location mapping ---

const LOCATIONS = [
  { name: 'Hyderabad', flag: '🇮🇳', lat: 17.4, lng: 78.4, radius: 0.3 },
  { name: 'Busan', flag: '🇰🇷', lat: 35.2, lng: 129.2, radius: 0.3 },
  { name: 'London', flag: '🇬🇧', lat: 51.5, lng: -0.1, radius: 0.3 },
  { name: 'Lisbon', flag: '🇵🇹', lat: 38.7, lng: -9.1, radius: 0.5 },
  { name: 'Porto', flag: '🇵🇹', lat: 41.1, lng: -8.6, radius: 0.3 },
  { name: 'Chennai', flag: '🇮🇳', lat: 13.1, lng: 80.3, radius: 0.3 },
  { name: 'Seoul', flag: '🇰🇷', lat: 37.4, lng: 127.0, radius: 0.5 },
  { name: 'Jakarta', flag: '🇮🇩', lat: -6.2, lng: 106.8, radius: 0.3 },
  { name: 'Yantai', flag: '🇨🇳', lat: 37.6, lng: 121.2, radius: 0.3 },
];

function matchLocation(latlng?: [number, number] | null): { name: string; flag: string } {
  if (!latlng || latlng.length < 2) return { name: 'Unknown', flag: '📍' };
  const [lat, lng] = latlng;
  for (const loc of LOCATIONS) {
    const dLat = Math.abs(lat - loc.lat);
    const dLng = Math.abs(lng - loc.lng);
    if (dLat <= loc.radius && dLng <= loc.radius) {
      return { name: loc.name, flag: loc.flag };
    }
  }
  return { name: 'Other', flag: '📍' };
}

// --- PR detection thresholds (in meters) ---

const PR_THRESHOLDS = [
  { label: '5K', min: 4800, max: 5500 },
  { label: '10K', min: 9500, max: 11000 },
  { label: 'Half', min: 20000, max: 22000 },
  { label: 'Full', min: 40000, max: 44000 },
];

// --- Env helper ---
function env(key: string): string {
  return import.meta.env[key] || (typeof process !== 'undefined' && process.env?.[key]) || '';
}

// --- In-memory token cache ---
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() / 1000 < cachedToken.expiresAt - 60) {
    return cachedToken.token;
  }

  const clientId = env('STRAVA_CLIENT_ID');
  const clientSecret = env('STRAVA_CLIENT_SECRET');
  const refreshToken = env('STRAVA_REFRESH_TOKEN');

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Strava environment variables');
  }

  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) {
    throw new Error(`Strava token refresh failed: ${res.status}`);
  }

  const data: StravaTokenResponse = await res.json();
  cachedToken = { token: data.access_token, expiresAt: data.expires_at };
  return data.access_token;
}

// --- Helpers ---

function formatPace(metersPerSecond: number): string {
  if (metersPerSecond <= 0) return '-';
  const secsPerKm = 1000 / metersPerSecond;
  const mins = Math.floor(secsPerKm / 60);
  const secs = Math.round(secsPerKm % 60);
  return `${mins}'${secs.toString().padStart(2, '0')}"/km`;
}

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getMonthKey(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function getMonthShort(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// --- Paginated fetch (Strava max 200/page) ---

async function fetchAllActivities(token: string): Promise<StravaActivity[]> {
  const all: StravaActivity[] = [];
  let page = 1;
  const perPage = 200;

  while (true) {
    const res = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?per_page=${perPage}&page=${page}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) throw new Error(`Strava API error: ${res.status}`);

    const batch: StravaActivity[] = await res.json();
    all.push(...batch);

    if (batch.length < perPage) break;
    page++;
  }

  return all;
}

// --- Main enriched fetch ---

export async function fetchEnrichedRunData(): Promise<EnrichedRunData> {
  const token = await getAccessToken();
  const activities = await fetchAllActivities(token);

  // Filter runs only
  const runs = activities.filter(
    (a) => a.type === 'Run' || a.sport_type === 'Run',
  );

  if (runs.length === 0) {
    return {
      runs: [],
      stats: { totalRuns: 0, totalDistance: '0', avgPace: '-' },
      prs: [],
      monthlyVolume: [],
      locations: [],
    };
  }

  // Sort newest first
  runs.sort(
    (a, b) =>
      new Date(b.start_date_local).getTime() -
      new Date(a.start_date_local).getTime(),
  );

  // Build enriched entries
  const entries: RunEntry[] = runs.map((r) => {
    const loc = matchLocation(r.start_latlng);
    const km = r.distance / 1000;
    return {
      date: formatDate(r.start_date_local),
      dateFull: r.start_date_local,
      distance: `${km.toFixed(2)} km`,
      distanceKm: km,
      time: formatDuration(r.moving_time),
      timeSeconds: r.moving_time,
      pace: formatPace(r.average_speed),
      location: loc.name,
      locationFlag: loc.flag,
      name: r.name,
    };
  });

  // Overall stats
  const totalDistanceM = runs.reduce((sum, r) => sum + r.distance, 0);
  const totalTimeS = runs.reduce((sum, r) => sum + r.moving_time, 0);
  const avgSpeedMps = totalDistanceM / totalTimeS;

  const stats: RunStats = {
    totalRuns: runs.length,
    totalDistance: (totalDistanceM / 1000).toFixed(1),
    avgPace: formatPace(avgSpeedMps),
  };

  // Personal Records — best time for each distance category
  const prs: PersonalRecord[] = [];
  for (const threshold of PR_THRESHOLDS) {
    const matching = runs.filter(
      (r) => r.distance >= threshold.min && r.distance <= threshold.max,
    );
    if (matching.length === 0) continue;

    // Best = fastest time
    const best = matching.reduce((a, b) =>
      a.moving_time < b.moving_time ? a : b,
    );

    prs.push({
      label: threshold.label,
      time: formatDuration(best.moving_time),
      pace: formatPace(best.average_speed),
      date: formatDate(best.start_date_local),
      distanceKm: best.distance / 1000,
    });
  }

  // Monthly volume — aggregate km and count per month
  const volMap = new Map<string, { km: number; count: number }>();
  for (const r of runs) {
    const key = getMonthShort(r.start_date_local);
    const existing = volMap.get(key) || { km: 0, count: 0 };
    existing.km += r.distance / 1000;
    existing.count += 1;
    volMap.set(key, existing);
  }

  // Sort chronologically (oldest first for chart)
  const monthlyVolume: MonthlyBar[] = Array.from(volMap.entries())
    .map(([month, v]) => ({ month, km: Math.round(v.km * 10) / 10, count: v.count }))
    .reverse();

  // Unique locations (excluding 'Unknown')
  const locationSet = new Set<string>();
  for (const e of entries) {
    if (e.location !== 'Unknown') locationSet.add(e.location);
  }
  const locations = Array.from(locationSet).sort();

  return { runs: entries, stats, prs, monthlyVolume, locations };
}

// --- Legacy export (kept for backward compatibility) ---

export async function fetchRunActivities(): Promise<StravaData> {
  const enriched = await fetchEnrichedRunData();
  const monthMap = new Map<string, RunEntry[]>();
  for (const r of enriched.runs) {
    const key = getMonthKey(r.dateFull);
    if (!monthMap.has(key)) monthMap.set(key, []);
    monthMap.get(key)!.push(r);
  }
  const months: MonthGroup[] = Array.from(monthMap.entries()).map(
    ([month, entries]) => ({ month, runs: entries }),
  );
  return { stats: enriched.stats, months };
}
