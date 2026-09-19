import Link from 'next/link'
import Image from 'next/image'
import { WEBSITE_BASE_URL } from '../../lib/config'

// ─── Types ────────────────────────────────────────────────────────────────────

export type BlogPost = {
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

export type BlogCategory = {
  id: number
  name: string
  slug: string
}

// ─── Blog card ────────────────────────────────────────────────────────────────

export function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
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


// ─── Listing (pure — shared by the static HTML and the client-side filter) ────

/**
 * The blog is a static page: the server renders EVERY post into the HTML (so crawlers
 * see all of them), and <BlogListingClient /> re-renders this same view with the
 * `?category=` / `?tag=` / `?search=` filters applied in the browser.
 */
export function BlogListingView({
  posts,
  categories,
  category = '',
  tag = '',
  search = '',
}: {
  posts: BlogPost[]
  categories: BlogCategory[]
  category?: string
  tag?: string
  search?: string
}) {
  const q = search.trim().toLowerCase()
  const visible = posts.filter(
    (p) =>
      (!category || p.category_slug === category) &&
      (!tag || (p.tags ?? []).some((t) => t.slug === tag)) &&
      (!q || p.title.toLowerCase().includes(q) || (p.excerpt ?? '').toLowerCase().includes(q)),
  )
  const isFiltered = !!(category || tag || q)
  const featuredPost = !isFiltered && visible.length > 0 ? visible[0] : null
  const gridPosts = featuredPost ? visible.slice(1) : visible

  return (
    <>
      {/* Category filter tabs */}
      {categories.length > 0 && (
        <nav aria-label="Blog categories" className="flex flex-wrap gap-2 mb-8 justify-center">
          <Link
            href="/blog"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !category ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/blog?category=${c.slug}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === c.slug
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
      {tag && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-500">Filtering by tag:</span>
          <span className="text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-0.5 rounded-full">#{tag}</span>
          <Link href="/blog" className="text-xs text-gray-400 hover:text-red-500 transition-colors">✕ Clear</Link>
        </div>
      )}

      {/* Blog grid */}
      {visible.length === 0 ? (
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
    </>
  )
}
