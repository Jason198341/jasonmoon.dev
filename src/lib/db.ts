/**
 * 수학 바이블 — Supabase 데이터 계층 (브라우저 전용)
 *
 * 읽기: anon 키로 공개 SELECT
 * 쓰기: 전부 SECURITY DEFINER RPC + 패스코드 (RLS로 직접 쓰기 차단됨)
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const sb: SupabaseClient = createClient(url, key, {
  auth: { persistSession: false },
});

export const BUCKET = 'math-bible';

/* ---------------- 패스코드 ---------------- */
const PASS_KEY = 'mathbible.pass';

export const getPass = (): string | null => {
  try { return localStorage.getItem(PASS_KEY); } catch { return null; }
};
export const setPass = (p: string) => {
  try { localStorage.setItem(PASS_KEY, p); } catch { /* private mode */ }
};
export const clearPass = () => {
  try { localStorage.removeItem(PASS_KEY); } catch { /* noop */ }
};

export async function checkPass(p: string): Promise<boolean> {
  const { data, error } = await sb.rpc('math_check', { p_pass: p });
  if (error) throw error;
  return data === true;
}

/** 저장된 패스코드가 유효한지 */
export async function isUnlocked(): Promise<boolean> {
  const p = getPass();
  if (!p) return false;
  try { return await checkPass(p); } catch { return false; }
}

function requirePass(): string {
  const p = getPass();
  if (!p) throw new Error('먼저 잠금을 해제하세요');
  return p;
}

async function rpc<T = unknown>(fn: string, args: Record<string, unknown>): Promise<T> {
  const { data, error } = await sb.rpc(fn, { p_pass: requirePass(), ...args });
  if (error) throw error;
  return data as T;
}

/* ---------------- 타입 ---------------- */
export type Status = 'todo' | 'doing' | 'done';
export type PostCategory = 'thought' | 'feedback' | 'question' | 'notice';
export type FileCategory = 'homework' | 'material' | 'photo' | 'worksheet';

export interface Progress {
  concept_id: string; status: Status; mastery: number;
  last_reviewed: string | null; updated_at: string;
}
export interface Record_ {
  id: string; concept_id: string; session_date: string; who: string;
  blank_before: string | null; blank_after: string | null;
  self_score: number | null; note: string | null; images: string[]; created_at: string;
}
export interface Journal {
  id: string; entry_date: string; title: string; body: string;
  mood: string | null; concept_ids: string[]; created_at: string;
}
export interface Post {
  id: string; category: PostCategory; title: string; body: string;
  author: string; concept_id: string | null; pinned: boolean; created_at: string;
}
export interface Comment {
  id: string; post_id: string; author: string; body: string; created_at: string;
}
export interface Note {
  id: string; concept_id: string | null; lv: string | null; title: string;
  body: string; tags: string[]; created_at: string; updated_at: string;
}
export interface FileRow {
  id: string; title: string; category: FileCategory; storage_path: string;
  mime: string | null; size_bytes: number | null; concept_id: string | null;
  uploaded_by: string; note: string | null; created_at: string;
}
export interface Stats {
  done: number; doing: number; records: number; journals: number;
  posts: number; notes: number; files: number;
  prep_ready: number; prep_draft: number; prep_taught: number; trash: number;
  last_date: string | null;
}

/* ---------------- 아빠 예습 ---------------- */
export type PrepStatus = 'todo' | 'drafting' | 'ready' | 'taught';

/** 제1원칙 자기점검 7항목 — deepexplain 프로토콜 */
export const CHECK_ITEMS = [
  { key: 'axiom',    label: '출발점(공리)을 명시했는가' },
  { key: 'undef',    label: '정의 없이 쓴 용어가 없는가' },
  { key: 'leap',     label: '"따라서/당연히"로 건너뛴 단계가 없는가' },
  { key: 'naming',   label: '이름 붙이기로 설명을 대신하지 않았는가' },
  { key: 'analogy',  label: '비유의 깨지는 지점을 말했는가' },
  { key: 'boundary', label: '이 설명이 틀릴 조건을 말했는가' },
  { key: 'rederive', label: '아이가 나 없이 재도출할 수 있는가' },
] as const;

export type CheckKey = typeof CHECK_ITEMS[number]['key'];

