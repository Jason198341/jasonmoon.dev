import { useState, useEffect, useMemo } from 'react';

interface InquiryListItem {
  id: string;
  title: string;
  name: string;
  created_at: string;
}

interface InquiryDetail {
  id: string;
  title: string;
  name: string;
  email: string | null;
  phone: string | null;
  content: string;
  created_at: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  is_admin: boolean;
  created_at: string;
}

type View = 'list' | 'detail' | 'new';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function CollaborationBoard() {
  const [view, setView] = useState<View>('list');
  const [inquiries, setInquiries] = useState<InquiryListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Detail view state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [detail, setDetail] = useState<InquiryDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [passwordError, setPasswordError] = useState(false);
  const [unlockedPassword, setUnlockedPassword] = useState('');

  // Comment form
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // New post form
  const [form, setForm] = useState({
    title: '',
    name: '',
    email: '',
    phone: '',
    content: '',
    password: '',
    passwordConfirm: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    loadInquiries();
  }, []);

  async function loadInquiries() {
    setLoading(true);
    try {
      const res = await fetch('/api/db/inquiries');
      const data = await res.json();
      if (Array.isArray(data)) setInquiries(data);
    } catch {}
    setLoading(false);
  }

  function handleInquiryClick(id: string) {
    setSelectedId(id);
    setPasswordInput('');
    setPasswordError(false);
    setDetail(null);
    setComments([]);
    setShowPasswordDialog(true);
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !passwordInput) return;

    const res = await fetch('/api/db/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', id: selectedId, password: passwordInput }),
    });

    if (!res.ok) {
      setPasswordError(true);
      return;
    }

    const data = await res.json();
    setDetail(data);
    setUnlockedPassword(passwordInput);
    setShowPasswordDialog(false);
    setView('detail');

    // Load comments
    const commentsRes = await fetch('/api/db/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_comments', inquiry_id: selectedId, password: passwordInput }),
    });
    const commentsData = await commentsRes.json();
    if (Array.isArray(commentsData)) setComments(commentsData);
  }

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !commentAuthor.trim() || !commentContent.trim()) return;

    setCommentSubmitting(true);
    const res = await fetch('/api/db/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_comment',
        inquiry_id: selectedId,
        password: unlockedPassword,
        author: commentAuthor.trim(),
        content: commentContent.trim(),
      }),
    });

    if (res.ok) {
      const commentsRes = await fetch('/api/db/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_comments', inquiry_id: selectedId, password: unlockedPassword }),
      });
      const commentsData = await commentsRes.json();
      if (Array.isArray(commentsData)) setComments(commentsData);
      setCommentContent('');
    }
    setCommentSubmitting(false);
  }

  async function handleNewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.passwordConfirm) return;
    if (!form.title.trim() || !form.name.trim() || !form.content.trim() || !form.password) return;

    setSubmitting(true);
    const res = await fetch('/api/db/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create',
        title: form.title.trim(),
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        content: form.content.trim(),
        password: form.password,
      }),
    });

    if (res.ok) {
      setSubmitSuccess(true);
      setForm({ title: '', name: '', email: '', phone: '', content: '', password: '', passwordConfirm: '' });
      await loadInquiries();
      setTimeout(() => {
        setSubmitSuccess(false);
        setView('list');
      }, 2000);
    }
    setSubmitting(false);
  }

  // ──────────────────── Password Dialog ────────────────────
  if (showPasswordDialog) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <button
          onClick={() => setShowPasswordDialog(false)}
          className="text-sm text-text-muted hover:text-text mb-4 flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to list
        </button>

        <div className="max-w-sm mx-auto text-center py-8">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Password Required</h3>
          <p className="text-sm text-text-muted mb-6">
            This inquiry is private. Enter the post password or admin password to view.
          </p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
              placeholder="Enter password"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-bg text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent mb-3"
              autoFocus
            />
            {passwordError && (
              <p className="text-sm text-red-400 mb-3">Incorrect password. Please try again.</p>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2.5 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent-hover transition-colors"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ──────────────────── Detail View ────────────────────
  if (view === 'detail' && detail) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <button
          onClick={() => { setView('list'); setDetail(null); setComments([]); setUnlockedPassword(''); }}
          className="text-sm text-text-muted hover:text-text mb-6 flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to list
        </button>

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">{detail.title}</h3>
          <div className="flex flex-wrap gap-3 text-sm text-text-muted">
            <span>{detail.name}</span>
            <span>·</span>
            <span>{formatDate(detail.created_at)}</span>
            {detail.email && (
              <>
                <span>·</span>
                <span>{detail.email}</span>
              </>
            )}
            {detail.phone && (
              <>
                <span>·</span>
                <span>{detail.phone}</span>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="prose text-text leading-relaxed mb-8 whitespace-pre-wrap border-t border-border pt-6">
          {detail.content}
        </div>

        {/* Comments */}
        <div className="border-t border-border pt-6">
          <h4 className="text-sm font-semibold mb-4">
            Comments ({comments.length})
          </h4>

          {comments.length > 0 && (
            <div className="space-y-4 mb-6">
              {comments.map((c) => (
                <div key={c.id} className="rounded-lg border border-border bg-bg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">
                      {c.author}
                    </span>
                    {c.is_admin && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-medium">
                        Admin
                      </span>
                    )}
                    <span className="text-xs text-text-muted ml-auto">
                      {formatDate(c.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-text-muted whitespace-pre-wrap">{c.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Comment form */}
          <form onSubmit={handleCommentSubmit} className="space-y-3">
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
              placeholder="Write a comment..."
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

  // ──────────────────── New Post Form ────────────────────
  if (view === 'new') {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <button
          onClick={() => setView('list')}
          className="text-sm text-text-muted hover:text-text mb-6 flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to list
        </button>

        <h3 className="text-xl font-bold mb-2">New Inquiry</h3>
        <p className="text-sm text-text-muted mb-6">
          All inquiries are private. Set a password to protect your post.
        </p>

        {submitSuccess && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 mb-6">
            <p className="text-sm text-emerald-400 font-medium">
              Your inquiry has been submitted successfully.
            </p>
          </div>
        )}

        <form onSubmit={handleNewSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1.5">Name <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg text-text text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg text-text text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+82 10 xxxx xxxx"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg text-text text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Title <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Brief description of your project"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg text-text text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Details <span className="text-red-400">*</span></label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="What are you looking to build? Any specific requirements, timeline, or budget in mind?"
              rows={6}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg text-text text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent resize-none"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1.5">Password <span className="text-red-400">*</span></label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Set a password for this post"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg text-text text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent"
                required
                minLength={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Confirm Password <span className="text-red-400">*</span></label>
              <input
                type="password"
                value={form.passwordConfirm}
                onChange={(e) => setForm({ ...form, passwordConfirm: e.target.value })}
                placeholder="Re-enter password"
                className={`w-full px-3 py-2.5 rounded-lg border bg-bg text-text text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent ${
                  form.passwordConfirm && form.password !== form.passwordConfirm
                    ? 'border-red-400'
                    : 'border-border'
                }`}
                required
              />
            </div>
          </div>
          {form.passwordConfirm && form.password !== form.passwordConfirm && (
            <p className="text-sm text-red-400">Passwords do not match.</p>
          )}

          <button
            type="submit"
            disabled={submitting || (form.passwordConfirm !== '' && form.password !== form.passwordConfirm)}
            className="w-full px-4 py-3 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Inquiry'}
          </button>
        </form>
      </div>
    );
  }

  // ──────────────────── List View (Default) ────────────────────
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Collaboration Board</h2>
          <p className="text-sm text-text-muted mt-1">
            All inquiries are private and password-protected.
          </p>
        </div>
        <button
          onClick={() => setView('new')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Inquiry
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-text-muted">Loading...</p>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-border bg-surface">
          <p className="text-text-muted mb-4">No inquiries yet.</p>
          <button
            onClick={() => setView('new')}
            className="text-sm text-accent hover:text-accent-hover transition-colors"
          >
            Be the first to submit an inquiry
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 border-b border-border bg-bg/50 text-xs font-medium text-text-muted uppercase tracking-wider">
            <span>Title</span>
            <span className="hidden sm:block w-24 text-center">Author</span>
            <span className="w-24 text-right">Date</span>
          </div>

          {/* Rows */}
          {inquiries.map((item, i) => (
            <button
              key={item.id}
              onClick={() => handleInquiryClick(item.id)}
              className={`w-full grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-4 text-left hover:bg-surface-hover transition-colors ${
                i < inquiries.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <span className="flex items-center gap-2 min-w-0">
                <svg className="w-4 h-4 text-text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm font-medium truncate">{item.title}</span>
              </span>
              <span className="hidden sm:block w-24 text-center text-sm text-text-muted">{item.name}</span>
              <span className="w-24 text-right text-sm text-text-muted">{formatDate(item.created_at)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
