import { getPostsByCategory, getAllCategories } from "@/lib/post";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category: category.name,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const posts = getPostsByCategory(category);

  if (posts.length === 0) {
    return {
      title: "카테고리를 찾을 수 없습니다",
    };
  }

  return {
    title: `${category} 카테고리 - 포스트 목록`,
    description: `${category} 카테고리의 모든 포스트들을 확인해보세요. 총 ${posts.length}개의 포스트가 있습니다.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const posts = getPostsByCategory(category).sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 브레드크럼 네비게이션 */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
        <Link href="/posts" className="hover:text-blue-600 dark:hover:text-blue-400">
          포스트
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100 capitalize">{category}</span>
      </nav>

      {/* 헤더 섹션 */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white capitalize">
            {category}
          </h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          {category} 카테고리의 모든 포스트들입니다.
        </p>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>총 {posts.length}개의 포스트</span>
        </div>
      </div>

      {/* 포스트 목록 */}
      <div className="space-y-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
          >
            <div className="flex flex-col space-y-3">
              {/* 카테고리 태그 */}
              <div className="flex items-center gap-2">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full capitalize">
                  {post.category}
                </span>
              </div>

              {/* 제목 */}
              <h2 className="text-xl md:text-2xl font-semibold">
                <Link
                  href={`/posts/${post.category}/${post.slug}`}
                  className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400"
                >
                  {post.metadata.title}
                </Link>
              </h2>

              {/* 요약 */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {post.metadata.summary}
              </p>

              {/* 메타 정보 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="mr-2 h-4 w-4" />
                  <time dateTime={post.metadata.publishedAt}>
                    {formatDate(post.metadata.publishedAt)}
                  </time>
                </div>

                <Link
                  href={`/posts/${post.category}/${post.slug}`}
                  className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  읽어보기
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 다른 카테고리 링크 */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          다른 카테고리 둘러보기
        </h3>
        <Link
          href="/posts"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          모든 포스트 보기
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
