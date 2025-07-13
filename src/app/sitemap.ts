import { getBlogPosts } from "@/lib/post";

export const baseUrl = "http://localhost:3000";

export default async function sitemap() {
  let posts = getBlogPosts().map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  let routes = ["", "/posts"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...posts];
}
