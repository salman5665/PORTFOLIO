'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react'
import { adminDb } from '@/lib/adminDb'
import { toast } from 'sonner'
import AdminTopBar from '@/components/admin/AdminTopBar'
import { useBodyScrollLock } from '@/lib/hooks/useBodyScrollLock'
import ImageUploader from '@/components/admin/image/ImageUploader'

interface Cert { id: string; title: string; issuer: string; issue_date: string; credential_id: string | null; credential_url: string | null; image_url: string | null }
const emptyForm = { title: '', issuer: '', issue_date: '', credential_id: '', credential_url: '', image_url: '' }

export default function AdminCertificatesPage() {
  const [items, setItems] = useState<Cert[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Cert | null>(null)
  const [form, setForm] = useState(emptyForm)
  useBodyScrollLock(showForm)

  const fetchData = async () => {
    const { data } = await adminDb.from('certificates').select({ order: 'issue_date', ascending: false })
    setItems((data as Cert[]) || []); setLoading(false)
  }
  useEffect(() => { fetchData() }, [])

  const open = (item?: Cert) => {
    if (item) { setEditing(item); setForm({ title: item.title, issuer: item.issuer, issue_date: item.issue_date, credential_id: item.credential_id || '', credential_url: item.credential_url || '', image_url: item.image_url || '' }) }
    else { setEditing(null); setForm(emptyForm) }
    setShowForm(true)
  }

  const save = async () => {
    if (!form.title || !form.issuer || !form.issue_date) { toast.error('Title, issuer, and date are required'); return }
    const payload = { ...form, credential_id: form.credential_id || null, credential_url: form.credential_url || null, image_url: form.image_url || null }
    if (editing) { await adminDb.from('certificates').update(payload, editing.id); toast.success('Updated!') }
    else { await adminDb.from('certificates').insert(payload); toast.success('Added!') }
    setShowForm(false); fetchData()
  }

  const del = async (id: string) => {
    if (!confirm('Delete?')) return
    await adminDb.from('certificates').delete(id)
    setItems(p => p.filter(i => i.id !== id)); toast.success('Deleted.')
  }

  return (
    <>
      <AdminTopBar title="Certificates" subtitle={`${items.length} entries`}
        action={
          <button onClick={() => open()} className="btn btn-sm d-flex align-items-center gap-2"
            style={{ background: 'var(--admin-text)', color: 'var(--admin-surface)', borderRadius: 10 }} id="admin-add-cert">
            <Plus size={15} /> Add Certificate
          </button>
        }
      />

      <div className="admin-page-content">
        {items.length === 0 && !loading ? (
          <div className="card text-center py-5" style={{ borderRadius: 14, border: '1px solid var(--admin-border)', color: 'var(--admin-text-sub)' }}>
            <Award size={36} className="mb-2 d-block mx-auto opacity-50" />
            <p className="mb-0">No certificates added yet.</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
            {items.map((item, i) => (
              <motion.div key={item.id} className="col" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="card shadow-sm h-100 overflow-hidden" style={{ borderRadius: 12, border: '1px solid var(--admin-border)' }}>
                  <div className="position-relative overflow-hidden" style={{ height: 160 }}>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-100 h-100" style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: '#fef9c3' }}>
                        <Award size={40} color="#ca8a04" />
                      </div>
                    )}
                    <div className="position-absolute top-0 end-0 m-2 d-flex gap-1">
                      <button onClick={() => open(item)} aria-label={`Edit ${item.title}`} className="btn btn-sm d-flex align-items-center justify-content-center" style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.9)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-sub)' }}><Edit2 size={12} /></button>
                      <button onClick={() => del(item.id)} aria-label={`Delete ${item.title}`} className="btn btn-sm d-flex align-items-center justify-content-center" style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.9)', border: '1px solid var(--admin-border)', color: '#dc2626' }}><Trash2 size={12} /></button>
                    </div>
                  </div>
                  <div className="card-body p-3">
                    <h3 style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--admin-text)', marginBottom: '0.5rem' }}>{item.title}</h3>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span style={{ color: '#67e8f9', fontSize: '0.8rem', fontWeight: 600 }}>{item.issuer}</span>
                      <span style={{ color: 'var(--admin-text-sub)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>{item.issue_date}</span>
                    </div>
                    {item.credential_url && (
                      <a href={item.credential_url} target="_blank" rel="noopener noreferrer"
                        className="d-flex align-items-center gap-1" style={{ fontSize: '0.75rem', color: 'var(--admin-text-sub)', textDecoration: 'none' }}>
                        Verify Credential <ExternalLink size={11} />
                      </a>
                    )}
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
                <h2 style={{ fontWeight: 800, color: 'var(--admin-text)', fontSize: '1.125rem', marginBottom: '1.5rem' }}>{editing ? 'Edit Certificate' : 'Add Certificate'}</h2>
                <div className="mb-3"><label className="form-label">Title *</label><input className="form-control" placeholder="e.g. AWS Certified Solutions Architect" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
                <div className="mb-3"><label className="form-label">Issuer *</label><input className="form-control" placeholder="e.g. Amazon Web Services" value={form.issuer} onChange={e => setForm(f => ({ ...f, issuer: e.target.value }))} /></div>
                <div className="mb-3"><label className="form-label">Issue Date *</label><input type="date" className="form-control" value={form.issue_date} onChange={e => setForm(f => ({ ...f, issue_date: e.target.value }))} /></div>
                <div className="mb-3"><label className="form-label">Credential ID</label><input className="form-control" placeholder="e.g. AWS-123456" value={form.credential_id} onChange={e => setForm(f => ({ ...f, credential_id: e.target.value }))} /></div>
                <div className="mb-3"><label className="form-label">Credential URL</label><input type="url" className="form-control" placeholder="https://..." value={form.credential_url} onChange={e => setForm(f => ({ ...f, credential_url: e.target.value }))} /></div>
                <div className="mb-4">
                  <ImageUploader
                    value={form.image_url}
                    onChange={url => setForm(f => ({ ...f, image_url: url }))}
                    bucket="certificates"
                    label="Certificate Image"
                    aspectRatio="16/9"
                  />
                </div>
                <div className="d-flex gap-3 pt-3" style={{ borderTop: '1px solid var(--admin-border)' }}>
                  <button onClick={() => setShowForm(false)} className="btn btn-outline-dark flex-fill">Cancel</button>
                  <button onClick={save} className="btn flex-fill" style={{ background: 'var(--admin-text)', color: 'var(--admin-surface)' }} id="cert-save">Save</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

