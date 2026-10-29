'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FolderOpen, Code2, Briefcase, GraduationCap,
  Award, MessageSquare, FileText, Quote, Settings, Image,
  LogOut, ChevronRight, X, User, Milestone
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useSidebar } from '@/lib/contexts/SidebarContext'
import { useBodyScrollLock } from '@/lib/hooks/useBodyScrollLock'
import { toast } from 'sonner'
import { adminDb } from '@/lib/adminDb'

const NAV = [
  {
    label: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
      { icon: MessageSquare, label: 'Messages', href: '/admin/messages', badge: true },
    ],
  },
  {
    label: 'Content',
    items: [
      { icon: FolderOpen, label: 'Projects', href: '/admin/projects' },
      { icon: Code2, label: 'Skills', href: '/admin/skills' },
      { icon: Briefcase, label: 'Experience', href: '/admin/experience' },
      { icon: GraduationCap, label: 'Education', href: '/admin/education' },
      { icon: Milestone, label: 'Journey', href: '/admin/journey' },
      { icon: Award, label: 'Certificates', href: '/admin/certificates' },
      { icon: Quote, label: 'Testimonials', href: '/admin/testimonials' },
      { icon: FileText, label: 'Blog', href: '/admin/blog' },
    ],
  },
  {
    label: 'System',
    items: [
      { icon: Image, label: 'Media', href: '/admin/media' },
      { icon: Settings, label: 'Settings', href: '/admin/settings' },
    ],
  },
]

const W_EXPANDED = 256
const W_COLLAPSED = 0

function NavItem({ item, collapsed, active, unreadMessages, onClick }: {
  item: { icon: React.ComponentType<any>; label: string; href: string; badge?: boolean }
  collapsed: boolean; active: boolean; unreadMessages: number; onClick?: () => void
}) {
  const showUnreadBadge = item.badge && unreadMessages > 0

  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className="d-flex align-items-center gap-3 rounded-3 mb-1 text-decoration-none position-relative"
      style={{
        padding: collapsed ? '10px 0' : '9px 14px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        background: active ? 'rgba(34,211,238,0.12)' : 'transparent',
        color: active ? '#67e8f9' : 'var(--admin-text-sub)',
        fontWeight: active ? 600 : 500,
        fontSize: '0.875rem',
        transition: 'all 0.15s ease',
        borderLeft: active ? '3px solid #22d3ee' : '3px solid transparent',
      }}
      onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = 'var(--admin-border)' } }}
      onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--admin-text-sub)' } }}
    >
      <item.icon size={17} style={{ flexShrink: 0 }} />
      {!collapsed && <span className="flex-grow-1 text-truncate">{item.label}</span>}
      {!collapsed && showUnreadBadge && (
        <span
          aria-label={`${unreadMessages} unread message${unreadMessages === 1 ? '' : 's'}`}
          style={{
            minWidth: unreadMessages > 9 ? 22 : 18,
            height: 18,
            padding: '0 5px',
            borderRadius: 999,
            background: '#ef4444',
            color: '#fff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '0.65rem',
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          {unreadMessages > 99 ? '99+' : unreadMessages}
        </span>
      )}
      {collapsed && showUnreadBadge && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 8,
            right: 10,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#ef4444',
            border: '2px solid #030a16',
          }}
        />
      )}
    </Link>
  )
}

