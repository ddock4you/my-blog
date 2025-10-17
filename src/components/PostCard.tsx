'use client';
import Link from 'next/link';
import Image from 'next/image';
import { PostWithCategory } from '@/lib/post';
import { formatDate, formatReadingTime } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';

function PostCard({ post }: { post: PostWithCategory }) {
  return (
    <Link className="flex flex-col gap-5 sm:flex-row sm:gap-5" href={`/posts/${post.slug}`}>
      <p className="relative aspect-square flex-shrink-0 sm:w-40">
        <Image
          src={post.image || ''}
          alt={`${post.metadata.title} 썸네일`}
          fill
          className="object-cover"
        />
      </p>
      <div className="text-text-primary flex flex-col gap-4 sm:justify-center sm:gap-3">
        <p className="line-clamp-1 font-bold sm:text-lg">{post.metadata.title}</p>
        <p className="line-clamp-2 h-10 text-sm sm:h-12 sm:text-base">{post.metadata.summary}</p>
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

export default PostCard;
