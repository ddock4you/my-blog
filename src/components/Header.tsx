'use client';

import Link from 'next/link';
import { useState, useCallback, memo } from 'react';
import { Sun, Moon, Search } from 'lucide-react';
import { SearchModal } from '@/features/search/components/SearchModal';
import { useTheme } from '@/hooks/useTheme';
import clsx from 'clsx';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  return (
    <>
      <header
        className={clsx(
          `bg-bg-inverse-white w-full px-7 py-6 pb-2 transition-transform duration-300 ease-in-out
          md:px-10 md:py-12`
        )}
      >
        <div className="flex h-full items-center justify-between">
          <Logo />
          <Navigation
            openSearch={openSearch}
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
      <span className="text-xl font-bold md:text-3xl">Dev Thinking</span>
    </Link>
  );
}

const Navigation = memo(function Navigation({
  openSearch,
  toggleDarkMode,
  isDarkMode,
}: {
  openSearch: () => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}) {
  return (
    <nav className="flex items-center gap-5 text-sm">
      <button
        onClick={openSearch}
        className="inline-flex cursor-pointer items-center gap-1"
        aria-label="검색"
      >
        <Search className="text-text-primary h-5 w-5" />
        <span className="text-text-primary text-sm font-semibold tracking-tight">검색하기</span>
      </button>
      <button onClick={toggleDarkMode} className="cursor-pointer" aria-label="다크모드 토글">
        {!isDarkMode && <Sun className="text-text-primary h-5 w-5" />}
        {isDarkMode && <Moon className="text-text-primary h-5 w-5" />}
      </button>
    </nav>
  );
});
