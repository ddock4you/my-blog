import { CustomMDX } from './MDX';

export function PostContent({ content }: { content: string }) {
  return <CustomMDX source={content} />;
}
