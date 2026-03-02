import type { APIRoute } from 'astro';
import { getSystemPrompt, getFocusedPrompt, getSectionByTag } from '../../lib/memory';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const apiKey = import.meta.env.FIREWORKS_API_KEY || (locals as any)?.runtime?.env?.FIREWORKS_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let messages: { role: string; content: string }[];
  let route: string = '';
  try {
    ({ messages, route = '' } = await request.json());
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Client sends an ASCII route tag; server selects the matching memory section.
  // This avoids server-side Korean text processing which has encoding issues on Vercel.
  const section = route ? getSectionByTag(route) : '';
  const systemContent = section ? getFocusedPrompt(section) : getSystemPrompt();

  const upstream = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'accounts/fireworks/models/kimi-k2-instruct-0905',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemContent },
        ...messages,
      ],
    }),
  });

  if (!upstream.ok) {
    const errText = await upstream.text();
    console.error('Fireworks error:', upstream.status, errText);
    return new Response(JSON.stringify({ error: 'Upstream failed', detail: errText }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await upstream.json();
  const text = data.choices?.[0]?.message?.content ?? '';

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
};
