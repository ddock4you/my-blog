'use client';

import { useEffect, useMemo, useState } from 'react';
import type { SearchIndexItem } from '@/lib/post';

export type SearchResult = SearchIndexItem & {
  matchScore: number;
};

export function useSearch(allPosts: SearchIndexItem[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const searchResults = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return allPosts
      .map(post => {
        const title = post.title.toLowerCase();
        const summary = post.summary.toLowerCase();
        const category = post.category.toLowerCase();
        const categoryName = post.categoryName.toLowerCase();
        let matchScore = 0;

        if (title.includes(normalizedQuery)) {
          matchScore +=
            title === normalizedQuery ? 100 : title.startsWith(normalizedQuery) ? 80 : 60;
        }
        if (summary.includes(normalizedQuery)) matchScore += 20;
        if (category.includes(normalizedQuery) || categoryName.includes(normalizedQuery)) {
          matchScore += 10;
        }

        return matchScore > 0 ? { ...post, matchScore } : null;
      })
      .filter((post): post is SearchResult => post !== null)
      .sort((a, b) => {
        const aSeries = (a.series || '').trim().toLowerCase();
        const bSeries = (b.series || '').trim().toLowerCase();

        if (aSeries && aSeries === bSeries) {
          const ai = a.seriesIndex ?? Number.NEGATIVE_INFINITY;
          const bi = b.seriesIndex ?? Number.NEGATIVE_INFINITY;
          if (ai !== bi) return bi - ai;
        }

        if (a.matchScore !== b.matchScore) return b.matchScore - a.matchScore;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
  }, [allPosts, debouncedQuery]);

  const isLoading = searchQuery.trim() !== debouncedQuery.trim();

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading: isLoading && searchQuery.trim().length > 0,
    hasQuery: debouncedQuery.trim().length > 0,
    resultCount: searchResults.length,
  };
}
