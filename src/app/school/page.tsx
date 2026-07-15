import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ChevronRight, Atom, Calculator, BookMarked, FlaskConical, Sigma, Globe, Briefcase, LineChart, Monitor } from 'lucide-react';

export const metadata: Metadata = {
  title: 'School Notes — Class 10 & 12',
  description: 'Free, expert notes for Secondary School students. Class 10 SEE preparation and Class 12 NEB curriculum — Science, Mathematics, English, and more.',
};

const GRADES = [
  {
    grade: 'class-8',
    label: 'Class 8',
    subtitle: 'BLE Preparation',
    subjects: [
      { name: 'Science', href: '/school/class-8/science', icon: Atom, color: '#6366f1' },
      { name: 'Compulsory Mathematics', href: '/school/class-8/compulsory-mathematics', icon: Calculator, color: '#8b5cf6' },
      { name: 'Optional Mathematics', href: '/school/class-8/optional-mathematics', icon: Sigma, color: '#ec4899' },
      { name: 'Accounting/Office Management', href: '/school/class-8/accounting', icon: Briefcase, color: '#10b981' },
      { name: 'Economics', href: '/school/class-8/economics', icon: LineChart, color: '#f59e0b' },
      { name: 'Social Studies', href: '/school/class-8/social-studies', icon: Globe, color: '#3b82f6' },
      { name: 'Computer Science', href: '/school/class-8/computer-science', icon: Monitor, color: '#8b5cf6' },
    ],
  },
  {
    grade: 'class-9',
    label: 'Class 9',
    subtitle: 'Secondary Curriculum',
    subjects: [
      { name: 'Science', href: '/school/class-9/science', icon: Atom, color: '#6366f1' },
      { name: 'Compulsory Mathematics', href: '/school/class-9/compulsory-mathematics', icon: Calculator, color: '#8b5cf6' },
      { name: 'Optional Mathematics', href: '/school/class-9/optional-mathematics', icon: Sigma, color: '#ec4899' },
      { name: 'Accounting/Office Management', href: '/school/class-9/accounting', icon: Briefcase, color: '#10b981' },
      { name: 'Economics', href: '/school/class-9/economics', icon: LineChart, color: '#f59e0b' },
      { name: 'Social Studies', href: '/school/class-9/social-studies', icon: Globe, color: '#3b82f6' },
      { name: 'Computer Science', href: '/school/class-9/computer-science', icon: Monitor, color: '#8b5cf6' },
    ],
  },
  {
    grade: 'class-10',
    label: 'Class 10',
    subtitle: 'SEE Preparation',
    subjects: [
      { name: 'Science', href: '/school/class-10/science', icon: Atom, color: '#6366f1' },
      { name: 'Compulsory Mathematics', href: '/school/class-10/compulsory-mathematics', icon: Calculator, color: '#8b5cf6' },
      { name: 'Optional Mathematics', href: '/school/class-10/optional-mathematics', icon: Sigma, color: '#ec4899' },
      { name: 'Accounting/Office Management', href: '/school/class-10/accounting', icon: Briefcase, color: '#10b981' },
      { name: 'Economics', href: '/school/class-10/economics', icon: LineChart, color: '#f59e0b' },
      { name: 'Social Studies', href: '/school/class-10/social-studies', icon: Globe, color: '#3b82f6' },
      { name: 'Computer Science', href: '/school/class-10/computer-science', icon: Monitor, color: '#8b5cf6' },
    ],
  },
  {
    grade: 'class-12',
    label: 'Class 12',
    subtitle: 'NEB Curriculum',
    subjects: [
      { name: 'Physics', href: '/school/class-12/physics', icon: Atom, color: '#3b82f6' },
      { name: 'Chemistry', href: '/school/class-12/chemistry', icon: FlaskConical, color: '#10b981' },
      { name: 'Mathematics', href: '/school/class-12/mathematics', icon: Sigma, color: '#8b5cf6' },
      { name: 'Biology', href: '/school/class-12/biology', icon: BookMarked, color: '#f97316' },
    ],
  },
];

export default function SchoolPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={20} style={{ color: 'var(--text-brand)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-brand)' }}>Secondary School</span>
        </div>
        <h1 className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
          School Notes
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Expert notes for Class 10 (SEE) and Class 12 (NEB) students — aligned to the national curriculum.
        </p>
      </div>

      {GRADES.map(({ grade, label, subtitle, subjects }) => (
        <div key={grade} className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{label}</h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--bg-muted)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            >
              {subtitle}
            </span>
          </div>
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
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label} · NEB</div>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
