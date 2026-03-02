import { useState, useEffect } from 'react';

// ── Types ──────────────────────────────────────

interface BookListItem {
  id: string;
  title: string;
  author: string;
  year: number | null;
  reading_period: string | null;
  cover_color: string;
  cover_emoji: string;
  status: 'reading' | 'completed' | 'planned';
  rating: number | null;
  quote: string | null;
  sort_order: number;
  created_at: string;
}

interface SQ3R {
  survey?: { text: string };
  question?: { items: string[] };
  read?: { sessions: ReadingSession[] };
  recite?: { items: string[] };
  review?: { text: string };
}

interface ReadingSession {
  round: number;
  date: string;
  sentence: string;
  change: string;
  note: string;
}

interface BookDetail extends BookListItem {
  sq3r: SQ3R;
  permanent_notes: string[];
  updated_at: string;
}

interface BookComment {
  id: string;
  author: string;
  content: string;
  created_at: string;
}

type View = 'library' | 'detail' | 'create' | 'edit';

const STATUS_CONFIG = {
  reading: { text: 'Reading', class: 'text-emerald-400 bg-emerald-400/10' },
  completed: { text: 'Completed', class: 'text-accent bg-accent-dim' },
  planned: { text: 'Planned', class: 'text-text-muted bg-surface-hover' },
} as const;

const SQ3R_LABELS = {
  survey: { label: 'Survey', icon: '🔭', color: 'border-cyan-400/50', bg: 'bg-cyan-400/5', text: 'text-cyan-400' },
  question: { label: 'Question', icon: '❓', color: 'border-amber-400/50', bg: 'bg-amber-400/5', text: 'text-amber-400' },
  read: { label: 'Read', icon: '📖', color: 'border-accent/50', bg: 'bg-accent/5', text: 'text-accent' },
  recite: { label: 'Recite', icon: '🗣️', color: 'border-emerald-400/50', bg: 'bg-emerald-400/5', text: 'text-emerald-400' },
  review: { label: 'Review', icon: '🔄', color: 'border-warm/50', bg: 'bg-warm/5', text: 'text-warm' },
} as const;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ── Stars Component ────────────────────────────

