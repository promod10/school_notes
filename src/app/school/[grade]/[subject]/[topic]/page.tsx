import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocsLayout } from '@/components/layout/DocsLayout';
import { MdxRenderer } from '@/components/mdx/MdxRenderer';
import {
  getTopicBySlug,
  getAllSchoolParams,
  getSubjectTopics,
  extractTOC,
} from '@/lib/mdx';
import {
  generateCourseSchema,
  generateFAQSchema,
  generateWebPageSchema,
  serializeJsonLd,
} from '@/lib/seo';

const SITE_URL = 'https://conceptweave.edu.np';

// ── Static params for all school topics ─────────────────────────────────────
export async function generateStaticParams() {
  return getAllSchoolParams();
}

// ── Page props type ──────────────────────────────────────────────────────────
interface PageProps {
  params: Promise<{
    grade: string;
    subject: string;
    topic: string;
  }>;
}

// ── Dynamic Metadata ─────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { grade, subject, topic } = await params;
  const data = await getTopicBySlug(['school', grade, subject, topic]);

  if (!data) return { title: 'Not Found' };

  const { frontmatter } = data;
  const canonicalUrl = `${SITE_URL}/school/${grade}/${subject}/${topic}`;
  const ogTitle = `${frontmatter.title} | ${grade.replace(/-/g, ' ')} ${subject} | ConceptWeave`;

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle,
      description: frontmatter.description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: frontmatter.date,
      tags: frontmatter.keywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: frontmatter.description,
    },
  };
}

// ── Page Component ────────────────────────────────────────────────────────────
export default async function SchoolTopicPage({ params }: PageProps) {
  const { grade, subject, topic } = await params;
  const data = await getTopicBySlug(['school', grade, subject, topic]);

  if (!data) notFound();

  const { frontmatter, rawContent, readingTime } = data;

  // Sidebar: load sibling topics in this subject
  const sidebarGroups = await getSubjectTopics(['school', grade, subject]);

  // TOC: parse headings from raw MDX
  const tocItems = extractTOC(rawContent);

  // Breadcrumbs
  const breadcrumbs = [
    { name: 'school', href: '/school' },
    { name: grade, href: `/school/${grade}` },
    { name: subject, href: `/school/${grade}/${subject}` },
    { name: topic, href: `/school/${grade}/${subject}/${topic}` },
  ];

  const canonicalUrl = `${SITE_URL}/school/${grade}/${subject}/${topic}`;

  // JSON-LD Schemas
  const courseSchema = generateCourseSchema({
    name: frontmatter.title,
    description: frontmatter.description,
    url: canonicalUrl,
    subject: frontmatter.subject,
    educationalLevel: grade.replace(/-/g, ' '),
    keywords: frontmatter.keywords,
  });

  const webPageSchema = generateWebPageSchema({
    title: frontmatter.title,
    description: frontmatter.description,
    url: canonicalUrl,
    datePublished: frontmatter.date,
  });

  const schemas: object[] = [courseSchema, webPageSchema];

  return (
    <>
      {/* JSON-LD injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schemas) }}
      />

      <DocsLayout
        sidebarGroups={sidebarGroups}
        tocItems={tocItems}
        breadcrumbs={breadcrumbs}
        subject={`${grade} / ${subject}`}
        frontmatter={{ ...frontmatter, readingTime }}
      >
        <MdxRenderer source={rawContent} />
      </DocsLayout>
    </>
  );
}
