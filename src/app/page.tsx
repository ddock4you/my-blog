import { Suspense } from 'react';
import { getAllCategories, getPostSummaries } from '@/lib/post';
import type { Metadata } from 'next';
import { blogMeta } from '@/data/blogMeta';
import HomeContent from '@/features/posts/components/HomeContent';
import { MainListNav } from '@/components/MainListNav';
import { CategoriesList } from '@/components/CategoriesList';
import PostCard from '@/features/posts/components/PostCard';

export default function Home() {
  const categories = getAllCategories();
  const posts = getPostSummaries().sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  );
  const initialPosts = posts.slice(0, 10);

  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-8">
          <div className="bg-bg-inverse-white sticky top-0 z-10 flex flex-col gap-4 py-4">
            <MainListNav />
            <CategoriesList categories={categories} />
          </div>
          <div className="grid grid-cols-1 gap-8 pb-11">
            {initialPosts.map((post, index) => (
              <PostCard key={post.slug} post={post} imagePriority={index === 0} />
            ))}
          </div>
        </div>
      }
    >
      <HomeContent categories={categories} initialPosts={initialPosts} total={posts.length} />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: blogMeta.title,
  description: blogMeta.description,
  openGraph: {
    title: blogMeta.title,
    description: blogMeta.description,
    url: blogMeta.url,
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: blogMeta.title,
    description: blogMeta.description,
    images: ['/og.png'],
  },
};
