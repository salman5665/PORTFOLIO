'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

// Pages that don't need auth
const PUBLIC_PATHS = ['/admin/login']

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)
  const isPublic = PUBLIC_PATHS.includes(pathname)

  useEffect(() => {
    if (isPublic) { setChecked(true); return }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`)
      } else {
        setChecked(true)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && !PUBLIC_PATHS.includes(pathname)) {
        router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`)
      }
    })

    return () => subscription.unsubscribe()
  }, [pathname, isPublic, router])

  if (!checked && !isPublic) {
    return (
      <div className="d-flex align-items-center justify-content-center admin-login-screen" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border mb-3" role="status" style={{ color: '#22d3ee', width: 36, height: 36 }}>
            <span className="visually-hidden">Checking auth...</span>
          </div>
          <p style={{ color: 'var(--admin-text-sub)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>Verifying session...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
