import type { APIRoute } from 'astro';
import { fetchEnrichedRunData } from '../../lib/strava';
import { computeIntelligence } from '../../lib/strava-analytics';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const enriched = await fetchEnrichedRunData();
    const intelligence = computeIntelligence(
      enriched.runs,
      parseFloat(enriched.stats.totalDistance),
    );
    return new Response(JSON.stringify(intelligence), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? 'Intelligence fetch failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
