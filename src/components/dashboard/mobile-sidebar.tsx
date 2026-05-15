'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Zap, Menu, X, LayoutDashboard, Trophy, Send, Plug, Settings, LogOut, Lock, ChevronRight } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const NAV = [
  { href: '/dashboard',            label: 'Overview',   icon: LayoutDashboard, pro: true  },
  { href: '/dashboard/milestones', label: 'Milestones', icon: Trophy,          pro: false },
  { href: '/dashboard/post',       label: 'Post',       icon: Send,            pro: true  },
  { href: '/dashboard/connectors', label: 'Connectors', icon: Plug,            pro: false },
  { href: '/dashboard/settings',   label: 'Settings',   icon: Settings,        pro: false },
]

export function MobileSidebarWrapper({ email, isSubscribed }: { email: string; isSubscribed: boolean }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router   = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    setOpen(false)
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex h-14 items-center justify-between border-b px-4 md:hidden" style={{ borderColor: 'var(--border)', background: 'var(--bg-2)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
            <Zap size={13} className="text-white" fill="white" />
          </div>
          <span className="text-sm font-semibold font-poppins" style={{ color: 'var(--text)' }}>saas-milestone</span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle variant="navbar" />
          <button
            onClick={() => setOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
            style={{ color: 'var(--text-2)' }}
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col shadow-2xl" style={{ background: 'var(--bg)' }}>
            <div className="flex h-14 items-center justify-between border-b px-4" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
                  <Zap size={13} className="text-white" fill="white" />
                </div>
                <span className="text-sm font-semibold font-poppins" style={{ color: 'var(--text)' }}>saas-milestone</span>
              </div>
              <button onClick={() => setOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ color: 'var(--text-3)' }}>
                <X size={16} />
              </button>
            </div>

            <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
              {NAV.map(({ href, label, icon: Icon, pro }) => {
                const active = pathname === href
                const locked = pro && !isSubscribed
                return (
                  <Link
                    key={href}
                    href={locked ? '/dashboard/connectors' : href}
                    onClick={(e) => { if (locked) e.preventDefault(); else setOpen(false) }}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                      active ? 'bg-indigo-600/10 text-indigo-600' : locked ? 'opacity-40' : ''
                    }`}
                    style={{ color: active ? '' : locked ? 'var(--text-3)' : 'var(--text-2)' }}
                  >
                    <Icon size={16} className="flex-shrink-0" />
                    <span className="flex-1">{label}</span>
                    {locked && <Lock size={11} />}
                    {active && <ChevronRight size={13} className="text-indigo-500" />}
                  </Link>
                )
              })}
            </nav>

            <div className="border-t p-3" style={{ borderColor: 'var(--border)' }}>
              <ThemeToggle variant="sidebar" />
              <div className="px-3 py-1.5">
                <p className="text-xs truncate" style={{ color: 'var(--text-3)' }}>{email}</p>
              </div>
              <button onClick={handleSignOut} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition-colors" style={{ color: 'var(--text-2)' }}>
                <LogOut size={13} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
