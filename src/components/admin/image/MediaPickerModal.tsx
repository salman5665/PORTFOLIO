'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Image as ImageIcon, RefreshCw, CheckCircle2, FolderOpen } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useBodyScrollLock } from '@/lib/hooks/useBodyScrollLock'

interface MediaFile {
  name: string
  url: string
  size: number
  created_at: string
}

interface MediaPickerModalProps {
  open: boolean
  bucket: string
  onSelect: (url: string) => void
  onClose: () => void
}

const BUCKETS = ['projects', 'blog', 'certificates', 'avatars', 'seo', 'resumes']

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export default function MediaPickerModal({
  open,
  bucket,
  onSelect,
  onClose,
}: MediaPickerModalProps) {
  const [activeBucket, setActiveBucket] = useState(bucket)
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  useBodyScrollLock(open)

  useEffect(() => {
    if (open) {
      setActiveBucket(bucket)
      setSearch('')
      setSelected(null)
    }
  }, [open, bucket])

  useEffect(() => {
    if (!open) return
    fetchFiles(activeBucket)
  }, [activeBucket, open])

  const fetchFiles = async (b: string) => {
    setLoading(true)
    setFiles([])
    const { data, error } = await supabase.storage.from(b).list('', {
      limit: 200,
      sortBy: { column: 'created_at', order: 'desc' },
    })

    if (!error && data) {
      const valid = data.filter(
        f => f.name !== '.emptyFolderPlaceholder' && f.name.match(/\.(jpeg|jpg|gif|png|webp|svg|ico)$/i)
      )
      const mapped: MediaFile[] = valid.map(f => {
        const { data: { publicUrl } } = supabase.storage.from(b).getPublicUrl(f.name)
        return {
          name: f.name,
          url: publicUrl,
          size: f.metadata?.size || 0,
          created_at: f.created_at || new Date().toISOString(),
        }
      })
      setFiles(mapped)
    }
    setLoading(false)
  }

  const handleSelect = (url: string) => {
    setSelected(url)
  }

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected)
      onClose()
    }
  }

  const filtered = files.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  const panelStyle: React.CSSProperties = {
    maxWidth: 860,
    width: '100%',
    borderRadius: 18,
    border: '1px solid rgba(243, 229, 171, 0.18)',
    background: 'linear-gradient(145deg, rgba(20, 16, 5, 0.97), rgba(10, 8, 0, 0.92))',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 32px 80px rgba(0, 0, 0, 0.7)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '85vh',
    overflow: 'hidden',
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-lenis-prevent
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1070,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            style={panelStyle}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid rgba(243, 229, 171, 0.14)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: 'rgba(212, 175, 55, 0.12)',
                    border: '1px solid rgba(212, 175, 55, 0.22)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ImageIcon size={16} color="#F5D77F" />
                </div>
                <div>
                  <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '1rem', margin: 0 }}>
                    Choose from Media Library
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.72rem', margin: 0, fontFamily: 'var(--font-mono)' }}>
                    {files.length} image{files.length !== 1 ? 's' : ''} in <strong style={{ color: '#F5D77F' }}>{activeBucket}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: '1px solid rgba(243, 229, 171, 0.18)',
                  background: 'rgba(20, 16, 5, 0.5)',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Toolbar: bucket selector + search */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid rgba(243, 229, 171, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexShrink: 0,
                flexWrap: 'wrap',
              }}
            >
              {/* Bucket tabs */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {BUCKETS.map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setActiveBucket(b)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 999,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      border: activeBucket === b
                        ? '1px solid rgba(212, 175, 55, 0.4)'
                        : '1px solid rgba(243, 229, 171, 0.14)',
                      background: activeBucket === b
                        ? 'rgba(212, 175, 55, 0.14)'
                        : 'rgba(20, 16, 5, 0.4)',
                      color: activeBucket === b ? '#F5D77F' : '#94a3b8',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textTransform: 'capitalize',
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
                <Search
                  size={13}
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="search"
                  placeholder="Search images..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: 30,
                    paddingRight: 10,
                    paddingTop: 7,
                    paddingBottom: 7,
                    borderRadius: 8,
                    border: '1px solid rgba(243, 229, 171, 0.16)',
                    background: 'rgba(20, 16, 5, 0.5)',
                    color: '#f8fafc',
                    fontSize: '0.82rem',
                    outline: 'none',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
              </div>

              {/* Refresh */}
              <button
                type="button"
                onClick={() => fetchFiles(activeBucket)}
                title="Refresh"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: '1px solid rgba(243, 229, 171, 0.16)',
                  background: 'rgba(20, 16, 5, 0.4)',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <RefreshCw size={13} />
              </button>
            </div>

            {/* Grid */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem 1.5rem',
              }}
            >
              {loading ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: 10,
                  }}
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        aspectRatio: '1/1',
                        borderRadius: 10,
                        background: 'rgba(243, 229, 171, 0.07)',
                        animation: 'pulse 1.5s ease-in-out infinite',
                      }}
                    />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3rem 1rem',
                    gap: 12,
                    color: '#94a3b8',
                  }}
                >
                  <FolderOpen size={40} style={{ opacity: 0.3 }} />
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 600, color: '#f8fafc', margin: '0 0 4px', fontSize: '0.9rem' }}>
                      {search ? 'No images match your search' : 'Bucket is empty'}
                    </p>
                    <p style={{ fontSize: '0.8rem', margin: 0, opacity: 0.7 }}>
                      {search ? 'Try a different keyword' : `Upload images to the '${activeBucket}' bucket first`}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: 10,
                  }}
                >
                  {filtered.map(file => {
                    const isSelected = selected === file.url
                    return (
                      <div
                        key={file.name}
                        onClick={() => handleSelect(file.url)}
                        title={`${file.name}\n${formatSize(file.size)}`}
                        style={{
                          position: 'relative',
                          aspectRatio: '1/1',
                          borderRadius: 10,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: isSelected
                            ? '2px solid #D4AF37'
                            : '2px solid rgba(243, 229, 171, 0.12)',
                          background: 'rgba(20, 16, 5, 0.5)',
                          transition: 'all 0.18s ease',
                          transform: isSelected ? 'scale(0.97)' : 'scale(1)',
                          boxShadow: isSelected ? '0 0 0 3px rgba(212, 175, 55,0.18)' : 'none',
                        }}
                      >
                        <img
                          src={file.url}
                          alt={file.name}
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                          onError={e => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none'
                          }}
                        />

                        {/* Hover overlay */}
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: isSelected
                              ? 'rgba(212, 175, 55, 0.18)'
                              : 'rgba(10, 8, 0, 0)',
                            transition: 'background 0.2s ease',
                            display: 'flex',
                            alignItems: 'flex-end',
                            padding: '6px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.6rem',
                              fontFamily: 'var(--font-mono)',
                              color: '#fff',
                              background: 'rgba(0,0,0,0.6)',
                              padding: '2px 6px',
                              borderRadius: 4,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '100%',
                              opacity: isSelected ? 1 : 0,
                              transition: 'opacity 0.2s',
                            }}
                          >
                            {file.name}
                          </span>
                        </div>

                        {/* Check badge */}
                        {isSelected && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 6,
                              right: 6,
                              color: '#D4AF37',
                              background: 'rgba(10, 8, 0, 0.85)',
                              borderRadius: '50%',
                              display: 'flex',
                            }}
                          >
                            <CheckCircle2 size={20} />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid rgba(243, 229, 171, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
                gap: 12,
              }}
            >
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                {selected ? '1 image selected' : 'Click an image to select it'}
              </span>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 9,
                    border: '1px solid rgba(243, 229, 171, 0.18)',
                    background: 'transparent',
                    color: '#94a3b8',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!selected}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 9,
                    border: 'none',
                    background: selected
                      ? 'linear-gradient(135deg, #D4AF37, #AA7A1E)'
                      : 'rgba(243, 229, 171, 0.08)',
                    color: selected ? '#0A0800' : '#475569',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: selected ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Use Selected Image
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
