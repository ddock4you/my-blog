'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

const repoName = process.env.NEXT_PUBLIC_GISCUS_REPO_NAME || '';
const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID || '';
const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || '';

export default function Giscus() {
  const ref = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();
  const [shouldLoad, setShouldLoad] = useState(false);

  // https://github.com/giscus/giscus/tree/main/styles/themes
  const theme = isDarkMode ? 'dark' : 'light';

  useEffect(() => {
    if (!ref.current || shouldLoad) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad || !ref.current || ref.current.hasChildNodes()) return;

    const scriptElem = document.createElement('script');
    scriptElem.src = 'https://giscus.app/client.js';
    scriptElem.async = true;
    scriptElem.crossOrigin = 'anonymous';

    scriptElem.setAttribute('data-repo', repoName);
    scriptElem.setAttribute('data-repo-id', repoId);
    scriptElem.setAttribute('data-category', 'Comments');
    scriptElem.setAttribute('data-category-id', categoryId);
    scriptElem.setAttribute('data-mapping', 'pathname');
    scriptElem.setAttribute('data-strict', '0');
    scriptElem.setAttribute('data-reactions-enabled', '1');
    scriptElem.setAttribute('data-emit-metadata', '0');
    scriptElem.setAttribute('data-input-position', 'bottom');
    scriptElem.setAttribute('data-theme', theme);
    scriptElem.setAttribute('data-lang', 'ko');

    ref.current.appendChild(scriptElem);
  }, [shouldLoad, theme]);

  // https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#isetconfigmessage
  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    iframe?.contentWindow?.postMessage({ giscus: { setConfig: { theme } } }, 'https://giscus.app');
  }, [theme]);

  return <section ref={ref} />;
}
