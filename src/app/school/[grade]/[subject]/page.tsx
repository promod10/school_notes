import { getSubjectTopics, getAllSchoolParams } from '@/lib/mdx';
import Link from 'next/link';
import { ChevronRight, FileText } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const allParams = await getAllSchoolParams();
  
  const unique = new Set<string>();
  const params: { grade: string; subject: string }[] = [];
  
  for (const p of allParams) {
    const key = `${p.grade}-${p.subject}`;
    if (!unique.has(key)) {
      unique.add(key);
      params.push({ grade: p.grade, subject: p.subject });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ grade: string; subject: string }>;
}): Promise<Metadata> {
  const { grade, subject } = await params;
  
  return {
    title: `${subject.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} | ${grade.replace(/-/g, ' ').toUpperCase()}`,
    description: `Study materials and notes for ${grade.replace(/-/g, ' ')} ${subject.replace(/-/g, ' ')}.`,
  };
}

export default async function SchoolSubjectPage({
  params,
}: {
  params: Promise<{ grade: string; subject: string }>;
}) {
  const { grade, subject } = await params;
  const groups = await getSubjectTopics(['school', grade, subject]);
  
  const breadcrumbs = [
    { name: 'school', href: '/school' },
    { name: grade, href: `/school/${grade}` },
    { name: subject, href: `/school/${grade}/${subject}` },
  ];

  const items = groups[0]?.items || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-var(--header-height))]">
      <Breadcrumbs segments={breadcrumbs} />
      
      <div className="mb-10">
        <h1 className="text-3xl font-black mb-2 capitalize" style={{ color: 'var(--text-primary)' }}>
          {subject.replace(/-/g, ' ')}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }} className="capitalize">
          {grade.replace(/-/g, ' ')} curriculum notes and resources.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="p-8 text-center rounded-xl" style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-muted)' }}>No topics found for this subject yet.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 p-4 rounded-xl transition-all duration-150 hover:-translate-y-0.5"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'color-mix(in srgb, var(--color-brand-500) 10%, transparent)', color: 'var(--text-brand)' }}
              >
                <FileText size={20} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>{item.title}</div>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
