/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/resume',
  reactStrictMode: true,
  devIndicators: false,
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.RESUME_NEXT_PUBLIC_API_BASE_URL || 'https://backend.riseflake.com',
    NEXT_PUBLIC_ENVIRONMENT: process.env.RESUME_NEXT_PUBLIC_ENVIRONMENT || 'production',
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.RESUME_NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAADR3vt6rRrmI-T-k',
  },
  eslint: {
    dirs: [
      'stories',
      'src/__test__',
      'src/common',
      'src/helpers',
      'src/modules',
      'src/pages',
      'src/styles',
      'src/templates',
    ],
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        stream: false,
        'readable-stream': false,
      }
    }
    return config
  },
};

export default nextConfig;
