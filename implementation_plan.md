# ConceptWeave — Master Implementation Plan

A full-stack Next.js 15 App Router educational portal for Secondary School (Class 10/12) and Undergraduate College (BBS/BSc) students. Production-ready, SEO-optimized, and Lighthouse 100/100 targeted.

---

## Architecture Overview

```
conceptweave/
├── src/
│   ├── app/
│   │   ├── (marketing)/page.tsx           # Landing page — Stream Selector
│   │   ├── school/[grade]/[subject]/[topic]/page.tsx
│   │   ├── college/[stream]/[subject]/[topic]/page.tsx
│   │   ├── sitemap.ts                     # Programmatic sitemap
│   │   ├── robots.ts
│   │   └── layout.tsx                     # Root layout w/ ThemeProvider
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx                # 'use client'
│   │   │   ├── TOC.tsx                    # 'use client' — IntersectionObserver
│   │   │   ├── DocsLayout.tsx
│   │   │   └── Breadcrumbs.tsx
│   │   ├── mdx/
│   │   │   ├── MdxRenderer.tsx
│   │   │   ├── CodeBlock.tsx              # Shiki + copy button ('use client')
│   │   │   └── QuizEngine.tsx             # 'use client'
│   │   └── ui/
│   │       ├── SearchModal.tsx            # 'use client' — Cmd+K
│   │       ├── ThemeToggle.tsx            # 'use client'
│   │       └── [shadcn components]
│   ├── content/
│   │   ├── school/
│   │   │   ├── class-10/science/chemical-reactions.mdx
│   │   │   └── class-12/mathematics/calculus-derivatives.mdx
│   │   └── college/
│   │       ├── bbs-4th-year/financial-analysis/ratio-analysis.mdx
│   │       └── bsc-2nd-year/physics/wave-optics.mdx
│   ├── lib/
│   │   ├── mdx.ts                         # Content loader + frontmatter parser
│   │   └── seo.ts                         # JSON-LD generators
│   └── types/
│       └── content.ts                     # Frontmatter + Quiz interfaces
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router, TypeScript strict) |
| Styling | Tailwind CSS v4 + custom design tokens |
| Components | Shadcn UI + Radix primitives |
| Icons | lucide-react |
| Theme | next-themes (no hydration flash) |
| Content | next-mdx-remote/rsc (Server Components) |
| Highlighting | Shiki (server-side) |
| Math | remark-math + rehype-katex |
| Search | Pagefind (post-build WASM indexer) |
| SEO | next/seo + JSON-LD (Course, FAQPage schemas) |

---

## Phase Execution Plan

### Phase 1 — Scaffolding & Architecture

#### [NEW] `conceptweave/` (project root)
- Init Next.js 15 with `--app --ts --tailwind --src-dir --eslint`
- Install: `next-themes`, `lucide-react`, shadcn UI, `class-variance-authority`, `clsx`, `tailwind-merge`
- Configure `tsconfig.json` with `strict: true`, path aliases

#### [NEW] `src/app/layout.tsx`
- Root layout with `ThemeProvider` (next-themes), font loading (Geist Sans/Mono via `next/font`)
- `SearchModal` portal, skip-to-content link for a11y
- KaTeX CSS import

#### [NEW] `src/app/(marketing)/page.tsx`
- Hero section with animated gradient
- Two stream cards: **School** (Class 10/12) and **College** (BBS/BSc)
- Subject grid previews

---

### Phase 2 — MDX Content Pipeline

#### [NEW] `src/types/content.ts`
Full TypeScript interfaces: `FrontMatter`, `MCQQuestion`, `QuizProps`, `ContentMeta`, `TOCItem`

#### [NEW] `src/lib/mdx.ts`
- `getAllTopics(contentPath)` — recursively walks `/content` dir
- `getTopicBySlug(segments)` — reads and compiles a single `.mdx` file
- `calculateReadingTime(content)` — word-count based
- Configured with `remark-math`, `rehype-katex`, `rehype-slug`, `rehype-autolink-headings`

#### [NEW] `src/components/mdx/MdxRenderer.tsx`
- Server Component wrapping `next-mdx-remote/rsc`
- Passes `CodeBlock` and `QuizEngine` as custom components

#### [NEW] `src/components/mdx/CodeBlock.tsx` (`'use client'`)
- Receives pre-highlighted HTML from Shiki (server-rendered)
- Injects language badge + animated copy button

#### Sample content files (2–3 `.mdx` files with math + code + quizzes)

---

### Phase 3 — Documentation Workspace UI

#### [NEW] `src/components/layout/Sidebar.tsx` (`'use client'`)
- Hierarchical tree from filesystem structure
- Auto-expand active chapter, persist scroll with `sessionStorage`
- Mobile: slides in as a drawer (`<dialog>`)

#### [NEW] `src/components/layout/TOC.tsx` (`'use client'`)
- Extracts headings from rendered page via `querySelectorAll`
- `IntersectionObserver` highlights active heading
- Smooth-scroll on click

#### [NEW] `src/components/layout/Breadcrumbs.tsx`
- Server Component, parses `params` into capitalized segments
- Injects `BreadcrumbList` JSON-LD

#### [NEW] `src/components/layout/DocsLayout.tsx`
- 3-column CSS Grid: Sidebar (280px) | Article (fluid) | TOC (240px)
- Mobile: sidebar hidden behind hamburger, TOC collapses to top drawer
- `<main>` landmark, proper heading hierarchy

---

### Phase 4 — Interactive Assessment Engine

#### [NEW] `src/components/mdx/QuizEngine.tsx` (`'use client'`)
- Accepts `MCQQuestion[]` prop
- State machine: `idle → answering → submitted → reset`
- Option selection with keyboard support (arrow keys + Enter)
- Submit button → locks options, green/red highlighting, reveals explanations
- Score banner with emoji feedback
- "Reset Quiz" clears all state

---

### Phase 5 — Instant Search Infrastructure

#### [NEW] `src/components/ui/SearchModal.tsx` (`'use client'`)
- Shadcn `<Command />` palette triggered by `Cmd+K` / `Ctrl+K`
- `useEffect` dynamically loads Pagefind WASM bundle post-build
- Groups results by School / College stream
- Keyword highlighting in snippets
- Keyboard navigation, `Enter` routes to result

#### [MODIFY] `package.json`
- `"postbuild": "npx pagefind --site .next/server/app --output-path public/pagefind"`

---

### Phase 6 — SEO Suite

#### [NEW] `src/lib/seo.ts`
- `generateCourseSchema(meta)` → Course JSON-LD
- `generateFAQSchema(questions)` → FAQPage JSON-LD from QuizEngine questions
- `generateBreadcrumbSchema(segments)` → BreadcrumbList JSON-LD

#### [MODIFY] `src/app/school/[grade]/[subject]/[topic]/page.tsx`
- `generateStaticParams()` iterates all MDX files
- `generateMetadata()` pulls frontmatter for OG tags, canonical URL, description
- Injects JSON-LD `<script>` blocks as Server Components

#### [NEW] `src/app/sitemap.ts`
- Walks `/content` recursively, outputs `MetadataRoute.Sitemap` with `lastModified`, `priority`, `changeFrequency`

#### [NEW] `src/app/robots.ts`
- Allows all crawlers, points to sitemap

---

## Design System

- **Colors**: CSS custom properties with `light-dark()` for instant theme switching
- **Typography**: Geist Sans (UI) + Geist Mono (code) from `next/font`
- **Spacing**: 4px base grid
- **Dark mode**: CSS `color-scheme` property + `next-themes` for system preference detection without FOUC

---

## Verification Plan

### Build Verification
```bash
npm run build        # Zero TypeScript errors, zero ESLint errors
npm run start        # Verify SSG pages load
```

### Lighthouse Targets
- Performance: 100
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### Manual Verification
1. Navigate to `/` → click School card → land on grade/subject listing
2. Open an MDX topic → verify syntax highlighting, math rendering, quiz
3. Press `Cmd+K` → search for a topic → navigate via result
4. Toggle dark/light mode — no flash
5. View page source → confirm JSON-LD scripts in `<head>`
6. Run `npm run build` → verify `public/pagefind/` is generated

---

## Open Questions

> [!IMPORTANT]
> **Project Location**: All code will be scaffolded at `/Users/pramod/Desktop/linux/notes/conceptweave/`. Confirm this is the correct target directory.

> [!IMPORTANT]  
> **Pagefind Search**: Pagefind indexes static HTML output after `next build`. In development, search will show a graceful "Build the project to enable search" message. This is expected behavior for static search libraries. Confirm this trade-off is acceptable.

> [!NOTE]
> **Content Depth**: Phase 2 will create 4 sample MDX files (2 school, 2 college) to prove the full pipeline. Real content population is left for the user.

> [!NOTE]
> **shadcn/ui version**: Will use the latest stable shadcn CLI (`npx shadcn@latest init`) with the "New York" style and neutral base color.
