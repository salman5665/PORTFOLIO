'use client'

import { useRef, useState, useCallback, DragEvent, ChangeEvent } from 'react'
import { UploadCloud, Images, AlertCircle, Zap } from 'lucide-react'
import { useImageUpload } from '@/lib/hooks/useImageUpload'
import UploadProgress from './UploadProgress'
import ImagePreview from './ImagePreview'
import MediaPickerModal from './MediaPickerModal'
import { toast } from 'sonner'

export interface ImageUploaderProps {
  /** Current image URL stored in form state */
  value: string
  /** Called with the new public URL after upload, or '' when removed */
  onChange: (url: string) => void
  /** Supabase Storage bucket to upload into */
  bucket: string
  /** Field label shown above the uploader */
  label?: string
  /** CSS aspect-ratio for the preview (e.g. '16/9', '1/1', '1200/630') */
  aspectRatio?: string
  /** Max file size in MB (default: 5) */
  maxSizeMb?: number
  /** accepted MIME types for file input (default: 'image/*') */
  accept?: string
}

export default function ImageUploader({
  value,
  onChange,
  bucket,
  label,
  aspectRatio = '16/9',
  maxSizeMb = 5,
  accept = 'image/*',
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [mediaPicker, setMediaPicker] = useState(false)
  const [compress, setCompress] = useState(false)
  const [duplicateAsset, setDuplicateAsset] = useState<{ url: string; asset: any; file: File } | null>(null)

  const { upload, uploading, progress, error, reset } = useImageUpload({ bucket, maxSizeMb })

  /* ── drag handlers ── */
  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(true)
  }
  const onDragLeave = () => setDragging(false)
  const onDrop = useCallback(
    async (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) await handleFile(file)
    },
    [compress]
  )

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) await handleFile(file)
    // reset so re-selecting same file works
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFile = async (file: File) => {
    reset()
    setDuplicateAsset(null)
    const result = await upload(file, compress)
    if (result) {
      if (result.duplicate) {
        setDuplicateAsset({ url: result.url, asset: result.asset, file })
      } else {
        onChange(result.url)
        toast.success('Image uploaded!')
      }
    } else {
      toast.error(error || 'Upload failed')
    }
  }

  const handleRemove = () => {
    onChange('')
    reset()
  }

  const handleReplace = () => {
    fileInputRef.current?.click()
  }

  const handleMediaSelect = (url: string) => {
    onChange(url)
  }

  /* ── common style tokens ── */
  const fieldLabelStyle: React.CSSProperties = {
    fontSize: '0.72rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--admin-text-sub)',
    marginBottom: '0.5rem',
    display: 'block',
  }

  /* ── Render: Duplicate Warning ── */
  if (duplicateAsset) {
    return (
      <div>
        {label && <label style={fieldLabelStyle}>{label}</label>}
        <div
          style={{
            borderRadius: 12,
            border: '1px solid rgba(234, 179, 8, 0.4)',
            background: 'rgba(254, 240, 138, 0.05)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            alignItems: 'center',
            justifyContent: 'center',
            aspectRatio,
            maxHeight: 220,
            width: aspectRatio === '1/1' ? '220px' : '100%',
          }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', width: '100%' }}>
            <img
              src={duplicateAsset.url}
              alt="Existing duplicate"
              style={{
                width: 60,
                height: 60,
                borderRadius: 8,
                objectFit: 'cover',
                border: '1px solid rgba(243, 229, 171,0.2)',
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fef08a' }}>
                Image Already Exists
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-sub)', marginTop: 2, lineHeight: 1.4 }}>
                This file is already in the <strong style={{ color: '#D4AF37' }}>{duplicateAsset.asset.bucket}</strong> folder.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, width: '100%', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                onChange(duplicateAsset.url)
                setDuplicateAsset(null)
                toast.success('Using existing image!')
              }}
              style={{
                flex: 1,
                padding: '6px 10px',
                borderRadius: 8,
                border: 'none',
                background: 'linear-gradient(135deg, #D4AF37, #AA7A1E)',
                color: '#0A0800',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Use Existing
            </button>
            <button
              type="button"
              onClick={async () => {
                const file = duplicateAsset.file
                const duplicateName = duplicateAsset.asset.filename
                setDuplicateAsset(null)
                reset()
                const result = await upload(file, compress, false, duplicateName) // Replace/overwrite
                if (result) {
                  onChange(result.url)
                  toast.success('Image replaced!')
                } else {
                  toast.error(error || 'Upload failed')
                }
              }}
              style={{
                flex: 1,
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid rgba(243, 229, 171, 0.2)',
                background: 'rgba(20, 16, 5, 0.6)',
                color: '#e2e8f0',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Replace Existing
            </button>
            <button
              type="button"
              onClick={async () => {
                const file = duplicateAsset.file
                setDuplicateAsset(null)
                reset()
                const result = await upload(file, compress, true) // Force upload new copy
                if (result) {
                  onChange(result.url)
                  toast.success('Uploaded as new copy!')
                } else {
                  toast.error(error || 'Upload failed')
                }
              }}
              style={{
                flex: 1,
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid rgba(243, 229, 171, 0.2)',
                background: 'rgba(20, 16, 5, 0.6)',
                color: '#e2e8f0',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Upload New
            </button>
            <button
              type="button"
              onClick={() => {
                setDuplicateAsset(null)
                reset()
              }}
              style={{
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid rgba(239, 68, 68, 0.3)',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#f87171',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── Render: has image ── */
  if (value && !uploading) {
    return (
      <div>
        {label && <label style={fieldLabelStyle}>{label}</label>}
        <ImagePreview
          url={value}
          aspectRatio={aspectRatio}
          onRemove={handleRemove}
          onReplace={handleReplace}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={onFileChange}
        />
        <MediaPickerModal
          open={mediaPicker}
          bucket={bucket}
          onSelect={handleMediaSelect}
          onClose={() => setMediaPicker(false)}
        />
      </div>
    )
  }

  /* ── Render: uploading ── */
  if (uploading) {
    return (
      <div>
        {label && <label style={fieldLabelStyle}>{label}</label>}
        <div
          style={{
            borderRadius: 12,
            border: '1px solid rgba(212, 175, 55, 0.22)',
            background: 'rgba(20, 16, 5, 0.6)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            aspectRatio,
            maxHeight: 220,
            width: aspectRatio === '1/1' ? '220px' : '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Animated upload icon */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          >
            <UploadCloud size={22} color="#F5D77F" />
          </div>
          <div style={{ width: '100%', maxWidth: 260 }}>
            <UploadProgress progress={progress} />
          </div>
        </div>
      </div>
    )
  }

  /* ── Render: empty / drop zone ── */
  return (
    <div>
      {label && <label style={fieldLabelStyle}>{label}</label>}

      {/* Compress toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 8,
          marginBottom: 6,
        }}
      >
        <Zap size={11} color={compress ? '#D4AF37' : '#475569'} />
        <label
          htmlFor={`compress-${label}`}
          style={{
            fontSize: '0.68rem',
            color: compress ? '#F5D77F' : '#475569',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
            userSelect: 'none',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {compress ? 'Compress ON' : 'Compress OFF'}
        </label>
        <div
          className="form-check form-switch mb-0 p-0"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <input
            id={`compress-${label}`}
            className="form-check-input m-0"
            type="checkbox"
            role="switch"
            checked={compress}
            onChange={e => setCompress(e.target.checked)}
            style={{ width: 30, height: 16, cursor: 'pointer', accentColor: '#D4AF37' }}
          />
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        aria-label="Upload image"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
        style={{
          borderRadius: 12,
          border: dragging
            ? '2px solid rgba(212, 175, 55, 0.7)'
            : '2px dashed rgba(243, 229, 171, 0.22)',
          background: dragging
            ? 'rgba(212, 175, 55, 0.06)'
            : 'rgba(20, 16, 5, 0.38)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: '1.75rem 1rem',
          aspectRatio,
          maxHeight: 220,
          width: aspectRatio === '1/1' ? '220px' : '100%',
          transition: 'all 0.2s ease',
          boxShadow: dragging ? '0 0 0 4px rgba(212, 175, 55,0.1)' : 'none',
        }}
      >
        {/* Upload icon */}
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: dragging
              ? 'rgba(212, 175, 55, 0.15)'
              : 'rgba(243, 229, 171, 0.08)',
            border: `1px solid ${dragging ? 'rgba(212, 175, 55,0.4)' : 'rgba(243, 229, 171,0.18)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
        >
          <UploadCloud
            size={22}
            color={dragging ? '#D4AF37' : '#475569'}
            style={{ transition: 'color 0.2s ease' }}
          />
        </div>

        <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
          <p
            style={{
              color: dragging ? '#F5D77F' : '#94a3b8',
              fontSize: '0.82rem',
              fontWeight: 600,
              margin: '0 0 2px',
              transition: 'color 0.2s ease',
            }}
          >
            {dragging ? 'Drop to upload' : 'Drag & drop or click to upload'}
          </p>
          <p
            style={{
              color: '#475569',
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              margin: 0,
            }}
          >
            JPG, PNG, WEBP, SVG, ICO · max {maxSizeMb}MB
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={onFileChange}
        />
      </div>

      {/* "Choose from Media" button */}
      <button
        type="button"
        onClick={e => {
          e.stopPropagation()
          setMediaPicker(true)
        }}
        style={{
          marginTop: 8,
          width: '100%',
          padding: '8px 0',
          borderRadius: 9,
          border: '1px solid rgba(243, 229, 171, 0.16)',
          background: 'rgba(20, 16, 5, 0.4)',
          color: '#94a3b8',
          fontSize: '0.78rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 7,
          transition: 'all 0.18s ease',
        }}
        onMouseEnter={e => {
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212, 175, 55,0.32)'
          ;(e.currentTarget as HTMLButtonElement).style.color = '#F5D77F'
          ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(212, 175, 55,0.06)'
        }}
        onMouseLeave={e => {
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(243, 229, 171,0.16)'
          ;(e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'
          ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(20, 16, 5,0.4)'
        }}
      >
        <Images size={14} />
        Choose from Media Library
      </button>

      {/* Error message */}
      {error && (
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: '#f87171',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <AlertCircle size={13} />
          {error}
        </div>
      )}

      <MediaPickerModal
        open={mediaPicker}
        bucket={bucket}
        onSelect={handleMediaSelect}
        onClose={() => setMediaPicker(false)}
      />
    </div>
  )
}
