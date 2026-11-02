'use client'

import { useEffect, useState, useRef } from 'react'
import {
  LayoutDashboard, FolderOpen, MessageSquare, Code2,
  Award, Clock, Plus, ArrowRight, ExternalLink, Eye,
  Globe, Activity, RefreshCcw
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { adminDb } from '@/lib/adminDb'
import AdminTopBar from '@/components/admin/AdminTopBar'

interface Stats {
  projects: number; messages: number; unreadMessages: number
  skills: number; certificates: number
}

function CountUp({ value, loading }: { value: number; loading: boolean }) {
  const [display, setDisplay] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (loading || value === 0) { setDisplay(0); return }
    const steps = 20
    let step = 0
    timer.current = setInterval(() => {
      step++
      setDisplay(Math.round(value * (step / steps)))
      if (step >= steps) { clearInterval(timer.current!); setDisplay(value) }
    }, 800 / steps)
    return () => clearInterval(timer.current!)
  }, [value, loading])
  if (loading) return <div style={{ height: 36, width: 48, borderRadius: 8, background: 'var(--admin-border)', animation: 'pulse 1.5s ease-in-out infinite' }} />
  return <span>{display}</span>
}

const STAT_CONFIGS = [
  { key: 'projects',     label: 'Projects',     icon: FolderOpen,    color: '#F5D77F', bg: 'rgba(212, 175, 55,0.12)',  href: '/admin/projects',    desc: 'Total projects' },
  { key: 'messages',     label: 'Messages',     icon: MessageSquare, color: '#f0abfc', bg: 'rgba(217,70,239,0.12)',  href: '/admin/messages',    desc: 'Inbox messages' },
  { key: 'skills',       label: 'Skills',       icon: Code2,         color: '#c4b5fd', bg: 'rgba(139,92,246,0.14)',  href: '/admin/skills',      desc: 'Across categories' },
  { key: 'certificates', label: 'Certificates', icon: Award,         color: '#5eead4', bg: 'rgba(20,184,166,0.14)',  href: '/admin/certificates',desc: 'Credentials' },
] as const

