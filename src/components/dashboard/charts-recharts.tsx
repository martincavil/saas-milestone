'use client'

import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, TooltipProps,
} from 'recharts'
import { fmtMoney } from '@/lib/utils'
import type { MilestoneHit } from '@/types'

// ─── Shared tooltip ──────────────────────────────────────────────────────────

function TooltipBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/12 bg-[#1a1a24] px-3.5 py-2.5 shadow-2xl text-xs">
      {children}
    </div>
  )
}

const ACCOUNT_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e']

// ─── Build MRR history from real milestone dates ──────────────────────────────
// For each month: the MRR is the value of the highest MRR milestone hit so far.
// Current month uses the live MRR from Stripe.
// Months before any milestone = $0.

export function buildMRRHistoryFromMilestones(
  currentMRR: number,
  milestones: MilestoneHit[],
  months = 7
): { month: string; label: string; value: number }[] {
  const mrrMilestones = milestones
    .filter(m => (m.category ?? 'mrr') === 'mrr')
    .sort((a, b) => new Date(a.hit_at).getTime() - new Date(b.hit_at).getTime())

  const now   = new Date()
  const result: { month: string; label: string; value: number }[] = []

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59)
    const monthKey   = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label      = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })

    const isCurrentMonth = i === 0

    if (isCurrentMonth) {
      // Current month: use live MRR
      result.push({ month: monthKey, label, value: Math.round(currentMRR) })
    } else {
      // Past month: highest MRR milestone crossed on or before end of this month
      const hitsUpToMonth = mrrMilestones.filter(
        m => new Date(m.hit_at) <= endOfMonth
      )
      const maxHit = hitsUpToMonth.reduce((max, m) => Math.max(max, m.amount), 0)
      result.push({ month: monthKey, label, value: maxHit })
    }
  }

  return result
}

// ─── MRR Area Chart ───────────────────────────────────────────────────────────

interface AccountData { id: string; name: string; mrr: number }

interface MRRChartProps {
  accounts: AccountData[]
  totalMRR: number
  allMilestones: MilestoneHit[]
  view: 'total' | 'breakdown'
}

