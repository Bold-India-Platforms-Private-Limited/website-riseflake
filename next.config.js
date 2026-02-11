/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Static export configuration
  images: {
    unoptimized: true,
    qualities: [75, 100],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