function SidebarInner({ collapsed, setCollapsed, onNavClick }: {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  onNavClick?: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [unreadMessages, setUnreadMessages] = useState(0)

  const isActive = (href: string) =>
    pathname === href || (href !== '/admin' && pathname.startsWith(href))

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/admin/login')
  }

  useEffect(() => {
    let mounted = true

    const loadUnreadMessages = async () => {
      const { data, error } = await adminDb.from('messages').select({
        select: 'id',
        where: { is_read: false },
        limit: 1000,
      })

      if (!mounted) return
      if (error) {
        setUnreadMessages(0)
        return
      }
      setUnreadMessages(data?.length ?? 0)
    }

    loadUnreadMessages()

    const handleFocus = () => loadUnreadMessages()
    const handleMessagesUpdated = () => loadUnreadMessages()
    window.addEventListener('focus', handleFocus)
    window.addEventListener('admin-messages-updated', handleMessagesUpdated)
    return () => {
      mounted = false
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('admin-messages-updated', handleMessagesUpdated)
    }
  }, [pathname])

  return (
    <div className="d-flex flex-column h-100" style={{ minHeight: 0 }}>
      {/* Brand */}
      <div className="admin-sidebar-brand" style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(125,211,252,0.14)', flexShrink: 0 }}>
        <div className="d-flex align-items-center gap-3">
          <div className="admin-brand-mark d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #67e8f9, #38bdf8 52%, #8b5cf6)', borderRadius: 10 }}>
            <Code2 size={18} color="var(--admin-surface)" />
          </div>
          {!collapsed && (
            <>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--admin-text)', fontSize: '0.95rem', lineHeight: 1.2, whiteSpace: 'nowrap' }}>Salman</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--admin-text-sub)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>Content Management</div>
              </div>
              <button onClick={() => setCollapsed(true)} title="Collapse" aria-label="Collapse sidebar"
                className="d-none d-lg-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid rgba(125,211,252,0.18)', background: 'transparent', color: 'var(--admin-text-sub)', cursor: 'pointer' }}>
                <ChevronRight size={13} style={{ transform: 'rotate(180deg)' }} />
              </button>
            </>
          )}
          {collapsed && (
            <button onClick={() => setCollapsed(false)} title="Expand" aria-label="Expand sidebar"
              className="d-none d-lg-flex align-items-center justify-content-center"
              style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid rgba(125,211,252,0.18)', background: 'transparent', color: 'var(--admin-text-sub)', cursor: 'pointer', marginLeft: 'auto' }}>
              <ChevronRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav
        data-lenis-prevent
        className="admin-sidebar-nav flex-grow-1 overflow-auto py-2 px-2"
        style={{ scrollbarWidth: 'none', minHeight: 0, overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
      >
        {NAV.map((section, si) => (
          <div key={section.label} className={si > 0 ? 'mt-2' : ''}>
            {!collapsed ? (
              <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.13em', color: 'var(--admin-text-sub)', fontFamily: 'var(--font-mono)', fontWeight: 700, padding: '8px 14px 4px' }}>
                {section.label}
              </div>
            ) : si > 0 ? (
              <div style={{ height: 1, background: 'rgba(125,211,252,0.14)', margin: '8px 10px' }} />
            ) : null}
            {section.items.map(item => (
              <NavItem
                key={item.href}
                item={item}
                collapsed={collapsed}
                active={isActive(item.href)}
                unreadMessages={unreadMessages}
                onClick={onNavClick}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="admin-sidebar-footer" style={{ borderTop: '1px solid rgba(125,211,252,0.14)', padding: '12px 10px 10px', flexShrink: 0 }}>
        {!collapsed && (
          <div className="d-flex align-items-center gap-2 rounded-3 mb-2 px-2 py-2"
            style={{ background: 'rgba(15,23,42,0.58)', border: '1px solid rgba(125,211,252,0.14)' }}>
            <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 position-relative"
              style={{ width: 32, height: 32, background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.3)' }}>
              <User size={15} color="#67e8f9" />
              <span style={{ position: 'absolute', bottom: -1, right: -1, width: 9, height: 9, borderRadius: '50%', background: '#14b8a6', border: '2px solid #020617' }} />
            </div>
            <div className="overflow-hidden flex-grow-1">
              <div style={{ fontWeight: 600, color: 'var(--admin-text)', fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Admin</div>
              <div style={{ fontSize: '0.67rem', color: 'var(--admin-text-sub)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Administrator</div>
            </div>
          </div>
        )}
        <button onClick={handleLogout} id="admin-logout" title={collapsed ? 'Sign out' : undefined}
          className="d-flex align-items-center gap-3 rounded-3 w-100 border-0"
          style={{
            background: 'transparent', color: 'var(--admin-text-sub)', padding: collapsed ? '10px 0' : '9px 14px',
            fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s ease',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'; (e.currentTarget as HTMLElement).style.color = '#f87171' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--admin-text-sub)' }}>
          <LogOut size={17} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  )
}

export default function AdminSidebar() {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar()
  const pathname = usePathname()
  useBodyScrollLock(mobileOpen)

  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false) }, [pathname, setMobileOpen])

  if (pathname === '/admin/login') return null

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <motion.aside
        className="admin-sidebar d-none d-lg-flex flex-column"
        animate={{ width: collapsed ? W_COLLAPSED : W_EXPANDED }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        style={{ overflow: 'hidden', flexShrink: 0 }}
      >
        <SidebarInner collapsed={collapsed} setCollapsed={setCollapsed} />
      </motion.aside>

      {/* ── Mobile Backdrop ──────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="d-lg-none position-fixed top-0 start-0 w-100 h-100"
            style={{ zIndex: 1049, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile Sidebar ───────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            data-lenis-prevent
            initial={{ x: -W_EXPANDED - 20 }} animate={{ x: 0 }} exit={{ x: -W_EXPANDED - 20 }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            className="admin-sidebar d-lg-none position-fixed top-0 start-0 h-100 overlay-scroll-lock"
            style={{ width: W_EXPANDED, height: '100dvh', maxHeight: '100dvh', zIndex: 1050, overflow: 'hidden', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
          >
            {/* Close button */}
            <button onClick={() => setMobileOpen(false)} aria-label="Close sidebar"
              className="position-absolute d-flex align-items-center justify-content-center"
              style={{ top: 14, right: 14, width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--admin-border)', cursor: 'pointer', zIndex: 10 }}>
              <X size={16} />
            </button>
            <SidebarInner collapsed={false} setCollapsed={() => { }} onNavClick={() => setMobileOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

