'use client';
import Link from 'next/link';
import Image from 'next/image';
import { PostWithCategory } from '@/lib/post';
import { formatDate, formatReadingTime } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';
import { Badge } from './ui/badge';

function PostCard({ post }: { post: PostWithCategory }) {
  return (
    <div>
      <Link className="flex flex-col gap-2" href={`/posts/${post.slug}`}>
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={post.image || ''}
            alt={`${post.metadata.title} 썸네일`}
            fill
            className="object-cover"
          />
        </div>
        <p className="line-clamp-2 text-sm font-bold md:h-[48px] md:text-base">
          <Badge className="mr-2 rounded-sm bg-gray-500 text-white">{post.categoryName}</Badge>
          {post.metadata.title}
        </p>
        {post.series && (
          <div className="-mt-1 mb-1 text-xs text-blue-600 dark:text-blue-400">
            <Link
              href={`/series/${post.series.toLowerCase().replace(/\s+/g, '-')}`}
              className="hover:underline"
            >
              #{post.series}
            </Link>
          </div>
        )}
        <p className="line-clamp-3 text-xs text-gray-500 md:h-[60px] md:text-sm">
          {post.metadata.summary}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 md:text-sm">
          <div className="flex items-center">
            <Calendar className="mr-2 h-3 w-3" />
            {formatDate(post.metadata.publishedAt)}
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-3 w-3" />
            {formatReadingTime(post.readingTime)}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PostCard;
