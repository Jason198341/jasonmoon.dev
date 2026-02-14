import { useState, useCallback, useRef, useEffect } from 'react';

interface PromptEntry {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  category: string;
  tags: string[];
  platforms: string[];
  body: string;
}

interface Props {
  prompts: PromptEntry[];
}

const CATEGORIES = [
  { key: 'all', label: 'All', labelKo: '전체' },
  { key: 'meta', label: 'Meta', labelKo: '메타' },
  { key: 'business', label: 'Business', labelKo: '비즈니스' },
  { key: 'writing', label: 'Writing', labelKo: '글쓰기' },
  { key: 'media', label: 'Media', labelKo: '미디어' },
  { key: 'education', label: 'Education', labelKo: '교육' },
  { key: 'wellness', label: 'Wellness', labelKo: '건강' },
  { key: 'professional', label: 'Professional', labelKo: '전문직' },
  { key: 'finance', label: 'Finance', labelKo: '금융' },
  { key: 'content', label: 'Content', labelKo: '콘텐츠' },
  { key: 'fun', label: 'Fun', labelKo: '재미' },
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  meta: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  business: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  writing: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  media: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  education: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  wellness: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
  professional: 'text-slate-300 bg-slate-500/10 border-slate-500/20',
  finance: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  content: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  fun: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
};

const PLATFORM_ICONS: Record<string, string> = {
  GPTs: 'G',
  Claude: 'C',
  Gemini: '✦',
};

export default function PromptGallery({ prompts }: Props) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const contentRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const filtered = prompts.filter((p) => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    if (!searchQuery.trim()) return matchCat;
    const q = searchQuery.toLowerCase();
    return matchCat && (
      p.title.toLowerCase().includes(q) ||
      p.titleEn.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  const handleCopy = useCallback(async (id: string, body: string) => {
    try {
      await navigator.clipboard.writeText(body);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = body;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  // Scroll expanded card into view
  useEffect(() => {
    if (expandedId) {
      const el = contentRefs.current.get(expandedId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    }
  }, [expandedId]);

  const catCounts = prompts.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative max-w-md">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search prompts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.filter(c => c.key === 'all' || catCounts[c.key]).map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
              activeCategory === cat.key
                ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-accent)]/40'
            }`}
          >
            {cat.label}
            {cat.key !== 'all' && catCounts[cat.key] && (
              <span className="ml-1 opacity-60">{catCounts[cat.key]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-[var(--color-text-muted)]">
        {filtered.length} prompt{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Prompt cards */}
      <div className="grid gap-4">
        {filtered.map((prompt) => {
          const isExpanded = expandedId === prompt.id;
          const isCopied = copiedId === prompt.id;
          const catColor = CATEGORY_COLORS[prompt.category] || '';

          return (
            <div
              key={prompt.id}
              className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden transition-all duration-300 hover:border-[var(--color-accent)]/30"
            >
              {/* Card header */}
              <div
                className="p-4 sm:p-5 cursor-pointer"
                onClick={() => toggleExpand(prompt.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Title row */}
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <h3 className="text-base font-semibold text-[var(--color-text)] leading-snug">
                        {prompt.title}
                      </h3>
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium border ${catColor}`}>
                        {CATEGORIES.find(c => c.key === prompt.category)?.labelKo || prompt.category}
                      </span>
                    </div>

                    {/* English name */}
                    <p className="text-xs text-[var(--color-text-muted)] mb-2 font-mono">
                      {prompt.titleEn}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-2">
                      {prompt.description}
                    </p>

                    {/* Platforms + Tags */}
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      {/* Platform badges */}
                      <div className="flex gap-1">
                        {prompt.platforms.map((p) => (
                          <span
                            key={p}
                            className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold bg-[var(--color-bg)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
                            title={p}
                          >
                            {PLATFORM_ICONS[p] || p[0]}
                          </span>
                        ))}
                      </div>

                      {/* Tags (first 4) */}
                      <div className="flex gap-1 flex-wrap">
                        {prompt.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="text-[10px] text-[var(--color-text-muted)] bg-[var(--color-bg)] px-1.5 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                        {prompt.tags.length > 4 && (
                          <span className="text-[10px] text-[var(--color-text-muted)] opacity-60">
                            +{prompt.tags.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expand indicator */}
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      className={`w-5 h-5 text-[var(--color-text-muted)] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expanded content */}
              <div
                ref={(el) => { if (el) contentRefs.current.set(prompt.id, el); }}
                className={`transition-all duration-300 ease-out overflow-hidden ${
                  isExpanded ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="border-t border-[var(--color-border)]">
                  {/* Action bar */}
                  <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-[var(--color-bg)]/50">
                    <span className="text-xs text-[var(--color-text-muted)]">
                      System Prompt — Copy and paste into your AI platform
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(prompt.id, prompt.body);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                        isCopied
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/30 hover:bg-[var(--color-accent)]/20'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy Prompt
                        </>
                      )}
                    </button>
                  </div>

                  {/* Prompt content */}
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                    <pre className="text-xs sm:text-sm leading-relaxed text-[var(--color-text-muted)] whitespace-pre-wrap break-words font-mono bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)] p-4 max-h-[60vh] overflow-y-auto">
                      {prompt.body}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-[var(--color-text-muted)]">
          <p className="text-lg mb-2">No prompts found</p>
          <p className="text-sm">Try a different category or search term</p>
        </div>
      )}
    </div>
  );
}
