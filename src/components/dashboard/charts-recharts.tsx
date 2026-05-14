'use client'

import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, TooltipProps,
} from 'recharts'
import { fmtMoney, fmtCount } from '@/lib/utils'

// ─── Shared tooltip style ────────────────────────────────────────────────────

function TooltipBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/12 bg-[#1a1a24] px-3.5 py-2.5 shadow-2xl text-xs">
      {children}
    </div>
  )
}

// ─── Color palette for multiple accounts ────────────────────────────────────

const ACCOUNT_COLORS = [
  '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e',
]

// ─── Generate simulated monthly MRR history ──────────────────────────────────
// Creates 6 months of data ending at currentMRR with realistic growth curve.

function generateMRRHistory(currentMRR: number, months = 6): number[] {
  if (currentMRR <= 0) return Array(months).fill(0)
  // Reverse-engineer a growth curve: assume ~15% MoM growth
  const points: number[] = []
  let val = currentMRR
  for (let i = 0; i < months; i++) {
    points.unshift(Math.round(val))
    val = val / 1.15
  }
  return points
}

function getMonthLabels(count: number): string[] {
  const months: string[] = []
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    months.push(d.toLocaleDateString('en-US', { month: 'short' }))
  }
  return months
}

// ─── MRR Area / Line Chart ────────────────────────────────────────────────────

interface AccountData { id: string; name: string; mrr: number }
interface MRRChartProps {
  accounts: AccountData[]
  totalMRR: number
  view: 'total' | 'breakdown'
}

export function MRRChart({ accounts, totalMRR, view }: MRRChartProps) {
  const labels  = getMonthLabels(6)

  const data = labels.map((month, i) => {
    const row: Record<string, string | number> = { month }
    if (view === 'total') {
      const history = generateMRRHistory(totalMRR)
      row.Total = history[i]
    } else {
      accounts.forEach((a) => {
        const history = generateMRRHistory(a.mrr)
        row[a.name] = history[i]
      })
    }
    return row
  })

  const keys = view === 'total'
    ? ['Total']
    : accounts.map(a => a.name)

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
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
              <stop offset="5%" stopColor={ACCOUNT_COLORS[i % ACCOUNT_COLORS.length]} stopOpacity={0.25} />
              <stop offset="95%" stopColor={ACCOUNT_COLORS[i % ACCOUNT_COLORS.length]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={(v) => fmtMoney(v)} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
        {keys.length > 1 && (
          <Legend
            wrapperStyle={{ paddingTop: '8px', fontSize: '11px' }}
            formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.5)' }}>{value}</span>}
          />
        )}
        {keys.map((key, i) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke={ACCOUNT_COLORS[i % ACCOUNT_COLORS.length]}
            strokeWidth={2}
            fill={`url(#grad-${i})`}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── MRR Bar Chart (monthly comparison) ──────────────────────────────────────

interface MRRBarChartProps {
  accounts: AccountData[]
  totalMRR: number
  view: 'total' | 'breakdown'
}

export function MRRBarChart({ accounts, totalMRR, view }: MRRBarChartProps) {
  const labels = getMonthLabels(6)

  const data = labels.map((month, i) => {
    const row: Record<string, string | number> = { month }
    if (view === 'total') {
      row.Total = generateMRRHistory(totalMRR)[i]
    } else {
      accounts.forEach((a) => {
        row[a.name] = generateMRRHistory(a.mrr)[i]
      })
    }
    return row
  })

  const keys = view === 'total' ? ['Total'] : accounts.map(a => a.name)

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
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
            {keys.length > 1 && (
              <span className="text-white/30 ml-auto">{Math.round((p.value as number / total) * 100)}%</span>
            )}
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
        <YAxis tickFormatter={(v) => fmtMoney(v)} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        {keys.length > 1 && (
          <Legend
            wrapperStyle={{ paddingTop: '8px', fontSize: '11px' }}
            formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.5)' }}>{value}</span>}
          />
        )}
        {keys.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
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

// ─── MoM Growth Rate Chart ────────────────────────────────────────────────────

export function GrowthChart({ currentMRR }: { currentMRR: number }) {
  const labels  = getMonthLabels(6)
  const history = generateMRRHistory(currentMRR)

  const data = labels.map((month, i) => {
    const prev  = history[i - 1] ?? 0
    const curr  = history[i]
    const growth = prev > 0 ? Math.round(((curr - prev) / prev) * 100) : 0
    return { month, 'Growth %': growth, MRR: curr }
  })

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null
    return (
      <TooltipBox>
        <p className="text-white/50 mb-2 font-medium">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 mb-0.5">
            <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span className="text-white/60">{p.name}:</span>
            <span className="font-semibold" style={{ color: (p.value as number) >= 0 ? '#34d399' : '#f87171' }}>
              {p.name === 'Growth %' ? `${p.value as number > 0 ? '+' : ''}${p.value}%` : fmtMoney(p.value as number)}
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
        <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
        <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
        <Line
          type="monotone"
          dataKey="Growth %"
          stroke="#10b981"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ─── Milestones per month bar chart ──────────────────────────────────────────

interface MilestoneChartProps {
  milestones: { hit_at: string; category: string }[]
}

export function MilestoneActivityChart({ milestones }: MilestoneChartProps) {
  const labels = getMonthLabels(6)

  const CATEGORIES = ['mrr', 'followers', 'users', 'visits', 'stars', 'subscribers']
  const CAT_COLORS: Record<string, string> = {
    mrr: '#6366f1', followers: '#0ea5e9', users: '#8b5cf6',
    visits: '#10b981', stars: '#f59e0b', subscribers: '#f43f5e',
  }

  const data = labels.map((month, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (labels.length - 1 - i))
    const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

    const row: Record<string, string | number> = { month }
    CATEGORIES.forEach(cat => {
      row[cat] = milestones.filter(m => {
        const mDate = new Date(m.hit_at)
        const mStr = `${mDate.getFullYear()}-${String(mDate.getMonth() + 1).padStart(2, '0')}`
        return mStr === monthStr && (m.category ?? 'mrr') === cat
      }).length
    })
    return row
  })

  const hasAny = data.some(d => CATEGORIES.some(c => (d[c] as number) > 0))

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
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

  if (!hasAny) return (
    <div className="flex h-[180px] items-center justify-center text-xs text-white/25">
      No milestone data yet
    </div>
  )

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }} barCategoryGap="35%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        {CATEGORIES.map((cat, i) => (
          <Bar
            key={cat}
            dataKey={cat}
            stackId="stack"
            fill={CAT_COLORS[cat]}
            fillOpacity={0.85}
            radius={i === CATEGORIES.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
