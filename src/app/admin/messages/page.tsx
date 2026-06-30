'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Mail, Trash2, Reply, Search, Clock, Eye } from 'lucide-react'
import { adminDb } from '@/lib/adminDb'
import { toast } from 'sonner'
import AdminTopBar from '@/components/admin/AdminTopBar'
import type { Message } from '@/lib/supabase/types'
import { formatDistanceToNow } from 'date-fns'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selected, setSelected] = useState<Message | null>(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  const fetchMessages = async () => {
    const opts: any = { order: 'created_at', ascending: false }
    if (filter === 'unread') opts.where = { is_read: false }
    if (filter === 'read') opts.where = { is_read: true }
    const { data } = await adminDb.from('messages').select(opts)
    setMessages((data as Message[]) || [])
    setLoading(false)
  }

  useEffect(() => { fetchMessages() }, [filter])

  const markRead = async (id: string) => {
    await adminDb.from('messages').update({ is_read: true }, id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, is_read: true } : null)
    window.dispatchEvent(new Event('admin-messages-updated'))
  }

  const deleteMessage = async (id: string) => {
    await adminDb.from('messages').delete(id)
    setMessages(prev => prev.filter(m => m.id !== id))
    if (selected?.id === id) setSelected(null)
    window.dispatchEvent(new Event('admin-messages-updated'))
    toast.success('Message deleted.')
  }

  const unreadCount = messages.filter(m => !m.is_read).length
  const filtered = messages.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.body.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <AdminTopBar title="Messages" subtitle={`${unreadCount} unread`} />

      <div className="admin-page-content">
        <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
          <div className="search-field" style={{ minWidth: 240 }}>
            <Search size={15} className="search-field-icon" />
            <input type="search" placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)}
              className="form-control search-field-input" style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 10 }}
              id="messages-search" />
          </div>
          <div className="d-flex gap-2">
            {(['all', 'unread', 'read'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className="btn btn-sm text-capitalize"
                style={{
                  borderRadius: 10, fontSize: '0.8rem', fontWeight: 600,
                  background: filter === f ? 'var(--admin-text)' : 'var(--admin-surface)',
                  color: filter === f ? 'var(--admin-surface)' : 'var(--admin-text-sub)',
                  border: filter === f ? '1px solid var(--admin-text)' : '1px solid var(--admin-border)',
                }} id={`messages-filter-${f}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Split Pane */}
        <div className="row g-4" style={{ minHeight: 500 }}>
          {/* List */}
          <div className="col-lg-4">
            <div className="card shadow-sm" style={{ borderRadius: 14, border: '1px solid var(--admin-border)', height: '100%', maxHeight: '72vh', overflowY: 'auto' }}>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-3 border-bottom" style={{ borderColor: 'var(--admin-border-soft)' }}>
                    <div style={{ height: 60, background: 'var(--admin-main-bg)', borderRadius: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
                  </div>
                ))
              ) : filtered.length === 0 ? (
                <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center" style={{ color: 'var(--admin-text-sub)' }}>
                  <MessageSquare size={32} className="mb-2 opacity-50" />
                  <p className="mb-0">No messages found.</p>
                </div>
              ) : (
                filtered.map(msg => (
                  <button key={msg.id}
                    onClick={async () => { setSelected(msg); if (!msg.is_read) await markRead(msg.id) }}
                    className="w-100 text-start p-3 border-0"
                    style={{
                      background: selected?.id === msg.id ? 'rgba(34,211,238,0.08)' : 'var(--admin-surface)',
                      borderBottom: '1px solid var(--admin-border-soft)',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                      borderLeft: selected?.id === msg.id ? '3px solid #22d3ee' : '3px solid transparent',
                    }}>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      {!msg.is_read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22d3ee', flexShrink: 0 }} />}
                      <span style={{ fontWeight: msg.is_read ? 500 : 700, color: 'var(--admin-text)', fontSize: '0.875rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.name}</span>
                      <span style={{ color: 'var(--admin-text-sub)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                        {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <div style={{ color: 'var(--admin-text-sub)', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.email}</div>
                    <div style={{ color: 'var(--admin-text-sub)', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{msg.body}</div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Detail */}
          <div className="col-lg-8">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div key={selected.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  className="card shadow-sm" style={{ borderRadius: 14, border: '1px solid var(--admin-border)', height: '100%' }}>
                  <div className="card-body p-4 p-md-5">
                    <div className="d-flex align-items-start justify-content-between gap-3 mb-4">
                      <div>
                        <h2 style={{ fontWeight: 800, color: 'var(--admin-text)', fontSize: '1.125rem', marginBottom: 6 }}>{selected.subject || 'No subject'}</h2>
                        <div className="d-flex align-items-center flex-wrap gap-2">
                          <span style={{ fontWeight: 600, color: '#67e8f9', fontSize: '0.875rem' }}>{selected.name}</span>
                          <span style={{ color: 'var(--admin-text-sub)' }}>-</span>
                          <span style={{ color: 'var(--admin-text-sub)', fontSize: '0.875rem' }}>{selected.email}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1 mt-1" style={{ color: 'var(--admin-text-sub)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                          <Clock size={11} />{new Date(selected.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message'}`}
                          className="btn btn-sm d-flex align-items-center gap-2"
                          style={{ background: 'var(--admin-text)', color: 'var(--admin-surface)', borderRadius: 10 }} id="messages-reply">
                          <Reply size={14} /> Reply
                        </a>
                        <button onClick={() => deleteMessage(selected.id)} aria-label="Delete"
                          className="btn btn-sm d-flex align-items-center justify-content-center"
                          style={{ width: 36, height: 36, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 10 }} id="messages-delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1.5rem' }}>
                      <p style={{ color: 'var(--admin-text-sub)', lineHeight: 1.85, whiteSpace: 'pre-wrap', fontSize: '0.925rem' }}>{selected.body}</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="card shadow-sm d-flex align-items-center justify-content-center"
                  style={{ borderRadius: 14, border: '1px solid var(--admin-border)', minHeight: 320 }}>
                  <div className="text-center" style={{ color: 'var(--admin-text-sub)' }}>
                    <Mail size={40} className="mb-3 d-block mx-auto opacity-50" />
                    <p className="mb-0" style={{ fontSize: '0.875rem' }}>Select a message to read</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}

