'use client'

import dynamic from 'next/dynamic'

const AskVinit = dynamic(() => import('./AskVinit'), { ssr: false })

export default function AskVinitWrapper() {
  return <AskVinit />
}
