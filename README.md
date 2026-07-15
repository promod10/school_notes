# ConceptWeave

ConceptWeave is a modern, SEO-optimized educational portal built with Next.js 15, tailored for Secondary School (Class 8 - 12) and Undergraduate (All faculty and Subjects) students. It features interactive quizzes, full LaTeX math support, and ultra-fast static site generation (SSG) with local search powered by Pagefind.

###### project Demo: www.cpramod.com.np

## 🚀 Quick Start (Development)

Follow these instructions to set up the project and run it on your local machine.

### Prerequisites

- **Node.js**: v20 or newer is recommended.
- **npm**: Comes with Node.js.

### 1. Install Dependencies

Open your terminal, navigate to the project directory, and run:

```bash
npm install
```

### 2. Start the Development Server

Once the dependencies are installed, start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application running.

> **Note about Search (Pagefind):** The search functionality in the development environment will display a "Search unavailable in development" message. Pagefind relies on post-processing the static HTML files generated during a production build. To test search, you must run a production build.

## 🏗️ Production Build (Required for Search)

To fully test the application, including the Pagefind search indexing, you need to create a production build.

### 1. Build the Project

Run the build command:

```bash
npm run build
```

This command does two things:
1. `next build`: Generates the optimized static HTML/CSS/JS for the Next.js application.
2. `postbuild` script (`npx pagefind`): Scans the generated static output to build the search index.

### 2. Start the Production Server

After a successful build, start the server:

```bash
npm run start
```

Navigate to [http://localhost:3000](http://localhost:3000). The search modal (Cmd+K / Ctrl+K) will now be fully functional.

## 📁 Content Management (MDX)

Content is written in MDX (Markdown with JSX) and resides in the `src/content/` directory.

### Directory Structure

The routes are dynamically generated based on the folder structure:
- **School**: `src/content/school/[grade]/[subject]/[topic-slug].mdx`
- **College**: `src/content/college/[stream]/[subject]/[topic-slug].mdx`

### Creating a New Note

1. Create a new `.mdx` file in the appropriate directory.
2. Add the required frontmatter at the top of the file:

```yaml
---
title: "Topic Title"
description: "A short description for SEO."
subject: "Mathematics"
level: "class-12"
date: "2024-09-01"
keywords: ["math", "calculus"]
author: "ConceptWeave Team"
order: 1
---
```

3. Write your content below the frontmatter using standard Markdown, LaTeX (wrap inline math with `$` and block math with `$$`), and code blocks.
4. (Optional) Add an interactive quiz at the bottom using the `<QuizLoader />` component.

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router, Server Components)
- **Styling**: Tailwind CSS v4 (with native CSS variables in `globals.css`)
- **Content**: MDX (`next-mdx-remote`, `gray-matter`)
- **Math Rendering**: KaTeX (`remark-math`, `rehype-katex`)
- **Syntax Highlighting**: Shiki
- **Search**: Pagefind (WASM-based static search)
- **Icons**: Lucide React
