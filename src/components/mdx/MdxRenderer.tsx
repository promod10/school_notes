import { compileMDX } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { CodeBlock } from '@/components/mdx/CodeBlock';
import { QuizLoader } from '@/components/mdx/QuizLoader';
import type { MCQQuestion } from '@/types/content';

// ─── Custom MDX component overrides ───────────────────────────────────────
const MDX_COMPONENTS = {
  // Code blocks: pipe className through to CodeBlock
  pre: (props: React.ComponentPropsWithoutRef<'pre'>) => {
    // Extract the first child <code> element's className (language-xxx)
    const codeChild = (props.children as React.ReactElement<{ className?: string; children?: React.ReactNode }>);
    const lang = codeChild?.props?.className?.replace('language-', '') ?? 'text';

    return (
      <CodeBlock className={codeChild?.props?.className} language={lang}>
        {codeChild?.props?.children}
      </CodeBlock>
    );
  },

  // Inline code — styled via CSS
  code: (props: React.ComponentPropsWithoutRef<'code'>) => <code {...props} />,

  // QuizLoader — string-based prop bridge for the RSC boundary
  QuizLoader: ({ title, questionsJson }: { title?: string; questionsJson: string }) => (
    <QuizLoader title={title} questionsJson={questionsJson} />
  ),

  // QuizEngine — direct component (for backwards compat)
  QuizEngine: ({ title, questions }: { title?: string; questions: MCQQuestion[] }) => (
    <QuizLoader title={title} questionsJson={JSON.stringify(questions ?? [])} />
  ),

  // Tables — wrapped for horizontal scroll on mobile
  table: (props: React.ComponentPropsWithoutRef<'table'>) => (
    <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
      <table {...props} />
    </div>
  ),

  // Images — next/image would require domain config; use plain <img> with lazy loading
  img: (props: React.ComponentPropsWithoutRef<'img'>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      loading="lazy"
      style={{ maxWidth: '100%', height: 'auto', borderRadius: 'var(--radius)' }}
      alt={props.alt ?? ''}
    />
  ),
};

// ─── MdxRenderer: Server Component ────────────────────────────────────────
interface MdxRendererProps {
  source: string;
}

export async function MdxRenderer({ source }: MdxRendererProps) {
  const { content } = await compileMDX({
    source,
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
    components: MDX_COMPONENTS,
  });

  return (
    <article
      className="prose"
      style={{ maxWidth: '72ch', width: '100%' }}
    >
      {content}
    </article>
  );
}
