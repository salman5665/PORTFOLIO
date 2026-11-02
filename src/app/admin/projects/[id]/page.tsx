'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import ImageUploader from '@/components/admin/image/ImageUploader'
import Link from 'next/link'
import { adminDb } from '@/lib/adminDb'
import { toast } from 'sonner'
import slugify from 'slugify'
import AdminTopBar from '@/components/admin/AdminTopBar'
import type { Project } from '@/lib/supabase/types'

const CATEGORIES = ['web', 'mobile', 'api', 'ai', 'desktop', 'other']
const STATUS_OPTIONS = ['draft', 'published', 'archived']

export default function AdminProjectFormPage() {
  const router = useRouter()
  const params = useParams()
  const isNew = params?.id === 'new'
  const projectId = isNew ? null : (params?.id as string)

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [techInput, setTechInput] = useState('')

  const [form, setForm] = useState({
    title: '',
    slug: '',
    short_description: '',
    long_description: '',
    tech_stack: [] as string[],
    github_url: '',
    live_url: '',
    thumbnail_url: '',
    category: 'web',
    status: 'published',
    is_featured: false,
    sort_order: 0,
  })

  useEffect(() => {
    if (!isNew && projectId) {
      setLoading(true)
      adminDb.from('projects').single({ where: { id: projectId } }).then(({ data, error }) => {
        if (error) {
          toast.error('Failed to load project: ' + error)
        } else if (data) {
          const d = data as Project
          setForm({
            title: d.title,
            slug: d.slug,
            short_description: d.short_description || '',
            long_description: d.long_description || '',
            tech_stack: d.tech_stack || [],
            github_url: d.github_url || '',
            live_url: d.live_url || '',
            thumbnail_url: d.thumbnail_url || '',
            category: d.category || 'web',
            status: d.status || 'published',
            is_featured: d.is_featured || false,
            sort_order: d.sort_order || 0,
          })
        }
        setLoading(false)
      })
    }
  }, [projectId, isNew])

  const handleTitleChange = (title: string) => {
    setForm(f => ({
      ...f,
      title,
      slug: isNew ? slugify(title, { lower: true, strict: true }) : f.slug,
    }))
  }

  const addTech = () => {
    if (techInput.trim() && !form.tech_stack.includes(techInput.trim())) {
      setForm(f => ({ ...f, tech_stack: [...f.tech_stack, techInput.trim()] }))
      setTechInput('')
    }
  }

  const removeTech = (tech: string) => {
    setForm(f => ({ ...f, tech_stack: f.tech_stack.filter(t => t !== tech) }))
  }

  const handleSave = async () => {
    if (!form.title || !form.slug) {
      toast.error('Title and slug are required')
      return
    }
    setSaving(true)

    const payload = { ...form }

    if (isNew) {
      const { error } = await adminDb.from('projects').insert(payload)
      if (error) { toast.error('Failed to create project: ' + error); setSaving(false); return }
      toast.success('Project created! 🎉')
    } else {
      const { error } = await adminDb.from('projects').update(payload, projectId!)
      if (error) { toast.error('Failed to update project: ' + error); setSaving(false); return }
      toast.success('Project updated!')
    }

    setSaving(false)
    router.push('/admin/projects')
  }

  return (
    <>
      <AdminTopBar
        title={isNew ? 'New Project' : 'Edit Project'}
        subtitle={isNew ? 'Create a new portfolio project' : `Editing: ${form.title}`}
        action={
          <div className="d-flex align-items-center gap-2">
            <Link
              href="/admin/projects"
              className="btn btn-sm d-flex align-items-center gap-2"
              title="Back to Projects"
              aria-label="Back to Projects"
              style={{
                background: 'rgba(20, 16, 5, 0.62)',
                border: '1px solid var(--admin-border)',
                color: '#F5D77F',
                borderRadius: 10,
                padding: '0 12px',
                height: 36,
                fontWeight: 600,
                fontSize: '0.8rem',
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={16} color="#F5D77F" />
              <span className="d-none d-sm-inline">Back</span>
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn btn-sm d-flex align-items-center gap-2"
              style={{ background: 'var(--admin-text)', color: 'var(--admin-surface)', borderRadius: 10, fontWeight: 600, padding: '0 16px', height: 36 }}
              id="admin-project-save"
            >
              {saving ? <div className="spinner-border spinner-border-sm" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <Save size={15} />}
              Save Project
            </button>
          </div>
        }
      />

      <div className="admin-page-content">
        {loading ? (
          <div className="d-flex align-items-center justify-content-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : (
          <div className="row g-4">
            {/* Main Content */}
            <div className="col-lg-8">
              <div className="d-flex flex-column gap-4">
                
                {/* Basic Info */}
                <div className="card shadow-sm border-0" style={{ background: 'var(--admin-surface)', borderRadius: 14, border: '1px solid var(--admin-border)' }}>
                  <div className="card-header bg-transparent" style={{ borderBottom: '1px solid var(--admin-border)', padding: '1.25rem 1.5rem' }}>
                    <h5 className="mb-0" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text)' }}>Basic Info</h5>
                  </div>
                  <div className="card-body" style={{ padding: '1.5rem' }}>
                    <div className="mb-3">
                      <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--admin-text-sub)' }}>Title *</label>
                      <input type="text" value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Project title"
                        className="form-control" style={{ background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: 8, padding: '0.6rem 1rem' }} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--admin-text-sub)' }}>Slug *</label>
                      <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="project-slug"
                        className="form-control" style={{ background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: 8, padding: '0.6rem 1rem', fontFamily: 'var(--font-mono)' }} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--admin-text-sub)' }}>Short Description</label>
                      <input type="text" value={form.short_description} onChange={e => setForm(f => ({ ...f, short_description: e.target.value }))} placeholder="One-line summary"
                        className="form-control" style={{ background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: 8, padding: '0.6rem 1rem' }} />
                    </div>
                    <div className="mb-0">
                      <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--admin-text-sub)' }}>Long Description</label>
                      <textarea value={form.long_description} onChange={e => setForm(f => ({ ...f, long_description: e.target.value }))} placeholder="Detailed project description..." rows={6}
                        className="form-control" style={{ background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: 8, padding: '0.6rem 1rem', resize: 'vertical' }} />
                    </div>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="card shadow-sm border-0" style={{ background: 'var(--admin-surface)', borderRadius: 14, border: '1px solid var(--admin-border)' }}>
                  <div className="card-header bg-transparent" style={{ borderBottom: '1px solid var(--admin-border)', padding: '1.25rem 1.5rem' }}>
                    <h5 className="mb-0" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text)' }}>Tech Stack</h5>
                  </div>
                  <div className="card-body" style={{ padding: '1.5rem' }}>
                    <div className="d-flex gap-2 mb-3">
                      <input type="text" value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} placeholder="Add technology..."
                        className="form-control" style={{ background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: 8, padding: '0.6rem 1rem' }} />
                      <button onClick={addTech} className="btn d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ background: 'rgba(212, 175, 55, 0.1)', color: '#0ea5e9', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: 8, width: 42, height: 42 }}>
                        <Plus size={18} />
                      </button>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {form.tech_stack.map(tech => (
                        <span key={tech} className="badge d-flex align-items-center gap-2" style={{ background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', fontSize: '0.8rem', padding: '0.5rem 0.75rem', fontWeight: 500 }}>
                          {tech}
                          <button onClick={() => removeTech(tech)} className="btn-close btn-close-white" style={{ fontSize: '0.4rem', filter: 'invert(0.5)' }} aria-label="Remove"></button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div className="card shadow-sm border-0" style={{ background: 'var(--admin-surface)', borderRadius: 14, border: '1px solid var(--admin-border)' }}>
                  <div className="card-header bg-transparent" style={{ borderBottom: '1px solid var(--admin-border)', padding: '1.25rem 1.5rem' }}>
                    <h5 className="mb-0" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text)' }}>Links & Media</h5>
                  </div>
                  <div className="card-body" style={{ padding: '1.5rem' }}>
                    <div className="mb-3">
                      <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--admin-text-sub)' }}>GitHub URL</label>
                      <input type="url" value={form.github_url} onChange={e => setForm(f => ({ ...f, github_url: e.target.value }))} placeholder="https://github.com/..."
                        className="form-control" style={{ background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: 8, padding: '0.6rem 1rem' }} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--admin-text-sub)' }}>Live URL</label>
                      <input type="url" value={form.live_url} onChange={e => setForm(f => ({ ...f, live_url: e.target.value }))} placeholder="https://..."
                        className="form-control" style={{ background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: 8, padding: '0.6rem 1rem' }} />
                    </div>
                    <div className="mb-0">
                      <ImageUploader
                        value={form.thumbnail_url}
                        onChange={url => setForm(f => ({ ...f, thumbnail_url: url }))}
                        bucket="projects"
                        label="Thumbnail Image"
                        aspectRatio="16/9"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Sidebar Settings */}
            <div className="col-lg-4">
              <div className="d-flex flex-column gap-4 position-sticky" style={{ top: 100 }}>
                
                <div className="card shadow-sm border-0" style={{ background: 'var(--admin-surface)', borderRadius: 14, border: '1px solid var(--admin-border)' }}>
                  <div className="card-header bg-transparent" style={{ borderBottom: '1px solid var(--admin-border)', padding: '1.25rem 1.5rem' }}>
                    <h5 className="mb-0" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text)' }}>Settings</h5>
                  </div>
                  <div className="card-body" style={{ padding: '1.5rem' }}>
                    
                    <div className="mb-4">
                      <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--admin-text-sub)' }}>Category</label>
                      <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                        className="form-select" style={{ background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: 8, padding: '0.6rem 1rem' }}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--admin-text-sub)' }}>Status</label>
                      <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                        className="form-select" style={{ background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: 8, padding: '0.6rem 1rem' }}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div className="mb-4 d-flex align-items-center justify-content-between">
                      <label className="form-label mb-0" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--admin-text)' }}>Featured</label>
                      <div className="form-check form-switch m-0 p-0" style={{ display: 'flex', alignItems: 'center' }}>
                        <input className="form-check-input m-0" type="checkbox" role="switch" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} 
                          style={{ width: '2.5rem', height: '1.25rem', cursor: 'pointer' }} />
                      </div>
                    </div>

                    <div className="mb-0">
                      <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--admin-text-sub)' }}>Sort Order</label>
                      <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                        className="form-control" style={{ background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: 8, padding: '0.6rem 1rem' }} />
                    </div>

                  </div>
                </div>

                {/* Thumbnail preview now handled by ImageUploader above */}

              </div>
            </div>
            
          </div>
        )}
      </div>
    </>
  )
}
