import type { Metadata } from 'next';
import { IBM_Plex_Sans_KR } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchProvider } from '@/contexts/SearchContext';
import { generateSearchData } from '@/lib/post';
import './globals.css';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { blogMeta } from '@/data/blogMeta';
import { ThemeProvider } from '@/contexts/ThemeContext';

const ibmPlexSansKr = IBM_Plex_Sans_KR({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700'],
});
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export const metadata: Metadata = {
  title: blogMeta.title,
  description: blogMeta.description,
  authors: [{ name: blogMeta.author }],
  keywords: blogMeta.keywords,
  openGraph: {
    title: blogMeta.title,
    description: blogMeta.description,
    url: blogMeta.url,
    images: blogMeta.image,
  },
  twitter: {
    card: 'summary_large_image',
    title: blogMeta.title,
    description: blogMeta.description,
    images: [blogMeta.image],
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
        <Analytics />
        <GoogleAnalytics gaId={GA_ID} />
        <GoogleTagManager gtmId={GA_ID} />
      </body>
    </html>
  );
}
