'use client'

import { useState } from 'react'
import { Loader2, Zap } from 'lucide-react'

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
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-500/25 bg-amber-500/8 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
          <Zap size={14} className="text-amber-400" fill="currentColor" />
        </div>
        <div>
          <p className="text-sm font-medium text-amber-300">You've crossed $100 MRR</p>
          <p className="text-xs text-amber-400/60 mt-0.5">Upgrade to keep posting milestones automatically.</p>
        </div>
      </div>
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-400 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : null}
        $9/mo
      </button>
    </div>
  )
}
