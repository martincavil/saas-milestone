'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, Trophy, Send, Plug, Settings, Zap, LogOut, CreditCard, Lock, ChevronRight } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface SidebarProps {
  email: string
  isSubscribed: boolean
}

const NAV = [
  { href: '/dashboard',            label: 'Overview',   icon: LayoutDashboard, pro: true  },
  { href: '/dashboard/milestones', label: 'Milestones', icon: Trophy,          pro: false },
  { href: '/dashboard/post',       label: 'Post',       icon: Send,            pro: true  },
  { href: '/dashboard/connectors', label: 'Connectors', icon: Plug,            pro: false },
  { href: '/dashboard/settings',   label: 'Settings',   icon: Settings,        pro: false },
]

export function Sidebar({ email, isSubscribed }: SidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col
      border-r
      bg-white border-gray-200
      dark:bg-[#0d0d10] dark:border-white/8
      transition-colors duration-200">

      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b px-4
        border-gray-200 dark:border-white/8">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
          <Zap size={13} className="text-white" fill="white" />
        </div>
        <span className="text-sm font-semibold font-poppins text-gray-900 dark:text-white">
          saas-milestone
        </span>
        {isSubscribed && (
          <span className="ml-auto rounded-full bg-indigo-500/20 border border-indigo-500/30 px-1.5 py-0.5 text-xs text-indigo-600 dark:text-indigo-400">
            Pro
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 p-3 flex-1 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon, pro }) => {
          const active = pathname === href
          const locked = pro && !isSubscribed

          return (
            <Link
              key={href}
              href={locked ? '/dashboard/connectors' : href}
              onClick={locked ? (e) => e.preventDefault() : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                active
                  ? 'bg-indigo-600/10 text-indigo-600 dark:bg-indigo-600/20 dark:text-indigo-300'
                  : locked
                  ? 'text-gray-300 cursor-default dark:text-white/25'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-white/55 dark:hover:bg-white/6 dark:hover:text-white/90'
              }`}
            >
              <Icon size={16} className="shrink-0" />
              <span className="flex-1">{label}</span>
              {locked && <Lock size={11} className="text-gray-300 dark:text-white/25" />}
              {active && !locked && <ChevronRight size={13} className="text-indigo-500 dark:text-indigo-400" />}
              {pro && isSubscribed && !active && (
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400/50" />
              )}
            </Link>
          )
        })}

        {/* Upgrade CTA */}
        {!isSubscribed && (
          <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-3
            dark:border-indigo-500/20 dark:bg-indigo-500/8">
            <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1">Unlock Pro</p>
            <p className="text-xs text-indigo-500/70 dark:text-white/35 mb-2.5">Overview, posting, and full analytics.</p>
            <Link href="/dashboard/settings" className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors">
              Upgrade — $9/mo
            </Link>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t p-3 space-y-0.5 border-gray-200 dark:border-white/8">
        {/* Theme toggle */}
        <ThemeToggle variant="sidebar" />

        {isSubscribed && (
          <button
            onClick={async () => {
              const res = await fetch('/api/billing-portal', { method: 'POST' })
              const { url } = await res.json()
              if (url) window.open(url, '_blank', 'noopener,noreferrer')
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition-colors
              text-gray-500 hover:bg-gray-100 hover:text-gray-700
              dark:text-white/40 dark:hover:bg-white/6 dark:hover:text-white/70"
          >
            <CreditCard size={13} />
            Billing
          </button>
        )}
        <div className="px-3 py-1.5">
          <p className="text-xs text-gray-400 dark:text-white/25 truncate">{email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition-colors
            text-gray-500 hover:bg-gray-100 hover:text-gray-700
            dark:text-white/40 dark:hover:bg-white/6 dark:hover:text-white/70"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
