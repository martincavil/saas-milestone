'use client'

import { type MilestoneHit } from '@/types'
import { TrendingUp, X, ExternalLink, Clock } from 'lucide-react'

interface MilestoneFeedProps {
  milestones: MilestoneHit[]
}

function formatMRR(amount: number): string {
  if (amount >= 1000) return `$${amount / 1000}k`
  return `$${amount}`
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export function MilestoneFeed({ milestones }: MilestoneFeedProps) {
  if (milestones.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
          <Clock size={18} className="text-white/30" />
        </div>
        <p className="text-sm text-white/40">No milestones hit yet.</p>
        <p className="mt-1 text-xs text-white/20">We check your MRR every hour.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {milestones.map((m) => (
        <div
          key={m.id}
          className="flex items-center gap-4 rounded-xl border border-white/8 bg-white/4 px-4 py-3 transition-colors hover:bg-white/6"
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/15">
            <TrendingUp size={15} className="text-indigo-400" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white text-sm" style={{ fontFamily: 'var(--font-syne)' }}>
              {formatMRR(m.amount)} MRR
            </p>
            <p className="text-xs text-white/35 mt-0.5">{formatDate(m.hit_at)}</p>
          </div>

          <div className="flex flex-shrink-0 items-center gap-2">
            {m.posted ? (
              <span className="flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-xs text-sky-400">
                <X size={10} />
                Posted
              </span>
            ) : (
              <span className="text-xs text-white/20">Not posted</span>
            )}
            {m.tweet_id && (
              <a
                href={`https://x.com/i/web/status/${m.tweet_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/25 hover:text-white/60 transition-colors"
              >
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
