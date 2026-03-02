import type { APIRoute } from 'astro';
import { getDB, generateId, verifyPassword } from '../../../lib/d1';

export const prerender = false;

// GET: list books or get detail
export const GET: APIRoute = async ({ url, locals }) => {
  const db = getDB(locals);
  const id = url.searchParams.get('id');
  const bookId = url.searchParams.get('book_id');

  // Get book detail
  if (id) {
    const book = await db.prepare(
      'SELECT * FROM book_notes WHERE id = ?'
    ).bind(id).first();
    if (!book) return new Response(JSON.stringify(null), { headers: { 'Content-Type': 'application/json' } });
    // Parse JSON fields
    const parsed = {
      ...book,
      sq3r: JSON.parse((book as any).sq3r || '{}'),
      permanent_notes: JSON.parse((book as any).permanent_notes || '[]'),
    };
    return new Response(JSON.stringify(parsed), { headers: { 'Content-Type': 'application/json' } });
  }

  // Get book comments
  if (bookId) {
    const { results } = await db.prepare(
      'SELECT id, author, content, created_at FROM book_comments WHERE book_id = ? ORDER BY created_at ASC'
    ).bind(bookId).all();
    return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
  }

  // List all books (without sq3r for performance)
  const { results } = await db.prepare(
    'SELECT id, title, author, year, reading_period, cover_color, cover_emoji, status, rating, quote, sort_order, created_at FROM book_notes ORDER BY sort_order ASC, created_at DESC'
  ).all();
  return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
};

// POST: various book actions
export const POST: APIRoute = async ({ request, locals }) => {
  const db = getDB(locals);
  const body = await request.json();
  const { action } = body;

  // Verify admin
  if (action === 'verify_admin') {
    const { password } = body;
    const admin = await db.prepare("SELECT value FROM admin_config WHERE key = 'book_admin_password_hash'").first<{ value: string }>();
    if (!admin) return new Response(JSON.stringify(false), { headers: { 'Content-Type': 'application/json' } });
    const valid = await verifyPassword(password, admin.value);
    return new Response(JSON.stringify(valid), { headers: { 'Content-Type': 'application/json' } });
  }

  // Create book
  if (action === 'create') {
    const { password, ...bookData } = body;
    const admin = await db.prepare("SELECT value FROM admin_config WHERE key = 'book_admin_password_hash'").first<{ value: string }>();
    if (!admin || !(await verifyPassword(password, admin.value))) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });
    }
    const id = generateId();
    await db.prepare(
      `INSERT INTO book_notes (id, title, author, year, reading_period, cover_color, cover_emoji, status, rating, quote, sq3r, permanent_notes, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      bookData.title,
      bookData.author,
      bookData.year || null,
      bookData.reading_period || null,
      bookData.cover_color || '#818cf8',
      bookData.cover_emoji || '📖',
      bookData.status || 'planned',
      bookData.rating || null,
      bookData.quote || null,
      JSON.stringify(bookData.sq3r || {}),
      JSON.stringify(bookData.permanent_notes || []),
      bookData.sort_order || 0,
    ).run();
    return new Response(JSON.stringify({ id }), { headers: { 'Content-Type': 'application/json' } });
  }

  // Update book
  if (action === 'update') {
    const { password, id, ...bookData } = body;
    const admin = await db.prepare("SELECT value FROM admin_config WHERE key = 'book_admin_password_hash'").first<{ value: string }>();
    if (!admin || !(await verifyPassword(password, admin.value))) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });
    }
    await db.prepare(
      `UPDATE book_notes SET
        title = COALESCE(?, title),
        author = COALESCE(?, author),
        year = COALESCE(?, year),
        reading_period = COALESCE(?, reading_period),
        cover_color = COALESCE(?, cover_color),
        cover_emoji = COALESCE(?, cover_emoji),
        status = COALESCE(?, status),
        rating = COALESCE(?, rating),
        quote = COALESCE(?, quote),
        sq3r = COALESCE(?, sq3r),
        permanent_notes = COALESCE(?, permanent_notes),
        sort_order = COALESCE(?, sort_order),
        updated_at = datetime('now')
      WHERE id = ?`
    ).bind(
      bookData.title || null,
      bookData.author || null,
      bookData.year || null,
      bookData.reading_period || null,
      bookData.cover_color || null,
      bookData.cover_emoji || null,
      bookData.status || null,
      bookData.rating || null,
      bookData.quote || null,
      bookData.sq3r ? JSON.stringify(bookData.sq3r) : null,
      bookData.permanent_notes ? JSON.stringify(bookData.permanent_notes) : null,
      bookData.sort_order ?? null,
      id,
    ).run();
    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
  }

  // Add comment (public)
  if (action === 'add_comment') {
    const { book_id, author, content } = body;
    const book = await db.prepare('SELECT id FROM book_notes WHERE id = ?').bind(book_id).first();
    if (!book) return new Response(JSON.stringify({ error: 'Book not found' }), { status: 404 });

    const id = generateId();
    await db.prepare(
      'INSERT INTO book_comments (id, book_id, author, content) VALUES (?, ?, ?, ?)'
    ).bind(id, book_id, author, content).run();
    return new Response(JSON.stringify({ id }), { headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });
};
