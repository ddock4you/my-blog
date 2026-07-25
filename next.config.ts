import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
  images: {
    deviceSizes: [320, 360, 480, 640, 768],
    imageSizes: [160, 240],
    formats: ['image/webp'],
    qualities: [30, 75],
  },
};

export default nextConfig;
