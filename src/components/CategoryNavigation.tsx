"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAllCategories } from "@/lib/post";
import { BookOpen, Grid3X3 } from "lucide-react";

export function CategoryNavigation() {
  const pathname = usePathname();
  const categories = getAllCategories();

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-6 py-4 overflow-x-auto">
          {/* 전체 포스트 링크 */}
          <Link
            href="/posts"
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              pathname === "/posts"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50"
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
            <span>전체</span>
          </Link>

          {/* 카테고리 링크들 */}
          {categories.map((category) => {
            const isActive = pathname?.startsWith(`/posts/${category.name}`) ?? false;

            return (
              <Link
                key={category.name}
                href={`/posts/${category.name}`}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span className="capitalize">{category.name}</span>
                <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                  {category.count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
