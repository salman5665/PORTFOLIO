import type { Metadata, Viewport } from 'next'
import { Outfit, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import dynamic from 'next/dynamic'

const AskVinit = dynamic(() => import('@/components/AskVinit'), { ssr: false })
import { Toaster } from 'sonner'
import { GoogleAnalytics } from '@next/third-parties/google'
import { SpeedInsights } from '@vercel/speed-insights/next'

import PageTransition from '@/components/PageTransition'
import VisitorTracker from '@/components/analytics/VisitorTracker'
import LenisProvider from '@/components/ui/LenisProvider'

import { createServerClient } from '@/lib/supabase/server'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
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
  themeColor: '#020817',
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
      github_url,
      linkedin_url,
      meta_title,
      meta_description,
      og_image_url,
      favicon_url,
      apple_icon_url,
      theme_accent_color,
      updated_at
    `)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://vinitsoni.vercel.app'

  const title =
    profile?.meta_title?.trim() ||
    `${profile?.name || 'Vinit Soni'} | Full-Stack Developer`

  const description =
    profile?.meta_description?.trim() ||
    'Full-stack developer portfolio showcasing projects, blogs, certifications, and modern web applications built with Next.js, React, TypeScript, and Supabase.'

  const ogImage =
    profile?.og_image_url?.trim() ||
    `${siteUrl}/og-image.png`

  // Cache busting for updated icons
  const faviconUrl =
    profile?.favicon_url
      ? `${profile.favicon_url}?v=${profile.updated_at}`
      : '/favicon.ico'

  const appleIconUrl =
    profile?.apple_icon_url
      ? `${profile.apple_icon_url}?v=${profile.updated_at}`
      : '/apple-touch-icon.png'

  return {
    metadataBase: new URL(siteUrl),
    applicationName: profile?.name || 'Vinit Soni',

    title: {
      default: title,
      template: `%s | ${profile?.name || 'Vinit Soni'}`,
    },

    description,

    keywords: [
      profile?.name || 'Vinit Soni',
      'Full-Stack Developer',
      'Frontend Developer',
      'Backend Developer',
      'React Developer',
      'Next.js',
      'TypeScript',
      'Portfolio',
      'Web Developer India',
      'MCA Student',
      'Supabase',
      'PostgreSQL',
    ],

    authors: [
      {
        name: profile?.name || 'Vinit Soni',
        url: profile?.github_url || siteUrl,
      },
    ],

    creator: profile?.name || 'Vinit Soni',

    alternates: {
      canonical: siteUrl,
    },

    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,

      title,
      description,

      siteName: profile?.name || 'Vinit Soni',

      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',

      title,
      description,

      creator: '@vinitsonii',

      images: [ogImage],
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    icons: {
      icon: [
        {
          url: faviconUrl,
          type: 'image/x-icon',
        },
      ],

      shortcut: [faviconUrl],

      apple: [
        {
          url: appleIconUrl,
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
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${jetbrainsMono.variable}`}
      style={{
        fontFamily:
          'var(--font-outfit), system-ui, sans-serif',
      }}
    >
      <head>
        {/* Preload Lottie animation so it starts downloading immediately */}
        <link
          rel="preload"
          href="/hero-animation.json"
          as="fetch"
          crossOrigin="anonymous"
        />
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
          content="Vinit Soni"
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
        className="antialiased"
      >
        <VisitorTracker />
        <AskVinit />

        <LenisProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </LenisProvider>

        <Toaster
          position="bottom-right"
          richColors
          toastOptions={{
            style: {
              fontFamily: 'var(--font-outfit)',
              background: '#ffffff',
              border: '1px solid #e4e4e7',
              color: '#18181b',
              borderRadius: '12px',
            },
          }}
        />

        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics
            gaId={process.env.NEXT_PUBLIC_GA_ID}
          />
        )}
        <SpeedInsights />
      </body>
    </html>
  )
}