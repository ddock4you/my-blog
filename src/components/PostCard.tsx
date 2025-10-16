'use client';
import Link from 'next/link';
import Image from 'next/image';
import { PostWithCategory } from '@/lib/post';
import { formatDate, formatReadingTime } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';
import { Badge } from './ui/badge';

function PostCard({ post }: { post: PostWithCategory }) {
  return (
    <Link className="flex flex-col gap-5" href={`/posts/${post.slug}`}>
      <p className="relative aspect-square">
        <Image
          src={post.image || ''}
          alt={`${post.metadata.title} 썸네일`}
          fill
          className="object-cover"
        />
      </p>
      <div className="text-text-primary flex flex-col gap-4">
        <p className="line-clamp-1 font-bold">{post.metadata.title}</p>
        <p className="line-clamp-2 h-10 text-sm">{post.metadata.summary}</p>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center">
            <Calendar className="text-border-primary mr-2 h-4.5 w-4.5" />
            {formatDate(post.metadata.publishedAt)}
          </div>
          <div className="flex items-center">
            <Clock className="text-border-primary mr-2 h-4.5 w-4.5" />
            {formatReadingTime(post.readingTime)}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
