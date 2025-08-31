import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { getBlogPosts, getAllCategories } from "@/lib/post";
import { CategoryCard } from "@/components/CategoryCard";
import { Calendar, Clock, ArrowRight, Grid3X3, BookOpen } from "lucide-react";

export const metadata = {
  title: "블로그 포스트 | My Blog",
  description: "개발과 기술에 대한 이야기들을 모아놓은 블로그 포스트 목록입니다.",
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* 헤더 섹션 */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Grid3X3 className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            블로그 포스트
          </h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          카테고리별 둘러보기
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>

      {/* 최근 포스트 섹션 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">최근 포스트</h2>
        <div className="space-y-6">
          {allBlogs.slice(0, 6).map((post) => (
            <article
              key={post.slug}
              className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg transition-all duration-200"
            >
              <Link href={`/posts/${post.category}/${post.slug}`}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    {/* 카테고리 태그 */}
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                        {post.categoryName}
                      </span>
                    </div>

                    <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
                      {post.metadata.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {post.metadata.summary}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatDate(post.metadata.publishedAt)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />약 5분 소요
                      </div>
                    </div>
                  </div>

                  <div className="lg:ml-6 flex-shrink-0">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                      읽어보기
                      <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {allBlogs.length > 6 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">더 많은 포스트가 있습니다!</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/posts/${category.slug}`}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>{category.name}</span>
                  <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
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
        <div className="text-center py-16">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            아직 포스트가 없습니다
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            첫 번째 블로그 포스트를 작성해보세요!
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      )}
    </div>
  );
}
