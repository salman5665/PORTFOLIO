'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Tag,
} from 'lucide-react'
import Link from 'next/link'
import type { BlogPost } from '@/lib/supabase/types'

interface Props { posts: BlogPost[] }

function formatDate(d: string | null): string {
  if (!d) return ''
  const date = new Date(d)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[date.getUTCMonth()]
  const day = date.getUTCDate()
  return `${month} ${day}`
}

export default function BlogSection({ posts }: Props) {
  const railRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  if (posts.length === 0) return null

  const updateProgress = () => {
    const rail = railRef.current
    if (!rail) return
    const max = rail.scrollWidth - rail.clientWidth
    setProgress(max <= 0 ? 100 : Math.min(100, Math.max(0, (rail.scrollLeft / max) * 100)))
  }

  const scrollRail = (direction: 'prev' | 'next') => {
    const rail = railRef.current
    if (!rail) return
    const firstCard = rail.querySelector<HTMLElement>('.blog-rail-card')
    const amount = firstCard ? firstCard.offsetWidth + 18 : rail.clientWidth * 0.85
    rail.scrollBy({ left: direction === 'next' ? amount : -amount, behavior: 'smooth' })
  }

  return (
    <section id="blog" className="section section-alt">
      <div className="container" style={{ maxWidth: 1100 }}>
        <style>{`
          .blog-section-head {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 1.5rem;
            margin-bottom: 2.4rem;
          }

          .blog-controls {
            display: flex;
            align-items: center;
            gap: 0.65rem;
            flex-shrink: 0;
          }

          .blog-nav-btn {
            width: 40px;
            height: 40px;
            border-radius: 12px;
            border: 1px solid rgba(243, 229, 171, 0.2);
            background: rgba(20, 16, 5, 0.62);
            color: var(--color-text);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s var(--ease);
          }

          .blog-nav-btn:hover {
            border-color: rgba(212, 175, 55, 0.46);
            background: rgba(212, 175, 55, 0.11);
            transform: translateY(-1px);
          }

          .blog-view-all {
            min-height: 40px;
            border-radius: 12px;
            padding-inline: 1rem;
          }

          .blog-rail {
            display: flex;
            gap: 1.1rem;
            overflow-x: auto;
            overflow-y: hidden;
            overscroll-behavior-x: contain;
            scroll-snap-type: x mandatory;
            scroll-padding-inline: 2px;
            padding: 0.15rem 0.1rem 1.15rem;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
            touch-action: auto;
          }

          .blog-rail::-webkit-scrollbar {
            display: none;
          }

          .blog-rail-card {
            flex: 0 0 min(365px, 84vw);
            scroll-snap-align: start;
            min-height: 420px;
            border-radius: 18px;
            overflow: hidden;
            background: linear-gradient(145deg, rgba(20, 16, 5, 0.88), rgba(10, 8, 0, 0.76));
            border: 1px solid rgba(243, 229, 171, 0.16);
            box-shadow: 0 22px 58px rgba(10, 8, 0, 0.38), inset 0 1px 0 rgba(255,255,255,0.045);
            backdrop-filter: blur(18px);
            transition: border-color 0.24s var(--ease), box-shadow 0.24s var(--ease);
          }

          .blog-rail-card:hover {
            border-color: rgba(212, 175, 55, 0.38);
            box-shadow: 0 28px 76px rgba(10, 8, 0, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.1);
          }

          .blog-card-media {
            position: relative;
            height: 178px;
            overflow: hidden;
            background:
              linear-gradient(rgba(243, 229, 171, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(243, 229, 171, 0.04) 1px, transparent 1px),
              linear-gradient(135deg, rgba(212, 175, 55, 0.12), rgba(139, 92, 246, 0.12));
            background-size: 28px 28px, 28px 28px, 100% 100%;
          }

          .blog-card-media img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.55s var(--ease);
          }

          .blog-rail-card:hover .blog-card-media img {
            transform: scale(1.05);
          }

          .blog-card-fallback {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #F5D77F;
          }

          .blog-card-body {
            min-height: 240px;
            padding: 1.15rem;
            display: flex;
            flex-direction: column;
          }

          .blog-card-meta {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.55rem;
            margin-bottom: 0.85rem;
            color: var(--color-text-muted);
            font-family: var(--font-mono);
            font-size: 0.72rem;
          }

          .blog-card-meta span {
            display: inline-flex;
            align-items: center;
            gap: 0.3rem;
            padding: 0.28rem 0.45rem;
            border-radius: 999px;
            background: rgba(10, 8, 0, 0.38);
            border: 1px solid rgba(243, 229, 171, 0.12);
          }

          .blog-card-title {
            color: var(--color-text);
            font-size: 1rem;
            line-height: 1.38;
            font-weight: 800;
            margin: 0 0 0.65rem;
          }

          .blog-card-excerpt {
            color: var(--color-text-sub);
            font-size: 0.86rem;
            line-height: 1.65;
            margin: 0 0 0.9rem;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .blog-tag-row {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem;
            margin-bottom: 1rem;
          }

          .blog-tag {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.32rem 0.48rem;
            border-radius: 999px;
            background: rgba(212, 175, 55, 0.1);
            border: 1px solid rgba(212, 175, 55, 0.2);
            color: #F5D77F;
            font-size: 0.68rem;
            font-weight: 700;
          }

          .blog-read-link {
            margin-top: auto;
          }

          .blog-progress {
            height: 4px;
            border-radius: 999px;
            background: rgba(243, 229, 171, 0.12);
            overflow: hidden;
          }

          .blog-progress-bar {
            height: 100%;
            min-width: 16%;
            border-radius: inherit;
            background: linear-gradient(90deg, #D4AF37, #AA7A1E, #B8860B);
            transition: width 0.28s ease;
          }

          .blog-mobile-hint {
            display: none;
          }

          @media (max-width: 767.98px) {
            .blog-section-head {
              align-items: flex-start;
              flex-direction: column;
              gap: 1rem;
              margin-bottom: 1.55rem;
            }

            .blog-controls {
              display: none;
            }

            .blog-view-all {
              width: 100%;
              justify-content: center;
            }

            .blog-mobile-hint {
              display: inline-flex;
              align-items: center;
              gap: 0.45rem;
              margin-bottom: 0.85rem;
              padding: 0.42rem 0.65rem;
              border-radius: 999px;
              border: 1px solid rgba(243, 229, 171, 0.16);
              background: rgba(20, 16, 5, 0.5);
              color: var(--color-text-sub);
              font-size: 0.74rem;
              font-weight: 700;
            }

            .blog-rail {
              gap: 0.85rem;
              padding: 0.1rem 0.8rem 1rem 0;
              scroll-padding-inline: 0;
            }

            .blog-rail-card {
              flex-basis: 82vw;
              min-height: 345px;
              border-radius: 16px;
            }

            .blog-card-media {
              height: 126px;
            }

            .blog-card-body {
              min-height: 215px;
              padding: 0.9rem;
            }

            .blog-card-meta {
              gap: 0.4rem;
              font-size: 0.65rem;
              margin-bottom: 0.65rem;
            }

            .blog-card-title {
              font-size: 0.92rem;
              line-height: 1.32;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }

            .blog-card-excerpt {
              font-size: 0.78rem;
              line-height: 1.5;
              -webkit-line-clamp: 2;
              margin-bottom: 0.7rem;
            }

            .blog-tag-row {
              margin-bottom: 0.75rem;
            }

            .blog-tag {
              font-size: 0.62rem;
              padding: 0.28rem 0.42rem;
            }

            .blog-read-link {
              min-height: 34px;
              padding-top: 0.42rem;
              padding-bottom: 0.42rem;
            }

            .blog-progress {
              height: 3px;
            }
          }
        `}</style>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="blog-section-head"
        >
          <div>
            <div className="section-tag"><BookOpen size={13} /> Blog</div>
            <h2 className="section-title">Latest Articles</h2>
            <p className="section-subtitle mb-0">Thoughts, tutorials, and insights on software development and technology.</p>
          </div>

          <div className="blog-controls">
            {posts.length > 1 && (
              <>
                <button type="button" className="blog-nav-btn" onClick={() => scrollRail('prev')} aria-label="Previous articles">
                  <ChevronLeft size={18} />
                </button>
                <button type="button" className="blog-nav-btn" onClick={() => scrollRail('next')} aria-label="Next articles">
                  <ChevronRight size={18} />
                </button>
              </>
            )}
            <Link href="/blog" className="btn btn-outline-dark d-inline-flex align-items-center gap-2 blog-view-all">
              <BookOpen size={15} /> View All
            </Link>
          </div>
        </motion.div>

        <div>
          {posts.length > 1 && (
            <div className="blog-mobile-hint" aria-hidden="true">
              Swipe articles <ChevronRight size={14} />
            </div>
          )}

          <div className="blog-rail" ref={railRef} onScroll={updateProgress}>
            {posts.map((post, i) => (
              <motion.article
                className="blog-rail-card"
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                whileHover={{ y: -5 }}
              >
                <div className="blog-card-media">
                  {post.cover_image_url ? (
                    <img src={post.cover_image_url} alt={post.title} loading="lazy" />
                  ) : (
                    <div className="blog-card-fallback">
                      <BookOpen size={54} />
                    </div>
                  )}
                </div>

                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    {post.published_at && (
                      <span>
                        <CalendarDays size={11} />
                        {formatDate(post.published_at)}
                      </span>
                    )}
                    {post.read_time_minutes > 0 && (
                      <span>
                        <Clock size={11} /> {post.read_time_minutes} min
                      </span>
                    )}
                  </div>

                  <h3 className="blog-card-title">{post.title}</h3>
                  {post.excerpt && <p className="blog-card-excerpt">{post.excerpt}</p>}

                  {post.tags?.length > 0 && (
                    <div className="blog-tag-row">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="blog-tag">
                          <Tag size={9} /> {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/blog/${post.slug}`}
                    className="btn btn-outline-dark btn-sm d-flex align-items-center justify-content-center gap-2 blog-read-link"
                    style={{ fontSize: '0.8rem' }}
                  >
                    Read Article <ExternalLink size={13} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {posts.length > 1 && (
            <div className="blog-progress" aria-hidden="true">
              <div className="blog-progress-bar" style={{ width: `${Math.max(progress, 16)}%` }} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
