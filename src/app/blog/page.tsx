import { createServerClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, Clock, Tag } from 'lucide-react'
import type { Profile, BlogPost } from '@/lib/supabase/types'

export const revalidate = 0

async function getBlogData() {
  const db = createServerClient()
  const [{ data: profile }, { data: blogPosts }] = await Promise.all([
    db.from('profiles').select('*').order('updated_at', { ascending: false }).limit(1).single(),
    db.from('blog_posts').select('*').eq('status', 'published').order('published_at', { ascending: false })
  ])
  return {
    profile: profile as Profile | null,
    posts: (blogPosts || []) as BlogPost[]
  }
}

function formatDate(d: string | null): string {
  if (!d) return ''
  const date = new Date(d)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[date.getUTCMonth()]
  const day = date.getUTCDate()
  const year = date.getUTCFullYear()
  return `${month} ${day}, ${year}`
}

export default async function BlogIndexPage() {
  const { profile, posts } = await getBlogData()

  return (
    <>
      <Navbar profile={profile} />
      <main className="portfolio-main blog-index-page">
        <style>{`
          .blog-index-page {
            min-height: 80vh;
            padding-top: 104px;
            background:
              linear-gradient(rgba(125, 211, 252, 0.045) 1px, transparent 1px),
              linear-gradient(90deg, rgba(125, 211, 252, 0.034) 1px, transparent 1px),
              radial-gradient(circle at 12% 0%, rgba(34, 211, 238, 0.12), transparent 32%),
              linear-gradient(135deg, #020617 0%, #07111f 52%, #020617 100%);
            background-size: 52px 52px, 52px 52px, 100% 100%, 100% 100%;
          }

          .blog-index-wrap {
            max-width: 1120px;
            padding-bottom: 104px;
          }

          .blog-back-link {
            width: fit-content;
            min-height: 40px;
            padding: 0 0.95rem;
            border-radius: 999px;
            border: 1px solid rgba(125, 211, 252, 0.16);
            background: rgba(15, 23, 42, 0.48);
            color: var(--color-text-sub);
            text-decoration: none;
            transition: all 0.2s var(--ease);
          }

          .blog-back-link:hover {
            color: #67e8f9;
            border-color: rgba(34, 211, 238, 0.34);
            background: rgba(34, 211, 238, 0.08);
            transform: translateY(-1px);
          }

          .blog-index-hero {
            position: relative;
            overflow: hidden;
            margin: 1.2rem 0 2.4rem;
            padding: clamp(1.45rem, 4vw, 2.3rem);
            border-radius: 22px;
            border: 1px solid rgba(125, 211, 252, 0.16);
            background:
              linear-gradient(145deg, rgba(15, 23, 42, 0.86), rgba(2, 6, 23, 0.72)),
              linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(139, 92, 246, 0.08));
            box-shadow: 0 24px 70px rgba(2, 6, 23, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.045);
          }

          .blog-index-hero::before {
            content: '';
            position: absolute;
            inset: 0;
            background:
              linear-gradient(rgba(125, 211, 252, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(125, 211, 252, 0.04) 1px, transparent 1px);
            background-size: 34px 34px;
            mask-image: linear-gradient(110deg, black, transparent 70%);
            pointer-events: none;
          }

          .blog-index-hero > * {
            position: relative;
            z-index: 1;
          }

          .blog-index-kicker {
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
            margin-bottom: 0.9rem;
            padding: 0.42rem 0.65rem;
            border-radius: 999px;
            background: rgba(34, 211, 238, 0.1);
            border: 1px solid rgba(34, 211, 238, 0.22);
            color: #67e8f9;
            font-size: 0.72rem;
            font-weight: 800;
          }

          .blog-index-title {
            color: var(--color-text);
            font-weight: 850;
            font-size: clamp(2rem, 6vw, 4rem);
            line-height: 1.02;
            letter-spacing: 0;
            margin: 0 0 1rem;
          }

          .blog-index-subtitle {
            max-width: 660px;
            color: var(--color-text-sub);
            font-size: clamp(1rem, 2vw, 1.12rem);
            line-height: 1.75;
            margin: 0;
          }

          .blog-index-count {
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
            margin-top: 1.35rem;
            color: var(--color-text-muted);
            font-family: var(--font-mono);
            font-size: 0.82rem;
          }

          .blog-index-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 1.1rem;
          }

          .blog-index-card {
            min-height: 100%;
            overflow: hidden;
            border-radius: 18px;
            border: 1px solid rgba(125, 211, 252, 0.16);
            background: linear-gradient(145deg, rgba(15, 23, 42, 0.86), rgba(2, 6, 23, 0.74));
            box-shadow: 0 22px 58px rgba(2, 6, 23, 0.36), inset 0 1px 0 rgba(255, 255, 255, 0.045);
            transition: border-color 0.24s var(--ease), box-shadow 0.24s var(--ease), transform 0.24s var(--ease);
          }

          .blog-index-card:hover {
            transform: translateY(-4px);
            border-color: rgba(34, 211, 238, 0.38);
            box-shadow: 0 28px 76px rgba(2, 6, 23, 0.5), 0 0 0 1px rgba(34, 211, 238, 0.1);
          }

          .blog-index-media {
            height: 190px;
            overflow: hidden;
            background:
              linear-gradient(rgba(125, 211, 252, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(125, 211, 252, 0.04) 1px, transparent 1px),
              linear-gradient(135deg, rgba(34, 211, 238, 0.12), rgba(139, 92, 246, 0.12));
            background-size: 28px 28px, 28px 28px, 100% 100%;
          }

          .blog-index-media img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.55s var(--ease);
          }

          .blog-index-card:hover .blog-index-media img {
            transform: scale(1.05);
          }

          .blog-index-fallback {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #67e8f9;
          }

          .blog-index-body {
            min-height: 250px;
            padding: 1.15rem;
            display: flex;
            flex-direction: column;
          }

          .blog-index-meta {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 0.85rem;
            color: var(--color-text-muted);
            font-family: var(--font-mono);
            font-size: 0.72rem;
          }

          .blog-index-meta span {
            display: inline-flex;
            align-items: center;
            gap: 0.3rem;
            padding: 0.28rem 0.45rem;
            border-radius: 999px;
            background: rgba(2, 6, 23, 0.38);
            border: 1px solid rgba(125, 211, 252, 0.12);
          }

          .blog-index-card h2 {
            color: var(--color-text);
            font-size: 1.05rem;
            line-height: 1.38;
            font-weight: 800;
            margin: 0 0 0.68rem;
          }

          .blog-index-excerpt {
            color: var(--color-text-sub);
            font-size: 0.88rem;
            line-height: 1.7;
            margin: 0 0 1rem;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .blog-index-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem;
            margin-bottom: 1rem;
          }

          .blog-index-tag {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.32rem 0.48rem;
            border-radius: 999px;
            background: rgba(34, 211, 238, 0.1);
            border: 1px solid rgba(34, 211, 238, 0.2);
            color: #67e8f9;
            font-size: 0.68rem;
            font-weight: 700;
          }

          .blog-index-read {
            margin-top: auto;
            width: fit-content;
            min-height: 38px;
            border-radius: 10px;
            border-color: rgba(125, 211, 252, 0.24) !important;
            color: var(--color-text) !important;
            background: rgba(15, 23, 42, 0.42) !important;
          }

          .blog-index-read:hover {
            background: rgba(34, 211, 238, 0.1) !important;
            border-color: rgba(34, 211, 238, 0.42) !important;
            color: #67e8f9 !important;
          }

          .blog-empty-state {
            padding: 4rem 1rem;
            border-radius: 20px;
            border: 1px dashed rgba(125, 211, 252, 0.22);
            background: rgba(15, 23, 42, 0.38);
            text-align: center;
          }

          @media (max-width: 991.98px) {
            .blog-index-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 767.98px) {
            .blog-index-page {
              padding-top: 88px;
            }

            .blog-index-wrap {
              padding-bottom: 72px;
            }

            .blog-index-hero {
              border-radius: 18px;
              margin-bottom: 1.4rem;
            }

            .blog-index-grid {
              grid-template-columns: 1fr;
              gap: 0.95rem;
            }

            .blog-index-media {
              height: 180px;
            }

            .blog-index-body {
              min-height: 225px;
              padding: 1rem;
            }
          }
        `}</style>

        <div className="container blog-index-wrap">
          <Link href="/#blog" className="blog-back-link mb-4 d-inline-flex align-items-center gap-2">
            <ArrowLeft size={16} /> Back to Portfolio
          </Link>

          <section className="blog-index-hero">
            <div className="blog-index-kicker">
              <BookOpen size={14} /> Journal
            </div>
            <h1 className="blog-index-title">All Articles</h1>
            <p className="blog-index-subtitle">
              Thoughts, tutorials, and insights on software development and technology.
            </p>
            <div className="blog-index-count">
              <BookOpen size={14} /> {posts.length} published {posts.length === 1 ? 'article' : 'articles'}
            </div>
          </section>

          <div className="blog-index-grid">
            {posts.map((post) => (
              <article className="blog-index-card" key={post.id}>
                <div className="blog-index-media">
                  {post.cover_image_url ? (
                      <img src={post.cover_image_url} alt={post.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  ) : (
                    <div className="blog-index-fallback">
                      <BookOpen size={52} />
                    </div>
                  )}
                </div>

                <div className="blog-index-body">
                  <div className="blog-index-meta">
                    {post.published_at && (
                      <span>
                        <CalendarDays size={11} />
                        {formatDate(post.published_at)}
                      </span>
                    )}
                    {post.read_time_minutes > 0 && (
                      <span>
                        <Clock size={11} /> {post.read_time_minutes} min read
                      </span>
                    )}
                  </div>

                  <h2>{post.title}</h2>
                  {post.excerpt && <p className="blog-index-excerpt">{post.excerpt}</p>}

                  {post.tags && post.tags.length > 0 && (
                    <div className="blog-index-tags">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="blog-index-tag">
                          <Tag size={9} /> {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link href={`/blog/${post.slug}`} className="btn btn-outline-dark btn-sm d-inline-flex align-items-center gap-2 blog-index-read">
                    Read Article <ArrowRight size={13} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          
          {posts.length === 0 && (
            <div className="blog-empty-state">
              <BookOpen size={48} className="mb-3" style={{ color: 'var(--color-text-muted)' }} />
              <h3 style={{ color: 'var(--color-text)' }}>No posts found</h3>
              <p style={{ color: 'var(--color-text-sub)' }}>Check back later for new articles!</p>
            </div>
          )}
        </div>
      </main>
      <Footer profile={profile} />
    </>
  )
}
