'use client';

import { useMemo } from 'react';
import { useLoadMorePagination } from '@/hooks/useLoadMorePagination';
import { Button } from '@/components/ui/button';
import SeriesPostCard from '@/components/SeriesPostCard';
import type { PostWithCategory } from '@/lib/post';

type Props = {
  slug: string;
  initialPage: number;
  initialData: { items: PostWithCategory[]; total: number; initialPageHydrated?: number };
};

export default function SeriesPostList({ slug, initialPage, initialData }: Props) {
  const fetcher = useMemo(
    () => (p: number, ps: number) =>
      fetch(`/api/series/${slug}?page=${p}&mode=single`, {
        headers: { 'x-page-size': String(ps) },
      }).then(r => r.json()),
    [slug]
  );

  const { items, page, totalPages, hasMore, isLoading, loadMore } =
    useLoadMorePagination<PostWithCategory>({
      fetchPage: fetcher,
      initialPage,
      initialData,
    });

  return (
    <div className="flex flex-col gap-9">
      {items.map((post, idx) => (
        <SeriesPostCard key={post.slug} post={post} idx={idx} count={initialData.total} />
      ))}
      {hasMore && (
        <div className="flex w-full items-center justify-center">
          <Button
            aria-label={`더보기 ${Math.min(page, totalPages)}/${totalPages || 0}`}
            disabled={isLoading || page >= totalPages}
            onClick={loadMore}
            variant="outline"
          >
            {`더보기 ${Math.min(page, totalPages)}/${totalPages || 0}`}
          </Button>
        </div>
      )}
    </div>
  );
}
