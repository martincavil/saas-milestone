'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

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
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/20">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-sky-400">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white">@{screenName}</p>
              <p className="text-xs text-white/40">X (Twitter) connected</p>
            </div>
          </div>
          <Button variant="danger" size="sm" onClick={handleDisconnect} loading={loading}>
            Disconnect
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-white">Connect X (Twitter)</h3>
          <p className="text-xs text-white/40 mt-0.5">Auto-post milestones to your timeline</p>
        </div>
        <a href="/api/twitter-auth">
          <Button variant="secondary" size="sm">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Connect
          </Button>
        </a>
      </div>
    </div>
  )
}
