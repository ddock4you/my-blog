'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { CategoryInfo } from '@/lib/post';
import clsx from 'clsx';

interface CategoriesListProps {
  categories: CategoryInfo[];
  selectedCategory?: string;
}

export function CategoriesList({ categories, selectedCategory }: CategoriesListProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // 스크롤이 맨 위에 있을 때는 항상 보여줌
    if (currentScrollY < 10) {
      setIsVisible(true);
    } else {
      // 스크롤 방향에 따라 가시성 결정
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // 아래로 스크롤할 때 숨김
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // 위로 스크롤할 때 보임
        setIsVisible(true);
      }
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

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
        'sticky top-12 z-40 w-full py-2 transition-transform duration-300 ease-in-out',
        isVisible ? 'translate-y-0' : '-translate-y-[calc(100%+60px)]'
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
