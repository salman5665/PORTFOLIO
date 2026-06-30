'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon, Copy, Trash2, UploadCloud, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import AdminTopBar from '@/components/admin/AdminTopBar'

interface MediaFile {
  name: string
  url: string
  size: number
  created_at: string
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [bucket, setBucket] = useState('projects') // Default bucket

  const buckets = ['projects', 'blog', 'avatars', 'certificates', 'resumes']

  const fetchFiles = async () => {
    setLoading(true)
    const { data, error } = await supabase.storage.from(bucket).list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' }
    })

    if (error) {
      toast.error('Failed to load files: ' + error.message)
      setFiles([])
    } else if (data) {
      // Filter out empty folder placeholders (like '.emptyFolderPlaceholder')
      const validFiles = data.filter(f => f.name !== '.emptyFolderPlaceholder')
      
      const fileData = validFiles.map(f => {
        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(f.name)
        return {
          name: f.name,
          url: publicUrl,
          size: f.metadata?.size || 0,
          created_at: f.created_at || new Date().toISOString()
        }
      })
      setFiles(fileData)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchFiles()
  }, [bucket])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const fileList = e.target.files

  if (!fileList || fileList.length === 0) return

  setUploading(true)

  const file = fileList[0]

  // Sanitize filename
  const safeName = file.name
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '')

  // Split filename and extension
  const nameParts = safeName.split('.')
  const ext = nameParts.pop()
  const baseName = nameParts.join('.')

  // Create compact timestamp
  const date = new Date()

  const shortDate = `${String(date.getDate()).padStart(2, '0')}${String(
  date.getMonth() + 1
).padStart(2, '0')}${String(date.getFullYear()).slice(-2)}_${String(
  date.getHours()
).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}`

  // Final filename
  const fileName = `${baseName}_${shortDate}.${ext}`

  // Upload file
  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    toast.error('Upload failed: ' + error.message)
  } else {
    toast.success('File uploaded successfully')
    fetchFiles()
  }

  setUploading(false)

  // Reset input
  e.target.value = ''
}

  const deleteFile = async (name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return

    const { error } = await supabase.storage.from(bucket).remove([name])
    if (error) {
      toast.error('Failed to delete: ' + error.message)
    } else {
      toast.success('File deleted')
      setFiles(prev => prev.filter(f => f.name !== name))
    }
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('URL copied to clipboard')
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <>
      <AdminTopBar
        title="Media Library"
        subtitle={`${files.length} files in ${bucket}`}
        action={
          <div className="d-flex align-items-center gap-2">
            <select value={bucket} onChange={(e) => setBucket(e.target.value)} 
              className="form-select form-select-sm"
              style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: 8 }}>
              {buckets.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <label className="btn btn-sm d-flex align-items-center gap-2 mb-0"
              style={{ background: 'var(--admin-text)', color: 'var(--admin-surface)', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {uploading ? <RefreshCw size={14} className="spinner-border spinner-border-sm" /> : <UploadCloud size={14} />}
              <span className="d-none d-sm-inline">{uploading ? 'Uploading...' : 'Upload File'}</span>
              <input type="file" className="d-none" onChange={handleUpload} disabled={uploading} accept="image/*,application/pdf" />
            </label>
          </div>
        }
      />

      <div className="admin-page-content">
        {loading ? (
          <div className="d-flex align-items-center justify-content-center py-5">
            <RefreshCw size={24} className="spinner-border text-primary" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : files.length === 0 ? (
          <div className="card shadow-sm text-center py-5" style={{ borderRadius: 14, border: '1px solid var(--admin-border)' }}>
            <ImageIcon size={48} className="mx-auto mb-3 opacity-25" style={{ color: 'var(--admin-text-sub)' }} />
            <h3 style={{ fontWeight: 700, color: 'var(--admin-text)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Bucket is empty</h3>
            <p style={{ color: 'var(--admin-text-sub)', fontSize: '0.85rem' }}>Upload images or files to the '{bucket}' bucket.</p>
          </div>
        ) : (
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">
            {files.map((file, i) => (
              <motion.div key={file.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }} className="col">
                <div className="card shadow-sm h-100 position-relative overflow-hidden group-hover-trigger" style={{ borderRadius: 12, border: '1px solid var(--admin-border)', background: 'var(--admin-surface)' }}>
                  
                  {/* Image container */}
                  <div className="position-relative d-flex align-items-center justify-content-center" style={{ aspectRatio: '1/1', background: 'var(--admin-main-bg)' }}>
                    {file.name.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) ? (
                      <img src={file.url} alt={file.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    ) : (
                      <ImageIcon size={32} style={{ color: 'var(--admin-text-sub)', opacity: 0.3 }} />
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center gap-2 overlay-actions" 
                      style={{ background: 'rgba(0,0,0,0.6)', opacity: 0, transition: 'opacity 0.2s' }}>
                      <button onClick={() => copyUrl(file.url)} aria-label={`Copy URL for ${file.name}`} className="btn btn-sm d-flex align-items-center justify-content-center" title="Copy URL"
                        style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', backdropFilter: 'blur(4px)' }}>
                        <Copy size={14} />
                      </button>
                      <button onClick={() => deleteFile(file.name)} aria-label={`Delete ${file.name}`} className="btn btn-sm d-flex align-items-center justify-content-center" title="Delete"
                        style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(239,68,68,0.8)', border: 'none', color: '#fff', backdropFilter: 'blur(4px)' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="text-truncate mb-1" title={file.name} style={{ color: 'var(--admin-text)', fontSize: '0.85rem', fontWeight: 600 }}>{file.name}</div>
                    <div className="d-flex align-items-center justify-content-between" style={{ color: 'var(--admin-text-sub)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                      <span>{formatSize(file.size)}</span>
                      <span>{new Date(file.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .group-hover-trigger:hover .overlay-actions { opacity: 1 !important; }
      `}</style>
    </>
  )
}
