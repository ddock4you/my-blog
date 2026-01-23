'use client';

import dynamic from 'next/dynamic';

const Analytics = dynamic(
  () => import('@vercel/analytics/react').then(({ Analytics: NextAnalytics }) => NextAnalytics),
  { ssr: false }
);
const GoogleAnalytics = dynamic(
  () =>
    import('@next/third-parties/google').then(({ GoogleAnalytics: NextGoogleAnalytics }) => NextGoogleAnalytics),
  { ssr: false }
);
const GoogleTagManager = dynamic(
  () =>
    import('@next/third-parties/google').then(({ GoogleTagManager: NextGoogleTagManager }) => NextGoogleTagManager),
  { ssr: false }
);

export default function AnalyticsLoader() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

  return (
    <>
      <Analytics />
      {GA_ID && (
        <>
          <GoogleAnalytics gaId={GA_ID} />
          <GoogleTagManager gtmId={GA_ID} />
        </>
      )}
    </>
  );
}
