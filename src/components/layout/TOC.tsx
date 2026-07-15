'use client';

import { useEffect, useRef, useState } from 'react';
import type { TOCItem } from '@/types/content';

interface TOCProps {
  items: TOCItem[];
}

export function TOC({ items }: TOCProps) {
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const headingElements: HTMLElement[] = items
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    // Track which headings are in the viewport using IntersectionObserver
    const headingMap = new Map<string, boolean>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          headingMap.set(entry.target.id, entry.isIntersecting);
        });

        // Highlight the topmost visible heading
        for (const { id } of items) {
          if (headingMap.get(id)) {
            setActiveId(id);
            break;
          }
        }
      },
      {
        rootMargin: '-64px 0px -60% 0px',
        threshold: 0,
      }
    );

    headingElements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [items]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update active state immediately on click
      setActiveId(id);
    }
  };

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="hidden xl:block flex-shrink-0"
      style={{ width: 'var(--toc-width)', position: 'sticky', top: 'var(--header-height)', maxHeight: 'calc(100vh - var(--header-height))', overflowY: 'auto', padding: '1.5rem 1rem' }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: 'var(--text-muted)' }}
      >
        On this page
      </p>

      <ul className="space-y-1" role="list">
        {items.map(({ id, text, level }) => {
          const isActive = activeId === id;
          return (
            <li key={id} style={{ paddingLeft: level === 3 ? '0.75rem' : '0' }}>
              <button
                onClick={() => handleClick(id)}
                className={`toc-link flex items-center gap-2 w-full text-left text-xs py-1 transition-all duration-150 cursor-pointer ${
                  isActive ? 'toc-link-active' : ''
                }`}
                style={{
                  color: isActive ? undefined : 'var(--text-muted)',
                  background: 'none',
                  border: 'none',
                  lineHeight: '1.4',
                }}
                aria-current={isActive ? 'true' : undefined}
              >
                {/* Leading indicator */}
                <span
                  className="flex-shrink-0 w-0.5 rounded-full transition-all duration-200"
                  style={{
                    height: '1rem',
                    background: isActive ? 'var(--color-brand-500)' : 'var(--border)',
                  }}
                  aria-hidden="true"
                />
                <span className="leading-snug">{text}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="flex items-center gap-1.5 text-xs mt-6 transition-colors cursor-pointer"
        style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
      >
        ↑ Back to top
      </button>
    </nav>
  );
}
