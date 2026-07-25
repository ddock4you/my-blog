'use client';

import { useStaticPagination } from '@/hooks/useStaticPagination';
import { Button } from '@/components/ui/button';
import SeriesPostCard from '@/features/posts/components/SeriesPostCard';
import type { PostSummary } from '@/lib/post';

type Props = {
  posts: PostSummary[];
};

export default function SeriesPostList({ posts }: Props) {
  const { items, page, totalPages, hasMore, loadMore } = useStaticPagination(posts);

  return (
    <div className="flex flex-col gap-9">
      {items.map((post, idx) => (
        <SeriesPostCard key={post.slug} post={post} idx={idx} count={posts.length} />
      ))}
      {hasMore && (
        <div className="flex w-full items-center justify-center">
          <Button
            aria-label={`더보기 ${Math.min(page, totalPages)}/${totalPages || 0}`}
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
