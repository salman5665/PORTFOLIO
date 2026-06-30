import { Layers, Terminal, UserRound } from 'lucide-react'

function SkeletonLine({ className = '' }: { className?: string }) {
  return <span className={`sk-line ${className}`} aria-hidden="true" />
}

function SkeletonPill({ className = '' }: { className?: string }) {
  return <span className={`sk-pill ${className}`} aria-hidden="true" />
}

function SkeletonCard({ tall = false }: { tall?: boolean }) {
  return (
    <article className={`sk-card ${tall ? 'sk-card-tall' : ''}`}>
      <div className="sk-card-media" />
      <div className="sk-card-body">
        <SkeletonLine className="w-70" />
        <SkeletonLine className="w-95" />
        <SkeletonLine className="w-55" />
        <div className="sk-chip-row">
          <SkeletonPill />
          <SkeletonPill />
          <SkeletonPill className="short" />
        </div>
      </div>
    </article>
  )
}

export function PortfolioLoadingSkeleton() {
  return (
    <main className="sk-page portfolio-main" role="status" aria-label="Loading portfolio content">
      <div className="sk-nav">
        <div className="sk-brand">
          <span className="sk-brand-mark"><UserRound size={18} /></span>
          <div>
            <SkeletonLine className="w-80" />
            <SkeletonLine className="w-50 tiny" />
          </div>
        </div>
        <div className="sk-nav-links">
          <SkeletonPill />
          <SkeletonPill />
          <SkeletonPill />
          <SkeletonPill />
        </div>
      </div>

      <section className="sk-hero">
        <div className="sk-hero-copy">
          <SkeletonPill />
          <SkeletonLine className="title w-95" />
          <SkeletonLine className="title w-75" />
          <SkeletonLine className="w-90" />
          <SkeletonLine className="w-70" />
          <div className="sk-action-row">
            <SkeletonPill className="button" />
            <SkeletonPill className="button muted" />
          </div>
        </div>
        <div className="sk-hero-panel">
          <div className="sk-terminal-head">
            <Terminal size={16} />
            <SkeletonLine className="w-55 tiny" />
          </div>
          <div className="sk-stat-grid">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </section>

      <section className="sk-section">
        <div className="sk-section-head">
          <SkeletonPill />
          <SkeletonLine className="heading w-45" />
          <SkeletonLine className="w-65" />
        </div>
        <div className="sk-grid">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>

      <section className="sk-section">
        <div className="sk-section-head">
          <SkeletonPill />
          <SkeletonLine className="heading w-50" />
          <SkeletonLine className="w-70" />
        </div>
        <div className="sk-rail" aria-hidden="true">
          <SkeletonCard tall />
          <SkeletonCard tall />
          <SkeletonCard tall />
          <SkeletonCard tall />
        </div>
      </section>
    </main>
  )
}

export function AdminLoadingSkeleton() {
  return (
    <main className="admin-sk-main" role="status" aria-label="Loading admin dashboard">
      <div className="admin-sk-top">
        <div>
          <SkeletonLine className="heading w-45" />
          <SkeletonLine className="w-65" />
        </div>
        <SkeletonPill className="button" />
      </div>
      <div className="admin-sk-stats">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="admin-sk-table">
        <SkeletonLine className="heading w-35" />
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="admin-sk-row" key={index}>
            <SkeletonLine className="w-30" />
            <SkeletonLine className="w-20" />
            <SkeletonLine className="w-15" />
            <SkeletonPill className="short" />
          </div>
        ))}
      </div>
    </main>
  )
}

export function BlogLoadingSkeleton() {
  return (
    <main className="sk-page portfolio-main" role="status" aria-label="Loading articles">
      <section className="sk-section sk-blog-shell">
        <div className="sk-section-head">
          <SkeletonPill />
          <SkeletonLine className="title w-65" />
          <SkeletonLine className="w-75" />
        </div>
        <div className="sk-grid">
          <SkeletonCard tall />
          <SkeletonCard tall />
          <SkeletonCard tall />
        </div>
      </section>
    </main>
  )
}

export function ResumeLoadingSkeleton() {
  return (
    <main className="sk-page portfolio-main" role="status" aria-label="Loading resume">
      <section className="sk-resume">
        <div className="sk-resume-header">
          <SkeletonLine className="title w-55" />
          <SkeletonLine className="w-80" />
          <div className="sk-chip-row">
            <SkeletonPill />
            <SkeletonPill />
            <SkeletonPill />
          </div>
        </div>
        <div className="sk-resume-grid">
          <div>
            <SkeletonLine className="heading w-45" />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div>
            <SkeletonLine className="heading w-55" />
            <SkeletonCard />
          </div>
        </div>
      </section>
    </main>
  )
}

export function InlineSectionSkeleton({ label = 'Loading section' }: { label?: string }) {
  return (
    <div className="sk-inline-section" role="status" aria-label={label}>
      <Layers size={22} />
      <div>
        <SkeletonLine className="w-55" />
        <SkeletonLine className="w-85" />
      </div>
    </div>
  )
}
