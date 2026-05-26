'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LinkedInIcon } from '@/components/ui/brand-logos'
import { Trash2, Loader2 } from 'lucide-react'

export function LinkedInConnect({
  isConnected,
  name,
}: {
  isConnected: boolean
  name?: string
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDisconnect() {
    setLoading(true)
    await fetch('/api/linkedin-auth/disconnect', { method: 'POST' })
    setLoading(false)
    router.refresh()
  }

  if (isConnected) {
    return (
      <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/15">
              <LinkedInIcon size={16} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{name}</p>
              <p className="text-xs text-white/35">LinkedIn connected</p>
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
          <p className="text-sm font-semibold text-white font-poppins">Connect LinkedIn</p>
          <p className="text-xs text-white/40 mt-0.5">Auto-post milestones to your profile</p>
        </div>
        <a
          href="/api/linkedin-auth"
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-300 transition-all"
        >
          <LinkedInIcon size={12} />
          Connect
        </a>
      </div>
    </div>
  )
}
