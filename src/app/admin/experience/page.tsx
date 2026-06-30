'use client'

import { useEffect, useState } from 'react'
import { Briefcase, Plus, Edit2, Trash2 } from 'lucide-react'
import { adminDb } from '@/lib/adminDb'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import AdminTopBar from '@/components/admin/AdminTopBar'
import { useBodyScrollLock } from '@/lib/hooks/useBodyScrollLock'

interface Exp { id: string; company: string; role: string; type: string; start_date: string; end_date: string | null; is_current: boolean; location: string; description: string; technologies: string[] }
const emptyForm = { company: '', role: '', type: 'internship', start_date: '', end_date: '', is_current: false, location: '', description: '', technologies: [] as string[] }

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Exp[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Exp | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [techInput, setTechInput] = useState('')
  useBodyScrollLock(showForm)

  const fetchData = async () => {
    const { data, error } = await adminDb.from('experiences').select({ order: 'sort_order' })
    if (error) toast.error('Failed to load: ' + error)
    setItems((data as Exp[]) || []); setLoading(false)
  }
  useEffect(() => { fetchData() }, [])

  const open = (item?: Exp) => {
    if (item) { setEditing(item); setForm({ company: item.company, role: item.role, type: item.type, start_date: item.start_date, end_date: item.end_date || '', is_current: item.is_current, location: item.location || '', description: item.description || '', technologies: item.technologies || [] }) }
    else { setEditing(null); setForm(emptyForm) }
    setTechInput(''); setShowForm(true)
  }

  const save = async () => {
    if (!form.company || !form.role) { toast.error('Company and role are required'); return }
    const payload = { ...form, end_date: form.is_current ? null : form.end_date || null }
    let result
    if (editing) {
      result = await adminDb.from('experiences').update(payload, editing.id)
      if (!result.error) toast.success('Updated!')
    } else {
      result = await adminDb.from('experiences').insert({ ...payload, sort_order: items.length })
      if (!result.error) toast.success('Added!')
    }
    if (result.error) { toast.error('Save failed: ' + result.error); return }
    setShowForm(false); fetchData()
  }

  const del = async (id: string) => {
    if (!confirm('Delete?')) return
    const { error } = await adminDb.from('experiences').delete(id)
    if (error) { toast.error('Delete failed: ' + error); return }
    setItems(p => p.filter(i => i.id !== id)); toast.success('Deleted.')
  }

  const addTech = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && techInput.trim()) {
      setForm(f => ({ ...f, technologies: [...f.technologies, techInput.trim()] }))
      setTechInput('')
    }
  }

  return (
    <>
      <AdminTopBar
        title="Experience"
        subtitle={`${items.length} entries`}
        action={
          <button onClick={() => open()} className="btn btn-sm d-flex align-items-center gap-2"
            style={{ background: 'var(--admin-text)', color: 'var(--admin-surface)', borderRadius: 10 }} id="admin-add-exp">
            <Plus size={15} /> Add Experience
          </button>
        }
      />

      <div className="admin-page-content">
        <div className="d-flex flex-column gap-3">
          {loading ? Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ height: 80, background: 'var(--admin-surface)', borderRadius: 12, border: '1px solid var(--admin-border)', animation: 'pulse 1.5s ease-in-out infinite' }} />
          )) : items.length === 0 ? (
            <div className="card text-center py-5" style={{ borderRadius: 14, border: '2px dashed var(--admin-border)', color: 'var(--admin-text-sub)' }}>
              <Briefcase size={36} className="mb-2 d-block mx-auto opacity-50" />
              <p className="mb-0">No experience entries yet. Click "Add Experience" to get started.</p>
            </div>
          ) : (
            items.map((item) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="card shadow-sm" style={{ borderRadius: 12, border: '1px solid var(--admin-border)' }}>
                <div className="card-body p-4 d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0" style={{ width: 44, height: 44, background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.28)' }}>
                    <Briefcase size={18} color="#67e8f9" />
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div style={{ fontWeight: 700, color: 'var(--admin-text)', fontSize: '0.9rem' }}>{item.role}</div>
                    <div style={{ color: '#67e8f9', fontSize: '0.875rem', fontWeight: 600 }}>{item.company}</div>
                    <div style={{ color: 'var(--admin-text-sub)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>{item.start_date} - {item.is_current ? 'Present' : item.end_date}</div>
                  </div>
                  <span className="badge bg-secondary text-capitalize me-2" style={{ fontSize: '0.75rem', padding: '0.4em 0.8em' }}>{item.type}</span>
                  <div className="d-flex gap-2">
                    <button onClick={() => open(item)} aria-label={`Edit ${item.role}`} className="btn btn-sm d-flex align-items-center justify-content-center" style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-sub)' }}><Edit2 size={13} /></button>
                    <button onClick={() => del(item.id)} aria-label={`Delete ${item.role}`} className="btn btn-sm d-flex align-items-center justify-content-center" style={{ width: 34, height: 34, borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}><Trash2 size={13} /></button>
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
                <h2 style={{ fontWeight: 800, color: 'var(--admin-text)', fontSize: '1.125rem', marginBottom: '1.5rem' }}>{editing ? 'Edit Experience' : 'Add Experience'}</h2>
                <div className="row g-3 mb-3">
                  <div className="col-sm-6">
                    <label className="form-label">Company *</label>
                    <input className="form-control" placeholder="Company name" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Role *</label>
                    <input className="form-control" placeholder="Your position" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Location</label>
                    <input className="form-control" placeholder="City, Remote..." value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Type</label>
                    <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                      {['job', 'internship', 'freelance', 'contract'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Start Date</label>
                    <input type="date" className="form-control" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Currently working here</label>
                    <div className="form-check form-switch mt-2">
                      <input className="form-check-input" type="checkbox" checked={form.is_current} onChange={e => setForm(f => ({ ...f, is_current: e.target.checked }))} id="is-current" style={{ width: 40, height: 20 }} />
                      <label className="form-check-label" htmlFor="is-current" style={{ color: 'var(--admin-text-sub)', fontSize: '0.875rem' }}>Active</label>
                    </div>
                  </div>
                  {!form.is_current && (
                    <div className="col-12">
                      <label className="form-label">End Date</label>
                      <input type="date" className="form-control" value={form.end_date || ''} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
                    </div>
                  )}
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'none' }} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Technologies <span style={{ color: 'var(--admin-text-sub)', fontWeight: 400 }}>(press Enter to add)</span></label>
                    <input className="form-control mb-2" placeholder="e.g. React" value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={addTech} />
                    <div className="d-flex flex-wrap gap-1">
                      {form.technologies.map((t, i) => (
                        <span key={i} className="badge bg-secondary d-flex align-items-center gap-1" style={{ fontSize: '0.8rem', padding: '0.4em 0.8em' }}>
                          {t} <button onClick={() => setForm(f => ({ ...f, technologies: f.technologies.filter((_, ti) => ti !== i) }))} style={{ background: 'none', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer', marginLeft: 2 }}>×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-3 pt-3" style={{ borderTop: '1px solid var(--admin-border)' }}>
                  <button onClick={() => setShowForm(false)} className="btn btn-outline-dark flex-fill">Cancel</button>
                  <button onClick={save} className="btn flex-fill" style={{ background: 'var(--admin-text)', color: 'var(--admin-surface)' }} id="exp-save">Save</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
