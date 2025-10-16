'use client';
import Link from 'next/link';
import { PostWithCategory } from '@/lib/post';
import { formatDate, formatReadingTime } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';

function SeriesPostCard({
  post,
  idx,
  count,
}: {
  post: PostWithCategory;
  idx: number;
  count: number;
}) {
  return (
    <Link href={`/posts/${post.slug}`} className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
        <span
          className="text-text-inverse-white bg-bg-inverse-black flex h-7 w-fit min-w-7 items-center
            justify-center rounded-md px-2 font-semibold"
        >
          {count - idx}
        </span>
        <p className="text-text-primary line-clamp-1 font-semibold md:text-lg">
          {post.metadata.title}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-text-primary text-sm md:text-base">{post.metadata.summary}</p>
        <div className="text-text-primary flex items-center gap-3 text-sm sm:gap-4 sm:text-base">
          <div className="flex items-center">
            <Calendar className="text-border-primary mr-2 h-4.5 w-4.5" />
            <span className="text-text-primary">{formatDate(post.metadata.publishedAt)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="text-border-primary mr-2 h-4.5 w-4.5" />
            <span className="text-text-primary">{formatReadingTime(post.readingTime)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default SeriesPostCard;
