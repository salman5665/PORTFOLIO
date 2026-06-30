import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowLeft, BookOpen, CalendarDays, Clock, Tag } from 'lucide-react'
import type { Profile, BlogPost } from '@/lib/supabase/types'
import { Metadata } from 'next'
import * as cheerio from 'cheerio'

export const revalidate = 0

interface Props {
  params: Promise<{ slug: string }>
}

async function getPostData(slug: string) {
  const db = createServerClient()

  const [{ data: profile }, { data: post }] = await Promise.all([
    db.from('profiles')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single(),

    db.from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single()
  ])

  return {
    profile: profile as Profile | null,
    post: post as BlogPost | null
  }
}

/* ---------------- SANITIZER ---------------- */

const ALLOWED_TAGS = new Set([
  'a', 'b', 'blockquote', 'br', 'code', 'em',
  'figcaption', 'figure', 'h1', 'h2', 'h3',
  'h4', 'h5', 'h6', 'hr', 'i', 'img',
  'li', 'ol', 'p', 'pre', 's', 'strong',
  'table', 'tbody', 'td', 'th', 'thead',
  'tr', 'u', 'ul'
])

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
  img: new Set(['src', 'alt', 'title', 'width', 'height']),
  code: new Set(['class']),
  pre: new Set(['class']),
}

function isSafeUrl(value: string) {
  const trimmed = value.trim().toLowerCase()

  return (
    trimmed.startsWith('/') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:')
  )
}

function sanitizeBlogHtml(html: string) {
  const $ = cheerio.load(html)

  $('script, iframe, object, embed, form, input, button, style, link, meta').remove()

  $('*').each((_, element) => {
    const node = element as unknown as {
      tagName?: string
      attribs?: Record<string, string>
    }

    const tag = node.tagName?.toLowerCase()

    // skip root elements
    if (!tag || tag === 'html' || tag === 'body') {
      return
    }

    // remove disallowed tags but keep text
    if (!ALLOWED_TAGS.has(tag)) {
      $(element).replaceWith($(element).contents())
      return
    }

    const allowedAttrs = ALLOWED_ATTRS[tag] || new Set<string>()

    for (const attrName of Object.keys(node.attribs || {})) {
      const value = $(element).attr(attrName) || ''
      const normalized = attrName.toLowerCase()

      const isUnsafeHandler = normalized.startsWith('on')

      const isUnsafeUrl =
        ['href', 'src'].includes(normalized) &&
        !isSafeUrl(value)

      if (
        isUnsafeHandler ||
        isUnsafeUrl ||
        !allowedAttrs.has(normalized)
      ) {
        $(element).removeAttr(attrName)
      }
    }

    if (tag === 'a') {
      $(element).attr('rel', 'noopener noreferrer')
      $(element).attr('target', '_blank')
    }
  })

  return $('body').html() || ''
}

/* ---------------- SEO ---------------- */

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  const p = await params
  const { post } = await getPostData(p.slug)

  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }

  return {
    title: post.title,
    description: post.excerpt,

    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
      publishedTime: post.published_at || undefined,
      images: post.cover_image_url
        ? [post.cover_image_url]
        : [],
    },
  }
}

/* ---------------- PAGE ---------------- */

