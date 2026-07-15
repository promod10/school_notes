import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import type { BreadcrumbSchemaInput } from '@/types/content';

interface BreadcrumbsProps {
  segments: { name: string; href: string }[];
}

function capitalize(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function Breadcrumbs({ segments }: BreadcrumbsProps) {
  // Build JSON-LD BreadcrumbList
  const jsonLd: BreadcrumbSchemaInput = { segments };
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://conceptweave.edu.np',
      },
      ...segments.map((seg, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: capitalize(seg.name),
        item: `https://conceptweave.edu.np${seg.href}`,
      })),
    ],
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Visual Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 flex-wrap mb-6">
        <Link
          href="/"
          className="flex items-center gap-1 text-sm transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <Home size={13} />
          <span className="sr-only">Home</span>
        </Link>

        {segments.map((seg, idx) => {
          const isLast = idx === segments.length - 1;
          return (
            <span key={seg.href} className="flex items-center gap-1">
              <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
              {isLast ? (
                <span
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-primary)' }}
                  aria-current="page"
                >
                  {capitalize(seg.name)}
                </span>
              ) : (
                <Link
                  href={seg.href}
                  className="text-sm transition-colors hover:underline"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {capitalize(seg.name)}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
