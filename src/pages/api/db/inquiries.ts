import type { APIRoute } from 'astro';
import { getDB, generateId, hashPassword, verifyPassword } from '../../../lib/d1';

export const prerender = false;

// GET: list inquiries (public metadata only)
export const GET: APIRoute = async ({ locals }) => {
  const db = getDB(locals);
  const { results } = await db.prepare(
    'SELECT id, title, name, created_at FROM inquiries ORDER BY created_at DESC'
  ).all();
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  });
};

// POST: various inquiry actions
export const POST: APIRoute = async ({ request, locals }) => {
  const db = getDB(locals);
  const body = await request.json();
  const { action } = body;

  // Create new inquiry
  if (action === 'create') {
    const { title, name, email, phone, content, password } = body;
    const id = generateId();
    const hash = await hashPassword(password);
    await db.prepare(
      'INSERT INTO inquiries (id, title, name, email, phone, content, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, title, name, email || null, phone || null, content, hash).run();
    return new Response(JSON.stringify({ id }), { headers: { 'Content-Type': 'application/json' } });
  }

  // Verify password and get detail
  if (action === 'verify') {
    const { id, password } = body;
    const inquiry = await db.prepare(
      'SELECT id, title, name, email, phone, content, password_hash, created_at FROM inquiries WHERE id = ?'
    ).bind(id).first();
    if (!inquiry) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    }
    // Check post password or admin password
    const isPostPassword = await verifyPassword(password, (inquiry as any).password_hash);
    const admin = await db.prepare("SELECT value FROM admin_config WHERE key = 'admin_password_hash'").first<{ value: string }>();
    const isAdmin = admin ? await verifyPassword(password, admin.value) : false;

    if (!isPostPassword && !isAdmin) {
      return new Response(JSON.stringify({ error: 'Wrong password' }), { status: 403 });
    }
    const { password_hash, ...safe } = inquiry as any;
    return new Response(JSON.stringify(safe), { headers: { 'Content-Type': 'application/json' } });
  }

  // Get comments
  if (action === 'get_comments') {
    const { inquiry_id, password } = body;
    // Verify access
    const inquiry = await db.prepare('SELECT password_hash FROM inquiries WHERE id = ?').bind(inquiry_id).first<{ password_hash: string }>();
    if (!inquiry) return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });

    const isPostPassword = await verifyPassword(password, inquiry.password_hash);
    const admin = await db.prepare("SELECT value FROM admin_config WHERE key = 'admin_password_hash'").first<{ value: string }>();
    const isAdmin = admin ? await verifyPassword(password, admin.value) : false;
    if (!isPostPassword && !isAdmin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });
    }

    const { results } = await db.prepare(
      'SELECT id, author, content, is_admin, created_at FROM inquiry_comments WHERE inquiry_id = ? ORDER BY created_at ASC'
    ).bind(inquiry_id).all();
    return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
  }

  // Add comment
  if (action === 'add_comment') {
    const { inquiry_id, password, author, content } = body;
    const inquiry = await db.prepare('SELECT password_hash FROM inquiries WHERE id = ?').bind(inquiry_id).first<{ password_hash: string }>();
    if (!inquiry) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

    const isPostPassword = await verifyPassword(password, inquiry.password_hash);
    const admin = await db.prepare("SELECT value FROM admin_config WHERE key = 'admin_password_hash'").first<{ value: string }>();
    const isAdmin = admin ? await verifyPassword(password, admin.value) : false;
    if (!isPostPassword && !isAdmin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });
    }

    const id = generateId();
    await db.prepare(
      'INSERT INTO inquiry_comments (id, inquiry_id, author, content, is_admin) VALUES (?, ?, ?, ?, ?)'
    ).bind(id, inquiry_id, author, content, isAdmin ? 1 : 0).run();
    return new Response(JSON.stringify({ id }), { headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });
};
