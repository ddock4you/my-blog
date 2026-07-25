import { NextResponse } from 'next/server';
import { generateSearchData } from '@/lib/post';

export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json(generateSearchData());
}
