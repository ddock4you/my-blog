'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Analytics = dynamic(
  () => import('@vercel/analytics/react').then(({ Analytics: NextAnalytics }) => NextAnalytics),
  { ssr: false }
);
const GoogleAnalytics = dynamic(
  () =>
    import('@next/third-parties/google').then(
      ({ GoogleAnalytics: NextGoogleAnalytics }) => NextGoogleAnalytics
    ),
  { ssr: false }
);
const GoogleTagManager = dynamic(
  () =>
    import('@next/third-parties/google').then(
      ({ GoogleTagManager: NextGoogleTagManager }) => NextGoogleTagManager
    ),
  { ssr: false }
);

export default function AnalyticsLoader() {
  const legacyGoogleId = process.env.NEXT_PUBLIC_GA_ID || '';
  const gaMeasurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
    (legacyGoogleId.startsWith('G-') ? legacyGoogleId : '');
  const googleTagManagerId =
    process.env.NEXT_PUBLIC_GTM_ID || (legacyGoogleId.startsWith('GTM-') ? legacyGoogleId : '');
  const [loadGoogleAnalytics, setLoadGoogleAnalytics] = useState(false);

  useEffect(() => {
    let delayTimer: ReturnType<typeof setTimeout> | undefined;

    const scheduleAnalytics = () => {
      delayTimer = setTimeout(() => setLoadGoogleAnalytics(true), 5000);
    };

    if (document.readyState === 'complete') {
      scheduleAnalytics();
    } else {
      window.addEventListener('load', scheduleAnalytics, { once: true });
    }

    return () => {
      window.removeEventListener('load', scheduleAnalytics);
      if (delayTimer !== undefined) clearTimeout(delayTimer);
    };
  }, []);

  return (
    <>
      <Analytics />
      {loadGoogleAnalytics && googleTagManagerId ? (
        <GoogleTagManager gtmId={googleTagManagerId} />
      ) : loadGoogleAnalytics && gaMeasurementId ? (
        <GoogleAnalytics gaId={gaMeasurementId} />
      ) : null}
    </>
  );
}
