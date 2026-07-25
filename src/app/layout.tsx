import React from 'react';
import { preload } from 'react-dom';
import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './globals.css';
import { blogMeta } from '@/data/blogMeta';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AnalyticsLoader from '@/components/AnalyticsLoader';

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
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: blogMeta.title,
    description: blogMeta.description,
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  preload('/fonts/ibm-plex-sans-kr/IBMPlexSansKR-Regular-92.woff2', {
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  });
  preload('/fonts/ibm-plex-sans-kr/IBMPlexSansKR-SemiBold-92.woff2', {
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  });

  return (
    <html lang="ko" suppressHydrationWarning>
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
          <div className="mx-auto w-full max-w-3xl">
            <Header />
            <main className="px-7 md:px-10">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { const load = () => { if (document.querySelector('link[data-ibm-plex-deferred]')) return; const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = '/fonts/ibm-plex-sans-kr/ibm-plex-sans-kr.css'; link.dataset.ibmPlexDeferred = ''; document.head.appendChild(link); }; const onVisibility = () => { if (document.visibilityState !== 'hidden') return; load(); document.removeEventListener('visibilitychange', onVisibility); }; document.addEventListener('visibilitychange', onVisibility); window.addEventListener('pagehide', load, { once: true }); })();`,
          }}
        />
        <AnalyticsLoader />
      </body>
    </html>
  );
}
