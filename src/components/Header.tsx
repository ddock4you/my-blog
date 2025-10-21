'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, memo } from 'react';
import { Sun, Moon } from 'lucide-react';
import { SearchModal } from './SearchModal';
import { useTheme } from '@/hooks/useTheme';
import clsx from 'clsx';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isDarkMode, toggleDarkMode } = useTheme();

  // const openSearch = useCallback(() => {
  //   setIsSearchOpen(true);
  // }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      setIsSearchOpen(true);
    }
  }, []);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // 스크롤이 맨 위에 있을 때는 항상 헤더를 보여줌
    if (currentScrollY < 10) {
      setIsHeaderVisible(true);
    } else {
      // 스크롤 방향에 따라 헤더 가시성 결정
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // 아래로 스크롤할 때 헤더 숨김
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // 위로 스크롤할 때 헤더 보임
        setIsHeaderVisible(true);
      }
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      <header
        className={clsx(
          `bg-bg-inverse-white sticky top-0 z-50 w-full px-7 py-6 transition-transform duration-300
          ease-in-out md:px-10 md:py-12`,
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        <div className="flex h-full items-center justify-between">
          <Logo />
          <Navigation
            // openSearch={openSearch}
            toggleDarkMode={toggleDarkMode}
            isDarkMode={isDarkMode}
          />
        </div>
      </header>
      {/* 검색 모달 */}
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
    </>
  );
}

function Logo() {
  return (
    <Link href="/" className="text-text-primary flex flex-col gap-2 text-right">
      <span className="text-xl font-bold md:text-3xl">BreadPan</span>
      <span className="text-sm font-medium">dev</span>
    </Link>
  );
}

const Navigation = memo(function Navigation({
  // openSearch,
  toggleDarkMode,
  isDarkMode,
}: {
  // openSearch: () => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}) {
  return (
    <nav className="flex items-center gap-5 text-sm">
      {/* <button
        onClick={openSearch}
        className="inline-flex cursor-pointer items-center gap-1"
        aria-label="검색"
      >
        <Search className="text-text-primary h-5 w-5" />
        <span className="text-text-primary text-sm font-semibold tracking-tight">검색하기</span>
      </button> */}
      <button onClick={toggleDarkMode} className="cursor-pointer" aria-label="다크모드 토글">
        {!isDarkMode && <Sun className="text-text-primary h-5 w-5" />}
        {isDarkMode && <Moon className="text-text-primary h-5 w-5" />}
      </button>
    </nav>
  );
});
