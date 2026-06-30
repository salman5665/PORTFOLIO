'use client'

import { Printer } from 'lucide-react'

export default function PrintButton() {
  return (
    <div className="print-btn-container">
      <button 
        onClick={() => window.print()} 
        className="print-btn"
        title="Print or Save as PDF"
      >
        <Printer size={18} />
        Save as PDF
      </button>
    </div>
  )
}
