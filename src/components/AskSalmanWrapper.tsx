'use client'

import dynamic from 'next/dynamic'

const AskSalman = dynamic(() => import('./AskSalman'), { ssr: false })

export default function AskSalmanWrapper() {
  return <AskSalman />
}

