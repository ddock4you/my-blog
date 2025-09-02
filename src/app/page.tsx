import Link from 'next/link';
import Image from 'next/image';
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
                  {/* 이미지 썸네일 */}
                  {post.image && (
                    <div className="flex-shrink-0 sm:ml-6">
                      <div className="relative h-24 w-24 overflow-hidden rounded-lg">
                        <Image
                          src={post.image}
                          alt={post.metadata.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    </div>
                  )}
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
