import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchProvider } from "@/contexts/SearchContext";
import { generateSearchData } from "@/lib/post";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Blog",
  description: "Personal blog built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 서버 사이드에서 검색 데이터 생성
  const searchData = generateSearchData();

  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <SearchProvider searchData={searchData}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SearchProvider>
      </body>
    </html>
  );
}
