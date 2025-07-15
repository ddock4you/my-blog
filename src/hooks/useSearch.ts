"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchData } from "@/contexts/SearchContext";

export interface SearchPost {
  slug: string;
  category: string;
  title: string;
  summary: string;
  publishedAt: string;
  image?: string;
}

export interface SearchResult extends SearchPost {
  matchScore: number;
}

export function useSearch() {
  const { searchData: allPosts } = useSearchData(); // Context에서 데이터 가져오기
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
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

    allPosts.forEach((post) => {
      const title = post.title.toLowerCase();
      const summary = post.summary.toLowerCase();
      const category = post.category.toLowerCase();

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

      // 카테고리에서 일치하는 경우
      if (category.includes(query)) {
        matchScore += 10;
      }

      // 매치 점수가 있는 경우에만 결과에 포함
      if (matchScore > 0) {
        results.push({
          ...post,
          matchScore,
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
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading: isLoading && debouncedQuery.length > 0,
    hasQuery: debouncedQuery.trim().length > 0,
    resultCount: searchResults.length,
    highlightMatch,
    postsLoaded,
  };
}
