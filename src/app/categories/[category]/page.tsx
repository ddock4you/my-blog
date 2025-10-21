import { getPostsByCategory, getAllCategories } from '@/lib/post';
import { baseUrl } from '@/app/sitemap';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map(category => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const posts = getPostsByCategory(categorySlug);

  if (posts.length === 0) {
    return { title: '카테고리를 찾을 수 없습니다' };
  }

  const categories = getAllCategories();
  const categoryInfo = categories.find(c => c.slug === categorySlug);
  const categoryName = categoryInfo ? categoryInfo.name : categorySlug;

  return {
    title: `${categoryName} 카테고리 - 포스트 목록`,
    description: `${categoryName} 카테고리의 모든 포스트들을 확인해보세요. 총 ${posts.length}개의 포스트가 있습니다.`,
    openGraph: {
      title: `${categoryName} 카테고리 - 포스트 목록`,
      description: `${categoryName} 카테고리의 모든 포스트들을 확인해보세요. 총 ${posts.length}개의 포스트가 있습니다.`,
      url: `${baseUrl}/categories/${categorySlug}`,
      images: ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} 카테고리 - 포스트 목록`,
      description: `${categoryName} 카테고리의 모든 포스트들을 확인해보세요. 총 ${posts.length}개의 포스트가 있습니다.`,
      images: ['/twitter-image'],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const posts = getPostsByCategory(categorySlug).sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });

  if (posts.length === 0) {
    notFound();
  }

  const categories = getAllCategories();
  const categoryInfo = categories.find(c => c.slug === categorySlug);
  const categoryName = categoryInfo ? categoryInfo.name : categorySlug;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* 브레드크럼 네비게이션 */}
      <nav className="mb-6 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <Link href="/posts" className="hover:text-blue-600 dark:hover:text-blue-400">
          포스트
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100">{categoryName}</span>
      </nav>

      {/* 헤더 섹션 */}
      <div className="mb-12">
        <div className="mb-4 flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
            {categoryName}
          </h1>
        </div>
        <p className="mb-6 text-xl text-gray-600 dark:text-gray-300">
          {categoryName} 카테고리의 모든 포스트들입니다.
        </p>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>총 {posts.length}개의 포스트</span>
        </div>
      </div>

      {/* 포스트 목록 */}
      <div className="space-y-8">
        {posts.map(post => (
          <article
            key={post.slug}
            className="group rounded-lg border border-gray-200 p-6 transition-all duration-200
              hover:border-gray-300 hover:shadow-lg dark:border-gray-700 dark:hover:border-gray-600"
          >
            <div className="flex flex-col space-y-3">
              {/* 카테고리 태그 */}
              <div className="flex items-center gap-2">
                <span
                  className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium
                    text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {post.categoryName}
                </span>
              </div>

              {/* 제목 */}
              <h2 className="text-xl font-semibold md:text-2xl">
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-gray-900 transition-colors group-hover:text-blue-600
                    hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400
                    dark:hover:text-blue-400"
                >
                  {post.metadata.title}
                </Link>
              </h2>

              {/* 요약 */}
              <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                {post.metadata.summary}
              </p>

              {/* 메타 정보 */}
              <div
                className="flex items-center justify-between border-t border-gray-100 pt-4
                  dark:border-gray-800"
              >
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="mr-2 h-4 w-4" />
                  <time dateTime={post.metadata.publishedAt}>
                    {formatDate(post.metadata.publishedAt)}
                  </time>
                </div>

                <Link
                  href={`/posts/${post.slug}`}
                  className="inline-flex items-center text-sm font-medium text-blue-600
                    transition-colors hover:text-blue-700 dark:text-blue-400
                    dark:hover:text-blue-300"
                >
                  읽어보기
                  <ArrowRight
                    className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 다른 카테고리 링크 */}
      <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          다른 카테고리 둘러보기
        </h3>
        <Link
          href="/posts"
          className="inline-flex items-center text-blue-600 transition-colors hover:text-blue-700
            dark:text-blue-400 dark:hover:text-blue-300"
        >
          모든 포스트 보기
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
