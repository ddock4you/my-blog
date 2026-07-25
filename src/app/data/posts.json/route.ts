import { NextResponse } from 'next/server';
import { getPostSummaries } from '@/lib/post';

export const dynamic = 'force-static';

export function GET() {
  const items = getPostSummaries().sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  );
  return NextResponse.json({ items, total: items.length });
}
