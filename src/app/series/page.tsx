import { EmptyState } from '@/components/EmptyState';
import { MainListNav } from '@/components/MainListNav';
import SeriesList from '@/components/SeriesList';
import { loadSeriesIndexInitialData } from '@/server/dataLoaders';

export const metadata = {
  title: '시리즈 | My Blog',
  description: '주제별로 구성된 블로그 시리즈 모음입니다.',
};

interface SeriesProps {
  searchParams: Promise<{ page?: string; mode?: 'single' | 'cumulative' }>;
}

export default async function SeriesIndexPage({ searchParams }: SeriesProps) {
  const { page, mode } = await searchParams;
  // const all = getAllSeries();
  const { items, total, initialPage } = await loadSeriesIndexInitialData({
    page: Number(page),
    mode: mode === 'single' ? 'single' : 'cumulative',
  });

  return (
    <div className="flex flex-col gap-8 pb-11">
      <MainListNav />
      {total === 0 ? (
        <EmptyState message="아직 시리즈로 묶인 포스트가 없습니다." />
      ) : (
        <SeriesList initialData={{ items, total, initialPageHydrated: initialPage }} />
      )}
    </div>
  );
}
