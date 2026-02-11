/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    qualities: [75, 100],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
