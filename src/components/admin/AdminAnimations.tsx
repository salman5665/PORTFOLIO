'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const ADMIN_SELECTOR = [
  '.admin-topbar',
  '.admin-page-content > *',
  '.admin-page-content .card',
  '.admin-page-content .table-responsive',
  '.admin-page-content form',
  '.admin-page-content .list-group',
  '.admin-page-content .row > .col',
  '.admin-page-content .row > [class*="col-"]',
].join(',')

export default function AdminAnimations() {
  const pathname = usePathname()

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = Array.from(document.querySelectorAll<HTMLElement>(ADMIN_SELECTOR))

    if (prefersReducedMotion) {
      targets.forEach((target) => target.classList.add('admin-scroll-visible'))
      return
    }

    targets.forEach((target, index) => {
      target.classList.add('admin-scroll-animate')
      target.style.setProperty('--admin-scroll-delay', `${Math.min(index % 8, 7) * 45}ms`)
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('admin-scroll-visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    )

    targets.forEach((target) => observer.observe(target))

    return () => observer.disconnect()
  }, [pathname])

  return null
}
