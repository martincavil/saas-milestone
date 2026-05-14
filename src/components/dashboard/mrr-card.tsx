'use client'

import { MILESTONES } from '@/types'
import { formatMRR } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface MRRCardProps {
  mrr: number
  accountName: string
}

export function MRRCard({ mrr, accountName }: MRRCardProps) {
  const nextMilestone = MILESTONES.find(m => m > mrr) ?? null
  const prevMilestone = [...MILESTONES].reverse().find(m => m <= mrr) ?? 0
  const progress = nextMilestone
    ? ((mrr - prevMilestone) / (nextMilestone - prevMilestone)) * 100
    : 100

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/50 uppercase tracking-wider">{accountName}</p>
          <p className="mt-1 text-5xl font-bold text-white tracking-tight">
            {formatMRR(mrr)}
          </p>
          <p className="mt-1 text-sm text-white/40">Monthly Recurring Revenue</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-green-500/15 border border-green-500/20 px-3 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400 font-medium">Live</span>
        </div>
      </div>

      {nextMilestone && (
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs text-white/40">
            <span>Progress to {formatMRR(nextMilestone)}</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-white/30">
            {formatMRR(nextMilestone - mrr)} to go
          </p>
        </div>
      )}

      {!nextMilestone && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-2xl">👑</span>
          <span className="text-sm text-white/50">All milestones unlocked!</span>
        </div>
      )}
    </div>
  )
}
