'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CategoriesList } from '@/components/CategoriesList';
import { EmptyState } from '@/components/EmptyState';
import { MainListNav } from '@/components/MainListNav';
import PostList from '@/features/posts/components/PostList';
import type { CategoryInfo, PostSummary } from '@/lib/post';
import { computeInitialSlice, DEFAULT_PAGE_SIZE } from '@/lib/pagination';

type Props = {
  categories: CategoryInfo[];
  initialPosts: PostSummary[];
  total: number;
};

let postsRequest: Promise<PostSummary[]> | null = null;

function loadPosts() {
  postsRequest ??= fetch('/data/posts.json')
    .then(response => {
      if (!response.ok) throw new Error('포스트 목록을 불러오지 못했습니다.');
      return response.json() as Promise<{ items: PostSummary[] }>;
    })
    .then(payload => payload.items)
    .catch(error => {
      postsRequest = null;
      throw error;
    });
  return postsRequest;
}

export default function HomeContent({ categories, initialPosts, total }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || undefined;
  const pageValue = Number(searchParams.get('page') || '1');
  const page = Number.isFinite(pageValue) && pageValue > 0 ? pageValue : 1;
  const mode = searchParams.get('mode') === 'single' ? 'single' : 'cumulative';
  const [allPosts, setAllPosts] = useState<PostSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ensurePosts = useCallback(async () => {
    if (allPosts) return allPosts;
    try {
      const posts = await loadPosts();
      setAllPosts(posts);
      setError(null);
      return posts;
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : '포스트 목록을 불러오지 못했습니다.'
      );
      return null;
    }
  }, [allPosts]);

  useEffect(() => {
    if ((!category && page <= 1) || allPosts) return;

    let cancelled = false;
    loadPosts()
      .then(posts => {
        if (!cancelled) {
          setAllPosts(posts);
          setError(null);
        }
      })
      .catch(loadError => {
        if (!cancelled) {
          setError(
            loadError instanceof Error ? loadError.message : '포스트 목록을 불러오지 못했습니다.'
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [allPosts, category, page]);

  const filteredPosts = useMemo(
    () => {
      const source = allPosts ?? initialPosts;
      return category ? source.filter(post => post.category === category) : source;
    },
    [allPosts, category, initialPosts]
  );
  const visiblePosts = allPosts
    ? computeInitialSlice(filteredPosts, page, mode, DEFAULT_PAGE_SIZE)
    : category
      ? []
      : initialPosts;
  const resolvedTotal = allPosts ? filteredPosts.length : category ? 0 : total;
  const totalPages = Math.ceil(resolvedTotal / DEFAULT_PAGE_SIZE);
  const hasMore = page < totalPages;

  const loadMore = useCallback(async () => {
    const posts = await ensurePosts();
    if (!posts) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page + 1));
    params.set('mode', 'cumulative');
    router.replace(`${pathname}?${params}`, { scroll: false });
  }, [ensurePosts, page, pathname, router, searchParams]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-bg-inverse-white sticky top-0 z-10 flex flex-col gap-4 py-4">
        <MainListNav />
        <CategoriesList categories={categories} selectedCategory={category} />
      </div>
      {error ? (
        <p className="text-center text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : (category || page > 1) && !allPosts ? (
        <p className="text-text-secondary text-center text-sm" aria-live="polite">
          포스트 목록을 불러오는 중…
        </p>
      ) : visiblePosts.length === 0 ? (
        <EmptyState
          message={
            category
              ? `"${category}" 카테고리에 해당하는 포스트가 없습니다.`
              : '아직 작성된 포스트가 없습니다.'
          }
        />
      ) : (
        <PostList
          posts={visiblePosts}
          page={page}
          totalPages={totalPages}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      )}
    </div>
  );
}
