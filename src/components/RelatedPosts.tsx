import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { getPostsByCategory, PostWithCategory } from "@/lib/post";
import { formatDate } from "@/lib/utils";

interface RelatedPostsProps {
  currentPost: PostWithCategory;
  maxPosts?: number;
}

export function RelatedPosts({ currentPost, maxPosts = 3 }: RelatedPostsProps) {
  const relatedPosts = getPostsByCategory(currentPost.category)
    .filter((post) => post.slug !== currentPost.slug)
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
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        {currentPost.category} 카테고리의 다른 포스트
      </h3>

      <div className="space-y-4">
        {relatedPosts.map((post) => (
          <article
            key={post.slug}
            className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <Link href={`/posts/${post.category}/${post.slug}`}>{post.metadata.title}</Link>
                </h4>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {post.metadata.summary}
                </p>
                <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="mr-1 h-3 w-3" />
                  <time dateTime={post.metadata.publishedAt}>
                    {formatDate(post.metadata.publishedAt)}
                  </time>
                </div>
              </div>
              <ArrowRight className="ml-3 h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6">
        <Link
          href={`/posts/${currentPost.category}`}
          className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          {currentPost.category} 카테고리 모든 포스트 보기
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
