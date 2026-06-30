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
          <img src="${escapeAttr(options.logoUrl)}" width="46" height="46" alt="Vinit Soni" style="display:inline-block;width:46px;height:46px;border-radius:12px;border:1px solid rgba(255,255,255,0.24);background:#ffffff;object-fit:cover;" />
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

export function buildVisitorEmail(options: {
  city: string
  country: string
  org: string
  isp: string
  deviceType: string
  screen: string
  language: string
  timezone: string
  referrer: string
  page: string
  visitorId: string
  occurredAt: string
  analyticsUrl: string
  logoUrl: string
}) {
  const html = baseShell(`
    ${titleBlock({
      eyebrow: 'Portfolio Visitor Alert',
      title: 'A new visitor just landed on your portfolio',
      subtitle: 'The snapshot below highlights where they came from and how they arrived.',
      logoUrl: options.logoUrl,
    })}
    ${cardShell(`
      <table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:8px;">
        <tr>
          ${metricPill('Location', `${options.city}, ${options.country}`)}
          ${metricPill('Device', options.deviceType)}
        </tr>
      </table>

      ${infoRows([
        { label: 'Location', value: `${options.city}, ${options.country}` },
        { label: 'Network', value: options.org || options.isp || 'Unknown Network' },
        { label: 'Device', value: `${options.deviceType} (${options.screen || 'Unknown'})` },
        { label: 'Language', value: options.language || 'Unknown' },
        { label: 'Timezone', value: options.timezone || 'Unknown' },
        { label: 'Source', value: options.referrer || 'Direct / Unknown' },
        { label: 'Landing Page', value: options.page || '/' },
        { label: 'Visitor ID', value: options.visitorId.substring(0, 8) },
        { label: 'Arrived', value: options.occurredAt },
      ])}

      <div>
        ${actionButton(options.analyticsUrl, 'Open Analytics')}
      </div>
    `)}
    ${footerBlock(`
      <div>This alert was triggered only for a new visitor, so it stays useful instead of noisy.</div>
    `)}
  `)

  const text = [
    'New portfolio visitor alert',
    '',
    `Location: ${options.city}, ${options.country}`,
    `Network: ${options.org || options.isp || 'Unknown Network'}`,
    `Device: ${options.deviceType} (${options.screen || 'Unknown'})`,
    `Language: ${options.language || 'Unknown'}`,
    `Timezone: ${options.timezone || 'Unknown'}`,
    `Source: ${options.referrer || 'Direct / Unknown'}`,
    `Landing Page: ${options.page || '/'}`,
    `Visitor ID: ${options.visitorId.substring(0, 8)}`,
    `Arrived: ${options.occurredAt}`,
    '',
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
      <div>This is an automatic confirmation from Vinit Soni's portfolio.</div>
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
