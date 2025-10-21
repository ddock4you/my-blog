'use client';

import Link from 'next/link';
import { CategoryInfo } from '@/lib/post';
import clsx from 'clsx';

interface CategoriesListProps {
  categories: CategoryInfo[];
  selectedCategory?: string;
}

export function CategoriesList({ categories, selectedCategory }: CategoriesListProps) {
  const allCategories = categories.reduce(
    (acc, category) => {
      acc[0].count += category.count;
      acc.push(category);
      return acc;
    },
    [{ slug: 'all', name: '전체', count: 0 }] as CategoryInfo[]
  );

  return (
    <div
      className={clsx(
        'sticky top-12 z-40 w-full py-2 transition-transform duration-300 ease-in-out'
      )}
    >
      <nav className="flex flex-wrap gap-5">
        {allCategories.map((category, index) => {
          const isAll = index === 0;
          const href = isAll ? '/' : `/?category=${category.slug}`;
          const isActive = isAll ? !selectedCategory : selectedCategory === category.slug;

          return (
            <Link
              key={category.slug}
              href={href}
              className={clsx(
                'md:text-lg',
                !isAll &&
                  `before:border-border-tertiary before:text-border-tertiary relative text-base
                  before:absolute before:top-1 before:-left-[0.7rem] before:text-sm
                  before:font-medium before:content-["|"]`,
                isActive ? 'text-text-primary font-semibold' : 'text-text-secondary'
              )}
            >
              {category.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
