'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      allowNestedScroll: true,
      prevent: (node) => Boolean(node.closest('[data-lenis-prevent]')),
    })

    const syncScrollLock = () => {
      if (document.documentElement.hasAttribute('data-scroll-locked')) {
        lenis.stop()
      } else {
        lenis.start()
        lenis.resize()
      }
    }

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    const frameId = requestAnimationFrame(raf)
    syncScrollLock()
    window.addEventListener('portfolio:scroll-lock-change', syncScrollLock)

    return () => {
      window.removeEventListener('portfolio:scroll-lock-change', syncScrollLock)
      cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
