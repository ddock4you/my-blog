'use client';
import Link from 'next/link';
import { PostWithCategory } from '@/lib/post';
import { cn, formatDate, formatReadingTime } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';
import { Fragment, ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';

type SearchedPostProps = {
  post: PostWithCategory & { seriesIndex?: number; seriesTitle?: string };
  highlightQuery?: string;
  onClick?: () => void;
  className?: string;
};

function highlightToNode(text: string, query?: string): ReactNode {
  if (!query || !query.trim() || !text) return text;
  try {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, idx) =>
          regex.test(part) ? (
            <mark key={idx} className="bg-yellow-200 dark:bg-yellow-800">
              {part}
            </mark>
          ) : (
            <Fragment key={idx}>{part}</Fragment>
          )
        )}
      </>
    );
  } catch {
    return text;
  }
}

function SearchedPost({ post, highlightQuery, onClick, className }: SearchedPostProps) {
  return (
    <Link
      className={cn(
        `flex flex-col gap-5 rounded-xs bg-gray-100 p-3 sm:flex-row sm:gap-5 md:p-5
        dark:bg-gray-700`,
        className
      )}
      href={`/posts/${post.slug}`}
      onClick={onClick}
    >
      <div className="text-text-primary flex flex-col gap-4 sm:justify-center sm:gap-3">
        <div>
          <div className="inline-flex items-center">
            {post.series ? (
              <div className="flex flex-col gap-1">
                <Badge
                  className="border-border-primary text-text-inverse-black mr-1 text-sm
                    md:text-base"
                >
                  시리즈
                </Badge>
                <p>
                  {post.seriesTitle || post.series}
                  {post.seriesIndex ? ` ${String(post.seriesIndex)}편` : ''}
                </p>
              </div>
            ) : (
              <Badge className="border-border-primary text-text-inverse-black mr-1">
                {post.categoryName || post.category}
              </Badge>
            )}
          </div>
        </div>
        <p className="line-clamp-1 font-bold sm:text-lg">
          {highlightToNode(post.metadata.title, highlightQuery)}
        </p>
        <p className="line-clamp-2 max-h-10 text-sm sm:max-h-12 sm:text-base">
          {highlightToNode(post.metadata.summary, highlightQuery)}
        </p>
        <div className="flex items-center gap-3 text-sm sm:gap-4 sm:text-base">
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

export default SearchedPost;
