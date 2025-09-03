import { getBlogPosts, getAllCategories } from '@/lib/post';
import { PostsGrid } from '@/components/PostsGrid';
import { CategoriesList } from '@/components/CategoriesList';

interface HomeProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { category } = await searchParams;

  const allPosts = getBlogPosts()
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1;
      }
      return 1;
    })
    .slice(0, 6); // 최신 6개 포스트만 표시

  const categories = getAllCategories();

  return (
    <div className="flex flex-col gap-2 md:gap-8">
      {/* 카테고리 목록 */}
      <CategoriesList categories={categories} selectedCategory={category} />
      {/* 포스트 카드 */}
      <div className="">
        <PostsGrid posts={allPosts} selectedCategory={category} />
      </div>
    </div>
  );
}
