/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.riseflake.com',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/resume',
        destination: '/resume/index.html',
      },
      {
        source: '/resume/:path((?!_next|icons|.*\\.).*)',
        destination: '/resume/:path*.html',
      },
    ];
  },
};

export default nextConfig;
