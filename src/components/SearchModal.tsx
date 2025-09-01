'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, Calendar, BookOpen, Loader2 } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { formatDate } from '@/lib/utils';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading,
    hasQuery,
    resultCount,
    highlightMatch,
    postsLoaded,
  } = useSearch();

  // 모달이 열릴 때 입력 필드에 포커스
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // 배경 클릭 시 모달 닫기
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="mx-4 mt-20 flex max-h-[70vh] w-full max-w-2xl flex-col rounded-xl bg-white
          shadow-2xl dark:bg-gray-800"
        onClick={e => e.stopPropagation()}
      >
        {/* 검색 헤더 */}
        <div className="flex items-center border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="relative flex-1">
            <Search
              className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400"
            />
            <Input
              ref={inputRef}
              type="text"
              placeholder="포스트 제목으로 검색..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full border-none py-3 pr-4 pl-10 text-lg text-gray-900
                placeholder-gray-500 shadow-none outline-none dark:text-white
                dark:placeholder-gray-400"
              disabled={!postsLoaded}
            />
          </div>
          <Button
            onClick={onClose}
            aria-label="검색 모달 닫기"
            variant="ghost"
            size="icon"
            className="ml-3 flex items-center justify-center rounded-lg text-gray-400
              transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700
              dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 검색 결과 */}
        <div className="flex-1 overflow-y-auto">
          {/* 포스트 데이터 로딩 중 */}
          {!postsLoaded && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                포스트 데이터 로딩 중...
              </span>
            </div>
          )}

          {/* 검색 로딩 상태 */}
          {postsLoaded && isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">검색 중...</span>
            </div>
          )}

          {/* 검색어가 있지만 결과가 없는 경우 */}
          {postsLoaded && hasQuery && !isLoading && resultCount === 0 && (
            <div className="flex flex-col items-center justify-center px-4 py-12">
              <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100
                  dark:bg-gray-700"
              >
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                검색 결과가 없습니다
              </h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                &apos;{searchQuery}&apos;에 대한 검색 결과를 찾을 수 없습니다.
                <br />
                다른 검색어를 시도해보세요.
              </p>
            </div>
          )}

          {/* 검색 결과 목록 */}
          {postsLoaded && hasQuery && !isLoading && resultCount > 0 && (
            <div className="p-4">
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                {resultCount}개의 검색 결과
              </div>

              <div className="space-y-3">
                {searchResults.map(post => (
                  <Link
                    key={`${post.category}-${post.slug}`}
                    href={`/posts/${post.slug}`}
                    onClick={onClose}
                    className="group block rounded-lg border border-gray-200 p-4 transition-all
                      duration-200 hover:border-blue-300 hover:shadow-md dark:border-gray-700
                      dark:hover:border-blue-600"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        {/* 카테고리 */}
                        <div className="mb-2">
                          <span
                            className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1
                              text-xs font-medium text-blue-800 capitalize dark:bg-blue-900
                              dark:text-blue-200"
                          >
                            <BookOpen className="mr-1 h-3 w-3" />
                            {post.category}
                          </span>
                        </div>

                        {/* 제목 - 검색어 하이라이팅 */}
                        <h3
                          className="mb-2 text-base font-medium text-gray-900 transition-colors
                            group-hover:text-blue-600 dark:text-white
                            dark:group-hover:text-blue-400"
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(post.title, searchQuery),
                          }}
                        />

                        {/* 요약 */}
                        <p className="mb-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                          {post.summary}
                        </p>

                        {/* 발행일 */}
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="mr-1 h-3 w-3" />
                          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 초기 상태 (검색어 없음) */}
          {postsLoaded && !hasQuery && !isLoading && (
            <div className="flex flex-col items-center justify-center px-4 py-12">
              <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100
                  dark:bg-blue-900"
              >
                <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                포스트 검색
              </h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                검색어를 입력하여 블로그 포스트를 찾아보세요.
                <br />
                제목, 요약, 카테고리를 기준으로 검색됩니다.
              </p>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div
          className="rounded-b-xl border-t border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700
            dark:bg-gray-900"
        >
          <div
            className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
          >
            <span>
              <kbd
                className="rounded border border-gray-300 bg-white px-2 py-1 text-xs
                  dark:border-gray-600 dark:bg-gray-800"
              >
                ESC
              </kbd>
              로 닫기
            </span>
            <span>Enter로 첫 번째 결과 열기</span>
          </div>
        </div>
      </div>
    </div>
  );
}
