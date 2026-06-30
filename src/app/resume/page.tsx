import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Download, ArrowLeft, FileText, Calendar, Star } from 'lucide-react'
import Link from 'next/link'
import PdfViewer from '@/components/PdfViewer'

export const dynamic = 'force-dynamic'

export default async function ResumePage() {
  const supabase = createServerClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('resume_url')
    .order('updated_at', { ascending: false })
    .limit(1)

  const profile = profiles?.[0]

  if (!profile?.resume_url) {
    redirect('/')
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#020817',
        fontFamily: 'inherit',
        overflowX: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 40% at 50% -10%, rgba(14,165,233,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(124,58,237,0.05) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        {/* ── Navbar ── */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 0',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#64748b',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </Link>

          <span
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #e2e8f0, #0ea5e9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Vinit.dev
          </span>

          <a
            href="/api/resume"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(14,165,233,0.1)',
              border: '1px solid rgba(14,165,233,0.25)',
              color: '#0ea5e9',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            <Download size={14} />
            Download
          </a>
        </nav>

        {/* ── Hero ── */}
        <div style={{ paddingTop: 64, paddingBottom: 48, textAlign: 'center' }}>

          {/* Label */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(14,165,233,0.08)',
              border: '1px solid rgba(14,165,233,0.2)',
              borderRadius: 999,
              padding: '6px 16px',
              marginBottom: 24,
            }}
          >
            <FileText size={13} color="#0ea5e9" />
            <span
              style={{
                color: '#0ea5e9',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              // Resume
            </span>
          </div>

          {/* ✅ Simple English heading */}
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              margin: '0 0 16px',
              background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 40%, #0ea5e9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            My Resume
          </h1>

          <p
            style={{
              color: '#64748b',
              fontSize: '1.05rem',
              maxWidth: 500,
              margin: '0 auto 32px',
              lineHeight: 1.6,
            }}
          >
            A look into my experience, skills, and academic journey as a Full-Stack Developer.
          </p>

          {/* Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 36,
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 999,
                padding: '5px 14px',
                color: '#10b981',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#10b981',
                  display: 'inline-block',
                  boxShadow: '0 0 6px #10b981',
                }}
              />
              Available for Opportunities
            </span>

            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 999,
                padding: '5px 14px',
                color: '#94a3b8',
                fontSize: '0.8rem',
              }}
            >
              <Calendar size={12} />
              Updated 2026
            </span>

            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 999,
                padding: '5px 14px',
                color: '#94a3b8',
                fontSize: '0.8rem',
              }}
            >
              <FileText size={12} />
              PDF Format
            </span>
          </div>

          {/* Download CTA */}
          <a
            href="/api/resume"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)',
              color: '#fff',
              textDecoration: 'none',
              padding: '14px 32px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: '0 0 32px rgba(14,165,233,0.3), 0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            <Download size={18} />
            Download Resume
          </a>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.3), transparent)',
            marginBottom: 40,
          }}
        />

        {/* ── PDF Viewer ── */}
        <div
          style={{
            borderRadius: 20,
            overflow: 'hidden',
            border: '1px solid rgba(14,165,233,0.15)',
            boxShadow: '0 0 60px rgba(14,165,233,0.08), 0 32px 80px rgba(0,0,0,0.5)',
            marginBottom: 60,
            // ✅ height follows content, no empty space
            height: 'auto',
          }}
        >
          {/* Toolbar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 20px',
              background: 'rgba(255,255,255,0.02)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ef4444', '#f59e0b', '#10b981'].map((c) => (
                  <div
                    key={c}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: c,
                      opacity: 0.7,
                    }}
                  />
                ))}
              </div>
              <span style={{ color: '#475569', fontSize: '0.78rem', marginLeft: 8 }}>
                Vinit-Soni-Resume.pdf
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Star size={12} color="#f59e0b" />
              <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
                Full-Stack Developer · MCA
              </span>
            </div>
          </div>

          <PdfViewer url="/api/resume?preview=true" />
        </div>
      </div>
    </main>
  )
}
