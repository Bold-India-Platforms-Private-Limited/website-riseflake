/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Static export configuration
  images: {
    unoptimized: true,
  },
  // For Cloudflare Pages compatibility
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
