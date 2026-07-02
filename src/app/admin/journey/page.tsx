'use client'

import { useEffect, useState } from 'react'
import { Milestone, Plus, Edit2, Trash2, ArrowUp, ArrowDown, RefreshCw, Compass } from 'lucide-react'
import { adminDb } from '@/lib/adminDb'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import AdminTopBar from '@/components/admin/AdminTopBar'
import { useBodyScrollLock } from '@/lib/hooks/useBodyScrollLock'
import type { JourneyItem } from '@/lib/supabase/types'

const DEFAULT_JOURNEY: JourneyItem[] = [
  { id: '1', year: '2022', title: 'Started Coding Journey', desc: 'Began my BCA journey and discovered a passion for programming and web development.' },
  { id: '2', year: '2023', title: 'Beginner Development', desc: 'Mastered HTML, CSS, JavaScript, PHP. Built first real web projects.' },
  { id: '3', year: '2024', title: 'Full-Stack Developer', desc: 'Learned ASP.NET Core, Flutter, DSA, and many more... during BCA.' },
  { id: '4', year: '2025', title: 'MCA & Advanced Tech', desc: 'Started MCA. Deep-dived into Next.js, TypeScript, cloud services, and AI.' },
  { id: '5', year: '2026+', title: 'Building at Scale', desc: 'Building production-grade applications, exploring AI integrations and DevOps.' },
]

