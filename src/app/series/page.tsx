import { Suspense } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { MainListNav } from '@/components/MainListNav';
import SeriesList from '@/features/series/components/SeriesList';
import { getAllSeries } from '@/lib/post';
import SeriesCard from '@/features/series/components/SeriesCard';

export const metadata = {
  title: '시리즈 | My Blog',
  description: '주제별로 구성된 블로그 시리즈 모음입니다.',
};

export default function SeriesIndexPage() {
  const series = getAllSeries();

  return (
    <div className="flex flex-col gap-8 pb-11 py-4">
      <MainListNav />
      {series.length === 0 ? (
        <EmptyState message="아직 시리즈로 묶인 포스트가 없습니다." />
      ) : (
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-11">
              {series.slice(0, 10).map(item => (
                <SeriesCard key={item.name} series={item} />
              ))}
            </div>
          }
        >
          <SeriesList series={series} />
        </Suspense>
      )}
    </div>
  );
}
