import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { CategoryInfo } from "@/lib/post";

interface CategoryCardProps {
  category: CategoryInfo;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/posts/${category.slug}`}
      className="group block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {category.name}
          </h3>
        </div>
        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
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
