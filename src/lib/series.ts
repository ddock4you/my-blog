export type SeriesMeta = {
  title: string;
  description?: string;
};

// 시리즈 이름(프론트 메타의 `series` 값) -> 메타 정보 매핑
export const SERIES_REGISTRY: Record<string, SeriesMeta> = {
  // 예시)
  vim: {
    title: 'Vim 가이드',
    description: '기초부터 실전까지 Vim 생산성 올인원 시리즈',
  },
};
