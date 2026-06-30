'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function VisitorTracker() {
  const pathname = usePathname()
  const hasFiredForPath = useRef<string | null>(null)

  useEffect(() => {
    // Only fire once per path change
    if (hasFiredForPath.current === pathname) return
    hasFiredForPath.current = pathname

    // Ensure we don't track admin pages
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) return

    const trackVisit = async () => {
      try {
        const screen = typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'Unknown'
        const language = typeof navigator !== 'undefined' ? navigator.language : 'Unknown'
        const timezone = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Unknown'

        await fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'page_view',
            page: pathname,
            referrer: document.referrer || null,
            screen,
            language,
            timezone
          }),
        })
      } catch {
        // Silently fail — expected when ad blockers are active
      }
    }

    // Delay slightly so it doesn't block critical rendering path
    const timeoutId = setTimeout(trackVisit, 1000)
    return () => clearTimeout(timeoutId)
  }, [pathname])

  return null
}
