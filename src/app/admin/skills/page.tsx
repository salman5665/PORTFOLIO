'use client'

import { useEffect, useState } from 'react'
import { Code2, Plus, Edit2, Trash2, Save, Trophy } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { adminDb } from '@/lib/adminDb'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import AdminTopBar from '@/components/admin/AdminTopBar'
import { useBodyScrollLock } from '@/lib/hooks/useBodyScrollLock'


const CATEGORIES = [
  'frontend',
  'backend',
  'languages',
  'database',
  'mobile',
  'cloud',
  'tools',
  'ai'
]
interface Skill {
  id: string; name: string; icon_slug: string; category: string; proficiency: number; is_featured: boolean; sort_order: number
}

interface CodingProfilesSetting {
  status: 'draft' | 'published'
  github_url: string
  leetcode_url: string
}

const DEFAULT_CODING_PROFILES: CodingProfilesSetting = {
  status: 'draft',
  github_url: '',
  leetcode_url: '',
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [codingProfiles, setCodingProfiles] = useState<CodingProfilesSetting>(DEFAULT_CODING_PROFILES)
  const [activeCategory, setActiveCategory] = useState('frontend')
  const [loading, setLoading] = useState(true)
  const [savingCodingProfiles, setSavingCodingProfiles] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [form, setForm] = useState({ name: '', icon_slug: '', category: 'frontend', proficiency: 80 })
  useBodyScrollLock(showForm)

  const fetchSkills = async () => {
    const { data, error } = await adminDb.from('skills').select({ order: 'sort_order' })
    if (error) toast.error('Failed to load skills: ' + error)
    setSkills((data as Skill[]) || [])
    setLoading(false)
  }

  const fetchCodingProfiles = async () => {
    const { data } = await adminDb.from('settings').single({ where: { key: 'coding_profiles' } })
    const value = (data as { value?: Partial<CodingProfilesSetting> } | null)?.value
    if (value) {
      setCodingProfiles({
        status: value.status === 'published' ? 'published' : 'draft',
        github_url: value.github_url || '',
        leetcode_url: value.leetcode_url || '',
      })
    }
  }

  useEffect(() => {
    fetchSkills()
    fetchCodingProfiles()
  }, [])

  const handleSave = async () => {
    if (!form.name) { toast.error('Name is required'); return }
    let result
    if (editing) {
      result = await adminDb.from('skills').update(form, editing.id)
      if (!result.error) toast.success('Skill updated!')
    } else {
      result = await adminDb.from('skills').insert({ ...form, sort_order: skills.length })
      if (!result.error) toast.success('Skill added!')
    }
    if (result.error) { toast.error('Save failed: ' + result.error); return }
    setShowForm(false); setEditing(null)
    setForm({ name: '', icon_slug: '', category: activeCategory, proficiency: 80 })
    fetchSkills()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return
    const { error } = await adminDb.from('skills').delete(id)
    if (error) { toast.error('Delete failed: ' + error); return }
    setSkills(prev => prev.filter(s => s.id !== id))
    toast.success('Skill deleted.')
  }

  const startEdit = (skill: Skill) => {
    setEditing(skill)
    setForm({ name: skill.name, icon_slug: skill.icon_slug || '', category: skill.category, proficiency: skill.proficiency })
    setShowForm(true)
  }

  const saveCodingProfiles = async (status = codingProfiles.status) => {
    setSavingCodingProfiles(true)
    const value = {
      ...codingProfiles,
      status,
      github_url: codingProfiles.github_url.trim(),
      leetcode_url: codingProfiles.leetcode_url.trim(),
    }
    const { error } = await adminDb.from('settings').upsert({
      key: 'coding_profiles',
      value,
      updated_at: new Date().toISOString(),
    })
    setSavingCodingProfiles(false)
    if (error) {
      toast.error('Failed to save coding profiles: ' + error)
      return
    }
    setCodingProfiles(value)
    toast.success(status === 'published' ? 'Coding profiles published.' : 'Coding profiles saved as draft.')
  }

  const filtered = skills.filter(s => s.category === activeCategory)

  return (
    <>
      <AdminTopBar
        title="Skills"
        subtitle={`${skills.length} total skills`}
        action={
          <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', icon_slug: '', category: activeCategory, proficiency: 80 }) }}
            className="btn btn-sm d-flex align-items-center gap-2" style={{ background: 'var(--admin-text)', color: 'var(--admin-surface)', borderRadius: 10 }} id="admin-add-skill">
            <Plus size={15} /> Add Skill
          </button>
        }
      />

      <div className="admin-page-content">
        <div className="card shadow-sm mb-4" style={{ borderRadius: 16, border: '1px solid var(--admin-border)' }}>
          <div className="card-body p-4 p-md-5">
            <div className="d-flex flex-column flex-lg-row align-items-lg-start justify-content-between gap-4 mb-4">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2" style={{ color: '#67e8f9', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  <Code2 size={14} /> Coding Profiles
                </div>
                <h2 style={{ color: 'var(--admin-text)', fontSize: '1.2rem', fontWeight: 800, marginBottom: 6 }}>
                  GitHub & LeetCode Display
                </h2>
                <p style={{ color: 'var(--admin-text-sub)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0, maxWidth: 620 }}>
                  Add profile URLs here and choose Published when you want them to appear on the portfolio. Draft keeps the section hidden.
                </p>
              </div>

              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="badge" style={{
                  background: codingProfiles.status === 'published' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(148, 163, 184, 0.12)',
                  color: codingProfiles.status === 'published' ? '#86efac' : 'var(--admin-text-sub)',
                  border: codingProfiles.status === 'published' ? '1px solid rgba(34,197,94,0.24)' : '1px solid rgba(148,163,184,0.18)',
                  padding: '0.55rem 0.75rem',
                  fontWeight: 800,
                }}>
                  {codingProfiles.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-lg-6">
                <label className="form-label" htmlFor="coding-github-url">GitHub Profile URL</label>
                <div className="admin-icon-field">
                  <FaGithub size={15} className="admin-icon-field-icon" />
                  <input
                    id="coding-github-url"
                    type="url"
                    className="form-control admin-icon-field-input"
                    value={codingProfiles.github_url}
                    onChange={e => setCodingProfiles(p => ({ ...p, github_url: e.target.value }))}
                    placeholder="https://github.com/your-username"
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <label className="form-label" htmlFor="coding-leetcode-url">LeetCode Profile URL</label>
                <div className="admin-icon-field">
                  <Trophy size={15} className="admin-icon-field-icon" />
                  <input
                    id="coding-leetcode-url"
                    type="url"
                    className="form-control admin-icon-field-input"
                    value={codingProfiles.leetcode_url}
                    onChange={e => setCodingProfiles(p => ({ ...p, leetcode_url: e.target.value }))}
                    placeholder="https://leetcode.com/u/your-username"
                  />
                </div>
              </div>
            </div>

            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-sm-end">
              <button
                type="button"
                onClick={() => saveCodingProfiles('draft')}
                disabled={savingCodingProfiles}
                className="btn btn-outline-dark d-inline-flex align-items-center justify-content-center gap-2"
                style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)', borderRadius: 10 }}
              >
                {savingCodingProfiles && codingProfiles.status === 'draft' ? <span className="spinner-border spinner-border-sm" role="status" /> : <Save size={15} />}
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => saveCodingProfiles('published')}
                disabled={savingCodingProfiles || (!codingProfiles.github_url.trim() && !codingProfiles.leetcode_url.trim())}
                className="btn d-inline-flex align-items-center justify-content-center gap-2"
                style={{ background: 'linear-gradient(135deg, #67e8f9, #38bdf8 52%, #8b5cf6)', color: '#020617', border: 0, borderRadius: 10, fontWeight: 800 }}
              >
                {savingCodingProfiles && codingProfiles.status === 'published' ? <span className="spinner-border spinner-border-sm" role="status" /> : <Code2 size={15} />}
                Publish to Portfolio
              </button>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="btn btn-sm text-capitalize"
              style={{
                borderRadius: 10, fontSize: '0.8rem', fontWeight: 600,
                background: activeCategory === cat ? 'var(--admin-text)' : 'var(--admin-surface)',
                color: activeCategory === cat ? 'var(--admin-surface)' : 'var(--admin-text-sub)',
                border: activeCategory === cat ? '1px solid var(--admin-text)' : '1px solid var(--admin-border)',
              }} id={`admin-skills-tab-${cat}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-3">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div className="col" key={i}><div style={{ height: 80, background: 'var(--admin-border)', borderRadius: 12, animation: 'pulse 1.5s ease-in-out infinite' }} /></div>
            ))
          ) : filtered.length === 0 ? (
            <div className="col-12 text-center py-5" style={{ color: 'var(--admin-text-sub)' }}>
              <Code2 size={32} className="mb-2 d-block mx-auto opacity-50" />
              No {activeCategory} skills yet. Click "Add Skill" to get started.
            </div>
          ) : (
            filtered.map((skill) => (
              <motion.div key={skill.id} className="col" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <div className="card shadow-sm h-100 position-relative overflow-hidden" style={{ borderRadius: 12, border: '1px solid var(--admin-border)' }}>
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      {skill.icon_slug && (
                        <img src={`https://cdn.simpleicons.org/${skill.icon_slug}/475569`} alt={skill.name}
                          style={{ width: 20, height: 20, objectFit: 'contain', flexShrink: 0 }}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      )}
                      <span style={{ fontWeight: 600, color: 'var(--admin-text)', fontSize: '0.875rem', flex: 1 }}>{skill.name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--admin-text-sub)' }}>{skill.proficiency}%</span>
                    </div>
                    <div style={{ height: 4, background: 'var(--admin-border-soft)', borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
                      <div style={{ height: '100%', width: `${skill.proficiency}%`, background: 'linear-gradient(90deg, #22d3ee, #14b8a6, #8b5cf6)', borderRadius: 4, transition: 'width 0.8s ease' }} />
                    </div>
                    <div className="d-flex gap-2 justify-content-end">
                      <button onClick={() => startEdit(skill)} aria-label={`Edit ${skill.name}`} className="btn btn-sm d-flex align-items-center justify-content-center"
                        style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-sub)' }}>
                        <Edit2 size={12} />
                      </button>
                      <button onClick={() => handleDelete(skill.id)} aria-label={`Delete ${skill.name}`} className="btn btn-sm d-flex align-items-center justify-content-center"
                        style={{ width: 30, height: 30, borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            data-lenis-prevent
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center overflow-auto p-3 overlay-scroll-lock"
            style={{ zIndex: 1060, background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
              className="card shadow-lg" style={{ maxWidth: 460, width: '100%', borderRadius: 16, border: '1px solid var(--admin-border)', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}>
              <div className="card-body p-4 p-md-5">
                <h2 style={{ fontWeight: 800, color: 'var(--admin-text)', fontSize: '1.125rem', marginBottom: '1.5rem' }}>
                  {editing ? 'Edit Skill' : 'Add Skill'}
                </h2>
                <div className="mb-3">
                  <label className="form-label" htmlFor="skill-name">Skill Name *</label>
                  <input id="skill-name" type="text" className="form-control" placeholder="e.g. React" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="skill-icon-slug">Icon Slug <span style={{ color: 'var(--admin-text-sub)', fontWeight: 400 }}>(simpleicons.org)</span></label>
                  <input id="skill-icon-slug" type="text" className="form-control font-mono" placeholder="e.g. react, typescript, nextdotjs" value={form.icon_slug} onChange={e => setForm(f => ({ ...f, icon_slug: e.target.value }))} />
                  {form.icon_slug && (
                    <div className="d-flex align-items-center gap-2 mt-2">
                      <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-sub)' }}>Preview:</span>
                      <img src={`https://cdn.simpleicons.org/${form.icon_slug}/475569`} alt="preview" style={{ width: 20, height: 20 }}
                        onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3' }} />
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="skill-category">Category</label>
                  <select id="skill-category" className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c} value={c} className="text-capitalize">{c}</option>)}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="form-label" htmlFor="skill-proficiency">Proficiency: <strong>{form.proficiency}%</strong></label>
                  <input id="skill-proficiency" type="range" min={10} max={100} step={5} value={form.proficiency}
                    onChange={e => setForm(f => ({ ...f, proficiency: parseInt(e.target.value) }))}
                    className="form-range" style={{ accentColor: '#22d3ee' }} />
                  <div style={{ height: 4, background: 'var(--admin-border-soft)', borderRadius: 4, overflow: 'hidden', marginTop: 4 }}>
                    <div style={{ height: '100%', width: `${form.proficiency}%`, background: 'linear-gradient(90deg, #22d3ee, #14b8a6, #8b5cf6)', borderRadius: 4, transition: 'width 0.3s ease' }} />
                  </div>
                </div>
                <div className="d-flex gap-3">
                  <button onClick={() => setShowForm(false)} className="btn btn-outline-dark flex-fill">Cancel</button>
                  <button onClick={handleSave} className="btn flex-fill" style={{ background: 'var(--admin-text)', color: 'var(--admin-surface)' }} id="skill-save">
                    Save Skill
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
