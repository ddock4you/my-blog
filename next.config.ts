import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
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
