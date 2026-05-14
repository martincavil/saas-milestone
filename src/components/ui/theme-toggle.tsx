'use client'

import { useTheme } from '@/providers/theme-provider'
import { Sun, Moon } from 'lucide-react'

interface ThemeToggleProps {
  className?: string
  variant?: 'navbar' | 'sidebar'
}

export function ThemeToggle({ className = '', variant = 'navbar' }: ThemeToggleProps) {
  const { resolved, toggle } = useTheme()
  const isDark = resolved === 'dark'

  if (variant === 'sidebar') {
    return (
      <button
        onClick={toggle}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition-colors
          text-white/40 hover:bg-white/6 hover:text-white/70
          dark:text-white/40 dark:hover:bg-white/6 dark:hover:text-white/70
          light:text-gray-500 light:hover:bg-gray-100 light:hover:text-gray-700
          ${className}`}
      >
        {isDark
          ? <Sun size={13} className="flex-shrink-0" />
          : <Moon size={13} className="flex-shrink-0" />
        }
        {isDark ? 'Light mode' : 'Dark mode'}
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all
        dark:text-white/50 dark:hover:bg-white/8 dark:hover:text-white/80
        light:text-gray-500 light:hover:bg-gray-100 light:hover:text-gray-700
        ${className}`}
    >
      {isDark
        ? <Sun size={15} />
        : <Moon size={15} />
      }
    </button>
  )
}
