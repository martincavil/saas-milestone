'use client'

import Link from 'next/link'
import { Zap, GitBranch, CreditCard, TrendingUp, Star } from 'lucide-react'
import { XIcon } from '@/components/ui/brand-logos'
import type { MilestoneHit } from '@/types'
import { MILESTONE_CONFIGS } from '@/types'

interface FreeOverviewProps {
  milestones: MilestoneHit[]
  twitterAccounts: { screen_name: string; twitter_user_id: string }[]
  stripeAccounts: { id: string; stripe_account_name: string }[]
  currentMRR?: number
}

function getNextMilestone(currentMRR: number): number | null {
  const thresholds = MILESTONE_CONFIGS.mrr.thresholds
  return thresholds.find(t => t > currentMRR) ?? null
}

function formatMRR(n: number): string {
  if (n >= 1000) return `$${(n / 1000 % 1 === 0 ? n / 1000 : (n / 1000).toFixed(1))}k`
  return `$${n}`
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

export function FreeOverview({ milestones, twitterAccounts, stripeAccounts, currentMRR = 0 }: FreeOverviewProps) {
  const nextMilestone = getNextMilestone(currentMRR)
  const lastMilestone = milestones[0]

  const progressPct = nextMilestone && nextMilestone > 0
    ? Math.min(100, Math.round((currentMRR / nextMilestone) * 100))
    : 0

  return (
    <div className="p-6 space-y-6">
      {/* Free plan banner */}
      <div className="flex items-center justify-between rounded-2xl border border-indigo-500/20 bg-indigo-500/8 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15">
            <Star size={13} className="text-indigo-400" />
          </div>
          <p className="text-sm text-white/70">
            You're on the <span className="font-semibold text-white">free plan</span>
            <span className="text-white/40"> — unlock full analytics and auto-posting with Pro</span>
          </p>
        </div>
        <Link
          href="/dashboard/settings"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          <Zap size={11} fill="white" />
          Upgrade
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
          <p className="text-xs text-white/35 uppercase tracking-wider mb-2">Milestones</p>
          <p className="text-2xl font-bold text-white">{milestones.length}</p>
          <p className="text-xs text-white/30 mt-1">total hit</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
          <p className="text-xs text-white/35 uppercase tracking-wider mb-2">Current MRR</p>
          <p className="text-2xl font-bold text-white">{currentMRR > 0 ? formatMRR(currentMRR) : '—'}</p>
          <p className="text-xs text-white/30 mt-1">monthly recurring</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
          <p className="text-xs text-white/35 uppercase tracking-wider mb-2">Last activity</p>
          <p className="text-2xl font-bold text-white">{lastMilestone ? timeAgo(lastMilestone.hit_at) : '—'}</p>
          <p className="text-xs text-white/30 mt-1">
            {lastMilestone ? `${formatMRR(lastMilestone.amount)} milestone` : 'no milestones yet'}
          </p>
        </div>
      </div>

      {/* Connectors status */}
      <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
        <p className="text-xs font-medium text-white/35 uppercase tracking-wider mb-4">Connected accounts</p>
        <div className="space-y-3">
          {/* Stripe */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5">
                <CreditCard size={13} className="text-white/50" />
              </div>
              <div>
                <p className="text-sm text-white/80">Stripe</p>
                {stripeAccounts.length > 0 && (
                  <p className="text-xs text-white/30">{stripeAccounts[0].stripe_account_name}</p>
                )}
              </div>
            </div>
            {stripeAccounts.length > 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/25 bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Connected
              </span>
            ) : (
              <Link href="/dashboard/connectors" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                Connect →
              </Link>
            )}
          </div>

          {/* Twitter / X */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-white/50">
                <XIcon size={13} />
              </div>
              <div>
                <p className="text-sm text-white/80">X (Twitter)</p>
                {twitterAccounts.length > 0 && (
                  <p className="text-xs text-white/30">@{twitterAccounts[0].screen_name}</p>
                )}
              </div>
            </div>
            {twitterAccounts.length > 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/25 bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Connected
              </span>
            ) : (
              <Link href="/dashboard/connectors" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                Connect →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Next milestone */}
      {nextMilestone && (
        <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-indigo-400" />
              <p className="text-xs font-medium text-white/35 uppercase tracking-wider">Next milestone</p>
            </div>
            <p className="text-sm font-bold text-white">{formatMRR(nextMilestone)}</p>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden mb-2">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/30">
            <span>{currentMRR > 0 ? formatMRR(currentMRR) : '$0'} now</span>
            <span>{progressPct}% there</span>
          </div>
        </div>
      )}

      {/* Pro CTA */}
      <div className="rounded-2xl border border-indigo-500/15 bg-gradient-to-br from-indigo-500/8 to-violet-500/5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GitBranch size={14} className="text-indigo-400" />
              <p className="text-sm font-semibold text-white">Unlock the full dashboard</p>
            </div>
            <p className="text-xs text-white/40 leading-relaxed mb-4">
              Full analytics, historical charts, manual posting, and multi-account overview — free until $100 MRR.
            </p>
            <ul className="space-y-1.5 mb-4">
              {['Auto-post milestones to X', 'Full analytics & charts', 'GitHub Stars tracking', 'Multi-account support'].map(f => (
                <li key={f} className="flex items-center gap-2 text-xs text-white/50">
                  <span className="text-indigo-400">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          <Zap size={13} fill="white" />
          Upgrade to Pro — $9/mo
        </Link>
        <p className="mt-2.5 text-xs text-white/25">Free until $100 MRR. No credit card needed to start.</p>
      </div>
    </div>
  )
}
