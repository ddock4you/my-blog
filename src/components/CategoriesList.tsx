'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { CategoryInfo } from '@/lib/post';

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

  return (
    <div
      className={`dark:bg-accent-foreground sticky top-12 z-40 w-full border-b-2 bg-white py-1
        transition-transform duration-300 ease-in-out md:top-16 ${
          isVisible ? 'translate-y-0' : '-translate-y-[calc(100%+60px)]'
        }`}
    >
      <nav className="flex flex-wrap gap-2 border-y px-2 py-1 md:py-2">
        <Link
          href="/"
          className={`px-2 py-1 text-xs md:text-sm ${
            !selectedCategory
              ? 'font-bold text-black dark:text-white'
              : 'font-normal text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
        >
          전체
        </Link>
        {categories.map((category, index) => (
          <Link
            key={category.slug}
            href={`/?category=${category.slug}`}
            className={`relative px-2 py-1 text-xs before:absolute before:-left-[5px]
            before:text-gray-300 before:content-["|"] md:text-sm dark:before:text-gray-600 ${
              selectedCategory === category.slug
                ? 'font-bold text-black dark:text-white'
                : 'font-normal text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            } `}
          >
            {category.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
