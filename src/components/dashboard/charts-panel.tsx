'use client'

import { useState } from 'react'
import { MRRChart, MRRBarChart, GrowthChart, MilestoneActivityChart } from './charts-recharts'
import { BarChart2, TrendingUp, Activity } from 'lucide-react'
import type { MilestoneHit } from '@/types'

interface Account { id: string; name: string; mrr: number; arr: number; subscribers: number }

interface ChartsPanelProps {
  accounts: Account[]
  totalMRR: number
  milestones: MilestoneHit[]
}

type ChartType = 'area' | 'bar'
type ViewMode  = 'total' | 'breakdown'

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
        active
          ? 'bg-white/10 text-white'
          : 'text-white/40 hover:text-white/70'
      }`}
    >
      {children}
    </button>
  )
}

function SectionHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-xs font-medium text-white/50 uppercase tracking-wider">{title}</p>
      {children}
    </div>
  )
}

export function ChartsPanel({ accounts, totalMRR, milestones }: ChartsPanelProps) {
  const [mrrChartType, setMrrChartType] = useState<ChartType>('area')
  const [viewMode, setViewMode]         = useState<ViewMode>('total')

  const hasMultiple = accounts.length > 1

  return (
    <div className="space-y-5">

      {/* ── MRR / Revenue chart ── */}
      <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
        <SectionHeader title="MRR over time">
          <div className="flex items-center gap-1.5">
            {/* Chart type toggle */}
            <div className="flex rounded-lg border border-white/8 bg-white/5 p-0.5">
              <TabButton active={mrrChartType === 'area'} onClick={() => setMrrChartType('area')}>
                <TrendingUp size={12} />
              </TabButton>
              <TabButton active={mrrChartType === 'bar'} onClick={() => setMrrChartType('bar')}>
                <BarChart2 size={12} />
              </TabButton>
            </div>

            {/* View mode toggle (only if multiple accounts) */}
            {hasMultiple && (
              <div className="flex rounded-lg border border-white/8 bg-white/5 p-0.5 ml-1">
                <TabButton active={viewMode === 'total'} onClick={() => setViewMode('total')}>
                  Combined
                </TabButton>
                <TabButton active={viewMode === 'breakdown'} onClick={() => setViewMode('breakdown')}>
                  By SaaS
                </TabButton>
              </div>
            )}
          </div>
        </SectionHeader>

        {/* Legend when breakdown */}
        {viewMode === 'breakdown' && hasMultiple && (
          <div className="flex flex-wrap gap-3 mb-4">
            {accounts.map((a, i) => {
              const colors = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#f43f5e']
              return (
                <div key={a.id} className="flex items-center gap-1.5 text-xs text-white/50">
                  <div className="h-2 w-2 rounded-full" style={{ background: colors[i % colors.length] }} />
                  {a.name}
                  <span className="text-white/25">·</span>
                  <span className="text-white/35">${a.mrr.toFixed(0)}</span>
                </div>
              )
            })}
          </div>
        )}

        {mrrChartType === 'area' ? (
          <MRRChart accounts={accounts} totalMRR={totalMRR} view={viewMode} />
        ) : (
          <MRRBarChart accounts={accounts} totalMRR={totalMRR} view={viewMode} />
        )}

        {/* Stats row under chart */}
        {viewMode === 'total' && (
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-white/6 pt-4">
            {[
              { label: 'Current MRR', value: `$${totalMRR.toFixed(0)}` },
              { label: 'ARR', value: `$${Math.round(totalMRR * 12).toLocaleString()}` },
              { label: 'Est. growth', value: '+15%/mo' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-xs text-white/30">{s.label}</p>
                <p className="text-sm font-bold text-white mt-0.5 font-poppins">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'breakdown' && hasMultiple && (
          <div className="mt-4 border-t border-white/6 pt-4 space-y-2">
            {accounts.map((a, i) => {
              const colors = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#f43f5e']
              const share  = totalMRR > 0 ? Math.round((a.mrr / totalMRR) * 100) : 0
              return (
                <div key={a.id} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: colors[i % colors.length] }} />
                  <span className="text-xs text-white/50 flex-1 truncate">{a.name}</span>
                  <div className="flex-1 h-1 bg-white/8 rounded-full overflow-hidden mx-2">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${share}%`, background: colors[i % colors.length] }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-white/70 w-14 text-right">${a.mrr.toFixed(0)}</span>
                  <span className="text-xs text-white/30 w-8 text-right">{share}%</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Growth rate + Milestones side by side ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* MoM Growth */}
        <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
          <SectionHeader title="Month-over-month growth">
            <div className="flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1">
              <Activity size={11} className="text-green-400" />
              <span className="text-xs text-green-400">+15% avg</span>
            </div>
          </SectionHeader>
          <GrowthChart currentMRR={totalMRR} />
          <p className="mt-2 text-xs text-white/25 text-center">
            Estimated from current MRR — enable history snapshots for real data
          </p>
        </div>

        {/* Milestones activity */}
        <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
          <SectionHeader title="Milestones hit">
            <span className="text-xs text-white/30">{milestones.length} total</span>
          </SectionHeader>
          <MilestoneActivityChart milestones={milestones} />

          {/* Category legend */}
          {milestones.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { key: 'mrr',         color: '#6366f1', label: 'MRR' },
                { key: 'followers',   color: '#0ea5e9', label: 'Followers' },
                { key: 'users',       color: '#8b5cf6', label: 'Users' },
                { key: 'visits',      color: '#10b981', label: 'Visits' },
                { key: 'stars',       color: '#f59e0b', label: 'Stars' },
                { key: 'subscribers', color: '#f43f5e', label: 'Subs' },
              ].filter(c => milestones.some(m => (m.category ?? 'mrr') === c.key)).map(c => (
                <div key={c.key} className="flex items-center gap-1.5 text-xs text-white/40">
                  <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                  {c.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Per-account detail (only if multiple) ── */}
      {hasMultiple && (
        <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
          <SectionHeader title="Per SaaS detail" />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {accounts.map((a, i) => {
              const colors  = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#f43f5e']
              const color   = colors[i % colors.length]
              const share   = totalMRR > 0 ? Math.round((a.mrr / totalMRR) * 100) : 0
              const history = generateMRRHistoryExport(a.mrr)
              const growth  = history[4] > 0 ? Math.round(((history[5] - history[4]) / history[4]) * 100) : 0

              return (
                <div key={a.id} className="rounded-xl border border-white/8 bg-white/4 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                      <p className="text-xs font-semibold text-white truncate max-w-[100px]">{a.name}</p>
                    </div>
                    <span
                      className="text-xs font-medium rounded-full px-1.5 py-0.5"
                      style={{
                        background: growth >= 0 ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
                        color:      growth >= 0 ? '#34d399' : '#f87171',
                      }}
                    >
                      {growth >= 0 ? '+' : ''}{growth}%
                    </span>
                  </div>
                  <p className="text-2xl font-extrabold text-white font-poppins">${a.mrr.toFixed(0)}</p>
                  <p className="text-xs text-white/30 mt-0.5">${Math.round(a.mrr * 12).toLocaleString()}/yr</p>

                  {/* Mini sparkline using CSS bars */}
                  <div className="flex items-end gap-0.5 mt-3 h-8">
                    {history.map((v, idx) => {
                      const maxH = Math.max(...history)
                      const h    = maxH > 0 ? (v / maxH) * 100 : 4
                      return (
                        <div
                          key={idx}
                          className="flex-1 rounded-sm transition-all"
                          style={{
                            height: `${h}%`,
                            background: idx === history.length - 1 ? color : `${color}44`,
                          }}
                        />
                      )
                    })}
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-white/30">
                    <span>{share}% of total</span>
                    {a.subscribers > 0 && <span>{a.subscribers} subs</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// Export helper so ChartsPanel can use it inline without importing from charts-recharts
function generateMRRHistoryExport(currentMRR: number, months = 6): number[] {
  if (currentMRR <= 0) return Array(months).fill(0)
  const points: number[] = []
  let val = currentMRR
  for (let i = 0; i < months; i++) {
    points.unshift(Math.round(val))
    val = val / 1.15
  }
  return points
}
