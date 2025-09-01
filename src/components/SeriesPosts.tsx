import Link from "next/link";
import { PostWithCategory } from "@/lib/post";

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
    <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        시리즈: {seriesName}
      </h3>
      <ol className="list-decimal list-inside space-y-2">
        {seriesPosts.map((post) => (
          <li
            key={post.slug}
            className={`${post.slug === currentPostSlug ? "font-bold text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"}`}
          >
            <Link href={`/posts/${post.category}/${post.slug}`}>{post.metadata.title}</Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
