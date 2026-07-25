import PostCard from '@/features/posts/components/PostCard';
import LoadMorePosts from '@/features/posts/components/LoadMorePosts';
import type { PostSummary } from '@/lib/post';

type Props = {
  pageSize?: number;
  initialData: { items: PostSummary[]; total: number; initialPageHydrated?: number };
  category?: string;
};

export default function PostList({ pageSize, initialData, category }: Props) {
  return (
    <div className="grid grid-cols-1 gap-8 pb-11">
      {initialData.items.map((post, index) => (
        <PostCard key={post.slug} post={post} imagePriority={index === 0} />
      ))}
      <LoadMorePosts
        category={category}
        initialItemCount={initialData.items.length}
        initialPage={initialData.initialPageHydrated ?? 1}
        pageSize={pageSize}
        total={initialData.total}
      />
    </div>
  );
}
