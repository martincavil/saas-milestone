'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

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
    <header className="border-b border-white/8 bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🚀</span>
          <span className="text-sm font-semibold text-white">saas-milestone</span>
          {isSubscribed && (
            <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-xs text-indigo-400">
              Pro
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30 hidden sm:block">{email}</span>
          {isSubscribed && (
            <Button variant="ghost" size="sm" onClick={handleBillingPortal} loading={loading}>
              Billing
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  )
}
