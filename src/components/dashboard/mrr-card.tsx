'use client'

import { MILESTONE_CONFIGS } from '@/types'
import { fmtMoney } from '@/lib/utils'
import { TrendingUp, Activity } from 'lucide-react'

export function MRRCard({ mrr, accountName }: { mrr: number; accountName: string }) {
  const milestones    = MILESTONE_CONFIGS.mrr.thresholds
  const nextMilestone = milestones.find(m => m > mrr) ?? null
  const prevMilestone = [...milestones].reverse().find(m => m <= mrr) ?? 0
  const progress      = nextMilestone
    ? Math.min(((mrr - prevMilestone) / (nextMilestone - prevMilestone)) * 100, 100)
    : 100

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
            <p className="text-5xl font-extrabold tracking-tighter text-white font-poppins">
              {fmtMoney(mrr)}
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
              <span>Next: {fmtMoney(nextMilestone)}</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-white/25">${(nextMilestone - mrr).toFixed(0)} to go</p>
          </div>
        )}
      </div>
    </div>
  )
}
