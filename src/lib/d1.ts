// D1 database utility for Cloudflare Workers
// Replaces Supabase client

export function getDB(locals: App.Locals): D1Database {
  return (locals as any).runtime.env.DB;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const computed = await hashPassword(password);
  return computed === hash;
}
