'use client'

import { useEffect, useMemo, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { getReferrerInfo, isLikelyBot } from '@/lib/analytics/intelligence'

type AnalyticsEventPayload = {
  event_type: string
  page: string
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
}

const VISITOR_KEY = 'portfolio.analytics.visitorId'
const FIRST_SEEN_KEY = 'portfolio.analytics.firstSeen'
const TOTAL_VISITS_KEY = 'portfolio.analytics.totalVisits'
const TOTAL_SESSIONS_KEY = 'portfolio.analytics.totalSessions'
const PREVIOUS_SESSION_KEY = 'portfolio.analytics.previousSessionId'
const SESSION_KEY = 'portfolio.analytics.sessionId'
const SESSION_STARTED_KEY = 'portfolio.analytics.sessionStartedAt'
const FIRST_LANDING_KEY = 'portfolio.analytics.firstLandingPage'
const LAST_ACTIVITY_KEY = 'portfolio.analytics.lastActivityAt'
const SESSION_TIMEOUT_MS = 30 * 60 * 1000
const SCROLL_THROTTLE_MS = 900
const FLUSH_INTERVAL_MS = 5000

const uuid = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const nowIso = () => new Date().toISOString()

const getOrCreateVisitorState = (pathname: string) => {
  const now = Date.now()
  const nowText = new Date(now).toISOString()
  let visitorId = localStorage.getItem(VISITOR_KEY)
  let firstSeen = localStorage.getItem(FIRST_SEEN_KEY)
  let totalVisits = Number(localStorage.getItem(TOTAL_VISITS_KEY) || '0')
  let totalSessions = Number(localStorage.getItem(TOTAL_SESSIONS_KEY) || '0')
  let sessionId = localStorage.getItem(SESSION_KEY)
  let previousSessionId = localStorage.getItem(PREVIOUS_SESSION_KEY)
  const sessionStartedAt = localStorage.getItem(SESSION_STARTED_KEY)
  const lastActivity = Number(localStorage.getItem(LAST_ACTIVITY_KEY) || '0')
  const sessionExpired = !sessionId || !lastActivity || now - lastActivity > SESSION_TIMEOUT_MS

  if (!visitorId) {
    visitorId = uuid()
    firstSeen = nowText
    totalVisits = 0
    localStorage.setItem(VISITOR_KEY, visitorId)
    localStorage.setItem(FIRST_SEEN_KEY, firstSeen)
    localStorage.setItem(FIRST_LANDING_KEY, pathname)
  }

  totalVisits += 1
  localStorage.setItem(TOTAL_VISITS_KEY, String(totalVisits))

  if (sessionExpired) {
    if (sessionId) localStorage.setItem(PREVIOUS_SESSION_KEY, sessionId)
    previousSessionId = sessionId || previousSessionId
    sessionId = uuid()
    totalSessions += 1
    localStorage.setItem(SESSION_KEY, sessionId)
    localStorage.setItem(SESSION_STARTED_KEY, nowText)
    localStorage.setItem(TOTAL_SESSIONS_KEY, String(totalSessions))
  }

  localStorage.setItem(LAST_ACTIVITY_KEY, nowText)

  return {
    visitorId,
    firstSeen: firstSeen || nowText,
    lastSeen: nowText,
    currentSessionId: sessionId || uuid(),
    previousSessionId,
    totalVisits,
    totalSessions: Math.max(totalSessions, 1),
    returningVisitor: totalVisits > 1,
    visitNumber: totalVisits,
    firstLandingPage: localStorage.getItem(FIRST_LANDING_KEY) || pathname,
    latestLandingPage: pathname,
    sessionStart: sessionExpired ? nowText : sessionStartedAt || nowText,
    activeStatus: true,
    lastActivityTimestamp: nowText,
  }
}

const getBrowserData = () => ({
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  touchSupport: navigator.maxTouchPoints > 0,
  cookieEnabled: navigator.cookieEnabled,
  javaScriptEnabled: true,
  browserLanguage: navigator.language,
  preferredLanguages: navigator.languages,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
})

const getDeviceData = () => ({
  screenWidth: window.screen.width,
  screenHeight: window.screen.height,
  viewportWidth: window.innerWidth,
  viewportHeight: window.innerHeight,
  devicePixelRatio: window.devicePixelRatio,
  colorDepth: window.screen.colorDepth,
  pixelDepth: window.screen.pixelDepth,
  orientation: window.screen.orientation?.type || (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'),
  orientationMode: window.innerWidth > window.innerHeight ? 'Landscape' : 'Portrait',
})

// Hardware data is collected lazily after the browser goes idle,
// so WebGL context creation never competes with the initial paint.
const getHardwareDataAsync = (): Promise<Record<string, unknown>> =>
  new Promise(resolve => {
    const collect = () => {
      try {
        const canvas = document.createElement('canvas')
        const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
        const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info')
        resolve({
          cpuCores: navigator.hardwareConcurrency || null,
          deviceMemory: 'deviceMemory' in navigator ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory : null,
          gpuVendor: debugInfo ? gl?.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : null,
          gpuRenderer: debugInfo ? gl?.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null,
          webglVersion: gl ? gl.getParameter(gl.VERSION) : null,
          maximumTextureSize: gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : null,
        })
      } catch {
        resolve({})
      }
    }
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(collect, { timeout: 2000 })
    } else {
      setTimeout(collect, 2000)
    }
  })

const getNetworkData = () => {
  const connection = 'connection' in navigator
    ? (navigator as Navigator & { connection?: { effectiveType?: string; rtt?: number; downlink?: number; saveData?: boolean } }).connection
    : undefined
  return {
    effectiveConnectionType: connection?.effectiveType || null,
    rtt: connection?.rtt ?? null,
    downlinkSpeed: connection?.downlink ?? null,
    saveDataPreference: connection?.saveData ?? null,
    online: navigator.onLine,
  }
}

const getPreferenceData = () => ({
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  lightMode: window.matchMedia('(prefers-color-scheme: light)').matches,
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  reducedData: window.matchMedia('(prefers-reduced-data: reduce)').matches,
  highContrast: window.matchMedia('(prefers-contrast: more)').matches,
  preferredColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
})

const getClickCategory = (target: HTMLElement) => {
  const text = `${target.innerText || ''} ${target.getAttribute('aria-label') || ''} ${target.getAttribute('href') || ''}`.toLowerCase()
  if (target.closest('nav')) return 'Navigation'
  if (target.closest('header')) return 'Header'
  if (target.closest('footer')) return 'Footer'
  if (text.includes('resume')) return 'Resume'
  if (text.includes('github')) return 'GitHub'
  if (text.includes('linkedin')) return 'LinkedIn'
  if (text.includes('email') || text.includes('mailto:')) return 'Email'
  if (text.includes('phone') || text.includes('tel:')) return 'Phone'
  if (text.includes('project')) return 'Projects'
  if (text.includes('blog')) return 'Blogs'
  if (text.includes('contact')) return 'Contact Form'
  if (target.closest('button,a')) return 'CTA Button'
  return 'Interaction'
}

export default function VisitorTracker() {
  const pathname = usePathname()
  const hasFiredForPath = useRef<string | null>(null)
  const queueRef = useRef<AnalyticsEventPayload[]>([])
  const sessionRef = useRef<Record<string, unknown> | null>(null)
  const pathStartedAt = useRef(Date.now())
  const maxScrollRef = useRef(0)
  const scrollEventsRef = useRef(0)
  const sentScrollMilestonesRef = useRef<Set<number>>(new Set())
  const lastScrollSentRef = useRef(0)
  const interactionStartedRef = useRef<number | null>(null)
  const visitedPagesRef = useRef<string[]>([])
  const previousPageRef = useRef<string | null>(null)

  const shouldTrack = useMemo(() => {
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/login')) return false
    if (typeof navigator !== 'undefined' && isLikelyBot(navigator.userAgent)) return false
    return true
  }, [pathname])

  useEffect(() => {
    if (!shouldTrack || !pathname) return

    const sendBatch = async (events: AnalyticsEventPayload[]) => {
      if (!events.length) return
      try {
        const response = await fetch('/api/track', {
          method: 'POST',
          keepalive: true,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ events }),
        })
        if (!response.ok) throw new Error('Tracking request failed')
      } catch {
        const retry = () => {
          queueRef.current.unshift(...events)
        }
        setTimeout(retry, 2500)
      }
    }

    const flush = () => {
      const events = queueRef.current.splice(0, 12)
      void sendBatch(events)
    }

    const enqueue = (event: AnalyticsEventPayload) => {
      queueRef.current.push(event)
      if (queueRef.current.length >= 8) flush()
    }

    if (hasFiredForPath.current !== pathname) {
      const previousPage = previousPageRef.current
      previousPageRef.current = pathname
      visitedPagesRef.current = [...visitedPagesRef.current, pathname].slice(-30)
      pathStartedAt.current = Date.now()
      maxScrollRef.current = 0
      scrollEventsRef.current = 0
      sentScrollMilestonesRef.current = new Set()
      interactionStartedRef.current = null
      sessionRef.current = getOrCreateVisitorState(pathname)

      // All cheap signals collected immediately. Hardware is deferred to idle time.
      const pageViewBase = {
        event_type: 'page_view' as const,
        page: pathname,
        referrer: document.referrer || null,
        session: sessionRef.current,
        browser: getBrowserData(),
        device: getDeviceData(),
        network: getNetworkData(),
        preferences: getPreferenceData(),
        navigation: {
          landingPage: visitedPagesRef.current[0],
          previousPage,
          currentPage: pathname,
          nextPage: null,
          visitedPages: visitedPagesRef.current,
          navigationSequence: visitedPagesRef.current,
          numberOfPages: visitedPagesRef.current.length,
          referrer: getReferrerInfo(document.referrer, window.location.href),
        },
      }

      // Collect hardware lazily (WebGL), then enqueue the full event.
      getHardwareDataAsync().then(hardware => {
        enqueue({ ...pageViewBase, hardware })
      })

      hasFiredForPath.current = pathname
    }

    const interval = window.setInterval(flush, FLUSH_INTERVAL_MS)
    const markActivity = () => {
      localStorage.setItem(LAST_ACTIVITY_KEY, nowIso())
      if (!interactionStartedRef.current) interactionStartedRef.current = Date.now()
    }

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (scrollable <= 0) return
      const pct = Math.min(100, Math.round((window.scrollY / scrollable) * 100))
      maxScrollRef.current = Math.max(maxScrollRef.current, pct)
      scrollEventsRef.current += 1
      const milestone = [25, 50, 75, 90, 100].find(value => pct >= value && !sentScrollMilestonesRef.current.has(value))
      const now = Date.now()
      if (!milestone && now - lastScrollSentRef.current < SCROLL_THROTTLE_MS) return
      if (milestone) sentScrollMilestonesRef.current.add(milestone)
      lastScrollSentRef.current = now
      enqueue({
        event_type: milestone ? `scroll_${milestone}` : 'scroll',
        page: pathname,
        session: sessionRef.current || undefined,
        engagement: {
          maximumScroll: maxScrollRef.current,
          averageScroll: maxScrollRef.current,
          totalScrollEvents: scrollEventsRef.current,
          milestone: milestone || null,
        },
      })
    }

    const onClick = (event: MouseEvent) => {
      markActivity()
      const target = event.target instanceof HTMLElement ? event.target : null
      if (!target) return
      const actionable = target.closest('a,button,[role="button"],input,textarea,select') as HTMLElement | null
      if (!actionable) return
      enqueue({
        event_type: 'click',
        page: pathname,
        session: sessionRef.current || undefined,
        engagement: {
          clickCategory: getClickCategory(actionable),
          clickText: (actionable.innerText || actionable.getAttribute('aria-label') || actionable.getAttribute('href') || 'Unknown').slice(0, 160),
          clickedAt: nowIso(),
          timeBeforeFirstInteraction: interactionStartedRef.current ? interactionStartedRef.current - pathStartedAt.current : Date.now() - pathStartedAt.current,
        },
      })
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        enqueue({
          event_type: 'page_exit',
          page: pathname,
          session: sessionRef.current || undefined,
          navigation: {
            exitPage: pathname,
            timePerPage: Date.now() - pathStartedAt.current,
            visitedPages: visitedPagesRef.current,
          },
          engagement: {
            maximumScroll: maxScrollRef.current,
            totalScrollEvents: scrollEventsRef.current,
          },
        })
        flush()
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('click', onClick, { passive: true })
    window.addEventListener('keydown', markActivity, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('click', onClick)
      window.removeEventListener('keydown', markActivity)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      flush()
    }
  }, [pathname, shouldTrack])

  return null
}
