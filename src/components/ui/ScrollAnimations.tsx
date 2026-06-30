'use client'

import { useEffect } from 'react'

const SELECTOR = [
  '.section',
  '.section .section-tag',
  '.section .section-title',
  '.section .section-subtitle',
  '.section .card',
  '.section .ps-card',
  '.section .vs-timeline-item',
  '.section .nav-pills',
  '.section form',
].join(',')

export default function ScrollAnimations() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR))

    if (prefersReducedMotion) {
      targets.forEach((target) => target.classList.add('scroll-in-view'))
      return
    }

    targets.forEach((target, index) => {
      target.classList.add('scroll-animate')
      target.style.setProperty('--scroll-delay', `${Math.min(index % 10, 8) * 55}ms`)
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-in-view')
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )

    targets.forEach((target) => observer.observe(target))

    return () => observer.disconnect()
  }, [])

  return null
}
