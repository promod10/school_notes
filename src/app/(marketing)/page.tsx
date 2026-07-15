import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  GraduationCap,
  Zap,
  Shield,
  Search,
  ChevronRight,
  Atom,
  Calculator,
  FlaskConical,
  BarChart3,
  BookMarked,
  Sigma,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'ConceptWeave — Learn Smarter, Not Harder',
  description:
    'Free, SEO-optimized tutorial and practice portal for Secondary School (Class 10/12) and Undergraduate College (BBS/BSc) students. Interactive quizzes, LaTeX math, and instant search.',
  openGraph: {
    title: 'ConceptWeave — Educational Portal for Nepal Students',
    description: 'Master Class 10, Class 12, BBS, and BSc subjects with expert notes, interactive quizzes, and zero ads.',
    url: 'https://conceptweave.edu.np',
  },
};

const SCHOOL_SUBJECTS = [
  { icon: Atom, label: 'Science', href: '/school/class-10/science', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  { icon: Calculator, label: 'Mathematics', href: '/school/class-10/mathematics', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  { icon: BookMarked, label: 'English', href: '/school/class-10/english', color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
  { icon: Sigma, label: 'Statistics', href: '/school/class-12/statistics', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
];

const COLLEGE_SUBJECTS = [
  { icon: BarChart3, label: 'Financial Analysis', href: '/college/bbs-4th-year/financial-analysis', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { icon: FlaskConical, label: 'Wave Optics', href: '/college/bsc-2nd-year/physics', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  { icon: Calculator, label: 'Business Math', href: '/college/bbs-1st-year/business-mathematics', color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  { icon: Sigma, label: 'Calculus', href: '/college/bsc-1st-year/mathematics', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant Search',
    description: 'Cmd+K to search thousands of notes with zero latency. No backend, no loading spinners.',
    color: '#f59e0b',
  },
  {
    icon: Shield,
    title: 'Interactive Quizzes',
    description: 'Self-grading MCQs embedded directly in notes for active recall and spaced repetition.',
    color: '#10b981',
  },
  {
    icon: Search,
    title: 'Math & Code Ready',
    description: 'LaTeX math equations and syntax-highlighted code blocks render perfectly on every device.',
    color: '#6366f1',
  },
];

const STATS = [
  { value: '500+', label: 'Topic Notes' },
  { value: '2,000+', label: 'Practice Questions' },
  { value: '100%', label: 'Free Forever' },
  { value: '4', label: 'Academic Streams' },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero Section ── */}
      <section
        className="relative overflow-hidden"
        style={{ paddingTop: '6rem', paddingBottom: '6rem' }}
      >
        {/* Mesh gradient background */}
        <div className="absolute inset-0 gradient-mesh pointer-events-none" aria-hidden="true" />

        {/* Decorative circles */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1, #8b5cf6)' }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-15"
          style={{ background: 'radial-gradient(circle, #f59e0b, #ef4444)' }}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6 animate-fade-in"
            style={{
              background: 'color-mix(in srgb, #6366f1 12%, transparent)',
              color: '#6366f1',
              border: '1px solid color-mix(in srgb, #6366f1 30%, transparent)',
            }}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            Free Educational Resources · Class 10 to College
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-none mb-6 animate-fade-in"
            style={{ color: 'var(--text-primary)', animationDelay: '0.1s' }}
          >
            Learn Smarter,
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #ec4899 80%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Not Harder
            </span>
          </h1>

          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in"
            style={{ color: 'var(--text-secondary)', animationDelay: '0.2s' }}
          >
            Expert notes, interactive quizzes, and LaTeX math — for Secondary School
            students (Class 10 &amp; 12) and Undergraduates (BBS &amp; BSc). Zero ads, always free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16 animate-fade-in"
            style={{ animationDelay: '0.3s' }}>
            <Link
              href="/school"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}
            >
              <BookOpen size={18} />
              Browse School Notes
              <ChevronRight size={16} />
            </Link>
            <Link
              href="/college"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: 'var(--bg-muted)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              }}
            >
              <GraduationCap size={18} />
              College Resources
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: '0.4s' }}>
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className="glass-card p-4 text-center"
              >
                <div className="text-2xl font-black" style={{ color: 'var(--text-brand)' }}>{value}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stream Selector ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Choose Your Stream
          </h2>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Curated content organized by curriculum level and subject.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* School Card */}
          <StreamCard
            icon={BookOpen}
            title="Secondary School"
            subtitle="Class 10 & 12 · SEE & NEB Curriculum"
            description="Comprehensive notes, solved examples, and MCQ quizzes covering Science, Mathematics, English, Social Studies, and more — aligned to the National Examination Board curriculum."
            href="/school"
            subjects={SCHOOL_SUBJECTS}
            gradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
            accentColor="#6366f1"
          />

          {/* College Card */}
          <StreamCard
            icon={GraduationCap}
            title="Undergraduate College"
            subtitle="BBS & BSc · TU Affiliated Programs"
            description="University-level notes for Tribhuvan University affiliated programs. BBS (Business Studies) and BSc (Science) across all 4 years with solved past questions and LaTeX equations."
            href="/college"
            subjects={COLLEGE_SUBJECTS}
            gradient="linear-gradient(135deg, #10b981, #3b82f6)"
            accentColor="#10b981"
          />
        </div>
      </section>

      {/* ── Features Section ── */}
      <section
        className="py-20"
        style={{ background: 'var(--bg-subtle)' }}
        aria-labelledby="features-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="features-heading" className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Built for Deep Learning
            </h2>
            <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
              Every feature is designed to transform passive reading into active understanding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, description, color }) => (
              <div
                key={title}
                className="glass-card p-6 transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${color}18`, color }}
                >
                  <Icon size={22} strokeWidth={2} />
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className="rounded-2xl p-10 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
          }}
        >
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} aria-hidden="true" />
          <div className="relative">
            <h2 className="text-3xl font-black text-white mb-4">Start Learning Today</h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto">
              Join thousands of students acing their exams with ConceptWeave. Free forever.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/school"
                className="px-6 py-3 rounded-xl font-semibold bg-white transition-all duration-200 hover:scale-105"
                style={{ color: '#4f46e5' }}
              >
                Explore School Notes
              </Link>
              <Link
                href="/college"
                className="px-6 py-3 rounded-xl font-semibold border border-white/40 text-white transition-all duration-200 hover:bg-white/10"
              >
                College Resources
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ── Sub-component: Stream Card ──────────────────────────────────────────────
interface SubjectLink { icon: React.ComponentType<{ size?: number; color?: string }>; label: string; href: string; color: string; bg: string; }

function StreamCard({
  icon: Icon,
  title,
  subtitle,
  description,
  href,
  subjects,
  gradient,
  accentColor,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  subjects: SubjectLink[];
  gradient: string;
  accentColor: string;
}) {
  return (
    <div
      className="glass-card overflow-hidden transition-all duration-300 hover:-translate-y-1 group"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      {/* Header Bar */}
      <div className="p-6 relative" style={{ background: gradient }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} aria-hidden="true" />
        <div className="relative flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
            <Icon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="text-white/70 text-sm">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>

        {/* Quick subject links */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {subjects.map(({ icon: SubIcon, label, href: subHref, color, bg }) => (
            <Link
              key={subHref}
              href={subHref}
              className="flex items-center gap-2 p-2.5 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-[1.02]"
              style={{ background: bg, color }}
            >
              <SubIcon size={14} color={color} />
              {label}
            </Link>
          ))}
        </div>

        <Link
          href={href}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90"
          style={{ background: accentColor, color: '#fff' }}
        >
          Explore All Topics
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
