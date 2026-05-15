'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Users, Zap, BarChart2, ArrowUpRight, Plus, Loader2, Trophy, Target } from 'lucide-react'
import type { MilestoneHit } from '@/types'
import { MILESTONE_CONFIGS, type MilestoneCategory } from '@/types'

// ── Types ────────────────────────────────────────────────────────────────────

interface AccountData {
  id: string
  name: string
  mrr: number
  arr: number
  subscribers: number
  error: string | null
}

interface MRRData {
  connected: boolean
  totalMRR: number
  totalARR: number
  totalSubscribers: number
  accounts: AccountData[]
}

interface ProDashboardProps {
  milestones: MilestoneHit[]
  isSubscribed: boolean
}

// ── Formatters ────────────────────────────────────────────────────────────────

function fmtMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1000)      return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
  return `$${n.toFixed(0)}`
}

function fmtNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

function pct(part: number, total: number): number {
  if (total === 0) return 0
  return Math.round((part / total) * 100)
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ProDashboard({ milestones, isSubscribed }: ProDashboardProps) {
  const [data, setData]       = useState<MRRData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/mrr')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // ── Stats derived from milestones ─────────────────────────────────────────
  const totalPosted   = milestones.filter(m => m.posted).length
  const postingRate   = milestones.length > 0 ? pct(totalPosted, milestones.length) : 0
  const lastMilestone = milestones[0] ?? null

  const byCategory = Object.entries(
    milestones.reduce<Record<string, number>>((acc, m) => {
      const cat = m.category ?? 'mrr'
      acc[cat] = (acc[cat] ?? 0) + 1
      return acc
    }, {})
  ).sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-4">

      {/* ── Global stats row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total MRR */}
        <div className="col-span-2 rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 p-5">
          {loading ? (
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <Loader2 size={14} className="animate-spin" />
              Fetching MRR…
            </div>
          ) : data?.connected ? (
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-white/35 mb-1">
                  Total MRR{data.accounts.length > 1 ? ` · ${data.accounts.length} SaaS` : ''}
                </p>
                <p className="text-5xl font-extrabold text-white tracking-tight font-poppins">
                  {fmtMoney(data.totalMRR)}
                </p>
                <p className="text-sm text-white/40 mt-1">
                  <span className="font-semibold text-white/60">{fmtMoney(data.totalARR)}</span> ARR
                  {data.totalSubscribers > 0 && (
                    <span className="ml-3">{fmtNum(data.totalSubscribers)} active subscribers</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl border border-indigo-500/25 bg-indigo-500/10 px-3 py-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-xs text-indigo-400 font-medium">Live</span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-white/35">Connect Stripe to see your MRR</div>
          )}
        </div>

        {/* Milestones stats */}
        <StatCard
          icon={<Trophy size={15} className="text-amber-400" />}
          label="Milestones hit"
          value={milestones.length.toString()}
          sub={`${totalPosted} posted to X`}
          color="amber"
        />
        <StatCard
          icon={<Target size={15} className="text-indigo-400" />}
          label="Posting rate"
          value={`${postingRate}%`}
          sub={milestones.length === 0 ? 'No milestones yet' : `${totalPosted}/${milestones.length} auto-posted`}
          color="indigo"
        />
      </div>

      {/* ── Per-SaaS breakdown ────────────────────────────────────────────── */}
      {data?.accounts && data.accounts.length > 0 && (
        <div>
          <p className="text-xs font-medium text-white/35 uppercase tracking-wider mb-3">
            SaaS breakdown
          </p>
          <div className="space-y-2">
            {data.accounts.map(account => {
              const share = pct(account.mrr, data.totalMRR)
              return (
                <div key={account.id} className="rounded-xl border border-white/8 bg-white/4 px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15">
                        <TrendingUp size={13} className="text-indigo-400" />
                      </div>
                      <p className="text-sm font-semibold text-white">{account.name}</p>
                      {account.error && (
                        <span className="text-xs text-red-400/70">⚠ fetch failed</span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white font-poppins">
                        {fmtMoney(account.mrr)}
                        <span className="text-xs text-white/35 font-normal ml-1">MRR</span>
                      </p>
                      <p className="text-xs text-white/30">{fmtMoney(account.arr)} ARR</p>
                    </div>
                  </div>
                  {/* MRR share bar */}
                  {data.accounts.length > 1 && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-white/8 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                          style={{ width: `${share}%` }}
                        />
                      </div>
                      <span className="text-xs text-white/25 w-8 text-right">{share}%</span>
                    </div>
                  )}
                  {account.subscribers > 0 && (
                    <p className="text-xs text-white/30 mt-1.5">
                      {fmtNum(account.subscribers)} subscribers · avg {fmtMoney(account.subscribers > 0 ? Math.round(account.mrr / account.subscribers) : 0)}/mo
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Milestones by category ────────────────────────────────────────── */}
      {byCategory.length > 0 && (
        <div>
          <p className="text-xs font-medium text-white/35 uppercase tracking-wider mb-3">
            Milestones by category
          </p>
          <div className="grid grid-cols-3 gap-2">
            {byCategory.map(([cat, count]) => {
              const config = MILESTONE_CONFIGS[cat as MilestoneCategory]
              if (!config) return null
              return (
                <div key={cat} className="rounded-xl border border-white/8 bg-white/4 p-3 text-center">
                  <p className="text-lg font-bold text-white font-poppins">{count}</p>
                  <p className="text-xs text-white/40 mt-0.5">{config.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Last milestone ────────────────────────────────────────────────── */}
      {lastMilestone && (
        <div className="rounded-xl border border-white/8 bg-white/3 px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/30 mb-0.5">Last milestone</p>
            <p className="text-sm font-semibold text-white">
              {(() => {
                const cat = lastMilestone.category ?? 'mrr'
                const config = MILESTONE_CONFIGS[cat as MilestoneCategory]
                return config
                  ? `${config.formatValue(lastMilestone.amount)} ${config.label}`
                  : `$${lastMilestone.amount}`
              })()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/25">
              {new Date(lastMilestone.hit_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            {lastMilestone.posted && (
              <span className="flex items-center gap-1 rounded-full border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-xs text-sky-400">
                <ArrowUpRight size={10} />
                Posted
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Stat card helper ──────────────────────────────────────────────────────────

function StatCard({
  icon, label, value, sub, color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
  color: 'amber' | 'indigo' | 'green' | 'violet'
}) {
  const colors = {
    amber:  'bg-amber-500/10 border-amber-500/20',
    indigo: 'bg-indigo-500/10 border-indigo-500/20',
    green:  'bg-green-500/10 border-green-500/20',
    violet: 'bg-violet-500/10 border-violet-500/20',
  }
  return (
    <div className={`rounded-2xl border p-4 ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-xs text-white/40">{label}</span>
      </div>
      <p className="text-2xl font-extrabold text-white font-poppins">{value}</p>
      <p className="text-xs text-white/30 mt-0.5">{sub}</p>
    </div>
  )
}
