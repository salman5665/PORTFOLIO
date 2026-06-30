import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(req: NextRequest) {
  try {
    const isPreview = req.nextUrl.searchParams.get('preview') === 'true'

    // Fetch latest file from 'resumes' bucket
    const { data, error } = await supabase.storage.from('resumes').list('', {
      limit: 10,
      sortBy: { column: 'created_at', order: 'desc' },
    })

    let pdfUrl: string | null = null

    if (!error && data && data.length > 0) {
      const validFiles = data.filter(
        (f) => f.name !== '.emptyFolderPlaceholder' && f.name !== '.keep'
      )

      if (validFiles.length > 0) {
        const latestFile = validFiles[0]
        const { data: urlData } = supabase.storage
          .from('resumes')
          .getPublicUrl(latestFile.name)
        pdfUrl = urlData.publicUrl
      }
    }

    // Fallback to local resume.pdf
    if (!pdfUrl) {
      const origin = req.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      pdfUrl = `${origin}/resume.pdf`
    }

    // ✅ Fetch the PDF server-side (avoids cross-origin in the browser)
    const pdfRes = await fetch(pdfUrl)

    if (!pdfRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 })
    }

    const buffer = await pdfRes.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        // inline = preview in iframe, attachment = triggers download
        'Content-Disposition': isPreview
          ? 'inline'
          : 'attachment; filename="Vinit-Soni-Resume.pdf"',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Resume error:', error)
    return NextResponse.json({ error: 'Failed to load resume' }, { status: 500 })
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Use GET to download resume' }, { status: 405 })
}
