import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
  images: {
    deviceSizes: [160, 480, 768],
    imageSizes: [320, 480, 768],
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    return [
      {
        source: '/contents/:path*',
        destination: '/api/contents/:path*',
      },
    ];
  },
};

export default nextConfig;
