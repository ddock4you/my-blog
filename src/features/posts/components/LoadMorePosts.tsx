'use client';

import { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import PostCard from '@/features/posts/components/PostCard';
import { DEFAULT_PAGE_SIZE } from '@/lib/pagination';
import type { PostSummary } from '@/lib/post';

type Props = {
  category?: string;
  initialItemCount: number;
  initialPage: number;
  pageSize?: number;
  total: number;
};

export default function LoadMorePosts({
  category,
  initialItemCount,
  initialPage,
  pageSize = DEFAULT_PAGE_SIZE,
  total,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(initialPage);
  const [items, setItems] = useState<PostSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const totalPages = Math.ceil(total / pageSize);
  const hasMore = initialItemCount + items.length < total && page < totalPages;

  const endpoint = useMemo(() => {
    const params = new URLSearchParams({ page: String(page + 1) });
    if (category) params.set('category', category);
    return `/api/posts?${params}`;
  }, [category, page]);

  const updateUrl = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(nextPage));
      if (!params.has('mode')) params.set('mode', 'cumulative');
      router.replace(`${pathname}?${params}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoint, {
        headers: { 'x-page-size': String(pageSize) },
      });
      if (!response.ok) throw new Error('포스트를 불러오지 못했습니다.');

      const data = (await response.json()) as { items: PostSummary[]; total: number };
      const nextPage = page + 1;
      setItems(previous => [...previous, ...data.items]);
      setPage(nextPage);
      updateUrl(nextPage);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '포스트를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, hasMore, isLoading, page, pageSize, updateUrl]);

  return (
    <>
      {items.map(post => (
        <PostCard key={post.slug} post={post} />
      ))}
      {error && (
        <p className="text-center text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {hasMore && (
        <div className="flex w-full items-center justify-center">
          <Button
            aria-label={`더보기 ${Math.min(page, totalPages)}/${totalPages}`}
            disabled={isLoading}
            onClick={loadMore}
            variant="outline"
          >
            {isLoading ? '불러오는 중…' : `더보기 ${Math.min(page, totalPages)}/${totalPages}`}
          </Button>
        </div>
      )}
    </>
  );
}
