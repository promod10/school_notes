import type { CourseSchemaInput, FAQSchemaInput, BreadcrumbSchemaInput } from '@/types/content';

const SITE_URL = 'https://conceptweave.edu.np';

// ─────────────────────────────────────────────────────────────────────────────
// Course Schema (identifies educational notes as curriculum content)
// https://schema.org/Course
// ─────────────────────────────────────────────────────────────────────────────
export function generateCourseSchema(input: CourseSchemaInput): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: input.name,
    description: input.description,
    url: input.url,
    educationalLevel: input.educationalLevel,
    about: {
      '@type': 'Thing',
      name: input.subject,
    },
    keywords: input.keywords.join(', '),
    provider: {
      '@type': 'Organization',
      name: 'ConceptWeave',
      url: SITE_URL,
      sameAs: ['https://github.com/conceptweave'],
    },
    isAccessibleForFree: true,
    inLanguage: 'en',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQPage Schema — extracted from QuizEngine questions
// Appears as expandable Q&A dropdowns in Google Search results
// https://schema.org/FAQPage
// ─────────────────────────────────────────────────────────────────────────────
export function generateFAQSchema(input: FAQSchemaInput): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: input.questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${q.options[q.correctAnswerIndex]}. ${q.explanation}`,
      },
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BreadcrumbList Schema
// https://schema.org/BreadcrumbList
// ─────────────────────────────────────────────────────────────────────────────
export function generateBreadcrumbSchema(input: BreadcrumbSchemaInput): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      ...input.segments.map((seg, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: seg.name
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' '),
        item: `${SITE_URL}${seg.href}`,
      })),
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// WebPage Schema for article pages
// https://schema.org/WebPage
// ─────────────────────────────────────────────────────────────────────────────
export function generateWebPageSchema(input: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: input.title,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    publisher: {
      '@type': 'Organization',
      name: 'ConceptWeave',
      url: SITE_URL,
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'ConceptWeave',
      url: SITE_URL,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility: Serialize multiple JSON-LD objects into <script> tag content
// ─────────────────────────────────────────────────────────────────────────────
export function serializeJsonLd(schemas: object[]): string {
  if (schemas.length === 1) return JSON.stringify(schemas[0]);
  return JSON.stringify(schemas);
}
