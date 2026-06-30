'use client'

import React, { useState, useEffect } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Download, Loader2 } from 'lucide-react'
import ResumePDF from './ResumePDF'

interface Props {
  profile: any
  experiences: any[]
  education: any[]
  skillsByCategory: Record<string, string[]>
  projects: any[]
}

export default function DownloadPDFButton(props: Props) {
  // We must delay the render of PDFDownloadLink until client mount to avoid hydration errors
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="pdf-download-placeholder">
        <Loader2 className="animate-spin" size={18} />
        Preparing PDF...
      </div>
    )
  }

  return (
    <div className="pdf-btn-container">
      <PDFDownloadLink 
        document={<ResumePDF {...props} />} 
        fileName={`${props.profile.full_name?.replace(' ', '_')}_Resume.pdf`}
        className="pdf-download-btn"
      >
        {({ blob, url, loading, error }) => 
          loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Generating PDF...
            </>
          ) : (
            <>
              <Download size={18} />
              Download PDF Resume
            </>
          )
        }
      </PDFDownloadLink>
    </div>
  )
}
