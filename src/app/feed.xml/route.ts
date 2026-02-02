import { NextResponse } from 'next/server';
import { getBlogPosts } from '@/lib/post';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://my-blog-lake-ten.vercel.app';

export async function GET() {
  const posts = getBlogPosts().sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  );

  const items = posts
    .map(p => {
      const link = `${SITE_URL}/posts/${p.slug}`;
      const description = escapeXml(p.metadata.summary || '');
      return `
      <item>
        <title>${escapeXml(p.metadata.title)}</title>
        <link>${link}</link>
        <description>${description}</description>
        <pubDate>${new Date(p.metadata.publishedAt).toUTCString()}</pubDate>
        <guid>${link}</guid>
      </item>`;
    })
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Dev Thinking Dev Blog</title>
    <link>${SITE_URL}</link>
    <description>Dev Thinking의 개발 블로그 RSS</description>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=600, stale-while-revalidate=60',
    },
  });
}

function escapeXml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
