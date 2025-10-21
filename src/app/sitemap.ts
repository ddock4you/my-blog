import { getBlogPosts, getAllCategories, getAllSeries } from '@/lib/post';

export const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://my-blog-lake-ten.vercel.app';

export default async function sitemap() {
  const isoToday = new Date().toISOString();

  // 개별 포스트들: 발행일을 lastModified로 사용
  const posts = getBlogPosts().map(post => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.metadata.publishedAt).toISOString(),
  }));

  // 카테고리 페이지들: 카테고리 내 최신 포스트의 날짜 사용
  const categories = getAllCategories().map(category => {
    const related = getBlogPosts().filter(p => p.category === category.slug);
    const last = related.sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
    )[0];
    return {
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: last ? new Date(last.metadata.publishedAt).toISOString() : isoToday,
    };
  });

  // 기본 라우트들: 오늘 기준
  const routes = ['', '/posts', '/about', '/series'].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: isoToday,
  }));

  // 시리즈 페이지들: 시리즈 마지막 발행일
  const series = getAllSeries().map(s => ({
    url: `${baseUrl}/series/${s.slug}`,
    lastModified: new Date(s.lastPublishedAt).toISOString(),
  }));

  return [...routes, ...categories, ...series, ...posts];
}
