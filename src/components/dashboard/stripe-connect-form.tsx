'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Pencil, Trash2, Loader2, AlertCircle } from 'lucide-react'

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
      <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15">
              <CreditCard size={16} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{accountName}</p>
              <p className="text-xs text-white/35">Stripe connected</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => setShowForm(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/8 hover:text-white/70 transition-colors"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={handleDisconnect}
              disabled={loading}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-40"
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
      <p className="mb-1 text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-poppins)' }}>
        Connect Stripe
      </p>
      <p className="mb-4 text-xs text-white/40">
        Restricted read-only key — access to subscriptions only.
      </p>
      <form onSubmit={handleConnect} className="space-y-3">
        <div>
          <label className="mb-1.5 block text-xs text-white/50">SaaS name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="My Awesome SaaS"
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white placeholder-white/20 transition-colors focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-white/50">Restricted API key</label>
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="rk_live_..."
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 font-mono text-sm text-white placeholder-white/20 transition-colors focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/20"
          />
        </div>
        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : 'Connect Stripe'}
          </button>
          {isConnected && (
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
