import { NextResponse } from 'next/server';
import { getAllSeries, getPostsBySeriesName } from '@/lib/post';
import { findSeriesKey, getSeriesOrder } from '@/lib/series';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSeries().map(series => ({ slug: series.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const series = getAllSeries().find(item => item.slug === slug);
  if (!series) {
    return NextResponse.json({ error: 'Series not found' }, { status: 404 });
  }

  let items = getPostsBySeriesName(series.name);
  const key = findSeriesKey(series.name);
  const order = key ? getSeriesOrder(key) : [];
  if (order.length === 0) {
    return NextResponse.json(
      { error: '시리즈 YAML에 order가 정의되지 않았습니다.' },
      { status: 500 }
    );
  }

  const indexMap = new Map(order.map((item, index) => [item, index]));
  items = [...items].sort((a, b) => {
    const ai = indexMap.get(a.slug) ?? Number.POSITIVE_INFINITY;
    const bi = indexMap.get(b.slug) ?? Number.POSITIVE_INFINITY;
    if (ai !== bi) return bi - ai;
    const dateDifference =
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime();
    return dateDifference || b.slug.localeCompare(a.slug);
  });

  return NextResponse.json({ items, total: items.length });
}
