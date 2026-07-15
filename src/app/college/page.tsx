import type { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, ChevronRight, BarChart3, Briefcase, FlaskConical, Sigma, BookMarked, Atom } from 'lucide-react';

export const metadata: Metadata = {
  title: 'College Notes — BBS & BSc',
  description: 'Free university-level notes for Tribhuvan University affiliated programs. BBS (Business Studies) and BSc (Science) across all 4 years.',
};

const PROGRAMS = [
  {
    stream: 'bbs',
    label: 'BBS (Bachelor of Business Studies)',
    subtitle: 'TU Affiliated · 4 Years',
    years: [
      {
        year: 'bbs-1st-year',
        label: '1st Year',
        subjects: [
          { name: 'Business Mathematics', href: '/college/bbs-1st-year/business-mathematics', icon: Sigma, color: '#6366f1' },
          { name: 'Microeconomics', href: '/college/bbs-1st-year/microeconomics', icon: BarChart3, color: '#f59e0b' },
        ],
      },
      {
        year: 'bbs-4th-year',
        label: '4th Year',
        subjects: [
          { name: 'Financial Analysis', href: '/college/bbs-4th-year/financial-analysis', icon: BarChart3, color: '#10b981' },
          { name: 'Strategic Management', href: '/college/bbs-4th-year/strategic-management', icon: Briefcase, color: '#3b82f6' },
        ],
      },
    ],
  },
  {
    stream: 'bsc',
    label: 'BSc (Bachelor of Science)',
    subtitle: 'TU Affiliated · 4 Years',
    years: [
      {
        year: 'bsc-1st-year',
        label: '1st Year',
        subjects: [
          { name: 'Mathematics', href: '/college/bsc-1st-year/mathematics', icon: Sigma, color: '#8b5cf6' },
          { name: 'Chemistry', href: '/college/bsc-1st-year/chemistry', icon: FlaskConical, color: '#ec4899' },
        ],
      },
      {
        year: 'bsc-2nd-year',
        label: '2nd Year',
        subjects: [
          { name: 'Physics — Wave Optics', href: '/college/bsc-2nd-year/physics', icon: Atom, color: '#3b82f6' },
          { name: 'Statistics', href: '/college/bsc-2nd-year/statistics', icon: BookMarked, color: '#f97316' },
        ],
      },
    ],
  },
];

export default function CollegePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap size={20} style={{ color: 'var(--text-brand)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-brand)' }}>Undergraduate College</span>
        </div>
        <h1 className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
          College Resources
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          University-level notes for TU affiliated BBS and BSc programs with solved past questions and LaTeX equations.
        </p>
      </div>

      {PROGRAMS.map(({ stream, label, subtitle, years }) => (
        <div key={stream} className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{label}</h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--bg-muted)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            >
              {subtitle}
            </span>
          </div>

          {years.map(({ year, label: yearLabel, subjects }) => (
            <div key={year} className="mb-5">
              <h3 className="text-sm font-semibold mb-3 pl-1" style={{ color: 'var(--text-muted)' }}>{yearLabel}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {subjects.map(({ name, href, icon: Icon, color }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 p-4 rounded-xl transition-all duration-150 hover:-translate-y-0.5"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow-card)',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}18`, color }}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{name}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{yearLabel} · TU</div>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
