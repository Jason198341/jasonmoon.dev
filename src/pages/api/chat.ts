import type { APIRoute } from 'astro';
import { getSystemPrompt } from '../../lib/memory';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let messages: { role: string; content: string }[];
  try {
    ({ messages } = await request.json());
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: getSystemPrompt(),
      messages,
    }),
  });

  if (!upstream.ok) {
    const errText = await upstream.text();
    console.error('Anthropic error:', upstream.status, errText);
    return new Response(JSON.stringify({ error: 'Upstream failed', detail: errText }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await upstream.json();
  const text = data.content?.[0]?.text ?? '';

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
