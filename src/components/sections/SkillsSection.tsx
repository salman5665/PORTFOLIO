'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, Layers } from 'lucide-react'
import Image from 'next/image'
import type { Skill } from '@/lib/supabase/types'

type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'languages'
  | 'database'
  | 'mobile'
  | 'cloud'
  | 'tools'
  | 'ai'

const CATEGORIES: { key: SkillCategory; label: string; color: string }[] = [
  { key: 'frontend', label: 'Frontend', color: '#0ea5e9' },
  { key: 'backend', label: 'Backend', color: '#8b5cf6' },
  { key: 'languages', label: 'Languages', color: '#14b8a6' },
  { key: 'database', label: 'Database', color: '#ec4899' },
  { key: 'mobile', label: 'Mobile', color: '#f97316' },
  { key: 'cloud', label: 'Cloud', color: '#10b981' },
  { key: 'tools', label: 'Tools', color: '#64748b' },
  { key: 'ai', label: 'AI / ML', color: '#6366f1' },
]

interface Props { skills: Skill[] }

export default function SkillsSection({ skills }: Props) {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('frontend')
  // Only show categories that have skills
  const availableCategories = CATEGORIES.filter((c) => skills.some((s) => s.category === c.key))
  const currentCategory = CATEGORIES.find((c) => c.key === activeCategory) || CATEGORIES[0]
  const currentSkills = skills.filter((s) => s.category === activeCategory)

  // If active category has no skills, auto-switch to first available
  const effectiveCategory = currentSkills.length > 0 ? currentCategory : (availableCategories[0] || CATEGORIES[0])
  const displaySkills = skills.filter((s) => s.category === effectiveCategory.key)

  return (
    <section id="skills" className="section section-white">
      <div className="container" style={{ maxWidth: 1100 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.6 }} className="mb-5">
          <div className="section-tag"><Code2 size={13} /> Technical Skills</div>
          <h2 className="section-title">My Tech Arsenal</h2>
          <p className="section-subtitle">
            {skills.length > 0
              ? `${skills.length} technologies across ${availableCategories.length} categories — built through real project experience.`
              : 'A curated toolkit built through years of hands-on project experience.'}
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ delay: 0.2 }}>
          <ul className="nav nav-pills mb-5 flex-wrap gap-2">
            {(availableCategories.length > 0 ? availableCategories : CATEGORIES).map((cat) => (
              <li className="nav-item" key={cat.key}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                  className={`nav-link ${(activeCategory === cat.key) ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.key)}
                  id={`skills-tab-${cat.key}`}>
                  {cat.label}
                </motion.button>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Skills Grid */}
        <AnimatePresence mode="wait">
          <motion.div key={activeCategory}
            className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            {displaySkills.length === 0 ? (
              <div className="col-12 text-center py-5" style={{ color: 'var(--color-text-muted)' }}>
                <Layers size={36} className="mb-2 opacity-50 d-block mx-auto" />
                <p className="mb-0">No skills in this category yet. Add them from the admin panel.</p>
              </div>
            ) : (
              displaySkills.map((skill, i) => (
                <motion.div key={skill.id} className="col"
                  initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }
                  }}>
                  <motion.div className="card shadow-vs h-100"
                    whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }} transition={{ duration: 0.2 }}>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        {skill.icon_slug ? (
                          <>
                            <img
                              src={`https://cdn.simpleicons.org/${(() => {
                                const s = skill.icon_slug.toLowerCase().replace(/[^a-z0-9]/g, '');
                                const map: Record<string, string> = { 
                                  'css3': 'css', 'nodejs': 'nodedotjs', 'nextjs': 'nextdotjs', 
                                  'reactjs': 'react', 'aws': 'amazonaws', 'vscode': 'visualstudiocode',
                                  'vuejs': 'vuedotjs', 'js': 'javascript', 'ts': 'typescript',
                                  'opencode': 'github'
                                };
                                return map[s] || s;
                              })()}/${effectiveCategory.color.replace('#', '')}`}
                              alt={skill.name} width={24} height={24}
                              style={{ objectFit: 'contain', opacity: 0.9, flexShrink: 0 }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const next = e.currentTarget.nextElementSibling as HTMLElement;
                                if (next) next.style.display = 'block';
                              }}
                            />
                            <div className="skill-fallback" style={{ display: 'none', width: 24, height: 24, borderRadius: 6, background: effectiveCategory.color + '25', flexShrink: 0 }} />
                          </>
                        ) : (
                          <div style={{ width: 24, height: 24, borderRadius: 6, background: effectiveCategory.color + '25', flexShrink: 0 }} />
                        )}
                        <span style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.875rem', flex: 1 }}>{skill.name}</span>
                        
{/*
<span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: effectiveCategory.color, fontWeight: 700 }}>
                          {skill.proficiency}%
                        </span> */}


                      </div>
                      <div className="skill-bar-track">
                        <motion.div
                          className="skill-bar-fill"
                          variants={{
                            hidden: { scaleX: 0 },
                            visible: { 
                              scaleX: skill.proficiency / 100,
                              transition: { duration: 1.4, ease: 'easeOut', delay: 0.3 + i * 0.04 }
                            }
                          }}
                          style={{ backgroundColor: effectiveCategory.color, transformOrigin: 'left' }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {skills.length > 0 && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.1 }} transition={{ delay: 0.8 }}
            className="text-center mt-5">
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              {skills.length} skills · {availableCategories.length} categories
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
