import type { Metadata, Viewport } from 'next'
import { Outfit, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { SpeedInsights } from '@vercel/speed-insights/next'

import PageTransition from '@/components/PageTransition'
import VisitorTracker from '@/components/analytics/VisitorTracker'
import LenisProvider from '@/components/ui/LenisProvider'

import { createServerClient } from '@/lib/supabase/server'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
})

/* -------------------------------- */
/* ISR REVALIDATION */
/* -------------------------------- */

export const revalidate = 60

/* -------------------------------- */
/* VIEWPORT */
/* -------------------------------- */

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
}

/* -------------------------------- */
/* METADATA */
/* -------------------------------- */

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createServerClient()

  // Fetch latest updated profile row
  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      name,
      meta_title,
      meta_description,
      favicon_url,
      apple_icon_url,
      updated_at
    `)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://salman.dev'

  const title =
    profile?.meta_title?.trim() ||
    `${profile?.name || 'Salman'} | Full-Stack Developer`

  const description =
    profile?.meta_description?.trim() ||
    'Full-stack developer portfolio showcasing projects, blogs, certifications, and modern web applications.'

  // Favicon handling
  const rawFaviconUrl = profile?.favicon_url?.trim() || '/favicon.ico'
  const rawAppleIconUrl = profile?.apple_icon_url?.trim() || '/apple-touch-icon.png'

  let faviconType = 'image/x-icon'
  if (rawFaviconUrl.endsWith('.png')) faviconType = 'image/png'
  else if (rawFaviconUrl.endsWith('.svg')) faviconType = 'image/svg+xml'
  else if (rawFaviconUrl.endsWith('.webp')) faviconType = 'image/webp'

  return {
    metadataBase: new URL(siteUrl),
    applicationName: profile?.name || 'Salman',
    title: {
      default: title,
      template: `%s | ${profile?.name || 'Salman'}`,
    },
    description,
    icons: {
      icon: [
        {
          url: rawFaviconUrl,
          type: faviconType,
        },
        {
          url: '/favicon.ico',
          type: 'image/x-icon',
          sizes: 'any',
        },
      ],
      shortcut: [rawFaviconUrl],
      apple: [
        {
          url: rawAppleIconUrl,
          sizes: '180x180',
          type: 'image/png',
        },
      ],
    },
  }
}

/* -------------------------------- */
/* ROOT LAYOUT */
/* -------------------------------- */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${jetbrainsMono.variable} dark`}
      style={{
        fontFamily:
          'var(--font-outfit), system-ui, sans-serif',
      }}
    >
      <head>
        <meta
          name="mobile-web-app-capable"
          content="yes"
        />
        <meta
          name="apple-mobile-web-app-capable"
          content="yes"
        />
        <meta
          name="apple-mobile-web-app-title"
          content="Salman"
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta
          name="format-detection"
          content="telephone=no"
        />
      </head>

      <body
        suppressHydrationWarning
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
        className="antialiased bg-black text-white"
      >
        <VisitorTracker />

        <LenisProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </LenisProvider>

        <Toaster
          position="bottom-right"
          richColors
          theme="dark"
          toastOptions={{
            style: {
              fontFamily: 'var(--font-outfit)',
              background: '#09090b',
              border: '1px solid #27272a',
              color: '#fafafa',
              borderRadius: '12px',
            },
          }}
        />

        <SpeedInsights />
      </body>
    </html>
  )
}

