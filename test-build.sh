cd /Users/gk/Downloads/website-riseflake-main/resume
npm install --no-package-lock
cat << 'INNER_EOF' > next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  basePath: '/resume',
  output: 'export',
  trailingSlash: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    unoptimized: true,
    remotePatterns: [ { protocol: 'https', hostname: 'avatars.githubusercontent.com' } ],
  },
};
export default nextConfig;
INNER_EOF
npx next build
