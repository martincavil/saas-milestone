import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { readFileSync } from 'fs'
import { join } from 'path'
import React from 'react'

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1000) return `$${(n / 1000 % 1 === 0 ? n / 1000 : (n / 1000).toFixed(1))}k`
  return `$${n}`
}

function fmtFull(n: number): string {
  return '$' + n.toLocaleString('en-US')
}

function monthLabel(monthsAgo: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() - monthsAgo)
  return d.toLocaleDateString('en-US', { month: 'short' })
}

// Generate a realistic-looking growth curve ending at `target`
function growthCurve(target: number, points = 6): number[] {
  // Exponential-ish curve: starts at ~8% of target, ends at 100%
  const ratios = [0.08, 0.18, 0.32, 0.52, 0.75, 1.0]
  return ratios.map(r => Math.round(r * target))
}

// ─── Options ────────────────────────────────────────────────────────────────

export interface ImageOptions {
  subscriberCount?: number  // active Stripe subscriptions
  avgRevenue?: number       // MRR / subscribers
  previousMRR?: number      // MRR from last check (for growth %)
  category?: string         // 'mrr' | 'followers' | 'users' | 'visits' | 'stars' | 'subscribers'
}

// ─── Main ────────────────────────────────────────────────────────────────────

export async function generateMilestoneImage(
  saasName: string,
  amount: number,
  currentMRR: number,
  options: ImageOptions = {}
): Promise<Buffer> {
  // Use static WOFF files from @fontsource/inter — TTF variable fonts break Satori
  const fontRegular = readFileSync(join(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff'))
  const fontBold    = readFileSync(join(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff'))

  const {
    subscriberCount = 0,
    avgRevenue = subscriberCount > 0 ? Math.round(amount / subscriberCount) : 0,
    previousMRR = Math.round(amount * 0.6),
    category = 'mrr',
  } = options

  const isMRR = category === 'mrr'
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const growthPct = previousMRR > 0 ? Math.round(((amount - previousMRR) / previousMRR) * 100) : 0

  // Chart data — 6 monthly points ending at `amount`
  const chartData = growthCurve(amount)
  const chartMax  = amount
  const BAR_H     = 180  // max bar height in px
  const BAR_W     = 64
  const BAR_GAP   = 16
  const months    = [5, 4, 3, 2, 1, 0].map(monthLabel)

  // ── Layout constants ──────────────────────────────────────────────────────
  const W = 1200
  const H = 630
  const CHROME_H = 36
  const INNER_H  = H - CHROME_H
  const PAD = 48

  // ── Element tree ──────────────────────────────────────────────────────────

  const el = React.createElement(
    'div',
    {
      style: {
        width:       `${W}px`,
        height:      `${H}px`,
        display:     'flex',
        flexDirection: 'column',
        fontFamily:  'Inter',
        overflow:    'hidden',
        background:  '#0b0b0f',
      },
    },

    // ── Browser chrome ──────────────────────────────────────────────────────
    React.createElement(
      'div',
      {
        style: {
          height:      `${CHROME_H}px`,
          background:  '#161620',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display:     'flex',
          alignItems:  'center',
          padding:     '0 16px',
          gap:         '12px',
          flexShrink:  0,
        },
      },
      // Traffic lights
      React.createElement(
        'div',
        { style: { display: 'flex', gap: '6px', alignItems: 'center' } },
        ...[['#ff5f57','#ff5f57'],['#febc2e','#febc2e'],['#28c840','#28c840']].map(([bg]) =>
          React.createElement('div', {
            style: { width: '10px', height: '10px', borderRadius: '50%', background: bg, display: 'flex' }
          })
        )
      ),
      // URL bar
      React.createElement(
        'div',
        {
          style: {
            flex: 1,
            height: '20px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        },
        React.createElement(
          'div',
          { style: { fontSize: '11px', color: 'rgba(255,255,255,0.3)', display: 'flex' } },
          'app.MilestoneHit.com/dashboard'
        )
      ),
      // Milestone badge (right of chrome)
      React.createElement(
        'div',
        {
          style: {
            display:      'flex',
            alignItems:   'center',
            gap:          '6px',
            background:   'rgba(99,102,241,0.15)',
            border:       '1px solid rgba(99,102,241,0.3)',
            borderRadius: '100px',
            padding:      '3px 10px',
          },
        },
        React.createElement('div', {
          style: { width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', display: 'flex' }
        }),
        React.createElement(
          'div',
          { style: { fontSize: '11px', color: '#a5b4fc', display: 'flex' } },
          'Milestone Reached'
        )
      )
    ),

    // ── Main dashboard body ────────────────────────────────────────────────
    React.createElement(
      'div',
      {
        style: {
          flex:          1,
          display:       'flex',
          flexDirection: 'row',
          padding:       `${PAD}px`,
          gap:           '48px',
          position:      'relative',
          overflow:      'hidden',
        },
      },

      // Background glow
      React.createElement('div', {
        style: {
          position:    'absolute',
          top:         '-100px',
          left:        '-100px',
          width:       '500px',
          height:      '500px',
          borderRadius: '50%',
          background:  'radial-gradient(circle at center, rgba(99,102,241,0.12) 0%, transparent 70%)',
          display:     'flex',
        }
      }),

      // ── Left panel ────────────────────────────────────────────────────────
      React.createElement(
        'div',
        {
          style: {
            display:       'flex',
            flexDirection: 'column',
            width:         '380px',
            flexShrink:    0,
            zIndex:        1,
          },
        },

        // SaaS name + date
        React.createElement(
          'div',
          {
            style: {
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'center',
              marginBottom:   '24px',
            },
          },
          React.createElement(
            'div',
            { style: { fontSize: '15px', fontWeight: 700, color: '#ffffff', display: 'flex' } },
            saasName
          ),
          React.createElement(
            'div',
            { style: { fontSize: '12px', color: 'rgba(255,255,255,0.3)', display: 'flex' } },
            date
          )
        ),

        // Divider
        React.createElement('div', {
          style: {
            height:       '1px',
            background:   'rgba(255,255,255,0.06)',
            marginBottom: '28px',
            display:      'flex',
          }
        }),

        // MRR label
        React.createElement(
          'div',
          { style: { fontSize: '12px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', marginBottom: '8px' } },
          isMRR ? 'Monthly Recurring Revenue' : 'Milestone'
        ),

        // Big number row
        React.createElement(
          'div',
          { style: { display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '6px' } },
          React.createElement(
            'div',
            {
              style: {
                fontSize:      '72px',
                fontWeight:    700,
                color:         '#ffffff',
                lineHeight:    1,
                letterSpacing: '-0.04em',
                display:       'flex',
              },
            },
            fmtFull(amount)
          ),
          growthPct > 0 && React.createElement(
            'div',
            {
              style: {
                display:      'flex',
                alignItems:   'center',
                gap:          '4px',
                background:   'rgba(52,211,153,0.12)',
                border:       '1px solid rgba(52,211,153,0.2)',
                borderRadius: '6px',
                padding:      '4px 8px',
                marginBottom: '8px',
              },
            },
            React.createElement('div', { style: { fontSize: '12px', color: '#34d399', display: 'flex' } }, `↑ +${growthPct}%`)
          )
        ),

        // Sub label
        React.createElement(
          'div',
          { style: { fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginBottom: '32px', display: 'flex' } },
          'vs. previous period'
        ),

        // Metrics list
        React.createElement(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
          ...(subscriberCount > 0 ? [
            metricRow('Active subscriptions', subscriberCount.toString(), '#6366f1'),
            metricRow('Avg revenue / user', `$${avgRevenue}/mo`, '#8b5cf6'),
          ] : []),
          metricRow(`${fmt(amount)} MRR milestone`, '✓ Unlocked', '#34d399'),
        ),

        // Bottom spacer + branding
        React.createElement('div', { style: { flex: 1, display: 'flex' } }),
        React.createElement(
          'div',
          { style: { fontSize: '11px', color: 'rgba(255,255,255,0.15)', display: 'flex', marginTop: '16px' } },
          'MilestoneHit.com · auto-posted to X'
        )
      ),

      // ── Right panel — chart ───────────────────────────────────────────────
      React.createElement(
        'div',
        {
          style: {
            flex:          1,
            display:       'flex',
            flexDirection: 'column',
            zIndex:        1,
          },
        },

        // Chart header
        React.createElement(
          'div',
          {
            style: {
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'center',
              marginBottom:   '24px',
            },
          },
          React.createElement(
            'div',
            { style: { fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', display: 'flex' } },
            'MRR Growth'
          ),
          React.createElement(
            'div',
            {
              style: {
                fontSize:     '11px',
                color:        'rgba(255,255,255,0.3)',
                background:   'rgba(255,255,255,0.05)',
                border:       '1px solid rgba(255,255,255,0.08)',
                borderRadius: '6px',
                padding:      '3px 8px',
                display:      'flex',
              },
            },
            'Last 6 months'
          )
        ),

        // Chart area
        React.createElement(
          'div',
          {
            style: {
              flex:           1,
              display:        'flex',
              flexDirection:  'column',
              justifyContent: 'flex-end',
              gap:            '8px',
            },
          },

          // Grid lines (3 horizontal)
          React.createElement(
            'div',
            {
              style: {
                position:  'absolute',
                // Satori: use explicit positioning with layout
                display:   'flex',
                flexDirection: 'column',
                gap:       '0',
              },
            }
          ),

          // Bars row
          React.createElement(
            'div',
            {
              style: {
                flex:           1,
                display:        'flex',
                alignItems:     'flex-end',
                gap:            `${BAR_GAP}px`,
                paddingBottom:  '0',
                position:       'relative',
              },
            },
            ...chartData.map((val, i) => {
              const heightPx = Math.max(8, Math.round((val / chartMax) * BAR_H))
              const isLast   = i === chartData.length - 1
              return React.createElement(
                'div',
                {
                  key:   i,
                  style: {
                    flex:          1,
                    display:       'flex',
                    flexDirection: 'column',
                    alignItems:    'center',
                    gap:           '8px',
                    justifyContent: 'flex-end',
                  },
                },
                // Value label on top of last bar
                isLast && React.createElement(
                  'div',
                  {
                    style: {
                      fontSize:     '12px',
                      fontWeight:   700,
                      color:        '#a5b4fc',
                      display:      'flex',
                      marginBottom: '4px',
                    },
                  },
                  fmtFull(val)
                ),
                // Bar
                React.createElement('div', {
                  style: {
                    width:        '100%',
                    height:       `${heightPx}px`,
                    borderRadius: '6px 6px 3px 3px',
                    background:   isLast
                      ? 'linear-gradient(180deg, #818cf8 0%, #6366f1 100%)'
                      : 'rgba(99,102,241,0.25)',
                    display:      'flex',
                    border:       isLast ? '1px solid rgba(129,140,248,0.4)' : 'none',
                  },
                })
              )
            })
          ),

          // Divider under bars
          React.createElement('div', {
            style: {
              height:     '1px',
              background: 'rgba(255,255,255,0.08)',
              display:    'flex',
            },
          }),

          // Month labels
          React.createElement(
            'div',
            {
              style: {
                display:        'flex',
                gap:            `${BAR_GAP}px`,
                marginTop:      '8px',
              },
            },
            ...months.map((m, i) =>
              React.createElement(
                'div',
                {
                  key:   i,
                  style: {
                    flex:      1,
                    textAlign: 'center',
                    fontSize:  '11px',
                    color:     'rgba(255,255,255,0.3)',
                    display:   'flex',
                    justifyContent: 'center',
                  },
                },
                m
              )
            )
          )
        )
      )
    )
  )

  const svg = await satori(el, {
    width:  W,
    height: H,
    fonts: [
      { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' },
      { name: 'Inter', data: fontBold,    weight: 700, style: 'normal' },
    ],
  })

  const resvg  = new Resvg(svg, { fitTo: { mode: 'width', value: W } })
  const pngData = resvg.render()
  return Buffer.from(pngData.asPng())
}

// ─── Metric row helper ────────────────────────────────────────────────────────

function metricRow(label: string, value: string, dotColor: string) {
  return React.createElement(
    'div',
    {
      style: {
        display:     'flex',
        alignItems:  'center',
        gap:         '10px',
      },
    },
    React.createElement('div', {
      style: {
        width:        '6px',
        height:       '6px',
        borderRadius: '50%',
        background:   dotColor,
        flexShrink:   0,
        display:      'flex',
      },
    }),
    React.createElement(
      'div',
      { style: { fontSize: '13px', color: 'rgba(255,255,255,0.45)', flex: 1, display: 'flex' } },
      label
    ),
    React.createElement(
      'div',
      { style: { fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', display: 'flex' } },
      value
    )
  )
}
