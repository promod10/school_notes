import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow MDX content directory to be read during build
  serverExternalPackages: ['shiki', 'next-mdx-remote'],
  // Ensure MDX files are watched in dev mode
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
};

export default nextConfig;
