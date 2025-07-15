import { getBlogPosts, getAllCategories } from "@/lib/post";

export const baseUrl = "http://localhost:3000";

export default async function sitemap() {
  // 개별 포스트들
  const posts = getBlogPosts().map((post) => ({
    url: `${baseUrl}/posts/${post.category}/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  // 카테고리 페이지들
  const categories = getAllCategories().map((category) => ({
    url: `${baseUrl}/posts/${category.name}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  // 기본 라우트들
  const routes = ["", "/posts", "/about"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...categories, ...posts];
}
