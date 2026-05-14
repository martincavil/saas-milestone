'use client'

import { MILESTONES } from '@/types'
import { TrendingUp, Activity } from 'lucide-react'

interface MRRCardProps {
  mrr: number
  accountName: string
}

function formatMRR(amount: number): string {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`
  return `$${amount.toFixed(2)}`
}

export function MRRCard({ mrr, accountName }: MRRCardProps) {
  const nextMilestone = MILESTONES.find(m => m > mrr) ?? null
  const prevMilestone = [...MILESTONES].reverse().find(m => m <= mrr) ?? 0
  const progress = nextMilestone
    ? Math.min(((mrr - prevMilestone) / (nextMilestone - prevMilestone)) * 100, 100)
    : 100

  const nextFormatted = nextMilestone
    ? nextMilestone >= 1000 ? `$${nextMilestone / 1000}k` : `$${nextMilestone}`
    : null
  const remaining = nextMilestone ? nextMilestone - mrr : 0

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-indigo-500/0 via-indigo-500/60 to-indigo-500/0" />

      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-white/40" />
              <p className="text-xs font-mono uppercase tracking-widest text-white/40">{accountName}</p>
            </div>
            <p
              className="text-5xl font-extrabold tracking-tighter text-white"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              {formatMRR(mrr)}
            </p>
            <p className="mt-1 text-xs text-white/40">Monthly Recurring Revenue</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1">
            <Activity size={11} className="text-green-400" />
            <span className="text-xs text-green-400 font-medium">Live</span>
          </div>
        </div>

        {nextMilestone && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs text-white/40">
              <span>Next: {nextFormatted}</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-white/25">
              ${remaining.toFixed(0)} to go
            </p>
          </div>
        )}

        {!nextMilestone && (
          <div className="mt-5 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20">
              <TrendingUp size={12} className="text-amber-400" />
            </div>
            <span className="text-sm text-white/50">All milestones unlocked</span>
          </div>
        )}
      </div>
    </div>
  )
}
