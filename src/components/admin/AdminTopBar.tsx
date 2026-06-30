'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Home } from 'lucide-react'
import { useSidebar } from '@/lib/contexts/SidebarContext'

interface TopBarProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export default function AdminTopBar({ title, subtitle, action }: TopBarProps) {
  const { collapsed, setCollapsed, setMobileOpen } = useSidebar()
  const pathname = usePathname()

  const segments = pathname.split('/').filter(Boolean)

  return (
    <div className="admin-topbar admin-glass-topbar" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="d-flex align-items-center gap-3 w-100">
        {/* Mobile hamburger */}
        <button
          onClick={() => {
            if (window.innerWidth >= 992) {
              setCollapsed(!collapsed)
            } else {
              setMobileOpen(true)
            }
          }}
          className={`d-flex align-items-center justify-content-center flex-shrink-0 ${!collapsed ? 'd-lg-none' : ''}`}
          aria-label="Open sidebar"
          style={{
            width: 36, height: 36, borderRadius: 10,
            border: '1px solid var(--admin-border)', background: 'var(--admin-surface)',
            color: 'var(--admin-text-sub)', cursor: 'pointer', flexShrink: 0,
          }}
        >
          <Menu size={18} />
        </button>

        {/* Title + breadcrumb */}
        <div className="flex-grow-1 min-w-0">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="d-none d-sm-block">
            <ol className="breadcrumb mb-0" style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
              <li className="breadcrumb-item">
                <Link href="/admin" style={{ color: 'var(--admin-text-sub)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Home size={11} /> Admin
                </Link>
              </li>
              {segments.slice(1).map((seg, i) => {
                const href = '/' + segments.slice(0, i + 2).join('/')
                const label = seg.charAt(0).toUpperCase() + seg.slice(1)
                const isLast = i === segments.length - 2
                return (
                  <li key={href} className={`breadcrumb-item${isLast ? ' active' : ''}`}
                    style={{ color: isLast ? 'var(--admin-text)' : 'var(--admin-text-sub)' }}>
                    {isLast ? label : <Link href={href} style={{ color: 'var(--admin-text-sub)', textDecoration: 'none' }}>{label}</Link>}
                  </li>
                )
              })}
            </ol>
          </nav>
          <div className="d-flex align-items-baseline gap-2 flex-wrap">
            <h1 style={{ fontWeight: 800, fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', color: 'var(--admin-text)', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2 }}>
              {title}
            </h1>
            {subtitle && (
              <span style={{ color: 'var(--admin-text-sub)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Action slot */}
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  )
}
