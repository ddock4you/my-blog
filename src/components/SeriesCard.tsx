'use client';
import Link from 'next/link';
import Image from 'next/image';
import { SeriesInfo } from '@/lib/post';
import { formatDate } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import { Badge } from './ui/badge';

function SeriesCard({ series }: { series: SeriesInfo }) {
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
          <Badge className="bg-bg-primary text-text-inverse-white">{series.meta?.inSeries}</Badge>
          <Badge className="bg-bg-primary text-text-inverse-white">{series.count} 개</Badge>
        </div>
        <p className="text-text-primary font-semibold sm:text-lg">
          {series.meta?.title || series.name}
        </p>
        <div className="flex items-center text-sm">
          <Calendar className="text-border-primary mr-2 h-4.5 w-4.5" />
          <span className="text-text-primary">{formatDate(series.firstPublishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}

export default SeriesCard;
