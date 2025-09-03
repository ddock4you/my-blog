'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, memo } from 'react';
import { Sun, Moon, Search } from 'lucide-react';
import { SearchModal } from './SearchModal';
import { useTheme } from '../hooks/useTheme';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      setIsSearchOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <header
        className="dark:bg-accent-foreground sticky top-0 z-50 h-12 w-full border-b-2 bg-white px-2
          md:h-16 md:px-4 lg:px-0"
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
    <div className="flex items-center space-x-2">
      <Link href="/" className="flex items-center space-x-2">
        <span className="text-foreground text-xl font-bold md:text-2xl dark:text-white">
          BreadFrame
        </span>
      </Link>
    </div>
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
    <nav className="flex items-center gap-2 text-xs md:text-sm">
      <button onClick={openSearch} className="cursor-pointer p-1 dark:text-white" aria-label="검색">
        <Search className="text-muted-foreground h-4 w-4 md:h-5 md:w-5" />
      </button>
      <button
        onClick={toggleDarkMode}
        className="cursor-pointer p-1 dark:text-white"
        aria-label="다크모드 토글"
      >
        {isDarkMode && <Sun className="text-muted-foreground h-4 w-4 md:h-5 md:w-5" />}
        {!isDarkMode && <Moon className="text-muted-foreground h-4 w-4 md:h-5 md:w-5" />}
      </button>
    </nav>
  );
});
