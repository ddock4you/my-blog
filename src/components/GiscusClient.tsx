'use client';

import dynamic from 'next/dynamic';

const DynamicGiscus = dynamic(
  () => import('./Giscus'),
  { ssr: false, loading: () => null }
);

export default function GiscusClient() {
  return <DynamicGiscus />;
}
