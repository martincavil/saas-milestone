'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface PaywallBannerProps {
  mrr: number
  isSubscribed: boolean
}

export function PaywallBanner({ mrr, isSubscribed }: PaywallBannerProps) {
  const [loading, setLoading] = useState(false)

  if (isSubscribed || mrr < 100) return null

  async function handleUpgrade() {
    setLoading(true)
    const res = await fetch('/api/upgrade-checkout', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    setLoading(false)
  }

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-amber-300">
          🎉 You've crossed $100 MRR — milestone tracking is now $9/mo
        </p>
        <p className="text-xs text-amber-400/70 mt-0.5">
          Free tier is for MRR under $100. Upgrade to keep auto-posting milestones.
        </p>
      </div>
      <Button
        variant="primary"
        size="sm"
        onClick={handleUpgrade}
        loading={loading}
        className="flex-shrink-0 bg-amber-500 hover:bg-amber-400"
      >
        Upgrade $9/mo
      </Button>
    </div>
  )
}
