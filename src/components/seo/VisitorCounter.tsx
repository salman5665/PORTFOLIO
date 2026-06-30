'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    const incrementVisitor = async () => {
      // Very simple visitor counter relying on edge function or RPC.
      // Since we don't have an RPC set up in the SQL yet, we'll use our analytics table
      
      const sessionKey = 'has_visited_vinit_portfolio'
      const hasVisited = sessionStorage.getItem(sessionKey)

      if (!hasVisited) {
        // Log new visitor with correct event_type field
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_type: 'page_view', page: '/', metadata: {} })
        })
        sessionStorage.setItem(sessionKey, 'true')
      }

      // Fetch total unique visitors (approximation using analytics table counts)
      const { count: visitorCount } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'page_view')

      setCount(visitorCount || 1)
    }

    incrementVisitor()
  }, [])

  if (count === null) return null

  return (
    <div className="flex items-center gap-2 text-white/40 text-xs font-mono bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
      <Eye size={12} className="text-cyan-400" />
      <span>{count.toLocaleString()} Views</span>
    </div>
  )
}
