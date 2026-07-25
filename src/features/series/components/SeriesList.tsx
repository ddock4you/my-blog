'use client';

import { useStaticPagination } from '@/hooks/useStaticPagination';
import { Button } from '@/components/ui/button';
import SeriesCard from '@/features/series/components/SeriesCard';
import type { SeriesInfo } from '@/lib/post';

type Props = {
  pageSize?: number;
  series: SeriesInfo[];
};

export default function SeriesList({ pageSize, series }: Props) {
  const { items, page, totalPages, hasMore, loadMore } = useStaticPagination(series, pageSize);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-11">
      {items.map(series => (
        <SeriesCard key={series.name} series={series} />
      ))}
      {hasMore && (
        <div className="flex w-full items-center justify-center sm:col-span-2">
          <Button
            aria-label={`더보기 ${Math.min(page, totalPages)}/${totalPages || 0}`}
            onClick={loadMore}
          >
            {`더보기 ${Math.min(page, totalPages)}/${totalPages || 0}`}
          </Button>
        </div>
      )}
    </div>
  );
}
