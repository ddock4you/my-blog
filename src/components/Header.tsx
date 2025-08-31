'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Home, FileText, User, Sun, Moon, Search } from 'lucide-react';
import { SearchModal } from './SearchModal';

const navigation = [
  { name: '홈', href: '/', icon: Home },
  { name: '블로그', href: '/posts', icon: FileText },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 다크모드 초기화 및 토글
  useEffect(() => {
    const isDark =
      localStorage.getItem('darkMode') === 'true' ||
      (!localStorage.getItem('darkMode') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  // Cmd/Ctrl + K로 검색 모달 열기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* 로고 */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary
                    font-bold text-primary-foreground"
                >
                  B
                </div>
                <span className="text-xl font-bold text-foreground">My Blog</span>
              </Link>
            </div>

            {/* 데스크톱 네비게이션 */}
            <nav className="hidden items-center space-x-8 md:flex">
              {navigation.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-1 text-sm font-medium text-muted-foreground
                      transition-colors hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* 검색, 다크모드 토글 & 모바일 메뉴 버튼 */}
            <div className="flex items-center space-x-2">
              {/* 검색 버튼 */}
              <button
                onClick={openSearch}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent
                  hover:text-foreground"
                aria-label="검색"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* 다크모드 토글 */}
              <button
                onClick={toggleDarkMode}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent
                  hover:text-foreground"
                aria-label="다크모드 토글"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* 모바일 메뉴 버튼 */}
              <button
                onClick={toggleMenu}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent
                  hover:text-foreground md:hidden"
                aria-label="메뉴 열기/닫기"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* 모바일 메뉴 */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="space-y-1 border-t bg-background px-2 pt-2 pb-3">
                {/* 모바일 검색 버튼 */}
                <button
                  onClick={() => {
                    openSearch();
                    closeMenu();
                  }}
                  className="flex w-full items-center space-x-3 rounded-md px-3 py-2 text-left
                    text-base font-medium text-muted-foreground transition-colors hover:bg-accent
                    hover:text-foreground"
                >
                  <Search className="h-5 w-5" />
                  <span>검색</span>
                  <div className="ml-auto">
                    <kbd
                      className="hidden rounded border bg-accent px-2 py-1 text-xs
                        font-semibold text-muted-foreground sm:inline-block"
                    >
                      ⌘K
                    </kbd>
                  </div>
                </button>

                {navigation.map(item => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeMenu}
                      className="flex items-center space-x-3 rounded-md px-3 py-2 text-base
                        font-medium text-muted-foreground transition-colors hover:bg-accent
                        hover:text-foreground"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 검색 모달 */}
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
    </>
  );
}
