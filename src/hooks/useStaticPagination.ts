'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  computeInitialSlice,
  DEFAULT_PAGE_SIZE,
  type PaginationMode,
} from '@/lib/pagination';

export function useStaticPagination<T>(items: T[], pageSize = DEFAULT_PAGE_SIZE) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = useMemo(() => {
    const value = Number(searchParams.get('page') || '1');
    return Number.isFinite(value) && value > 0 ? value : 1;
  }, [searchParams]);

  const mode = useMemo<PaginationMode>(
    () => (searchParams.get('mode') === 'single' ? 'single' : 'cumulative'),
    [searchParams]
  );
  const totalPages = Math.ceil(items.length / pageSize);
  const safePage = Math.min(page, Math.max(totalPages, 1));
  const visibleItems = useMemo(
    () => computeInitialSlice(items, safePage, mode, pageSize),
    [items, mode, pageSize, safePage]
  );

  const setPage = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(nextPage));
      params.set('mode', 'cumulative');
      router.replace(`${pathname}?${params}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return {
    items: visibleItems,
    page: safePage,
    totalPages,
    hasMore: safePage < totalPages,
    loadMore: () => setPage(safePage + 1),
  };
}
