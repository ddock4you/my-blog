'use client';

import PostCard from '@/features/posts/components/PostCard';
import { Button } from '@/components/ui/button';
import type { PostSummary } from '@/lib/post';

type Props = {
  posts: PostSummary[];
  page: number;
  totalPages: number;
  hasMore: boolean;
  onLoadMore: () => void;
};

export default function PostList({ posts, page, totalPages, hasMore, onLoadMore }: Props) {
  return (
    <div className="grid grid-cols-1 gap-8 pb-11">
      {posts.map((post, index) => (
        <PostCard key={post.slug} post={post} imagePriority={index === 0} />
      ))}
      {hasMore && (
        <div className="flex w-full items-center justify-center">
          <Button
            aria-label={`더보기 ${Math.min(page, totalPages)}/${totalPages}`}
            onClick={onLoadMore}
            variant="outline"
          >
            {`더보기 ${Math.min(page, totalPages)}/${totalPages}`}
          </Button>
        </div>
      )}
    </div>
  );
}
