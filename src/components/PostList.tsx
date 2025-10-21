'use client';

import { useMemo } from 'react';
import { useLoadMorePagination } from '@/hooks/useLoadMorePagination';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/PostCard';
import type { PostWithCategory } from '@/lib/post';

type Props = {
  pageSize?: number; // 훅 옵션, 기본 10
  initialData: { items: PostWithCategory[]; total: number; initialPageHydrated?: number };
  category?: string;
};

export default function PostList({ pageSize, initialData, category }: Props) {
  const fetcher = useMemo(
    () => (p: number, ps: number) =>
      fetch(`/api/posts?page=${p}&category=${category ?? ''}`, {
        headers: { 'x-page-size': String(ps) },
      }).then(r => r.json()),
    [category]
  );

  const { items, page, totalPages, hasMore, isLoading, loadMore } =
    useLoadMorePagination<PostWithCategory>({
      fetchPage: fetcher,
      pageSize,
      initialData,
    });

  return (
    <div className="grid grid-cols-1 gap-8 pb-11">
      {items.map(post => (
        <PostCard key={post.slug} post={post} />
      ))}
      {/* 단순 에러 메시지 표기 */}
      {/* 필요한 경우 토스트로 교체 가능 */}
      {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
      {/* 위 코멘트는 향후 토스트 도입 시 제거 */}
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
