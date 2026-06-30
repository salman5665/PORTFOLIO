import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const { event_type, page, metadata } = await req.json()
    const supabase = createAdminClient()

    await supabase.from('analytics_events').insert({
      event_type,
      page,
      metadata: metadata || {},
      user_agent: req.headers.get('user-agent') || '',
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