function Stars({ rating, interactive, onChange }: {
  rating: number;
  interactive?: boolean;
  onChange?: (r: number) => void;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(i)}
          className={`text-sm ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
        >
          <span className={i <= rating ? 'text-warm' : 'text-border'}>★</span>
        </button>
      ))}
    </div>
  );
}

// ── Back Button ────────────────────────────────

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="text-sm text-text-muted hover:text-text mb-6 flex items-center gap-1 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </button>
  );
}

// ── Spinner ────────────────────────────────────

function Spinner() {
  return (
    <div className="text-center py-12">
      <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <p className="text-sm text-text-muted">Loading...</p>
    </div>
  );
}

// ── Main Component ─────────────────────────────

export default function BookLibrary() {
  const [view, setView] = useState<View>('library');
  const [books, setBooks] = useState<BookListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'reading' | 'completed' | 'planned'>('all');
  const [search, setSearch] = useState('');

  // Admin
  const [adminVerified, setAdminVerified] = useState(false);
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState(false);

  // Detail
  const [detail, setDetail] = useState<BookDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [comments, setComments] = useState<BookComment[]>([]);

  // Comment form
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // Create/Edit form
  const [form, setForm] = useState(emptyForm());

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    setLoading(true);
    try {
      const res = await fetch('/api/db/books');
      const data = await res.json();
      if (Array.isArray(data)) setBooks(data);
    } catch {}
    setLoading(false);
  }

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/db/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify_admin', password: adminPassword }),
    });
    const data = await res.json();
    if (data === true) {
      setAdminVerified(true);
      setShowAdminInput(false);
      setAdminError(false);
    } else {
      setAdminError(true);
    }
  }

  async function openDetail(id: string) {
    setDetailLoading(true);
    setView('detail');
    const [bookRes, commentRes] = await Promise.all([
      fetch(`/api/db/books?id=${id}`),
      fetch(`/api/db/books?book_id=${id}`),
    ]);
    const bookData = await bookRes.json();
    const commentData = await commentRes.json();
    if (bookData) setDetail(bookData);
    if (Array.isArray(commentData)) setComments(commentData);
    setDetailLoading(false);
  }

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot || !detail || !commentAuthor.trim() || !commentContent.trim()) return;

    setCommentSubmitting(true);
    const res = await fetch('/api/db/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_comment',
        book_id: detail.id,
        author: commentAuthor.trim(),
        content: commentContent.trim(),
      }),
    });
    if (res.ok) {
      const freshRes = await fetch(`/api/db/books?book_id=${detail.id}`);
      const fresh = await freshRes.json();
      if (Array.isArray(fresh)) setComments(fresh);
      setCommentContent('');
    }
    setCommentSubmitting(false);
  }

  function openCreate() {
    setForm(emptyForm());
    setView('create');
  }

  function openEdit() {
    if (!detail) return;
    setForm({
      title: detail.title,
      author: detail.author,
      year: detail.year?.toString() ?? '',
      reading_period: detail.reading_period ?? '',
      cover_color: detail.cover_color,
      cover_emoji: detail.cover_emoji,
      status: detail.status,
      rating: detail.rating ?? 0,
      quote: detail.quote ?? '',
      survey: detail.sq3r.survey?.text ?? '',
      questions: detail.sq3r.question?.items ?? [''],
      sessions: detail.sq3r.read?.sessions ?? [],
      reciteItems: detail.sq3r.recite?.items ?? [''],
      review: detail.sq3r.review?.text ?? '',
      permanentNotes: detail.permanent_notes.length ? detail.permanent_notes : [''],
      sort_order: detail.sort_order.toString(),
    });
    setView('edit');
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) return;

    const sq3r: SQ3R = {};
    if (form.survey.trim()) sq3r.survey = { text: form.survey.trim() };
    const qItems = form.questions.filter((q) => q.trim());
    if (qItems.length) sq3r.question = { items: qItems };
    if (form.sessions.length) sq3r.read = { sessions: form.sessions };
    const rItems = form.reciteItems.filter((r) => r.trim());
    if (rItems.length) sq3r.recite = { items: rItems };
    if (form.review.trim()) sq3r.review = { text: form.review.trim() };

    const permanentNotes = form.permanentNotes.filter((n) => n.trim());

    const params = {
      p_password: adminPassword,
      p_title: form.title.trim(),
      p_author: form.author.trim(),
      p_year: form.year ? parseInt(form.year) : null,
      p_reading_period: form.reading_period.trim() || null,
      p_cover_color: form.cover_color,
      p_cover_emoji: form.cover_emoji,
      p_status: form.status,
      p_rating: form.rating || null,
      p_quote: form.quote.trim() || null,
      p_sq3r: sq3r,
      p_permanent_notes: permanentNotes,
      p_sort_order: parseInt(form.sort_order) || 0,
    };

    if (view === 'create') {
      const res = await fetch('/api/db/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          password: adminPassword,
          title: params.p_title,
          author: params.p_author,
          year: params.p_year,
          reading_period: params.p_reading_period,
          cover_color: params.p_cover_color,
          cover_emoji: params.p_cover_emoji,
          status: params.p_status,
          rating: params.p_rating,
          quote: params.p_quote,
          sq3r: params.p_sq3r,
          permanent_notes: params.p_permanent_notes,
          sort_order: params.p_sort_order,
        }),
      });
      const data = await res.json();
      if (data?.id) {
        await loadBooks();
        openDetail(data.id);
      }
    } else if (view === 'edit' && detail) {
      const res = await fetch('/api/db/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          password: adminPassword,
          id: detail.id,
          title: params.p_title,
          author: params.p_author,
          year: params.p_year,
          reading_period: params.p_reading_period,
          cover_color: params.p_cover_color,
          cover_emoji: params.p_cover_emoji,
          status: params.p_status,
          rating: params.p_rating,
          quote: params.p_quote,
          sq3r: params.p_sq3r,
          permanent_notes: params.p_permanent_notes,
          sort_order: params.p_sort_order,
        }),
      });
      if (res.ok) {
        await loadBooks();
        openDetail(detail.id);
      }
    }
  }

  // Filtered books
  const filtered = books.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
    }
    return true;
  });

  // ──────────────────── Detail View ────────────────────
  if (view === 'detail') {
    if (detailLoading || !detail) return <Spinner />;

    return (
      <div>
        <BackButton onClick={() => { setView('library'); setDetail(null); }} label="Back to library" />

        {/* Header */}
        <div className="rounded-xl border border-border bg-surface p-6 mb-6">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ backgroundColor: detail.cover_color + '20', borderLeft: `3px solid ${detail.cover_color}` }}
            >
              {detail.cover_emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">{detail.title}</h2>
                  <p className="text-sm text-text-muted mt-0.5">
                    {detail.author}
                    {detail.year && <span> · {detail.year}</span>}
                    {detail.reading_period && <span> · {detail.reading_period}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2.5 py-1 rounded text-xs font-medium ${STATUS_CONFIG[detail.status].class}`}>
                    {STATUS_CONFIG[detail.status].text}
                  </span>
                  {adminVerified && (
                    <button
                      onClick={openEdit}
                      className="px-3 py-1 rounded text-xs font-medium border border-border text-text-muted hover:text-text hover:border-accent transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
              {detail.rating && (
                <div className="mt-2">
                  <Stars rating={detail.rating} />
                </div>
              )}
            </div>
          </div>

          {detail.quote && (
            <blockquote className="text-sm text-text-muted italic border-l-2 border-accent pl-3 mt-4">
              {detail.quote}
            </blockquote>
          )}
        </div>

        {/* SQ3R Sections */}
        <div className="space-y-4 mb-6">
          {/* Survey */}
          {detail.sq3r.survey?.text && (
            <SQ3RSection type="survey">
              <p className="text-sm text-text-muted leading-relaxed">{detail.sq3r.survey.text}</p>
            </SQ3RSection>
          )}

          {/* Question */}
          {detail.sq3r.question?.items?.length ? (
            <SQ3RSection type="question">
              <ul className="space-y-2">
                {detail.sq3r.question.items.map((q, i) => (
                  <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                    <span className="text-amber-400 shrink-0 mt-0.5">•</span>
                    {q}
                  </li>
                ))}
              </ul>
            </SQ3RSection>
          ) : null}

          {/* Read (sessions) */}
          {detail.sq3r.read?.sessions?.length ? (
            <SQ3RSection type="read">
              <div className="space-y-5">
                {detail.sq3r.read.sessions.map((s) => (
                  <div key={s.round} className="pl-4 border-l-2 border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent text-white text-xs font-bold">
                        {s.round}
                      </span>
                      <span className="text-xs font-mono text-accent">{s.date}</span>
                    </div>
                    <div className="rounded-lg bg-bg p-3 mb-2">
                      <p className="text-sm font-medium text-text mb-1">"{s.sentence}"</p>
                      <p className="text-xs text-accent">{s.change}</p>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">{s.note}</p>
                  </div>
                ))}
              </div>
            </SQ3RSection>
          ) : null}

          {/* Recite */}
          {detail.sq3r.recite?.items?.length ? (
            <SQ3RSection type="recite">
              <ul className="space-y-2">
                {detail.sq3r.recite.items.map((r, i) => (
                  <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                    <span className="text-emerald-400 shrink-0 mt-0.5">•</span>
                    {r}
                  </li>
                ))}
              </ul>
            </SQ3RSection>
          ) : null}

          {/* Review */}
          {detail.sq3r.review?.text && (
            <SQ3RSection type="review">
              <p className="text-sm text-text-muted leading-relaxed">{detail.sq3r.review.text}</p>
            </SQ3RSection>
          )}
        </div>

        {/* Permanent Notes */}
        {detail.permanent_notes?.length > 0 && (
          <div className="rounded-xl border border-border bg-surface p-5 mb-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <span>💎</span> Permanent Notes
            </h3>
            <ul className="space-y-2">
              {detail.permanent_notes.map((n, i) => (
                <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                  <span className="text-accent shrink-0 mt-0.5">→</span>
                  {n}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Comments */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="text-sm font-semibold mb-4">
            Comments ({comments.length})
          </h3>

          {comments.length > 0 && (
            <div className="space-y-3 mb-6">
              {comments.map((c) => (
                <div key={c.id} className="rounded-lg border border-border bg-bg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">{c.author}</span>
                    <span className="text-xs text-text-muted ml-auto">{formatDate(c.created_at)}</span>
                  </div>
                  <p className="text-sm text-text-muted whitespace-pre-wrap">{c.content}</p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleCommentSubmit} className="space-y-3">
            {/* Honeypot */}
            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="absolute opacity-0 pointer-events-none h-0 w-0"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <input
              type="text"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 rounded-lg border border-border bg-bg text-text text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent"
              required
            />
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Share your thoughts on this book..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-bg text-text text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent resize-none"
              required
            />
            <button
              type="submit"
              disabled={commentSubmitting}
              className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {commentSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ──────────────────── Create / Edit Form ────────────────────
  if (view === 'create' || view === 'edit') {
    return (
      <div>
        <BackButton
          onClick={() => {
            if (view === 'edit' && detail) openDetail(detail.id);
            else setView('library');
          }}
          label={view === 'edit' ? 'Back to book' : 'Back to library'}
        />

        <h2 className="text-xl font-bold mb-6">
          {view === 'create' ? 'New Book Note' : `Edit: ${form.title}`}
        </h2>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Basic Info */}
          <fieldset className="rounded-xl border border-border bg-surface p-5 space-y-4">
            <legend className="text-sm font-semibold px-2">Book Info</legend>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Title" required>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={INPUT_CLASS} required placeholder="Book title" />
              </FormField>
              <FormField label="Author" required>
                <input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className={INPUT_CLASS} required placeholder="Author name" />
              </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField label="Year">
                <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className={INPUT_CLASS} placeholder="2024" />
              </FormField>
              <FormField label="Reading Period">
                <input type="text" value={form.reading_period} onChange={(e) => setForm({ ...form, reading_period: e.target.value })}
                  className={INPUT_CLASS} placeholder="Jan — Mar 2026" />
              </FormField>
              <FormField label="Status">
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as BookListItem['status'] })}
                  className={INPUT_CLASS}>
                  <option value="planned">Planned</option>
                  <option value="reading">Reading</option>
                  <option value="completed">Completed</option>
                </select>
              </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField label="Cover Color">
                <div className="flex items-center gap-2">
                  <input type="color" value={form.cover_color} onChange={(e) => setForm({ ...form, cover_color: e.target.value })}
                    className="w-8 h-8 rounded border border-border cursor-pointer" />
                  <input type="text" value={form.cover_color} onChange={(e) => setForm({ ...form, cover_color: e.target.value })}
                    className={INPUT_CLASS + ' flex-1'} />
                </div>
              </FormField>
              <FormField label="Cover Emoji">
                <input type="text" value={form.cover_emoji} onChange={(e) => setForm({ ...form, cover_emoji: e.target.value })}
                  className={INPUT_CLASS} placeholder="📖" />
              </FormField>
              <FormField label="Sort Order">
                <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                  className={INPUT_CLASS} placeholder="0" />
              </FormField>
            </div>

            <FormField label="Rating">
              <Stars rating={form.rating} interactive onChange={(r) => setForm({ ...form, rating: r })} />
            </FormField>

            <FormField label="Quote">
              <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })}
                className={INPUT_CLASS + ' resize-none'} rows={2} placeholder="A memorable quote from the book" />
            </FormField>
          </fieldset>

          {/* SQ3R */}
          <fieldset className="rounded-xl border border-border bg-surface p-5 space-y-5">
            <legend className="text-sm font-semibold px-2">SQ3R Notes</legend>

            {/* Survey */}
            <FormField label="🔭 Survey">
              <textarea value={form.survey} onChange={(e) => setForm({ ...form, survey: e.target.value })}
                className={INPUT_CLASS + ' resize-none'} rows={3} placeholder="Overview: What is this book about?" />
            </FormField>

            {/* Question */}
            <div>
              <label className="block text-sm font-medium mb-1.5">❓ Questions</label>
              <DynamicList
                items={form.questions}
                onChange={(questions) => setForm({ ...form, questions })}
                placeholder="A question this book raises..."
              />
            </div>

            {/* Read (sessions) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">📖 Reading Sessions</label>
                <button type="button" onClick={() => setForm({
                  ...form,
                  sessions: [...form.sessions, { round: form.sessions.length + 1, date: '', sentence: '', change: '', note: '' }],
                })} className="text-xs text-accent hover:text-accent-hover transition-colors">
                  + Add Session
                </button>
              </div>
              <div className="space-y-4">
                {form.sessions.map((s, idx) => (
                  <div key={idx} className="rounded-lg border border-border bg-bg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-accent">Session {s.round}</span>
                      <button type="button" onClick={() => {
                        const next = form.sessions.filter((_, i) => i !== idx);
                        setForm({ ...form, sessions: next });
                      }} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input type="text" value={s.date} placeholder="Date (e.g. 1/23)"
                        onChange={(e) => updateSession(idx, 'date', e.target.value)} className={INPUT_CLASS} />
                      <input type="text" value={s.sentence} placeholder="Key sentence"
                        onChange={(e) => updateSession(idx, 'sentence', e.target.value)} className={INPUT_CLASS} />
                    </div>
                    <input type="text" value={s.change} placeholder="What changed in me?"
                      onChange={(e) => updateSession(idx, 'change', e.target.value)} className={INPUT_CLASS} />
                    <textarea value={s.note} placeholder="Reflection note..."
                      onChange={(e) => updateSession(idx, 'note', e.target.value)}
                      className={INPUT_CLASS + ' resize-none'} rows={3} />
                  </div>
                ))}
              </div>
            </div>

            {/* Recite */}
            <div>
              <label className="block text-sm font-medium mb-1.5">🗣️ Recite (Key Takeaways)</label>
              <DynamicList
                items={form.reciteItems}
                onChange={(reciteItems) => setForm({ ...form, reciteItems })}
                placeholder="A key takeaway in your own words..."
              />
            </div>

            {/* Review */}
            <FormField label="🔄 Review">
              <textarea value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })}
                className={INPUT_CLASS + ' resize-none'} rows={3} placeholder="Overall reflection and synthesis" />
            </FormField>
          </fieldset>

          {/* Permanent Notes */}
          <fieldset className="rounded-xl border border-border bg-surface p-5">
            <legend className="text-sm font-semibold px-2">💎 Permanent Notes</legend>
            <DynamicList
              items={form.permanentNotes}
              onChange={(permanentNotes) => setForm({ ...form, permanentNotes })}
              placeholder="A lasting insight worth keeping..."
            />
          </fieldset>

          <button type="submit"
            className="w-full px-4 py-3 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent-hover transition-colors">
            {view === 'create' ? 'Create Book Note' : 'Save Changes'}
          </button>
        </form>
      </div>
    );
  }

  // ──────────────────── Library View (Default) ────────────────────
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold">Book Notes</h2>
          <p className="text-sm text-text-muted mt-1">
            SQ3R method — Survey, Question, Read, Recite, Review
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {adminVerified ? (
            <button onClick={openCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Book
            </button>
          ) : (
            <button onClick={() => setShowAdminInput(!showAdminInput)}
              className="text-xs text-text-muted/40 hover:text-text-muted transition-colors px-2 py-1">
              Admin
            </button>
          )}
        </div>
      </div>

      {/* Admin login */}
      {showAdminInput && !adminVerified && (
        <form onSubmit={handleAdminLogin} className="flex gap-2 mb-6">
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => { setAdminPassword(e.target.value); setAdminError(false); }}
            placeholder="Admin password"
            className="flex-1 px-3 py-2 rounded-lg border border-border bg-bg text-text text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent"
            autoFocus
          />
          <button type="submit"
            className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors">
            Login
          </button>
          {adminError && <span className="text-sm text-red-400 self-center">Wrong password</span>}
        </form>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
          {(['all', 'reading', 'completed', 'planned'] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-accent text-white'
                  : 'text-text-muted hover:text-text'
              }`}>
              {s === 'all' ? 'All' : STATUS_CONFIG[s].text}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search books..."
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-bg text-text text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent"
        />
      </div>

      {/* Book Grid */}
      {loading ? <Spinner /> : filtered.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-border bg-surface">
          <p className="text-text-muted">
            {search || statusFilter !== 'all' ? 'No books match your filters.' : 'No books yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((book) => (
            <button key={book.id} onClick={() => openDetail(book.id)}
              className="text-left rounded-xl border border-border bg-surface p-5 hover:border-accent/30 glow-hover transition-all group"
              style={{ borderLeftColor: book.cover_color, borderLeftWidth: '3px' }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{book.cover_emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold group-hover:text-accent transition-colors truncate">
                      {book.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium shrink-0 ${STATUS_CONFIG[book.status].class}`}>
                      {STATUS_CONFIG[book.status].text}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{book.author}</p>
                  {book.rating && (
                    <div className="mt-1.5">
                      <Stars rating={book.rating} />
                    </div>
                  )}
                  {book.quote && (
                    <p className="text-xs text-text-muted/70 italic mt-2 line-clamp-2">"{book.quote}"</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // ── Helpers ──

  function updateSession(idx: number, key: keyof ReadingSession, value: string) {
    const sessions = [...form.sessions];
    sessions[idx] = { ...sessions[idx], [key]: key === 'round' ? parseInt(value) || 0 : value };
    setForm({ ...form, sessions });
  }
}

// ── SQ3R Section Wrapper ────────────────────────

function SQ3RSection({ type, children }: { type: keyof typeof SQ3R_LABELS; children: React.ReactNode }) {
  const cfg = SQ3R_LABELS[type];
  return (
    <div className={`rounded-xl border ${cfg.color} ${cfg.bg} p-5`}>
      <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${cfg.text}`}>
        <span>{cfg.icon}</span> {cfg.label}
      </h3>
      {children}
    </div>
  );
}

// ── Dynamic List (add/remove items) ─────────────

function DynamicList({ items, onChange, placeholder }: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input type="text" value={item} placeholder={placeholder}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            className={INPUT_CLASS + ' flex-1'} />
          {items.length > 1 && (
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="text-xs text-red-400 hover:text-red-300 px-2">✕</button>
          )}
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ''])}
        className="text-xs text-accent hover:text-accent-hover transition-colors">
        + Add item
      </button>
    </div>
  );
}

// ── Form Field Wrapper ──────────────────────────

function FormField({ label, required, children }: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

// ── Constants ───────────────────────────────────

const INPUT_CLASS = 'w-full px-3 py-2 rounded-lg border border-border bg-bg text-text text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent';

function emptyForm() {
  return {
    title: '',
    author: '',
    year: '',
    reading_period: '',
    cover_color: '#818cf8',
    cover_emoji: '📖',
    status: 'planned' as const,
    rating: 0,
    quote: '',
    survey: '',
    questions: [''],
    sessions: [] as ReadingSession[],
    reciteItems: [''],
    review: '',
    permanentNotes: [''],
    sort_order: '0',
  };
}
