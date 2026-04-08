'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

type AdSize = 'banner' | 'rectangle' | 'leaderboard'

const AD_STYLES: Record<AdSize, { minHeight: string; format: string }> = {
  banner: { minHeight: '90px', format: 'horizontal' },
  rectangle: { minHeight: '250px', format: 'rectangle' },
  leaderboard: { minHeight: '60px', format: 'horizontal' },
}

export default function AdSlot({
  size = 'banner',
  className = '',
}: {
  size?: AdSize
  className?: string
}) {
  const adRef = useRef<HTMLModElement>(null)
  const pushed = useRef(false)
  const { minHeight, format } = AD_STYLES[size]

  useEffect(() => {
    if (pushed.current) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch {
      // AdSense not loaded yet
    }
  }, [])

  return (
    <div className={`w-full flex items-center justify-center ${className}`} style={{ minHeight }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight, width: '100%' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID || ''}
        data-ad-slot=""
        data-ad-format={format}
        data-full-width-responsive="true"
        ref={adRef}
      />
    </div>
  )
}
