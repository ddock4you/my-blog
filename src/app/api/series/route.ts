import { NextResponse } from 'next/server';
import { getAllSeries } from '@/lib/post';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = Number(searchParams.get('page') || '1');
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

    // pageSize는 URL이 아니라 헤더로만 제어 (기본 10)
    const headerValue = request.headers.get('x-page-size');
    const pageSizeHeader = headerValue ? Number(headerValue) : NaN;
    const pageSize = Number.isFinite(pageSizeHeader) && pageSizeHeader > 0 ? pageSizeHeader : 10;

    let series = getAllSeries();
    const total = series.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = series.slice(start, end);

    return NextResponse.json({ items, total });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to load series' }, { status: 500 });
  }
}
