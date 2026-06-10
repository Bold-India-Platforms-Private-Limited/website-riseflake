import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { BLOG_API_URL, WEBSITE_BASE_URL } from '../../lib/config'

export const revalidate = 300 // ISR: 5 min

// ─── Metadata (dynamic — varies by searchParams) ───────────────────────────────

type SearchParams = { category?: string; tag?: string; search?: string; page?: string }

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { category, tag, search, page } = searchParams
  const pageNum = parseInt(page || '1')

  // Base canonical always points to /blog (page 1, no filters) — avoids duplicate indexing
  const canonicalUrl = `${WEBSITE_BASE_URL}/blog`

  // ?search= and ?tag= are thin/query pages → noindex, follow
  // ?category= and ?page= are indexable content
  const isThinPage  = !!search || !!tag
  const isPaginated = pageNum > 1

  // Build contextual title / description
  let title       = 'Blog — Career Advice, Tech Insights & Campus Life | Riseflake'
  let description = 'Expert articles on career tips, internships, tech engineering, campus life and company spotlights from the Riseflake team.'

  if (category) {
    // Fetch category name for a proper title (categories are cached 1h so no perf hit)
    try {
      const res  = await fetch(`${BLOG_API_URL}/blogs/public/categories`, { next: { revalidate: 3600 } })
      const data = res.ok ? await res.json() : { categories: [] }
      const cat  = (data.categories ?? []).find((c: { slug: string; name: string }) => c.slug === category)
      if (cat) {
        title       = `${cat.name} — Blog | Riseflake`
        description = `Browse all ${cat.name} articles on Riseflake Blog. Career advice, guides and insights for students and professionals.`
      }
    } catch { /* use default */ }
  }

  if (isPaginated) title = `${title.replace(' | Riseflake', '')} — Page ${pageNum} | Riseflake`

  return {
    title,
    description,
    keywords: 'riseflake blog, career tips india, internship advice, tech articles, campus life, job search tips, freshers guide',
    // Canonical always points to base /blog — paginated & filtered pages consolidate link equity here
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: title.replace(' | Riseflake', ''),
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
      title: title.replace(' | Riseflake', ''),
      description,
      images: [`${WEBSITE_BASE_URL}/og-blog-default.png`],
    },
    // Noindex thin pages (search queries, tag archives) — follow to pass link equity
    robots: isThinPage
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

type BlogPost = {
  id: number
  title: string
  slug: string
  excerpt: string | null
  cover_image_url: string | null
  published_at: string | null
  view_count: number
  read_time_minutes: number | null
  category_name: string | null
  category_slug: string | null
  author_name: string
  tags: { name: string; slug: string }[]
}

type BlogCategory = {
  id: number
  name: string
  slug: string
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

// ─── Blog card ────────────────────────────────────────────────────────────────

function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group col-span-1 sm:col-span-2 lg:col-span-3 block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
      >
        <div className="sm:flex">
          <div className="relative sm:w-[45%] h-52 sm:h-auto flex-shrink-0">
            {post.cover_image_url ? (
              <Image
                src={post.cover_image_url}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 45vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                <span className="text-white text-5xl opacity-40">✍️</span>
              </div>
            )}
          </div>
          <div className="p-6 sm:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wide">
                {post.category_name ?? 'Featured'}
              </span>
              {post.read_time_minutes && (
                <span className="text-xs text-gray-400">{post.read_time_minutes} min read</span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="mt-3 text-sm text-gray-500 line-clamp-3">{post.excerpt}</p>
            )}
            <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
              <span>{post.author_name}</span>
              {date && <><span>·</span><time dateTime={post.published_at ?? ''}>{date}</time></>}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
      itemScope
      itemType="https://schema.org/BlogPosting"
    >
      <meta itemProp="url" content={`${WEBSITE_BASE_URL}/blog/${post.slug}`} />
      {post.cover_image_url ? (
        <div className="relative w-full h-44">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            itemProp="image"
          />
        </div>
      ) : (
        <div className="w-full h-44 bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <span className="text-3xl opacity-40">✍️</span>
        </div>
      )}
      <div className="p-5">
        {post.category_name && (
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wide" itemProp="articleSection">
            {post.category_name}
          </span>
        )}
        <h2
          className="mt-1 text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug"
          itemProp="headline"
        >
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-1.5 text-xs text-gray-500 line-clamp-2" itemProp="description">{post.excerpt}</p>
        )}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span itemProp="author">{post.author_name}</span>
          <div className="flex items-center gap-1.5">
            {date && <time dateTime={post.published_at ?? ''} itemProp="datePublished">{date}</time>}
            {post.read_time_minutes && <><span>·</span><span>{post.read_time_minutes} min</span></>}
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const params: Record<string, string> = {}
  if (searchParams.category) params.category = searchParams.category
  if (searchParams.tag)      params.tag      = searchParams.tag
  if (searchParams.search)   params.search   = searchParams.search
  if (searchParams.page)     params.page     = searchParams.page

  const [{ blogs, total }, categories] = await Promise.all([
    fetchBlogs(params),
    fetchCategories(),
  ])

  const currentPage    = Math.max(1, parseInt(searchParams.page || '1'))
  const totalPages     = Math.ceil(total / 12)
  const activeCategory = searchParams.category || ''
  const isFiltered     = !!(searchParams.category || searchParams.tag || searchParams.search)

  // Feature the first post on unfiltered page 1
  const featuredPost = (!isFiltered && currentPage === 1 && blogs.length > 0) ? blogs[0] : null
  const gridPosts    = featuredPost ? blogs.slice(1) : blogs

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

          {/* Category filter tabs */}
          {categories.length > 0 && (
            <nav aria-label="Blog categories" className="flex flex-wrap gap-2 mb-8 justify-center">
              <Link
                href="/blog"
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  !activeCategory ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                All
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/blog?category=${c.slug}`}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === c.slug
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Active filter indicator */}
          {searchParams.tag && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-gray-500">Filtering by tag:</span>
              <span className="text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-0.5 rounded-full">#{searchParams.tag}</span>
              <Link href="/blog" className="text-xs text-gray-400 hover:text-red-500 transition-colors">✕ Clear</Link>
            </div>
          )}

          {/* Blog grid */}
          {blogs.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-lg font-semibold text-gray-600">No posts found</p>
              <p className="text-sm mt-1">Try a different category or check back soon!</p>
              <Link href="/blog" className="inline-block mt-5 text-sm text-blue-600 font-medium hover:underline">
                View all posts →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredPost && <BlogCard post={featuredPost} featured />}
              {gridPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Pagination with rel=prev/next for Googlebot */}
          {totalPages > 1 && (
            <nav aria-label="Pagination" className="flex justify-center items-center gap-2 mt-10">
              {currentPage > 1 && (
                <Link
                  href={`/blog?${new URLSearchParams({ ...params, page: String(currentPage - 1) })}`}
                  rel="prev"
                  className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm hover:bg-gray-50 transition-colors"
                >
                  ← Previous
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages && (
                <Link
                  href={`/blog?${new URLSearchParams({ ...params, page: String(currentPage + 1) })}`}
                  rel="next"
                  className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm hover:bg-gray-50 transition-colors"
                >
                  Next →
                </Link>
              )}
            </nav>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
