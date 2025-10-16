'use client';
import Link from 'next/link';
import Image from 'next/image';
import { SeriesInfo } from '@/lib/post';
import { formatDate } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import { Badge } from './ui/badge';
import clsx from 'clsx';

function SeriesCard({ series }: { series: SeriesInfo }) {
  console.log(series);
  return (
    <Link href={`/series/${series.slug}`} key={series.name} className="flex flex-col gap-8">
      {/* 커버 */}
      <p className="bg-bg-faint relative aspect-square">
        {series.coverImage && (
          <Image
            src={series.coverImage}
            alt={`${series.name} 커버 이미지`}
            fill
            className="absolute inset-0 m-auto max-h-3/4 min-h-44 max-w-3/4 min-w-44 object-cover
              shadow-md"
          />
        )}
      </p>
      <div className="flex flex-col gap-2">
        <div className="flex flex-3 gap-2">
          <Badge
            className={clsx(
              'h-6 px-1 text-sm font-semibold',
              series.meta?.inSeries === '완료'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                : series.meta?.inSeries === '연재중'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
            )}
          >
            {series.meta?.inSeries}
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {series.count} 개
          </Badge>
        </div>
        <p className="text-text-primary font-bold">{series.meta?.title || series.name}</p>
        <div className="flex items-center">
          <Calendar className="text-border-primary mr-2 h-4.5 w-4.5" />
          {formatDate(series.firstPublishedAt)}
        </div>
      </div>
    </Link>
  );
}

export default SeriesCard;
