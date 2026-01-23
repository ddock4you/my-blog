'use client';

import { useMemo } from 'react';
import { useLoadMorePagination } from '@/hooks/useLoadMorePagination';
import { Button } from '@/components/ui/button';
import SeriesCard from '@/features/series/components/SeriesCard';
import type { SeriesInfo } from '@/lib/post';

type Props = {
  pageSize?: number; // 훅 옵션, 기본 10
  initialData: { items: SeriesInfo[]; total: number; initialPageHydrated?: number };
};

export default function SeriesList({ pageSize, initialData }: Props) {
  const fetcher = useMemo(
    () => (p: number, ps: number) =>
      fetch(`/api/series?page=${p}`, { headers: { 'x-page-size': String(ps) } }).then(r =>
        r.json()
      ),
    []
  );

  const { items, page, totalPages, hasMore, isLoading, loadMore } =
    useLoadMorePagination<SeriesInfo>({
      fetchPage: fetcher,
      pageSize,
      initialData,
    });

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-11">
      {items.map(series => (
        <SeriesCard key={series.name} series={series} />
      ))}
      {hasMore && (
        <div className="flex w-full items-center justify-center sm:col-span-2">
          <Button
            aria-label={`더보기 ${Math.min(page, totalPages)}/${totalPages || 0}`}
            disabled={isLoading || page >= totalPages}
            onClick={loadMore}
          >
            {`더보기 ${Math.min(page, totalPages)}/${totalPages || 0}`}
          </Button>
        </div>
      )}
    </div>
  );
}
