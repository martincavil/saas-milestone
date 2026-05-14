'use client'

import { type MilestoneHit } from '@/types'
import { formatMRR, formatDate } from '@/lib/utils'

interface MilestoneFeedProps {
  milestones: MilestoneHit[]
}

const MILESTONE_ICONS: Record<number, string> = {
  1: '🌱',
  10: '🚀',
  50: '💫',
  100: '🎯',
  500: '⚡',
  1000: '🔥',
  5000: '💎',
  10000: '👑',
}

export function MilestoneFeed({ milestones }: MilestoneFeedProps) {
  if (milestones.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <div className="text-4xl mb-3">🌱</div>
        <p className="text-white/60 text-sm">No milestones hit yet.</p>
        <p className="text-white/30 text-xs mt-1">We check your MRR every hour.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {milestones.map((m) => (
        <div
          key={m.id}
          className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-4"
        >
          <div className="text-2xl flex-shrink-0">{MILESTONE_ICONS[m.amount] ?? '🎉'}</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white">{formatMRR(m.amount)} MRR</p>
            <p className="text-xs text-white/40 mt-0.5">{formatDate(m.hit_at)}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {m.posted ? (
              <span className="flex items-center gap-1.5 rounded-full bg-sky-500/15 border border-sky-500/20 px-3 py-1 text-xs text-sky-400">
                <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Posted
              </span>
            ) : (
              <span className="text-xs text-white/25">Not posted</span>
            )}
            {m.tweet_id && (
              <a
                href={`https://x.com/i/web/status/${m.tweet_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                View →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
