'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Zap, LogOut, CreditCard, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface DashboardHeaderProps {
  email: string
  isSubscribed: boolean
}

export function DashboardHeader({ email, isSubscribed }: DashboardHeaderProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function handleBillingPortal() {
    setLoading(true)
    const res = await fetch('/api/billing-portal', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    setLoading(false)
  }

  return (
    <header className="sticky top-0 z-10 border-b border-white/8 bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600">
            <Zap size={12} className="text-white" fill="white" />
          </div>
          <span className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-poppins)' }}>
            saas-milestone
          </span>
          {isSubscribed && (
            <span className="rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2 py-0.5 text-xs text-indigo-400">
              Pro
            </span>
          )}
        </Link>

        <div className="flex items-center gap-1">
          <span className="mr-2 hidden text-xs text-white/25 sm:block">{email}</span>
          {isSubscribed && (
            <button
              onClick={handleBillingPortal}
              disabled={loading}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/8 hover:text-white/70 transition-colors"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />}
            </button>
          )}
          <button
            onClick={handleSignOut}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/8 hover:text-white/70 transition-colors"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  )
}