export function MRRChart({ accounts, totalMRR, allMilestones, view }: MRRChartProps) {
  const totalHistory = buildMRRHistoryFromMilestones(totalMRR, allMilestones)

  const data = totalHistory.map((point, i) => {
    const row: Record<string, string | number> = { month: point.label }
    if (view === 'total') {
      row['Total MRR'] = point.value
    } else {
      accounts.forEach(a => {
        // Each account: proportion of total MRR applied to total history
        const ratio  = totalMRR > 0 ? a.mrr / totalMRR : 0
        row[a.name]  = Math.round(point.value * ratio)
      })
    }
    return row
  })

  const keys = view === 'total' ? ['Total MRR'] : accounts.map(a => a.name)

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{name: string; value: number; color: string}>; label?: string }) => {
    if (!active || !payload?.length) return null
    return (
      <TooltipBox>
        <p className="text-white/50 mb-2 font-medium">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 mb-0.5">
            <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span className="text-white/60">{p.name}:</span>
            <span className="font-semibold text-white">{fmtMoney(p.value as number)}</span>
          </div>
        ))}
      </TooltipBox>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          {keys.map((key, i) => (
            <linearGradient key={key} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={ACCOUNT_COLORS[i % ACCOUNT_COLORS.length]} stopOpacity={0.25} />
              <stop offset="95%" stopColor={ACCOUNT_COLORS[i % ACCOUNT_COLORS.length]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={v => fmtMoney(v)} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
        {keys.length > 1 && (
          <Legend wrapperStyle={{ paddingTop: '8px', fontSize: '11px' }} formatter={v => <span style={{ color: 'rgba(255,255,255,0.5)' }}>{v}</span>} />
        )}
        {keys.map((key, i) => (
          <Area key={key} type="monotone" dataKey={key}
            stroke={ACCOUNT_COLORS[i % ACCOUNT_COLORS.length]} strokeWidth={2}
            fill={`url(#grad-${i})`} dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── MRR Bar Chart ────────────────────────────────────────────────────────────

export function MRRBarChart({ accounts, totalMRR, allMilestones, view }: MRRChartProps) {
  const totalHistory = buildMRRHistoryFromMilestones(totalMRR, allMilestones)

  const data = totalHistory.map(point => {
    const row: Record<string, string | number> = { month: point.label }
    if (view === 'total') {
      row['Total MRR'] = point.value
    } else {
      accounts.forEach(a => {
        const ratio = totalMRR > 0 ? a.mrr / totalMRR : 0
        row[a.name]  = Math.round(point.value * ratio)
      })
    }
    return row
  })

  const keys = view === 'total' ? ['Total MRR'] : accounts.map(a => a.name)

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{name: string; value: number; color: string}>; label?: string }) => {
    if (!active || !payload?.length) return null
    const total = payload.reduce((s, p) => s + (p.value as number), 0)
    return (
      <TooltipBox>
        <p className="text-white/50 mb-2 font-medium">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 mb-0.5">
            <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span className="text-white/60">{p.name}:</span>
            <span className="font-semibold text-white">{fmtMoney(p.value as number)}</span>
            {keys.length > 1 && <span className="text-white/30 ml-auto">{Math.round(((p.value as number) / total) * 100)}%</span>}
          </div>
        ))}
        {keys.length > 1 && (
          <div className="border-t border-white/10 mt-1.5 pt-1.5 flex justify-between">
            <span className="text-white/40">Total</span>
            <span className="font-bold text-white">{fmtMoney(total)}</span>
          </div>
        )}
      </TooltipBox>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={v => fmtMoney(v)} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        {keys.length > 1 && <Legend wrapperStyle={{ paddingTop: '8px', fontSize: '11px' }} formatter={v => <span style={{ color: 'rgba(255,255,255,0.5)' }}>{v}</span>} />}
        {keys.map((key, i) => (
          <Bar key={key} dataKey={key}
            stackId={view === 'breakdown' ? 'stack' : undefined}
            fill={ACCOUNT_COLORS[i % ACCOUNT_COLORS.length]}
            radius={i === keys.length - 1 || view === 'total' ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            fillOpacity={0.85}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─── MoM Growth Chart ─────────────────────────────────────────────────────────

export function GrowthChart({ currentMRR, milestones }: { currentMRR: number; milestones: MilestoneHit[] }) {
  const history = buildMRRHistoryFromMilestones(currentMRR, milestones)

  const data = history.map((point, i) => {
    const prev   = history[i - 1]?.value ?? 0
    const growth = prev > 0 ? Math.round(((point.value - prev) / prev) * 100) : 0
    return { month: point.label, 'Growth %': growth, MRR: point.value }
  })

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{name: string; value: number; color: string}>; label?: string }) => {
    if (!active || !payload?.length) return null
    return (
      <TooltipBox>
        <p className="text-white/50 mb-2 font-medium">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 mb-0.5">
            <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span className="text-white/60">{p.name}:</span>
            <span className="font-semibold" style={{ color: (p.value as number) >= 0 ? '#34d399' : '#f87171' }}>
              {p.name === 'Growth %' ? `${(p.value as number) > 0 ? '+' : ''}${p.value}%` : fmtMoney(p.value as number)}
            </span>
          </div>
        ))}
      </TooltipBox>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
        <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
        <Line type="monotone" dataKey="Growth %"
          stroke="#10b981" strokeWidth={2} dot={false}
          activeDot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ─── Milestone activity chart ─────────────────────────────────────────────────

export function MilestoneActivityChart({ milestones }: { milestones: MilestoneHit[] }) {
  const MONTHS  = 6
  const now     = new Date()
  const CATEGORIES = ['mrr', 'followers', 'users', 'visits', 'stars', 'subscribers']
  const CAT_COLORS: Record<string, string> = {
    mrr: '#6366f1', followers: '#0ea5e9', users: '#8b5cf6',
    visits: '#10b981', stars: '#f59e0b', subscribers: '#f43f5e',
  }

  const data = Array.from({ length: MONTHS }, (_, i) => {
    const d       = new Date(now.getFullYear(), now.getMonth() - (MONTHS - 1 - i), 1)
    const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label   = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    const row: Record<string, string | number> = { month: label }
    CATEGORIES.forEach(cat => {
      row[cat] = milestones.filter(m => {
        const mDate = new Date(m.hit_at)
        const mStr  = `${mDate.getFullYear()}-${String(mDate.getMonth() + 1).padStart(2, '0')}`
        return mStr === monthStr && (m.category ?? 'mrr') === cat
      }).length
    })
    return row
  })

  const hasAny = data.some(d => CATEGORIES.some(c => (d[c] as number) > 0))

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{name: string; value: number; color: string}>; label?: string }) => {
    if (!active || !payload?.length) return null
    const visible = payload.filter(p => (p.value as number) > 0)
    if (!visible.length) return null
    return (
      <TooltipBox>
        <p className="text-white/50 mb-2 font-medium">{label}</p>
        {visible.map((p, i) => (
          <div key={i} className="flex items-center gap-2 mb-0.5">
            <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span className="text-white/60 capitalize">{p.name}:</span>
            <span className="font-semibold text-white">{p.value} milestone{(p.value as number) > 1 ? 's' : ''}</span>
          </div>
        ))}
      </TooltipBox>
    )
  }

  if (!hasAny) {
    return <div className="flex h-[180px] items-center justify-center text-xs text-white/25">No milestones hit in the last 6 months</div>
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }} barCategoryGap="35%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        {CATEGORIES.map((cat, i) => (
          <Bar key={cat} dataKey={cat} stackId="stack"
            fill={CAT_COLORS[cat]} fillOpacity={0.85}
            radius={i === CATEGORIES.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
