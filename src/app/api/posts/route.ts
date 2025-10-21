import { NextResponse } from 'next/server';
import { getBlogPosts } from '@/lib/post';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = Number(searchParams.get('page') || '1');
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const category = searchParams.get('category') || undefined;

    // pageSize는 URL이 아니라 헤더로만 제어 (기본 10)
    const headerValue = request.headers.get('x-page-size');
    const pageSizeHeader = headerValue ? Number(headerValue) : NaN;
    const pageSize = Number.isFinite(pageSizeHeader) && pageSizeHeader > 0 ? pageSizeHeader : 10;

    let posts = getBlogPosts();
    // 최신순 정렬 (홈 페이지와 동일 로직)
    posts = posts.sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1;
      }
      return 1;
    });

    if (category) {
      posts = posts.filter(p => p.category === category);
    }

    const total = posts.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = posts.slice(start, end);

    return NextResponse.json({ items, total });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to load posts' }, { status: 500 });
  }
}
