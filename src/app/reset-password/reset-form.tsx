'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Zap } from 'lucide-react'

export function ResetPasswordForm() {
  const [password, setPassword]     = useState('')
  const [confirm, setConfirm]       = useState('')
  const [showPwd, setShowPwd]       = useState(false)
  const [loading, setLoading]       = useState(false)
  const [done, setDone]             = useState(false)
  const [err, setErr]               = useState('')
  const [sessionOk, setSessionOk]   = useState(false)

  const supabase = createClient()

  useEffect(() => {
    // Supabase sets session from the URL fragment on load
    supabase.auth.getSession().then(({ data }) => {
      setSessionOk(!!data.session)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setErr("Passwords don't match."); return }
    if (password.length < 8)  { setErr('Minimum 8 characters.'); return }

    setLoading(true); setErr('')
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) { setErr(error.message); return }
    setDone(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 font-nunito bg-base">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <Zap size={14} className="text-white" fill="white" />
            </div>
            <span className="text-sm font-semibold font-poppins text-ink">MilestoneHit</span>
          </Link>
          <h1 className="text-2xl font-bold font-poppins text-ink">
            {done ? 'Password updated' : 'Set new password'}
          </h1>
        </div>

        {done ? (
          <div className="rounded-2xl border p-8 text-center bg-surf border-edge">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl">✓</div>
            <p className="text-sm mb-4 text-ink-2">Your password has been updated successfully.</p>
            <Link href="/login" className="btn-primary w-full justify-center">
              Sign in <ArrowRight size={15} />
            </Link>
          </div>
        ) : !sessionOk ? (
          <div className="rounded-2xl border p-8 text-center bg-surf border-edge">
            <p className="text-sm mb-4 text-ink-2">
              This link has expired or is invalid. Request a new one.
            </p>
            <Link href="/login" className="btn-secondary w-full justify-center">
              Back to sign in
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border bg-surf border-edge">
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {err && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                    {err}
                  </div>
                )}

                {[
                  { label: 'New password', value: password, setValue: setPassword, placeholder: 'Minimum 8 characters' },
                  { label: 'Confirm password', value: confirm, setValue: setConfirm, placeholder: 'Repeat your password' },
                ].map(({ label, value, setValue, placeholder }) => (
                  <div key={label}>
                    <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
                    <div className="relative">
                      <input
                        type={showPwd ? 'text' : 'password'}
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={placeholder}
                        required
                        minLength={8}
                        className="t-input pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3"
                      >
                        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                ))}

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={15} />}
                  {loading ? 'Updating…' : 'Update password'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
