import { PostWithCategory } from '@/lib/post';
import NewspaperPostCard from './NewspaperPostCard';
import { EmptyState } from './EmptyState';

interface PostsGridProps {
  posts: PostWithCategory[];
  selectedCategory?: string;
  className?: string;
}

export function PostsGrid({
  posts,
  selectedCategory,
  className = 'md:border-t grid grid-cols-1 gap-8 p-2 md:grid-cols-2 md:p-4 lg:grid-cols-3',
}: PostsGridProps) {
  // 카테고리 필터링
  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  return (
    <div className={className}>
      {filteredPosts.map((post, index) => (
        <NewspaperPostCard
          key={post.slug}
          post={post}
          index={index}
          totalCount={filteredPosts.length}
        />
      ))}
      {filteredPosts.length === 0 && (
        <EmptyState
          message={
            selectedCategory
              ? `"${selectedCategory}" 카테고리에 해당하는 포스트가 없습니다.`
              : '아직 작성된 포스트가 없습니다.'
          }
        />
      )}
    </div>
  );
}
