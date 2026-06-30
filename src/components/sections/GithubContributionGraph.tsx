'use client'

import { useEffect, useState } from 'react'
import { ActivityCalendar } from 'react-activity-calendar'
import { Code2, GitPullRequest, Star } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'

interface GithubStats {
  username?: string
  commits: number
  repos: number
  prs: number
  stars: number
  contributions: { date: string; count: number; level: number }[]
}

interface Props {
  username?: string
  profileUrl?: string
}

const FALLBACK_USERNAME = 'vinitsonii'

export default function GithubContributionGraph({ username = FALLBACK_USERNAME, profileUrl }: Props) {
  const [stats, setStats] = useState<GithubStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const displayUsername = username.trim() || FALLBACK_USERNAME
  const githubUrl = profileUrl || `https://github.com/${displayUsername}`

  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/github-stats?username=${encodeURIComponent(displayUsername)}`, {
          signal: controller.signal,
        })
        if (res.ok) {
          setStats(await res.json())
        } else {
          setError('Failed to load GitHub stats')
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          setError('GitHub stats request timed out. Please try again later.')
        } else {
          console.error('Failed to fetch github stats', err)
          setError('Unable to fetch GitHub stats. Please try again later.')
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

  if (loading) {
    return (
      <div className="card h-100" style={shellStyle}>
        <div className="card-body p-4 p-md-5 d-flex flex-column align-items-center justify-content-center" style={{ ...gridStyle, gap: 16 }}>
          <div className="spinner-border" role="status" style={{ color: '#67e8f9' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Loading GitHub data...
          </div>
        </div>
      </div>
    )
  }

  if (error || !stats || !stats.contributions || stats.contributions.length === 0) {
    return (
      <div className="card h-100" style={shellStyle}>
        <div className="card-body p-4 p-md-5 d-flex flex-column align-items-center justify-content-center text-center" style={{ ...gridStyle, color: 'var(--color-text-muted)' }}>
          <FaGithub size={44} className="mb-3" style={{ color: '#67e8f9', opacity: 0.72 }} />
          <p className="mb-1">{error || 'No GitHub contribution data available.'}</p>
          <p className="mb-0" style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            Add and publish a GitHub URL from Admin Skills when you are ready.
          </p>
        </div>
      </div>
    )
  }

  const statItems = [
    { icon: Code2, label: 'Repositories', value: stats.repos },
    { icon: GitPullRequest, label: 'Contributions', value: stats.commits },
    { icon: Star, label: 'Stars', value: stats.stars },
  ]

  return (
    <div className="card h-100" style={shellStyle}>
      <div className="card-body p-4 p-md-5" style={gridStyle}>
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4 mb-4">
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center justify-content-center rounded-3"
              style={{ width: 48, height: 48, background: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.22)', color: '#67e8f9' }}>
              <FaGithub size={22} />
            </div>
            <div>
              <h3 style={{ fontWeight: 800, color: 'var(--color-text)', fontSize: '1.05rem', marginBottom: 2 }}>
                GitHub Activity
              </h3>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                @{stats.username || displayUsername}
              </div>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2">
            {statItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
                style={{ background: 'rgba(2, 6, 23, 0.42)', border: '1px solid rgba(125, 211, 252, 0.13)' }}>
                <Icon size={15} style={{ color: '#67e8f9' }} />
                <div>
                  <div style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1 }}>
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pb-2" style={{ overflowX: 'auto', scrollbarWidth: 'none' }}>
          <div style={{ minWidth: 720 }}>
            <ActivityCalendar
              data={stats.contributions}
              theme={{
                light: ['rgba(148, 163, 184, 0.16)', '#164e63', '#0891b2', '#22d3ee', '#a78bfa'],
                dark: ['rgba(148, 163, 184, 0.16)', '#164e63', '#0891b2', '#22d3ee', '#a78bfa'],
              }}
              colorScheme="dark"
              labels={{ totalCount: '{{count}} contributions in the last year' }}
              blockSize={13}
              blockMargin={4}
              fontSize={12}
            />
          </div>
        </div>

        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark btn-sm d-inline-flex align-items-center gap-2 mt-3"
          style={{ borderColor: 'rgba(125,211,252,0.24)', color: 'var(--color-text)', borderRadius: 10 }}>
          View GitHub Profile
        </a>
      </div>
    </div>
  )
}
