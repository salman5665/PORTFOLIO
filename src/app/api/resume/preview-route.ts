import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: profiles } = await supabase
      .from('profiles')
      .select('resume_url')
      .order('updated_at', { ascending: false })
      .limit(1)

    const resumeUrl = profiles?.[0]?.resume_url

    if (!resumeUrl) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    const res = await fetch(resumeUrl)

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 })
    }

    const buffer = await res.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Salman-Resume.pdf"',
        'Cache-Control': 'no-cache',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

