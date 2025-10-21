import { getAllCategories } from '@/lib/post';
import type { Metadata } from 'next';
import { blogMeta } from '@/data/blogMeta';
import { MainListNav } from '@/components/MainListNav';
import { CategoriesList } from '@/components/CategoriesList';
import { EmptyState } from '@/components/EmptyState';
import PostList from '@/components/PostList';
import { loadHomeInitialData } from '@/server/dataLoaders';

interface HomeProps {
  searchParams: Promise<{ category?: string; page?: string; mode?: 'single' | 'cumulative' }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { category, page, mode } = await searchParams;

  const categories = getAllCategories();
  const { items, total, initialPage } = await loadHomeInitialData({
    category,
    page: Number(page),
    mode: mode === 'single' ? 'single' : 'cumulative',
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-bg-inverse-white sticky top-0 z-50 flex flex-col gap-4 py-4">
        <MainListNav />
        <CategoriesList categories={categories} selectedCategory={category} />
      </div>
      {total === 0 ? (
        <EmptyState
          message={
            category
              ? `"${category}" 카테고리에 해당하는 포스트가 없습니다.`
              : '아직 작성된 포스트가 없습니다.'
          }
        />
      ) : (
        <PostList
          initialData={{ items, total, initialPageHydrated: initialPage }}
          category={category}
        />
      )}
    </div>
  );
}

export const metadata: Metadata = {
  title: blogMeta.title,
  description: blogMeta.description,
  openGraph: {
    title: blogMeta.title,
    description: blogMeta.description,
    url: blogMeta.url,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: blogMeta.title,
    description: blogMeta.description,
    images: ['/twitter-image'],
  },
};
