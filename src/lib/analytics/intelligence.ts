export type JsonRecord = Record<string, unknown>

export const UNKNOWN = 'Unknown'

export const safeString = (value: unknown, fallback = UNKNOWN) => {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return fallback
}

export const getReferrerInfo = (referrer?: string | null, href?: string) => {
  const url = href ? new URL(href) : null
  const params = url?.searchParams
  const utm = {
    source: params?.get('utm_source') || null,
    medium: params?.get('utm_medium') || null,
    campaign: params?.get('utm_campaign') || null,
    content: params?.get('utm_content') || null,
    term: params?.get('utm_term') || null,
  }

  if (!referrer) {
    return {
      fullReferrer: null,
      referrerDomain: null,
      source: utm.source || 'Direct',
      searchEngine: null,
      isDirect: true,
      utm,
    }
  }

  let domain = UNKNOWN
  try {
    domain = new URL(referrer).hostname.replace(/^www\./, '')
  } catch {
    domain = UNKNOWN
  }

  const lower = domain.toLowerCase()
  const sourceMap: Array<[string, string]> = [
    ['google.', 'Google'],
    ['bing.', 'Bing'],
    ['linkedin.', 'LinkedIn'],
    ['github.', 'GitHub'],
    ['chatgpt.', 'ChatGPT'],
    ['openai.', 'ChatGPT'],
    ['perplexity.', 'Perplexity'],
    ['facebook.', 'Facebook'],
    ['instagram.', 'Instagram'],
    ['twitter.', 'Twitter/X'],
    ['x.com', 'Twitter/X'],
    ['reddit.', 'Reddit'],
  ]
  const matched = sourceMap.find(([needle]) => lower.includes(needle))
  const searchEngine = lower.includes('google.') ? 'Google' : lower.includes('bing.') ? 'Bing' : null

  return {
    fullReferrer: referrer,
    referrerDomain: domain,
    source: utm.source || matched?.[1] || domain,
    searchEngine,
    isDirect: false,
    utm,
  }
}

export const parseUserAgent = (userAgent = '') => {
  const ua = userAgent || UNKNOWN
  const browserRules: Array<[RegExp, string]> = [
    [/Edg\/([\d.]+)/, 'Microsoft Edge'],
    [/OPR\/([\d.]+)/, 'Opera'],
    [/Chrome\/([\d.]+)/, 'Chrome'],
    [/Firefox\/([\d.]+)/, 'Firefox'],
    [/Version\/([\d.]+).*Safari/, 'Safari'],
  ]
  const browserMatch = browserRules.map(([regex, name]) => ({ match: ua.match(regex), name })).find(item => item.match)
  const osRules: Array<[RegExp, string]> = [
    [/Windows NT 10/i, 'Windows'],
    [/Android ([\d.]+)/i, 'Android'],
    [/iPhone OS ([\d_]+)/i, 'iOS'],
    [/iPad; CPU OS ([\d_]+)/i, 'iPadOS'],
    [/Mac OS X ([\d_]+)/i, 'macOS'],
    [/Linux/i, 'Linux'],
  ]
  const osMatch = osRules.map(([regex, name]) => ({ match: ua.match(regex), name })).find(item => item.match)
  const isTablet = /ipad|tablet|playbook|silk/i.test(ua)
  const isMobile = !isTablet && /mobi|iphone|android/i.test(ua)
  const engine = /AppleWebKit/i.test(ua)
    ? 'WebKit/Blink'
    : /Gecko\/\d/i.test(ua)
      ? 'Gecko'
      : /Trident|MSIE/i.test(ua)
        ? 'Trident'
        : UNKNOWN

  return {
    browserName: browserMatch?.name || UNKNOWN,
    browserVersion: browserMatch?.match?.[1] || UNKNOWN,
    browserEngine: engine,
    operatingSystem: osMatch?.name || UNKNOWN,
    osVersion: osMatch?.match?.[1]?.replace(/_/g, '.') || UNKNOWN,
    deviceType: isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop',
  }
}

export const isLikelyBot = (userAgent = '') => {
  return /bot|crawl|spider|slurp|crawler|preview|facebookexternalhit|monitor|pingdom|uptime|headless/i.test(userAgent)
}
