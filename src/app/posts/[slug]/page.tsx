import { getBlogPosts, getPostsBySeries } from '@/lib/post';
import { notFound } from 'next/navigation';
import React from 'react';
import { baseUrl } from '@/app/sitemap';
import { PostContent } from '@/components/PostContent';
import { PostHeader } from '@/components/PostHeader';
import { SeriesTableOfContents } from '@/components/SeriesTableOfContents';
import Giscus from '@/components/Giscus';
import SeriesPrevNextNav from '@/components/SeriesPrevNextNav';
import { getSeriesMeta } from '@/lib/series';

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
  const seriesMeta = post?.series ? getSeriesMeta(post.series) : null;
  const seriesPosts = post?.series ? getPostsBySeries(post.category, post.series) : [];
  return (
    <>
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
        <div className="prose prose-sm md:prose-base dark:prose-invert">
          <PostContent content={post.content} />
        </div>
        <Giscus />
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
