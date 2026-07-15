import Link from 'next/link';
import { BookOpen, GraduationCap, ExternalLink, Mail, Link2 } from 'lucide-react';

const FOOTER_LINKS = {
  School: [
    { label: 'Class 10 Science', href: '/school/class-10/science' },
    { label: 'Class 10 Mathematics', href: '/school/class-10/mathematics' },
    { label: 'Class 12 Physics', href: '/school/class-12/physics' },
    { label: 'Class 12 Chemistry', href: '/school/class-12/chemistry' },
  ],
  College: [
    { label: 'BBS Financial Analysis', href: '/college/bbs-4th-year/financial-analysis' },
    { label: 'BSc Wave Optics', href: '/college/bsc-2nd-year/physics' },
    { label: 'BBS 1st Year Basics', href: '/college/bbs-1st-year/business-mathematics' },
    { label: 'BSc Mathematics', href: '/college/bsc-1st-year/mathematics' },
  ],
  Resources: [
    { label: 'About ConceptWeave', href: '/about' },
    { label: 'Contribute Content', href: '/contribute' },
    { label: 'Study Tips Blog', href: '/blog' },
    { label: 'Accessibility', href: '/accessibility' },
  ],
};

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t mt-auto"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-subtle)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3 w-fit">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                CW
              </span>
              <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>ConceptWeave</span>
            </Link>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
              Free, open educational resources for students in Nepal and beyond. Study smarter, not harder.
            </p>
            <div className="flex items-center gap-2">
              {[
                { icon: Link2, href: 'https://github.com', label: 'GitHub' },
                { icon: ExternalLink, href: 'https://twitter.com', label: 'Twitter' },
                { icon: Mail, href: 'mailto:hello@conceptweave.edu.np', label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                  style={{ background: 'var(--bg-muted)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Groups */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                {heading}
              </h3>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-10 pt-6 border-t text-xs"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          <p>© {new Date().getFullYear()} ConceptWeave. Open source & free forever.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-current transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-current transition-colors">Terms</Link>
            <span className="flex items-center gap-1">
              <BookOpen size={12} />
              School
              <GraduationCap size={12} className="ml-1" />
              College
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
