'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, FileText, X, BookOpen } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { SidebarGroup } from '@/types/content';

interface SidebarProps {
  groups: SidebarGroup[];
  subject: string;
}

export function Sidebar({ groups, subject }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const SESSION_KEY = `sidebar-scroll-${subject}`;

  // Restore scroll position
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved && scrollRef.current) {
      scrollRef.current.scrollTop = parseInt(saved, 10);
    }
  }, [SESSION_KEY]);

  // Save scroll position on scroll
  const handleScroll = () => {
    if (scrollRef.current) {
      sessionStorage.setItem(SESSION_KEY, String(scrollRef.current.scrollTop));
    }
  };

  // Close mobile sidebar on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  const SidebarContent = () => (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="h-full overflow-y-auto py-4 px-3"
      style={{ scrollbarWidth: 'thin' }}
    >
      <div className="mb-4 px-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          {subject}
        </h2>
      </div>

      {groups.map((group) => (
        <div key={group.subject} className="mb-4">
          <div
            className="flex items-center gap-2 px-2 py-1.5 mb-1"
          >
            <BookOpen size={13} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>
              {group.subject.replace(/-/g, ' ')}
            </span>
          </div>

          <ul className="space-y-0.5" role="list">
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                      isActive ? 'sidebar-item-active' : ''
                    }`}
                    style={{
                      color: isActive ? undefined : 'var(--text-secondary)',
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <FileText
                      size={13}
                      className="flex-shrink-0"
                      style={{ color: isActive ? 'var(--text-brand)' : 'var(--text-muted)' }}
                    />
                    <span className="flex-1 leading-snug">{item.title}</span>
                    {isActive && (
                      <ChevronRight size={12} style={{ color: 'var(--text-brand)' }} aria-hidden="true" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile sidebar toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open chapter navigation"
        className="lg:hidden fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm text-white shadow-lg"
        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
      >
        <BookOpen size={16} />
        Chapters
      </button>

      {/* Desktop Sidebar */}
      <aside
        aria-label="Chapter navigation"
        className="hidden lg:flex flex-col flex-shrink-0"
        style={{
          width: 'var(--sidebar-width)',
          height: 'calc(100vh - var(--header-height))',
          position: 'sticky',
          top: 'var(--header-height)',
          borderRight: '1px solid var(--border)',
          background: 'var(--bg-subtle)',
          overflowY: 'auto',
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <aside
            aria-label="Chapter navigation"
            className="lg:hidden fixed left-0 top-0 bottom-0 z-50 animate-slide-in"
            style={{
              width: 'min(var(--sidebar-width), 85vw)',
              background: 'var(--bg-base)',
              borderRight: '1px solid var(--border)',
              boxShadow: 'var(--shadow-elevated)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Drawer Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                Chapters
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close chapter navigation"
                className="w-8 h-8 flex items-center justify-center rounded-lg"
                style={{ background: 'var(--bg-muted)', color: 'var(--text-secondary)' }}
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarContent />
            </div>
          </aside>
        </>
      )}
    </>
  );
}
