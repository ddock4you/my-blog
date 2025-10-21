'use client';

import { useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { SearchResult, useSearch } from '@/hooks/useSearch';
import { Input } from './ui/input';
import { Button } from './ui/button';
import SearchedPost from './SearchedPost';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchHeaderProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  postsLoaded: boolean;
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
        className="mx-4 mt-20 flex max-h-[70vh] w-full max-w-2xl flex-col rounded-sm bg-white
          shadow-2xl dark:bg-gray-800"
        onClick={e => e.stopPropagation()}
      >
        {/* 검색 헤더 */}
        <SearchHeader
          inputRef={inputRef}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          postsLoaded={postsLoaded}
          onClose={onClose}
        />

        {/* 검색 바디 */}
        <div className="mb-4 flex-1 overflow-y-auto">
          {/* 포스트 데이터 로딩 중 */}
          {!postsLoaded && <SearchLoadingState message="포스트 데이터 로딩 중..." />}

          {/* 검색 로딩 상태 */}
          {postsLoaded && isLoading && <SearchLoadingState message="검색 중..." />}

          {/* 검색어가 있지만 결과가 없는 경우 */}
          {postsLoaded && hasQuery && !isLoading && resultCount === 0 && (
            <SearchEmptyState searchQuery={searchQuery} />
          )}

          {/* 검색 결과 목록 */}
          {postsLoaded && hasQuery && !isLoading && resultCount > 0 && (
            <SearchResults
              searchResults={searchResults}
              resultCount={resultCount}
              searchQuery={searchQuery}
              onClose={onClose}
            />
          )}

          {/* 초기 상태 (검색어 없음) */}
          {postsLoaded && !hasQuery && !isLoading && <SearchInitialState />}
        </div>
      </div>
    </div>
  );
}

function SearchHeader({
  inputRef,
  searchQuery,
  setSearchQuery,
  postsLoaded,
  onClose,
}: SearchHeaderProps) {
  return (
    <div className="flex items-center border-b border-gray-200 p-1 dark:border-gray-700">
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="검색 내용을 입력해 주세요."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full border-none py-3 pr-4 pl-10 text-lg text-gray-900 placeholder-gray-500
            shadow-none outline-none dark:text-white dark:placeholder-gray-400"
          disabled={!postsLoaded}
        />
      </div>
      <Button
        onClick={onClose}
        aria-label="검색 모달 닫기"
        variant="ghost"
        size="icon"
        className="ml-3 flex items-center justify-center rounded-lg text-gray-400 transition-colors
          hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
}

function SearchLoadingState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-gray-500 dark:text-gray-300" />
      <span className="ml-2 text-gray-600 dark:text-gray-300">{message}</span>
    </div>
  );
}

function SearchEmptyState({ searchQuery }: { searchQuery: string }) {
  return (
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
  );
}

function SearchInitialState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      <p className="text-center text-gray-500 dark:text-gray-400">
        검색어를 입력하여 블로그 포스트를 찾아보세요.
        <br />
        제목, 요약, 카테고리를 기준으로 검색됩니다.
      </p>
    </div>
  );
}

function SearchResults({
  searchResults,
  resultCount,
  searchQuery,
  onClose,
}: {
  searchResults: SearchResult[];
  resultCount: number;
  searchQuery: string;
  onClose: () => void;
}) {
  return (
    <div className="p-4 pb-0">
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {resultCount}개의 검색 결과
      </div>

      <div className="space-y-3">
        {searchResults.map(post => (
          <SearchedPost
            key={`${post.category}-${post.slug}`}
            post={post}
            highlightQuery={searchQuery}
            onClick={onClose}
          />
        ))}
      </div>
    </div>
  );
}

// 기존 SearchResultItem 컴포넌트는 PostCard로 대체되었습니다.

function SearchFooter() {
  return (
    <div
      className="border-t border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700
        dark:bg-gray-900"
    ></div>
  );
}
