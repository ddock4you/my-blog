import Link from 'next/link';
import { PostWithCategory } from '@/lib/post';

interface SeriesPostsProps {
  currentPostSlug: string;
  seriesPosts: PostWithCategory[];
  seriesName: string;
}

export function SeriesPosts({ currentPostSlug, seriesPosts, seriesName }: SeriesPostsProps) {
  if (seriesPosts.length <= 1) {
    return null;
  }

  return (
    <div className="mb-8 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        시리즈: {seriesName}
      </h3>
      <ol className="list-inside list-decimal space-y-2">
        {seriesPosts.map(post => (
          <li
            key={post.slug}
            className={`${
              post.slug === currentPostSlug
                ? 'font-bold text-blue-600 dark:text-blue-400'
                : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
            }`}
          >
            <Link href={`/posts/${post.slug}`}>{post.metadata.title}</Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
