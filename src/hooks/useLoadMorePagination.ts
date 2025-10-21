'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DEFAULT_PAGE_SIZE } from '@/lib/pagination';

export type FetchPage<T> = (
  page: number,
  pageSize: number,
  ctx?: Record<string, unknown>
) => Promise<{ items: T[]; total: number }>;

export interface UseLoadMoreOptions<T> {
  fetchPage: FetchPage<T>;
  initialPage?: number; // default 1
  pageSize?: number; // default 10 (URL에는 노출하지 않음)
  mode?: 'cumulative' | 'single'; // default 'cumulative' (URL ?mode 가 우선)
  initialData?: { items: T[]; total: number; initialPageHydrated?: number };
  ctx?: Record<string, unknown>; // fetcher에 전달할 고정 컨텍스트(예: category)
}

export type UseLoadMoreReturn<T> = {
  items: T[];
  page: number;
  totalPages: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  loadMore: () => Promise<void>;
  setPage: (nextPage: number) => void;
};

export function useLoadMorePagination<T>(opts: UseLoadMoreOptions<T>): UseLoadMoreReturn<T> {
  const {
    fetchPage,
    initialPage = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    mode = 'cumulative',
    initialData,
    ctx,
  } = opts;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialUrlPage = (() => {
    const raw = searchParams?.get('page');
    const n = Number(raw || '1');
    return Number.isFinite(n) && n > 0 ? n : 1;
  })();

  const resolvedInitialPage = initialData?.initialPageHydrated || initialPage || initialUrlPage;

  const [page, setPageState] = useState<number>(resolvedInitialPage);
  const [items, setItems] = useState<T[]>(() => initialData?.items ?? []);
  const [total, setTotal] = useState<number>(initialData?.total ?? 0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const inflight = useRef<Promise<void> | null>(null);

  const totalPages = useMemo(() => {
    return total > 0 ? Math.ceil(total / pageSize) : 0;
  }, [total, pageSize]);

  const hasMore = useMemo(() => page < totalPages, [page, totalPages]);

  const resolvedMode = useMemo<'cumulative' | 'single'>(() => {
    const m = (searchParams?.get('mode') || '').toLowerCase();
    if (m === 'single' || m === 'cumulative') return m as 'cumulative' | 'single';
    return mode;
  }, [mode, searchParams]);

  const updateUrlPage = useCallback(
    (nextPage: number) => {
      try {
        const currentPage = Number(searchParams?.get('page') || '1');
        const hasPageParam = searchParams?.has('page');

        // 변경 없음 가드
        // console.log('nextPage', nextPage);
        if ((nextPage <= 1 && !hasPageParam) || currentPage === nextPage) {
          return;
        }

        const sp = new URLSearchParams(searchParams?.toString());
        if (nextPage <= 1) {
          sp.delete('page');
        } else {
          sp.set('page', String(nextPage));
        }

        const nextSearch = sp.toString();
        const currentSearch = searchParams?.toString() || '';
        if (nextSearch === currentSearch) return;

        // pageSize는 URL에 노출하지 않음
        router.replace(`${pathname}?${nextSearch}`, { scroll: false });
      } catch {
        // no-op: URL 갱신 실패는 기능에 치명적이지 않음
      }
    },
    [pathname, router, searchParams]
  );

  const setPage = useCallback(
    (nextPage: number) => {
      setPageState(nextPage);
      updateUrlPage(nextPage);
    },
    [updateUrlPage]
  );

  const loadMore = useCallback(async () => {
    if (isLoading || inflight.current || !hasMore) return;
    setIsLoading(true);
    setError(null);

    const targetPage = page + 1;
    const task = (async () => {
      try {
        const { items: newItems, total: newTotal } = await fetchPage(targetPage, pageSize, ctx);
        setTotal(newTotal);
        if (resolvedMode === 'single' && items.length === 0) {
          // 초기가 비어있는 단일 페이지 모드(희귀 케이스)
          setItems(newItems);
        } else {
          // 누적 또는 단일 모두 클릭 시에는 이어붙임
          setItems(prev => [...prev, ...newItems]);
        }
        setPageState(targetPage);
        updateUrlPage(targetPage);
      } catch (e: any) {
        setError(e?.message || '로드 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
        inflight.current = null;
      }
    })();

    inflight.current = task;
    await task;
  }, [
    ctx,
    fetchPage,
    hasMore,
    isLoading,
    items.length,
    resolvedMode,
    page,
    pageSize,
    updateUrlPage,
  ]);

  // 카테고리 변경 또는 초기 데이터 변경 시 상태를 초기화
  useEffect(() => {
    if (!initialData) return;
    setItems(initialData.items ?? []);
    setTotal(initialData.total ?? 0);
    const urlPage = (() => {
      const raw = searchParams?.get('page');
      const n = Number(raw || '1');
      return Number.isFinite(n) && n > 0 ? n : 1;
    })();
    setPageState(initialData.initialPageHydrated || initialPage || urlPage);
    // URL은 서버 렌더 결과가 이미 반영되어 있음. 여기서 replace를 호출하지 않음.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, ctx, pageSize, mode, searchParams]);

  return {
    items,
    page,
    totalPages,
    hasMore,
    isLoading,
    error,
    loadMore,
    setPage,
  };
}