export interface Prep {
  concept_id: string;
  status: PrepStatus;
  axioms: string | null;
  atoms: string | null;
  chain: string | null;
  mechanism: string | null;
  boundary: string | null;
  analogy: string | null;
  script: string | null;
  questions: string | null;
  props: string | null;
  ai_notes: string | null;
  est_minutes: number | null;
  checklist: Partial<Record<CheckKey, boolean>>;
  taught_at: string | null;
  updated_at: string;
}

export const PREP_LABEL: Record<PrepStatus, string> = {
  todo: '예습 전',
  drafting: '대본 작성 중',
  ready: '준비 완료',
  taught: '가르침',
};

/* ---------------- 읽기 ---------------- */
async function sel<T>(table: string, build: (q: any) => any): Promise<T[]> {
  const { data, error } = await build(sb.from(table).select('*'));
  if (error) throw error;
  return (data ?? []) as T[];
}

export const getStats = async (): Promise<Stats> => {
  const { data, error } = await sb.rpc('math_stats');
  if (error) throw error;
  return data as Stats;
};

export const listProgress = () =>
  sel<Progress>('math_progress', (q) => q);

export const listRecords = (conceptId?: string) =>
  sel<Record_>('math_records', (q) =>
    (conceptId ? q.eq('concept_id', conceptId) : q).is('deleted_at', null)
      .order('session_date', { ascending: false })
      .order('created_at', { ascending: false }));

export const listJournal = (limit = 100) =>
  sel<Journal>('math_journal', (q) =>
    q.is('deleted_at', null).order('entry_date', { ascending: false })
     .order('created_at', { ascending: false }).limit(limit));

export const listPosts = (category?: PostCategory) =>
  sel<Post>('math_posts', (q) =>
    (category ? q.eq('category', category) : q).is('deleted_at', null)
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false }));

export const listComments = (postId: string) =>
  sel<Comment>('math_comments', (q) =>
    q.eq('post_id', postId).order('created_at', { ascending: true }));

export const listNotes = (conceptId?: string) =>
  sel<Note>('math_notes', (q) =>
    (conceptId ? q.eq('concept_id', conceptId) : q).is('deleted_at', null)
      .order('updated_at', { ascending: false }));

export const listFiles = (category?: FileCategory) =>
  sel<FileRow>('math_files', (q) =>
    (category ? q.eq('category', category) : q).is('deleted_at', null)
      .order('created_at', { ascending: false }));

export const listPrep = () =>
  sel<Prep>('math_prep', (q) => q.order('updated_at', { ascending: false }));

export async function getPrep(conceptId: string): Promise<Prep | null> {
  const { data, error } = await sb.from('math_prep').select('*')
    .eq('concept_id', conceptId).maybeSingle();
  if (error) throw error;
  return (data as Prep) ?? null;
}

export const savePrep = (p: Partial<Prep> & { concept_id: string; status: PrepStatus }) =>
  rpc<void>('math_prep_save', {
    p_concept_id: p.concept_id,
    p_status: p.status,
    p_axioms: p.axioms ?? null,
    p_atoms: p.atoms ?? null,
    p_chain: p.chain ?? null,
    p_mechanism: p.mechanism ?? null,
    p_boundary: p.boundary ?? null,
    p_analogy: p.analogy ?? null,
    p_script: p.script ?? null,
    p_questions: p.questions ?? null,
    p_props: p.props ?? null,
    p_ai_notes: p.ai_notes ?? null,
    p_est_minutes: p.est_minutes ?? null,
    p_checklist: p.checklist ?? {},
  });

/* ---------------- 쓰기 ---------------- */
export const setProgress = (concept_id: string, status: Status, mastery: number) =>
  rpc<void>('math_progress_set', { p_concept_id: concept_id, p_status: status, p_mastery: mastery });

export const addRecord = (r: {
  concept_id: string; session_date?: string | null; who?: string;
  blank_before?: string; blank_after?: string; self_score?: number | null;
  note?: string; images?: string[];
}) => rpc<string>('math_record_add', {
  p_concept_id: r.concept_id, p_session_date: r.session_date ?? null,
  p_who: r.who ?? '세연', p_blank_before: r.blank_before ?? null,
  p_blank_after: r.blank_after ?? null, p_self_score: r.self_score ?? null,
  p_note: r.note ?? null, p_images: r.images ?? [],
});

