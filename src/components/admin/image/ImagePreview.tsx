'use client'

import { useState } from 'react'
import { X, RefreshCw, Image as ImageIcon } from 'lucide-react'

interface ImagePreviewProps {
  url: string
  aspectRatio?: string
  onRemove: () => void
  onReplace: () => void
  /** Optional explicit height cap in px (default 220) */
  maxHeightPx?: number
}

export default function ImagePreview({
  url,
  aspectRatio = '16/9',
  onRemove,
  onReplace,
  maxHeightPx = 220,
}: ImagePreviewProps) {
  const [broken, setBroken] = useState(false)
  // Use 'contain' for square/icon ratios so they don't get cropped
  const isSquare = aspectRatio === '1/1'
  const fit = isSquare ? 'contain' : 'cover'

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 10,
        overflow: 'hidden',
        border: '1px solid rgba(212, 175, 55, 0.28)',
        background: 'rgba(20, 16, 5, 0.6)',
        aspectRatio,
        maxHeight: maxHeightPx,
        width: isSquare ? maxHeightPx : '100%',
      }}
    >
      {broken ? (
        /* Broken image fallback */
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: 'var(--admin-text-sub)',
            padding: 16,
          }}
        >
          <ImageIcon size={28} style={{ opacity: 0.4 }} />
          <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', textAlign: 'center', opacity: 0.6 }}>
            Image failed to load
          </span>
        </div>
      ) : (
        <img
          src={url}
          alt="Uploaded preview"
          onError={() => setBroken(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: fit,
            objectPosition: 'center',
            display: 'block',
          }}
        />
      )}

      {/* Overlay controls */}
      <div
        className="img-preview-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10, 8, 0, 0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        <button
          type="button"
          onClick={onReplace}
          title="Replace image"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 8,
            background: 'rgba(20, 16, 5, 0.9)',
            border: '1px solid rgba(243, 229, 171, 0.3)',
            color: '#f8fafc',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
            transition: 'all 0.2s ease',
          }}
        >
          <RefreshCw size={13} /> Replace
        </button>

        <button
          type="button"
          onClick={onRemove}
          title="Remove image"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 34,
            height: 34,
            borderRadius: 8,
            background: 'rgba(239, 68, 68, 0.85)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            color: '#fff',
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
            transition: 'all 0.2s ease',
          }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Success badge */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          background: 'rgba(16, 185, 129, 0.9)',
          borderRadius: 6,
          padding: '2px 8px',
          fontSize: '0.65rem',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          color: '#fff',
          backdropFilter: 'blur(4px)',
        }}
      >
        ✓ Uploaded
      </div>

      <style>{`
        .img-preview-overlay {
          opacity: 0 !important;
        }
        div:hover > .img-preview-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  )
}
