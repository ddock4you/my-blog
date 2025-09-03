import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts } from '@/lib/post';
import { formatDate, formatReadingTime } from '@/lib/utils';
import { ArrowRight, Calendar, BookOpen, Clock } from 'lucide-react';
import { getAllCategories } from '@/lib/post';
import { Badge } from '@/components/ui/badge';
import NewspaperPostCard from '@/components/NewspaperPostCard';

export default function Home() {
  const allPosts = getBlogPosts()
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1;
      }
      return 1;
    })
    .slice(0, 6); // 최신 3개 포스트만 표시

  const categories = getAllCategories();
  //  { slug: 'development', name: '개발', count: 2 },
  return (
    <>
      {/* 포스트 카드 */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {allPosts.map((post, index) => (
          <NewspaperPostCard
            key={post.slug}
            post={post}
            index={index}
            totalCount={allPosts.length}
          />
        ))}
      </div>
      {/* 카테고리 섹션 */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h2>
      </div>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* 최신 포스트 섹션 */}
        <section>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">최근 포스트</h2>
            <Link
              href="/posts"
              className="flex items-center font-medium text-blue-600 hover:text-blue-700
                dark:text-blue-400 dark:hover:text-blue-300"
            >
              전체 보기
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          {allPosts.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                아직 작성된 포스트가 없습니다.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
