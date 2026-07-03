'use client'

import { useRef } from 'react'
import { motion} from 'framer-motion'
import { Briefcase, MapPin, ExternalLink, Calendar } from 'lucide-react'
import type { Experience } from '@/lib/supabase/types'

function formatDate(d: string | null): string {
  if (!d) return ''
  const date = new Date(d)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[date.getUTCMonth()]
  const year = date.getUTCFullYear()
  return `${month} ${year}`
}

const TYPE_COLORS: Record<string, string> = {
  job: '#0ea5e9', internship: '#8b5cf6', freelance: '#f97316', contract: '#10b981',
}

interface Props { experiences: Experience[] }

export default function ExperienceSection({ experiences }: Props) {
  // Hide the entire section on the live site when there are no entries,
  // instead of showing an empty "No experience entries yet" placeholder.
  if (experiences.length === 0) return null

  return (
    <section id="experience" className="section section-alt">
      <div className="container" style={{ maxWidth: 800 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.15 }} transition={{ duration: 0.6 }} className="mb-5">
          <div className="section-tag"><Briefcase size={13} /> Experience</div>
          <h2 className="section-title">Work Experience</h2>
          <p className="section-subtitle">Professional roles and projects that have shaped my skills.</p>
        </motion.div>

        <div className="vs-timeline">
          {experiences.map((item, i) => (
            <motion.div key={item.id} className="vs-timeline-item"
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.15 }} transition={{ delay: 0.15 + i * 0.12, duration: 0.55 }}>
              <div className="vs-timeline-dot" />
              <motion.div className="card shadow-vs ms-2" whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} transition={{ duration: 0.2 }}>
                <div className="card-body p-4 p-md-5">
                  <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
                    <div>
                      <h3 style={{ fontWeight: 800, color: 'var(--color-text)', fontSize: '1.05rem', marginBottom: 4 }}>{item.role}</h3>
                      <div className="d-flex align-items-center flex-wrap gap-2">
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-sub)' }}>{item.company}</span>
                        {item.company_url && (
                          <a href={item.company_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-muted)' }}>
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                    <span className="badge d-flex align-items-center gap-1"
                      style={{ background: TYPE_COLORS[item.type] + '15', color: TYPE_COLORS[item.type], border: `1px solid ${TYPE_COLORS[item.type]}30`, fontSize: '0.72rem', fontWeight: 700, padding: '0.4em 0.8em', textTransform: 'capitalize' }}>
                      {item.type}
                    </span>
                  </div>
                  <div className="d-flex flex-wrap gap-3 mb-3" style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                    <span className="d-flex align-items-center gap-1">
                      <Calendar size={12} /> {formatDate(item.start_date)} - {item.is_current ? 'Present' : formatDate(item.end_date)}
                    </span>
                    {item.location && <span className="d-flex align-items-center gap-1"><MapPin size={12} /> {item.location}</span>}
                  </div>
                  {item.description && <p style={{ color: 'var(--color-text-sub)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: item.technologies?.length ? '1rem' : 0 }}>{item.description}</p>}
                  {item.technologies?.length > 0 && (
                    <div className="d-flex flex-wrap gap-1">
                      {item.technologies.map((t) => <span key={t} className="badge bg-secondary">{t}</span>)}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
