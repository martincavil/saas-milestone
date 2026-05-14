'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Trash2, Loader2 } from 'lucide-react'

interface TwitterConnectProps {
  isConnected: boolean
  screenName?: string
}

export function TwitterConnect({ isConnected, screenName }: TwitterConnectProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDisconnect() {
    setLoading(true)
    await fetch('/api/twitter-auth/disconnect', { method: 'DELETE' })
    setLoading(false)
    router.refresh()
  }

  if (isConnected) {
    return (
      <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15">
              <X size={16} className="text-sky-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">@{screenName}</p>
              <p className="text-xs text-white/35">X (Twitter) connected</p>
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-40"
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-syne)' }}>Connect X (Twitter)</p>
          <p className="text-xs text-white/40 mt-0.5">Auto-post milestones to your timeline</p>
        </div>
        <a
          href="/api/twitter-auth"
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white hover:border-sky-500/30 hover:bg-sky-500/10 hover:text-sky-300 transition-all"
        >
          <X size={13} />
          Connect
        </a>
      </div>
    </div>
  )
}
