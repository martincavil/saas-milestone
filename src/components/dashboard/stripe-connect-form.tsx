'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface StripeConnectFormProps {
  isConnected: boolean
  accountName?: string
}

export function StripeConnectForm({ isConnected, accountName }: StripeConnectFormProps) {
  const [apiKey, setApiKey] = useState('')
  const [name, setName] = useState(accountName ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(!isConnected)
  const router = useRouter()

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/stripe-connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, accountName: name }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error)
      return
    }

    setShowForm(false)
    router.refresh()
  }

  async function handleDisconnect() {
    setLoading(true)
    await fetch('/api/stripe-connect', { method: 'DELETE' })
    setLoading(false)
    router.refresh()
  }

  if (isConnected && !showForm) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-indigo-400 fill-current">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{accountName}</p>
              <p className="text-xs text-white/40">Stripe connected</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowForm(true)}>
              Edit
            </Button>
            <Button variant="danger" size="sm" onClick={handleDisconnect} loading={loading}>
              Disconnect
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-sm font-medium text-white mb-1">Connect Stripe</h3>
      <p className="text-xs text-white/40 mb-4">
        Use a restricted API key with read-only access to subscriptions.
      </p>
      <form onSubmit={handleConnect} className="space-y-3">
        <div>
          <label className="block text-xs text-white/50 mb-1.5">SaaS name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="My Awesome SaaS"
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1.5">Stripe Restricted API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="rk_live_..."
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-colors font-mono"
          />
        </div>
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
        <div className="flex gap-2">
          <Button type="submit" variant="primary" loading={loading} className="flex-1">
            Connect Stripe
          </Button>
          {isConnected && (
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
