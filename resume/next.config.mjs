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
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.RESUME_NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyARV7w9uOqCge7iQ2fXNRgozoOU9JDTzZo',
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.RESUME_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'riseflake.firebaseapp.com',
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.RESUME_NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'riseflake',
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.RESUME_NEXT_PUBLIC_FIREBASE_APP_ID || '1:527050241418:web:49f59fa296916874c0c473',
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
