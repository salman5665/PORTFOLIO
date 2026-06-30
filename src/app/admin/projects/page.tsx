'use client'

import { useEffect, useState } from 'react'
import { FolderOpen, Plus, Edit2, Trash2, Star, Eye, EyeOff, Search } from 'lucide-react'
import Link from 'next/link'
import { adminDb } from '@/lib/adminDb'
import { toast } from 'sonner'
import AdminTopBar from '@/components/admin/AdminTopBar'
import type { Project } from '@/lib/supabase/types'

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchProjects = async () => {
    const { data } = await adminDb.from('projects').select({ order: 'sort_order', ascending: true })
    setProjects((data as Project[]) || [])
    setLoading(false)
  }

  useEffect(() => { fetchProjects() }, [])

  const toggleFeatured = async (id: string, current: boolean) => {
    await adminDb.from('projects').update({ is_featured: !current }, id)
    setProjects(prev => prev.map(p => p.id === id ? { ...p, is_featured: !current } : p))
    toast.success(current ? 'Removed from featured' : 'Marked as featured')
  }

  const togglePublish = async (id: string, current: string) => {
    const newStatus = current === 'published' ? 'draft' : 'published'
    await adminDb.from('projects').update({ status: newStatus }, id)
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p))
    toast.success(`Project ${newStatus}`)
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project? This cannot be undone.')) return
    await adminDb.from('projects').delete(id)
    setProjects(prev => prev.filter(p => p.id !== id))
    toast.success('Project deleted.')
  }

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.tech_stack?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <>
      <AdminTopBar
        title="Projects"
        subtitle={`${projects.length} total projects`}
        action={
          <Link href="/admin/projects/new" className="btn btn-sm d-flex align-items-center gap-2"
            style={{ background: 'var(--admin-text)', color: 'var(--admin-surface)', borderRadius: 10, fontWeight: 600 }}>
            <Plus size={15} /> Add Project
          </Link>
        }
      />

      <div className="admin-page-content">
        {/* Search */}
        <div className="mb-4" style={{ maxWidth: 320 }}>
          <div className="search-field">
            <Search size={15} className="search-field-icon" />
            <input type="search" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
              className="form-control form-control-sm search-field-input" style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 10, color: 'var(--admin-text)', paddingBottom: '0.5rem', paddingTop: '0.5rem' }} />
          </div>
        </div>

        {/* Table */}
        <div className="card shadow-sm" style={{ borderRadius: 14, border: '1px solid var(--admin-border)', overflow: 'hidden', background: 'var(--admin-surface)' }}>
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead style={{ background: 'var(--admin-main-bg)' }}>
                <tr>
                  <th style={{ color: 'var(--admin-text-sub)', fontSize: '0.75rem', fontWeight: 600, padding: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--admin-border)' }}>Project</th>
                  <th style={{ color: 'var(--admin-text-sub)', fontSize: '0.75rem', fontWeight: 600, padding: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--admin-border)' }}>Tech Stack</th>
                  <th style={{ color: 'var(--admin-text-sub)', fontSize: '0.75rem', fontWeight: 600, padding: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--admin-border)' }}>Status</th>
                  <th style={{ color: 'var(--admin-text-sub)', fontSize: '0.75rem', fontWeight: 600, padding: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--admin-border)' }}>Featured</th>
                  <th className="text-end" style={{ color: 'var(--admin-text-sub)', fontSize: '0.75rem', fontWeight: 600, padding: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--admin-border)' }}>Actions</th>
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
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-5" style={{ color: 'var(--admin-text-sub)', borderBottom: 'none' }}>
                      <FolderOpen size={48} className="mb-3 mx-auto" style={{ opacity: 0.3 }} />
                      <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--admin-text)', marginBottom: '0.25rem' }}>No projects found</div>
                      <div style={{ fontSize: '0.85rem' }}>Try adjusting your search or add a new project.</div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((project) => (
                    <tr key={project.id}>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--admin-border)' }}>
                        <div className="d-flex align-items-center gap-3">
                          {project.thumbnail_url ? (
                            <img src={project.thumbnail_url} alt="" className="rounded" style={{ width: 48, height: 40, objectFit: 'cover', border: '1px solid var(--admin-border)' }} />
                          ) : (
                            <div className="rounded d-flex align-items-center justify-content-center" style={{ width: 48, height: 40, background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)' }}>
                              <FolderOpen size={16} style={{ color: 'var(--admin-text-sub)' }} />
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--admin-text)', fontSize: '0.9rem', marginBottom: 2 }}>{project.title}</div>
                            <div style={{ color: 'var(--admin-text-sub)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>{project.category || 'web'}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--admin-border)' }}>
                        <div className="d-flex flex-wrap gap-1">
                          {(project.tech_stack || []).slice(0, 3).map(t => (
                            <span key={t} className="badge" style={{ background: 'var(--admin-main-bg)', color: 'var(--admin-text)', border: '1px solid var(--admin-border)', fontSize: '0.7rem', fontWeight: 500 }}>{t}</span>
                          ))}
                          {(project.tech_stack?.length || 0) > 3 && (
                            <span className="badge" style={{ background: 'var(--admin-main-bg)', color: 'var(--admin-text-sub)', border: '1px solid var(--admin-border)', fontSize: '0.7rem', fontWeight: 500 }}>+{(project.tech_stack?.length || 0) - 3}</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--admin-border)' }}>
                        <button onClick={() => togglePublish(project.id, project.status)}
                          className="btn btn-sm d-flex align-items-center gap-1"
                          style={{
                            borderRadius: 8, fontSize: '0.75rem', fontWeight: 600,
                            background: project.status === 'published' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            border: project.status === 'published' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)',
                            color: project.status === 'published' ? '#10b981' : '#f59e0b',
                          }}>
                          {project.status === 'published' ? <Eye size={13} /> : <EyeOff size={13} />}
                          {project.status}
                        </button>
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--admin-border)' }}>
                        <button
                          onClick={() => toggleFeatured(project.id, project.is_featured)}
                          aria-label={`${project.is_featured ? 'Remove featured' : 'Mark featured'} for ${project.title}`}
                          className="btn btn-sm admin-feature-toggle d-inline-flex align-items-center justify-content-center"
                          data-active={project.is_featured ? 'true' : 'false'}
                        >
                          <span className="admin-feature-icon d-inline-flex align-items-center justify-content-center">
                            <Star size={13} fill={project.is_featured ? 'currentColor' : 'none'} />
                          </span>
                          <span>{project.is_featured ? 'Featured' : 'Feature'}</span>
                        </button>
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--admin-border)' }}>
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          <Link
                            href={`/admin/projects/${project.id}`}
                            className="btn btn-sm admin-table-action admin-table-action-edit d-inline-flex align-items-center justify-content-center"
                            aria-label="Edit project">
                            <Edit2 size={13} />
                            <span>Edit</span>
                          </Link>
                          <button onClick={() => deleteProject(project.id)} aria-label="Delete project"
                            className="btn btn-sm admin-table-action admin-table-action-danger d-inline-flex align-items-center justify-content-center">
                            <Trash2 size={13} />
                            <span>Delete</span>
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
    </>
  )
}
