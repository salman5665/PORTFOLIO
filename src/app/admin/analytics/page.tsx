'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { adminDb } from '@/lib/adminDb'
import { supabase } from '@/lib/supabase/client'
import type { AnalyticsEvent } from '@/lib/supabase/types'
import AdminTopBar from '@/components/admin/AdminTopBar'
import {
  Users,
  Monitor,
  Smartphone,
  Activity,
  ChevronDown,
  ChevronRight,
  BarChart3,
  MousePointerClick,
  TrendingUp,
  X,
  Search,
  Bot,
  Trash2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// ─── Custom Chart Tooltip ─────────────────────────────────────────────────────
// Defined outside the component to avoid re-creating on every render,
// which previously caused the tooltip to flicker/remount.
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'var(--admin-surface)',
          border: '1px solid var(--admin-border)',
          padding: '12px 16px',
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        }}
      >
        <p style={{ margin: '0 0 8px', fontWeight: 600, color: 'var(--admin-text)' }}>
          {label}
        </p>
        <div className="d-flex flex-column gap-1">
          <span style={{ color: '#67e8f9', fontWeight: 600, fontSize: '0.85rem' }}>
            Page Views: {payload[0]?.value ?? '—'}
          </span>
          <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>
            Unique Visitors: {payload[1]?.value ?? '—'}
          </span>
        </div>
      </div>
    )
  }
  return null
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  iconBg: string
  iconColor: string
  loading: boolean
}

const StatCard = ({ icon, label, value, iconBg, iconColor, loading }: StatCardProps) => (
  <div className="col-12 col-md-4">
    <div
      className="card shadow-sm h-100"
      style={{ borderRadius: 14, border: '1px solid var(--admin-border)', overflow: 'hidden' }}
    >
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-3 mb-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{ width: 38, height: 38, background: iconBg, color: iconColor }}
          >
            {icon}
          </div>
          <span style={{ fontWeight: 600, color: 'var(--admin-text-sub)', fontSize: '0.85rem' }}>
            {label}
          </span>
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--admin-text)' }}>
          {loading ? (
            <span
              style={{
                display: 'inline-block',
                width: 60,
                height: 32,
                borderRadius: 8,
                background: 'var(--admin-border)',
                animation: 'pulse 1.4s ease-in-out infinite',
              }}
            />
          ) : (
            value
          )}
        </div>
      </div>
    </div>
  </div>
)

const valueOrUnknown = (value: unknown) => {
  if (Array.isArray(value)) return value.length ? value.join(', ') : 'Unknown'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value === null || value === undefined || value === '') return 'Unknown'
  return String(value)
}

const getMeta = (event?: AnalyticsEvent) => (event?.metadata || {}) as Record<string, any>

const countBy = (events: AnalyticsEvent[], selector: (event: AnalyticsEvent) => string | null | undefined) => {
  const counts = new Map<string, number>()
  events.forEach(event => {
    const key = selector(event)
    if (!key || key === 'Unknown') return
    counts.set(key, (counts.get(key) || 0) + 1)
  })
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
}

const formatDuration = (ms: number) => {
  if (!Number.isFinite(ms) || ms <= 0) return '0s'
  const seconds = Math.round(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return minutes > 0 ? `${minutes}m ${remainder}s` : `${remainder}s`
}

const eventLabel = (event: AnalyticsEvent) => {
  const meta = getMeta(event)
  const engagement = meta.engagementAnalytics || {}
  if (event.event_type === 'click') return `Clicked ${valueOrUnknown(engagement.clickCategory)}`
  if (event.event_type?.startsWith('scroll_')) return `Scrolled ${event.event_type.replace('scroll_', '')}%`
  if (event.event_type === 'page_exit') return `Exited ${event.page || 'page'}`
  if (event.event_type === 'contact_submit') return 'Submitted contact form'
  if (event.event_type === 'resume_download') return 'Downloaded resume'
  return `Viewed ${event.page || 'page'}`
}

const DetailGrid = ({ title, rows }: { title: string; rows: Array<[string, unknown]> }) => (
  <div
    style={{
      border: '1px solid var(--admin-border)',
      borderRadius: 12,
      background: 'var(--admin-surface)',
      padding: 16,
      minHeight: '100%',
    }}
  >
    <h5 style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--admin-text)', marginBottom: 12 }}>
      {title}
    </h5>
    <div className="d-flex flex-column gap-2">
      {rows.map(([label, value]) => (
        <div key={label} className="d-flex justify-content-between gap-3" style={{ fontSize: '0.76rem' }}>
          <span style={{ color: 'var(--admin-text-sub)' }}>{label}</span>
          <strong style={{ color: 'var(--admin-text)', textAlign: 'right', wordBreak: 'break-word' }}>
            {valueOrUnknown(value)}
          </strong>
        </div>
      ))}
    </div>
  </div>
)

