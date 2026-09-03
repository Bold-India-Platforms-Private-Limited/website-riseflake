import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The repo sits in a monorepo with a nested resume/ lockfile — pin tracing to
  // this app so `next build` doesn't scan the whole tree during "Collecting
  // build traces".
  outputFileTracingRoot: __dirname,
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
  // Canonical redirects for faceted browse slugs whose real home is an existing
  // dedicated page. Done here (not in the RSC render) so crawlers get a real HTTP
  // 308 — the /internships and /jobs segments have loading.tsx boundaries that
  // would otherwise make redirect() fall back to a 200 + meta-refresh.
  async redirects() {
    const domainInternships = [
      'software-development', 'web-development', 'marketing', 'data-science',
      'design', 'finance', 'content-writing', 'human-resources', 'sales', 'operations',
    ];
    // Kept in sync with src/lib/facets.ts CITIES (minus 'remote').
    const cities = [
      'bangalore', 'mumbai', 'delhi', 'hyderabad', 'pune', 'chennai',
      'kolkata', 'ahmedabad', 'gurgaon', 'noida', 'jaipur', 'indore',
      'chandigarh', 'coimbatore', 'kochi', 'lucknow', 'nagpur', 'bhopal',
      'surat', 'kanpur', 'visakhapatnam', 'thiruvananthapuram', 'nashik',
      'vadodara', 'mysore', 'mangalore', 'bhubaneswar', 'guwahati', 'patna',
      'dehradun', 'raipur', 'ranchi',
    ];
    return [
      {
        source: '/internships/browse/work-from-home-internships',
        destination: '/internships/work-from-home',
        permanent: true,
      },
      ...domainInternships.map((d) => ({
        source: `/internships/browse/${d}-internships`,
        destination: `/internships/${d}`,
        permanent: true,
      })),
      ...cities.flatMap((c) => [
        {
          source: `/internships/browse/internships-in-${c}`,
          destination: `/internships-in/${c}`,
          permanent: true,
        },
        {
          source: `/jobs/browse/jobs-in-${c}`,
          destination: `/jobs-in/${c}`,
          permanent: true,
        },
      ]),
    ];
  },
};

export default nextConfig;
