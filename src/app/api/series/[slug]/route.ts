import { NextResponse } from 'next/server';
import { getAllSeries, getPostsBySeriesName } from '@/lib/post';
import { findSeriesKey, getSeriesOrder } from '@/lib/series';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const pageParam = Number(searchParams.get('page') || '1');
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const modeParam = String(searchParams.get('mode') || '').toLowerCase();
    const mode: 'cumulative' | 'single' = modeParam === 'single' ? 'single' : 'cumulative';

    const headerValue = request.headers.get('x-page-size');
    const pageSizeHeader = headerValue ? Number(headerValue) : NaN;
    const pageSize = Number.isFinite(pageSizeHeader) && pageSizeHeader > 0 ? pageSizeHeader : 10;

    const seriesList = getAllSeries();
    const series = seriesList.find(s => s.slug === slug);
    if (!series) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 });
    }

    // 시리즈명으로 포스트 조회 (최신순 정렬)
    let allPosts = getPostsBySeriesName(series.name);

    // YAML order 기반 정렬 적용
    const key = findSeriesKey(series.name || '');
    const order = key ? getSeriesOrder(key) : [];
    if (order.length > 0) {
      const indexMap = new Map<string, number>();
      order.forEach((slug, idx) => indexMap.set(slug, idx));
      allPosts = [...allPosts].sort((a, b) => {
        const ai = indexMap.has(a.slug) ? indexMap.get(a.slug)! : Number.POSITIVE_INFINITY;
        const bi = indexMap.has(b.slug) ? indexMap.get(b.slug)! : Number.POSITIVE_INFINITY;
        if (ai !== bi) return ai - bi;
        // 보조 정렬: 발행일 오름차순, 그 다음 슬러그
        const ad = new Date(a.metadata.publishedAt).getTime();
        const bd = new Date(b.metadata.publishedAt).getTime();
        if (ad !== bd) return ad - bd;
        return a.slug.localeCompare(b.slug);
      });
    } else {
      return NextResponse.json(
        { error: '시리즈 YAML에 order가 정의되지 않았습니다.' },
        { status: 500 }
      );
    }
    const total = allPosts.length;
    let items;
    if (mode === 'single') {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      items = allPosts.slice(start, end);
    } else {
      const end = Math.min(total, page * pageSize);
      items = allPosts.slice(0, end);
    }

    return NextResponse.json({ items, total });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to load series posts' },
      { status: 500 }
    );
  }
}
