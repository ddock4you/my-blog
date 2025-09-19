'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchData } from '@/contexts/SearchContext';
import type { PostWithCategory } from '@/lib/post';

export interface SearchResult extends PostWithCategory {
  matchScore: number;
  // SearchModal에서 사용하는 필드들을 최상위 레벨에도 추가
  title: string;
  summary: string;
  publishedAt: string;
}

export function useSearch() {
  const { searchData: allPosts } = useSearchData(); // Context에서 검색용 데이터 가져오기
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 데이터가 이미 준비되어 있으므로 postsLoaded는 항상 true
  const postsLoaded = true;

  // 디바운싱 효과
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 검색 결과 계산
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return [];
    }

    setIsLoading(true);

    const query = debouncedQuery.toLowerCase().trim();
    const results: SearchResult[] = [];

    allPosts.forEach(searchPost => {
      const title = searchPost.title.toLowerCase();
      const summary = searchPost.summary.toLowerCase();
      const category = searchPost.category.toLowerCase();
      const categoryName = searchPost.categoryName.toLowerCase();

      let matchScore = 0;

      // 제목에서 일치하는 경우 (가장 높은 점수)
      if (title.includes(query)) {
        if (title === query) {
          matchScore += 100; // 완전 일치
        } else if (title.startsWith(query)) {
          matchScore += 80; // 시작 부분 일치
        } else {
          matchScore += 60; // 부분 일치
        }
      }

      // 요약에서 일치하는 경우
      if (summary.includes(query)) {
        matchScore += 20;
      }

      // 카테고리에서 일치하는 경우 (영어 slug와 한글 이름 모두 검색)
      if (category.includes(query) || categoryName.includes(query)) {
        matchScore += 10;
      }

      // 매치 점수가 있는 경우에만 결과에 포함
      if (matchScore > 0) {
        // SearchData를 PostWithCategory 형태로 변환
        const postWithCategory: PostWithCategory = {
          metadata: {
            title: searchPost.title,
            publishedAt: searchPost.publishedAt,
            summary: searchPost.summary,
            image: searchPost.image,
          },
          slug: searchPost.slug,
          content: '', // 검색 결과에서는 content가 필요하지 않음
          category: searchPost.category,
          categoryName: searchPost.categoryName,
          fullPath: `${searchPost.category}/${searchPost.slug}`,
          image: searchPost.image,
          readingTime: 0, // 검색 결과에서는 읽기 시간이 필요하지 않음
        };

        results.push({
          ...postWithCategory,
          matchScore,
          // SearchModal에서 사용하는 필드들을 최상위 레벨에도 추가
          title: searchPost.title,
          summary: searchPost.summary,
          publishedAt: searchPost.publishedAt,
        });
      }
    });

    // 매치 점수 순으로 정렬
    const sortedResults = results.sort((a, b) => b.matchScore - a.matchScore);

    setIsLoading(false);
    return sortedResults;
  }, [debouncedQuery, allPosts]);

  // 검색어 하이라이팅을 위한 함수
  const highlightMatch = (text: string, query: string) => {
    // text나 query가 없으면 원본 텍스트 반환
    if (!text || !query || !query.trim()) return text;

    try {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedQuery})`, 'gi');
      return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
    } catch (error) {
      // 정규식 오류가 발생하면 원본 텍스트 반환
      console.warn('정규식 처리 중 오류 발생:', error);
      return text;
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading: isLoading && debouncedQuery.length > 0,
    hasQuery: debouncedQuery.trim().length > 0,
    resultCount: searchResults.length,
    highlightMatch: (text: string, query?: string) => highlightMatch(text, query || debouncedQuery),
    postsLoaded,
  };
}
