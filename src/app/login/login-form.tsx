'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface LoginFormProps {
  error?: string
  message?: string
}

export function LoginForm({ error, message }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState(error ?? '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErr('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/api/auth/callback`,
      },
    })

    setLoading(false)

    if (authError) {
      setErr(authError.message)
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        <div className="text-3xl mb-3">✉️</div>
        <p className="text-white font-medium">Check your email</p>
        <p className="text-white/50 text-sm mt-1">
          We sent a magic link to <span className="text-white/70">{email}</span>
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      {message && (
        <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-xs text-green-400">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-white/50 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
          />
        </div>
        {err && (
          <p className="text-xs text-red-400">{err}</p>
        )}
        <Button type="submit" loading={loading} className="w-full">
          Send magic link
        </Button>
      </form>
      <p className="text-center text-xs text-white/25 mt-4">
        No password. No friction. ✨
      </p>
    </div>
  )
}
