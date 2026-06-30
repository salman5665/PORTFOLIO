'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Code, ExternalLink, Target, Trophy } from 'lucide-react'

interface LeetCodeStats {
  username: string
  profile: {
    realName: string
    userAvatar: string
    ranking: number
    reputation: number
    starRating: number
  }
  submitStats: {
    acSubmissionNum: {
      difficulty: string
      count: number
      submissions: number
    }[]
  }
}

interface Props {
  username?: string
  profileUrl?: string
}

const FALLBACK_USERNAME = 'vinitsonii'

const DIFFICULTIES = [
  { key: 'Easy', color: '#22c55e' },
  { key: 'Medium', color: '#f59e0b' },
  { key: 'Hard', color: '#f43f5e' },
] as const

export default function LeetcodeWidget({ username = FALLBACK_USERNAME, profileUrl }: Props) {
  const [stats, setStats] = useState<LeetCodeStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const displayUsername = username.trim() || FALLBACK_USERNAME
  const leetcodeUrl = profileUrl || `https://leetcode.com/${displayUsername}`

  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/leetcode-stats?username=${encodeURIComponent(displayUsername)}`, {
          signal: controller.signal,
        })
        if (res.ok) {
          setStats(await res.json())
        } else {
          setError('Failed to load LeetCode stats')
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          setError('LeetCode stats request timed out.')
        } else {
          console.error('Failed to fetch leetcode stats', err)
          setError('Unable to fetch LeetCode stats. Please try again later.')
        }
      } finally {
        clearTimeout(timeout)
        setLoading(false)
      }
    }

    fetchStats()
    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [displayUsername])

  const shellStyle: React.CSSProperties = {
    minHeight: 440,
    borderRadius: 18,
    overflow: 'hidden',
    background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.88), rgba(2, 6, 23, 0.76))',
    border: '1px solid rgba(125, 211, 252, 0.16)',
    boxShadow: '0 22px 58px rgba(2, 6, 23, 0.38), inset 0 1px 0 rgba(255,255,255,0.045)',
  }

  const gridStyle: React.CSSProperties = {
    minHeight: 440,
    background:
      'linear-gradient(rgba(125, 211, 252, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(125, 211, 252, 0.03) 1px, transparent 1px)',
    backgroundSize: '30px 30px',
  }

  const counts = useMemo(() => {
    const get = (diff: string) =>
      stats?.submitStats?.acSubmissionNum.find((s) => s.difficulty === diff)?.count || 0
    return {
      total: get('All'),
      easy: get('Easy'),
      medium: get('Medium'),
      hard: get('Hard'),
    }
  }, [stats])

  if (loading) {
    return (
      <div className="card h-100" style={shellStyle}>
        <div className="card-body p-4 d-flex align-items-center justify-content-center" style={gridStyle}>
          <div className="spinner-border" role="status" style={{ color: '#67e8f9' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !stats || !stats.submitStats) {
    return (
      <div className="card h-100" style={shellStyle}>
        <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center text-center"
          style={{ ...gridStyle, color: 'var(--color-text-muted)' }}>
          <AlertCircle size={40} className="mb-3" style={{ color: '#67e8f9', opacity: 0.72 }} />
          <p className="mb-1" style={{ fontSize: '0.875rem' }}>{error || 'Unable to load LeetCode stats'}</p>
          <p className="mb-0" style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
            Add a LeetCode URL in admin settings when you are ready.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card h-100" style={shellStyle}>
      <div className="card-body p-4" style={gridStyle}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="d-flex align-items-center justify-content-center rounded-3"
            style={{ width: 48, height: 48, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.24)' }}>
            <Code size={22} style={{ color: '#fbbf24' }} />
          </div>
          <div>
            <h3 className="d-flex align-items-center gap-2" style={{ fontWeight: 800, color: 'var(--color-text)', fontSize: '1.05rem', marginBottom: 2 }}>
              LeetCode
              {stats.profile.starRating > 0 && (
                <span className="rounded-pill px-2 py-1"
                  style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fef3c7', background: 'rgba(245, 158, 11, 0.13)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  {stats.profile.starRating} star
                </span>
              )}
            </h3>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              {stats.username || displayUsername}
            </div>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-6">
            <div className="rounded-3 px-3 py-2" style={{ background: 'rgba(2, 6, 23, 0.42)', border: '1px solid rgba(125, 211, 252, 0.13)' }}>
              <div className="d-flex align-items-center gap-1 mb-1" style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)' }}>
                <Trophy size={11} /> Ranking
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)' }}>
                {stats.profile.ranking?.toLocaleString?.() || 'N/A'}
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="rounded-3 px-3 py-2" style={{ background: 'rgba(2, 6, 23, 0.42)', border: '1px solid rgba(125, 211, 252, 0.13)' }}>
              <div className="d-flex align-items-center gap-1 mb-1" style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)' }}>
                <Target size={11} /> Solved
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)' }}>{counts.total}</div>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column gap-3">
          {DIFFICULTIES.map(({ key, color }) => {
            const count = counts[key.toLowerCase() as 'easy' | 'medium' | 'hard']
            return (
              <div key={key}>
                <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.75rem' }}>
                  <span style={{ color, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{key}</span>
                  <span style={{ color: 'var(--color-text-sub)' }}>{count}</span>
                </div>
                <div className="rounded-pill overflow-hidden" style={{ height: 7, background: 'rgba(2, 6, 23, 0.46)', border: '1px solid rgba(125, 211, 252, 0.12)' }}>
                  <div className="rounded-pill" style={{ height: '100%', width: `${(count / Math.max(counts.total, 1)) * 100}%`, background: color }} />
                </div>
              </div>
            )
          })}
        </div>

        <a href={leetcodeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark btn-sm d-inline-flex align-items-center gap-2 mt-4"
          style={{ borderColor: 'rgba(125,211,252,0.24)', color: 'var(--color-text)', borderRadius: 10 }}>
          Open Profile <ExternalLink size={13} />
        </a>
      </div>
    </div>
  )
}
