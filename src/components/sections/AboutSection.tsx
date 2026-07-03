'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import CountUp from 'react-countup'
import {
  User,
  Layers3,
  Code2,
  Award,
  MapPin,
  Rocket,
  BrainCircuit,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import GithubContributionGraph from './GithubContributionGraph'
import LeetcodeWidget from './LeetcodeWidget'
import type { Profile, Project, Skill, Certificate, JourneyItem } from '@/lib/supabase/types'

const DEFAULT_JOURNEY: JourneyItem[] = [
  { id: '1', year: '2022', title: 'Started Coding Journey', desc: 'Began my BCA journey and discovered a passion for programming and web development.' },
  { id: '2', year: '2023', title: 'Beginner Development', desc: 'Mastered HTML, CSS, JavaScript, PHP. Built first real web projects.' },
  { id: '3', year: '2024', title: 'Full-Stack Developer', desc: 'Learned ASP.NET Core, Flutter, DSA, and many more... during BCA.' },
  { id: '4', year: '2025', title: 'MCA & Advanced Tech', desc: 'Started MCA. Deep-dived into Next.js, TypeScript, cloud services, and AI.' },
  { id: '5', year: '2026+', title: 'Building at Scale', desc: 'Building production-grade applications, exploring AI integrations and DevOps.' },
]

interface StatDef {
  icon: LucideIcon
  label: string
  value: number
  suffix: string
}

function StatCard({ stat, i }: { stat: StatDef; i: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-50px' })

  return (
    <motion.div className="col-6 col-lg-3" ref={ref}
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.15 }} transition={{ delay: i * 0.1, duration: 0.5 }}>
      <div className="card shadow-vs text-center h-100">
        <div className="card-body p-4 d-flex flex-column align-items-center gap-3">
          <div className="d-flex align-items-center justify-content-center rounded-3"
            style={{ width: 48, height: 48, background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
            <stat.icon size={22} color="var(--color-text)" />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1, letterSpacing: '-0.03em' }}>
            {inView ? <CountUp end={stat.value} duration={2.5} /> : stat.value}{stat.suffix}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)', fontWeight: 500 }}>{stat.label}</div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Avatar with enhanced IG-style popup ──
function AvatarWithPopup({
  avatarUrl, name, tagline, isAvailable,
}: {
  avatarUrl?: string | null
  name: string
  tagline?: string | null
  isAvailable?: boolean
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Inline avatar circle trigger */}
      <motion.div
        whileHover={avatarUrl ? { scale: 1.06 } : undefined}
        whileTap={avatarUrl ? { scale: 0.97 } : undefined}
        onClick={avatarUrl ? () => setOpen(true) : undefined}
        className="rounded-circle flex-shrink-0 overflow-hidden d-flex align-items-center justify-content-center"
        style={{
          width: 'clamp(56px, 8vw, 72px)',
          height: 'clamp(56px, 8vw, 72px)',
          background: 'var(--color-bg)',
          border: '2.5px solid var(--color-border)',
          position: 'relative',
          fontWeight: 900,
          fontSize: '1.75rem',
          color: 'var(--color-text)',
          cursor: avatarUrl ? 'pointer' : 'default',
          transition: 'border-color 0.2s ease',
        }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          name.charAt(0)
        )}
      </motion.div>

      {/* Enhanced full-screen popup */}
      <AnimatePresence>
        {open && avatarUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9998,
              background: 'radial-gradient(ellipse at center, rgba(14,20,40,0.92) 0%, rgba(2,6,23,0.97) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'zoom-out',
              padding: '24px',
              borderRadius: '16px',
            }}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.15 }}
              onClick={() => setOpen(false)}
              style={{
                position: 'fixed',
                top: 20,
                right: 20,
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                zIndex: 9999,
                lineHeight: 1,
              }}
            >
              ✕
            </motion.button>

            {/* Photo */}
            <motion.div
              initial={{ scale: 0.65, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.65, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: 'clamp(200px, 48vw, 270px)',
                height: 'clamp(200px, 48vw, 270px)',
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0 8px 48px rgba(0,0,0,0.55)',
                cursor: 'default',
                flexShrink: 0,
              }}
            >
              <img
                src={avatarUrl}
                alt={name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </motion.div>

            {/* Name + tagline + badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ delay: 0.18, duration: 0.35 }}
              onClick={e => e.stopPropagation()}
              style={{ textAlign: 'center', marginTop: 24, cursor: 'default' }}
            >
              <div style={{
                fontWeight: 800,
                color: '#fff',
                fontSize: 'clamp(1.15rem, 3vw, 1.4rem)',
                letterSpacing: '-0.02em',
                marginBottom: 6,
              }}>
                {name}
              </div>
              {tagline && (
                <div style={{
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: 'clamp(0.78rem, 2vw, 0.9rem)',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: 12,
                }}>
                  {tagline}
                </div>
              )}
              {isAvailable && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(34,197,94,0.12)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  color: '#4ade80',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: 20,
                }}>
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}
                  />
                  Available for Work
                </div>
              )}
            </motion.div>

            {/* ESC hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                position: 'fixed',
                bottom: 24,
                color: 'rgba(255,255,255,0.25)',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.05em',
                pointerEvents: 'none',
              }}
            >
              click anywhere · esc to close
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

interface Props {
  profile?: Profile | null
  projects?: Project[]
  skills?: Skill[]
  certificates?: Certificate[]
  journey?: JourneyItem[]
}

export default function AboutSection({ profile, projects = [], skills = [], certificates = [], journey = [] }: Props) {
  const finalJourney = journey.length > 0 ? journey : DEFAULT_JOURNEY
  const name = profile?.name || 'Vinit Soni'

  const bio = profile?.bio || "I am Vinit Soni, a Full-Stack Developer and MCA student. I love building web apps that combine strong engineering with clean design. I specialize in the modern JavaScript ecosystem including React, Next.js, and Node.js. My work covers everything from database design to polished frontends."
  const location = profile?.location || 'India'
  const github = profile?.github_url || 'https://github.com'
  const linkedin = profile?.linkedin_url || 'https://linkedin.com'
  const isAvailable = profile ? profile.is_available_for_work : true

  const projectCount = projects.length
  const skillCount = skills.length
  const certCount = certificates.length
  const yearsCoding = Math.max(1, new Date().getFullYear() - 2022)

  const stats: StatDef[] = [
    {
      icon: Rocket,
      label: 'Projects Built',
      value: projectCount || 1,
      suffix: projectCount > 0 ? '+' : ''
    },

    {
      icon: Code2,
      label: 'Technologies',
      value: skillCount || 1,
      suffix: skillCount > 0 ? '+' : ''
    },

    {
      icon: Layers3,
      label: 'Years of Coding',
      value: yearsCoding,
      suffix: '+'
    },

    {
      icon: Award,
      label: 'Certificates',
      value: certCount || 0,
      suffix: certCount > 0 ? '+' : ''
    },
  ]

  const facts = [
    { label: 'Location', value: location },
    { label: 'Status', value: isAvailable ? 'Available' : 'Unavailable' },
    { label: 'Focus', value: 'Full-Stack Dev' },
    { label: 'Passion', value: 'AI + Web' },
  ]

  return (
    <section id="about" className="section section-alt">
      <div className="container" style={{ maxWidth: 1100 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.15 }} transition={{ duration: 0.6 }} className="mb-5">
          <div className="section-tag"><User size={13} /> About Me</div>
          <h2 className="section-title">Crafting Digital Experiences</h2>
          <p className="section-subtitle">Building scalable web, mobile, and AI-powered experiences with modern technologies.</p>
        </motion.div>

        <div className="row g-5 align-items-start mb-5">

          <motion.div className="col-lg-6"
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.15 }} transition={{ delay: 0.2, duration: 0.7 }}>
            <div className="card shadow-vs mb-4">
              <div className="card-body p-4 p-md-5">
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 gap-md-3 mb-3 mb-md-4 pb-3 pb-md-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <div className="d-flex align-items-center gap-3">
                    {/* Avatar — renders circle + popup in one component */}
                    <AvatarWithPopup
                      avatarUrl={profile?.avatar_url}
                      name={name}
                      tagline={profile?.tagline}
                      isAvailable={isAvailable}
                    />
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--color-text)', fontSize: '1.05rem' }}>{name}</div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={12} /> {location}
                      </div>
                    </div>
                  </div>
                  {isAvailable && (
                    <div className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill"
                      style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                        style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                      Open for Opportunities
                    </div>
                  )}
                </div>

                <p style={{ color: 'var(--color-text-sub)', lineHeight: 1.85, marginBottom: '1.25rem' }}>{bio}</p>

                <div className="row g-3 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                  {facts.map((fact) => (
                    <div className="col-6" key={fact.label}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: 4 }}>{fact.label}</div>
                      <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.875rem' }}>{fact.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="d-flex gap-3">
              <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                href={github} target="_blank" rel="noopener noreferrer"
                className="btn btn-outline-dark flex-fill d-flex align-items-center justify-content-center gap-2">
                <FaGithub size={16} /> GitHub
              </motion.a>
              <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                href={linkedin} target="_blank" rel="noopener noreferrer"
                className="btn btn-dark flex-fill d-flex align-items-center justify-content-center gap-2">
                <FaLinkedinIn size={16} /> LinkedIn
              </motion.a>
            </div>
          </motion.div>


          <motion.div className="col-lg-6"
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.15 }} transition={{ delay: 0.3, duration: 0.7 }}>
            <h3 className="mb-4" style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1.05rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginRight: 8 }}>{'// '}</span>My Journey
            </h3>
            <div className="vs-timeline">
              {finalJourney.map((item, i) => (
                <motion.div key={item.id || `${item.year}-${i}`} className="vs-timeline-item"
                  initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.15 }} transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}>
                  <div className="vs-timeline-dot" />
                  <div className="card shadow-vs ms-2">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="font-mono" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
                          {item.year}
                        </span>
                        <h4 style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.875rem', margin: 0 }}>{item.title}</h4>
                      </div>
                      <p style={{ color: 'var(--color-text-sub)', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="row g-4 mb-5">
          {stats.map((stat, i) => <StatCard key={stat.label} stat={stat} i={i} />)}
        </div>

        {/* GitHub + Leetcode */}
        {/* <div className="row g-4">
          <motion.div className="col-lg-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.15 }} transition={{ delay: 0.5 }}>
            <GithubContributionGraph />
          </motion.div>
          <motion.div className="col-lg-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.15 }} transition={{ delay: 0.6 }}>
            <LeetcodeWidget />
          </motion.div>
        </div> */}
      </div>
    </section>
  )
}