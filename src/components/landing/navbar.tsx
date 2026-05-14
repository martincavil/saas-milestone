'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Zap, ChevronRight } from 'lucide-react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500"
      style={{ padding: scrolled ? '12px 20px' : '0' }}
    >
      <header
        className="w-full transition-all duration-500"
        style={{
          maxWidth: scrolled ? '780px' : '100%',
          borderRadius: scrolled ? '16px' : '0',
          borderBottom: scrolled ? 'none' : '1px solid rgba(0,0,0,0.06)',
          background: scrolled
            ? 'rgba(255,255,255,0.82)'
            : 'rgba(255,255,255,0.95)',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(8px)',
          boxShadow: scrolled
            ? '0 2px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)'
            : 'none',
        }}
      >
        <div
          className="mx-auto flex items-center justify-between transition-all duration-500"
          style={{
            height: scrolled ? '52px' : '60px',
            padding: scrolled ? '0 20px' : '0 28px',
            maxWidth: '1024px',
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 transition-all duration-500"
              style={{ borderRadius: scrolled ? '10px' : '8px' }}
            >
              <Zap size={14} className="text-white" fill="white" />
            </div>
            <span
              className="text-sm font-semibold text-gray-900"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              saas-milestone
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-6 text-sm text-gray-500 md:flex">
            <a href="#how" className="hover:text-gray-900 transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden text-sm text-gray-500 hover:text-gray-900 transition-colors sm:block px-3 py-1.5"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-gray-900 text-white hover:bg-gray-700 transition-colors font-medium text-sm"
              style={{
                padding: scrolled ? '6px 14px' : '7px 16px',
                borderRadius: scrolled ? '10px' : '8px',
              }}
            >
              Connect Stripe free
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </header>
    </div>
  )
}
