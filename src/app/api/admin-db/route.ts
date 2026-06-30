import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

// Allowed tables for admin writes
const ALLOWED_TABLES = [
  'profiles', 'skills', 'projects', 'experiences', 'education',
  'certificates', 'testimonials', 'blog_posts', 'media', 'messages',
  'analytics_events', 'ai_chat_logs', 'settings'
]

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '')
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const authClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )
    const { data: { user }, error: authError } = await authClient.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const allowedEmails = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
    if (allowedEmails.length > 0 && !allowedEmails.includes((user.email || '').toLowerCase())) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { table, action, data, id, where } = body

    if (!ALLOWED_TABLES.includes(table)) {
      return NextResponse.json({ error: 'Table not allowed' }, { status: 400 })
    }

    const db = createServerClient()
    let result

    switch (action) {
      case 'select': {
        let q = db.from(table).select(data?.select || '*')
        if (where) {
          for (const [col, val] of Object.entries(where)) {
            q = (q as any).eq(col, val)
          }
        }
        if (data?.order) q = (q as any).order(data.order, { ascending: data.ascending !== false })
        if (data?.limit) q = (q as any).limit(data.limit)
        if (data?.single) q = (q as any).single()
        result = await q
        break
      }
      case 'insert': {
        result = await db.from(table).insert(data).select()
        break
      }
      case 'update': {
        result = await db.from(table).update(data).eq('id', id).select()
        break
      }
      case 'delete': {
        result = await db.from(table).delete().eq('id', id)
        break
      }
      case 'upsert': {
        result = await db.from(table).upsert(data).select()
        break
      }
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    if (result.error) {
      console.error('[admin-db API] Supabase error:', result.error)
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ data: result.data })
  } catch (err: any) {
    console.error('[admin-db API] Error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
