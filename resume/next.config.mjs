/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/resume',
  reactStrictMode: true,
  devIndicators: false,
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.RESUME_NEXT_PUBLIC_API_BASE_URL || 'https://resume-builder-api-five.vercel.app',
    NEXT_PUBLIC_ENVIRONMENT: process.env.RESUME_NEXT_PUBLIC_ENVIRONMENT || 'production',
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.RESUME_NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_S7CmsWZjSwRDHD',
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
};

export default nextConfig;
