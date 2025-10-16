import { getAllSeries, type SeriesInfo } from '@/lib/post';
import { EmptyState } from '@/components/EmptyState';
import { MainListNav } from '@/components/MainListNav';
import SeriesCard from '@/components/SeriesCard';

export const metadata = {
  title: '시리즈 | My Blog',
  description: '주제별로 구성된 블로그 시리즈 모음입니다.',
};

export default function SeriesIndexPage() {
  const seriesList: SeriesInfo[] = getAllSeries();
  // const totalSeries = seriesList.length;
  // const totalPostsInSeries = seriesList.reduce((acc, s) => acc + s.count, 0);

  return (
    <div className="flex flex-col gap-8 px-7 pb-11">
      <MainListNav />

      {/* 빈 상태 */}
      {seriesList.length === 0 && <EmptyState message="아직 시리즈로 묶인 포스트가 없습니다." />}
      {/* 시리즈 카드 그리드 */}
      {seriesList.length > 0 && <SeriesList seriesList={seriesList} />}
    </div>
  );
}

function SeriesList({ seriesList }: { seriesList: SeriesInfo[] }) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {seriesList.map(series => (
        <SeriesCard key={series.name} series={series} />
      ))}
    </div>
  );
}
