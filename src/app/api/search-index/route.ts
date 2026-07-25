import { NextResponse } from 'next/server';
import { generateSearchData } from '@/lib/post';

export async function GET() {
  const response = NextResponse.json(generateSearchData());
  response.headers.set(
    'Cache-Control',
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
  );
  return response;
}
