'use client'

interface UploadProgressProps {
  progress: number  // 0–100
  label?: string
}

export default function UploadProgress({ progress, label = 'Uploading...' }: UploadProgressProps) {
  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.35rem',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--admin-text-sub)',
        }}
      >
        <span>{label}</span>
        <span style={{ color: 'var(--admin-accent)' }}>{Math.round(progress)}%</span>
      </div>

      {/* Track */}
      <div
        style={{
          width: '100%',
          height: 5,
          borderRadius: 999,
          background: 'rgba(243, 229, 171, 0.12)',
          overflow: 'hidden',
        }}
      >
        {/* Fill */}
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            borderRadius: 999,
            background: 'linear-gradient(90deg, #D4AF37, #AA7A1E, #B8860B)',
            transition: 'width 0.18s ease',
            boxShadow: '0 0 8px rgba(212, 175, 55,0.5)',
          }}
        />
      </div>
    </div>
  )
}
