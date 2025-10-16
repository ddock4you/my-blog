import { getBlogPosts, getAllCategories, PostWithCategory } from '@/lib/post';
import { MainListNav } from '@/components/MainListNav';
import { CategoriesList } from '@/components/CategoriesList';
import { EmptyState } from '@/components/EmptyState';
import PostCard from '@/components/PostCard';

interface HomeProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { category } = await searchParams;

  const allPosts = getBlogPosts().sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });

  const filteredPosts = category ? allPosts.filter(post => post.category === category) : allPosts;

  const categories = getAllCategories();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <MainListNav />
        <CategoriesList categories={categories} selectedCategory={category} />
      </div>
      <PostList posts={filteredPosts} selectedCategory={category} />
    </div>
  );
}

function PostList({
  posts,
  selectedCategory,
}: {
  posts: PostWithCategory[];
  selectedCategory: string | undefined;
}) {
  return (
    <div className="grid grid-cols-1 gap-8 pb-11">
      {posts.map(post => (
        <PostCard key={post.slug} post={post} />
      ))}
      {posts.length === 0 && (
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
