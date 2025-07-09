import { MDXProvider } from "@mdx-js/react";
import { useMDXComponents } from "@/mdx-components";

export default function Layout({ children }: { children: React.ReactNode }) {
  // const components = useMDXComponents({});

  // return <MDXProvider components={components}>{children}</MDXProvider>;

  return (
    <div className="prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg dark:prose-headings:text-white">
      {children}
    </div>
  );
}
