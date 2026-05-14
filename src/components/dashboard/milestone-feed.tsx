'use client'

import { type MilestoneHit, MILESTONE_CONFIGS, type MilestoneCategory } from '@/types'
import { TrendingUp, X, ExternalLink, Clock, Users, Globe, Star, Mail } from 'lucide-react'

interface MilestoneFeedProps {
  milestones: MilestoneHit[]
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function CategoryIcon({ category }: { category: MilestoneCategory }) {
  const icons: Record<MilestoneCategory, React.ReactNode> = {
    mrr:         <TrendingUp size={14} className="text-indigo-400" />,
    followers:   <X size={14} className="text-sky-400" />,
    users:       <Users size={14} className="text-violet-400" />,
    visits:      <Globe size={14} className="text-emerald-400" />,
    stars:       <Star size={14} className="text-amber-400" />,
    subscribers: <Mail size={14} className="text-rose-400" />,
  }
  const colors: Record<MilestoneCategory, string> = {
    mrr:         'bg-indigo-500/15',
    followers:   'bg-sky-500/15',
    users:       'bg-violet-500/15',
    visits:      'bg-emerald-500/15',
    stars:       'bg-amber-500/15',
    subscribers: 'bg-rose-500/15',
  }
  return (
    <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${colors[category] ?? 'bg-white/10'}`}>
      {icons[category] ?? <TrendingUp size={14} className="text-white/40" />}
    </div>
  )
}

export function MilestoneFeed({ milestones }: MilestoneFeedProps) {
  if (milestones.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
          <Clock size={18} className="text-white/30" />
        </div>
        <p className="text-sm text-white/40">No milestones hit yet.</p>
        <p className="mt-1 text-xs text-white/20">We check your metrics every hour.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {milestones.map((m) => {
        const cat = m.category ?? 'mrr'
        const config = MILESTONE_CONFIGS[cat as MilestoneCategory]
        const label = config
          ? `${config.formatValue(m.amount)} ${config.label}`
          : `${m.amount}`

        return (
          <div
            key={m.id}
            className="flex items-center gap-4 rounded-xl border border-white/8 bg-white/4 px-4 py-3 transition-colors hover:bg-white/6"
          >
            <CategoryIcon category={cat as MilestoneCategory} />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-white text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
                  {label}
                </p>
                <span className="rounded-full border border-white/8 bg-white/5 px-1.5 py-0.5 text-xs text-white/30 capitalize">
                  {cat}
                </span>
              </div>
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
        )
      })}
    </div>
  )
}
