'use client'

import { useRef } from 'react'
import { motion} from 'framer-motion'
import { GraduationCap, Award, Calendar, ExternalLink } from 'lucide-react'
import type { Education } from '@/lib/supabase/types'

function formatDate(d: string | null): string {
  if (!d) return ''
  const date = new Date(d)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[date.getUTCMonth()]
  const year = date.getUTCFullYear()
  return `${month} ${year}`
}

interface Props { educations: Education[] }

export default function EducationSection({ educations }: Props) {
  return (
    <section id="education" className="section section-white">
      <div className="container" style={{ maxWidth: 800 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.15 }} transition={{ duration: 0.6 }} className="mb-5">
          <div className="section-tag"><GraduationCap size={13} /> Education</div>
          <h2 className="section-title">Academic Background</h2>
          <p className="section-subtitle">My educational journey and academic achievements.</p>
        </motion.div>

        <div className="vs-timeline">
          {educations.length === 0 ? (
            <div className="text-center py-5" style={{ color: 'var(--color-text-muted)' }}>
              <GraduationCap size={36} className="mb-2 opacity-50 d-block mx-auto" />
              <p className="mb-0">No education entries yet. Add them from the admin panel.</p>
            </div>
          ) : (
            educations.map((item, i) => (
              <motion.div key={item.id} className="vs-timeline-item"
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.15 }} transition={{ delay: 0.15 + i * 0.15, duration: 0.6 }}>
                <div className="vs-timeline-dot" />
                <motion.div className="card shadow-vs ms-2" whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} transition={{ duration: 0.2 }}>
                  <div className="card-body p-4 p-md-5">
                    <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
                      <div className="d-flex align-items-start gap-3">
                        {item.logo_url ? (
                          <img src={item.logo_url} alt={item.institution} style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--color-border)', padding: 4, background: '#fff', flexShrink: 0 }} />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                            style={{ width: 44, height: 44, background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                            <GraduationCap size={22} color="var(--color-text-muted)" />
                          </div>
                        )}
                        <div>
                          <h3 style={{ fontWeight: 800, color: 'var(--color-text)', fontSize: '1.05rem', marginBottom: 4 }}>
                            {item.degree}{item.field && <span style={{ color: 'var(--color-text-sub)', fontWeight: 500 }}> in {item.field}</span>}
                          </h3>
                          <div className="d-flex align-items-center gap-1">
                            <span style={{ fontWeight: 600, color: 'var(--color-text-sub)', fontSize: '0.9rem' }}>{item.institution}</span>
                            {item.institution_url && <a href={item.institution_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-muted)' }}><ExternalLink size={13} /></a>}
                          </div>
                        </div>
                      </div>
                      {item.grade && (
                        <span className="badge" style={{ background: '#fef9c3', color: '#854d0e', border: '1px solid #fde68a', fontSize: '0.8rem', padding: '0.4em 0.8em', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          Grade: {item.grade}
                        </span>
                      )}
                    </div>
                    <div className="d-flex align-items-center gap-1 mb-3" style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                      <Calendar size={12} /> {formatDate(item.start_date)} — {item.is_current ? 'Present' : formatDate(item.end_date)}
                    </div>
                    {item.description && <p style={{ color: 'var(--color-text-sub)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: item.achievements?.length ? '1rem' : 0 }}>{item.description}</p>}
                    {item.achievements?.length > 0 && (
                      <ul className="list-unstyled mb-0" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {item.achievements.map((ach, j) => (
                          <motion.li key={j} initial={{ opacity: 0, x: 8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.15 }} transition={{ delay: 0.4 + i * 0.1 + j * 0.05 }}
                            className="d-flex align-items-start gap-2" style={{ fontSize: '0.875rem', color: 'var(--color-text-sub)' }}>
                            <Award size={13} color="#8b5cf6" style={{ flexShrink: 0, marginTop: 3 }} />
                            {ach}
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
