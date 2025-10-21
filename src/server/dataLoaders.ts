import 'server-only';

import {
  getBlogPosts,
  getAllSeries,
  getPostsBySeriesName,
  type PostWithCategory,
  type SeriesInfo,
} from '@/lib/post';
import { findSeriesKey, getSeriesOrder } from '@/lib/series';
import { computeInitialSlice, DEFAULT_PAGE_SIZE, type PaginationMode } from '@/lib/pagination';

export type HomeInitialParams = {
  category?: string;
  page?: number;
  mode?: PaginationMode;
  pageSize?: number;
};

export async function loadHomeInitialData({
  category,
  page,
  mode,
  pageSize = DEFAULT_PAGE_SIZE,
}: HomeInitialParams): Promise<{
  items: PostWithCategory[];
  total: number;
  initialPage: number;
}> {
  const allPosts = getBlogPosts().sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) return -1;
    return 1;
  });

  const filtered = category ? allPosts.filter(p => p.category === category) : allPosts;
  const total = filtered.length;
  const initialPage = Number.isFinite(page) && (page || 0) > 0 ? (page as number) : 1;
  const resolvedMode: PaginationMode = mode === 'single' ? 'single' : 'cumulative';
  const items = computeInitialSlice(filtered, initialPage, resolvedMode, pageSize);
  return { items, total, initialPage };
}

export type SeriesIndexInitialParams = {
  page?: number;
  mode?: PaginationMode;
  pageSize?: number;
};

export async function loadSeriesIndexInitialData({
  page,
  mode,
  pageSize = DEFAULT_PAGE_SIZE,
}: SeriesIndexInitialParams): Promise<{
  items: SeriesInfo[];
  total: number;
  initialPage: number;
}> {
  const all = getAllSeries();
  const total = all.length;
  const initialPage = Number.isFinite(page) && (page || 0) > 0 ? (page as number) : 1;
  const resolvedMode: PaginationMode = mode === 'single' ? 'single' : 'cumulative';
  const items = computeInitialSlice(all, initialPage, resolvedMode, pageSize);
  return { items, total, initialPage };
}

export type SeriesDetailInitialParams = {
  slug: string;
  page?: number;
  mode?: PaginationMode;
  pageSize?: number;
};

export async function loadSeriesPostInitialData({
  slug,
  page,
  mode,
  pageSize = DEFAULT_PAGE_SIZE,
}: SeriesDetailInitialParams): Promise<{
  items: PostWithCategory[];
  total: number;
  initialPage: number;
}> {
  const seriesList = getAllSeries();
  const series = seriesList.find(s => s.slug === slug);
  if (!series) {
    throw new Error('Series not found');
  }

  let posts = getPostsBySeriesName(series.name);

  const key = findSeriesKey(series.name || '');
  const order = key ? getSeriesOrder(key) : [];
  if (order.length === 0) {
    throw new Error('시리즈 YAML에 order가 정의되지 않았습니다.');
  }

  const indexMap = new Map<string, number>();
  order.forEach((slugItem, idx) => indexMap.set(slugItem, idx));
  posts = [...posts].sort((a, b) => {
    const ai = indexMap.has(a.slug) ? indexMap.get(a.slug)! : Number.POSITIVE_INFINITY;
    const bi = indexMap.has(b.slug) ? indexMap.get(b.slug)! : Number.POSITIVE_INFINITY;
    if (ai !== bi) return ai - bi;
    const ad = new Date(a.metadata.publishedAt).getTime();
    const bd = new Date(b.metadata.publishedAt).getTime();
    if (ad !== bd) return ad - bd;
    return a.slug.localeCompare(b.slug);
  });

  const total = posts.length;
  const initialPage = Number.isFinite(page) && (page || 0) > 0 ? (page as number) : 1;
  const resolvedMode: PaginationMode = mode === 'single' ? 'single' : 'cumulative';
  const items = computeInitialSlice(posts, initialPage, resolvedMode, pageSize);
  return { items, total, initialPage };
}
