import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(req: NextRequest) {
  try {
    const isPreview = req.nextUrl.searchParams.get('preview') === 'true'
    let pdfUrl: string | null = null

    // 1. Priority: Check profiles.resume_url in Database
    const { data: profiles } = await supabase
      .from('profiles')
      .select('resume_url')
      .order('updated_at', { ascending: false })
      .limit(1)

    if (profiles && profiles.length > 0 && profiles[0].resume_url) {
      pdfUrl = profiles[0].resume_url
    }

    // 2. Priority: If no DB url, check 'resumes' storage bucket
    if (!pdfUrl) {
      const { data, error } = await supabase.storage.from('resumes').list('', {
        limit: 10,
        sortBy: { column: 'created_at', order: 'desc' },
      })

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
    }

    // 3. Priority: Fallback to local resume.pdf
    if (!pdfUrl) {
      const origin = req.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      pdfUrl = `${origin}/resume.pdf`
    }

    // Direct redirect if external URL or fetch & stream PDF
    if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
      // Fetch the PDF server-side to serve cleanly without CORS
      const pdfRes = await fetch(pdfUrl, { cache: 'no-store' })

      if (pdfRes.ok) {
        const buffer = await pdfRes.arrayBuffer()
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': isPreview
              ? 'inline'
              : 'attachment; filename="Vinit-Soni-Resume.pdf"',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        })
      } else {
        // If fetch fails, redirect directly to the URL
        return NextResponse.redirect(pdfUrl)
      }
    }

    return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
  } catch (error) {
    console.error('Resume error:', error)
    return NextResponse.json({ error: 'Failed to load resume' }, { status: 500 })
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Use GET to download resume' }, { status: 405 })
}
