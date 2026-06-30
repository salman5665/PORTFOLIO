'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import type { Testimonial } from '@/lib/supabase/types'

interface Props { testimonials: Testimonial[] }

function TestimonialCard({ item, large }: { item: Testimonial; large?: boolean }) {
  return (
    <div className="card h-100 position-relative overflow-hidden"
      style={{ 
        maxWidth: large ? 850 : undefined, 
        margin: large ? '0 auto' : undefined,
        background: 'linear-gradient(145deg, rgba(20, 22, 35, 0.6) 0%, rgba(10, 11, 16, 0.8) 100%)',
        border: '1px solid rgba(250, 244, 237, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
      
      {/* Watermark Quote */}
      <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.03, transform: 'rotate(10deg)', pointerEvents: 'none' }}>
        <Quote size={180} />
      </div>

      <div className="card-body p-4 p-md-5 d-flex flex-column position-relative z-1">
        <div className="d-flex gap-1 mb-4">
          {Array.from({ length: item.rating || 5 }).map((_, i) => (
            <Star key={i} size={16} style={{ fill: '#fbbf24', color: '#fbbf24', filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.3))' }} />
          ))}
        </div>
        
        <p className="flex-grow-1" style={{ 
          color: 'var(--color-text)', 
          fontSize: large ? '1.15rem' : '1rem', 
          lineHeight: 1.8, 
          fontStyle: 'italic', 
          marginBottom: 32,
          fontWeight: 300,
          opacity: 0.9
        }}>
          &ldquo;{item.content}&rdquo;
        </p>
        
        <div className="d-flex align-items-center gap-3 pt-4" style={{ borderTop: '1px solid rgba(250,244,237,0.08)' }}>
          {item.avatar_url ? (
            <div className="rounded-circle position-relative flex-shrink-0" style={{ width: 50, height: 50, border: '2px solid rgba(34, 211, 238, 0.28)', overflow: 'hidden' }}>
              <Image src={item.avatar_url} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="50px" />
            </div>
          ) : (
            <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 50, height: 50, background: 'linear-gradient(135deg, #0891b2 0%, #4f46e5 100%)', border: '2px solid rgba(34, 211, 238, 0.28)', fontWeight: 800, color: '#fff', fontSize: '1.2rem' }}>
              {item.name.charAt(0)}
            </div>
          )}
          <div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', letterSpacing: '0.02em' }}>{item.name}</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
              <span style={{ color: '#67e8f9' }}>{item.role}</span>
              {item.company && <span> · {item.company}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsSection({ testimonials }: Props) {
  const [current, setCurrent] = useState(0)
  
  // Auto-play interval
  useEffect(() => {
    if (testimonials.length <= 3) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1))
    }, 6000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  if (testimonials.length === 0) return null

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1))

  return (
    <section id="testimonials" className="section position-relative">
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.045), transparent 46%)', pointerEvents: 'none' }} />
      
      <div className="container position-relative z-1" style={{ maxWidth: 1100 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.6 }} className="mb-5 text-center">
          <div className="section-tag mx-auto"><Quote size={13} /> Client Testimonials</div>
          <h2 className="section-title">What People Say</h2>
          <p className="section-subtitle mx-auto">Kind words from colleagues, clients, and collaborators I&apos;ve had the pleasure to work with.</p>
        </motion.div>

        {testimonials.length <= 3 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
            {testimonials.map((item, i) => (
              <motion.div className="col" key={item.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ delay: i * 0.15 }}>
                <TestimonialCard item={item} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="position-relative mt-5">
            <AnimatePresence mode="wait">
              <motion.div key={current}
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }} 
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} 
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }} 
                transition={{ duration: 0.5, ease: "easeOut" }}>
                <TestimonialCard item={testimonials[current]} large />
              </motion.div>
            </AnimatePresence>
            
            <div className="d-flex align-items-center justify-content-center gap-4 mt-5">
              <motion.button whileHover={{ scale: 1.1, backgroundColor: 'rgba(250,244,237,0.1)' }} whileTap={{ scale: 0.9 }}
                onClick={prev} className="btn d-flex align-items-center justify-content-center"
                style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid rgba(250,244,237,0.1)', background: 'transparent', color: 'var(--color-text)', padding: 0 }}>
                <ChevronLeft size={20} />
              </motion.button>
              
              <div className="d-flex gap-2">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)}
                    style={{ 
                      width: i === current ? 24 : 8, 
                      height: 8, 
                      borderRadius: 4, 
                      border: 'none', 
                      padding: 0, 
                      background: i === current ? '#22d3ee' : 'rgba(125,211,252,0.16)', 
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                      cursor: 'pointer' 
                    }} />
                ))}
              </div>
              
              <motion.button whileHover={{ scale: 1.1, backgroundColor: 'rgba(250,244,237,0.1)' }} whileTap={{ scale: 0.9 }}
                onClick={next} className="btn d-flex align-items-center justify-content-center"
                style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid rgba(250,244,237,0.1)', background: 'transparent', color: 'var(--color-text)', padding: 0 }}>
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
