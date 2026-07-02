import type { Profile } from '@/lib/supabase/types'

interface Props { profile?: Profile | null }

export default function JsonLd({ profile }: Props) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vinitsoni.vercel.app'
  const sameAs = [
    profile?.github_url,
    profile?.linkedin_url,
    profile?.twitter_url,
  ].filter(Boolean)

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile?.name || 'Vinit Soni',
    jobTitle: profile?.tagline || 'Full-Stack Developer',
    url: siteUrl,
    email: profile?.email,
    image: profile?.avatar_url || profile?.og_image_url,
    sameAs: sameAs.length > 0 ? sameAs : ['https://github.com/vinitsonii'],
    description: profile?.bio || profile?.meta_description,
    knowsAbout: ['Web Development', 'React', 'Next.js', 'Node.js', 'TypeScript', 'Supabase'],
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: profile?.name || 'Vinit Soni',
    alternateName: [
      `${profile?.name || 'Vinit Soni'} Portfolio`,
      'Vinit Soni Full-Stack Developer'
    ],
    url: siteUrl,
    publisher: {
      '@type': 'Person',
      name: profile?.name || 'Vinit Soni'
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
    </>
  )
}

