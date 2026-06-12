import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { BLOG_API_URL, WEBSITE_BASE_URL } from '../../../lib/config'

export const dynamicParams = true
export const revalidate = 600 // ISR: rebuild every 10 min

// ─── Types ────────────────────────────────────────────────────────────────────

type BlogDetail = {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image_url: string | null
  cover_image_alt: string | null
  meta_title: string | null
  meta_description: string | null
  published_at: string | null
  updated_at: string
  view_count: number
  read_time_minutes: number | null
  category_name: string | null
  category_slug: string | null
  author_name: string
  tags: { name: string; slug: string }[]
}

type BlogPost = {
  id: number
  title: string
  slug: string
  excerpt: string | null
  cover_image_url: string | null
  published_at: string | null
  read_time_minutes: number | null
  category_name: string | null
}

// ─── Data fetching ────────────────────────────────────────────────────────────

async function fetchBlog(slug: string): Promise<BlogDetail | null> {
  try {
    const res = await fetch(`${BLOG_API_URL}/blogs/public/${slug}`, {
      next: { revalidate: 600 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.blog ?? null
  } catch {
    return null
  }
}

async function fetchRelated(categorySlug: string | null, excludeSlug: string): Promise<BlogPost[]> {
  try {
    const qs = new URLSearchParams({ limit: '3', ...(categorySlug ? { category: categorySlug } : {}) })
    const res = await fetch(`${BLOG_API_URL}/blogs/public?${qs}`, { next: { revalidate: 600 } })
    if (!res.ok) return []
    const data = await res.json()
    return (data.blogs ?? []).filter((b: BlogPost) => b.slug !== excludeSlug).slice(0, 3)
  } catch {
    return []
  }
}

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  try {
    const res = await fetch(`${BLOG_API_URL}/blogs/public/slugs`, { next: { revalidate: 600 } })
    if (!res.ok) return []
    const data = await res.json()
    return (data.slugs ?? []).map((s: { slug: string }) => ({ slug: s.slug }))
  } catch {
    return []
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const blog = await fetchBlog(slug)
  if (!blog) return { title: 'Post Not Found | Riseflake Blog', robots: { index: false, follow: false } }

  const canonicalUrl = `${WEBSITE_BASE_URL}/blog/${blog.slug}`
  const title        = blog.meta_title || blog.title
  const description  = blog.meta_description || blog.excerpt || `Read "${blog.title}" on Riseflake Blog.`
  const keywords     = blog.tags.map((t) => t.name).join(', ')

  return {
    title:       `${title} | Riseflake Blog`,
    description,
    keywords:    keywords || 'riseflake, career, blog',
    alternates:  { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url:           canonicalUrl,
      siteName:      'Riseflake',
      type:          'article',
      publishedTime: blog.published_at ?? undefined,
      modifiedTime:  blog.updated_at,
      authors:       [`${WEBSITE_BASE_URL}/blog?author=${encodeURIComponent(blog.author_name)}`],
      images: blog.cover_image_url
        ? [{ url: blog.cover_image_url, alt: blog.cover_image_alt ?? title, width: 1200, height: 630 }]
        : [{ url: `${WEBSITE_BASE_URL}/og-blog-default.png`, alt: 'Riseflake Blog', width: 1200, height: 630 }],
      locale: 'en_IN',
    },
    twitter: {
      card:        'summary_large_image',
      site:        '@riseflake',
      title,
      description,
      images: blog.cover_image_url
        ? [{ url: blog.cover_image_url, alt: blog.cover_image_alt ?? title }]
        : [`${WEBSITE_BASE_URL}/og-blog-default.png`],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
    other: {
      'article:author':        blog.author_name,
      'article:published_time': blog.published_at ?? '',
      'article:modified_time':  blog.updated_at,
      'article:section':        blog.category_name ?? 'General',
      'article:tag':            blog.tags.map((t) => t.name).join(','),
    },
  }
}

// ─── JSON-LD schemas ──────────────────────────────────────────────────────────

function buildArticleSchema(blog: BlogDetail, canonicalUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type':    'BlogPosting',
    '@id':      canonicalUrl,
    headline:   blog.title,
    name:       blog.title,
    description: blog.meta_description || blog.excerpt || undefined,
    image: blog.cover_image_url
      ? { '@type': 'ImageObject', url: blog.cover_image_url, alt: blog.cover_image_alt ?? blog.title }
      : undefined,
    author: {
      '@type': 'Person',
      name:    blog.author_name,
    },
    publisher: {
      '@type': 'Organization',
      name:    'Riseflake',
      url:     WEBSITE_BASE_URL,
      logo: {
        '@type':  'ImageObject',
        url:      `${WEBSITE_BASE_URL}/logo.png`,
        width:    200,
        height:   60,
      },
    },
    datePublished:    blog.published_at ?? undefined,
    dateModified:     blog.updated_at,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    url:              canonicalUrl,
    inLanguage:       'en-IN',
    wordCount:        blog.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length,
    timeRequired:     blog.read_time_minutes ? `PT${blog.read_time_minutes}M` : undefined,
    keywords:         blog.tags.map((t) => t.name).join(', ') || undefined,
    articleSection:   blog.category_name ?? undefined,
    isPartOf: {
      '@type': 'Blog',
      '@id':   `${WEBSITE_BASE_URL}/blog`,
      name:    'Riseflake Blog',
      url:     `${WEBSITE_BASE_URL}/blog`,
    },
  }
}

function buildBreadcrumbSchema(blog: BlogDetail, canonicalUrl: string) {
  const items = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: `${WEBSITE_BASE_URL}/blog` },
  ]
  if (blog.category_name && blog.category_slug) {
    items.push({
      '@type': 'ListItem',
      position: 3,
      name: blog.category_name,
      item: `${WEBSITE_BASE_URL}/blog?category=${blog.category_slug}`,
    })
    items.push({ '@type': 'ListItem', position: 4, name: blog.title, item: canonicalUrl })
  } else {
    items.push({ '@type': 'ListItem', position: 3, name: blog.title, item: canonicalUrl })
  }
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items }
}