// Bulletproof unique ID generator
const generateId = () => {
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function') {
    try {
      return window.crypto.randomUUID()
    } catch (e) {}
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export default function AdminJourneyPage() {
  const [journeyItems, setJourneyItems] = useState<JourneyItem[]>([])
  const [isCustom, setIsCustom] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<JourneyItem | null>(null)
  const [form, setForm] = useState({ year: '', title: '', desc: '' })
  
  useBodyScrollLock(showForm)

  const fetchJourney = async () => {
    try {
      setLoading(true)
      const { data, error } = await adminDb.from('settings').single({ where: { key: 'journey' } })
      
      if (error) {
        setJourneyItems(DEFAULT_JOURNEY)
        setIsCustom(false)
      } else {
        const val = (data as { value?: JourneyItem[] } | null)?.value
        if (Array.isArray(val) && val.length > 0) {
          setJourneyItems(val)
          setIsCustom(true)
        } else {
          setJourneyItems(DEFAULT_JOURNEY)
          setIsCustom(false)
        }
      }
    } catch (err) {
      setJourneyItems(DEFAULT_JOURNEY)
      setIsCustom(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJourney()
  }, [])

  const saveJourneyToDb = async (items: JourneyItem[], showToast = true) => {
    try {
      setSaving(true)
      const { error } = await adminDb.from('settings').upsert({
        key: 'journey',
        value: items,
        updated_at: new Date().toISOString(),
      })
      
      if (error) {
        toast.error('Failed to save changes: ' + error)
        return false
      } else {
        setIsCustom(true)
        if (showToast) toast.success('Journey timeline updated!')
        return true
      }
    } catch (err) {
      toast.error('Failed to save changes due to an unexpected error.')
      return false
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async () => {
    if (!form.year.trim()) { toast.error('Year is required'); return }
    if (!form.title.trim()) { toast.error('Title is required'); return }
    if (!form.desc.trim()) { toast.error('Description is required'); return }

    const list = Array.isArray(journeyItems) ? journeyItems : DEFAULT_JOURNEY
    let updatedList: JourneyItem[] = []

    if (editing) {
      updatedList = list.map(item => 
        item.id === editing.id ? { ...item, ...form } : item
      )
    } else {
      const newItem: JourneyItem = {
        id: generateId(),
        ...form
      }
      updatedList = [...list, newItem]
    }

    const success = await saveJourneyToDb(updatedList)
    if (success) {
      setJourneyItems(updatedList)
      setShowForm(false)
      setEditing(null)
      setForm({ year: '', title: '', desc: '' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return
    
    const list = Array.isArray(journeyItems) ? journeyItems : DEFAULT_JOURNEY
    const updatedList = list.filter(item => item.id !== id)

    const success = await saveJourneyToDb(updatedList)
    if (success) {
      setJourneyItems(updatedList)
    }
  }

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const list = Array.isArray(journeyItems) ? journeyItems : DEFAULT_JOURNEY
    const currentList = [...list]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= currentList.length) return

    // Swap elements
    const temp = currentList[index]
    currentList[index] = currentList[targetIndex]
    currentList[targetIndex] = temp

    const success = await saveJourneyToDb(currentList, false)
    if (success) {
      setJourneyItems(currentList)
      toast.success('Order updated!')
    }
  }

  const handleResetToDefault = async () => {
    if (!confirm('Revert all journey timeline changes and reset to default? This will clear your custom milestones.')) return
    
    setSaving(true)
    const { error } = await adminDb.from('settings').upsert({
      key: 'journey',
      value: [],
      updated_at: new Date().toISOString(),
    })
    setSaving(false)
    
    if (error) {
      toast.error('Failed to reset: ' + error)
    } else {
      setJourneyItems(DEFAULT_JOURNEY)
      setIsCustom(false)
      toast.success('Journey timeline reset to default!')
    }
  }

  const startEdit = (item: JourneyItem) => {
    setEditing(item)
    setForm({ year: item.year, title: item.title, desc: item.desc })
    setShowForm(true)
  }

  const startAdd = () => {
    setEditing(null)
    setForm({ year: '', title: '', desc: '' })
    setShowForm(true)
  }

  const displayItems = Array.isArray(journeyItems) ? journeyItems : DEFAULT_JOURNEY

  return (
    <>
      {/* Scope-specific premium design system overrides */}
      <style>{`
        .timeline-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          background: rgba(15, 23, 42, 0.45) !important;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(125, 211, 252, 0.12) !important;
        }
        .timeline-card:hover {
          border-color: rgba(34, 211, 238, 0.35) !important;
          box-shadow: 0 8px 30px rgba(34, 211, 238, 0.08) !important;
          transform: translateY(-2px);
        }
        .action-icon-btn {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .action-icon-btn:hover:not(:disabled) {
          color: var(--admin-accent) !important;
          border-color: var(--admin-accent) !important;
          background: rgba(34, 211, 238, 0.08) !important;
          transform: translateY(-1px);
        }
        .delete-icon-btn {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .delete-icon-btn:hover:not(:disabled) {
          background: #ef4444 !important;
          color: white !important;
          border-color: #ef4444 !important;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
          transform: translateY(-1px);
        }
        .timeline-dot-glow {
          box-shadow: 0 0 10px rgba(34, 211, 238, 0.4);
          animation: dot-pulse 2s infinite alternate;
        }
        @keyframes dot-pulse {
          0% {
            box-shadow: 0 0 8px rgba(34, 211, 238, 0.3);
            transform: scale(1);
          }
          100% {
            box-shadow: 0 0 16px rgba(34, 211, 238, 0.65);
            transform: scale(1.08);
          }
        }
        .admin-input-premium {
          background: rgba(15, 23, 42, 0.5) !important;
          border: 1px solid rgba(125, 211, 252, 0.15) !important;
          color: var(--admin-text) !important;
          transition: all 0.25s ease !important;
        }
        .admin-input-premium:focus {
          border-color: var(--admin-accent) !important;
          box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.15) !important;
          background: rgba(15, 23, 42, 0.8) !important;
        }
      `}</style>

      <AdminTopBar
        title="Journey Timeline"
        subtitle={`${displayItems.length} milestones total`}
        action={
          <div className="d-flex gap-2">
            {isCustom && (
              <button onClick={handleResetToDefault} disabled={saving} className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2" style={{ borderRadius: 10, cursor: 'pointer' }}>
                <RefreshCw size={14} style={{ flexShrink: 0 }} /> Reset to Default
              </button>
            )}
            <button onClick={startAdd} className="btn btn-sm d-flex align-items-center gap-2" style={{ background: 'var(--admin-text)', color: 'var(--admin-surface)', borderRadius: 10, cursor: 'pointer' }} id="admin-add-journey">
              <Plus size={14} style={{ flexShrink: 0 }} /> Add Milestone
            </button>
          </div>
        }
      />

      <div className="admin-page-content">
        {/* Info card */}
        <div className="card shadow-sm mb-5" style={{ borderRadius: 16, border: '1px solid rgba(34, 211, 238, 0.18)', background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(12px)' }}>
          <div className="card-body p-4">
            <div className="d-flex align-items-start gap-3">
              <div className="d-flex align-items-center justify-content-center rounded-3 p-2" style={{ background: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
                <Compass size={22} color="var(--admin-accent)" style={{ flexShrink: 0 }} />
              </div>
              <div>
                <h5 style={{ color: 'var(--admin-text)', fontWeight: 700, margin: '0 0 4px' }}>Timeline Milestones</h5>
                <p style={{ color: 'var(--admin-text-sub)', fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>
                  Manage the timeline events displayed in the "My Journey" section on the main page. Reorder items to reflect chronological progression, or reset to original settings at any time.
                  {!isCustom && (
                    <span className="text-warning d-block mt-2 font-mono" style={{ fontSize: '0.8rem' }}>
                      ⚠️ Currently displaying default values. Saving any change will create a custom database configuration.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Layout */}
        <div style={{ position: 'relative', paddingLeft: '2.5rem', marginLeft: '1.25rem' }}>
          
          {/* Timeline Path Line (glowing gradient line) */}
          {!loading && (
            <div style={{
              position: 'absolute',
              left: 0,
              top: '20px',
              bottom: '20px',
              width: '2px',
              background: 'linear-gradient(to bottom, var(--admin-accent), rgba(34, 211, 238, 0.15) 75%, transparent)',
              zIndex: 1
            }} />
          )}

          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ height: 100, background: 'var(--admin-border)', borderRadius: 14, animation: 'pulse 1.5s ease-in-out infinite', marginBottom: '2rem' }} />
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {displayItems.map((item, index) => (
                <motion.div 
                  key={item.id || `default-${index}`} 
                  layout
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{ position: 'relative', marginBottom: '2rem', zIndex: 2 }}
                >
                  {/* Timeline Dot with pulse animation */}
                  <div 
                    className="timeline-dot-glow"
                    style={{
                      position: 'absolute',
                      left: 'calc(-2.5rem - 7px)',
                      top: '16px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: 'var(--admin-accent)',
                      border: '3px solid var(--admin-main-bg)',
                      zIndex: 3
                    }} 
                  />

                  {/* Milestone Card with premium glass overrides */}
                  <div className="card shadow-sm timeline-card">
                    <div className="card-body p-4">
                      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                        <div className="flex-grow-1 min-w-0">
                          <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                            <span className="font-mono" style={{ background: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.25)', borderRadius: 6, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 800, color: 'var(--admin-accent)' }}>
                              {item.year}
                            </span>
                            <h4 style={{ fontWeight: 700, color: 'var(--admin-text)', fontSize: '1rem', margin: 0 }}>{item.title}</h4>
                          </div>
                          <p style={{ color: 'var(--admin-text-sub)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                            {item.desc}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex align-items-center gap-2 flex-shrink-0 align-self-end align-self-md-center">
                          {/* Reorder Buttons */}
                          <button 
                            onClick={() => handleMove(index, 'up')} 
                            disabled={index === 0} 
                            title="Move Up"
                            className="btn btn-sm d-flex align-items-center justify-content-center action-icon-btn"
                            style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-sub)', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}
                          >
                            <ArrowUp size={14} style={{ color: 'currentColor', flexShrink: 0 }} />
                          </button>
                          <button 
                            onClick={() => handleMove(index, 'down')} 
                            disabled={index === displayItems.length - 1} 
                            title="Move Down"
                            className="btn btn-sm d-flex align-items-center justify-content-center action-icon-btn"
                            style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-sub)', cursor: index === displayItems.length - 1 ? 'not-allowed' : 'pointer', opacity: index === displayItems.length - 1 ? 0.3 : 1 }}
                          >
                            <ArrowDown size={14} style={{ color: 'currentColor', flexShrink: 0 }} />
                          </button>

                          {/* Edit & Delete */}
                          <button onClick={() => startEdit(item)} title="Edit Milestone" className="btn btn-sm d-flex align-items-center justify-content-center action-icon-btn"
                            style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-sub)' }}>
                            <Edit2 size={14} style={{ color: 'currentColor', flexShrink: 0 }} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} title="Delete Milestone" className="btn btn-sm d-flex align-items-center justify-content-center delete-icon-btn"
                            style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
                            <Trash2 size={14} style={{ color: 'currentColor', flexShrink: 0 }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
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
              className="card shadow-lg" 
              style={{ 
                maxWidth: 480, 
                width: '100%', 
                borderRadius: 16, 
                border: '1px solid rgba(34, 211, 238, 0.22)', 
                background: 'rgba(15, 23, 42, 0.92)', 
                backdropFilter: 'blur(16px)',
                maxHeight: '90vh', 
                overflowY: 'auto',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)'
              }}
              onClick={e => e.stopPropagation()}>
              <div className="card-body p-4 p-md-5">
                <h2 style={{ fontWeight: 800, color: 'var(--admin-text)', fontSize: '1.125rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Milestone size={18} color="var(--admin-accent)" style={{ flexShrink: 0 }} />
                  {editing ? 'Edit Milestone' : 'Add Milestone'}
                </h2>
                
                <div className="mb-3">
                  <label className="form-label" htmlFor="journey-year">Year / Timeframe</label>
                  <input 
                    id="journey-year" 
                    className="form-control admin-input-premium" 
                    type="text" 
                    value={form.year} 
                    onChange={e => setForm(f => ({ ...f, year: e.target.value }))} 
                    placeholder="e.g. 2022, 2025-2026, or 2026+" 
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label" htmlFor="journey-title">Milestone Title</label>
                  <input 
                    id="journey-title" 
                    className="form-control" 
                    type="text" 
                    value={form.title} 
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
                    placeholder="e.g. Completed MCA" 
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label" htmlFor="journey-desc">Description</label>
                  <textarea 
                    id="journey-desc" 
                    className="form-control admin-input-premium" 
                    rows={4} 
                    value={form.desc} 
                    onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} 
                    placeholder="Provide details about what you accomplished..." 
                    style={{ resize: 'none' }} 
                  />
                </div>

                <div className="d-flex justify-content-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline-dark" style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)', borderRadius: 10, cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="button" onClick={handleSave} className="btn" style={{ background: 'var(--admin-text)', color: 'var(--admin-surface)', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>
                    {editing ? 'Save Changes' : 'Add Milestone'}
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
