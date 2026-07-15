import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocsLayout } from '@/components/layout/DocsLayout';
import { MdxRenderer } from '@/components/mdx/MdxRenderer';
import {
  getTopicBySlug,
  getAllCollegeParams,
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

export async function generateStaticParams() {
  return getAllCollegeParams();
}

interface PageProps {
  params: Promise<{
    stream: string;
    subject: string;
    topic: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { stream, subject, topic } = await params;
  const data = await getTopicBySlug(['college', stream, subject, topic]);

  if (!data) return { title: 'Not Found' };

  const { frontmatter } = data;
  const canonicalUrl = `${SITE_URL}/college/${stream}/${subject}/${topic}`;
  const ogTitle = `${frontmatter.title} | ${stream.replace(/-/g, ' ')} | ConceptWeave`;

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
    alternates: { canonical: canonicalUrl },
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

export default async function CollegeTopicPage({ params }: PageProps) {
  const { stream, subject, topic } = await params;
  const data = await getTopicBySlug(['college', stream, subject, topic]);

  if (!data) notFound();

  const { frontmatter, rawContent, readingTime } = data;

  const sidebarGroups = await getSubjectTopics(['college', stream, subject]);
  const tocItems = extractTOC(rawContent);

  const breadcrumbs = [
    { name: 'college', href: '/college' },
    { name: stream, href: `/college/${stream}` },
    { name: subject, href: `/college/${stream}/${subject}` },
    { name: topic, href: `/college/${stream}/${subject}/${topic}` },
  ];

  const canonicalUrl = `${SITE_URL}/college/${stream}/${subject}/${topic}`;

  const courseSchema = generateCourseSchema({
    name: frontmatter.title,
    description: frontmatter.description,
    url: canonicalUrl,
    subject: frontmatter.subject,
    educationalLevel: stream.replace(/-/g, ' '),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schemas) }}
      />
      <DocsLayout
        sidebarGroups={sidebarGroups}
        tocItems={tocItems}
        breadcrumbs={breadcrumbs}
        subject={`${stream} / ${subject}`}
        frontmatter={{ ...frontmatter, readingTime }}
      >
        <MdxRenderer source={rawContent} />
      </DocsLayout>
    </>
  );
}
