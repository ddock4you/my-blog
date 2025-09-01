import Link from 'next/link';
import { getBlogPosts } from '@/lib/post';
import { formatDate } from '@/lib/utils';
import { ArrowRight, Calendar, BookOpen } from 'lucide-react';

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
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* 히어로 섹션 */}
      <section className="mb-12 py-12 text-center">
        <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-6xl dark:text-white">
          안녕하세요! 👋
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600 md:text-2xl dark:text-gray-300">
          개발과 기술에 대한 이야기를 나누는 공간입니다.
          <br />
          새로운 것을 배우고 공유하는 것을 좋아합니다.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/posts"
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium
              text-white transition-colors hover:bg-blue-700"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            블로그 둘러보기
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center rounded-lg border border-gray-300 px-6 py-3
              font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600
              dark:text-gray-300 dark:hover:bg-gray-800"
          >
            더 알아보기
          </Link>
        </div>
      </section>

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

        <div className="grid gap-6">
          {allPosts.map(post => (
            <article
              key={post.slug}
              className="group rounded-xl border border-gray-200 bg-white p-6 transition-colors
                hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800
                dark:hover:border-gray-600"
            >
              <Link href={`/posts/${post.slug}`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    {/* 카테고리 태그 */}
                    <div className="mb-2">
                      <span
                        className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs
                          font-medium text-blue-800 capitalize dark:bg-blue-900 dark:text-blue-200"
                      >
                        {post.category}
                      </span>
                    </div>
                    <h3
                      className="mb-2 text-xl font-semibold text-gray-900 transition-colors
                        group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
                    >
                      {post.metadata.title}
                    </h3>
                    <p className="mb-3 text-gray-600 dark:text-gray-300">{post.metadata.summary}</p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDate(post.metadata.publishedAt)}
                    </div>
                  </div>
                  <div className="sm:ml-6">
                    <div
                      className="inline-flex items-center font-medium text-blue-600
                        group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300"
                    >
                      읽기
                      <ArrowRight
                        className="ml-1 h-4 w-4 transform transition-transform
                          group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
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
  );
}
