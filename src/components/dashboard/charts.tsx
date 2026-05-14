'use client'

import { useMemo } from 'react'

// ── Simple SVG sparkline ──────────────────────────────────────────────────────

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  fill?: boolean
}

export function Sparkline({ data, width = 120, height = 36, color = '#6366f1', fill = true }: SparklineProps) {
  const path = useMemo(() => {
    if (data.length < 2) return ''
    const max = Math.max(...data, 1)
    const min = Math.min(...data)
    const range = max - min || 1
    const points = data.map((v, i) => ({
      x: (i / (data.length - 1)) * width,
      y: height - ((v - min) / range) * (height - 4) - 2,
    }))
    const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
    if (!fill) return line
    const area = `${line} L ${width} ${height} L 0 ${height} Z`
    return area
  }, [data, width, height])

  const linePath = useMemo(() => {
    if (data.length < 2) return ''
    const max = Math.max(...data, 1)
    const min = Math.min(...data)
    const range = max - min || 1
    const points = data.map((v, i) => ({
      x: (i / (data.length - 1)) * width,
      y: height - ((v - min) / range) * (height - 4) - 2,
    }))
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  }, [data, width, height])

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`fill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {fill && (
        <path d={path} fill={`url(#fill-${color.replace('#', '')})`} />
      )}
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Horizontal bar chart ──────────────────────────────────────────────────────

interface BarData {
  label: string
  value: number
  color?: string
}

interface BarChartProps {
  data: BarData[]
  formatValue?: (n: number) => string
}

export function HorizontalBars({ data, formatValue = (n) => n.toString() }: BarChartProps) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="space-y-2.5">
      {data.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="text-white/55 truncate max-w-[140px]">{item.label}</span>
            <span className="text-white/70 font-semibold ml-2" style={{ fontFamily: 'var(--font-poppins)' }}>
              {formatValue(item.value)}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(item.value / max) * 100}%`,
                background: item.color ?? 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Mini stat card ────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string
  sub?: string
  trend?: number   // positive = up, negative = down
  sparkData?: number[]
  color?: string
}

export function StatCard({ label, value, sub, trend, sparkData, color = '#6366f1' }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-white/40">{label}</p>
        {trend !== undefined && (
          <span
            className="text-xs font-medium rounded-full px-1.5 py-0.5"
            style={{
              background: trend >= 0 ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)',
              color:      trend >= 0 ? '#34d399' : '#f87171',
            }}
          >
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-white mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
        {value}
      </p>
      {sub && <p className="text-xs text-white/30">{sub}</p>}
      {sparkData && sparkData.length > 1 && (
        <div className="mt-3">
          <Sparkline data={sparkData} color={color} height={28} />
        </div>
      )}
    </div>
  )
}
