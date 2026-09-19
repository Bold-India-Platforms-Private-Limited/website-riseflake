'use client'

import { useSearchParams } from 'next/navigation'
import { BlogListingView, type BlogCategory, type BlogPost } from './BlogListing'

/** Applies the `?category=` / `?tag=` / `?search=` filters in the browser (static export has no server to do it). */
export default function BlogListingClient({ posts, categories }: { posts: BlogPost[]; categories: BlogCategory[] }) {
  const sp = useSearchParams()
  return (
    <BlogListingView
      posts={posts}
      categories={categories}
      category={sp.get('category') ?? ''}
      tag={sp.get('tag') ?? ''}
      search={sp.get('search') ?? ''}
    />
  )
}
