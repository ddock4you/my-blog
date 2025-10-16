import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllSeries, getPostsBySeriesName, type PostWithCategory } from '@/lib/post';
import { formatDate, formatReadingTime } from '@/lib/utils';
import { BookOpen, Calendar, Clock, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MainListNav } from '@/components/MainListNav';
import Image from 'next/image';
import SeriesPostCard from '@/components/SeriesPostCard';

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
  console.log(series.count);
  return (
    <div className="flex w-full flex-col gap-10 px-7 pb-11">
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
            image: series.coverImage,
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
      <MainListNav />
      <section className="bg-bg-inverse-black flex flex-col p-10">
        <h2 className="text-text-inverse-white mb-4 text-2xl font-bold">
          {series.meta?.title || series.name}
        </h2>
        <p className="text-text-inverse-white mb-8 text-sm leading-7">
          {series.meta?.description || series.firstPostSummary}
        </p>
        <p>
          {/* <Image src={series.coverImage ?? ''} alt={series.name} fill className="object-cover" /> */}
        </p>
      </section>

      <ul className="flex flex-col gap-9">
        {posts.map((post: PostWithCategory, idx: number) => (
          <li key={post.slug}>
            <SeriesPostCard post={post} idx={idx} count={series.count} />
          </li>
        ))}
      </ul>
    </div>
  );
}

// <li
//   key={post.slug}
//   className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300
//     dark:border-gray-700 dark:hover:border-gray-600"
// >
//   <div className="flex items-start justify-between gap-4">
//     <div>
//       <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">파트 {idx + 1}</div>
//       <Link
//         href={`/posts/${post.slug}`}
//         className="text-lg font-semibold text-gray-900 hover:text-blue-600 dark:text-white
//           dark:hover:text-blue-400"
//       >
//         {post.metadata.title}
//       </Link>
//       <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
//         {post.metadata.summary}
//       </p>
//       <div
//         className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400"
//       >
//         <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
//           {post.categoryName}
//         </Badge>
//         <span className="inline-flex items-center">
//           <Calendar className="mr-1 h-3 w-3" /> {formatDate(post.metadata.publishedAt)}
//         </span>
//       </div>
//     </div>
//     <Link
//       href={`/posts/${post.slug}`}
//       className="inline-flex items-center rounded-md bg-blue-50 px-3 py-2 text-sm
//         font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400
//         dark:hover:bg-blue-900/30"
//     >
//       <BookOpen className="mr-2 h-4 w-4" /> 읽기
//     </Link>
//   </div>
// </li>
