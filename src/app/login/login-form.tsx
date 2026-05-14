'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, Mail, Loader2 } from 'lucide-react'

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
      options: { emailRedirectTo: `${location.origin}/api/auth/callback` },
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
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Mail size={20} className="text-green-600" />
        </div>
        <p className="font-semibold text-gray-900" style={{ fontFamily: 'var(--font-syne)' }}>
          Check your inbox
        </p>
        <p className="mt-1.5 text-sm text-gray-500">
          Magic link sent to <span className="font-medium text-gray-700">{email}</span>
        </p>
        <p className="mt-3 text-xs text-gray-400">Check spam if it doesn't show up in 60 seconds.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      {message && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-xs text-green-700">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Work email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@yourcompany.com"
            required
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        {err && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
            {err}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              Send magic link
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </form>
      <p className="mt-5 text-center text-xs text-gray-400">
        No password. No friction.
      </p>
    </div>
  )
}
