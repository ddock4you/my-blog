import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { getBlogPosts, getAllCategories } from '@/lib/post';
import { CategoryCard } from '@/components/CategoryCard';
import { Calendar, Clock, ArrowRight, Grid3X3, BookOpen } from 'lucide-react';

export const metadata = {
  title: '블로그 포스트 | My Blog',
  description: '개발과 기술에 대한 이야기들을 모아놓은 블로그 포스트 목록입니다.',
};

export default function BlogPosts() {
  const allBlogs = getBlogPosts().sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });

  const categories = getAllCategories();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* 헤더 섹션 */}
      <div className="mb-12">
        <div className="mb-4 flex items-center gap-3">
          <Grid3X3 className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
            블로그 포스트
          </h1>
        </div>
        <p className="mb-6 text-xl text-gray-600 dark:text-gray-300">
          개발과 기술에 대한 이야기들을 카테고리별로 둘러보세요.
        </p>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>
            총 {allBlogs.length}개의 포스트 • {categories.length}개의 카테고리
          </span>
        </div>
      </div>

      {/* 카테고리 카드 섹션 */}
      <div className="mb-16">
        <h2
          className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white"
        >
          <BookOpen className="h-6 w-6" />
          카테고리별 둘러보기
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map(category => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>

      {/* 최근 포스트 섹션 */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">최근 포스트</h2>
        <div className="space-y-6">
          {allBlogs.slice(0, 6).map(post => (
            <article
              key={post.slug}
              className="group rounded-xl border border-gray-200 bg-white p-6 transition-all
                duration-200 hover:border-gray-300 hover:shadow-lg dark:border-gray-700
                dark:bg-gray-800 dark:hover:border-gray-600"
            >
              <Link href={`/posts/${post.slug}`}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    {/* 카테고리 태그 */}
                    <div className="mb-3">
                      <span
                        className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs
                          font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {post.categoryName}
                      </span>
                    </div>

                    <h3
                      className="mb-3 text-xl font-semibold text-gray-900 transition-colors
                        group-hover:text-blue-600 lg:text-2xl dark:text-white
                        dark:group-hover:text-blue-400"
                    >
                      {post.metadata.title}
                    </h3>

                    <p className="mb-4 line-clamp-2 text-gray-600 dark:text-gray-300">
                      {post.metadata.summary}
                    </p>

                    <div
                      className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatDate(post.metadata.publishedAt)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />약 5분 소요
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 lg:ml-6">
                    <div
                      className="inline-flex items-center rounded-lg bg-blue-50 px-4 py-2
                        font-medium text-blue-600 transition-colors group-hover:bg-blue-100
                        dark:bg-blue-900/20 dark:text-blue-400 dark:group-hover:bg-blue-900/30"
                    >
                      읽어보기
                      <ArrowRight
                        className="ml-2 h-4 w-4 transform transition-transform
                          group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {allBlogs.length > 6 && (
          <div className="mt-8 text-center">
            <p className="mb-4 text-gray-600 dark:text-gray-400">더 많은 포스트가 있습니다!</p>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map(category => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 text-gray-700
                    transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300
                    dark:hover:bg-gray-700"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>{category.name}</span>
                  <span
                    className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs dark:bg-gray-700"
                  >
                    {category.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 빈 상태 */}
      {allBlogs.length === 0 && (
        <div className="py-16 text-center">
          <div className="mb-4">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full
                bg-gray-100 dark:bg-gray-800"
            >
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            아직 포스트가 없습니다
          </h3>
          <p className="mb-6 text-gray-500 dark:text-gray-400">
            첫 번째 블로그 포스트를 작성해보세요!
          </p>
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium
              text-white transition-colors hover:bg-blue-700"
          >
            홈으로 돌아가기
          </Link>
        </div>
      )}
    </div>
  );
}
