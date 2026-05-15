'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'
type Resolved = 'light' | 'dark'

interface ThemeCtx {
  theme: Theme
  resolved: Resolved
  setTheme: (t: Theme) => void
  toggle: () => void
}

const Ctx = createContext<ThemeCtx>({ theme: 'system', resolved: 'dark', setTheme: () => {}, toggle: () => {} })

export const useTheme = () => useContext(Ctx)

function resolve(t: Theme): Resolved {
  if (t !== 'system') return t
  return (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'
}

function apply(t: Theme) {
  const r = resolve(t)
  document.documentElement.classList.toggle('dark',  r === 'dark')
  document.documentElement.classList.toggle('light', r === 'light')
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')

  const setTheme = (t: Theme) => {
    localStorage.setItem('theme', t)
    setThemeState(t)
    apply(t)
  }

  const toggle = () => {
    const r = resolve(theme)
    setTheme(r === 'dark' ? 'light' : 'dark')
  }

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as Theme | null) ?? 'system'
    setThemeState(saved)
    apply(saved)
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => { if ((localStorage.getItem('theme') ?? 'system') === 'system') apply('system') }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <Ctx.Provider value={{ theme, resolved: resolve(theme), setTheme, toggle }}>
      {children}
    </Ctx.Provider>
  )
}
