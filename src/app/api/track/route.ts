import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getReferrerInfo, isLikelyBot, parseUserAgent, safeString, UNKNOWN } from '@/lib/analytics/intelligence'
import { buildVisitorEmail } from '@/lib/emailTemplates'
import { createServerClient } from '@/lib/supabase/server'

type TrackingPayload = {
  event_type?: string
  page?: string
  referrer?: string | null
  session?: Record<string, unknown>
  browser?: Record<string, unknown>
  device?: Record<string, unknown>
  hardware?: Record<string, unknown>
  network?: Record<string, unknown>
  preferences?: Record<string, unknown>
  navigation?: Record<string, unknown>
  engagement?: Record<string, unknown>
  metadata?: Record<string, unknown>
  screen?: string
  language?: string
  timezone?: string
}

const getRequestBaseUrl = (req: NextRequest) => {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host')
  const protocol = req.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https')
  return host ? `${protocol}://${host}` : 'https://vinitsoni.vercel.app'
}

const getIpAddress = (req: NextRequest) => {
  return (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || UNKNOWN).split(',')[0].trim()
}

const isPublicIp = (ip: string) => {
  if (!ip || ip === UNKNOWN || ip === '::1' || ip === '127.0.0.1') return false
  if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(ip)) return false
  return true
}

const lookupIp = async (ipAddress: string) => {
  const fallback = {
    publicIp: ipAddress,
    ipVersion: ipAddress.includes(':') ? 'IPv6' : 'IPv4',
    country: UNKNOWN,
    countryCode: UNKNOWN,
    state: UNKNOWN,
    region: UNKNOWN,
    city: UNKNOWN,
    postalCode: UNKNOWN,
    latitude: UNKNOWN,
    longitude: UNKNOWN,
    timezone: UNKNOWN,
    currency: UNKNOWN,
    isp: UNKNOWN,
    asn: UNKNOWN,
    organization: UNKNOWN,
    hostingProvider: UNKNOWN,
    connectionType: UNKNOWN,
    vpn: UNKNOWN,
    proxy: UNKNOWN,
    tor: UNKNOWN,
  }

  if (!isPublicIp(ipAddress)) return fallback

  try {
    const fields = [
      'status',
      'country',
      'countryCode',
      'regionName',
      'region',
      'city',
      'zip',
      'lat',
      'lon',
      'timezone',
      'currency',
      'isp',
      'as',
      'asname',
      'org',
      'hosting',
      'proxy',
    ].join(',')
    const response = await fetch(`http://ip-api.com/json/${ipAddress}?fields=${fields}`, {
      next: { revalidate: 60 * 60 * 12 },
    })
    if (!response.ok) return fallback
    const data = await response.json()
    if (data.status === 'fail') return fallback
    return {
      ...fallback,
      country: safeString(data.country),
      countryCode: safeString(data.countryCode),
      state: safeString(data.regionName),
      region: safeString(data.region),
      city: safeString(data.city),
      postalCode: safeString(data.zip),
      latitude: safeString(data.lat),
      longitude: safeString(data.lon),
      timezone: safeString(data.timezone),
      currency: safeString(data.currency),
      isp: safeString(data.isp),
      asn: safeString(data.as),
      organization: safeString(data.org || data.asname),
      hostingProvider: data.hosting ? 'Yes' : 'Unknown',
      connectionType: data.hosting ? 'Datacenter' : 'Residential/Unknown',
      proxy: data.proxy ? 'Yes' : 'Unknown',
      vpn: data.proxy ? 'Possible' : 'Unknown',
      tor: UNKNOWN,
    }
  } catch (error) {
    console.error('IP lookup failed', error)
    return fallback
  }
}

