'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Plus, Edit2, Trash2, Star } from 'lucide-react'
import { adminDb } from '@/lib/adminDb'
import { toast } from 'sonner'
import AdminTopBar from '@/components/admin/AdminTopBar'
import { useBodyScrollLock } from '@/lib/hooks/useBodyScrollLock'
import ImageUploader from '@/components/admin/image/ImageUploader'

interface Testimonial { id: string; name: string; role: string; company: string; content: string; rating: number; avatar_url: string | null; is_featured: boolean; sort_order: number }
const emptyForm = { name: '', role: '', company: '', content: '', rating: 5, avatar_url: '', is_featured: false }

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState(emptyForm)
  useBodyScrollLock(showForm)

  const fetchData = async () => {
    const { data } = await adminDb.from('testimonials').select({ order: 'sort_order' })
    setItems((data as Testimonial[]) || []); setLoading(false)
  }
  useEffect(() => { fetchData() }, [])

  const open = (item?: Testimonial) => {
    if (item) { setEditing(item); setForm({ name: item.name, role: item.role || '', company: item.company || '', content: item.content, rating: item.rating || 5, avatar_url: item.avatar_url || '', is_featured: item.is_featured || false }) }
    else { setEditing(null); setForm(emptyForm) }
    setShowForm(true)
  }

  const save = async () => {
    if (!form.name || !form.content) { toast.error('Name and content are required'); return }
    const payload = { ...form, avatar_url: form.avatar_url || null }
    if (editing) { await adminDb.from('testimonials').update(payload, editing.id); toast.success('Updated!') }
    else { await adminDb.from('testimonials').insert({ ...payload, sort_order: items.length }); toast.success('Added!') }
    setShowForm(false); fetchData()
  }

  const del = async (id: string) => {
    if (!confirm('Delete?')) return
    await adminDb.from('testimonials').delete(id)
    setItems(p => p.filter(i => i.id !== id)); toast.success('Deleted.')
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    await adminDb.from('testimonials').update({ is_featured: !current }, id)
    setItems(prev => prev.map(p => p.id === id ? { ...p, is_featured: !current } : p))
    toast.success(current ? 'Removed from featured' : 'Marked as featured')
  }

  return (
    <>
      <AdminTopBar title="Testimonials" subtitle={`${items.length} entries`}
        action={
          <button onClick={() => open()} className="btn btn-sm d-flex align-items-center gap-2"
            style={{ background: 'var(--admin-text)', color: 'var(--admin-surface)', borderRadius: 10 }} id="admin-add-testimonial">
            <Plus size={15} /> Add Testimonial
          </button>
        }
      />

      <div className="admin-page-content">
        {items.length === 0 && !loading ? (
          <div className="card text-center py-5" style={{ borderRadius: 14, border: '1px solid var(--admin-border)', color: 'var(--admin-text-sub)' }}>
            <Quote size={36} className="mb-2 d-block mx-auto opacity-50" />
            <p className="mb-0">No testimonials added yet.</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {items.map((item, i) => (
              <motion.div key={item.id} className="col" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="card shadow-sm h-100 position-relative" style={{ borderRadius: 12, border: '1px solid var(--admin-border)' }}>
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex gap-1">
                        {Array.from({ length: item.rating }).map((_, j) => <Star key={j} size={13} style={{ fill: '#ca8a04', color: '#ca8a04' }} />)}
                      </div>
                      <div className="d-flex gap-1">
                        <button onClick={() => toggleFeatured(item.id, item.is_featured)} aria-label="Toggle featured"
                          className="btn btn-sm d-flex align-items-center justify-content-center"
                          style={{ width: 30, height: 30, borderRadius: 8, background: item.is_featured ? '#fef9c3' : 'var(--admin-main-bg)', border: item.is_featured ? '1px solid #fde68a' : '1px solid var(--admin-border)', color: item.is_featured ? '#ca8a04' : 'var(--admin-text-sub)' }}>
                          <Star size={13} fill={item.is_featured ? 'currentColor' : 'none'} />
                        </button>
                        <button onClick={() => open(item)} aria-label={`Edit ${item.name}`} className="btn btn-sm d-flex align-items-center justify-content-center"
                          style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-sub)' }}><Edit2 size={12} /></button>
                        <button onClick={() => del(item.id)} aria-label={`Delete ${item.name}`} className="btn btn-sm d-flex align-items-center justify-content-center"
                          style={{ width: 30, height: 30, borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}><Trash2 size={12} /></button>
                      </div>
                    </div>
                    <Quote size={18} style={{ color: '#cbd5e1', marginBottom: 8 }} />
                    <p className="flex-grow-1 mb-4" style={{ color: 'var(--admin-text-sub)', fontSize: '0.875rem', lineHeight: 1.7, fontStyle: 'italic' }}>&ldquo;{item.content}&rdquo;</p>
                    <div className="d-flex align-items-center gap-2 pt-3" style={{ borderTop: '1px solid var(--admin-border-soft)' }}>
                      {item.avatar_url ? (
                        <img src={item.avatar_url} alt={item.name} className="rounded-circle" style={{ width: 36, height: 36, objectFit: 'cover', border: '2px solid var(--admin-border)' }} />
                      ) : (
                        <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 36, height: 36, background: 'rgba(212, 175, 55,0.12)', border: '1px solid rgba(212, 175, 55,0.28)', fontWeight: 700, color: '#F5D77F', fontSize: '0.8rem' }}>
                          {item.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--admin-text)', fontSize: '0.825rem' }}>{item.name}</div>
                        <div style={{ color: 'var(--admin-text-sub)', fontSize: '0.75rem' }}>{item.role}{item.company && ` at ${item.company}`}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            data-lenis-prevent
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center overflow-auto p-3 overlay-scroll-lock"
            style={{ zIndex: 1060, background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
              className="card shadow-lg" style={{ maxWidth: 520, width: '100%', borderRadius: 16, border: '1px solid var(--admin-border)', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}>
              <div className="card-body p-4 p-md-5">
                <h2 style={{ fontWeight: 800, color: 'var(--admin-text)', fontSize: '1.125rem', marginBottom: '1.5rem' }}>{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                <div className="row g-3 mb-3">
                  <div className="col-12"><label className="form-label">Client Name *</label><input className="form-control" placeholder="e.g. John Doe" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                  <div className="col-sm-6"><label className="form-label">Role</label><input className="form-control" placeholder="e.g. CEO" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} /></div>
                  <div className="col-sm-6"><label className="form-label">Company</label><input className="form-control" placeholder="e.g. Acme Corp" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} /></div>
                  <div className="col-12"><label className="form-label">Content *</label><textarea className="form-control" rows={4} placeholder="Their feedback..." value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} style={{ resize: 'none' }} /></div>
                  <div className="col-sm-6">
                    <label className="form-label">Rating (1-5)</label>
                    <input type="number" min={1} max={5} className="form-control" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: parseInt(e.target.value) || 5 }))} />
                  </div>
                  <div className="col-sm-6 d-flex flex-column justify-content-end">
                    <div className="form-check form-switch d-flex align-items-center gap-2 mb-2">
                      <input className="form-check-input" type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} id="testimonial-featured" style={{ width: 40, height: 20 }} />
                      <label className="form-check-label" htmlFor="testimonial-featured" style={{ color: 'var(--admin-text-sub)', fontSize: '0.875rem' }}>Featured</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <ImageUploader
                      value={form.avatar_url}
                      onChange={url => setForm(f => ({ ...f, avatar_url: url }))}
                      bucket="avatars"
                      label="Avatar Photo"
                      aspectRatio="1/1"
                    />
                  </div>
                </div>
                <div className="d-flex gap-3 pt-3" style={{ borderTop: '1px solid var(--admin-border)' }}>
                  <button onClick={() => setShowForm(false)} className="btn btn-outline-dark flex-fill">Cancel</button>
                  <button onClick={save} className="btn flex-fill" style={{ background: 'var(--admin-text)', color: 'var(--admin-surface)' }} id="testimonial-save">Save</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

