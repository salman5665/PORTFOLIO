'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Plus, Edit2, Trash2, Award, X } from 'lucide-react'
import { adminDb } from '@/lib/adminDb'
import { toast } from 'sonner'
import AdminTopBar from '@/components/admin/AdminTopBar'
import { useBodyScrollLock } from '@/lib/hooks/useBodyScrollLock'

interface Edu { id: string; institution: string; degree: string; field: string; start_date: string; end_date: string | null; is_current: boolean; grade: string; description: string; achievements: string[] }
const emptyForm = { institution: '', degree: '', field: '', start_date: '', end_date: '', is_current: false, grade: '', description: '', achievements: [] as string[] }

export default function AdminEducationPage() {
  const [items, setItems] = useState<Edu[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Edu | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [achInput, setAchInput] = useState('')
  useBodyScrollLock(showForm)

  const fetchData = async () => {
    const { data } = await adminDb.from('education').select({ order: 'sort_order' })
    setItems((data as Edu[]) || []); setLoading(false)
  }
  useEffect(() => { fetchData() }, [])

  const open = (item?: Edu) => {
    if (item) { setEditing(item); setForm({ institution: item.institution, degree: item.degree, field: item.field, start_date: item.start_date, end_date: item.end_date || '', is_current: item.is_current, grade: item.grade || '', description: item.description || '', achievements: item.achievements || [] }) }
    else { setEditing(null); setForm(emptyForm) }
    setAchInput(''); setShowForm(true)
  }

  const save = async () => {
    if (!form.institution || !form.degree) { toast.error('Institution and degree are required'); return }
    const payload = { ...form, end_date: form.is_current ? null : form.end_date || null }
    if (editing) { await adminDb.from('education').update(payload, editing.id); toast.success('Updated!') }
    else { await adminDb.from('education').insert({ ...payload, sort_order: items.length }); toast.success('Added!') }
    setShowForm(false); fetchData()
  }

  const del = async (id: string) => {
    if (!confirm('Delete?')) return
    await adminDb.from('education').delete(id)
    setItems(p => p.filter(i => i.id !== id)); toast.success('Deleted.')
  }

  return (
    <>
      <AdminTopBar title="Education" subtitle={`${items.length} entries`}
        action={
          <button onClick={() => open()} className="btn btn-sm d-flex align-items-center gap-2"
            style={{ background: 'var(--admin-text)', color: 'var(--admin-surface)', borderRadius: 10 }} id="admin-add-edu">
            <Plus size={15} /> Add Education
          </button>
        }
      />

      <div className="admin-page-content">
        <div className="d-flex flex-column gap-3">
          {loading ? Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ height: 80, background: 'var(--admin-surface)', borderRadius: 12, border: '1px solid var(--admin-border)', animation: 'pulse 1.5s ease-in-out infinite' }} />
          )) : items.length === 0 ? (
            <div className="card text-center py-5" style={{ borderRadius: 14, border: '1px solid var(--admin-border)', color: 'var(--admin-text-sub)' }}>
              <GraduationCap size={36} className="mb-2 d-block mx-auto opacity-50" />
              <p className="mb-0">No education entries yet.</p>
            </div>
          ) : (
            items.map((item) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="card shadow-sm" style={{ borderRadius: 12, border: '1px solid var(--admin-border)' }}>
                <div className="card-body p-4 d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0" style={{ width: 44, height: 44, background: 'rgba(139,92,246,0.14)', border: '1px solid rgba(196,181,253,0.28)' }}>
                    <GraduationCap size={18} color="#c4b5fd" />
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div style={{ fontWeight: 700, color: 'var(--admin-text)', fontSize: '0.9rem' }}>{item.degree} in {item.field}</div>
                    <div style={{ color: '#c4b5fd', fontSize: '0.875rem', fontWeight: 600 }}>{item.institution}</div>
                    <div style={{ color: 'var(--admin-text-sub)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>{item.start_date} - {item.is_current ? 'Present' : item.end_date}</div>
                  </div>
                  {item.grade && <span className="badge bg-secondary me-2" style={{ fontSize: '0.75rem' }}>Grade: {item.grade}</span>}
                  <div className="d-flex gap-2">
                    <button onClick={() => open(item)} aria-label={`Edit ${item.degree}`} className="btn btn-sm d-flex align-items-center justify-content-center" style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-sub)' }}><Edit2 size={13} /></button>
                    <button onClick={() => del(item.id)} aria-label={`Delete ${item.degree}`} className="btn btn-sm d-flex align-items-center justify-content-center" style={{ width: 34, height: 34, borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}><Trash2 size={13} /></button>
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
              className="card shadow-lg" style={{ maxWidth: 560, width: '100%', borderRadius: 16, border: '1px solid var(--admin-border)', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}>
              <div className="card-body p-4 p-md-5">
                <h2 style={{ fontWeight: 800, color: 'var(--admin-text)', fontSize: '1.125rem', marginBottom: '1.5rem' }}>{editing ? 'Edit Education' : 'Add Education'}</h2>
                <div className="row g-3 mb-3">
                  <div className="col-12"><label className="form-label">Institution *</label><input className="form-control" placeholder="University or School" value={form.institution} onChange={e => setForm(f => ({ ...f, institution: e.target.value }))} /></div>
                  <div className="col-sm-6"><label className="form-label">Degree *</label><input className="form-control" placeholder="e.g. Master of Science" value={form.degree} onChange={e => setForm(f => ({ ...f, degree: e.target.value }))} /></div>
                  <div className="col-sm-6"><label className="form-label">Field of Study</label><input className="form-control" placeholder="e.g. Computer Science" value={form.field} onChange={e => setForm(f => ({ ...f, field: e.target.value }))} /></div>
                  <div className="col-sm-6"><label className="form-label">Grade / CGPA</label><input className="form-control" placeholder="e.g. 8.5/10" value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))} /></div>
                  <div className="col-sm-6"><label className="form-label">Start Date</label><input type="date" className="form-control" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} /></div>
                  <div className="col-12">
                    <div className="form-check form-switch d-flex align-items-center gap-2">
                      <input className="form-check-input" type="checkbox" checked={form.is_current} onChange={e => setForm(f => ({ ...f, is_current: e.target.checked }))} id="edu-is-current" style={{ width: 40, height: 20 }} />
                      <label className="form-check-label" htmlFor="edu-is-current" style={{ color: 'var(--admin-text-sub)', fontSize: '0.875rem' }}>Currently studying here</label>
                    </div>
                  </div>
                  {!form.is_current && <div className="col-12"><label className="form-label">End Date</label><input type="date" className="form-control" value={form.end_date || ''} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} /></div>}
                  <div className="col-12"><label className="form-label">Description</label><textarea className="form-control" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'none' }} /></div>
                  <div className="col-12">
                    <label className="form-label">Achievements (press Enter)</label>
                    <div className="d-flex gap-2 mb-2">
                      <input className="form-control" placeholder="Add an achievement..." value={achInput} onChange={e => setAchInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && achInput.trim()) { setForm(f => ({ ...f, achievements: [...f.achievements, achInput.trim()] })); setAchInput('') } }} />
                    </div>
                    <div className="d-flex flex-column gap-1">
                      {form.achievements.map((ach, i) => (
                        <div key={i} className="d-flex align-items-center gap-2 p-2 rounded-3" style={{ background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)' }}>
                          <Award size={13} color="#c4b5fd" style={{ flexShrink: 0 }} />
                          <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--admin-text-sub)' }}>{ach}</span>
                          <button onClick={() => setForm(f => ({ ...f, achievements: f.achievements.filter((_, ti) => ti !== i) }))} aria-label={`Remove achievement ${i + 1}`} style={{ background: 'none', border: 'none', color: 'var(--admin-text-sub)', cursor: 'pointer' }}><X size={14} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-3 pt-3" style={{ borderTop: '1px solid var(--admin-border)' }}>
                  <button onClick={() => setShowForm(false)} className="btn btn-outline-dark flex-fill">Cancel</button>
                  <button onClick={save} className="btn flex-fill" style={{ background: 'var(--admin-text)', color: 'var(--admin-surface)' }} id="edu-save">Save</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

