'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, GraduationCap, Search, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useSearchStore } from '@/lib/search-store';

const NAV_LINKS = [
  { href: '/school', label: 'School', icon: BookOpen, description: 'Class 10 & 12' },
  { href: '/college', label: 'College', icon: GraduationCap, description: 'BBS & BSc' },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openSearch } = useSearchStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileMenuOpen(false), [pathname]);

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [openSearch]);

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        height: 'var(--header-height)',
        backgroundColor: scrolled
          ? 'color-mix(in srgb, var(--bg-base) 85%, transparent)'
          : 'var(--bg-base)',
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 flex-shrink-0 font-bold text-lg"
          style={{ color: 'var(--text-primary)' }}
        >
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            aria-hidden="true"
          >
            CW
          </span>
          <span className="hidden sm:inline">ConceptWeave</span>
        </Link>

        {/* Nav Links */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1 ml-4">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  color: isActive ? 'var(--text-brand)' : 'var(--text-secondary)',
                  background: isActive ? 'color-mix(in srgb, var(--color-brand-500) 10%, transparent)' : 'transparent',
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={15} strokeWidth={2} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search Button */}
        <button
          onClick={openSearch}
          aria-label="Search (Cmd+K)"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-150 cursor-pointer"
          style={{
            background: 'var(--bg-muted)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
            minWidth: '200px',
          }}
        >
          <Search size={14} />
          <span className="flex-1 text-left">Search topics...</span>
          <kbd
            className="text-xs px-1.5 py-0.5 rounded"
            style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          >
            ⌘K
          </kbd>
        </button>

        {/* Mobile Search */}
        <button
          onClick={openSearch}
          aria-label="Search"
          className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg"
          style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          <Search size={16} />
        </button>

        <ThemeToggle />

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg"
          style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t animate-fade-in"
          style={{ background: 'var(--bg-base)', borderColor: 'var(--border)' }}
        >
          <nav aria-label="Mobile navigation" className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
            {NAV_LINKS.map(({ href, label, icon: Icon, description }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                  style={{
                    background: isActive ? 'color-mix(in srgb, var(--color-brand-500) 10%, transparent)' : 'var(--bg-subtle)',
                    color: isActive ? 'var(--text-brand)' : 'var(--text-primary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <Icon size={18} strokeWidth={2} />
                  <div>
                    <div className="font-semibold text-sm">{label}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
