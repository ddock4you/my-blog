import type { Metadata } from 'next';
import { IBM_Plex_Sans_KR, Geist_Mono } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchProvider } from '@/contexts/SearchContext';
import { generateSearchData } from '@/lib/post';
import './globals.css';

const ibmPlexSansKr = IBM_Plex_Sans_KR({
  variable: '--font-ibm-plex-sans-kr',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'My Blog',
  description: 'Personal blog built with Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 서버 사이드에서 검색 데이터 생성
  const searchData = generateSearchData();

  return (
    <html lang="ko" className={`${ibmPlexSansKr.variable}`}>
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
      </body>
    </html>
  );
}
