import { notFound } from 'next/navigation';
import { getAllSeries, getPostsBySeriesName, type PostWithCategory } from '@/lib/post';
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
      <section
        className="bg-bg-inverse-black flex flex-col gap-8 p-10 md:flex-row md:items-end md:gap-9"
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-text-inverse-white text-2xl font-bold md:text-3xl">
            {series.meta?.title || series.name}
          </h2>
          <p className="text-text-inverse-white text-sm leading-7 md:text-base">
            {series.meta?.description || series.firstPostSummary}
          </p>
        </div>
        <p
          className="relative ml-auto aspect-square w-full max-w-13 flex-none flex-shrink-0
            md:max-w-20"
        >
          <Image
            src={series.coverImage ?? ''}
            alt={series.name}
            fill
            className="object-contain md:shadow-md"
          />
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
