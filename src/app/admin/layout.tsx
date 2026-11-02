import type { Metadata } from 'next'
import '../globals.css'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminMainContent from '@/components/admin/AdminMainContent'
import AdminAuthGuard from '@/components/admin/AdminAuthGuard'
import AdminAnimations from '@/components/admin/AdminAnimations'
import { SidebarProvider } from '@/lib/contexts/SidebarContext'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: { default: 'Admin Dashboard', template: '%s | Admin - Portfolio CMS' },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminAuthGuard>
        <AdminAnimations />
        <div className="admin-shell" style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
          <AdminSidebar />
          <AdminMainContent>
            {children}
          </AdminMainContent>
        </div>
      </AdminAuthGuard>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: 'var(--font-outfit, system-ui)',
            background: '#0E0B02',
            border: '1px solid var(--admin-border)',
            color: '#fdf8ec',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          },
        }}
      />
    </SidebarProvider>
  )
}
