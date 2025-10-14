import { getBlogPosts, getPostBySlug, getPostsBySeries } from '@/lib/post';
import { notFound } from 'next/navigation';
import React from 'react';
import { baseUrl } from '@/app/sitemap';
import { PostContent } from '@/components/PostContent';
import { PostHeader } from '@/components/PostHeader';
import { TableOfContents } from '@/components/TableOfContents';
import { RelatedPosts } from '@/components/RelatedPosts';
import Link from 'next/link';
import { SeriesPosts } from '@/components/SeriesPosts';
import Giscus from '@/components/Giscus';
import SeriesPrevNextNav from '@/components/SeriesPrevNextNav';

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = getBlogPosts();
  const post = all.find(p => p.slug === slug);
  if (!post) return;

  const { title, publishedAt: publishedTime, summary: description, image } = post.metadata;
  const ogImage = image ? image : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/posts/${post.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = getBlogPosts();
  const post = all.find(p => p.slug === slug);
  if (!post) {
    notFound();
  }

  const seriesPosts = post?.series ? getPostsBySeries(post.category, post.series) : [];
  console.log({ seriesPosts });
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/posts/${post.slug}`,
            author: { '@type': 'Person', name: 'My Portfolio' },
          }),
        }}
      />

      <div className="mb-6">
        <nav className="mb-4 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/posts" className="hover:text-blue-600 dark:hover:text-blue-400">
            포스트
          </Link>
          <span>/</span>
          <Link
            href={`/categories/${post.category}`}
            className="capitalize hover:text-blue-600 dark:hover:text-blue-400"
          >
            {post.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100">{post.metadata.title}</span>
        </nav>
      </div>

      <div className="flex gap-8">
        <main className="min-w-0 flex-1">
          <article className="prose max-w-none">
            <PostHeader
              category={post.category}
              title={post.metadata.title}
              publishedAt={post.metadata.publishedAt}
              readingTime={post.readingTime}
            />
            {post.series && (
              <SeriesPosts
                currentPostSlug={post.slug}
                seriesPosts={seriesPosts}
                seriesName={post.series}
              />
            )}
            <PostContent content={post.content} />
          </article>

          <RelatedPosts currentPost={post} />
          <Giscus />
          {post.series && (
            <SeriesPrevNextNav
              currentPostSlug={post.slug}
              seriesPosts={seriesPosts}
              seriesName={post.series}
            />
          )}
        </main>
        <div className="hidden xl:block">
          <TableOfContents />
        </div>
      </div>
    </div>
  );
}
