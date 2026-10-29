const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const escapeAttr = (value: string) => escapeHtml(value).replace(/`/g, '&#096;')

const baseShell = (content: string) => `
  <div style="margin:0;padding:0;background:#f3f6fb;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;color:#172033;">
    <div style="max-width:680px;margin:0 auto;padding:32px 16px;">
      ${content}
    </div>
  </div>
`

const titleBlock = (options: {
  eyebrow: string
  title: string
  subtitle: string
  logoUrl: string
}) => `
  <div style="background:#101828;border:1px solid #101828;border-radius:18px 18px 0 0;padding:24px 26px;">
    <table role="presentation" style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="vertical-align:top;">
          <div style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#93c5fd;font-weight:700;margin-bottom:8px;">${escapeHtml(options.eyebrow)}</div>
          <h1 style="margin:0;color:#ffffff;font-size:22px;line-height:1.35;font-weight:700;">${escapeHtml(options.title)}</h1>
          <p style="margin:10px 0 0;color:#d0d5dd;font-size:14px;line-height:1.65;max-width:54ch;">${escapeHtml(options.subtitle)}</p>
        </td>
        <td style="width:58px;vertical-align:top;text-align:right;">
          <img src="${escapeAttr(options.logoUrl)}" width="46" height="46" alt="Salman" style="display:inline-block;width:46px;height:46px;border-radius:12px;border:1px solid rgba(255,255,255,0.24);background:#ffffff;object-fit:cover;" />
        </td>
      </tr>
    </table>
  </div>
`

const cardShell = (body: string) => `
  <div style="background:#ffffff;border:1px solid #e4e7ec;border-top:0;padding:26px 26px;box-shadow:0 16px 32px rgba(16,24,40,0.08);">
    ${body}
  </div>
`

const footerBlock = (footerText: string) => `
  <div style="background:#f9fafb;border:1px solid #e4e7ec;border-top:0;border-radius:0 0 18px 18px;padding:15px 26px;color:#667085;font-size:12px;line-height:1.65;">
    ${footerText}
  </div>
`

const infoRows = (rows: Array<{ label: string; value: string; href?: string }>) => `
  <table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:20px;">
    ${rows
      .map(
        row => `
          <tr>
            <td style="padding:9px 0;color:#667085;font-size:13px;width:120px;vertical-align:top;border-bottom:1px solid #f2f4f7;">${escapeHtml(row.label)}</td>
            <td style="padding:9px 0;font-size:14px;font-weight:600;color:#172033;vertical-align:top;border-bottom:1px solid #f2f4f7;line-height:1.55;">${
              row.href
                ? `<a href="${escapeAttr(row.href)}" style="color:#2563eb;text-decoration:none;font-weight:600;word-break:break-word;">${escapeHtml(row.value)}</a>`
                : escapeHtml(row.value)
            }</td>
          </tr>
        `
      )
      .join('')}
  </table>
`

const actionButton = (href: string, label: string, variant: 'primary' | 'secondary' = 'primary') => `
  <a href="${escapeAttr(href)}" style="display:inline-block;background:${variant === 'primary' ? '#101828' : '#ffffff'};color:${variant === 'primary' ? '#ffffff' : '#344054'};border:1px solid ${variant === 'primary' ? '#101828' : '#d0d5dd'};text-decoration:none;border-radius:10px;padding:11px 16px;font-weight:700;font-size:13px;line-height:1.3;">
    ${escapeHtml(label)} <span style="font-size:14px;line-height:1;">&#8594;</span>
  </a>
`

const metricPill = (label: string, value: string) => `
  <td style="padding:0 8px 12px 0;vertical-align:top;">
    <div style="border:1px solid #e4e7ec;border-radius:12px;background:#f9fafb;padding:12px 13px;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#667085;font-weight:700;margin-bottom:5px;">${escapeHtml(label)}</div>
      <div style="font-size:14px;color:#172033;font-weight:700;line-height:1.4;word-break:break-word;">${escapeHtml(value)}</div>
    </div>
  </td>
`

export function buildContactEmail(options: {
  name: string
  email: string
  subject: string
  body: string
  receivedAt: string
  ipAddress: string
  userAgent: string
  messagesUrl: string
  inboxUrl: string
  logoUrl: string
}) {
  const safeBody = escapeHtml(options.body).replace(/\n/g, '<br />')
  const html = baseShell(`
    ${titleBlock({
      eyebrow: 'Portfolio Contact',
      title: `New message from ${options.name}`,
      subtitle: 'A visitor reached out through your portfolio contact form. The details below are ready for a quick reply.',
      logoUrl: options.logoUrl,
    })}
    ${cardShell(`
      <table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:8px;">
        <tr>
          ${metricPill('Priority', 'New inquiry')}
          ${metricPill('Reply to', options.email)}
        </tr>
      </table>

      ${infoRows([
        { label: 'From', value: options.name },
        { label: 'Email', value: options.email, href: `mailto:${options.email}` },
        { label: 'Subject', value: options.subject },
        { label: 'Received', value: `${options.receivedAt} IST` },
      ])}

      <div style="border:1px solid #e4e7ec;border-radius:12px;background:#f9fafb;padding:18px 20px;margin-bottom:22px;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#667085;font-weight:700;margin-bottom:9px;">Message</div>
        <div style="font-size:14px;line-height:1.75;color:#172033;white-space:normal;">${safeBody}</div>
      </div>

      <div>
        ${actionButton(options.messagesUrl, 'Open Messages')}
        <span style="display:inline-block;width:10px;"></span>
        ${actionButton(options.inboxUrl, 'Open Admin Inbox', 'secondary')}
      </div>
    `)}
    ${footerBlock(`
      <div>Sent from your portfolio contact form.</div>
      <div style="margin-top:4px;">IP: ${escapeHtml(options.ipAddress)} &middot; User agent: ${escapeHtml(options.userAgent)}</div>
    `)}
  `)

  const text = [
    'New portfolio contact message',
    '',
    `From: ${options.name}`,
    `Email: ${options.email}`,
    `Subject: ${options.subject}`,
    `Received: ${options.receivedAt} IST`,
    `IP: ${options.ipAddress}`,
    '',
    'Message:',
    options.body,
    '',
    `Open messages: ${options.messagesUrl}`,
    `Open admin inbox: ${options.inboxUrl}`,
  ].join('\n')

  return { html, text }
}

const sectionBlock = (title: string, rows: Array<{ label: string; value: string }>) => `
  <div style="border:1px solid #e4e7ec;border-radius:14px;margin:0 0 16px;background:#ffffff;overflow:hidden;">
    <div style="padding:13px 16px;background:#f8fafc;border-bottom:1px solid #e4e7ec;font-size:13px;font-weight:800;color:#101828;">${escapeHtml(title)}</div>
    <div style="padding:4px 16px 8px;">
      ${infoRows(rows)}
    </div>
  </div>
`

export function buildVisitorEmail(options: {
  visitorId: string
  occurredAt: string
  analyticsUrl: string
  visitorUrl: string
  logoUrl: string
  event: {
    page: string | null
    ip_address: string | null
    user_agent: string | null
    metadata: Record<string, any>
  }
}) {
  const meta = options.event.metadata || {}
  const ip = meta.ipIntelligence || {}
  const browser = meta.browserIntelligence || {}
  const device = meta.deviceIntelligence || {}
  const hardware = meta.hardwareIntelligence || {}
  const network = meta.networkQuality || {}
  const preferences = meta.userPreferences || {}
  const session = meta.sessionAnalytics || {}
  const navigation = meta.navigationAnalytics || {}
  const engagement = meta.engagementAnalytics || {}
  const referrer = navigation.referrer || {}
  const unknown = 'Unknown'
  const value = (input: any) => {
    if (Array.isArray(input)) return input.length ? input.join(', ') : unknown
    if (typeof input === 'boolean') return input ? 'Yes' : 'No'
    if (input === null || input === undefined || input === '') return unknown
    return String(input)
  }

  const html = baseShell(`
    ${titleBlock({
      eyebrow: 'Portfolio Analytics',
      title: 'New visitor detected',
      subtitle: 'A live visitor intelligence snapshot generated from server-side IP lookup and browser-exposed analytics signals.',
      logoUrl: options.logoUrl,
    })}
    ${cardShell(`
      <table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:8px;">
        <tr>
          ${metricPill('Location', `${value(ip.city)}, ${value(ip.country)}`)}
          ${metricPill('Device', value(browser.deviceType))}
        </tr>
        <tr>
          ${metricPill('Source', value(referrer.source))}
          ${metricPill('Landing Page', value(options.event.page))}
        </tr>
      </table>

      ${sectionBlock('Visitor Summary', [
        { label: 'Visitor ID', value: options.visitorId },
        { label: 'Status', value: session.returningVisitor ? 'Returning' : 'New' },
        { label: 'Visit No.', value: value(session.visitNumber) },
        { label: 'Session ID', value: value(session.currentSessionId) },
        { label: 'First Seen', value: value(session.firstSeen) },
        { label: 'Last Seen', value: value(session.lastSeen) },
        { label: 'Arrival', value: options.occurredAt },
      ])}

      ${sectionBlock('Location', [
        { label: 'Country', value: value(ip.country) },
        { label: 'Region', value: value(ip.region) },
        { label: 'State', value: value(ip.state) },
        { label: 'City', value: value(ip.city) },
        { label: 'Postal Code', value: value(ip.postalCode) },
        { label: 'Timezone', value: value(ip.timezone || browser.timezone) },
        { label: 'Latitude', value: value(ip.latitude) },
        { label: 'Longitude', value: value(ip.longitude) },
        { label: 'Currency', value: value(ip.currency) },
      ])}

      ${sectionBlock('Network', [
        { label: 'IP Address', value: value(options.event.ip_address) },
        { label: 'IP Version', value: value(ip.ipVersion) },
        { label: 'ISP', value: value(ip.isp) },
        { label: 'ASN', value: value(ip.asn) },
        { label: 'Organization', value: value(ip.organization) },
        { label: 'Hosting', value: value(ip.hostingProvider) },
        { label: 'Connection', value: value(ip.connectionType) },
        { label: 'VPN', value: value(ip.vpn) },
        { label: 'Proxy', value: value(ip.proxy) },
        { label: 'Tor', value: value(ip.tor) },
      ])}

      ${sectionBlock('Device', [
        { label: 'Type', value: value(browser.deviceType) },
        { label: 'OS', value: value(browser.operatingSystem) },
        { label: 'OS Version', value: value(browser.osVersion) },
        { label: 'Browser', value: value(browser.browserName) },
        { label: 'Browser Version', value: value(browser.browserVersion) },
        { label: 'Engine', value: value(browser.browserEngine) },
        { label: 'Platform', value: value(browser.platform) },
        { label: 'Touch', value: value(browser.touchSupport) },
      ])}

      ${sectionBlock('Display', [
        { label: 'Screen', value: value(meta.screen) },
        { label: 'Viewport', value: `${value(device.viewportWidth)}x${value(device.viewportHeight)}` },
        { label: 'Pixel Ratio', value: value(device.devicePixelRatio) },
        { label: 'Color Depth', value: value(device.colorDepth) },
        { label: 'Orientation', value: value(device.orientationMode || device.orientation) },
      ])}

      ${sectionBlock('Hardware', [
        { label: 'CPU Cores', value: value(hardware.cpuCores) },
        { label: 'RAM', value: hardware.deviceMemory ? `${value(hardware.deviceMemory)} GB` : unknown },
        { label: 'GPU Vendor', value: value(hardware.gpuVendor) },
        { label: 'GPU Renderer', value: value(hardware.gpuRenderer) },
      ])}

      ${sectionBlock('Network Quality', [
        { label: 'Effective Type', value: value(network.effectiveConnectionType) },
        { label: 'RTT', value: network.rtt ? `${value(network.rtt)} ms` : unknown },
        { label: 'Downlink', value: network.downlinkSpeed ? `${value(network.downlinkSpeed)} Mbps` : unknown },
        { label: 'Save Data', value: value(network.saveDataPreference) },
        { label: 'Online', value: value(network.online) },
      ])}

      ${sectionBlock('User Preferences', [
        { label: 'Dark Mode', value: value(preferences.darkMode) },
        { label: 'Reduced Motion', value: value(preferences.reducedMotion) },
        { label: 'Reduced Data', value: value(preferences.reducedData) },
        { label: 'Languages', value: value(browser.preferredLanguages || meta.language) },
        { label: 'Timezone', value: value(meta.timezone) },
      ])}

      ${sectionBlock('Session', [
        { label: 'Landing Page', value: value(navigation.landingPage || options.event.page) },
        { label: 'Referrer', value: value(referrer.fullReferrer || meta.referrer || 'Direct') },
        { label: 'Referrer Domain', value: value(referrer.referrerDomain) },
        { label: 'UTM Source', value: value(referrer.utm?.source) },
        { label: 'Current Page', value: value(options.event.page) },
        { label: 'Visit No.', value: value(session.visitNumber) },
      ])}

      ${sectionBlock('Live Activity', [
        { label: 'Page Views', value: value(navigation.numberOfPages) },
        { label: 'Path', value: value(navigation.visitedPages) },
        { label: 'Scroll', value: value(engagement.maximumScroll ? `${engagement.maximumScroll}%` : null) },
        { label: 'Button Clicked', value: value(engagement.clickCategory) },
        { label: 'Projects Viewed', value: unknown },
        { label: 'Blogs Viewed', value: unknown },
        { label: 'Resume Downloaded', value: unknown },
        { label: 'Contact Submitted', value: unknown },
      ])}

      ${sectionBlock('History', [
        { label: 'First Seen', value: value(session.firstSeen) },
        { label: 'Last Seen', value: value(session.lastSeen) },
        { label: 'Previous Session', value: value(session.previousSessionId) },
        { label: 'Total Visits', value: value(session.totalVisits) },
        { label: 'Total Sessions', value: value(session.totalSessions) },
      ])}

      <div>
        ${actionButton(options.visitorUrl, 'Open Visitor Profile')}
        <span style="display:inline-block;width:10px;"></span>
        ${actionButton(options.analyticsUrl, 'Open Analytics Dashboard', 'secondary')}
      </div>
    `)}
    ${footerBlock(`
      <div>Generated automatically by Portfolio Analytics.</div>
      <div style="margin-top:4px;">Only browser-exposed, privacy-safe signals are collected. Unsupported values are shown as Unknown.</div>
    `)}
  `)

  const text = [
    'New visitor detected',
    '',
    `Visitor ID: ${options.visitorId}`,
    `Status: ${session.returningVisitor ? 'Returning' : 'New'}`,
    `Location: ${value(ip.city)}, ${value(ip.country)}`,
    `Network: ${value(ip.organization || ip.isp)}`,
    `Device: ${value(browser.deviceType)} / ${value(browser.operatingSystem)} / ${value(browser.browserName)}`,
    `Source: ${value(referrer.source)}`,
    `Landing Page: ${value(options.event.page)}`,
    `Arrived: ${options.occurredAt}`,
    '',
    `Open visitor profile: ${options.visitorUrl}`,
    `Open analytics: ${options.analyticsUrl}`,
  ].join('\n')

  return { html, text }
}

export function buildContactConfirmationEmail(options: {
  name: string
  subject: string
  receivedAt: string
  siteUrl: string
  logoUrl: string
}) {
  const html = baseShell(`
    ${titleBlock({
      eyebrow: 'Thanks for reaching out',
      title: `I received your message, ${options.name}`,
      subtitle: 'Thanks for contacting me through my portfolio. I will review your note and get back to you soon.',
      logoUrl: options.logoUrl,
    })}
    ${cardShell(`
      ${infoRows([
        { label: 'Subject', value: options.subject },
        { label: 'Received', value: `${options.receivedAt} IST` },
        { label: 'Status', value: 'In my inbox' },
      ])}

      <div style="border:1px solid #e4e7ec;border-radius:12px;background:#f9fafb;padding:18px 20px;margin-bottom:22px;">
        <div style="font-size:14px;line-height:1.75;color:#172033;">
          Hi ${escapeHtml(options.name)},<br /><br />
          Your message has reached me. I usually check portfolio inquiries personally, and I will get in touch as soon as I can.
        </div>
      </div>

      <div>
        ${actionButton(options.siteUrl, 'Visit Portfolio')}
      </div>
    `)}
    ${footerBlock(`
      <div>This is an automatic confirmation from Salman's portfolio.</div>
      <div style="margin-top:4px;">You can reply to my follow-up directly when I reach out.</div>
    `)}
  `)

  const text = [
    `Hi ${options.name},`,
    '',
    'Thanks for contacting me through my portfolio. I received your message and will get back to you soon.',
    '',
    `Subject: ${options.subject}`,
    `Received: ${options.receivedAt} IST`,
    '',
    `Portfolio: ${options.siteUrl}`,
  ].join('\n')

  return { html, text }
}

