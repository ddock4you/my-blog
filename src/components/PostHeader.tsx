import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface PostHeaderProps {
  category: string;
  title: string;
  publishedAt: string;
}

export function PostHeader({ category, title, publishedAt }: PostHeaderProps) {
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
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(publishedAt)}</p>
      </div>
    </header>
  );
}
