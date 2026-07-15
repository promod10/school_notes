import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchModal } from '@/components/ui/SearchModal';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | ConceptWeave',
    default: 'ConceptWeave — Learn Smarter, Not Harder',
  },
  description:
    'ConceptWeave is a free, SEO-optimized tutorial and practice portal for Secondary School (Class 10/12) and Undergraduate College (BBS/BSc) students in Nepal and beyond.',
  metadataBase: new URL('https://conceptweave.edu.np'),
  keywords: ['education', 'class 10', 'class 12', 'BBS', 'BSc', 'Nepal', 'tutorials', 'notes'],
  authors: [{ name: 'ConceptWeave Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'ConceptWeave',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
        <ThemeProvider>
          {/* Skip to main content — WCAG 2.1 AA */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          <Header />

          <main id="main-content" className="flex-1">
            {children}
          </main>

          <Footer />

          {/* Global search modal portal */}
          <SearchModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
