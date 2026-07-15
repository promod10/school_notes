'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, FileText, Loader2, BookOpen, GraduationCap } from 'lucide-react';
import { useSearchStore } from '@/lib/search-store';

interface PagefindResult {
  url: string;
  meta: {
    title?: string;
  };
  excerpt: string;
  sub_results?: Array<{
    title: string;
    url: string;
    excerpt: string;
  }>;
}

interface PagefindAPI {
  search: (query: string) => Promise<{
    results: Array<{
      id: string;
      data: () => Promise<PagefindResult>;
    }>;
  }>;
}

declare global {
  interface Window {
    pagefind?: PagefindAPI;
  }
}

export function SearchModal() {
  const { isOpen, closeSearch } = useSearchStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PagefindResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagefindLoaded, setPagefindLoaded] = useState(false);
  const [pagefindError, setPagefindError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load Pagefind WASM bundle lazily
  useEffect(() => {
    if (!isOpen || pagefindLoaded || pagefindError) return;

    const loadPagefind = async () => {
      try {
        // @ts-expect-error – Pagefind is a post-build WASM module
        const pf = await import(/* webpackIgnore: true */ '/pagefind/pagefind.js');
        window.pagefind = pf as PagefindAPI;
        setPagefindLoaded(true);
      } catch {
        // In dev mode, the pagefind bundle doesn't exist yet (requires `npm run build`)
        setPagefindError(true);
      }
    };

    loadPagefind();
  }, [isOpen, pagefindLoaded, pagefindError]);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Debounced search
  const runSearch = useCallback(
    async (q: string) => {
      if (!q.trim() || !window.pagefind) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const result = await window.pagefind.search(q);
        const resolved = await Promise.all(
          result.results.slice(0, 12).map((r) => r.data())
        );
        setResults(resolved);
        setActiveIndex(0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { closeSearch(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter' && results[activeIndex]) {
      navigateTo(results[activeIndex].url);
    }
  };

  const navigateTo = (url: string) => {
    closeSearch();
    // Pagefind returns root-relative URLs
    const path = url.replace(/^https?:\/\/[^/]+/, '');
    router.push(path);
  };

  // Determine stream icon from URL
  const getStreamIcon = (url: string) => {
    if (url.includes('/school/')) return BookOpen;
    if (url.includes('/college/')) return GraduationCap;
    return FileText;
  };

  const getStreamLabel = (url: string) => {
    if (url.includes('/school/')) return 'School';
    if (url.includes('/college/')) return 'College';
    return 'Resource';
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={closeSearch}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        className="relative w-full max-w-2xl animate-scale-in"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-elevated)',
          overflow: 'hidden',
        }}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div
          className="flex items-center gap-3 px-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
          ) : (
            <Search size={18} className="flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
          )}

          <input
            ref={inputRef}
            type="search"
            placeholder="Search topics, subjects, concepts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 py-4 text-base outline-none bg-transparent"
            style={{ color: 'var(--text-primary)', caretColor: 'var(--color-brand-500)' }}
            aria-label="Search query"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />

          {query && (
            <button
              onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
              aria-label="Clear search"
              className="flex-shrink-0 p-1 rounded"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={16} />
            </button>
          )}

          <button
            onClick={closeSearch}
            className="flex-shrink-0 text-xs px-2 py-1 rounded"
            style={{
              color: 'var(--text-muted)',
              background: 'var(--bg-muted)',
              border: '1px solid var(--border)',
            }}
            aria-label="Close search"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {pagefindError && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Search unavailable in development
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Run <code className="px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-muted)', color: 'var(--text-brand)' }}>npm run build</code> to enable full-text search.
              </p>
            </div>
          )}

          {!pagefindError && !query && (
            <div className="px-4 py-6 text-center">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Start typing to search across all topics...
              </p>
              <div className="flex items-center justify-center gap-4 mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>↑↓ navigate</span>
                <span>↵ open</span>
                <span>ESC close</span>
              </div>
            </div>
          )}

          {!pagefindError && query && results.length === 0 && !loading && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                No results for &ldquo;<strong>{query}</strong>&rdquo;
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Try a different keyword or check your spelling.
              </p>
            </div>
          )}

          {results.length > 0 && (
            <ul role="listbox" aria-label="Search results" className="py-2">
              {results.map((result, idx) => {
                const StreamIcon = getStreamIcon(result.url);
                const streamLabel = getStreamLabel(result.url);
                const isActive = idx === activeIndex;

                return (
                  <li key={result.url} role="option" aria-selected={isActive}>
                    <button
                      onClick={() => navigateTo(result.url)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className="w-full text-left px-4 py-3 flex items-start gap-3 transition-all duration-100 cursor-pointer"
                      style={{
                        background: isActive ? 'var(--bg-muted)' : 'transparent',
                        borderLeft: isActive ? '2px solid var(--color-brand-500)' : '2px solid transparent',
                      }}
                    >
                      {/* Icon */}
                      <div
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                        style={{
                          background: 'color-mix(in srgb, var(--color-brand-500) 10%, transparent)',
                          color: 'var(--text-brand)',
                        }}
                      >
                        <StreamIcon size={15} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className="font-semibold text-sm truncate"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {result.meta.title ?? 'Untitled'}
                          </span>
                          <span
                            className="text-xs px-1.5 py-0.5 rounded flex-shrink-0"
                            style={{
                              background: 'var(--bg-muted)',
                              color: 'var(--text-muted)',
                              border: '1px solid var(--border)',
                            }}
                          >
                            {streamLabel}
                          </span>
                        </div>
                        <p
                          className="text-xs leading-relaxed line-clamp-2"
                          style={{ color: 'var(--text-secondary)' }}
                          // Pagefind highlights matched terms with <mark> tags
                          dangerouslySetInnerHTML={{ __html: result.excerpt }}
                        />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div
            className="px-4 py-2.5 flex items-center justify-between text-xs"
            style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--bg-subtle)' }}
          >
            <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
            <span>Powered by Pagefind</span>
          </div>
        )}
      </div>
    </div>
  );
}
