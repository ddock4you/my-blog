import { NextResponse } from 'next/server';
import { getAllSeries } from '@/lib/post';

export const dynamic = 'force-static';

export function GET() {
  const items = getAllSeries();
  return NextResponse.json({ items, total: items.length });
}
