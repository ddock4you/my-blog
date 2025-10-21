export const DEFAULT_PAGE_SIZE = 10;

export type PaginationMode = 'cumulative' | 'single';

export function computeInitialSlice<T>(
  items: T[],
  page: number,
  mode: PaginationMode,
  pageSize: number = DEFAULT_PAGE_SIZE
): T[] {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  if (mode === 'single') {
    const start = (safePage - 1) * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  }
  const end = Math.min(items.length, safePage * pageSize);
  return items.slice(0, end);
}
