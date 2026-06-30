import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { buildVisitorEmail } from '@/lib/emailTemplates'

const getRequestBaseUrl = (req: NextRequest) => {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host')
  const protocol = req.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https')
  return host ? `${protocol}://${host}` : 'https://vinitsoni.vercel.app'
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event_type, page, referrer, screen, language, timezone } = body
    
    // Get headers
    const userAgent = req.headers.get('user-agent') || 'Unknown'
    const ipAddress = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown').split(',')[0].trim()
    let country = req.headers.get('x-vercel-ip-country') || 'Unknown Country'
    let city = req.headers.get('x-vercel-ip-city') || 'Unknown City'
    let isp = 'Unknown ISP'
    let org = 'Unknown Org'
    
    // Attempt deep IP lookup for Company/ISP info
    if (ipAddress && ipAddress !== 'Unknown' && ipAddress !== '::1' && ipAddress !== '127.0.0.1') {
      try {
        const ipRes = await fetch(`http://ip-api.com/json/${ipAddress}?fields=country,city,isp,org`)
        if (ipRes.ok) {
          const ipData = await ipRes.json()
          if (ipData.country) country = ipData.country
          if (ipData.city) city = ipData.city
          if (ipData.isp) isp = ipData.isp
          if (ipData.org) org = ipData.org
        }
      } catch (e) { console.error('IP lookup failed', e) }
    }
    
    // Cookie management for visitor ID
    let visitorId = req.cookies.get('visitor_id')?.value
    let isNewVisitor = false
    
    if (!visitorId) {
      visitorId = crypto.randomUUID()
      isNewVisitor = true
    }
    
    const db = createServerClient()
    
    // Save to database
    await db.from('analytics_events').insert({
      event_type: event_type || 'page_view',
      page: page || '/',
      user_agent: userAgent,
      ip_address: ipAddress,
      metadata: {
        visitorId,
        country,
        city,
        isp,
        org,
        referrer,
        screen,
        language,
        timezone,
        isNewVisitor
      }
    })
    
    // Send Discord Webhook Notification if it's a new visitor (so it doesn't spam on every page load)
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL
    if (discordWebhookUrl && isNewVisitor) {
      const deviceType = userAgent.toLowerCase().includes('mobi') ? '📱 Mobile' : '💻 Desktop'
      
      const payload = {
        embeds: [{
          title: '🚨 New Portfolio Visitor!',
          color: 0x3b82f6, // Blue
          description: `A new visitor just landed on your portfolio.`,
          fields: [
            { name: 'Location', value: `🌍 ${city}, ${country}`, inline: true },
            { name: 'Network/ISP', value: `🏢 ${org || isp}`, inline: true },
            { name: 'Device & Screen', value: `${deviceType} (${screen || 'Unknown'})`, inline: true },
            { name: 'Source', value: referrer ? `🔗 ${referrer}` : '🔍 Direct/Unknown', inline: true },
            { name: 'Landing Page', value: page || '/', inline: true },
            { name: 'System Info', value: `🌐 ${language || 'Unknown'} | 🕒 ${timezone || 'Unknown'}`, inline: true }
          ],
          footer: { text: `Visitor ID: ${visitorId.substring(0, 8)}` },
          timestamp: new Date().toISOString()
        }]
      }
      
      fetch(discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(e => console.error('Discord webhook failed', e))
    }
    
    // Send Email Notification if it's a new visitor
    if (isNewVisitor && process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL_TO) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        const deviceType = userAgent.toLowerCase().includes('mobi') ? 'Mobile' : 'Desktop'
        const siteUrl = getRequestBaseUrl(req).replace(/\/$/, '')
        const analyticsUrl = `${siteUrl}/admin/analytics`
        const logoUrl = `${siteUrl}/apple-touch-icon.png`
        const emailContent = buildVisitorEmail({
          city,
          country,
          org,
          isp,
          deviceType,
          screen: screen || 'Unknown',
          language: language || 'Unknown',
          timezone: timezone || 'Unknown',
          referrer: referrer || 'Direct / Unknown',
          page: page || '/',
          visitorId,
          occurredAt: new Date().toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'Asia/Kolkata',
          }),
          analyticsUrl,
          logoUrl,
        })
        await resend.emails.send({
          from: 'Vinit Soni <onboarding@resend.dev>',
          to: process.env.CONTACT_EMAIL_TO,
          subject: 'New portfolio visitor alert',
          text: emailContent.text,
          html: emailContent.html,
        })
      } catch (e) {
        console.error('Resend email failed', e)
      }
    }
    
    // Set cookie in response if it's a new visitor
    const response = NextResponse.json({ success: true })
    if (isNewVisitor) {
      response.cookies.set('visitor_id', visitorId, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      })
    }
    
    return response
    
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
