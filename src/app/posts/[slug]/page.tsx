import { getBlogPosts, getPostsBySeries } from '@/lib/post';
import { notFound } from 'next/navigation';
import React from 'react';
import { buildBlogPostingJsonLd, buildBreadcrumbJsonLd } from '@/lib/seo';
import { baseUrl } from '@/app/sitemap';
import { PostContent } from '@/components/PostContent';
import { PostHeader } from '@/components/PostHeader';
import { SeriesTableOfContents } from '@/features/series/components/SeriesTableOfContents';
import SeriesPrevNextNav from '@/features/series/components/SeriesPrevNextNav';
import { getSeriesMeta } from '@/lib/series';
import GiscusClient from '@/components/GiscusClient';

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
  const ogImage = image ? image : `${baseUrl}/opengraph-image?title=${encodeURIComponent(title)}`;

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
  const seriesMeta = post?.series ? getSeriesMeta(post.series) : null;
  const seriesPosts = post?.series ? getPostsBySeries(post.category, post.series) : [];
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBlogPostingJsonLd({
              headline: post.metadata.title,
              description: post.metadata.summary,
              datePublished: post.metadata.publishedAt,
              authorName: 'Dev Thinking',
              url: `${baseUrl}/posts/${post.slug}`,
              imageUrl:
                post.metadata.image ||
                `${baseUrl}/opengraph-image?title=${encodeURIComponent(post.metadata.title)}`,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbJsonLd([
              { name: '홈', url: `${baseUrl}/` },
              { name: '포스트', url: `${baseUrl}/posts` },
              { name: post.metadata.title, url: `${baseUrl}/posts/${post.slug}` },
            ])
          ),
        }}
      />
      <main className="flex w-full flex-col gap-12 pb-11">
        <PostHeader
          category={post.category}
          title={post.metadata.title}
          publishedAt={post.metadata.publishedAt}
          readingTime={post.readingTime}
          seriesMeta={seriesMeta ?? null}
        />
        {seriesMeta && (
          <SeriesTableOfContents
            currentPostSlug={post.slug}
            seriesPosts={seriesPosts}
            seriesName={seriesMeta.title}
          />
        )}
        <div className="prose md:prose-lg dark:prose-invert prose-inline-code">
          <PostContent content={post.content} />
        </div>
        <GiscusClient />
        {seriesMeta && (
          <SeriesPrevNextNav
            currentPostSlug={post.slug}
            seriesPosts={seriesPosts}
            seriesName={seriesMeta.title}
          />
        )}
      </main>
    </>
  );
}
