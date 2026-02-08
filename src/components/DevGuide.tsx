import { useState, useMemo, useRef, useEffect } from 'react';
import { chapters, totalArticles, totalChapters } from '../data/devguide';
import type { Article, Chapter } from '../data/devguide';

/* ── Minimal Markdown → HTML ───────────────────── */
function md(text: string): string {
  return text
    // code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-bg rounded-lg p-4 overflow-x-auto text-sm my-4 border border-border"><code>$2</code></pre>')
    // inline code
    .replace(/`([^`]+)`/g, '<code class="bg-bg px-1.5 py-0.5 rounded text-accent text-sm">$1</code>')
    // headings
    .replace(/^#### (.+)$/gm, '<h4 class="text-base font-semibold mt-6 mb-2">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-10 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
    // bold / italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // blockquote
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-accent/30 pl-4 my-4 text-text-muted italic">$1</blockquote>')
    // unordered list items
    .replace(/^[\s]*[-*] (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    // ordered list items
    .replace(/^[\s]*(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal" value="$1">$2</li>')
    // horizontal rule
    .replace(/^---$/gm, '<hr class="border-border my-6"/>')
    // links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-accent hover:underline">$1</a>')
    // tables (basic)
    .replace(/\|(.+)\|/g, (match) => {
      if (match.includes('---')) return '';
      const cells = match.split('|').filter(c => c.trim());
      return '<div class="flex gap-4 py-1 text-sm">' + cells.map(c => `<span class="flex-1">${c.trim()}</span>`).join('') + '</div>';
    })
    // paragraphs (double newline)
    .replace(/\n\n/g, '</p><p class="my-3 leading-relaxed">')
    // single newlines in content
    .replace(/\n/g, '<br/>');
}

/* ── Component ─────────────────────────────────── */
export default function DevGuide() {
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState(0);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const chapter = chapters[selectedChapter];
  const article = chapter?.articles[selectedArticle];

  // Search
  const searchResults = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    const results: { chapterIdx: number; articleIdx: number; chapter: Chapter; article: Article }[] = [];
    chapters.forEach((ch, ci) => {
      ch.articles.forEach((ar, ai) => {
        if (ar.title.toLowerCase().includes(q) || ar.content.toLowerCase().includes(q)) {
          results.push({ chapterIdx: ci, articleIdx: ai, chapter: ch, article: ar });
        }
      });
    });
    return results;
  }, [search]);

  function selectArticle(ci: number, ai: number) {
    setSelectedChapter(ci);
    setSelectedArticle(ai);
    setSearch('');
    setSidebarOpen(false);
    contentRef.current?.scrollTo(0, 0);
  }

  // Reset article index when chapter changes
  useEffect(() => {
    setSelectedArticle(0);
    contentRef.current?.scrollTo(0, 0);
  }, [selectedChapter]);

  const renderedContent = useMemo(() => {
    if (!article) return '';
    return md(article.content);
  }, [article]);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface shrink-0">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-bg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg font-bold shrink-0">개발가이드</h1>
        <span className="text-xs text-text-muted shrink-0">{totalChapters}챕터 · {totalArticles}편</span>
        <div className="flex-1 max-w-sm ml-auto relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="검색..."
            className="w-full px-3 py-1.5 rounded-lg bg-bg border border-border text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent/50"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Search results overlay */}
      {searchResults && (
        <div className="absolute z-30 top-[120px] left-0 right-0 mx-auto max-w-3xl bg-surface border border-border rounded-xl shadow-2xl max-h-[60vh] overflow-y-auto">
          <div className="p-4">
            <p className="text-sm text-text-muted mb-3">
              {searchResults.length}개 결과 — "{search}"
            </p>
            {searchResults.length === 0 ? (
              <p className="text-text-muted text-sm py-4 text-center">결과가 없습니다.</p>
            ) : (
              <div className="space-y-1">
                {searchResults.slice(0, 20).map((r, i) => (
                  <button
                    key={i}
                    onClick={() => selectArticle(r.chapterIdx, r.articleIdx)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-bg transition-colors"
                  >
                    <span className="text-xs text-text-muted">{r.chapter.icon} {r.chapter.title}</span>
                    <p className="text-sm font-medium">{r.article.title}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside
          className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 absolute lg:relative z-20 w-72 h-full
            bg-surface border-r border-border overflow-y-auto shrink-0
            transition-transform duration-200
          `}
        >
          {/* Chapter list */}
          <nav className="py-2">
            {chapters.map((ch, ci) => (
              <div key={ch.id}>
                <button
                  onClick={() => { setSelectedChapter(ci); setSelectedArticle(0); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 flex items-center gap-2 text-sm font-medium transition-colors ${
                    ci === selectedChapter
                      ? 'bg-accent/10 text-accent border-r-2 border-accent'
                      : 'text-text-muted hover:text-text hover:bg-bg'
                  }`}
                >
                  <span className="text-base">{ch.icon}</span>
                  <span className="flex-1">{ch.title}</span>
                  <span className="text-xs opacity-60">{ch.articles.length}</span>
                </button>

                {/* Articles under selected chapter */}
                {ci === selectedChapter && (
                  <div className="bg-bg/50">
                    {ch.articles.map((ar, ai) => (
                      <button
                        key={ar.slug}
                        onClick={() => selectArticle(ci, ai)}
                        className={`w-full text-left pl-10 pr-4 py-1.5 text-xs transition-colors ${
                          ai === selectedArticle
                            ? 'text-accent font-medium bg-accent/5'
                            : 'text-text-muted hover:text-text'
                        }`}
                      >
                        {ar.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="lg:hidden absolute inset-0 z-10 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Content area */}
        <main ref={contentRef} className="flex-1 overflow-y-auto">
          {article ? (
            <div className="max-w-3xl mx-auto px-6 py-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-text-muted mb-6">
                <span>{chapter.icon} {chapter.title}</span>
                <span>›</span>
                <span className="text-text">{article.title}</span>
              </div>

              {/* Article title */}
              <h2 className="text-2xl sm:text-3xl font-bold mb-8">{article.title}</h2>

              {/* Article content */}
              <div
                className="prose-custom text-sm sm:text-base text-text-muted leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderedContent }}
              />

              {/* Prev / Next navigation */}
              <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
                <button
                  onClick={() => {
                    if (selectedArticle > 0) {
                      setSelectedArticle(selectedArticle - 1);
                      contentRef.current?.scrollTo(0, 0);
                    } else if (selectedChapter > 0) {
                      const prevCh = selectedChapter - 1;
                      setSelectedChapter(prevCh);
                      setSelectedArticle(chapters[prevCh].articles.length - 1);
                      contentRef.current?.scrollTo(0, 0);
                    }
                  }}
                  disabled={selectedChapter === 0 && selectedArticle === 0}
                  className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  이전 글
                </button>
                <span className="text-xs text-text-muted">
                  {selectedArticle + 1} / {chapter.articles.length}
                </span>
                <button
                  onClick={() => {
                    if (selectedArticle < chapter.articles.length - 1) {
                      setSelectedArticle(selectedArticle + 1);
                      contentRef.current?.scrollTo(0, 0);
                    } else if (selectedChapter < chapters.length - 1) {
                      setSelectedChapter(selectedChapter + 1);
                      setSelectedArticle(0);
                      contentRef.current?.scrollTo(0, 0);
                    }
                  }}
                  disabled={selectedChapter === chapters.length - 1 && selectedArticle === chapter.articles.length - 1}
                  className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  다음 글
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-text-muted">
              <p>왼쪽 메뉴에서 챕터를 선택하세요.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
