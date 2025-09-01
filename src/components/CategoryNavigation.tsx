import Link from 'next/link';
import { getAllCategories } from '@/lib/post';
import { BookOpen, Grid3X3 } from 'lucide-react';

export function CategoryNavigation() {
  const categories = getAllCategories();

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-6 overflow-x-auto py-4">
          {/* 전체 포스트 링크 */}
          <Link
            href="/posts"
            className="flex items-center space-x-2 rounded-lg px-3 py-2 font-medium
              whitespace-nowrap text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600
              dark:text-gray-400 dark:hover:bg-blue-900/50 dark:hover:text-blue-400"
          >
            <Grid3X3 className="h-4 w-4" />
            <span>전체</span>
          </Link>

          {/* 카테고리 링크들 */}
          {categories.map(category => (
            <Link
              key={category.slug}
              href={`/posts/${category.slug}`}
              className="flex items-center space-x-2 rounded-lg px-3 py-2 font-medium
                whitespace-nowrap text-gray-600 transition-colors hover:bg-blue-50
                hover:text-blue-600 dark:text-gray-400 dark:hover:bg-blue-900/50
                dark:hover:text-blue-400"
            >
              <BookOpen className="h-4 w-4" />
              <span className="capitalize">{category.name}</span>
              <span
                className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600
                  dark:bg-gray-700 dark:text-gray-400"
              >
                {category.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
