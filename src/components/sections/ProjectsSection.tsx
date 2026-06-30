'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Code2, ExternalLink, Layers, Monitor, Search, Smartphone, Star, X } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import Image from 'next/image'
import type { Project } from '@/lib/supabase/types'
import { useBodyScrollLock } from '@/lib/hooks/useBodyScrollLock'

interface Props { projects: Project[] }

const categoryMeta: Record<string, { label: string; icon: typeof Layers; tone: string }> = {
  web: { label: 'Web', icon: Monitor, tone: '#67e8f9' },
  mobile: { label: 'Mobile', icon: Smartphone, tone: '#5eead4' },
  api: { label: 'API', icon: Code2, tone: '#c4b5fd' },
  ai: { label: 'AI', icon: Star, tone: '#f0abfc' },
  other: { label: 'Other', icon: Layers, tone: '#cbd5e1' },
}

function getCategoryMeta(category: string) {
  return categoryMeta[category?.toLowerCase()] || {
    label: category || 'Project',
    icon: Layers,
    tone: '#cbd5e1',
  }
}

function getInitials(title: string) {
  return title
    .split(/[\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('') || 'VS'
}

function ProjectVisual({ project }: { project: Project }) {
  const meta = getCategoryMeta(project.category)
  const Icon = meta.icon

  if (project.thumbnail_url) {
    return (
      <motion.div className="w-100 h-100 position-relative" whileHover={{ scale: 1.05 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
        <Image src={project.thumbnail_url} alt={project.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 33vw" unoptimized />
      </motion.div>
    )
  }

  return (
    <div className="ps-generated-visual">
      <div className="ps-visual-grid" />
      <div className="ps-visual-mark" style={{ color: meta.tone }}>
        <Icon size={26} />
        <span>{getInitials(project.title)}</span>
      </div>
    </div>
  )
}

function ProjectCard({ project, i, onClick }: { project: Project; i: number; onClick: () => void }) {
  const meta = getCategoryMeta(project.category)
  const CategoryIcon = meta.icon

  return (
    <motion.div 
      layout
      className="ps-rail-item"
      initial={{ opacity: 0 }} 
      whileInView={{ opacity: 1 }} 
      viewport={{ once: true, margin: "-50px" }} 
      transition={{ delay: i * 0.05, duration: 0.5 }}
    >
      <article
        className="ps-card h-100 d-flex flex-column"
      >
        <div className="position-relative overflow-hidden ps-card-media">
          <ProjectVisual project={project} />
          <div className="ps-card-shade" />
          {project.is_featured && (
            <span className="ps-featured-badge">
              <Star size={11} style={{ fill: 'currentColor' }} /> Featured
            </span>
          )}
          <span className="ps-category-badge" style={{ color: meta.tone }}>
            <CategoryIcon size={12} /> {meta.label}
          </span>
        </div>
        <div className="ps-card-body d-flex flex-column flex-grow-1">
          <h3 className="ps-card-title">{project.title}</h3>
          <p className="ps-card-desc">
            {project.short_description}
          </p>
          <div className="d-flex flex-wrap gap-2 mt-auto">
            {project.tech_stack.slice(0, 2).map((t) => <span key={t} className="ps-tech-badge">{t}</span>)}
            {project.tech_stack.length > 2 && <span className="ps-tech-badge ps-tech-more">+{project.tech_stack.length - 2}</span>}
          </div>
          <div className="ps-card-actions">
            <button
              type="button"
              className="ps-card-link ps-card-link-details"
              onClick={onClick}
              aria-label={`Open project details for ${project.title}`}
            >
              <Layers size={15} /> Details
            </button>
            <div className="ps-card-icon-actions">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ps-icon-link"
                  onClick={(event) => event.stopPropagation()}
                  aria-label={`View ${project.title} source code`}
                >
                  <FaGithub size={15} />
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ps-icon-link"
                  onClick={(event) => event.stopPropagation()}
                  aria-label={`Open ${project.title} live site`}
                >
                  <ArrowUpRight size={15} />
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    </motion.div>
  )
}

export default function ProjectsSection({ projects }: Props) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Project | null>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const [railProgress, setRailProgress] = useState(0)
  useBodyScrollLock(Boolean(selected))

  useEffect(() => {
    if (!selected) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selected])

  const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))], [projects])
  const featuredCount = useMemo(() => projects.filter((p) => p.is_featured).length, [projects])
  const techCount = useMemo(() => new Set(projects.flatMap((p) => p.tech_stack)).size, [projects])
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return projects
      .filter((p) => {
        const matchCat = activeCategory === 'All' || p.category === activeCategory
        const matchSearch = !query
          || p.title.toLowerCase().includes(query)
          || (p.short_description || '').toLowerCase().includes(query)
          || p.tech_stack.some((t) => t.toLowerCase().includes(query))
        return matchCat && matchSearch
      })
      .sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || a.sort_order - b.sort_order)
  }, [activeCategory, projects, search])

  const updateRailProgress = () => {
    const rail = railRef.current
    if (!rail) return

    const max = rail.scrollWidth - rail.clientWidth
    setRailProgress(max <= 0 ? 100 : Math.min(100, Math.max(0, (rail.scrollLeft / max) * 100)))
  }

  const scrollRail = (direction: 'prev' | 'next') => {
    const rail = railRef.current
    if (!rail) return

    const amount = Math.min(rail.clientWidth * 0.86, 440)
    rail.scrollBy({ left: direction === 'next' ? amount : -amount, behavior: 'smooth' })
  }

  useEffect(() => {
    updateRailProgress()
  }, [filtered.length])

  return (
    <>
      <style>{`
        .ps-card {
          background: rgba(15, 23, 42, 0.72);
          border: 1px solid rgba(125, 211, 252, 0.14);
          border-radius: 14px;
          overflow: hidden;
          transition: transform 0.24s ease, border-color 0.24s ease, box-shadow 0.24s ease, background-color 0.24s ease;
          position: relative;
        }
        .ps-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 14px;
          border: 1px solid rgba(34, 211, 238, 0.14);
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
        }
        .ps-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 46px rgba(2, 6, 23, 0.38);
          background: rgba(15, 23, 42, 0.84);
        }
        .ps-card:hover::after {
          opacity: 1;
        }
        .ps-rail-shell {
          position: relative;
        }
        .ps-rail {
          display: flex;
          gap: 1.2rem;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          scroll-padding-inline: 2px;
          padding: 0.25rem 0.1rem 1.35rem;
          margin-inline: -0.1rem;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
          touch-action: auto;
        }
        .ps-rail::-webkit-scrollbar {
          display: none;
        }
        .ps-rail-item {
          flex: 0 0 clamp(272px, 30vw, 330px);
          max-width: 330px;
          scroll-snap-align: start;
        }
        .ps-rail-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 0.75rem;
        }
        .ps-rail-progress {
          position: relative;
          flex: 1;
          height: 4px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(125, 211, 252, 0.12);
        }
        .ps-rail-progress span {
          position: absolute;
          inset: 0 auto 0 0;
          width: var(--ps-progress);
          border-radius: inherit;
          background: linear-gradient(90deg, #67e8f9, #14b8a6, #a78bfa);
          transition: width 0.22s ease;
        }
        .ps-rail-buttons {
          display: flex;
          gap: 0.55rem;
        }
        .ps-rail-btn {
          width: 40px;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: #e2e8f0;
          border: 1px solid rgba(125, 211, 252, 0.16);
          background: rgba(2, 6, 23, 0.52);
          transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
        }
        .ps-rail-btn:hover {
          transform: translateY(-1px);
          border-color: rgba(34, 211, 238, 0.34);
          background: rgba(34, 211, 238, 0.12);
        }
        .ps-mobile-hint {
          display: none;
        }
        .ps-generated-visual {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background:
            radial-gradient(circle at 28% 26%, rgba(34, 211, 238, 0.14), transparent 34%),
            linear-gradient(135deg, rgba(2, 6, 23, 0.96), rgba(15, 23, 42, 0.9));
        }
        .ps-visual-grid {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(rgba(125, 211, 252, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(125, 211, 252, 0.06) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: linear-gradient(to bottom, black, transparent 88%);
        }
        .ps-visual-mark {
          position: absolute;
          left: 50%;
          top: 50%;
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          transform: translate(-50%, -50%);
          padding: 0.78rem 0.9rem;
          border-radius: 14px;
          background: rgba(2, 6, 23, 0.58);
          border: 1px solid rgba(125, 211, 252, 0.16);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }
        .ps-visual-mark span {
          color: #f8fafc;
          font-family: var(--font-mono);
          font-weight: 800;
          letter-spacing: 0;
        }
        .ps-card-media {
          height: 158px;
        }
        .ps-card-shade {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(to bottom, transparent 48%, rgba(2, 6, 23, 0.5));
        }
        .ps-featured-badge,
        .ps-category-badge {
          position: absolute;
          top: 12px;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          min-height: 25px;
          padding: 0 0.58rem;
          border-radius: 999px;
          background: rgba(2, 6, 23, 0.72);
          border: 1px solid rgba(125, 211, 252, 0.18);
          backdrop-filter: blur(10px);
          font-size: 0.64rem;
          font-weight: 700;
        }
        .ps-featured-badge {
          left: 12px;
          color: #e2e8f0;
        }
        .ps-category-badge {
          right: 12px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .ps-card-body {
          padding: 1.05rem;
        }
        .ps-card-title {
          color: var(--color-text);
          font-size: 1rem;
          font-weight: 780;
          line-height: 1.32;
          letter-spacing: 0;
          margin-bottom: 0.55rem;
        }
        .ps-card-desc {
          color: var(--color-text-sub);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          flex: 1;
          overflow: hidden;
          font-size: 0.83rem;
          line-height: 1.55;
          margin-bottom: 1rem;
        }
        .ps-card-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.6rem;
          margin-top: 0.95rem;
          padding-top: 0.9rem;
          border-top: 1px solid rgba(125, 211, 252, 0.11);
        }
        .ps-card-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.42rem;
          min-height: 32px;
          padding: 0 0.72rem;
          border-radius: 9px;
          color: #cbd5e1;
          text-decoration: none;
          font-size: 0.76rem;
          font-weight: 750;
          background: rgba(15, 23, 42, 0.64);
          border: 1px solid rgba(125, 211, 252, 0.14);
          transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
        }
        .ps-card-link-details {
          color: #020617;
          background: linear-gradient(135deg, #67e8f9, #38bdf8 56%, #a78bfa);
          border: 0;
          min-width: 104px;
        }
        .ps-card-link-details:hover {
          color: #020617;
          background: linear-gradient(135deg, #cffafe, #7dd3fc 56%, #c4b5fd);
        }
        .ps-card-icon-actions {
          display: inline-flex;
          gap: 0.45rem;
        }
        .ps-icon-link {
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          color: #cbd5e1;
          background: rgba(2, 6, 23, 0.3);
          border: 1px solid rgba(125, 211, 252, 0.13);
          transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
        }
        .ps-icon-link:hover {
          color: #67e8f9;
          border-color: rgba(34, 211, 238, 0.28);
          background: rgba(34, 211, 238, 0.1);
        }
        .ps-showcase-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.75rem;
          max-width: 520px;
        }
        .ps-stat {
          min-height: 76px;
          padding: 0.82rem;
          border-radius: 14px;
          background: rgba(2, 6, 23, 0.44);
          border: 1px solid rgba(125, 211, 252, 0.13);
        }
        .ps-stat strong {
          display: block;
          color: #f8fafc;
          font-size: 1.25rem;
          line-height: 1;
        }
        .ps-stat span {
          display: block;
          color: var(--color-text-muted);
          font-size: 0.72rem;
          margin-top: 0.45rem;
        }
        .ps-category-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 8px 24px;
          border-radius: 999px;
          font-size: 0.84rem;
          font-weight: 700;
          transition: all 0.3s ease;
          background: rgba(2, 6, 23, 0.36);
          border: 1px solid rgba(125, 211, 252, 0.16);
          color: var(--color-text-sub);
          text-transform: capitalize;
        }
        .ps-category-pill.active {
          background: rgba(34, 211, 238, 0.14);
          color: var(--color-text);
          border-color: rgba(34, 211, 238, 0.36);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 12px 26px rgba(2,6,23,0.24);
        }
        .ps-category-pill:hover:not(.active) {
          background: rgba(125, 211, 252, 0.08);
        }
        .ps-tech-badge {
          padding: 4px 9px;
          border-radius: 8px;
          background: rgba(34, 211, 238, 0.1);
          color: #67e8f9;
          font-size: 0.68rem;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 500;
          border: 1px solid rgba(34, 211, 238, 0.22);
        }
        .ps-tech-more {
          color: var(--color-text-sub);
          border-color: rgba(125,211,252,0.16);
          background: transparent;
        }
        .ps-modal-glass {
          position: relative;
          background: linear-gradient(145deg, rgba(10, 17, 30, 0.98), rgba(3, 8, 18, 0.98));
          border: 1px solid rgba(125, 211, 252, 0.18);
          border-radius: 18px;
          box-shadow: 0 34px 90px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .ps-modal-backdrop {
          background: rgba(2, 6, 23, 0.78);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }
        .ps-modal-layout {
          display: grid;
          grid-template-columns: minmax(260px, 0.9fr) minmax(0, 1.1fr);
          min-height: 520px;
        }
        .ps-modal-visual {
          position: relative;
          overflow: hidden;
          min-height: 520px;
          background: rgba(2, 6, 23, 0.44);
        }
        .ps-modal-visual::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(2, 6, 23, 0.92), transparent 58%);
          pointer-events: none;
        }
        .ps-modal-kicker {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.45rem;
          margin-bottom: 0.9rem;
        }
        .ps-modal-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          min-height: 24px;
          padding: 0 0.58rem;
          border-radius: 999px;
          color: #cbd5e1;
          background: rgba(15, 23, 42, 0.74);
          border: 1px solid rgba(125, 211, 252, 0.14);
          font-size: 0.66rem;
          font-weight: 750;
        }
        .ps-modal-title {
          color: #f8fafc;
          font-size: clamp(1.65rem, 4.2vw, 2.7rem);
          line-height: 1.05;
          font-weight: 820;
          letter-spacing: 0;
          margin: 0 0 1rem;
        }
        .ps-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 4;
          width: 38px;
          height: 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          color: #e2e8f0;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(125, 211, 252, 0.16);
        }
        .ps-modal-close:hover {
          background: rgba(34, 211, 238, 0.1);
          border-color: rgba(34, 211, 238, 0.26);
        }
        .ps-modal-visual-caption {
          position: absolute;
          left: 1.25rem;
          right: 1.25rem;
          bottom: 1.25rem;
          z-index: 2;
        }
        .ps-modal-visual-caption span {
          display: block;
          color: rgba(203, 213, 225, 0.76);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          margin-top: 0.55rem;
        }
        .ps-modal-body {
          padding: clamp(1.35rem, 4vw, 2.25rem);
          overflow-y: auto;
          min-height: 0;
        }
        .ps-modal-desc {
          color: var(--color-text-sub);
          line-height: 1.82;
          font-size: 1rem;
          margin: 0;
        }
        .ps-modal-side {
          margin-top: 1.35rem;
          padding: 1rem;
          border-radius: 14px;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(125, 211, 252, 0.12);
        }
        .ps-modal-label {
          color: var(--color-text-muted);
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 760;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 0.8rem;
        }
        .ps-modal-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.7rem;
          margin-top: 1.35rem;
          padding-top: 1.2rem;
          border-top: 1px solid rgba(125, 211, 252, 0.12);
        }
        .ps-modal-actions .btn {
          flex: 1 1 170px;
          min-height: 44px;
        }
        .ps-search-input {
          background: rgba(2, 6, 23, 0.54) !important;
          border: 1px solid rgba(125, 211, 252, 0.18) !important;
          color: var(--color-text) !important;
          border-radius: 30px !important;
          transition: all 0.3s ease;
        }
        .ps-search-input:focus {
          background: rgba(2, 6, 23, 0.68) !important;
          border-color: rgba(34, 211, 238, 0.42) !important;
          box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.1) !important;
        }
        .ps-btn-primary {
          background: linear-gradient(135deg, #67e8f9 0%, #38bdf8 52%, #a78bfa 100%);
          color: #020617;
          border: none;
          font-weight: 600;
        }
        .ps-btn-primary:hover {
          background: linear-gradient(135deg, #cffafe 0%, #7dd3fc 52%, #c4b5fd 100%);
          color: #020617;
        }
        @media (max-width: 767.98px) {
          .ps-rail {
            gap: 0.95rem;
            padding: 0.1rem 0.8rem 1rem 0;
            scroll-padding-inline: 0;
          }
          .ps-mobile-hint {
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
          .ps-rail-item {
            flex-basis: min(84vw, 326px);
          }
          .ps-rail-controls {
            gap: 0.75rem;
          }
          .ps-rail-btn {
            width: 38px;
            height: 38px;
          }
          .ps-showcase-stats {
            width: 100%;
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
          .ps-stat {
            min-height: 66px;
            padding: 0.68rem;
          }
          .ps-stat strong {
            font-size: 1.05rem;
          }
          .ps-stat span {
            font-size: 0.66rem;
          }
          .ps-category-pill {
            padding: 7px 13px;
            font-size: 0.76rem;
          }
          .ps-modal-layout {
            grid-template-columns: 1fr auto;
          }
          .ps-modal-layout {
            display: block;
            min-height: 0;
          }
          .ps-modal-visual {
            min-height: 230px;
            height: 230px;
          }
          .ps-modal-body {
            max-height: calc(100dvh - 280px);
          }
          .ps-modal-title {
            font-size: 1.45rem;
          }
        }
      `}</style>

      <section id="projects" className="section section-alt" style={{ background: 'var(--color-bg)' }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="mb-5">
            <div className="row g-4 align-items-end">
              <div className="col-lg-7">
                <div className="section-tag"><Layers size={13} /> Selected Works</div>
                <h2 className="section-title">Projects Showcase</h2>
                <p className="section-subtitle mb-0">
                  {projects.length > 0 ? `A curated look at ${projects.length} practical builds, from web systems to mobile experiments.` : 'A selection of projects showcasing skills across different domains.'}
                </p>
              </div>
              <div className="col-lg-5">
                <div className="ps-showcase-stats ms-lg-auto">
                  <div className="ps-stat">
                    <strong>{projects.length}</strong>
                    <span>Projects</span>
                  </div>
                  <div className="ps-stat">
                    <strong>{featuredCount}</strong>
                    <span>Featured</span>
                  </div>
                  <div className="ps-stat">
                    <strong>{techCount}</strong>
                    <span>Tech Used</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: 0.2 }}
            className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-4 mb-5">
            <div className="d-flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`ps-category-pill ${activeCategory === cat ? 'active' : ''}`}
                  id={`projects-filter-${cat}`}>
                  {cat === 'All' ? <Layers size={14} /> : (() => {
                    const meta = getCategoryMeta(cat)
                    const Icon = meta.icon
                    return <Icon size={14} />
                  })()}
                  {cat === 'All' ? 'All' : getCategoryMeta(cat).label}
                </button>
              ))}
            </div>
            <div className="search-field" style={{ minWidth: 260 }}>
              <Search size={16} className="search-field-icon" />
              <input type="search" placeholder="Search projects or tech..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="form-control ps-search-input search-field-input" style={{ height: 44 }} id="projects-search" />
            </div>
          </motion.div>

          {filtered.length === 0 ? (
            <motion.div layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="text-center py-5 w-100"
              style={{ border: '1px dashed rgba(125,211,252,0.18)', borderRadius: 18, color: 'var(--color-text-muted)', background: 'rgba(2,6,23,0.28)' }}>
              <Layers size={40} className="mb-3 opacity-50 d-block mx-auto" />
              <p className="mb-0" style={{ fontSize: '1.1rem' }}>No projects match your current filters.</p>
            </motion.div>
          ) : (
            <div className="ps-rail-shell">
              {filtered.length > 1 && (
                <div className="ps-mobile-hint" aria-hidden="true">
                  Swipe projects <ArrowRight size={14} />
                </div>
              )}

              <motion.div
                layout
                ref={railRef}
                className="ps-rail"
                onScroll={updateRailProgress}
                aria-label="Project showcase carousel"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((p, i) => (
                    <ProjectCard key={p.id} project={p} i={i} onClick={() => setSelected(p)} />
                  ))}
                </AnimatePresence>
              </motion.div>

              <div className="ps-rail-controls" aria-label="Project carousel controls">
                <div className="ps-rail-progress" aria-hidden="true">
                  <span style={{ '--ps-progress': `${railProgress}%` } as React.CSSProperties} />
                </div>
                <div className="ps-rail-buttons">
                  <button type="button" className="ps-rail-btn" onClick={() => scrollRail('prev')} aria-label="Previous projects">
                    <ArrowLeft size={18} />
                  </button>
                  <button type="button" className="ps-rail-btn" onClick={() => scrollRail('next')} aria-label="Next projects">
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.title} project details`}
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 p-md-4 overlay-scroll-lock ps-modal-backdrop"
            style={{ zIndex: 1060, overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
            onClick={() => setSelected(null)}>
            
            <motion.div initial={{ scale: 0.95, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }} transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              data-lenis-prevent
              className="ps-modal-glass w-100"
              style={{ maxWidth: 980, maxHeight: 'calc(100dvh - 2rem)', overflow: 'hidden' }}
              onClick={(e) => e.stopPropagation()}>

              <button type="button" aria-label="Close project details" onClick={() => setSelected(null)} className="ps-modal-close">
                <X size={19} />
              </button>

              <div className="ps-modal-layout">
                <div className="ps-modal-visual">
                  {selected.thumbnail_url ? (
                    <Image src={selected.thumbnail_url} alt={selected.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 980px) 45vw, 420px" priority unoptimized />
                  ) : (
                    <ProjectVisual project={selected} />
                  )}
                  <div className="ps-modal-visual-caption">
                    <span className="ps-modal-pill text-uppercase">{selected.category}</span>
                    <span>{selected.tech_stack.slice(0, 3).join(' / ')}</span>
                  </div>
                </div>

                <div className="ps-modal-body overlay-scroll-lock">
                  <div className="ps-modal-kicker">
                    <span className="ps-modal-pill text-uppercase">{selected.category}</span>
                    {selected.is_featured && <span className="ps-modal-pill"><Star size={12} style={{ fill: 'currentColor' }} /> Featured</span>}
                  </div>

                  <h2 className="ps-modal-title">{selected.title}</h2>

                  <div className="ps-modal-label">Project Overview</div>
                  <p className="ps-modal-desc">{selected.long_description || selected.short_description}</p>

                  <div className="ps-modal-side">
                    <div className="ps-modal-label">Tech Stack</div>
                    <div className="d-flex flex-wrap gap-2">
                      {selected.tech_stack.map((t) => <span key={t} className="ps-tech-badge">{t}</span>)}
                    </div>
                  </div>

                  <div className="ps-modal-actions">
                    {selected.live_url && (
                      <a href={selected.live_url} target="_blank" rel="noopener noreferrer" className="btn ps-btn-primary d-flex align-items-center justify-content-center gap-2" style={{ padding: '11px', borderRadius: 10 }}>
                        <ExternalLink size={18} /> Visit Live Site
                      </a>
                    )}
                    {selected.github_url && (
                      <a href={selected.github_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light d-flex align-items-center justify-content-center gap-2" style={{ padding: '11px', borderRadius: 10, borderColor: 'rgba(125,211,252,0.24)', color: 'var(--color-text)' }}>
                        <FaGithub size={18} /> View Source Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
