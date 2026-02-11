/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    qualities: [75, 100],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
