import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    loader: 'custom',
    loaderFile: './src/lib/staticImageLoader.ts',
    deviceSizes: [320, 360, 480, 640, 768],
    imageSizes: [160, 240],
  },
};

export default nextConfig;
