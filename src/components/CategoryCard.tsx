import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { CategoryInfo } from '@/lib/post';

interface CategoryCardProps {
  category: CategoryInfo;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group block rounded-lg border border-gray-200 bg-white p-6 transition-all
        duration-200 hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800
        dark:hover:border-blue-600"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="rounded-lg bg-blue-100 p-2 transition-colors group-hover:bg-blue-200
              dark:bg-blue-900 dark:group-hover:bg-blue-800"
          >
            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3
            className="text-lg font-semibold text-gray-900 transition-colors
              group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
          >
            {category.name}
          </h3>
        </div>
        <ArrowRight
          className="h-5 w-5 text-gray-400 transition-all group-hover:translate-x-1
            group-hover:text-blue-600 dark:group-hover:text-blue-400"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-300">{category.count}개의 포스트</p>
        {category.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{category.description}</p>
        )}
      </div>
    </Link>
  );
}
