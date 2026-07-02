import { MetadataRoute } from 'next'
import { createServerClient } from '@/lib/supabase/server'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const supabase = createServerClient()

  // Fetch latest updated profile row
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, favicon_url, apple_icon_url')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  const defaultIcon = '/apple-touch-icon.png'
  const iconUrl = profile?.apple_icon_url || profile?.favicon_url || defaultIcon

  return {
    name: `${profile?.name || 'Vinit Soni'} Portfolio`,
    short_name: 'Vinit.dev',
    description: `Premium portfolio of ${profile?.name || 'Vinit Soni'} — Full-Stack Developer & MCA Student`,
    start_url: '/',
    display: 'standalone',
    background_color: '#020817',
    theme_color: '#00f5ff',
    orientation: 'portrait-primary',
    categories: ['portfolio', 'developer', 'technology'],
    icons: [
      {
        src: iconUrl,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: iconUrl,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: iconUrl,
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      }
    ],
    lang: 'en'
  }
}
