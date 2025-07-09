import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Callout from "@/components/Callout";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => <h2 className="text-2xl font-bold">{children}</h2>,
    img: (props) => <Image {...props} alt={props.alt} />,
    callout: ({ children }) => <Callout>{children}</Callout>,
    ...components,
  };
}
