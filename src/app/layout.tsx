import React from 'react';
import type { Metadata } from 'next';
import { IBM_Plex_Sans_KR } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchProvider } from '@/contexts/SearchContext';
import { generateSearchData } from '@/lib/post';
import './globals.css';
import { blogMeta } from '@/data/blogMeta';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AnalyticsLoader from '@/components/AnalyticsLoader';

const ibmPlexSansKr = IBM_Plex_Sans_KR({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || blogMeta.canonical),
  title: {
    default: blogMeta.title,
    template: '%s | Dev Thinking Dev Blog',
  },
  description: blogMeta.description,
  authors: [{ name: blogMeta.author }],
  keywords: blogMeta.keywords,
  openGraph: {
    title: blogMeta.title,
    description: blogMeta.description,
    type: 'website',
    siteName: blogMeta.title,
    locale: 'ko_KR',
    url: blogMeta.url,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: blogMeta.title,
    description: blogMeta.description,
    images: ['/twitter-image'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 서버 사이드에서 검색 데이터 생성
  const searchData = generateSearchData();

  return (
    <html lang="ko" className={ibmPlexSansKr.className} suppressHydrationWarning>
      <body
        className="font-ibm bg-bg-inverse-white box-sizing-border-box flex min-h-screen flex-col
          antialiased"
      >
        {/* Pre-hydration theme initialization to prevent flash of incorrect theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const stored = localStorage.getItem('darkMode'); const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; const isDark = stored === null ? prefersDark : stored === 'true'; document.documentElement.classList.toggle('dark', !!isDark); } catch (_) {} })();`,
          }}
        />
        <ThemeProvider>
          <SearchProvider searchData={searchData}>
            <div className="mx-auto w-full max-w-3xl">
              <Header />
              <main className="px-7 md:px-10">{children}</main>
              <Footer />
            </div>
          </SearchProvider>
        </ThemeProvider>
        <AnalyticsLoader />
      </body>
    </html>
  );
}
