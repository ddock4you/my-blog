import type { Metadata } from 'next';
import { IBM_Plex_Sans_KR } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchProvider } from '@/contexts/SearchContext';
import { generateSearchData } from '@/lib/post';
import './globals.css';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

const ibmPlexSansKr = IBM_Plex_Sans_KR({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700'],
});
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export const metadata: Metadata = {
  title: 'My Blog',
  description: 'Personal blog built with Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 서버 사이드에서 검색 데이터 생성
  const searchData = generateSearchData();

  return (
    <html lang="ko" className={ibmPlexSansKr.className}>
      <body
        className="font-ibm bg-bg-inverse-white box-sizing-border-box flex min-h-screen flex-col
          antialiased"
      >
        <SearchProvider searchData={searchData}>
          <div className="mx-auto w-full max-w-3xl">
            <Header />
            <main className="px-7 md:px-10">{children}</main>
            <Footer />
          </div>
        </SearchProvider>
        <GoogleAnalytics gaId={GA_ID} />
        <GoogleTagManager gtmId={GA_ID} />
      </body>
    </html>
  );
}
