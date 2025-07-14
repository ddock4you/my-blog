import { getBlogPosts } from "@/lib/post";
import { notFound } from "next/navigation";
import React from "react";
import { baseUrl } from "@/app/sitemap";
import { formatDate } from "@/lib/utils";
import { CustomMDX } from "@/components/MDX";
import { PostContent } from "@/components/PostContent";
import { TableOfContents } from "@/components/TableOfContents";
import Link from "next/link";
import Giscus from "@/components/Giscus";

// export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
//   const { slug } = await params;
//   const { default: Post } = await import(`@/contents/${slug}.mdx`);
//   return <Post />;
// }

export async function generateStaticParams() {
  let posts = getBlogPosts();

  // console.log({ posts });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post = getBlogPosts().find((post) => post.slug === slug);
  if (!post) {
    return;
  }

  let { title, publishedAt: publishedTime, summary: description, image } = post.metadata;
  let ogImage = image ? image : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Blog({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post = getBlogPosts().find((post) => post.slug === slug);
  // console.log({ post });
  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/posts/${post.slug}`,
            author: {
              "@type": "Person",
              name: "My Portfolio",
            },
          }),
        }}
      />

      <div className="flex gap-8">
        {/* 메인 콘텐츠 */}
        <main className="flex-1 min-w-0">
          <article className="prose max-w-none">
            <h1 className="title font-semibold text-2xl tracking-tighter mb-4">
              {post.metadata.title}
            </h1>
            <div className="flex justify-between items-center mt-2 mb-8 text-sm">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {formatDate(post.metadata.publishedAt)}
              </p>
            </div>
            <PostContent content={post.content} />
          </article>
          <Giscus />
        </main>
        {/* 목차 사이드바 - 데스크톱에서만 표시 */}
        <div className="hidden xl:block">
          <TableOfContents />
        </div>
      </div>
    </div>
  );
}

// export const dynamicParams = false;
