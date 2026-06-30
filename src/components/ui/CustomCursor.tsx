'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 400, damping: 28 })
  const springY = useSpring(mouseY, { stiffness: 400, damping: 28 })

  const ringX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const ringY = useSpring(mouseY, { stiffness: 150, damping: 20 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const handleHover = () => {
      if (cursorRingRef.current) {
        cursorRingRef.current.style.width = '60px'
        cursorRingRef.current.style.height = '60px'
        cursorRingRef.current.style.borderColor = 'rgba(0, 245, 255, 0.8)'
      }
    }

    const handleLeave = () => {
      if (cursorRingRef.current) {
        cursorRingRef.current.style.width = '40px'
        cursorRingRef.current.style.height = '40px'
        cursorRingRef.current.style.borderColor = 'rgba(0, 245, 255, 0.5)'
      }
    }

    const handleClick = () => {
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = 'translate(-50%, -50%) scale(2)'
        setTimeout(() => {
          if (cursorDotRef.current) {
            cursorDotRef.current.style.transform = 'translate(-50%, -50%) scale(1)'
          }
        }, 150)
      }
    }

    const interactables = document.querySelectorAll('a, button, [data-cursor-hover]')
    interactables.forEach(el => {
      el.addEventListener('mouseenter', handleHover)
      el.addEventListener('mouseleave', handleLeave)
    })

    window.addEventListener('mousemove', move)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('click', handleClick)
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', handleHover)
        el.removeEventListener('mouseleave', handleLeave)
      })
    }
  }, [mouseX, mouseY])

  return (
    <>
      <motion.div
        ref={cursorDotRef}
        className="cursor-dot"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      <motion.div
        ref={cursorRingRef}
        className="cursor-ring"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  )
}