export default async function BlogPostPage({ params }: Props) {

  const p = await params

  const { profile, post } = await getPostData(p.slug)

  if (!post || post.status !== 'published') {
    notFound()
  }

  return (
    <>
      <Navbar profile={profile} />

      <main className="portfolio-main blog-post-page">
        <article className="container blog-post-wrap">

          <Link
            href="/#blog"
            className="blog-post-back"
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </Link>

          {/* HERO */}

          <header className="blog-post-hero">

            <div className="blog-post-kicker">
              <BookOpen size={14} />
              Article
            </div>

          
          

            <h1 className="blog-post-title">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="blog-post-excerpt">
                {post.excerpt}
              </p>
            )}

            <div className="blog-post-meta">
{post.published_at && (
<span>
<CalendarDays size={15} />
{new Date(post.published_at).toLocaleString(
'en-IN',
{
day: '2-digit',
month: 'short',
year: 'numeric',
hour: '2-digit',
minute: '2-digit',
hour12: true,
timeZone: 'Asia/Kolkata'
}
)}
</span>
)}
              

              {post.read_time_minutes > 0 && (
                <span>
                  <Clock size={15} />
                  {post.read_time_minutes} min read
                </span>
              )}

            </div>

          </header>

          {/* COVER */}

          {post.cover_image_url && (
            <div className="blog-post-cover">
              <img
                src={post.cover_image_url}
                alt={post.title}
              />
            </div>
          )}

          {/* CONTENT */}

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{
              __html: sanitizeBlogHtml(post.content || '')
            }}
          />

        </article>
      </main>

      <Footer profile={profile} />

      {/* STYLES */}

      <style>{`

        .blog-post-page{
          min-height:100vh;
          padding-top:110px;
          background:#020617;
        }

        .blog-post-wrap{
          max-width:900px;
          padding-bottom:100px;
        }

        .blog-post-back{
          display:inline-flex;
          align-items:center;
          gap:.5rem;
          margin-bottom:2rem;
          text-decoration:none;
          color:#94a3b8;
        }

        .blog-post-back:hover{
          color:#67e8f9;
        }

        .blog-post-hero{
          margin-bottom:2rem;
        }

        .blog-post-kicker{
          display:inline-flex;
          align-items:center;
          gap:.4rem;
          margin-bottom:1rem;
          color:#67e8f9;
          font-size:.8rem;
          font-weight:700;
        }

        .blog-post-tags{
          display:flex;
          flex-wrap:wrap;
          gap:.5rem;
          margin-bottom:1rem;
        }

        .blog-post-tag{
          display:inline-flex;
          align-items:center;
          gap:.3rem;
          padding:.35rem .65rem;
          border-radius:999px;
          background:rgba(34,211,238,.1);
          border:1px solid rgba(34,211,238,.2);
          color:#67e8f9;
          font-size:.75rem;
        }

        .blog-post-title{
          color:white;
          font-size:clamp(2rem,6vw,4rem);
          line-height:1.05;
          font-weight:850;
          margin-bottom:1rem;
        }

        .blog-post-excerpt{
          color:#94a3b8;
          font-size:1.05rem;
          line-height:1.8;
          margin-bottom:1.5rem;
        }

        .blog-post-meta{
          display:flex;
          gap:.75rem;
          flex-wrap:wrap;
          color:#94a3b8;
          font-size:.85rem;
        }

        .blog-post-meta span{
          display:inline-flex;
          align-items:center;
          gap:.4rem;
        }

        .blog-post-cover{
          width:100%;
          overflow:hidden;
          border-radius:20px;
          margin-bottom:2rem;
        }

        .blog-post-cover img{
          width:100%;
          display:block;
          object-fit:cover;
        }

        .blog-content{
          color:#e2e8f0;
          line-height:1.9;
          font-size:1.08rem;
        }

        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4{
          color:white;
          margin-top:2.5rem;
          margin-bottom:1rem;
          font-weight:800;
          line-height:1.2;
        }

        .blog-content p{
          margin-bottom:1.4rem;
          color:#cbd5e1;
        }

        .blog-content strong{
          color:white;
        }

        .blog-content a{
          color:#67e8f9;
          text-decoration:none;
        }

        .blog-content ul,
        .blog-content ol{
          padding-left:1.5rem;
          margin-bottom:1.5rem;
          color:#cbd5e1;
        }

        .blog-content li{
          margin-bottom:.5rem;
        }

        .blog-content img{
          max-width:100%;
          border-radius:16px;
          margin:2rem 0;
        }

        .blog-content blockquote{
          border-left:4px solid #22d3ee;
          padding-left:1rem;
          margin:2rem 0;
          color:#94a3b8;
          font-style:italic;
        }

        .blog-content code{
          background:rgba(255,255,255,.08);
          padding:.2rem .45rem;
          border-radius:6px;
          font-family:monospace;
          color:#a5f3fc;
        }

        .blog-content pre{
          background:#0f172a;
          padding:1.25rem;
          border-radius:14px;
          overflow-x:auto;
          margin:1.5rem 0;
        }

        .blog-content pre code{
          background:transparent;
          padding:0;
          color:#dbeafe;
        }

      `}</style>
    </>
  )
      }