const TopList = ({ title, rows }: { title: string; rows: Array<[string, number]> }) => (
  <div className="card shadow-sm h-100" style={{ borderRadius: 14, border: '1px solid var(--admin-border)' }}>
    <div className="card-body p-4">
      <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--admin-text)', marginBottom: 14 }}>
        {title}
      </h3>
      <div className="d-flex flex-column gap-2">
        {rows.length === 0 ? (
          <span style={{ color: 'var(--admin-text-sub)', fontSize: '0.82rem' }}>No data yet</span>
        ) : (
          rows.map(([label, count]) => (
            <div key={label} className="d-flex align-items-center justify-content-between gap-3">
              <span style={{ color: 'var(--admin-text-sub)', fontSize: '0.82rem', wordBreak: 'break-word' }}>
                {label}
              </span>
              <strong style={{ color: 'var(--admin-text)', fontSize: '0.82rem' }}>{count}</strong>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
)

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AnalyticsDashboardPage() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showLocal, setShowLocal] = useState(true)
  const [expandedVisitorId, setExpandedVisitorId] = useState<string | null>(null)
  const [aiLogs, setAiLogs] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [selectedChat, setSelectedChat] = useState<any | null>(null)
  const [liveVisitorCount, setLiveVisitorCount] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(false)

  // ─── Pagination States ──────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [currentAiPage, setCurrentAiPage] = useState(1)
  const [aiItemsPerPage, setAiItemsPerPage] = useState(10)

  // ─── Filter States ──────────────────────────────────────────────────────────
  const [visitorSearch, setVisitorSearch] = useState('')
  const [visitorDeviceFilter, setVisitorDeviceFilter] = useState<'all' | 'desktop' | 'mobile'>('all')
  const [aiTypeFilter, setAiTypeFilter] = useState<'all' | 'recruiter' | 'technical' | 'general'>('all')

  // Reset pagination when local or other visitor filters change
  useEffect(() => {
    setCurrentPage(1)
    setExpandedVisitorId(null)
  }, [showLocal, visitorSearch, visitorDeviceFilter])

  // Reset AI pagination when search/type filter changes
  useEffect(() => {
    setCurrentAiPage(1)
  }, [search, aiTypeFilter])


  // ─── Data Fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        // FIX: .select() takes a column string, not an options object.
        // Options like .order() and .limit() must be chained separately.
        const [analyticsRes, aiRes] = await Promise.all([
  adminDb
    .from('analytics_events')
    .select({
      order: 'created_at',
      ascending: false,
      limit: 3000,
    }),         

  adminDb
    .from('ai_chat_logs')
    .select({
      order: 'created_at',
      ascending: false,
      limit: 300,
    }),
])

        if (analyticsRes.data) setEvents(analyticsRes.data as AnalyticsEvent[])
        if (aiRes.data) setAiLogs(aiRes.data)
      } catch (err) {
        console.error('Failed to fetch analytics', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  useEffect(() => {
    const playNotificationSound = () => {
      if (!soundEnabled) return
      try {
        const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        if (!AudioContextClass) return
        const context = new AudioContextClass()
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        oscillator.type = 'sine'
        oscillator.frequency.value = 720
        gain.gain.setValueAtTime(0.001, context.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.22)
        oscillator.connect(gain)
        gain.connect(context.destination)
        oscillator.start()
        oscillator.stop(context.currentTime + 0.24)
      } catch {
        // Browsers can block audio until the admin interacts with the page.
      }
    }

    const channel = supabase
      .channel('admin-analytics-events')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'analytics_events' },
        payload => {
          const event = payload.new as AnalyticsEvent
          setEvents(prev => [event, ...prev].slice(0, 3000))
          const meta = getMeta(event)
          if (event.event_type === 'page_view') {
            setLiveVisitorCount(count => count + 1)
            toast.success(`Visitor on ${event.page || '/'}`, {
              description: `${valueOrUnknown(meta.city)}, ${valueOrUnknown(meta.country)} - ${valueOrUnknown(meta.browserIntelligence?.deviceType)}`,
            })
            playNotificationSound()
          }
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [soundEnabled])

  // ─── Toggle Expand ──────────────────────────────────────────────────────────
  const toggleExpand = useCallback((vId: string) => {
    setExpandedVisitorId(prev => (prev === vId ? null : vId))
  }, [])

  const deleteVisitorSession = useCallback(async (vId: string, userEvents: AnalyticsEvent[]) => {
    if (!confirm(`Delete ${userEvents.length} visitor log${userEvents.length === 1 ? '' : 's'} for this session?`)) return

    const results = await Promise.all(userEvents.map(ev => adminDb.from('analytics_events').delete(ev.id)))
    const failed = results.filter(res => res.error)

    if (failed.length) {
      toast.error(`Failed to delete ${failed.length} visitor log${failed.length === 1 ? '' : 's'}.`)
      return
    }

    setEvents(prev => prev.filter(ev => !userEvents.some(sessionEv => sessionEv.id === ev.id)))
    setExpandedVisitorId(prev => (prev === vId ? null : prev))
    toast.success('Visitor session logs deleted.')
  }, [])

  const deleteChatLog = useCallback(async (id: string) => {
    if (!confirm('Delete this AI conversation log?')) return

    const { error } = await adminDb.from('ai_chat_logs').delete(id)
    if (error) {
      toast.error('Delete failed: ' + error)
      return
    }

    setAiLogs(prev => prev.filter(log => log.id !== id))
    setSelectedChat(prev => (prev?.id === id ? null : prev))
    toast.success('Chat log deleted.')
  }, [])

  // ─── Analytics Memos ────────────────────────────────────────────────────────
  // FIX: All derived values that depend on state are inside useMemo to avoid
  // recomputation on every render.
  const {
    sessions,
    totalViews,
    avgPages,
    chartData,
    intelligence,
  } = useMemo(() => {
    const map = new Map<string, AnalyticsEvent[]>()
    const dailyMap = new Map<string, { views: number; visitors: Set<string> }>()
    const filtered: AnalyticsEvent[] = []
    let validEvents = 0

    events.forEach(ev => {
      // Localhost filter
      if (!showLocal && (ev.ip_address === '::1' || ev.ip_address === '127.0.0.1')) return

      const vId = (ev.metadata as any)?.visitorId || 'unknown'
      const meta: any = ev.metadata || {}
      const deviceType = meta.browserIntelligence?.deviceType || (ev.user_agent?.toLowerCase().includes('mobi') ? 'Mobile' : 'Desktop')

      // Device filter
      if (visitorDeviceFilter === 'desktop' && deviceType === 'Mobile') return
      if (visitorDeviceFilter === 'mobile' && deviceType !== 'Mobile') return

      // Visitor search filter
      if (visitorSearch) {
        const query = visitorSearch.toLowerCase()
        const matchId = vId.toLowerCase().includes(query)
        const matchIp = ev.ip_address?.toLowerCase().includes(query)
        const matchOrg = (meta.org || meta.isp || '').toLowerCase().includes(query)
        const matchLoc = `${meta.city || ''} ${meta.country || ''}`.toLowerCase().includes(query)
        const matchPage = ev.page?.toLowerCase().includes(query)

        if (!matchId && !matchIp && !matchOrg && !matchLoc && !matchPage) return
      }

      validEvents++
      filtered.push(ev)

      if (!map.has(vId)) map.set(vId, [])
      map.get(vId)!.push(ev)

      const dateKey = new Date(ev.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
      if (!dailyMap.has(dateKey)) dailyMap.set(dateKey, { views: 0, visitors: new Set() })
      const dayData = dailyMap.get(dateKey)!
      dayData.views += 1
      dayData.visitors.add(vId)
    })

    const sortedSessions = Array.from(map.entries()).sort((a, b) => {
      const aTime = new Date(a[1][0].created_at).getTime()
      const bTime = new Date(b[1][0].created_at).getTime()
      return bTime - aTime
    })
    const now = Date.now()
    const dayAgo = now - 24 * 60 * 60 * 1000
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000
    const monthAgo = now - 30 * 24 * 60 * 60 * 1000
    const onlineCutoff = now - 5 * 60 * 1000
    const pageViews = filtered.filter(ev => ev.event_type === 'page_view')
    const visitorsToday = new Set(filtered.filter(ev => new Date(ev.created_at).getTime() >= dayAgo).map(ev => getMeta(ev).visitorId || 'unknown')).size
    const visitorsWeek = new Set(filtered.filter(ev => new Date(ev.created_at).getTime() >= weekAgo).map(ev => getMeta(ev).visitorId || 'unknown')).size
    const visitorsMonth = new Set(filtered.filter(ev => new Date(ev.created_at).getTime() >= monthAgo).map(ev => getMeta(ev).visitorId || 'unknown')).size
    const visitorsOnline = new Set(filtered.filter(ev => new Date(ev.created_at).getTime() >= onlineCutoff).map(ev => getMeta(ev).visitorId || 'unknown')).size
    const returningVisitors = sortedSessions.filter(([, evs]) => evs.some(ev => getMeta(ev).sessionAnalytics?.returningVisitor)).length
    const sessionDurations = sortedSessions.map(([, evs]) => {
      const times = evs.map(ev => new Date(ev.created_at).getTime()).sort((a, b) => a - b)
      return times[times.length - 1] - times[0]
    })
    const averageSessionMs = sessionDurations.length ? sessionDurations.reduce((sum, value) => sum + value, 0) / sessionDurations.length : 0
    const bounces = sortedSessions.filter(([, evs]) => new Set(evs.map(ev => ev.page)).size <= 1).length
    const downloads = filtered.filter(ev => /download/i.test(ev.event_type) || /resume|portfolio pdf/i.test(String(getMeta(ev).engagementAnalytics?.clickCategory || getMeta(ev).engagementAnalytics?.clickText || ''))).length
    const clicksByText = (needle: string) => filtered.filter(ev => {
      const engagement = getMeta(ev).engagementAnalytics || {}
      return ev.event_type === 'click' && `${engagement.clickCategory || ''} ${engagement.clickText || ''}`.toLowerCase().includes(needle)
    }).length

    // Reverse so dates go left-to-right on the chart
    const formattedChartData = Array.from(dailyMap.entries())
      .map(([date, data]) => ({
        date,
        views: data.views,
        visitors: data.visitors.size,
      }))
      .reverse()

    return {
      sessions: sortedSessions,
      totalViews: validEvents,
      avgPages:
        sortedSessions.length > 0 ? (validEvents / sortedSessions.length).toFixed(1) : '0',
      chartData: formattedChartData,
      intelligence: {
        visitorsOnline,
        visitorsToday,
        visitorsWeek,
        visitorsMonth,
        returningVisitors,
        averageSession: formatDuration(averageSessionMs),
        bounceRate: sortedSessions.length ? `${Math.round((bounces / sortedSessions.length) * 100)}%` : '0%',
        downloads,
        contactRequests: filtered.filter(ev => ev.event_type === 'contact_submit').length,
        githubClicks: clicksByText('github'),
        linkedInClicks: clicksByText('linkedin'),
        projectsViewed: filtered.filter(ev => /project/i.test(ev.page || '') || /project/i.test(ev.event_type)).length,
        blogsViewed: filtered.filter(ev => /blog/i.test(ev.page || '') || /blog/i.test(ev.event_type)).length,
        topCountries: countBy(pageViews, ev => getMeta(ev).country),
        topCities: countBy(pageViews, ev => getMeta(ev).city),
        topBrowsers: countBy(pageViews, ev => getMeta(ev).browserIntelligence?.browserName),
        topOperatingSystems: countBy(pageViews, ev => getMeta(ev).browserIntelligence?.operatingSystem),
        topDevices: countBy(pageViews, ev => getMeta(ev).browserIntelligence?.deviceType),
        topReferrers: countBy(pageViews, ev => getMeta(ev).navigationAnalytics?.referrer?.source || getMeta(ev).referrer),
        popularPages: countBy(pageViews, ev => ev.page || '/'),
        popularProjects: countBy(filtered.filter(ev => /project/i.test(ev.page || '')), ev => ev.page || 'Project'),
        popularBlogs: countBy(filtered.filter(ev => /blog/i.test(ev.page || '')), ev => ev.page || 'Blog'),
      },
    }
  }, [events, showLocal, visitorSearch, visitorDeviceFilter])

  const paginatedSessions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sessions.slice(startIndex, startIndex + itemsPerPage)
  }, [sessions, currentPage, itemsPerPage])

  const totalPages = Math.max(1, Math.ceil(sessions.length / itemsPerPage))

  // Safeguard: Adjust current page if it is out of range
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  // FIX: AI-derived values moved into useMemo — depend on aiLogs / search / type.
  const { recruiterChats, technicalChats, filteredLogs } = useMemo(() => {
    const recruiterChats = aiLogs.filter(l => l.is_recruiter).length
    const technicalChats = aiLogs.filter(l => l.is_technical).length
    const query = search.toLowerCase()
    
    const filtered = aiLogs.filter(log => {
      const matchesSearch =
        log.user_message?.toLowerCase().includes(query) ||
        log.ai_response?.toLowerCase().includes(query)

      if (!matchesSearch) return false

      if (aiTypeFilter === 'recruiter') return log.is_recruiter
      if (aiTypeFilter === 'technical') return log.is_technical
      if (aiTypeFilter === 'general') return !log.is_recruiter && !log.is_technical

      return true
    })

    return { recruiterChats, technicalChats, filteredLogs: filtered }
  }, [aiLogs, search, aiTypeFilter])

  const paginatedAiLogs = useMemo(() => {
    const startIndex = (currentAiPage - 1) * aiItemsPerPage
    return filteredLogs.slice(startIndex, startIndex + aiItemsPerPage)
  }, [filteredLogs, currentAiPage, aiItemsPerPage])

  const totalAiPages = Math.max(1, Math.ceil(filteredLogs.length / aiItemsPerPage))

  // Safeguard: Adjust current page if it is out of range
  useEffect(() => {
    if (currentAiPage > totalAiPages) {
      setCurrentAiPage(totalAiPages)
    }
  }, [totalAiPages, currentAiPage])

  const deleteVisibleChatLogs = useCallback(async () => {
    if (filteredLogs.length === 0) return
    const label = search
      ? `${filteredLogs.length} matching chat log${filteredLogs.length === 1 ? '' : 's'}`
      : `all ${filteredLogs.length} chat log${filteredLogs.length === 1 ? '' : 's'}`
    if (!confirm(`Delete ${label}? This cannot be undone.`)) return

    const ids = new Set(filteredLogs.map(log => log.id))
    const results = await Promise.all(filteredLogs.map(log => adminDb.from('ai_chat_logs').delete(log.id)))
    const failed = results.filter(res => res.error)

    if (failed.length) {
      toast.error(`Failed to delete ${failed.length} chat log${failed.length === 1 ? '' : 's'}.`)
      return
    }

    setAiLogs(prev => prev.filter(log => !ids.has(log.id)))
    setSelectedChat(prev => (prev && ids.has(prev.id) ? null : prev))
    toast.success(search ? 'Matching chat logs deleted.' : 'Chat logs cleared.')
  }, [filteredLogs, search])

  // ─── Close modal on Escape ──────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedChat(null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <AdminTopBar title="Analytics & Visitors" subtitle="Deep dive into your portfolio traffic" />

      <div className="admin-page-content pb-5">

        {/* ── Header Controls ─────────────────────────────────────────────── */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--admin-text)' }}>
            Traffic Overview
          </h2>
          <div className="d-flex flex-wrap align-items-center gap-2">
            <a
              href="#ai-conversations"
              className="btn btn-sm d-inline-flex align-items-center justify-content-center"
              style={{
                border: '1px solid var(--admin-border)',
                background: 'var(--admin-surface)',
                color: 'var(--admin-text)',
                borderRadius: 10,
                fontWeight: 700,
              }}
            >
              AI Chats
            </a>
            <a
              href="#visitor-sessions"
              className="btn btn-sm d-inline-flex align-items-center justify-content-center"
              style={{
                border: '1px solid var(--admin-border)',
                background: 'var(--admin-surface)',
                color: 'var(--admin-text)',
                borderRadius: 10,
                fontWeight: 700,
              }}
            >
              Visitors
            </a>
            <span
              className="d-inline-flex align-items-center justify-content-center"
              style={{
                minWidth: 30,
                height: 30,
                padding: '0 10px',
                borderRadius: 999,
                background: liveVisitorCount > 0 ? 'rgba(16,185,129,0.16)' : 'var(--admin-surface)',
                border: '1px solid var(--admin-border)',
                color: liveVisitorCount > 0 ? '#10b981' : 'var(--admin-text-sub)',
                fontSize: '0.78rem',
                fontWeight: 800,
              }}
              title="Live visitor notifications"
            >
              Live {liveVisitorCount}
            </span>
            <label
              className="d-flex align-items-center gap-2 cursor-pointer"
              style={{ fontSize: '0.85rem', color: 'var(--admin-text-sub)' }}
            >
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={e => setSoundEnabled(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              Sound
            </label>
            <label
              className="d-flex align-items-center gap-2 cursor-pointer"
              style={{ fontSize: '0.85rem', color: 'var(--admin-text-sub)' }}
            >
              <input
                type="checkbox"
                checked={showLocal}
                onChange={e => setShowLocal(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              Show Localhost (Testing)
            </label>
          </div>
        </div>

        {/* ── Traffic Stats Row ────────────────────────────────────────────── */}
        <div className="row g-3 mb-4">
          <StatCard
            icon={<Users size={18} />}
            label="Total Visitors"
            value={sessions.length}
            iconBg="rgba(16,185,129,0.1)"
            iconColor="#10b981"
            loading={loading}
          />
          <StatCard
            icon={<MousePointerClick size={18} />}
            label="Total Page Views"
            value={totalViews}
            iconBg="rgba(34,211,238,0.12)"
            iconColor="#67e8f9"
            loading={loading}
          />
          <StatCard
            icon={<TrendingUp size={18} />}
            label="Pages / Session"
            value={avgPages}
            iconBg="rgba(139,92,246,0.14)"
            iconColor="#c4b5fd"
            loading={loading}
          />
        </div>

        {/* ── Chart ───────────────────────────────────────────────────────── */}
        <div className="row g-3 mb-4">
          {[
            ['Visitors Online', intelligence.visitorsOnline],
            ['Visitors Today', intelligence.visitorsToday],
            ['This Week', intelligence.visitorsWeek],
            ['This Month', intelligence.visitorsMonth],
            ['Returning Visitors', intelligence.returningVisitors],
            ['Average Session', intelligence.averageSession],
            ['Bounce Rate', intelligence.bounceRate],
            ['Downloads', intelligence.downloads],
            ['Contact Requests', intelligence.contactRequests],
            ['GitHub Clicks', intelligence.githubClicks],
            ['LinkedIn Clicks', intelligence.linkedInClicks],
            ['Projects Viewed', intelligence.projectsViewed],
            ['Blogs Viewed', intelligence.blogsViewed],
          ].map(([label, value]) => (
            <div key={String(label)} className="col-6 col-lg-3">
              <div
                className="h-100"
                style={{
                  border: '1px solid var(--admin-border)',
                  borderRadius: 12,
                  background: 'var(--admin-surface)',
                  padding: '14px 16px',
                }}
              >
                <div style={{ color: 'var(--admin-text-sub)', fontSize: '0.74rem', fontWeight: 700 }}>
                  {label}
                </div>
                <div style={{ color: 'var(--admin-text)', fontSize: '1.25rem', fontWeight: 850, marginTop: 4 }}>
                  {loading ? '...' : value}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="card shadow-sm mb-4"
          style={{ borderRadius: 14, border: '1px solid var(--admin-border)', overflow: 'hidden' }}
        >
          <div
            className="card-header bg-transparent p-4"
            style={{ borderBottom: '1px solid var(--admin-border)' }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--admin-text)' }}>
              Traffic Trends
            </h3>
          </div>
          <div className="card-body p-0 pt-4" style={{ height: 320 }}>
            {loading ? (
              <div
                className="h-100 d-flex align-items-center justify-content-center"
                style={{ color: 'var(--admin-text-sub)' }}
              >
                Loading chart data...
              </div>
            ) : chartData.length === 0 ? (
              <div
                className="h-100 d-flex align-items-center justify-content-center"
                style={{ color: 'var(--admin-text-sub)' }}
              >
                Not enough data for chart
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.32} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--admin-text-sub)' }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--admin-text-sub)' }}
                    allowDecimals={false}
                  />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--admin-border-soft)"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#22d3ee"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorViews)"
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorVisitors)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ── Visitor Sessions Table ───────────────────────────────────────── */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-lg-3"><TopList title="Top Countries" rows={intelligence.topCountries} /></div>
          <div className="col-12 col-lg-3"><TopList title="Top Cities" rows={intelligence.topCities} /></div>
          <div className="col-12 col-lg-3"><TopList title="Top Browsers" rows={intelligence.topBrowsers} /></div>
          <div className="col-12 col-lg-3"><TopList title="Top Devices" rows={intelligence.topDevices} /></div>
          <div className="col-12 col-lg-3"><TopList title="Operating Systems" rows={intelligence.topOperatingSystems} /></div>
          <div className="col-12 col-lg-3"><TopList title="Top Referrers" rows={intelligence.topReferrers} /></div>
          <div className="col-12 col-lg-3"><TopList title="Popular Pages" rows={intelligence.popularPages} /></div>
          <div className="col-12 col-lg-3"><TopList title="Popular Projects" rows={intelligence.popularProjects} /></div>
          <div className="col-12 col-lg-3"><TopList title="Popular Blogs" rows={intelligence.popularBlogs} /></div>
        </div>

        <h3 id="visitor-sessions" className="mb-3 mt-5" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--admin-text)', scrollMarginTop: 90 }}>
          Visitor Sessions ({sessions.length})
        </h3>

        {/* Visitor Filter Bar */}
        <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center mb-3">
          <div className="search-field flex-grow-1">
            <Search size={16} className="search-field-icon" />
            <input
              value={visitorSearch}
              onChange={e => setVisitorSearch(e.target.value)}
              placeholder="Search by ID, IP, location, network/ISP, or page..."
              className="form-control search-field-input"
              style={{
                height: 44,
                borderRadius: 12,
                background: 'var(--admin-surface)',
                border: '1px solid var(--admin-border)',
                color: 'var(--admin-text)',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <select
              value={visitorDeviceFilter}
              onChange={e => setVisitorDeviceFilter(e.target.value as any)}
              className="form-select"
              style={{
                height: 44,
                borderRadius: 12,
                background: 'var(--admin-surface)',
                border: '1px solid var(--admin-border)',
                color: 'var(--admin-text)',
                fontSize: '0.85rem',
                minWidth: 150,
                cursor: 'pointer',
              }}
            >
              <option value="all">All Devices</option>
              <option value="desktop">Desktop Only</option>
              <option value="mobile">Mobile Only</option>
            </select>
          </div>
        </div>

        <div
          className="card shadow-sm"
          style={{
            borderRadius: 14,
            border: '1px solid var(--admin-border)',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <div className="p-5 text-center" style={{ color: 'var(--admin-text-sub)' }}>
              Loading sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-5 text-center" style={{ color: 'var(--admin-text-sub)' }}>
              No visitors found.
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div
                className="table-responsive analytics-scroll-pane analytics-scroll-pane-visitors d-none d-md-block"
                data-lenis-prevent
              >
                <table
                  className="table table-borderless mb-0 w-100"
                  style={{ fontSize: '0.85rem', minWidth: 960 }}
                >
                  <thead
                    style={{
                      background: 'var(--admin-main-bg)',
                      borderBottom: '1px solid var(--admin-border)',
                      position: 'sticky',
                      top: 0,
                      zIndex: 2,
                    }}
                  >
                    <tr>
                      <th className="px-4 py-3" style={{ width: 40 }} />
                      <th className="px-4 py-3" style={{ color: 'var(--admin-text-sub)', fontWeight: 600 }}>
                        Visitor ID
                      </th>
                      <th className="px-4 py-3" style={{ color: 'var(--admin-text-sub)', fontWeight: 600 }}>
                        Network / Location
                      </th>
                      <th className="px-4 py-3" style={{ color: 'var(--admin-text-sub)', fontWeight: 600 }}>
                        System
                      </th>
                      <th className="px-4 py-3 text-center" style={{ color: 'var(--admin-text-sub)', fontWeight: 600 }}>
                        Pages Hit
                      </th>
                      <th className="px-4 py-3" style={{ color: 'var(--admin-text-sub)', fontWeight: 600 }}>
                        First Visit
                      </th>
                      <th className="px-4 py-3 text-end" style={{ color: 'var(--admin-text-sub)', fontWeight: 600 }}>
                        Logs
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSessions.map(([vId, userEvents]) => {
                      const firstEvent = userEvents[userEvents.length - 1] // oldest
                      const lastEvent = userEvents[0] // newest
                      const meta: any = lastEvent.metadata || {}
                      const isExpanded = expandedVisitorId === vId
                      const isMobile = lastEvent.user_agent?.toLowerCase().includes('mobi')
                      const isLocal =
                        lastEvent.ip_address === '::1' || lastEvent.ip_address === '127.0.0.1'
                      const ipIntel = meta.ipIntelligence || {}
                      const browserIntel = meta.browserIntelligence || {}
                      const deviceIntel = meta.deviceIntelligence || {}
                      const hardwareIntel = meta.hardwareIntelligence || {}
                      const networkIntel = meta.networkQuality || {}
                      const preferences = meta.userPreferences || {}
                      const sessionIntel = meta.sessionAnalytics || {}
                      const navIntel = meta.navigationAnalytics || {}
                      const eventTimes = userEvents.map(ev => new Date(ev.created_at).getTime()).sort((a, b) => a - b)
                      const sessionDuration = eventTimes.length > 1 ? eventTimes[eventTimes.length - 1] - eventTimes[0] : 0
                      const avgScroll = Math.round(
                        userEvents.reduce((sum, ev) => sum + Number(getMeta(ev).engagementAnalytics?.maximumScroll || 0), 0) / Math.max(userEvents.length, 1)
                      )
                      const uniquePages = Array.from(new Set(userEvents.map(ev => ev.page || '/')))

                      return (
                        <React.Fragment key={vId}>
                          <tr
                            onClick={() => toggleExpand(vId)}
                            style={{
                              borderBottom: '1px solid var(--admin-border-soft)',
                              background: isExpanded ? 'rgba(34,211,238,0.06)' : 'transparent',
                              cursor: 'pointer',
                              transition: 'background 0.2s ease',
                            }}
                          >
                            <td
                              className="px-4 py-3 text-center align-middle"
                              style={{ color: 'var(--admin-text-sub)' }}
                            >
                              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </td>
                            <td className="px-4 py-3 align-middle">
                              <div className="d-flex flex-column">
                                <span
                                  style={{
                                    fontFamily: 'var(--font-mono)',
                                    background: 'var(--admin-main-bg)',
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    color: 'var(--admin-text)',
                                    width: 'fit-content',
                                  }}
                                >
                                  {vId.substring(0, 8)}
                                </span>
                                {isLocal && (
                                  <span
                                    style={{
                                      fontSize: '0.65rem',
                                      color: '#c4b5fd',
                                      marginTop: 4,
                                      fontWeight: 600,
                                    }}
                                  >
                                    LOCAL DEV
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 align-middle">
                              <div className="d-flex flex-column gap-1">
                                <span style={{ color: 'var(--admin-text)', fontWeight: 500 }}>
                                  {meta.org || meta.isp || 'Unknown Network'}
                                </span>
                                <span style={{ color: 'var(--admin-text-sub)', fontSize: '0.75rem' }}>
                                  {meta.city && meta.city !== 'Unknown City'
                                    ? `${meta.city}, ${meta.country}`
                                    : meta.country || 'Unknown Location'}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 align-middle">
                              <div className="d-flex flex-column gap-1">
                                <div className="d-flex align-items-center gap-2" style={{ color: 'var(--admin-text-sub)' }}>
                                  {isMobile ? <Smartphone size={14} /> : <Monitor size={14} />}
                                  <span>{isMobile ? 'Mobile' : 'Desktop'}</span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-sub)' }}>
                                  {meta.screen || '?'} • {meta.language || '?'}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 align-middle text-center">
                              <span
                                style={{
                                  background: 'var(--admin-surface)',
                                  border: '1px solid var(--admin-border)',
                                  padding: '2px 8px',
                                  borderRadius: 12,
                                  fontWeight: 600,
                                  color: 'var(--color-accent)',
                                }}
                              >
                                {userEvents.length}
                              </span>
                            </td>
                            <td
                              className="px-4 py-3 align-middle"
                              style={{ color: 'var(--admin-text-sub)', fontSize: '0.8rem' }}
                            >
                              {new Date(firstEvent.created_at).toLocaleDateString()}{' '}
                              {new Date(firstEvent.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                            <td className="px-4 py-3 align-middle text-end">
                              <button
                                type="button"
                                className="btn btn-sm admin-icon-action d-inline-flex align-items-center justify-content-center"
                                aria-label={`Delete visitor logs for ${vId}`}
                                onClick={e => {
                                  e.stopPropagation()
                                  deleteVisitorSession(vId, userEvents)
                                }}
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 8,
                                  background: 'rgba(248,113,113,0.1)',
                                  border: '1px solid rgba(248,113,113,0.22)',
                                  color: '#fca5a5',
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>

                          {/* Expanded Timeline */}
                          <AnimatePresence>
                            {isExpanded && (
                              <tr>
                                <td colSpan={7} className="p-0 border-0">
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    style={{
                                      overflow: 'hidden',
                                      background: 'var(--admin-main-bg)',
                                    }}
                                  >
                                    <div className="analytics-timeline p-4 px-5" data-lenis-prevent>
                                      <div className="row g-3 mb-4">
                                        <div className="col-12 col-xl-4">
                                          <DetailGrid
                                            title="Visitor Summary"
                                            rows={[
                                              ['Visitor ID', vId],
                                              ['First Visit', new Date(firstEvent.created_at).toLocaleString()],
                                              ['Last Visit', new Date(lastEvent.created_at).toLocaleString()],
                                              ['Visit Count', sessionIntel.totalVisits],
                                              ['Average Session', formatDuration(sessionDuration)],
                                              ['Average Scroll', `${avgScroll}%`],
                                              ['Latest Activity', new Date(lastEvent.created_at).toLocaleString()],
                                            ]}
                                          />
                                        </div>
                                        <div className="col-12 col-xl-4">
                                          <DetailGrid
                                            title="Location & Network"
                                            rows={[
                                              ['IP', lastEvent.ip_address],
                                              ['Country', ipIntel.country || meta.country],
                                              ['State', ipIntel.state],
                                              ['City', ipIntel.city || meta.city],
                                              ['Postal Code', ipIntel.postalCode],
                                              ['Timezone', ipIntel.timezone || meta.timezone],
                                              ['Coordinates', ipIntel.latitude && ipIntel.longitude ? `${ipIntel.latitude}, ${ipIntel.longitude}` : 'Unknown'],
                                              ['ISP', ipIntel.isp || meta.isp],
                                              ['Organization', ipIntel.organization || meta.org],
                                              ['VPN / Proxy / Tor', `${valueOrUnknown(ipIntel.vpn)} / ${valueOrUnknown(ipIntel.proxy)} / ${valueOrUnknown(ipIntel.tor)}`],
                                            ]}
                                          />
                                        </div>
                                        <div className="col-12 col-xl-4">
                                          <DetailGrid
                                            title="Device & Browser"
                                            rows={[
                                              ['Device Type', browserIntel.deviceType || (isMobile ? 'Mobile' : 'Desktop')],
                                              ['OS', browserIntel.operatingSystem],
                                              ['OS Version', browserIntel.osVersion],
                                              ['Browser', browserIntel.browserName],
                                              ['Browser Version', browserIntel.browserVersion],
                                              ['Engine', browserIntel.browserEngine],
                                              ['Platform', browserIntel.platform],
                                              ['Touch', browserIntel.touchSupport],
                                              ['Screen', meta.screen],
                                              ['Viewport', deviceIntel.viewportWidth ? `${deviceIntel.viewportWidth}x${deviceIntel.viewportHeight}` : 'Unknown'],
                                            ]}
                                          />
                                        </div>
                                        <div className="col-12 col-xl-4">
                                          <DetailGrid
                                            title="Hardware & Network Quality"
                                            rows={[
                                              ['CPU Cores', hardwareIntel.cpuCores],
                                              ['RAM', hardwareIntel.deviceMemory ? `${hardwareIntel.deviceMemory} GB` : 'Unknown'],
                                              ['GPU Vendor', hardwareIntel.gpuVendor],
                                              ['GPU Renderer', hardwareIntel.gpuRenderer],
                                              ['WebGL', hardwareIntel.webglVersion],
                                              ['Max Texture', hardwareIntel.maximumTextureSize],
                                              ['Connection', networkIntel.effectiveConnectionType],
                                              ['RTT', networkIntel.rtt ? `${networkIntel.rtt} ms` : 'Unknown'],
                                              ['Downlink', networkIntel.downlinkSpeed ? `${networkIntel.downlinkSpeed} Mbps` : 'Unknown'],
                                              ['Save Data', networkIntel.saveDataPreference],
                                            ]}
                                          />
                                        </div>
                                        <div className="col-12 col-xl-4">
                                          <DetailGrid
                                            title="Referrer & Preferences"
                                            rows={[
                                              ['Source', navIntel.referrer?.source],
                                              ['Domain', navIntel.referrer?.referrerDomain],
                                              ['Full Referrer', navIntel.referrer?.fullReferrer || meta.referrer],
                                              ['UTM Source', navIntel.referrer?.utm?.source],
                                              ['UTM Campaign', navIntel.referrer?.utm?.campaign],
                                              ['Dark Mode', preferences.darkMode],
                                              ['Reduced Motion', preferences.reducedMotion],
                                              ['Reduced Data', preferences.reducedData],
                                              ['Languages', browserIntel.preferredLanguages || meta.language],
                                            ]}
                                          />
                                        </div>
                                        <div className="col-12 col-xl-4">
                                          <DetailGrid
                                            title="Pages & Interactions"
                                            rows={[
                                              ['Landing Page', navIntel.landingPage || firstEvent.page],
                                              ['Latest Page', lastEvent.page],
                                              ['Exit Page', navIntel.exitPage],
                                              ['Pages', uniquePages.join(' -> ')],
                                              ['Number of Pages', uniquePages.length],
                                              ['Session Duration', formatDuration(sessionDuration)],
                                              ['Downloads', userEvents.filter(ev => /download/i.test(ev.event_type)).length],
                                              ['Clicks', userEvents.filter(ev => ev.event_type === 'click').length],
                                              ['Contact Forms', userEvents.filter(ev => ev.event_type === 'contact_submit').length],
                                            ]}
                                          />
                                        </div>
                                      </div>

                                      {ipIntel.latitude && ipIntel.longitude && (
                                        <div
                                          className="mb-4"
                                          style={{
                                            border: '1px solid var(--admin-border)',
                                            borderRadius: 12,
                                            overflow: 'hidden',
                                            background: 'var(--admin-surface)',
                                          }}
                                        >
                                          <iframe
                                            title={`Approximate map for ${vId}`}
                                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(ipIntel.longitude) - 0.08}%2C${Number(ipIntel.latitude) - 0.08}%2C${Number(ipIntel.longitude) + 0.08}%2C${Number(ipIntel.latitude) + 0.08}&layer=mapnik&marker=${ipIntel.latitude}%2C${ipIntel.longitude}`}
                                            style={{ width: '100%', height: 220, border: 0 }}
                                            loading="lazy"
                                          />
                                        </div>
                                      )}

                                      <h4
                                        style={{
                                          fontSize: '0.8rem',
                                          fontWeight: 700,
                                          color: 'var(--admin-text)',
                                          textTransform: 'uppercase',
                                          letterSpacing: '0.05em',
                                          marginBottom: '1rem',
                                        }}
                                      >
                                        Activity Timeline
                                      </h4>
                                      <div
                                        className="d-flex flex-column gap-2 position-relative"
                                        style={{
                                          borderLeft: '2px solid var(--admin-border)',
                                          paddingLeft: '1rem',
                                          marginLeft: '0.5rem',
                                        }}
                                      >
                                        {/* Reversed = oldest first (chronological top→bottom) */}
                                        {[...userEvents].reverse().map(ev => {
                                          const evMeta: any = ev.metadata || {}
                                          return (
                                            <div
                                              key={ev.id}
                                              className="d-flex align-items-center gap-3 position-relative"
                                            >
                                              <div
                                                style={{
                                                  position: 'absolute',
                                                  left: '-1.37rem',
                                                  width: 10,
                                                  height: 10,
                                                  borderRadius: '50%',
                                                  background: 'var(--color-accent)',
                                                  border: '2px solid var(--admin-main-bg)',
                                                }}
                                              />
                                              <div
                                                style={{
                                                  fontFamily: 'var(--font-mono)',
                                                  fontSize: '0.75rem',
                                                  color: 'var(--admin-text-sub)',
                                                  minWidth: 65,
                                                }}
                                              >
                                                {new Date(ev.created_at).toLocaleTimeString([], {
                                                  hour: '2-digit',
                                                  minute: '2-digit',
                                                })}
                                              </div>
                                              <div
                                                style={{
                                                  background: 'var(--admin-surface)',
                                                  padding: '6px 12px',
                                                  borderRadius: 8,
                                                  fontSize: '0.8rem',
                                                  color: 'var(--admin-text)',
                                                  border: '1px solid var(--admin-border)',
                                                  flexGrow: 1,
                                                }}
                                              >
                                                {eventLabel(ev)}{' '}
                                                <strong style={{ color: 'var(--color-accent)' }}>
                                                  {ev.page}
                                                </strong>
                                                {evMeta.referrer && (
                                                  <span
                                                    style={{
                                                      color: 'var(--admin-text-sub)',
                                                      fontSize: '0.7rem',
                                                      marginLeft: 8,
                                                    }}
                                                  >
                                                    (via {evMeta.referrer})
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  </motion.div>
                                </td>
                              </tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="d-block d-md-none" style={{ background: 'var(--admin-main-bg)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.75rem' }}>
                  {paginatedSessions.map(([vId, userEvents]) => {
                    const firstEvent = userEvents[userEvents.length - 1]
                    const lastEvent = userEvents[0]
                    const meta: any = lastEvent.metadata || {}
                    const isExpanded = expandedVisitorId === vId
                    const isMobile = lastEvent.user_agent?.toLowerCase().includes('mobi')
                    const isLocal =
                      lastEvent.ip_address === '::1' || lastEvent.ip_address === '127.0.0.1'

                    return (
                      <div
                        key={vId}
                        style={{
                          borderRadius: 12,
                          border: '1px solid var(--admin-border)',
                          background: 'var(--admin-surface)',
                          padding: '1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 12,
                        }}
                      >
                        {/* Header: ID, Labels, Trash */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span
                              style={{
                                fontFamily: 'var(--font-mono)',
                                background: 'var(--admin-main-bg)',
                                padding: '2px 6px',
                                borderRadius: 4,
                                color: 'var(--admin-text)',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                              }}
                            >
                              {vId.substring(0, 8)}
                            </span>
                            {isLocal && (
                              <span style={{ fontSize: '0.62rem', color: '#c4b5fd', fontWeight: 600 }}>
                                DEV
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              type="button"
                              onClick={() => toggleExpand(vId)}
                              style={{
                                padding: '4px 10px',
                                borderRadius: 6,
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                background: isExpanded ? 'rgba(34, 211, 238, 0.18)' : 'rgba(34, 211, 238, 0.08)',
                                border: '1px solid rgba(34, 211, 238, 0.2)',
                                color: '#67e8f9',
                                cursor: 'pointer',
                              }}
                            >
                              {isExpanded ? 'Hide Timeline' : 'Show Timeline'}
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteVisitorSession(vId, userEvents)}
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 6,
                                background: 'rgba(248,113,113,0.1)',
                                border: '1px solid rgba(248,113,113,0.22)',
                                color: '#fca5a5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Location / ISP */}
                        <div style={{ fontSize: '0.82rem' }}>
                          <div style={{ fontWeight: 600, color: 'var(--admin-text)' }}>
                            {meta.org || meta.isp || 'Unknown Network'}
                          </div>
                          <div style={{ color: 'var(--admin-text-sub)', fontSize: '0.75rem', marginTop: 2 }}>
                            {meta.city && meta.city !== 'Unknown City'
                              ? `${meta.city}, ${meta.country}`
                              : meta.country || 'Unknown Location'}
                          </div>
                        </div>

                        {/* Specs row */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: 8,
                            borderTop: '1px solid var(--admin-border-soft)',
                            fontSize: '0.75rem',
                            color: 'var(--admin-text-sub)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {isMobile ? <Smartphone size={13} /> : <Monitor size={13} />}
                            <span>
                              {isMobile ? 'Mobile' : 'Desktop'} · {meta.screen || '?'}
                            </span>
                          </div>
                          <div>
                            Hits:{' '}
                            <span
                              style={{
                                background: 'var(--admin-main-bg)',
                                border: '1px solid var(--admin-border)',
                                padding: '2px 8px',
                                borderRadius: 8,
                                fontWeight: 700,
                                color: '#22d3ee',
                              }}
                            >
                              {userEvents.length}
                            </span>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-sub)', opacity: 0.8 }}>
                          First Visit: {new Date(firstEvent.created_at).toLocaleDateString()} {new Date(firstEvent.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>

                        {/* Collapsible Mobile Timeline */}
                        {isExpanded && (
                          <div
                            style={{
                              marginTop: 8,
                              paddingTop: 12,
                              borderTop: '1px solid var(--admin-border-soft)',
                            }}
                          >
                            <div
                              className="d-flex flex-column gap-2"
                              style={{
                                borderLeft: '2px solid var(--admin-border)',
                                paddingLeft: '0.85rem',
                                marginLeft: '0.25rem',
                              }}
                            >
                              {[...userEvents].reverse().map(ev => {
                                const evMeta: any = ev.metadata || {}
                                return (
                                  <div key={ev.id} style={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'relative', paddingBottom: 6 }}>
                                    <div
                                      style={{
                                        position: 'absolute',
                                        left: '-1.12rem',
                                        top: 5,
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        background: '#22d3ee',
                                        border: '2px solid var(--admin-surface)',
                                      }}
                                    />
                                    <span style={{ fontSize: '0.68rem', color: 'var(--admin-text-sub)', fontFamily: 'var(--font-mono)' }}>
                                      {new Date(ev.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--admin-text)' }}>
                                      Viewed <strong style={{ color: '#67e8f9' }}>{ev.page}</strong>
                                      {evMeta.referrer && (
                                        <span style={{ color: 'var(--admin-text-sub)', fontSize: '0.68rem', marginLeft: 4 }}>
                                          (via {evMeta.referrer})
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Pagination Controls */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '1rem 1.5rem',
                  borderTop: '1px solid var(--admin-border-soft)',
                  background: 'rgba(15, 23, 42, 0.2)',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-sub)' }}>
                  Showing <strong style={{ color: 'var(--admin-text)' }}>{Math.min(sessions.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(sessions.length, currentPage * itemsPerPage)}</strong> of <strong style={{ color: 'var(--admin-text)' }}>{sessions.length}</strong> sessions
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-sub)' }}>Show</span>
                    <select
                      value={itemsPerPage}
                      onChange={e => {
                        setItemsPerPage(Number(e.target.value))
                        setCurrentPage(1)
                        setExpandedVisitorId(null)
                      }}
                      style={{
                        background: 'var(--admin-surface)',
                        border: '1px solid var(--admin-border)',
                        color: 'var(--admin-text)',
                        fontSize: '0.78rem',
                        padding: '4px 8px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-sub)' }}>per page</span>
                  </div>

                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => {
                        setCurrentPage(p => Math.max(1, p - 1))
                        setExpandedVisitorId(null)
                      }}
                      className="btn btn-sm"
                      style={{
                        padding: '4px 12px',
                        borderRadius: 8,
                        background: currentPage === 1 ? 'transparent' : 'var(--admin-surface)',
                        border: '1px solid var(--admin-border)',
                        color: currentPage === 1 ? 'var(--admin-text-soft)' : 'var(--admin-text)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Previous
                    </button>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--admin-text-sub)',
                        padding: '4px 8px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => {
                        setCurrentPage(p => Math.min(totalPages, p + 1))
                        setExpandedVisitorId(null)
                      }}
                      className="btn btn-sm"
                      style={{
                        padding: '4px 12px',
                        borderRadius: 8,
                        background: currentPage === totalPages ? 'transparent' : 'var(--admin-surface)',
                        border: '1px solid var(--admin-border)',
                        color: currentPage === totalPages ? 'var(--admin-text-soft)' : 'var(--admin-text)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── AI Analytics ─────────────────────────────────────────────────── */}
        <div className="d-flex align-items-center gap-2 mt-5 mb-4" id="ai-conversations" style={{ scrollMarginTop: 90 }}>
          <Bot size={20} style={{ color: 'var(--color-accent)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--admin-text)' }}>
            AI Analytics
          </h2>
        </div>

        <div className="row g-3 mb-4">
          <StatCard
            icon={<BarChart3 size={18} />}
            label="AI Conversations"
            value={aiLogs.length}
            iconBg="rgba(245,158,11,0.12)"
            iconColor="#f59e0b"
            loading={loading}
          />
          <StatCard
            icon={<Users size={18} />}
            label="Recruiter Chats"
            value={recruiterChats}
            iconBg="rgba(16,185,129,0.12)"
            iconColor="#10b981"
            loading={loading}
          />
          <StatCard
            icon={<Activity size={18} />}
            label="Technical Chats"
            value={technicalChats}
            iconBg="rgba(34,211,238,0.12)"
            iconColor="#67e8f9"
            loading={loading}
          />
        </div>

        {/* ── AI Search & Filters ─────────────────────────────────────────── */}
        <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center mb-4">
          <div className="search-field flex-grow-1">
            <Search size={16} className="search-field-icon" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search AI conversations..."
              className="form-control search-field-input"
              style={{
                height: 48,
                borderRadius: 14,
                background: 'var(--admin-surface)',
                border: '1px solid var(--admin-border)',
                color: 'var(--admin-text)',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div className="d-flex gap-2 flex-shrink-0">
            <select
              value={aiTypeFilter}
              onChange={e => setAiTypeFilter(e.target.value as any)}
              className="form-select"
              style={{
                height: 48,
                borderRadius: 14,
                background: 'var(--admin-surface)',
                border: '1px solid var(--admin-border)',
                color: 'var(--admin-text)',
                fontSize: '0.85rem',
                minWidth: 160,
                cursor: 'pointer',
              }}
            >
              <option value="all">All Types</option>
              <option value="recruiter">Recruiter Only</option>
              <option value="technical">Technical Only</option>
              <option value="general">General Only</option>
            </select>

            <button
              type="button"
              disabled={filteredLogs.length === 0}
              onClick={deleteVisibleChatLogs}
              className="btn d-inline-flex align-items-center justify-content-center gap-2"
              style={{
                minHeight: 48,
                borderRadius: 14,
                border: '1px solid rgba(248,113,113,0.24)',
                background: filteredLogs.length === 0 ? 'var(--admin-surface)' : 'rgba(248,113,113,0.1)',
                color: filteredLogs.length === 0 ? 'var(--admin-text-sub)' : '#fca5a5',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              <Trash2 size={15} />
              {search ? 'Delete Matches' : 'Clear Chat Logs'}
            </button>
          </div>
        </div>

        {/* ── AI Conversations Table ───────────────────────────────────────── */}
        <h3 className="mb-3" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--admin-text)' }}>
          AI Conversations ({filteredLogs.length})
        </h3>

        <div
          className="card shadow-sm"
          style={{ borderRadius: 14, border: '1px solid var(--admin-border)', overflow: 'hidden' }}
        >
          <>
            {/* Desktop Table View */}
            <div
              className="table-responsive analytics-scroll-pane analytics-scroll-pane-chats d-none d-md-block"
              data-lenis-prevent
            >
              <table className="table table-borderless mb-0" style={{ fontSize: '0.85rem', minWidth: 820 }}>
                <thead
                  style={{
                    background: 'var(--admin-main-bg)',
                    borderBottom: '1px solid var(--admin-border)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 2,
                  }}
                >
                  <tr>
                    <th className="px-4 py-3" style={{ color: 'var(--admin-text-sub)', fontWeight: 600 }}>
                      Question
                    </th>
                    <th className="px-4 py-3" style={{ color: 'var(--admin-text-sub)', fontWeight: 600 }}>
                      Type
                    </th>
                    <th className="px-4 py-3" style={{ color: 'var(--admin-text-sub)', fontWeight: 600 }}>
                      Date
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {/* FIX: Empty state when search returns no results */}
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-5 text-center" style={{ color: 'var(--admin-text-sub)' }}>
                        {search ? `No conversations matching "${search}"` : 'No AI conversations yet.'}
                      </td>
                    </tr>
                  ) : (
                    paginatedAiLogs.map(log => (
                      <tr
                        key={log.id}
                        style={{ borderBottom: '1px solid var(--admin-border-soft)' }}
                      >
                        <td className="px-4 py-3">
                          <div style={{ fontWeight: 700, color: 'var(--admin-text)', marginBottom: 6 }}>
                            {log.user_message}
                          </div>
                          <div
                            style={{
                              fontSize: '0.8rem',
                              color: 'var(--admin-text-sub)',
                              lineHeight: 1.6,
                            }}
                          >
                            {log.ai_response?.slice(0, 140)}
                            {log.ai_response?.length > 140 ? '…' : ''}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="d-flex gap-2 flex-wrap">
                            {log.is_recruiter && (
                              <span
                                style={{
                                  background: 'rgba(16,185,129,0.12)',
                                  color: '#10b981',
                                  padding: '4px 10px',
                                  borderRadius: 999,
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                }}
                              >
                                Recruiter
                              </span>
                            )}
                            {log.is_technical && (
                              <span
                                style={{
                                  background: 'rgba(34,211,238,0.12)',
                                  color: '#67e8f9',
                                  padding: '4px 10px',
                                  borderRadius: 999,
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                }}
                              >
                                Technical
                              </span>
                            )}
                            {!log.is_recruiter && !log.is_technical && (
                              <span
                                style={{
                                  background: 'rgba(148,163,184,0.12)',
                                  color: 'var(--admin-text-sub)',
                                  padding: '4px 10px',
                                  borderRadius: 999,
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                }}
                              >
                                General
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span style={{ color: 'var(--admin-text-sub)', fontSize: '0.8rem' }}>
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="d-flex justify-content-end gap-2">
                            <button
                              className="btn btn-sm btn-outline-light"
                              onClick={() => setSelectedChat(log)}
                            >
                              View
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm admin-icon-action d-inline-flex align-items-center justify-content-center"
                              aria-label="Delete chat log"
                              onClick={() => deleteChatLog(log.id)}
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                background: 'rgba(248,113,113,0.1)',
                                border: '1px solid rgba(248,113,113,0.22)',
                                color: '#fca5a5',
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="d-block d-md-none" style={{ background: 'var(--admin-main-bg)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.75rem' }}>
                {filteredLogs.length === 0 ? (
                  <div className="text-center py-4" style={{ color: 'var(--admin-text-sub)' }}>
                    {search ? `No conversations matching "${search}"` : 'No AI conversations yet.'}
                  </div>
                ) : (
                  paginatedAiLogs.map(log => (
                    <div
                      key={log.id}
                      style={{
                        borderRadius: 12,
                        border: '1px solid var(--admin-border)',
                        background: 'var(--admin-surface)',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                      }}
                    >
                      {/* Header with date and badges */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-sub)' }}>
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                          <div className="d-flex gap-1 flex-wrap">
                            {log.is_recruiter && (
                              <span
                                style={{
                                  background: 'rgba(16,185,129,0.12)',
                                  color: '#10b981',
                                  padding: '2px 8px',
                                  borderRadius: 4,
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                }}
                              >
                                Recruiter
                              </span>
                            )}
                            {log.is_technical && (
                              <span
                                style={{
                                  background: 'rgba(34,211,238,0.12)',
                                  color: '#67e8f9',
                                  padding: '2px 8px',
                                  borderRadius: 4,
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                }}
                              >
                                Technical
                              </span>
                            )}
                            {!log.is_recruiter && !log.is_technical && (
                              <span
                                style={{
                                  background: 'rgba(148,163,184,0.12)',
                                  color: 'var(--admin-text-sub)',
                                  padding: '2px 8px',
                                  borderRadius: 4,
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                }}
                              >
                                General
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteChatLog(log.id)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            background: 'rgba(248,113,113,0.1)',
                            border: '1px solid rgba(248,113,113,0.22)',
                            color: '#fca5a5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      {/* Question */}
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--admin-text)' }}>
                        Q: {log.user_message}
                      </div>

                      {/* Response excerpt */}
                      <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-sub)', lineHeight: 1.5 }}>
                        {log.ai_response?.slice(0, 100)}
                        {log.ai_response?.length > 100 ? '…' : ''}
                      </div>

                      {/* View button */}
                      <button
                        className="btn btn-sm btn-outline-light w-100"
                        style={{ fontSize: '0.78rem', padding: '6px 0', borderRadius: 8 }}
                        onClick={() => setSelectedChat(log)}
                      >
                        View Conversation
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* AI Logs Pagination Controls */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '1rem 1.5rem',
                borderTop: '1px solid var(--admin-border-soft)',
                background: 'rgba(15, 23, 42, 0.2)',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-sub)' }}>
                Showing <strong style={{ color: 'var(--admin-text)' }}>{Math.min(filteredLogs.length, (currentAiPage - 1) * aiItemsPerPage + 1)}-{Math.min(filteredLogs.length, currentAiPage * aiItemsPerPage)}</strong> of <strong style={{ color: 'var(--admin-text)' }}>{filteredLogs.length}</strong> chats
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-sub)' }}>Show</span>
                  <select
                    value={aiItemsPerPage}
                    onChange={e => {
                      setAiItemsPerPage(Number(e.target.value))
                      setCurrentAiPage(1)
                    }}
                    style={{
                      background: 'var(--admin-surface)',
                      border: '1px solid var(--admin-border)',
                      color: 'var(--admin-text)',
                      fontSize: '0.78rem',
                      padding: '4px 8px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-sub)' }}>per page</span>
                </div>

                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    type="button"
                    disabled={currentAiPage === 1}
                    onClick={() => {
                      setCurrentAiPage(p => Math.max(1, p - 1))
                    }}
                    className="btn btn-sm"
                    style={{
                      padding: '4px 12px',
                      borderRadius: 8,
                      background: currentAiPage === 1 ? 'transparent' : 'var(--admin-surface)',
                      border: '1px solid var(--admin-border)',
                      color: currentAiPage === 1 ? 'var(--admin-text-soft)' : 'var(--admin-text)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: currentAiPage === 1 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Previous
                  </button>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--admin-text-sub)',
                      padding: '4px 8px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Page {currentAiPage} of {totalAiPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentAiPage === totalAiPages}
                    onClick={() => {
                      setCurrentAiPage(p => Math.min(totalAiPages, p + 1))
                    }}
                    className="btn btn-sm"
                    style={{
                      padding: '4px 12px',
                      borderRadius: 8,
                      background: currentAiPage === totalAiPages ? 'transparent' : 'var(--admin-surface)',
                      border: '1px solid var(--admin-border)',
                      color: currentAiPage === totalAiPages ? 'var(--admin-text-soft)' : 'var(--admin-text)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: currentAiPage === totalAiPages ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        </div>
{/* ── Chat Detail Modal ─────────────────────────────────────────────── */}
        {/* FIX: Added explicit close (X) button; previously only closeable via backdrop click */}
        <AnimatePresence>
          {selectedChat && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
              style={{ background: 'rgba(0,0,0,0.7)', zIndex: 9999, padding: 20 }}
              onClick={() => setSelectedChat(null)}
            >
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                style={{
                  width: '100%',
                  maxWidth: 820,
                  maxHeight: '85vh',
                  overflowY: 'auto',
                  borderRadius: 18,
                  background: 'var(--admin-surface)',
                  padding: 28,
                  position: 'relative',
                }}
              >
                {/* Close button */}
                <button
                  onClick={() => deleteChatLog(selectedChat.id)}
                  className="admin-icon-action"
                  style={{
                    position: 'absolute',
                    top: 20,
                    right: 60,
                    background: 'rgba(248,113,113,0.1)',
                    border: '1px solid rgba(248,113,113,0.22)',
                    borderRadius: 8,
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#fca5a5',
                  }}
                  aria-label="Delete chat log"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => setSelectedChat(null)}
                  style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    background: 'var(--admin-main-bg)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: 8,
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--admin-text-sub)',
                  }}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>

                <h3 style={{ fontWeight: 800, marginBottom: 8, color: 'var(--admin-text)', paddingRight: 40 }}>
                  AI Conversation
                </h3>

                {/* Type badges */}
                <div className="d-flex gap-2 mb-4">
                  {selectedChat.is_recruiter && (
                    <span
                      style={{
                        background: 'rgba(16,185,129,0.12)',
                        color: '#10b981',
                        padding: '4px 10px',
                        borderRadius: 999,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                      }}
                    >
                      Recruiter
                    </span>
                  )}
                  {selectedChat.is_technical && (
                    <span
                      style={{
                        background: 'rgba(34,211,238,0.12)',
                        color: '#67e8f9',
                        padding: '4px 10px',
                        borderRadius: 999,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                      }}
                    >
                      Technical
                    </span>
                  )}
                  <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-sub)', alignSelf: 'center' }}>
                    {new Date(selectedChat.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="mb-4">
                  <div style={{ fontWeight: 700, marginBottom: 10, color: 'var(--admin-text)' }}>
                    User Question
                  </div>
                  <div
                    style={{
                      padding: 16,
                      borderRadius: 14,
                      background: 'var(--admin-main-bg)',
                      lineHeight: 1.7,
                      color: 'var(--admin-text)',
                    }}
                  >
                    {selectedChat.user_message}
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: 700, marginBottom: 10, color: 'var(--admin-text)' }}>
                    AI Response
                  </div>
                  <div
                    style={{
                      padding: 16,
                      borderRadius: 14,
                      background: 'var(--admin-main-bg)',
                      lineHeight: 1.9,
                      whiteSpace: 'pre-wrap',
                      color: 'var(--admin-text)',
                    }}
                  >
                    {selectedChat.ai_response}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  )
}
