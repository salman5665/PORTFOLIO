'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { adminDb } from '@/lib/adminDb'
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AnalyticsDashboardPage() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showLocal, setShowLocal] = useState(true)
  const [expandedVisitorId, setExpandedVisitorId] = useState<string | null>(null)
  const [aiLogs, setAiLogs] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [selectedChat, setSelectedChat] = useState<any | null>(null)

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
  const { sessions, totalViews, avgPages, chartData } = useMemo(() => {
    const map = new Map<string, AnalyticsEvent[]>()
    const dailyMap = new Map<string, { views: number; visitors: Set<string> }>()
    let validEvents = 0

    events.forEach(ev => {
      if (!showLocal && (ev.ip_address === '::1' || ev.ip_address === '127.0.0.1')) return

      validEvents++
      const vId = (ev.metadata as any)?.visitorId || 'unknown'

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
    }
  }, [events, showLocal])

  // FIX: AI-derived values moved into useMemo — depend on aiLogs / search.
  const { recruiterChats, technicalChats, filteredLogs } = useMemo(() => {
    const recruiterChats = aiLogs.filter(l => l.is_recruiter).length
    const technicalChats = aiLogs.filter(l => l.is_technical).length
    const query = search.toLowerCase()
    const filteredLogs = aiLogs.filter(log =>
      log.user_message?.toLowerCase().includes(query) ||
      log.ai_response?.toLowerCase().includes(query)
    )
    return { recruiterChats, technicalChats, filteredLogs }
  }, [aiLogs, search])

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
        <h3 id="visitor-sessions" className="mb-3 mt-5" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--admin-text)', scrollMarginTop: 90 }}>
          Visitor Sessions ({sessions.length})
        </h3>

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
            <div
              className="table-responsive analytics-scroll-pane analytics-scroll-pane-visitors"
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
                  {sessions.map(([vId, userEvents]) => {
                    const firstEvent = userEvents[userEvents.length - 1] // oldest
                    const lastEvent = userEvents[0] // newest
                    const meta: any = lastEvent.metadata || {}
                    const isExpanded = expandedVisitorId === vId
                    const isMobile = lastEvent.user_agent?.toLowerCase().includes('mobi')
                    const isLocal =
                      lastEvent.ip_address === '::1' || lastEvent.ip_address === '127.0.0.1'

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
                                              Viewed{' '}
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

        {/* ── AI Search ───────────────────────────────────────────────────── */}
        <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center mb-4">
          <div className="search-field flex-grow-1">
            <Search size={16} className="search-field-icon" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search AI conversations..."
              className="form-control search-field-input"
              style={{ height: 48, borderRadius: 14 }}
            />
          </div>
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
            }}
          >
            <Trash2 size={15} />
            {search ? 'Delete Matches' : 'Clear Chat Logs'}
          </button>
        </div>

        {/* ── AI Conversations Table ───────────────────────────────────────── */}
        <h3 className="mb-3" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--admin-text)' }}>
          AI Conversations ({filteredLogs.length})
        </h3>

        <div
          className="card shadow-sm"
          style={{ borderRadius: 14, border: '1px solid var(--admin-border)', overflow: 'hidden' }}
        >
          <div
            className="table-responsive analytics-scroll-pane analytics-scroll-pane-chats"
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
                  filteredLogs.map(log => (
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