export const deleteRecord = (id: string) => rpc<void>('math_record_delete', { p_id: id });

export const addJournal = (j: {
  entry_date?: string | null; title: string; body: string;
  mood?: string | null; concept_ids?: string[];
}) => rpc<string>('math_journal_add', {
  p_entry_date: j.entry_date ?? null, p_title: j.title, p_body: j.body,
  p_mood: j.mood ?? null, p_concept_ids: j.concept_ids ?? [],
});

export const deleteJournal = (id: string) => rpc<void>('math_journal_delete', { p_id: id });

export const addPost = (p: {
  category: PostCategory; title: string; body: string;
  author?: string; concept_id?: string | null;
}) => rpc<string>('math_post_add', {
  p_category: p.category, p_title: p.title, p_body: p.body,
  p_author: p.author ?? '아빠', p_concept_id: p.concept_id ?? null,
});

export const deletePost = (id: string) => rpc<void>('math_post_delete', { p_id: id });

export const addComment = (post_id: string, author: string, body: string) =>
  rpc<string>('math_comment_add', { p_post_id: post_id, p_author: author, p_body: body });

export const saveNote = (n: {
  id?: string | null; concept_id?: string | null; lv?: string | null;
  title: string; body: string; tags?: string[];
}) => rpc<string>('math_note_save', {
  p_id: n.id ?? null, p_concept_id: n.concept_id ?? null, p_lv: n.lv ?? null,
  p_title: n.title, p_body: n.body, p_tags: n.tags ?? [],
});

export const deleteNote = (id: string) => rpc<void>('math_note_delete', { p_id: id });

export const deleteFile = (id: string) => rpc<void>('math_file_delete', { p_id: id });

/* ---------------- 휴지통 (삭제는 전부 되돌릴 수 있다) ---------------- */
export const TRASH_TABLES = ['math_journal','math_posts','math_notes','math_records','math_files'] as const;
export type TrashTable = typeof TRASH_TABLES[number];

export const TRASH_LABEL: Record<TrashTable, string> = {
  math_journal: '일지', math_posts: '게시글', math_notes: '강의노트',
  math_records: '백지 기록', math_files: '파일',
};

export async function listTrash(t: TrashTable): Promise<any[]> {
  const { data, error } = await sb.from(t).select('*')
    .not('deleted_at', 'is', null).order('deleted_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export const restore = (table: TrashTable, id: string) =>
  rpc<void>('math_restore', { p_table: table, p_id: id });

/* ---------------- 파일 ---------------- */
export function publicUrl(path: string): string {
  return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** 파일 업로드 → 스토리지 + math_files 등록 */
export async function uploadFile(
  file: File,
  meta: { title?: string; category: FileCategory; concept_id?: string | null; uploaded_by?: string; note?: string },
): Promise<FileRow> {
  requirePass();
  const safe = file.name.replace(/[^\w.\-가-힣]/g, '_');
  const path = `${meta.category}/${Date.now()}_${safe}`;

  const up = await sb.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  });
  if (up.error) throw up.error;

  await rpc<string>('math_file_add', {
    p_title: meta.title || file.name,
    p_category: meta.category,
    p_storage_path: path,
    p_mime: file.type || null,
    p_size: file.size,
    p_concept_id: meta.concept_id ?? null,
    p_uploaded_by: meta.uploaded_by ?? '아빠',
    p_note: meta.note ?? null,
  });

  const rows = await listFiles(meta.category);
  return rows[0];
}

/* ---------------- 유틸 ---------------- */
export const fmtDate = (s: string | null | undefined): string => {
  if (!s) return '—';
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return String(s);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export const fmtSize = (n: number | null | undefined): string => {
  if (!n) return '—';
  const u = ['B', 'KB', 'MB', 'GB'];
  let i = 0, v = n;
  while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(i === 0 ? 0 : 1)}${u[i]}`;
};

export function toast(msg: string) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('on');
  window.setTimeout(() => el && el.classList.remove('on'), 2200);
}

export const esc = (s: unknown): string =>
  String(s ?? '').replace(/[&<>"']/g, (m) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]!));
