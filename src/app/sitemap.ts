import { MetadataRoute } from 'next'
import { createServerClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient()

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://vinitsoni.vercel.app'

  /* -------------------------------- */
  /* FETCH PUBLISHED BLOG POSTS */
  /* -------------------------------- */

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('status', 'published')
    .order('updated_at', { ascending: false })

  /* -------------------------------- */
  /* DYNAMIC BLOG URLS */
  /* -------------------------------- */

  const blogUrls: MetadataRoute.Sitemap =
    posts?.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,

      lastModified: post.updated_at
        ? new Date(post.updated_at)
        : new Date(),

      changeFrequency: 'monthly',

      priority: 0.8,
    })) || []

  /* -------------------------------- */
  /* STATIC PAGES */
  /* -------------------------------- */

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },

    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    {
      url: `${baseUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  /* -------------------------------- */
  /* RETURN ALL URLS */
  /* -------------------------------- */

  return [
    ...staticPages,
    ...blogUrls,
  ]
}