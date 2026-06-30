'use client'

import { useEffect } from 'react'

let lockCount = 0
let scrollY = 0
let scrollX = 0
let lockedUrlHash = ''
let previousBodyStyles: Partial<CSSStyleDeclaration> = {}
let previousHtmlOverflow = ''
let previousHtmlScrollbarGutter = ''
let previousHtmlScrollBehavior = ''

function notifyScrollLock(locked: boolean) {
  document.documentElement.toggleAttribute('data-scroll-locked', locked)
  document.body.toggleAttribute('data-scroll-locked', locked)
  window.dispatchEvent(new CustomEvent('portfolio:scroll-lock-change', { detail: { locked } }))
}

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return

    const body = document.body
    const html = document.documentElement

    if (lockCount === 0) {
      scrollY = window.scrollY
      scrollX = window.scrollX
      lockedUrlHash = window.location.hash
      previousHtmlOverflow = html.style.overflow
      previousHtmlScrollbarGutter = html.style.scrollbarGutter
      previousHtmlScrollBehavior = html.style.scrollBehavior
      previousBodyStyles = {
        overflow: body.style.overflow,
        position: body.style.position,
        top: body.style.top,
        left: body.style.left,
        right: body.style.right,
        width: body.style.width,
        paddingRight: body.style.paddingRight,
      }

      const scrollbarWidth = window.innerWidth - html.clientWidth

      html.style.overflow = 'hidden'
      html.style.scrollbarGutter = 'stable'
      html.style.scrollBehavior = 'auto'
      body.style.overflow = 'hidden'
      body.style.position = 'fixed'
      body.style.top = `-${scrollY}px`
      body.style.left = '0'
      body.style.right = '0'
      body.style.width = '100%'
      if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`
      notifyScrollLock(true)
    }

    lockCount += 1

    return () => {
      lockCount = Math.max(0, lockCount - 1)

      if (lockCount === 0) {
        const targetX = scrollX
        const targetY = scrollY
        const hash = lockedUrlHash
        const urlWithoutHash = `${window.location.pathname}${window.location.search}`

        if (hash) {
          window.history.replaceState(window.history.state, '', urlWithoutHash)
        }

        html.style.overflow = previousHtmlOverflow
        html.style.scrollbarGutter = previousHtmlScrollbarGutter
        html.style.scrollBehavior = 'auto'
        body.style.overflow = previousBodyStyles.overflow || ''
        body.style.position = previousBodyStyles.position || ''
        body.style.top = previousBodyStyles.top || ''
        body.style.left = previousBodyStyles.left || ''
        body.style.right = previousBodyStyles.right || ''
        body.style.width = previousBodyStyles.width || ''
        body.style.paddingRight = previousBodyStyles.paddingRight || ''
        notifyScrollLock(false)
        window.scrollTo({ left: targetX, top: targetY, behavior: 'auto' })

        requestAnimationFrame(() => {
          if (hash) {
            window.history.replaceState(window.history.state, '', `${urlWithoutHash}${hash}`)
          }
          window.scrollTo({ left: targetX, top: targetY, behavior: 'auto' })
          html.style.scrollBehavior = previousHtmlScrollBehavior
        })
      }
    }
  }, [active])
}
