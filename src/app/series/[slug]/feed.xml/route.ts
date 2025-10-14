import { NextResponse } from 'next/server';
import { getAllSeries, getPostsBySeriesName } from '@/lib/post';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const seriesList = getAllSeries();
  const series = seriesList.find(s => s.slug === slug);
  if (!series) {
    return new NextResponse('Series not found', { status: 404 });
  }

  const posts = getPostsBySeriesName(series.name);

  const feedItems = posts
    .map(
      p => `
      <item>
        <title>${escapeXml(p.metadata.title)}</title>
        <link>${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/posts/${p.slug}</link>
        <description>${escapeXml(p.metadata.summary)}</description>
        <pubDate>${new Date(p.metadata.publishedAt).toUTCString()}</pubDate>
        <guid>${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/posts/${p.slug}</guid>
      </item>
    `
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>${escapeXml(series.meta?.title || series.name)}</title>
      <link>${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/series/${series.slug}</link>
      <description>${escapeXml(series.meta?.description || series.firstPostSummary || '')}</description>
      ${feedItems}
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
