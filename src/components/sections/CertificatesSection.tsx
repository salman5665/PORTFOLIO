'use client'

import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Award,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'
import type { Certificate } from '@/lib/supabase/types'

interface Props { certificates: Certificate[] }

function formatDate(d: string | null): string {
  if (!d) return ''
  const date = new Date(d)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[date.getUTCMonth()]
  const year = date.getUTCFullYear()
  return `${month} ${year}`
}

export default function CertificatesSection({ certificates }: Props) {
  const railRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  const sortedCertificates = useMemo(() => {
    return [...certificates].sort((a, b) => {
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1
      return new Date(b.issue_date || 0).getTime() - new Date(a.issue_date || 0).getTime()
    })
  }, [certificates])

  if (certificates.length === 0) return null

  const updateProgress = () => {
    const rail = railRef.current
    if (!rail) return
    const max = rail.scrollWidth - rail.clientWidth
    setProgress(max <= 0 ? 100 : Math.min(100, Math.max(0, (rail.scrollLeft / max) * 100)))
  }

  const scrollRail = (direction: 'prev' | 'next') => {
    const rail = railRef.current
    if (!rail) return
    const firstCard = rail.querySelector<HTMLElement>('.cert-card')
    const amount = firstCard ? firstCard.offsetWidth + 18 : rail.clientWidth * 0.85
    rail.scrollBy({ left: direction === 'next' ? amount : -amount, behavior: 'smooth' })
  }

  return (
    <section id="certificates" className="section section-alt">
      <div className="container" style={{ maxWidth: 1100 }}>
        <style>{`
          .cert-section-head {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 1.5rem;
            margin-bottom: 2.4rem;
          }

          .cert-controls {
            display: flex;
            align-items: center;
            gap: 0.65rem;
            flex-shrink: 0;
          }

          .cert-nav-btn {
            width: 40px;
            height: 40px;
            border-radius: 12px;
            border: 1px solid rgba(125, 211, 252, 0.2);
            background: rgba(15, 23, 42, 0.62);
            color: var(--color-text);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s var(--ease);
          }

          .cert-nav-btn:hover {
            border-color: rgba(34, 211, 238, 0.46);
            background: rgba(34, 211, 238, 0.11);
            transform: translateY(-1px);
          }

          .cert-rail {
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

          .cert-rail::-webkit-scrollbar {
            display: none;
          }

          .cert-card {
            flex: 0 0 min(360px, 84vw);
            scroll-snap-align: start;
            min-height: 390px;
            border-radius: 18px;
            overflow: hidden;
            background: linear-gradient(145deg, rgba(15, 23, 42, 0.88), rgba(2, 6, 23, 0.76));
            border: 1px solid rgba(125, 211, 252, 0.16);
            box-shadow: 0 22px 58px rgba(2, 6, 23, 0.38), inset 0 1px 0 rgba(255,255,255,0.045);
            backdrop-filter: blur(18px);
            transition: border-color 0.24s var(--ease), box-shadow 0.24s var(--ease), transform 0.24s var(--ease);
          }

          .cert-card:hover {
            border-color: rgba(34, 211, 238, 0.38);
            box-shadow: 0 28px 76px rgba(2, 6, 23, 0.5), 0 0 0 1px rgba(34, 211, 238, 0.1);
          }

          .cert-card.is-featured {
            border-color: rgba(34, 211, 238, 0.42);
          }

          .cert-media {
            position: relative;
            height: 170px;
            overflow: hidden;
            background:
              linear-gradient(rgba(125, 211, 252, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(125, 211, 252, 0.04) 1px, transparent 1px),
              linear-gradient(135deg, rgba(34, 211, 238, 0.12), rgba(139, 92, 246, 0.12));
            background-size: 28px 28px, 28px 28px, 100% 100%;
          }

          .cert-media img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.55s var(--ease);
          }

          .cert-card:hover .cert-media img {
            transform: scale(1.05);
          }

          .cert-fallback {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #67e8f9;
          }

          .cert-badge-row {
            position: absolute;
            inset: 12px 12px auto 12px;
            display: flex;
            justify-content: space-between;
            gap: 0.5rem;
            z-index: 2;
          }

          .cert-pill {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            padding: 0.35rem 0.55rem;
            border-radius: 999px;
            background: rgba(2, 6, 23, 0.72);
            border: 1px solid rgba(125, 211, 252, 0.2);
            color: #e2e8f0;
            font-size: 0.68rem;
            font-weight: 700;
            backdrop-filter: blur(12px);
          }

          .cert-pill.verified {
            color: #67e8f9;
            border-color: rgba(34, 211, 238, 0.32);
          }

          .cert-body {
            min-height: 220px;
            padding: 1.15rem;
            display: flex;
            flex-direction: column;
          }

          .cert-title {
            color: var(--color-text);
            font-size: 1rem;
            line-height: 1.35;
            font-weight: 800;
            margin: 0 0 0.85rem;
          }

          .cert-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 0.55rem;
            margin-bottom: 0.85rem;
          }

          .cert-meta-chip {
            padding: 0.38rem 0.55rem;
            border-radius: 10px;
            background: rgba(2, 6, 23, 0.42);
            border: 1px solid rgba(125, 211, 252, 0.13);
            color: var(--color-text-sub);
            font-size: 0.74rem;
            font-weight: 650;
          }

          .cert-id {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            color: var(--color-text-muted);
            font-size: 0.72rem;
            font-family: var(--font-mono);
            margin-bottom: 1rem;
            overflow-wrap: anywhere;
          }

          .cert-verify {
            margin-top: auto;
          }

          .cert-progress {
            height: 4px;
            border-radius: 999px;
            background: rgba(125, 211, 252, 0.12);
            overflow: hidden;
          }

          .cert-progress-bar {
            height: 100%;
            min-width: 16%;
            border-radius: inherit;
            background: linear-gradient(90deg, #22d3ee, #14b8a6, #8b5cf6);
            transition: width 0.28s ease;
          }

          .cert-mobile-hint {
            display: none;
          }

          @media (max-width: 767.98px) {
            .cert-section-head {
              align-items: flex-start;
              flex-direction: column;
              gap: 0.8rem;
              margin-bottom: 1.55rem;
            }

            .cert-controls {
              display: none;
            }

            .cert-mobile-hint {
              display: inline-flex;
              align-items: center;
              gap: 0.45rem;
              margin-bottom: 0.85rem;
              padding: 0.42rem 0.65rem;
              border-radius: 999px;
              border: 1px solid rgba(125, 211, 252, 0.16);
              background: rgba(15, 23, 42, 0.5);
              color: var(--color-text-sub);
              font-size: 0.74rem;
              font-weight: 700;
            }

            .cert-rail {
              gap: 0.85rem;
              padding: 0.1rem 0.8rem 1rem 0;
              scroll-padding-inline: 0;
            }

            .cert-card {
              flex-basis: min(88vw, 390px);
              min-height: 380px;
              border-radius: 16px;
            }

            .cert-media {
              height: 165px;
            }

            .cert-badge-row {
              inset: 10px 10px auto 10px;
            }

            .cert-pill {
              padding: 0.32rem 0.5rem;
              font-size: 0.66rem;
            }

            .cert-body {
              min-height: 215px;
              padding: 1rem;
            }

            .cert-title {
              font-size: 1rem;
              line-height: 1.36;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
              margin-bottom: 0.75rem;
            }

            .cert-meta {
              gap: 0.45rem;
              margin-bottom: 0.75rem;
            }

            .cert-meta-chip {
              padding: 0.34rem 0.5rem;
              font-size: 0.72rem;
            }

            .cert-id {
              font-size: 0.68rem;
              margin-bottom: 0.8rem;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }

            .cert-verify {
              min-height: 40px;
              padding-top: 0.42rem;
              padding-bottom: 0.42rem;
            }

            .cert-progress {
              height: 4px;
            }
          }
        `}</style>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="cert-section-head"
        >
          <div>
            <div className="section-tag"><Award size={13} /> Certificates</div>
            <h2 className="section-title">Verified Credentials</h2>
            <p className="section-subtitle mb-0">A focused rail of certifications, courses, and professional learning milestones.</p>
          </div>

          {certificates.length > 1 && (
            <div className="cert-controls" aria-label="Certificate navigation">
              <button type="button" className="cert-nav-btn" onClick={() => scrollRail('prev')} aria-label="Previous certificates">
                <ChevronLeft size={18} />
              </button>
              <button type="button" className="cert-nav-btn" onClick={() => scrollRail('next')} aria-label="Next certificates">
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </motion.div>

        <div>
          {certificates.length > 1 && (
            <div className="cert-mobile-hint" aria-hidden="true">
              Swipe certificates <ChevronRight size={14} />
            </div>
          )}

          <div className="cert-rail" ref={railRef} onScroll={updateProgress}>
            {sortedCertificates.map((cert, i) => (
              <motion.article
                key={cert.id}
                className={`cert-card${cert.is_featured ? ' is-featured' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                whileHover={{ y: -5 }}
              >
                <div className="cert-media">
                  {cert.image_url ? (
                    <img src={cert.image_url} alt={cert.title} loading="lazy" />
                  ) : (
                    <div className="cert-fallback">
                      <Award size={54} />
                    </div>
                  )}

                  <div className="cert-badge-row">
                    <span className="cert-pill verified">
                      {cert.credential_url ? <ShieldCheck size={12} /> : <Award size={12} />}
                      {cert.credential_url ? 'Verified' : 'Credential'}
                    </span>
                    {cert.is_featured && <span className="cert-pill">Featured</span>}
                  </div>
                </div>

                <div className="cert-body">
                  <h3 className="cert-title">{cert.title}</h3>

                  <div className="cert-meta">
                    <span className="cert-meta-chip">{cert.issuer}</span>
                    {cert.issue_date && (
                      <span className="cert-meta-chip" style={{ fontFamily: 'var(--font-mono)' }}>
                        {formatDate(cert.issue_date)}
                      </span>
                    )}
                  </div>

                  {cert.credential_id && (
                    <div className="cert-id">
                      <CheckCircle size={12} /> ID: {cert.credential_id}
                    </div>
                  )}

                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-dark btn-sm d-flex align-items-center justify-content-center gap-2 cert-verify"
                      style={{ fontSize: '0.8rem' }}
                    >
                      <ExternalLink size={13} /> Verify Credential
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>

          {certificates.length > 1 && (
            <div className="cert-progress" aria-hidden="true">
              <div className="cert-progress-bar" style={{ width: `${Math.max(progress, 16)}%` }} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
