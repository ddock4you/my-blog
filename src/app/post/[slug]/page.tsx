import React from "react";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  console.log({ slug });
  const { default: Post } = await import(`@/contents/${slug}.mdx`);
  return <Post />;
}

export function generateStaticParams() {
  return [{ slug: "welcome" }, { slug: "about" }, { slug: "test" }];
}

export const dynamicParams = false;
