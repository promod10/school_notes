import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import type { ContentMeta, FrontMatter, SidebarGroup, TOCItem } from '@/types/content';

const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content');

// ─────────────────────────────────────────────────────────────
// Utility: recursively walk a directory and return .mdx files
// ─────────────────────────────────────────────────────────────
function walkDirectory(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDirectory(fullPath));
    } else if (entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
}

// ─────────────────────────────────────────────────────────────
// pathToSlug: converts absolute file path → slug array
// e.g. /content/school/class-10/science/chem.mdx
//   → ['school', 'class-10', 'science', 'chem']
// ─────────────────────────────────────────────────────────────
function pathToSlug(filePath: string): string[] {
  const relative = path.relative(CONTENT_ROOT, filePath);
  const withoutExt = relative.replace(/\.mdx$/, '');
  return withoutExt.split(path.sep);
}

// ─────────────────────────────────────────────────────────────
// getAllTopics: iterate the full /content directory and return
//              lightweight metadata for every .mdx file
// ─────────────────────────────────────────────────────────────
export async function getAllTopics(): Promise<ContentMeta[]> {
  const files = walkDirectory(CONTENT_ROOT);

  return files.map((filePath) => {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const stats = readingTime(content);

    return {
      slug: pathToSlug(filePath),
      frontmatter: data as FrontMatter,
      readingTime: Math.ceil(stats.minutes),
      filePath,
    };
  });
}

// ─────────────────────────────────────────────────────────────
// getTopicBySlug: compile a single MDX file for rendering
// ─────────────────────────────────────────────────────────────
export async function getTopicBySlug(segments: string[]) {
  const relativePath = path.join(...segments) + '.mdx';
  const filePath = path.join(CONTENT_ROOT, relativePath);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  const compiled = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [
          rehypeKatex,
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: 'wrap',
              properties: {
                className: ['anchor-link'],
                ariaLabel: 'Link to section',
              },
            },
          ],
        ],
      },
    },
    components: {}, // components are injected in MdxRenderer
  });

  return {
    frontmatter: data as FrontMatter,
    content: compiled.content,
    readingTime: Math.ceil(stats.minutes),
    rawContent: content,
  };
}

// ─────────────────────────────────────────────────────────────
// getSubjectTopics: return sidebar items for a given path prefix
// e.g. ['school', 'class-10', 'science']
// ─────────────────────────────────────────────────────────────
export async function getSubjectTopics(
  segments: string[]
): Promise<SidebarGroup[]> {
  const subjectDir = path.join(CONTENT_ROOT, ...segments);
  if (!fs.existsSync(subjectDir)) return [];

  const files = walkDirectory(subjectDir);
  const items = files.map((filePath) => {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);
    const fm = data as FrontMatter;
    const slug = pathToSlug(filePath);
    return {
      title: fm.title,
      slug: slug.join('/'),
      href: '/' + slug.join('/'),
      order: fm.order ?? 999,
    };
  });

  items.sort((a, b) => a.order - b.order);

  return [{ subject: segments[segments.length - 1], items }];
}

// ─────────────────────────────────────────────────────────────
// extractTOC: parse raw MDX content for H2/H3 headings
// ─────────────────────────────────────────────────────────────
export function extractTOC(rawContent: string): TOCItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const toc: TOCItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(rawContent)) !== null) {
    const level = match[1].length as 2 | 3;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    toc.push({ id, text, level });
  }

  return toc;
}

// ─────────────────────────────────────────────────────────────
// generateStaticParams helpers for App Router
// ─────────────────────────────────────────────────────────────
export async function getAllSchoolParams() {
  const all = await getAllTopics();
  return all
    .filter((t) => t.slug[0] === 'school')
    .map((t) => ({
      grade: t.slug[1],
      subject: t.slug[2],
      topic: t.slug[3],
    }));
}

export async function getAllCollegeParams() {
  const all = await getAllTopics();
  return all
    .filter((t) => t.slug[0] === 'college')
    .map((t) => ({
      stream: t.slug[1],
      subject: t.slug[2],
      topic: t.slug[3],
    }));
}
