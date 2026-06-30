'use client'

import { useState, useEffect, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc =
  'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'

export default function PdfViewer({ url }: { url: string }) {
  const [numPages, setNumPages] = useState(0)
  const [pageWidth, setPageWidth] = useState(800)
  const [error, setError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setPageWidth(containerRef.current.clientWidth)
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        // ✅ Auto height — no empty space below PDF
        height: 'auto',
        background: '#525659',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 0',
        gap: 8,
      }}
    >
      {error ? (
        <div style={{ color: '#f87171', padding: 40, textAlign: 'center' }}>
          <p style={{ fontSize: '1rem', marginBottom: 8 }}>Could not load preview.</p>
          <a href="/api/resume" style={{ color: '#0ea5e9', fontSize: '0.9rem' }}>
            Click here to download instead →
          </a>
        </div>
      ) : (
        <Document
          file={url}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          onLoadError={() => setError(true)}
          loading={
            <p style={{ color: '#94a3b8', padding: 40 }}>Loading resume...</p>
          }
        >
          {Array.from({ length: numPages }, (_, i) => (
            <div key={i} style={{ marginBottom: i < numPages - 1 ? 8 : 0 }}>
              <Page
                pageNumber={i + 1}
                width={pageWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          ))}
        </Document>
      )}
    </div>
  )
}
