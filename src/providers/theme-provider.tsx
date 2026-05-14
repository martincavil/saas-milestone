'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: Theme
  resolved: 'light' | 'dark'   // actual applied theme
  setTheme: (t: Theme) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  resolved: 'dark',
  setTheme: () => {},
  toggle: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')

  function getResolved(t: Theme): 'light' | 'dark' {
    if (t === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return t
  }

  function applyTheme(t: Theme) {
    const resolved = getResolved(t)
    const html     = document.documentElement
    if (resolved === 'dark') {
      html.classList.add('dark')
      html.classList.remove('light')
    } else {
      html.classList.remove('dark')
      html.classList.add('light')
    }
  }

  function setTheme(t: Theme) {
    localStorage.setItem('theme', t)
    setThemeState(t)
    applyTheme(t)
  }

  function toggle() {
    const resolved = getResolved(theme)
    setTheme(resolved === 'dark' ? 'light' : 'dark')
  }

  // On mount: read saved preference or system
  useEffect(() => {
    const saved = (localStorage.getItem('theme') as Theme | null) ?? 'system'
    setThemeState(saved)
    applyTheme(saved)

    // Listen to system changes when in 'system' mode
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    function onSystemChange() {
      if ((localStorage.getItem('theme') ?? 'system') === 'system') {
        applyTheme('system')
      }
    }
    mq.addEventListener('change', onSystemChange)
    return () => mq.removeEventListener('change', onSystemChange)
  }, [])

  const resolved: 'light' | 'dark' = typeof window !== 'undefined' ? getResolved(theme) : 'dark'

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}
