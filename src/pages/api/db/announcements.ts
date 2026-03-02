import type { APIRoute } from 'astro';
import { getDB, generateId, verifyPassword } from '../../../lib/d1';

export const prerender = false;

// GET: list announcements
export const GET: APIRoute = async ({ locals }) => {
  const db = getDB(locals);
  const { results } = await db.prepare(
    'SELECT id, title, content, category, created_at FROM announcements ORDER BY created_at DESC'
  ).all();
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  });
};

// POST: create or delete announcement
export const POST: APIRoute = async ({ request, locals }) => {
  const db = getDB(locals);
  const body = await request.json();
  const { action } = body;

  if (action === 'create') {
    const { password, title, content, category } = body;
    const admin = await db.prepare("SELECT value FROM admin_config WHERE key = 'admin_password_hash'").first<{ value: string }>();
    if (!admin || !(await verifyPassword(password, admin.value))) {
      return new Response(JSON.stringify({ error: 'Invalid admin password' }), { status: 403 });
    }
    const id = generateId();
    await db.prepare(
      'INSERT INTO announcements (id, title, content, category) VALUES (?, ?, ?, ?)'
    ).bind(id, title, content, category || 'insight').run();
    return new Response(JSON.stringify({ id }), { headers: { 'Content-Type': 'application/json' } });
  }

  if (action === 'delete') {
    const { password, id } = body;
    const admin = await db.prepare("SELECT value FROM admin_config WHERE key = 'admin_password_hash'").first<{ value: string }>();
    if (!admin || !(await verifyPassword(password, admin.value))) {
      return new Response(JSON.stringify({ error: 'Invalid admin password' }), { status: 403 });
    }
    await db.prepare('DELETE FROM announcements WHERE id = ?').bind(id).run();
    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });
};
