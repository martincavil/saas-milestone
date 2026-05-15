'use client'

import { useTheme } from '@/providers/theme-provider'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle({ variant = 'navbar' }: { variant?: 'navbar' | 'sidebar' }) {
  const { resolved, toggle } = useTheme()
  const isDark = resolved === 'dark'

  if (variant === 'sidebar') {
    return (
      <button
        onClick={toggle}
        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition-colors"
        style={{ color: 'var(--text-2)' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
        onMouseLeave={e => (e.currentTarget.style.background = '')}
      >
        {isDark ? <Sun size={13} /> : <Moon size={13} />}
        <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
      style={{ color: 'var(--text-2)' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
      onMouseLeave={e => (e.currentTarget.style.background = '')}
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  )
}
