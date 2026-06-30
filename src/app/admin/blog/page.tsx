'use client'

import { useEffect, useState, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Plus, Edit2, Trash2, Eye, EyeOff, ExternalLink, Tag, X, Calendar } from 'lucide-react'
import { adminDb } from '@/lib/adminDb'
import { toast } from 'sonner'
import Link from 'next/link'
import AdminTopBar from '@/components/admin/AdminTopBar'
import { useBodyScrollLock } from '@/lib/hooks/useBodyScrollLock'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image_url: string | null
  status: string
  published_at: string | null
  tags: string[]
}

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image_url: '',
  status: 'draft',
  tags: [] as string[],
  publish_date: '',
}

/** Convert an ISO string to the value format datetime-local expects: "YYYY-MM-DDThh:mm" */
const toDatetimeLocal = (iso: string | null): string => {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    // Pad helper
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  } catch {
    return ''
  }
}

export default function AdminBlogPage() {
  const [items, setItems] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [tagInput, setTagInput] = useState('')
  useBodyScrollLock(showForm)

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await adminDb.from('blog_posts').select({ order: 'created_at', ascending: false })
    if (error) toast.error('Failed to load posts: ' + error)
    setItems((data as BlogPost[]) || [])
    setLoading(false)
  }

  useEffect(() => { fetchPosts() }, [])

  const open = (item?: BlogPost) => {
    if (item) {
      setEditing(item)
      setForm({
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt || '',
        content: item.content,
        cover_image_url: item.cover_image_url || '',
        status: item.status,
        tags: item.tags ?? [],
        publish_date: toDatetimeLocal(item.published_at),
      })
    } else {
      setEditing(null)
      setForm(emptyForm)
    }
    setTagInput('')
    setShowForm(true)
  }

  // ── Tag helpers ──────────────────────────────────────────────────────────
  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, '-')
    if (!tag) return
    if (form.tags.includes(tag)) { setTagInput(''); return }
    setForm(f => ({ ...f, tags: [...f.tags, tag] }))
    setTagInput('')
  }

  const removeTag = (tag: string) =>
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', ',', ' '].includes(e.key)) {
      e.preventDefault()
      addTag(tagInput)
    } else if (e.key === 'Backspace' && !tagInput && form.tags.length > 0) {
      setForm(f => ({ ...f, tags: f.tags.slice(0, -1) }))
    }
  }

  // ── Save ─────────────────────────────────────────────────────────────────
  const save = async () => {
    if (!form.title || !form.slug || !form.content) {
      toast.error('Title, slug, and content are required')
      return
    }

    setSaving(true)

    // Resolve published_at:
    // 1. If user typed a custom date → use that
    // 2. Else if newly publishing → now
    // 3. Else keep existing value (or null)
    let published_at: string | null = editing?.published_at ?? null
    if (form.publish_date) {
      published_at = new Date(form.publish_date).toISOString()
    } else if (form.status === 'published' && (!editing || editing.status !== 'published')) {
      published_at = new Date().toISOString()
    }

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || null,
      content: form.content,
      cover_image_url: form.cover_image_url || null,
      status: form.status,
      tags: form.tags,
      published_at,
    }

    if (editing) {
      const { error } = await adminDb.from('blog_posts').update(payload, editing.id)
      if (error) { toast.error('Failed to update post: ' + error) }
      else { toast.success('Post updated!'); setShowForm(false); fetchPosts() }
    } else {
      const { error } = await adminDb.from('blog_posts').insert(payload)
      if (error) { toast.error('Failed to add post: ' + error) }
      else { toast.success('Post added!'); setShowForm(false); fetchPosts() }
    }

    setSaving(false)
  }

  const del = async (id: string) => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    const { error } = await adminDb.from('blog_posts').delete(id)
    if (error) {
      toast.error('Failed to delete post: ' + error)
    } else {
      setItems(p => p.filter(i => i.id !== id))
      toast.success('Post deleted.')
    }
  }

  const togglePublish = async (id: string, current: string) => {
    const newStatus = current === 'published' ? 'draft' : 'published'
    const updateData: Record<string, string | null> = { status: newStatus }
    if (newStatus === 'published') updateData.published_at = new Date().toISOString()

    const { error } = await adminDb.from('blog_posts').update(updateData, id)
    if (error) {
      toast.error('Failed to update status: ' + error)
    } else {
      setItems(prev => prev.map(p => p.id === id ? { ...p, ...updateData } : p))
      toast.success(`Post ${newStatus}`)
    }
  }

  // ── Inline styles shared ────────────────────────────────────────────────
  const fieldLabel: React.CSSProperties = {
    fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
    letterSpacing: '0.05em', color: 'var(--admin-text-sub)', marginBottom: '0.4rem',
    display: 'flex', alignItems: 'center', gap: 6,
  }
  const fieldBase: React.CSSProperties = {
    background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)',
    color: 'var(--admin-text)', borderRadius: 8, padding: '0.6rem 1rem',
  }

  return (
    <>
      <AdminTopBar
        title="Blog Posts"
        subtitle={`${items.length} total posts`}
        action={
          <button
            onClick={() => open()}
            className="btn btn-sm d-flex align-items-center gap-2"
            style={{ background: 'var(--admin-text)', color: 'var(--admin-surface)', borderRadius: 10, fontWeight: 600 }}
            id="admin-add-blog"
          >
            <Plus size={15} /> New Post
          </button>
        }
      />

      <div className="admin-page-content">
        <div className="card shadow-sm" style={{ borderRadius: 14, border: '1px solid var(--admin-border)', overflow: 'hidden', background: 'var(--admin-surface)' }}>
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead style={{ background: 'var(--admin-main-bg)' }}>
                <tr>
                  {['Post', 'Tags', 'Status', 'Published', 'Actions'].map((h, i) => (
                    <th key={h} className={i === 4 ? 'text-end' : ''}
                      style={{ color: 'var(--admin-text-sub)', fontSize: '0.75rem', fontWeight: 600, padding: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--admin-border)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} style={{ padding: '1rem', borderBottom: '1px solid var(--admin-border)' }}>
                        <div style={{ height: 24, background: 'var(--admin-border)', borderRadius: 6, opacity: 0.5, animation: 'pulse 1.5s infinite' }} />
                      </td>
                    </tr>
                  ))
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-5" style={{ color: 'var(--admin-text-sub)', borderBottom: 'none' }}>
                      <FileText size={48} className="mb-3 mx-auto" style={{ opacity: 0.3 }} />
                      <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--admin-text)', marginBottom: '0.25rem' }}>No blog posts found</div>
                      <div style={{ fontSize: '0.85rem' }}>Click "New Post" to create your first blog entry.</div>
                    </td>
                  </tr>
                ) : (
                  items.map(item => (
                    <tr key={item.id}>
                      {/* Post */}
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--admin-border)' }}>
                        <div className="d-flex align-items-center gap-3">
                          {item.cover_image_url ? (
                            <img src={item.cover_image_url} alt="" className="rounded"
                              style={{ width: 48, height: 40, objectFit: 'cover', border: '1px solid var(--admin-border)' }} />
                          ) : (
                            <div className="rounded d-flex align-items-center justify-content-center"
                              style={{ width: 48, height: 40, background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)', flexShrink: 0 }}>
                              <FileText size={16} style={{ color: 'var(--admin-text-sub)' }} />
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--admin-text)', fontSize: '0.9rem', marginBottom: 2 }}>{item.title}</div>
                            <div style={{ color: 'var(--admin-text-sub)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>/{item.slug}</div>
                          </div>
                        </div>
                      </td>

                      {/* Tags */}
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--admin-border)', maxWidth: 220 }}>
                        <div className="d-flex flex-wrap gap-1">
                          {(item.tags ?? []).length === 0
                            ? <span style={{ color: 'var(--admin-text-sub)', fontSize: '0.75rem' }}>—</span>
                            : item.tags.slice(0, 4).map(tag => (
                              <span key={tag} style={{
                                fontSize: '0.68rem', fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
                                color: '#818cf8', letterSpacing: '0.02em',
                              }}>{tag}</span>
                            ))}
                          {(item.tags ?? []).length > 4 && (
                            <span style={{ fontSize: '0.68rem', color: 'var(--admin-text-sub)', padding: '2px 4px' }}>
                              +{item.tags.length - 4}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--admin-border)' }}>
                        <button onClick={() => togglePublish(item.id, item.status)}
                          className="btn btn-sm d-flex align-items-center gap-1"
                          style={{
                            borderRadius: 8, fontSize: '0.75rem', fontWeight: 600,
                            background: item.status === 'published' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                            border: item.status === 'published' ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(245,158,11,0.2)',
                            color: item.status === 'published' ? '#10b981' : '#f59e0b',
                          }}>
                          {item.status === 'published' ? <Eye size={13} /> : <EyeOff size={13} />}
                          {item.status}
                        </button>
                      </td>

                      {/* Published date */}
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--admin-border)', color: 'var(--admin-text-sub)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                        {item.published_at ? new Date(item.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--admin-border)' }}>
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          {item.status === 'published' && (
                            <Link href={`/blog/${item.slug}`} target="_blank" aria-label={`Open ${item.title}`}
                              className="btn btn-sm d-flex align-items-center justify-content-center"
                              style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-sub)' }}>
                              <ExternalLink size={13} />
                            </Link>
                          )}
                          <button onClick={() => open(item)} aria-label={`Edit ${item.title}`}
                            className="btn btn-sm d-flex align-items-center justify-content-center"
                            style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)' }}>
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => del(item.id)} aria-label={`Delete ${item.title}`}
                            className="btn btn-sm d-flex align-items-center justify-content-center"
                            style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Modal Form ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            data-lenis-prevent
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center overflow-auto p-3 overlay-scroll-lock"
            style={{ zIndex: 1060, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => !saving && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
              className="card shadow-lg border-0"
              style={{ maxWidth: 960, width: '100%', borderRadius: 16, border: '1px solid var(--admin-border)', maxHeight: '90vh', background: 'var(--admin-surface)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="card-header bg-transparent d-flex align-items-center justify-content-between"
                style={{ borderBottom: '1px solid var(--admin-border)', padding: '1.25rem 1.5rem', flexShrink: 0 }}>
                <h2 className="mb-0" style={{ fontWeight: 700, color: 'var(--admin-text)', fontSize: '1.25rem' }}>
                  {editing ? 'Edit Post' : 'New Post'}
                </h2>
                <button onClick={() => !saving && setShowForm(false)} className="btn-close" aria-label="Close" disabled={saving} />
              </div>

              {/* Body */}
              <div className="card-body p-4" style={{ overflowY: 'auto' }}>
                <div className="row g-4">

                  {/* ── Left: main content ───────────────────────────── */}
                  <div className="col-lg-8 d-flex flex-column gap-3">
                    <div>
                      <label className="form-label" style={fieldLabel}>Title *</label>
                      <input className="form-control" placeholder="Post title" value={form.title}
                        onChange={e => setForm(f => ({
                          ...f,
                          title: e.target.value,
                          slug: f.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                        }))}
                        style={fieldBase} />
                    </div>
                    <div>
                      <label className="form-label" style={fieldLabel}>Content (Markdown) *</label>
                      <textarea className="form-control" rows={16} placeholder="# Write your post here..." value={form.content}
                        onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                        style={{ ...fieldBase, resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} />
                    </div>
                  </div>

                  {/* ── Right: meta ──────────────────────────────────── */}
                  <div className="col-lg-4 d-flex flex-column gap-3">

                    {/* Slug */}
                    <div>
                      <label className="form-label" style={fieldLabel}>Slug *</label>
                      <input className="form-control" placeholder="post-slug" value={form.slug}
                        onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                        style={{ ...fieldBase, fontFamily: 'var(--font-mono)' }} />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="form-label" style={fieldLabel}>Status</label>
                      <select className="form-select" value={form.status}
                        onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                        style={fieldBase}>
                        {['draft', 'published'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
{/* Publish Date */}
                    <div>
                      <label className="form-label" style={fieldLabel}>
                        <Calendar size={12} /> Publish Date
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={form.publish_date}
                        onChange={e => setForm(f => ({ ...f, publish_date: e.target.value }))}
                        style={{ ...fieldBase, colorScheme: 'dark' }}
                      />
                      <p style={{ fontSize: '0.7rem', color: 'var(--admin-text-sub)', marginTop: 5, marginBottom: 0, lineHeight: 1.4 }}>
                        Leave blank to auto-set when first published.
                        {editing?.published_at && !form.publish_date && (
                          <> Currently: <strong style={{ color: 'var(--admin-text)' }}>{new Date(editing.published_at).toLocaleString()}</strong></>
                        )}
                      </p>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="form-label" style={fieldLabel}>
                        <Tag size={12} /> Tags
                      </label>

                      {/* Chip display + input */}
                      <div
                        style={{
                          ...fieldBase,
                          padding: '0.45rem 0.75rem',
                          display: 'flex', flexWrap: 'wrap', gap: 6,
                          cursor: 'text', minHeight: 42,
                        }}
                        onClick={e => (e.currentTarget.querySelector('input') as HTMLInputElement | null)?.focus()}
                      >
                        {form.tags.map(tag => (
                          <span key={tag} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px 2px 10px', borderRadius: 20,
                            background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                            color: '#818cf8', flexShrink: 0,
                          }}>
                            {tag}
                            <button
                              type="button"
                              onClick={ev => { ev.stopPropagation(); removeTag(tag) }}
                              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', color: 'inherit', opacity: 0.7, lineHeight: 1 }}
                              aria-label={`Remove tag ${tag}`}
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                        <input
                          value={tagInput}
                          onChange={e => setTagInput(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                          onBlur={() => addTag(tagInput)}
                          placeholder={form.tags.length === 0 ? 'next.js, react, typescript…' : ''}
                          style={{
                            background: 'transparent', border: 'none', outline: 'none',
                            color: 'var(--admin-text)', fontSize: '0.82rem',
                            flex: 1, minWidth: 80, padding: '2px 0',
                          }}
                        />
                      </div>
                      <p style={{ fontSize: '0.7rem', color: 'var(--admin-text-sub)', marginTop: 5, marginBottom: 0 }}>
                        Press <kbd style={{ background: 'var(--admin-border)', padding: '0 4px', borderRadius: 3, fontSize: '0.65rem' }}>Enter</kbd>,{' '}
                        <kbd style={{ background: 'var(--admin-border)', padding: '0 4px', borderRadius: 3, fontSize: '0.65rem' }}>,</kbd> or{' '}
                        <kbd style={{ background: 'var(--admin-border)', padding: '0 4px', borderRadius: 3, fontSize: '0.65rem' }}>Space</kbd> to add.
                      </p>
                    </div>

                    {/* Excerpt */}
                    <div>
                      <label className="form-label" style={fieldLabel}>Excerpt</label>
                      <textarea className="form-control" rows={3} placeholder="Brief summary" value={form.excerpt}
                        onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                        style={{ ...fieldBase, resize: 'none' }} />
                    </div>

                    {/* Cover Image */}
                    <div>
                      <label className="form-label" style={fieldLabel}>Cover Image URL</label>
                      <input className="form-control" placeholder="https://..." value={form.cover_image_url}
                        onChange={e => setForm(f => ({ ...f, cover_image_url: e.target.value }))}
                        style={fieldBase} />
                    </div>
                    {form.cover_image_url && (
                      <img src={form.cover_image_url} alt="Preview" className="rounded-3 w-100"
                        style={{ height: 130, objectFit: 'cover', border: '1px solid var(--admin-border)' }} />
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="card-footer bg-transparent d-flex justify-content-end gap-3"
                style={{ borderTop: '1px solid var(--admin-border)', padding: '1.25rem 1.5rem', flexShrink: 0 }}>
                <button onClick={() => !saving && setShowForm(false)} className="btn btn-sm px-4 py-2" disabled={saving}
                  style={{ background: 'transparent', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: 8, fontWeight: 600 }}>
                  Cancel
                </button>
                <button onClick={save} className="btn btn-sm px-4 py-2 d-flex align-items-center gap-2" disabled={saving}
                  style={{ background: 'var(--admin-text)', color: 'var(--admin-surface)', borderRadius: 8, fontWeight: 600 }} id="blog-save">
                  {saving && <div className="spinner-border spinner-border-sm" style={{ width: 14, height: 14, borderWidth: 2 }} />}
                  Save Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
  }
