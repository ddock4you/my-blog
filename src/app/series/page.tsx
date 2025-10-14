import Link from 'next/link';
import Image from 'next/image';
import { getAllSeries, type SeriesInfo } from '@/lib/post';
import { formatDate } from '@/lib/utils';
import { Layers, ListOrdered, BookOpen, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/EmptyState';
import { MainListNav } from '@/components/MainListNav';

export const metadata = {
  title: '시리즈 | My Blog',
  description: '주제별로 구성된 블로그 시리즈 모음입니다.',
};

export default function SeriesIndexPage() {
  const seriesList: SeriesInfo[] = getAllSeries();
  const totalSeries = seriesList.length;
  const totalPostsInSeries = seriesList.reduce((acc, s) => acc + s.count, 0);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <MainListNav />
      {/* 헤더 */}
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <Layers className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">시리즈</h1>
        </div>
        <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
          같은 시리즈로 묶인 포스트들을 모아 한 번에 읽어보세요.
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1">
            <Layers className="h-4 w-4" /> {totalSeries}개 시리즈
          </span>
          <span className="inline-flex items-center gap-1">
            <ListOrdered className="h-4 w-4" /> 총 {totalPostsInSeries}개 포스트
          </span>
        </div>
      </div>

      {/* 빈 상태 */}
      {seriesList.length === 0 && <EmptyState message="아직 시리즈로 묶인 포스트가 없습니다." />}

      {/* 시리즈 카드 그리드 */}
      {seriesList.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {seriesList.map(series => (
            <article
              key={series.name}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white
                transition-all duration-200 hover:border-gray-300 hover:shadow-lg
                dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
            >
              {/* 커버 */}
              {series.coverImage && (
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={series.coverImage}
                    alt={`${series.name} 커버 이미지`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}

              <div className="p-5">
                {/* 이름 (레지스트리 title 우선) */}
                <h2
                  className="mb-2 line-clamp-2 text-xl font-semibold text-gray-900 dark:text-white"
                >
                  <Link href={`/series/${series.slug}`} className="hover:underline">
                    {series.meta?.title || series.name}
                  </Link>
                </h2>

                {/* 메타 */}
                <div
                  className="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-500
                    dark:text-gray-400"
                >
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {series.count}부작
                  </Badge>
                  {series.categoryNames.slice(0, 3).map(name => (
                    <Badge
                      key={name}
                      className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                    >
                      {name}
                    </Badge>
                  ))}
                  {series.categoryNames.length > 3 && (
                    <span className="ml-1 text-[11px] opacity-70">
                      외 {series.categoryNames.length - 3}
                    </span>
                  )}
                </div>

                {/* 요약 (레지스트리 description 우선) */}
                {(series.meta?.description || series.firstPostSummary) && (
                  <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                    {series.meta?.description || series.firstPostSummary}
                  </p>
                )}

                {/* 기간 */}
                <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(series.firstPublishedAt)} — {formatDate(series.lastPublishedAt)}
                </p>

                {/* CTA */}
                <div className="flex items-center justify-between">
                  <Link
                    href={`/posts/${series.firstPostSlug}`}
                    className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-2 text-sm
                      font-medium text-blue-600 transition-colors hover:bg-blue-100
                      dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                  >
                    <BookOpen className="mr-2 h-4 w-4" /> 처음부터 읽기
                  </Link>

                  <span
                    className="text-xs text-gray-500 transition-colors group-hover:text-gray-700
                      dark:text-gray-400 dark:group-hover:text-gray-300"
                  >
                    총 {series.count}개 포스트
                    <ArrowRight className="ml-1 inline h-3 w-3" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
