'use client'

import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSidebar } from '@/lib/contexts/SidebarContext'

const W_EXPANDED = 256
const W_COLLAPSED = 0

export default function AdminMainContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) return <>{children}</>

  return (
    <main
      className="admin-main"
      style={{
        flex: 1,
        minHeight: '100vh',
        // Only apply margin on desktop — sidebar is overlay on mobile
        marginLeft: 0,
        minWidth: 0,
        // Prevent overflow on small screens
        overflowX: 'hidden',
      }}
    >
      {/* Inline responsive margin applied via CSS var so SSR safe */}
      <style>{`
        @media (min-width: 992px) {
          .admin-main {
            margin-left: ${collapsed ? W_COLLAPSED : W_EXPANDED}px !important;
          }
        }
      `}</style>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          className="admin-route-frame"
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          style={{ minHeight: '100vh' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