const normalizeEvent = (payload: TrackingPayload, userAgent: string, ipIntel: Awaited<ReturnType<typeof lookupIp>>, req: NextRequest) => {
  const parsedUa = parseUserAgent(userAgent)
  const session = payload.session || {}
  const browser = payload.browser || {}
  const device = payload.device || {}
  const referrerInfo = getReferrerInfo(payload.referrer || null, `${getRequestBaseUrl(req)}${payload.page || '/'}`)
  const visitorId = safeString(session.visitorId || payload.metadata?.visitorId || req.cookies.get('visitor_id')?.value || crypto.randomUUID())
  const language = safeString(browser.browserLanguage || payload.language)
  const timezone = safeString(browser.timezone || payload.timezone || ipIntel.timezone)
  const screen = payload.screen || (device.screenWidth && device.screenHeight ? `${device.screenWidth}x${device.screenHeight}` : UNKNOWN)

  return {
    event_type: payload.event_type || 'page_view',
    page: payload.page || '/',
    user_agent: userAgent,
    ip_address: ipIntel.publicIp,
    metadata: {
      ...(payload.metadata || {}),
      visitorId,
      country: ipIntel.country,
      city: ipIntel.city,
      isp: ipIntel.isp,
      org: ipIntel.organization,
      referrer: payload.referrer || null,
      screen,
      language,
      timezone,
      ipIntelligence: ipIntel,
      browserIntelligence: {
        ...parsedUa,
        ...browser,
      },
      deviceIntelligence: device,
      hardwareIntelligence: payload.hardware || {},
      networkQuality: payload.network || {},
      userPreferences: payload.preferences || {},
      sessionAnalytics: {
        ...session,
        firstVisit: session.firstSeen,
        lastVisit: session.lastSeen,
        newVisitor: session.returningVisitor === false,
        returningVisitor: Boolean(session.returningVisitor),
      },
      navigationAnalytics: {
        ...(payload.navigation || {}),
        referrer: referrerInfo,
      },
      engagementAnalytics: payload.engagement || {},
      isNewVisitor: session.returningVisitor === false,
    },
  }
}

const sendNewVisitorNotifications = async (
  req: NextRequest,
  event: ReturnType<typeof normalizeEvent>,
  visitorId: string
) => {
  const meta = event.metadata as Record<string, any>
  const siteUrl = getRequestBaseUrl(req).replace(/\/$/, '')
  const analyticsUrl = `${siteUrl}/admin/analytics`
  const visitorUrl = `${analyticsUrl}?visitor=${encodeURIComponent(visitorId)}`
  const logoUrl = `${siteUrl}/apple-touch-icon.png`

  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (discordWebhookUrl) {
    const payload = {
      embeds: [{
        title: 'New Portfolio Visitor',
        color: 0x16a34a,
        description: 'A new visitor just landed on your portfolio.',
        fields: [
          { name: 'Location', value: `${meta.city}, ${meta.country}`, inline: true },
          { name: 'Network', value: meta.org || meta.isp || UNKNOWN, inline: true },
          { name: 'Device', value: `${meta.browserIntelligence?.deviceType || UNKNOWN} (${meta.screen || UNKNOWN})`, inline: true },
          { name: 'Source', value: meta.navigationAnalytics?.referrer?.source || 'Direct', inline: true },
          { name: 'Landing Page', value: event.page || '/', inline: true },
          { name: 'Visitor ID', value: visitorId.slice(0, 8), inline: true },
        ],
        timestamp: new Date().toISOString(),
      }],
    }

    fetch(discordWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(error => console.error('Discord webhook failed', error))
  }

  if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL_TO) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const occurredAt = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata',
    })
    const emailContent = buildVisitorEmail({
      visitorId,
      occurredAt,
      analyticsUrl,
      visitorUrl,
      logoUrl,
      event,
    })
    await resend.emails.send({
      from: 'Vinit Soni <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL_TO,
      subject: 'New portfolio visitor detected',
      text: emailContent.text,
      html: emailContent.html,
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    const userAgent = req.headers.get('user-agent') || UNKNOWN
    if (isLikelyBot(userAgent)) {
      return NextResponse.json({ success: true, ignored: true })
    }

    const body = await req.json()
    const payloads: TrackingPayload[] = Array.isArray(body?.events) ? body.events : [body]
    const ipAddress = getIpAddress(req)
    const ipIntel = await lookupIp(ipAddress)
    const db = createServerClient()
    const events = payloads.slice(0, 20).map(payload => normalizeEvent(payload, userAgent, ipIntel, req))
    const firstPageView = events.find(event => event.event_type === 'page_view')

    if (events.length) {
      const { error } = await db.from('analytics_events').insert(events)
      if (error) {
        console.error('Analytics insert failed:', error)
        return NextResponse.json({ error: 'Failed to save analytics' }, { status: 500 })
      }
    }

    const visitorId = safeString(firstPageView?.metadata?.visitorId || req.cookies.get('visitor_id')?.value)
    const cookieVisitorId = req.cookies.get('visitor_id')?.value
    const isNewVisitor = Boolean(firstPageView?.metadata?.isNewVisitor) || !cookieVisitorId

    if (firstPageView && isNewVisitor) {
      try {
        await sendNewVisitorNotifications(req, firstPageView, visitorId)
      } catch (error) {
        console.error('Visitor notification failed', error)
      }
    }

    const response = NextResponse.json({ success: true })
    if (!cookieVisitorId && visitorId !== UNKNOWN) {
      response.cookies.set('visitor_id', visitorId, {
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })
    }

    return response
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
