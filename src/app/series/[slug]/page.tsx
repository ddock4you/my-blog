import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllSeries, getPostsBySeriesName, type PostWithCategory } from '@/lib/post';
import { formatDate } from '@/lib/utils';
import { BookOpen, Calendar, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export async function generateStaticParams() {
  const seriesList = getAllSeries();
  return seriesList.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const seriesList = getAllSeries();
  const series = seriesList.find(s => s.slug === slug);
  if (!series) return { title: '시리즈를 찾을 수 없습니다' };

  const title = series.meta?.title || series.name;
  const description = series.meta?.description || series.firstPostSummary || `${title} 시리즈`;

  return {
    title: `${title} - 시리즈`,
    description,
  };
}

export default async function SeriesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const seriesList = getAllSeries();
  const series = seriesList.find(s => s.slug === slug);
  if (!series) notFound();

  const posts = getPostsBySeriesName(series.name);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWorkSeries',
            name: series.meta?.title || series.name,
            description: series.meta?.description || series.firstPostSummary,
            startDate: series.firstPublishedAt,
            endDate: series.lastPublishedAt,
            hasPart: posts.map((p, i) => ({
              '@type': 'BlogPosting',
              position: i + 1,
              headline: p.metadata.title,
              datePublished: p.metadata.publishedAt,
              url: `/posts/${p.slug}`,
            })),
          }),
        }}
      />
      <nav className="mb-6 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <Link href="/series" className="hover:text-blue-600 dark:hover:text-blue-400">
          시리즈
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100">
          {series.meta?.title || series.name}
        </span>
      </nav>

      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <Layers className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
            {series.meta?.title || series.name}
          </h1>
        </div>
        {(series.meta?.description || series.firstPostSummary) && (
          <p className="mb-4 text-lg text-gray-600 dark:text-gray-300">
            {series.meta?.description || series.firstPostSummary}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          {series.meta?.inSeries && (
            <Badge
              className={
                series.meta.inSeries === '완료'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                  : series.meta.inSeries === '연재중'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
              }
            >
              {series.meta.inSeries}
            </Badge>
          )}
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {series.count}부작
          </Badge>
          <span>
            {formatDate(series.firstPublishedAt)} — {formatDate(series.lastPublishedAt)}
          </span>
        </div>
      </div>

      <ol className="space-y-4">
        {posts.map((post: PostWithCategory, idx: number) => (
          <li
            key={post.slug}
            className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300
              dark:border-gray-700 dark:hover:border-gray-600"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">파트 {idx + 1}</div>
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600 dark:text-white
                    dark:hover:text-blue-400"
                >
                  {post.metadata.title}
                </Link>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                  {post.metadata.summary}
                </p>
                <div
                  className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400"
                >
                  <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                    {post.categoryName}
                  </Badge>
                  <span className="inline-flex items-center">
                    <Calendar className="mr-1 h-3 w-3" /> {formatDate(post.metadata.publishedAt)}
                  </span>
                </div>
              </div>
              <Link
                href={`/posts/${post.slug}`}
                className="inline-flex items-center rounded-md bg-blue-50 px-3 py-2 text-sm
                  font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400
                  dark:hover:bg-blue-900/30"
              >
                <BookOpen className="mr-2 h-4 w-4" /> 읽기
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
