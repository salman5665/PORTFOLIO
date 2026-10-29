import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { buildContactConfirmationEmail, buildContactEmail } from '@/lib/emailTemplates'

const getRequestBaseUrl = (req: NextRequest) => {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host')
  const protocol = req.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https')
  return host ? `${protocol}://${host}` : 'https://salman.dev'
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    const name = String(payload.name || '').trim()
    const email = String(payload.email || '').trim()
    const subject = String(payload.subject || '').trim()
    const body = String(payload.body || '').trim()

    if (!name || !email || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const cleanSubject = subject || 'No subject'
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'
    const siteUrl = getRequestBaseUrl(req).replace(/\/$/, '')
    const logoUrl = `${siteUrl}/apple-touch-icon.png`

    // Save to database
    const { error: dbError } = await supabase
      .from('messages')
      .insert({
        name,
        email,
        subject: cleanSubject,
        body,
        ip_address: ipAddress,
      })

    if (dbError) {
      console.error('DB error:', dbError)
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
    }

    // Send email notification via Resend (if configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        const receivedAt = new Date().toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
          timeZone: 'Asia/Kolkata',
        })
        const messagesUrl = `${siteUrl}/messages`
        const inboxUrl = `${siteUrl}/admin/messages`
        const emailContent = buildContactEmail({
          name,
          email,
          subject: cleanSubject,
          body,
          receivedAt,
          ipAddress,
          userAgent,
          messagesUrl,
          inboxUrl,
          logoUrl,
        })
        const confirmationContent = buildContactConfirmationEmail({
          name,
          subject: cleanSubject,
          receivedAt,
          siteUrl,
          logoUrl,
        })

        await Promise.all([
          resend.emails.send({
            from: 'Salman <onboarding@resend.dev>',
            to: process.env.CONTACT_EMAIL_TO || 'contact@salman.dev',
            replyTo: email,
            subject: `New portfolio message from ${name}: ${cleanSubject}`,
            text: emailContent.text,
            html: emailContent.html,
          }),
          resend.emails.send({
            from: 'Salman <onboarding@resend.dev>',
            to: email,
            replyTo: process.env.CONTACT_EMAIL_TO || 'contact@salman.dev',
            subject: `Thanks for contacting me, ${name}`,
            text: confirmationContent.text,
            html: confirmationContent.html,
          }),
        ])
      } catch (emailErr) {
        console.warn('Email notification failed (non-critical):', emailErr)
      }
    }

    // Track analytics (fire and forget)
    void supabase.from('analytics_events').insert({
      event_type: 'contact_submit',
      page: '/',
      metadata: { name, email_domain: email.split('@')[1] },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


