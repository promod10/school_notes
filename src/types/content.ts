// ============================================================
// ConceptWeave — Content Type Definitions
// ============================================================

// --------------- Frontmatter ---------------

export interface FrontMatter {
  title: string;
  description: string;
  subject: string;
  level: 'class-8' | 'class-9' | 'class-10' | 'class-12' | 'bbs-1st-year' | 'bbs-2nd-year' | 'bbs-3rd-year' | 'bbs-4th-year' | 'bsc-1st-year' | 'bsc-2nd-year' | 'bsc-3rd-year';
  date: string;
  keywords: string[];
  author?: string;
  readingTime?: number; // calculated, in minutes
  order?: number;       // sidebar sort order
}

export interface ContentMeta {
  slug: string[];          // URL segments, e.g. ['school', 'class-10', 'science', 'chemical-reactions']
  frontmatter: FrontMatter;
  readingTime: number;
  filePath: string;
}

// --------------- MDX Rendering ---------------

export interface TOCItem {
  id: string;
  text: string;
  level: 2 | 3;
}

// --------------- Quiz Engine ---------------

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint?: string;
}

export interface QuizProps {
  title?: string;
  questions: MCQQuestion[];
}

export type QuizAnswerState = {
  selectedIndex: number | null;
  submitted: boolean;
};

// --------------- Sidebar Tree ---------------

export interface SidebarItem {
  title: string;
  slug: string;
  href: string;
  order: number;
}

export interface SidebarGroup {
  subject: string;
  items: SidebarItem[];
}

// --------------- SEO / JSON-LD ---------------

export interface CourseSchemaInput {
  name: string;
  description: string;
  url: string;
  subject: string;
  educationalLevel: string;
  keywords: string[];
}

export interface FAQSchemaInput {
  questions: MCQQuestion[];
}

export interface BreadcrumbSchemaInput {
  segments: { name: string; href: string }[];
}
