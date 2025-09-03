import Link from 'next/link';
import { formatDate, formatReadingTime } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface PostHeaderProps {
  category: string;
  title: string;
  publishedAt: string;
  readingTime: number;
}

export function PostHeader({ category, title, publishedAt, readingTime }: PostHeaderProps) {
  return (
    <header className="mb-6">
      <div className="mb-4">
        <Link
          href={`/posts/${category}`}
          className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium
            text-blue-800 capitalize transition-colors hover:bg-blue-200 dark:bg-blue-900
            dark:text-blue-200 dark:hover:bg-blue-800"
        >
          {category}
        </Link>
      </div>
      <h1 className="title mb-4 text-2xl font-semibold tracking-tighter">{title}</h1>
      <div className="mt-2 mb-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 text-neutral-600 dark:text-neutral-400">
          <p className="text-sm">{formatDate(publishedAt)}</p>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span className="text-sm">{formatReadingTime(readingTime)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
