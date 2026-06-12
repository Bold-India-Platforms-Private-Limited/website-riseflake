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
      // Blog cover images can be hosted on various CDNs via admin upload
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.riseflake.com',
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
