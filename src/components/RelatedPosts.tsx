import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { getPostsByCategory, PostWithCategory } from '@/lib/post';
import { formatDate } from '@/lib/utils';

interface RelatedPostsProps {
  currentPost: PostWithCategory;
  maxPosts?: number;
}

export function RelatedPosts({ currentPost, maxPosts = 3 }: RelatedPostsProps) {
  const relatedPosts = getPostsByCategory(currentPost.category)
    .filter(post => post.slug !== currentPost.slug)
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1;
      }
      return 1;
    })
    .slice(0, maxPosts);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
      <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
        {currentPost.category} 카테고리의 다른 포스트
      </h3>

      <div className="space-y-4">
        {relatedPosts.map(post => (
          <article
            key={post.slug}
            className="group rounded-lg border border-gray-200 p-4 transition-colors
              hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-600"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h4
                  className="text-base font-medium text-gray-900 transition-colors
                    group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
                >
                  <Link href={`/posts/${post.slug}`}>{post.metadata.title}</Link>
                </h4>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                  {post.metadata.summary}
                </p>
                <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="mr-1 h-3 w-3" />
                  <time dateTime={post.metadata.publishedAt}>
                    {formatDate(post.metadata.publishedAt)}
                  </time>
                </div>
              </div>
              <ArrowRight
                className="ml-3 h-4 w-4 flex-shrink-0 text-gray-400 transition-all
                  group-hover:translate-x-1 group-hover:text-blue-600
                  dark:group-hover:text-blue-400"
              />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6">
        <Link
          href={`/categories/${currentPost.category}`}
          className="inline-flex items-center text-sm font-medium text-blue-600 transition-colors
            hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {currentPost.category} 카테고리 모든 포스트 보기
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
