import { formatDate, formatReadingTime } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';
import { Badge } from './ui/badge';
import { SeriesMeta } from '@/lib/series';

interface PostHeaderProps {
  category: string;
  title: string;
  publishedAt: string;
  readingTime: number;
  seriesMeta: SeriesMeta | null;
}

export function PostHeader({
  category,
  title,
  publishedAt,
  readingTime,
  seriesMeta,
}: PostHeaderProps) {
  return (
    <header className="flex flex-col gap-5">
      <div className="flex gap-2">
        {seriesMeta && (
          <>
            <Badge className="px-2 py-1">{seriesMeta.order?.length} 개</Badge>
            <Badge className="px-2 py-1">{seriesMeta.inSeries}</Badge>
          </>
        )}
        {!seriesMeta && <Badge className="">{category}</Badge>}
      </div>
      <h1 className="title text-text-primary text-2xl font-semibold tracking-tighter md:text-3xl">
        {title}
      </h1>
      <div className="flex items-center gap-3 text-sm sm:gap-4 sm:text-base">
        <div className="flex items-center">
          <Calendar className="text-border-primary mr-2 h-4.5 w-4.5" />
          <span className="text-text-primary">{formatDate(publishedAt)}</span>
        </div>
        <div className="flex items-center">
          <Clock className="text-border-primary mr-2 h-4.5 w-4.5" />
          <span className="text-text-primary">{formatReadingTime(readingTime)}</span>
        </div>
      </div>
    </header>
  );
}
