'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState, useCallback, memo } from 'react';
import { Sun, Moon, Search } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import clsx from 'clsx';

const SearchModal = dynamic(
  () => import('@/features/search/components/SearchModal').then(module => module.SearchModal),
  { ssr: false }
);

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toggleDarkMode } = useTheme();

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
          <Navigation openSearch={openSearch} toggleDarkMode={toggleDarkMode} />
        </div>
      </header>
      {isSearchOpen && <SearchModal isOpen onClose={closeSearch} />}
    </>
  );
}

function Logo() {
  return (
    <Link href="/" className="text-text-primary flex flex-col gap-2 text-right">
      <span className="font-logo text-xl [font-weight:700] md:text-3xl">Dev Thinking</span>
    </Link>
  );
}

const Navigation = memo(function Navigation({
  openSearch,
  toggleDarkMode,
}: {
  openSearch: () => void;
  toggleDarkMode: () => void;
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
      <button
        onClick={toggleDarkMode}
        className="relative h-5 w-5 cursor-pointer"
        aria-label="다크모드 토글"
      >
        <Sun className="text-text-primary absolute inset-0 h-5 w-5 dark:hidden" />
        <Moon className="text-text-primary absolute inset-0 hidden h-5 w-5 dark:block" />
      </button>
    </nav>
  );
});
