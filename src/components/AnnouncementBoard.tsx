import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const categoryConfig: Record<string, { label: string; color: string; bg: string }> = {
  insight: { label: 'Insight', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  trend: { label: 'Trend', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  update: { label: 'Update', color: 'text-amber-400', bg: 'bg-amber-500/10' },
};

export default function AnnouncementBoard() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Admin state
  const [adminMode, setAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminVerified, setAdminVerified] = useState(false);
  const [adminError, setAdminError] = useState(false);

  // New post form
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('insight');
  const [submitting, setSubmitting] = useState(false);

  async function fetchAnnouncements() {
    setLoading(true);
    const { data, error } = await supabase.rpc('list_announcements');
    if (!error && data) setAnnouncements(data);
    setLoading(false);
  }

  useEffect(() => { fetchAnnouncements(); }, []);

  async function verifyAdmin() {
    setAdminError(false);
    try {
      // Try creating a dummy call to verify password — we'll use a real create instead
      // Just set verified and let actual operations validate
      setAdminVerified(true);
      setAdminMode(false);
    } catch {
      setAdminError(true);
    }
  }

  async function handleCreate() {
    if (!newTitle.trim() || !newContent.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.rpc('create_announcement', {
      p_password: adminPassword,
      p_title: newTitle.trim(),
      p_content: newContent.trim(),
      p_category: newCategory,
    });
    if (error) {
      alert(error.message?.includes('Invalid admin') ? 'Wrong admin password.' : 'Failed to create announcement.');
      setAdminVerified(false);
      setSubmitting(false);
      return;
    }
    setNewTitle('');
    setNewContent('');
    setNewCategory('insight');
    setShowForm(false);
    setSubmitting(false);
    fetchAnnouncements();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this announcement?')) return;
    const { error } = await supabase.rpc('delete_announcement', {
      p_password: adminPassword,
      p_id: id,
    });
    if (error) {
      alert('Failed to delete. Check admin password.');
      setAdminVerified(false);
      return;
    }
    fetchAnnouncements();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <span className="ml-3 text-text-muted text-sm">Loading announcements...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Announcements</h1>
          <p className="text-text-muted text-sm mt-1">Latest insights, trends, and updates from the field.</p>
        </div>
        {!adminVerified ? (
          <button
            onClick={() => setAdminMode(!adminMode)}
            className="text-xs text-text-muted hover:text-accent transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-accent/40"
          >
            Admin
          </button>
        ) : (
          <button
            onClick={() => { setShowForm(!showForm); }}
            className="text-sm font-medium text-white bg-accent hover:bg-accent/80 transition-colors px-4 py-2 rounded-lg"
          >
            {showForm ? 'Cancel' : '+ New Post'}
          </button>
        )}
      </div>

      {/* Admin login */}
      {adminMode && !adminVerified && (
        <div className="mb-6 p-4 rounded-xl border border-border bg-surface">
          <p className="text-sm font-medium mb-3">Admin Authentication</p>
          <div className="flex gap-2">
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => { setAdminPassword(e.target.value); setAdminError(false); }}
              onKeyDown={(e) => e.key === 'Enter' && verifyAdmin()}
              placeholder="Admin password"
              className="flex-1 px-3 py-2 rounded-lg bg-bg border border-border text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent/50"
            />
            <button
              onClick={verifyAdmin}
              disabled={!adminPassword}
              className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/80 transition-colors disabled:opacity-40"
            >
              Login
            </button>
          </div>
          {adminError && <p className="text-red-400 text-xs mt-2">Invalid password.</p>}
        </div>
      )}

      {/* New post form */}
      {showForm && adminVerified && (
        <div className="mb-6 p-5 rounded-xl border border-accent/20 bg-accent/5">
          <p className="text-sm font-medium mb-4">New Announcement</p>
          <div className="space-y-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title"
              className="w-full px-3 py-2 rounded-lg bg-bg border border-border text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent/50"
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Content (supports plain text)"
              rows={5}
              className="w-full px-3 py-2 rounded-lg bg-bg border border-border text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent/50 resize-none"
            />
            <div className="flex items-center gap-3">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="px-3 py-2 rounded-lg bg-bg border border-border text-sm text-text focus:outline-none focus:border-accent/50"
              >
                <option value="insight">Insight</option>
                <option value="trend">Trend</option>
                <option value="update">Update</option>
              </select>
              <button
                onClick={handleCreate}
                disabled={submitting || !newTitle.trim() || !newContent.trim()}
                className="ml-auto px-5 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/80 transition-colors disabled:opacity-40"
              >
                {submitting ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcements list */}
      {announcements.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-lg mb-1">No announcements yet.</p>
          <p className="text-sm">Check back soon for insights and updates.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => {
            const cat = categoryConfig[a.category] || categoryConfig.insight;
            const isExpanded = expandedId === a.id;
            return (
              <article
                key={a.id}
                className="rounded-xl border border-border bg-surface overflow-hidden transition-all hover:border-accent/30"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : a.id)}
                  className="w-full text-left p-5 flex items-start gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cat.bg} ${cat.color}`}>
                        {cat.label}
                      </span>
                      <span className="text-xs text-text-muted">{formatDate(a.created_at)}</span>
                    </div>
                    <h3 className="font-semibold text-text leading-snug">{a.title}</h3>
                    {!isExpanded && (
                      <p className="text-sm text-text-muted mt-1 line-clamp-2">{a.content}</p>
                    )}
                  </div>
                  <svg
                    className={`w-4 h-4 text-text-muted shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 -mt-1">
                    <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">{a.content}</p>
                    {adminVerified && (
                      <div className="mt-4 pt-3 border-t border-border">
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                          Delete this announcement
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