// ─── Related post card ────────────────────────────────────────────────────────

function RelatedCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
      {post.cover_image_url ? (
        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
          <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" sizes="64px" />
        </div>
      ) : (
        <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-50 to-violet-100 flex items-center justify-center text-xl">✍️</div>
      )}
      <div className="min-w-0">
        {post.category_name && <p className="text-xs text-blue-600 font-medium mb-0.5">{post.category_name}</p>}
        <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">{post.title}</p>
        {post.read_time_minutes && <p className="text-xs text-gray-400 mt-0.5">{post.read_time_minutes} min read</p>}
      </div>
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = await fetchBlog(slug)
  if (!blog) notFound()

  const canonicalUrl   = `${WEBSITE_BASE_URL}/blog/${blog.slug}`
  const publishedDate  = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : null
  const modifiedDate   = new Date(blog.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  const showModified   = blog.published_at && blog.updated_at > blog.published_at

  const [articleSchema, breadcrumbSchema, related] = await Promise.all([
    Promise.resolve(buildArticleSchema(blog, canonicalUrl)),
    Promise.resolve(buildBreadcrumbSchema(blog, canonicalUrl)),
    fetchRelated(blog.category_slug, blog.slug),
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Navbar bgTransparent />

      <main className="min-h-screen bg-slate-50 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">

            {/* ── Article column ── */}
            <div>
              {/* Breadcrumb nav — visible text for Googlebot */}
              <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs text-gray-400 py-5">
                <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                <span aria-hidden>/</span>
                <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
                {blog.category_name && blog.category_slug && (
                  <>
                    <span aria-hidden>/</span>
                    <Link href={`/blog?category=${blog.category_slug}`} className="hover:text-blue-600 transition-colors">{blog.category_name}</Link>
                  </>
                )}
                <span aria-hidden>/</span>
                <span className="text-gray-600 line-clamp-1">{blog.title}</span>
              </nav>

              <article itemScope itemType="https://schema.org/BlogPosting" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Cover image */}
                {blog.cover_image_url ? (
                  <div className="relative w-full h-64 sm:h-[360px]">
                    <Image
                      src={blog.cover_image_url}
                      alt={blog.cover_image_alt ?? blog.title}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 756px"
                      itemProp="image"
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                    <span className="text-white text-5xl opacity-30">✍️</span>
                  </div>
                )}

                <div className="p-6 sm:p-10">
                  {/* Category pill */}
                  {blog.category_name && blog.category_slug && (
                    <Link
                      href={`/blog?category=${blog.category_slug}`}
                      className="inline-block text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full uppercase tracking-widest transition-colors mb-3"
                      itemProp="articleSection"
                    >
                      {blog.category_name}
                    </Link>
                  )}

                  {/* Title — H1 with itemprop for rich results */}
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight" itemProp="headline">
                    {blog.title}
                  </h1>

                  {/* Author + date meta */}
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
                    <span itemProp="author" itemScope itemType="https://schema.org/Person">
                      By <span className="text-gray-700 font-semibold" itemProp="name">{blog.author_name}</span>
                    </span>
                    {publishedDate && (
                      <time dateTime={blog.published_at ?? ''} itemProp="datePublished">{publishedDate}</time>
                    )}
                    {showModified && (
                      <time dateTime={blog.updated_at} itemProp="dateModified" className="text-gray-300 text-xs">
                        Updated {modifiedDate}
                      </time>
                    )}
                    {blog.read_time_minutes && <span>{blog.read_time_minutes} min read</span>}
                    <span>{blog.view_count.toLocaleString()} views</span>
                  </div>

                  {/* Excerpt as lead */}
                  {blog.excerpt && (
                    <p className="mt-5 text-base text-gray-600 leading-relaxed border-l-4 border-blue-300 pl-4 italic" itemProp="description">
                      {blog.excerpt}
                    </p>
                  )}

                  {/* Tags */}
                  {blog.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
                      {blog.tags.map((t) => (
                        <Link
                          key={t.slug}
                          href={`/blog?tag=${t.slug}`}
                          className="text-xs bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-700 px-3 py-1 rounded-full transition-colors"
                          rel="tag"
                        >
                          #{t.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  <hr className="my-8 border-gray-100" />

                  {/* Body content — prose styles for readability + SEO */}
                  <div
                    className="prose prose-base max-w-none
                      prose-headings:font-bold prose-headings:text-gray-900 prose-headings:scroll-mt-20
                      prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
                      prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
                      prose-p:text-gray-700 prose-p:leading-relaxed
                      prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-gray-900
                      prose-ul:text-gray-700 prose-ol:text-gray-700
                      prose-li:my-1
                      prose-blockquote:border-blue-300 prose-blockquote:text-gray-600 prose-blockquote:italic
                      prose-img:rounded-xl prose-img:shadow-sm
                      prose-code:text-blue-700 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded
                      prose-pre:bg-gray-900 prose-pre:text-gray-100"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                    itemProp="articleBody"
                  />

                  {/* CTA */}
                  <div className="mt-10 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 p-6 text-white text-center">
                    <p className="font-bold text-lg">Ready to accelerate your career?</p>
                    <p className="text-sm text-blue-100 mt-1 mb-4">Find jobs, internships and connect with top recruiters on Riseflake.</p>
                    <Link
                      href="/"
                      className="inline-block bg-white text-blue-700 font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-blue-50 transition-colors"
                    >
                      Explore Riseflake →
                    </Link>
                  </div>
                </div>
              </article>

              <div className="mt-6">
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  ← Back to Blog
                </Link>
              </div>
            </div>

            {/* ── Sidebar ── */}
            <aside className="hidden lg:block mt-14 space-y-6">
              {/* Related posts */}
              {related.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <h2 className="text-sm font-bold text-gray-900 mb-3 px-1">Related Articles</h2>
                  <div className="space-y-1">
                    {related.map((post) => <RelatedCard key={post.slug} post={post} />)}
                  </div>
                  <Link href="/blog" className="block text-center text-xs text-blue-600 hover:text-blue-700 font-medium mt-3 pt-3 border-t border-gray-100">
                    View all posts →
                  </Link>
                </div>
              )}

              {/* Sticky CTA */}
              <div className="sticky top-24 bg-gradient-to-b from-blue-600 to-violet-700 rounded-2xl p-5 text-white text-center shadow-lg">
                <div className="text-3xl mb-2">🚀</div>
                <p className="font-bold text-base leading-snug">Launch your career with Riseflake</p>
                <p className="text-xs text-blue-200 mt-2 mb-4">Jobs, internships, mentors & more — all in one place.</p>
                <Link
                  href="/"
                  className="block w-full bg-white text-blue-700 font-bold text-sm py-2.5 rounded-full hover:bg-blue-50 transition-colors"
                >
                  Get Started Free
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
