import type { APIRoute } from 'astro';
import { fetchEnrichedRunData } from '../../lib/strava';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const data = await fetchEnrichedRunData();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // 5min cache
      },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? 'Strava fetch failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
