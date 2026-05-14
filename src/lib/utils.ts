import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Number formatters ────────────────────────────────────────────────────────

/** $1,234 or $1.2k or $1M */
export function fmtMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1000)      return `$${(n / 1000 % 1 === 0 ? n / 1000 : (n / 1000).toFixed(1))}k`
  return `$${n.toFixed(0)}`
}

/** $1,000 (full with comma) */
export function fmtMoneyFull(n: number): string {
  return '$' + n.toLocaleString('en-US')
}

/** 1.2k or 1,234 */
export function fmtCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
  return n.toString()
}

/** Nov 14 */
export function fmtDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
  })
}

/** Nov 14, 2025 */
export function fmtDateLong(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day:   'numeric',
    year:  'numeric',
  })
}

/** percent of part/total, 0-100 */
export function pct(part: number, total: number): number {
  if (total === 0) return 0
  return Math.round((part / total) * 100)
}
