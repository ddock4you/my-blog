import { notFound } from 'next/navigation';
import { baseUrl } from '@/app/sitemap';
import { getAllSeries } from '@/lib/post';
import { MainListNav } from '@/components/MainListNav';
import Image from 'next/image';
import SeriesPostList from '@/components/SeriesPostList';
import { loadSeriesPostInitialData } from '@/server/dataLoaders';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
    openGraph: {
      title: `${title} - 시리즈`,
      description,
      url: `${baseUrl}/series/${series.slug}`,
      images: series.coverImage ? [{ url: series.coverImage }] : ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - 시리즈`,
      description,
      images: series.coverImage ? [series.coverImage] : ['/twitter-image'],
    },
  };
}

export default async function SeriesDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; mode?: 'single' | 'cumulative' }>;
}) {
  const { slug } = await params;
  const { page, mode } = await searchParams;
  const seriesList = getAllSeries();
  const series = seriesList.find(s => s.slug === slug);
  if (!series) notFound();

  const pageNum = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  const { items: initialItems, total } = await loadSeriesPostInitialData({
    slug: series.slug,
    page: Number(page),
    mode: mode === 'single' ? 'single' : 'cumulative',
  });
  return (
    <div className="flex w-full flex-col gap-10 pb-11">
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
            hasPart: initialItems.map((p, i) => ({
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
      <section className="bg-bg-inverse-black flex flex-col gap-8 p-10 md:gap-9">
        <div className="flex flex-col gap-1">
          <h2 className="text-text-inverse-white text-2xl font-bold md:text-3xl">
            {series.meta?.title || series.name}
          </h2>
          <p className="text-text-inverse-white text-sm leading-7 md:text-base">
            {series.meta?.description || series.firstPostSummary}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="text-text-inverse-white border-border-inverse-white"
          >
            <Link href={`/posts/${series.firstPostSlug}`}>첫 포스트 읽기</Link>
          </Button>
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
        </div>
      </section>

      <SeriesPostList
        slug={series.slug}
        initialPage={pageNum}
        initialData={{ items: initialItems, total, initialPageHydrated: pageNum }}
      />
    </div>
  );
}