const QUICK_ACTIONS = [
  { label: 'Add New Project',    href: '/admin/projects',    icon: FolderOpen,    desc: 'Publish a new project to portfolio' },
  { label: 'Add Skill',          href: '/admin/skills',      icon: Code2,         desc: 'Add a technology or tool' },
  { label: 'Add Experience',     href: '/admin/experience',  icon: Activity,      desc: 'Add a job or internship entry' },
  { label: 'Read Messages',      href: '/admin/messages',    icon: MessageSquare, desc: 'Reply to contact form submissions' },
  { label: 'Update Settings',    href: '/admin/settings',    icon: LayoutDashboard, desc: 'Edit profile, bio, and links' },
]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ projects: 0, messages: 0, unreadMessages: 0, skills: 0, certificates: 0 })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    setTime(new Date())
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const fetchStats = async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const [pRes, mRes, uRes, sRes, cRes] = await Promise.all([
        adminDb.from('projects').select({ select: 'id', limit: 1000 }),
        adminDb.from('messages').select({ select: 'id', limit: 1000 }),
        adminDb.from('messages').select({ select: 'id', limit: 1000, where: { is_read: false } }),
        adminDb.from('skills').select({ select: 'id', limit: 1000 }),
        adminDb.from('certificates').select({ select: 'id', limit: 1000 }),
      ])
      setStats({
        projects: pRes.data?.length ?? 0,
        messages: mRes.data?.length ?? 0,
        unreadMessages: uRes.data?.length ?? 0,
        skills: sRes.data?.length ?? 0,
        certificates: cRes.data?.length ?? 0,
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchStats() }, [])

  const greeting = (() => {
    if (!time) return 'Welcome back'
    const h = time.getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  return (
    <>
      <AdminTopBar title="Dashboard" subtitle="Portfolio overview" />

      <div className="admin-page-content">
        {/* Welcome row */}
        <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4">
          <div>
            <p style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--admin-text-sub)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>
              Portfolio CMS
            </p>
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 1.85rem)', color: 'var(--admin-text)', letterSpacing: '-0.03em', margin: 0 }}>
              {greeting}
            </h2>
            <p style={{ color: 'var(--admin-text-sub)', fontSize: '0.875rem', margin: '4px 0 0' }}>
              Your portfolio is live. Here&apos;s a quick overview.
            </p>
          </div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {time && (
              <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
                style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', fontSize: '0.78rem', color: 'var(--admin-text-sub)', fontFamily: 'var(--font-mono)' }}>
                <Clock size={12} />
                {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            )}
            <button onClick={() => fetchStats(true)} disabled={refreshing}
              className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
              style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', fontSize: '0.78rem', color: 'var(--admin-text-sub)', cursor: 'pointer' }}>
              <RefreshCcw size={12} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
              Refresh
            </button>
            <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
              style={{ background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(45,212,191,0.28)', fontSize: '0.78rem', color: '#5eead4', fontWeight: 600 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#AA7A1E', display: 'inline-block' }} />
              <span className="d-none d-sm-inline">All systems live</span>
              <span className="d-sm-none">Live</span>
            </div>
          </div>
        </div>

        {/* Stats grid — 2 cols on mobile, 4 on desktop */}
        <div className="row row-cols-2 row-cols-xl-4 g-3 mb-4">
          {STAT_CONFIGS.map((cfg, i) => (
            <motion.div className="col" key={cfg.key}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Link href={cfg.href} style={{ textDecoration: 'none' }}>
                <motion.div whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} transition={{ duration: 0.2 }}
                  className="card shadow-sm h-100"
                  style={{ borderRadius: 14, border: '1px solid var(--admin-border)', overflow: 'hidden', cursor: 'pointer' }}>
                  <div className="card-body p-3 p-sm-4">
                    <div className="d-flex align-items-start justify-content-between mb-3">
                      <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                        style={{ width: 40, height: 40, background: cfg.bg }}>
                        <cfg.icon size={18} color={cfg.color} />
                      </div>
                      {cfg.key === 'messages' && stats.unreadMessages > 0 && (
                        <span className="badge rounded-pill" style={{ background: '#ef4444', color: 'var(--admin-surface)', fontSize: '0.7rem' }}>
                          {stats.unreadMessages} new
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)', fontWeight: 800, color: 'var(--admin-text)', lineHeight: 1, marginBottom: 4 }}>
                      <CountUp value={stats[cfg.key]} loading={loading} />
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--admin-text-sub)', fontSize: '0.85rem', marginBottom: 2 }}>{cfg.label}</div>
                    <div style={{ color: 'var(--admin-text-sub)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>{cfg.desc}</div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick actions + preview */}
        <div className="row g-4 mb-4">
          {/* Quick Actions */}
          <div className="col-lg-8">
            <div className="card shadow-sm h-100" style={{ borderRadius: 14, border: '1px solid var(--admin-border)' }}>
              <div className="card-body p-3 p-sm-4">
                <h2 style={{ fontWeight: 700, color: 'var(--admin-text)', fontSize: '0.95rem', marginBottom: '1rem' }}>
                  Quick Actions
                </h2>
                <div className="d-flex flex-column gap-2">
                  {QUICK_ACTIONS.map((action, i) => (
                    <motion.div key={action.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06 }}>
                      <Link href={action.href}
                        className="d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none"
                        style={{ background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)', transition: 'all 0.15s ease' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212, 175, 55,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212, 175, 55,0.28)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--admin-main-bg)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--admin-border)' }}>
                        <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                          style={{ width: 36, height: 36, background: 'var(--admin-surface)', border: '1px solid var(--admin-border)' }}>
                          <action.icon size={15} color="var(--admin-text-sub)" />
                        </div>
                        <div className="flex-grow-1 min-w-0">
                          <div style={{ fontWeight: 600, color: 'var(--admin-text)', fontSize: '0.875rem' }}>{action.label}</div>
                          <div style={{ color: 'var(--admin-text-sub)', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{action.desc}</div>
                        </div>
                        <ArrowRight size={15} color="#F5D77F" style={{ flexShrink: 0 }} />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Info panel */}
          <div className="col-lg-4">
            <div className="card shadow-sm h-100" style={{ borderRadius: 14, border: '1px solid var(--admin-border)', background: 'linear-gradient(160deg, var(--admin-main-bg) 0%, var(--admin-border-soft) 100%)' }}>
              <div className="card-body p-3 p-sm-4 d-flex flex-column">
                <h2 style={{ fontWeight: 700, color: 'var(--admin-text)', fontSize: '0.95rem', marginBottom: '1rem' }}>Content Status</h2>
                <div className="d-flex flex-column gap-3 flex-grow-1">
                  {[
                    { label: 'Projects', value: stats.projects, max: 20, color: '#D4AF37' },
                    { label: 'Skills',   value: stats.skills,   max: 40, color: '#B8860B' },
                    { label: 'Certs',    value: stats.certificates, max: 15, color: '#AA7A1E' },
                  ].map(row => (
                    <div key={row.label}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--admin-text-sub)' }}>{row.label}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-sub)', fontFamily: 'var(--font-mono)' }}>{loading ? '-' : row.value}</span>
                      </div>
                      <div style={{ height: 5, background: 'var(--admin-border)', borderRadius: 4, overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: loading ? '0%' : `${Math.min((row.value / row.max) * 100, 100)}%` }}
                          transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                          style={{ height: '100%', background: row.color, borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Unread messages callout */}
                {!loading && stats.unreadMessages > 0 && (
                  <Link href="/admin/messages"
                    className="d-flex align-items-center gap-2 mt-4 p-3 rounded-3 text-decoration-none"
                    style={{ background: 'rgba(217,70,239,0.12)', border: '1px solid rgba(240,171,252,0.28)', color: '#f0abfc' }}>
                    <MessageSquare size={14} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                      {stats.unreadMessages} unread message{stats.unreadMessages !== 1 ? 's' : ''}
                    </span>
                    <ArrowRight size={13} style={{ marginLeft: 'auto', flexShrink: 0 }} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Live preview banner */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="card shadow-sm"
          style={{ borderRadius: 14, border: '1px solid rgba(243, 229, 171,0.18)', background: 'linear-gradient(135deg, rgba(20, 16, 5,0.9) 0%, rgba(10, 8, 0,0.78) 100%)' }}>
          <div className="card-body p-3 p-sm-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                style={{ width: 44, height: 44, background: 'rgba(212, 175, 55,0.12)', border: '1px solid rgba(212, 175, 55,0.28)' }}>
                <Globe size={20} color="#F5D77F" />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--admin-text)', fontSize: '0.925rem' }}>Your portfolio is live</div>
                <div style={{ color: 'var(--admin-text-sub)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                  Data updates reflect within ~60s
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <Link href="/admin/settings" className="btn btn-sm"
                style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-sub)', borderRadius: 10, fontSize: '0.8rem' }}>
                Settings
              </Link>
              <a href="/" target="_blank" rel="noopener noreferrer"
                className="btn btn-sm d-flex align-items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #F5D77F, #D4AF37 52%, #B8860B)', color: '#0A0800', borderRadius: 10, fontSize: '0.8rem', border: 0 }}
                id="admin-view-portfolio">
                <Eye size={13} /> Preview <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
