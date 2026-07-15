import type { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TOC } from '@/components/layout/TOC';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import type { SidebarGroup, TOCItem } from '@/types/content';
import { Clock, Calendar } from 'lucide-react';

interface DocsLayoutProps {
  children: ReactNode;
  sidebarGroups: SidebarGroup[];
  tocItems: TOCItem[];
  breadcrumbs: { name: string; href: string }[];
  subject: string;
  frontmatter: {
    title: string;
    description: string;
    date: string;
    level: string;
    readingTime?: number;
  };
}

export function DocsLayout({
  children,
  sidebarGroups,
  tocItems,
  breadcrumbs,
  subject,
  frontmatter,
}: DocsLayoutProps) {
  return (
    <div
      className="flex min-h-[calc(100vh-var(--header-height))]"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Left: Collapsible Sidebar */}
      <Sidebar groups={sidebarGroups} subject={subject} />

      {/* Center: Article Content */}
      <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-8 xl:py-10">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs segments={breadcrumbs} />

          {/* Article Header */}
          <header className="mb-8">
            {/* Level badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
              style={{
                background: 'color-mix(in srgb, var(--color-brand-500) 12%, transparent)',
                color: 'var(--text-brand)',
                border: '1px solid color-mix(in srgb, var(--color-brand-500) 25%, transparent)',
              }}>
              {frontmatter.level.replace(/-/g, ' ').toUpperCase()}
            </div>

            <h1
              className="text-3xl sm:text-4xl font-black leading-tight tracking-tight mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              {frontmatter.title}
            </h1>

            <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              {frontmatter.description}
            </p>

            {/* Meta row */}
            <div className="flex items-center gap-4 text-xs flex-wrap" style={{ color: 'var(--text-muted)' }}>
              {frontmatter.readingTime && (
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  {frontmatter.readingTime} min read
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar size={12} />
                {new Date(frontmatter.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            <hr className="mt-6" style={{ borderColor: 'var(--border)' }} />
          </header>

          {/* MDX Content */}
          {children}

          {/* Bottom navigation hint */}
          <div
            className="mt-12 pt-6 border-t text-xs"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            <p>Found an error? <a href="https://github.com/conceptweave/content" style={{ color: 'var(--text-brand)' }}>Contribute on GitHub</a></p>
          </div>
        </div>
      </div>

      {/* Right: Table of Contents */}
      <TOC items={tocItems} />
    </div>
  );
}
