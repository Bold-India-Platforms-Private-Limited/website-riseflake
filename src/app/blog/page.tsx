import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { BLOG_API_URL, WEBSITE_BASE_URL, hreflangAlternates } from '../../lib/config'
import { getStaticBlogSummaries } from '../../lib/staticBlogPosts'
import { BlogListingView, type BlogCategory, type BlogPost } from './BlogListing'
import BlogListingClient from './BlogListingClient'

// ─── Metadata ─────────────────────────────────────────────────────────────────
// Static export: one page for /blog. `?category=` / `?tag=` / `?search=` / `?page=`
// variants were already canonicalised to /blog (and tag/search noindexed), so nothing
// SEO-relevant is lost by serving the same HTML for all of them.

export function generateMetadata(): Metadata {
  const title = 'Blog — Career Advice, Tech Insights & Campus Life'
  const description =
    'Expert articles on career tips, internships, tech engineering, campus life and company spotlights from the Riseflake team.'
  const canonicalUrl = `${WEBSITE_BASE_URL}/blog`
  return {
    title,
    description,
    keywords: 'riseflake blog, career tips india, internship advice, tech articles, campus life, job search tips, freshers guide',
    alternates: { canonical: canonicalUrl, ...hreflangAlternates(canonicalUrl) },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Riseflake',
      type: 'website',
      locale: 'en_IN',
      images: [{ url: `${WEBSITE_BASE_URL}/og-blog-default.png`, width: 1200, height: 630, alt: 'Riseflake Blog' }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@riseflake',
      title,
      description,
      images: [`${WEBSITE_BASE_URL}/og-blog-default.png`],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  }
}

// ─── Data fetching ────────────────────────────────────────────────────────────

async function fetchBlogs(params: Record<string, string> = {}): Promise<{ blogs: BlogPost[]; total: number }> {
  try {
    const qs  = new URLSearchParams({ limit: '12', ...params }).toString()
    const res = await fetch(`${BLOG_API_URL}/blogs/public?${qs}`, { next: { revalidate: 300 } })
    if (!res.ok) return { blogs: [], total: 0 }
    const data = await res.json()
    return { blogs: data.blogs ?? [], total: data.total ?? 0 }
  } catch {
    return { blogs: [], total: 0 }
  }
}

async function fetchCategories(): Promise<BlogCategory[]> {
  try {
    const res = await fetch(`${BLOG_API_URL}/blogs/public/categories`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const data = await res.json()
    return data.categories ?? []
  } catch {
    return []
  }
}

// ─── JSON-LD schemas ──────────────────────────────────────────────────────────

const blogIndexSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  '@id': `${WEBSITE_BASE_URL}/blog`,
  name: 'Riseflake Blog',
  description: 'Career tips, internship guides, tech insights and campus life stories.',
  url: `${WEBSITE_BASE_URL}/blog`,
  publisher: {
    '@type': 'Organization',
    name: 'Riseflake',
    url: WEBSITE_BASE_URL,
    logo: { '@type': 'ImageObject', url: `${WEBSITE_BASE_URL}/logo.png`, width: 200, height: 60 },
  },
  inLanguage: 'en-IN',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: `${WEBSITE_BASE_URL}/blog` },
  ],
}

// WebSite schema — enables Google sitelinks searchbox
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Riseflake',
  url: WEBSITE_BASE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${WEBSITE_BASE_URL}/jobs?search={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPage() {
  const [{ blogs }, categories] = await Promise.all([
    // Every post goes into the static HTML; the blog is small (well under this cap).
    fetchBlogs({ limit: '100' }),
    fetchCategories(),
  ])

  // Merge in the hand-written static posts (they win over a CMS post with the same slug).
  const staticSummaries = getStaticBlogSummaries()
  const posts = [...staticSummaries, ...blogs.filter((b) => !staticSummaries.some((s) => s.slug === b.slug))]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogIndexSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />

      <Navbar bgTransparent />

      <main className="min-h-screen bg-slate-50 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero */}
          <header className="text-center py-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Riseflake Blog</h1>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
              Career tips, internship guides, tech insights and campus life stories — all in one place.
            </p>
          </header>

          {/* The fallback IS the full unfiltered list, so the static HTML contains every post;
              the client component then applies ?category= / ?tag= / ?search= in the browser. */}
          <Suspense fallback={<BlogListingView posts={posts} categories={categories} />}>
            <BlogListingClient posts={posts} categories={categories} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  )
}
