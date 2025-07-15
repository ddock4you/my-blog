import Link from "next/link";
import { getBlogPosts } from "@/lib/post";
import { formatDate } from "@/lib/utils";
import { ArrowRight, Calendar, BookOpen } from "lucide-react";

export default function Home() {
  const allPosts = getBlogPosts()
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1;
      }
      return 1;
    })
    .slice(0, 3); // 최신 3개 포스트만 표시

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 히어로 섹션 */}
      <section className="text-center py-12 mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          안녕하세요! 👋
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          개발과 기술에 대한 이야기를 나누는 공간입니다.
          <br />
          새로운 것을 배우고 공유하는 것을 좋아합니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/posts"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            블로그 둘러보기
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            더 알아보기
          </Link>
        </div>
      </section>

      {/* 최신 포스트 섹션 */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">최근 포스트</h2>
          <Link
            href="/posts"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center"
          >
            전체 보기
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6">
          {allPosts.map((post) => (
            <article
              key={post.slug}
              className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <Link href={`/posts/${post.category}/${post.slug}`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    {/* 카테고리 태그 */}
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full capitalize">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                      {post.metadata.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">{post.metadata.summary}</p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDate(post.metadata.publishedAt)}
                    </div>
                  </div>
                  <div className="sm:ml-6">
                    <div className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300">
                      읽기
                      <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {allPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              아직 작성된 포스트가 없습니다.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
