import { getBlogPosts } from "@/lib/post";
import { notFound } from "next/navigation";
import React from "react";
import { baseUrl } from "@/app/sitemap";
import { formatDate } from "@/lib/utils";
import { CustomMDX } from "@/components/MDX";
import { PostContent } from "@/components/PostContent";
import Link from "next/link";

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
    <>
      <section>
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
        <h1 className="title font-semibold text-2xl tracking-tighter">{post.metadata.title}</h1>
        <div className="flex justify-between items-center mt-2 mb-8 text-sm">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {formatDate(post.metadata.publishedAt)}
          </p>
        </div>
        <article className="prose">
          <PostContent content={post.content} />
        </article>
        <aside className="not-prose absolute -top-[200px] right-0 -mb-[100px] hidden h-[calc(100%+150px)] xl:block ">
          <div className="sticky bottom-0  top-[200px] z-10 ml-[5rem] mt-[200px] w-[200px]">
            <div className="mb-4 border-l px-4 py-2">
              <div className="mb-1 font-bold">On this page</div>
              <ul className="text-xs">
                <li className="font-medium text-pink-600 py-1 transition">
                  <Link href={`#${post.slug}`}>{post.metadata.title}</Link>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}

// export const dynamicParams = false;
