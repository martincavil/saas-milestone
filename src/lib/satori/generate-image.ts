import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { readFileSync } from 'fs'
import { join } from 'path'
import React from 'react'

function formatMRR(amount: number): string {
  if (amount >= 1000) return `$${amount / 1000}k`
  return `$${amount}`
}

export async function generateMilestoneImage(
  saasName: string,
  amount: number,
  _currentMRR: number
): Promise<Buffer> {
  const interRegular = readFileSync(join(process.cwd(), 'public/fonts/Inter-Regular.ttf'))
  const interBold = readFileSync(join(process.cwd(), 'public/fonts/Inter-Bold.ttf'))

  const milestones = [1, 10, 50, 100, 500, 1000, 5000, 10000]
  const idx = milestones.indexOf(amount)
  const progress = idx >= 0 ? Math.round(((idx + 1) / milestones.length) * 100) : 50
  const formatted = formatMRR(amount)
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const element = React.createElement(
    'div',
    {
      style: {
        width: '1200px',
        height: '630px',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0d0d14 100%)',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter',
        position: 'relative' as const,
        overflow: 'hidden',
      },
    },
    // Top gradient bar
    React.createElement('div', {
      style: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)',
        display: 'flex',
      },
    }),
    // Background glow
    React.createElement('div', {
      style: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage:
          'radial-gradient(circle at 20% 30%, rgba(99,102,241,0.1) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(139,92,246,0.1) 0%, transparent 40%)',
        display: 'flex',
      },
    }),
    // Main content
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          gap: '20px',
          zIndex: 1,
        },
      },
      // SaaS name
      React.createElement(
        'div',
        {
          style: {
            fontSize: '20px',
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
          },
        },
        saasName
      ),
      // Badge
      React.createElement(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '100px',
            padding: '6px 18px',
          },
        },
        React.createElement('div', {
          style: {
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#6366f1',
            display: 'flex',
          },
        }),
        React.createElement(
          'div',
          { style: { fontSize: '14px', color: '#a5b4fc', display: 'flex' } },
          'Milestone Reached'
        )
      ),
      // Big MRR amount
      React.createElement(
        'div',
        {
          style: {
            fontSize: '128px',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1,
            letterSpacing: '-0.04em',
          },
        },
        formatted
      ),
      // Subtitle
      React.createElement(
        'div',
        {
          style: {
            fontSize: '26px',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.03em',
          },
        },
        'Monthly Recurring Revenue'
      ),
      // Progress bar
      React.createElement(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '8px',
            width: '560px',
            marginTop: '8px',
          },
        },
        React.createElement(
          'div',
          {
            style: {
              height: '6px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '100px',
              overflow: 'hidden',
              display: 'flex',
            },
          },
          React.createElement('div', {
            style: {
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              borderRadius: '100px',
              display: 'flex',
            },
          })
        ),
        React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.25)',
            },
          },
          React.createElement('div', { style: { display: 'flex' } }, '$1'),
          React.createElement('div', { style: { display: 'flex' } }, '$10k')
        )
      )
    ),
    // Footer
    React.createElement(
      'div',
      {
        style: {
          position: 'absolute' as const,
          bottom: '32px',
          left: '48px',
          right: '48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      },
      React.createElement(
        'div',
        { style: { fontSize: '14px', color: 'rgba(255,255,255,0.2)', display: 'flex' } },
        date
      ),
      React.createElement(
        'div',
        {
          style: {
            fontSize: '13px',
            color: 'rgba(255,255,255,0.18)',
            letterSpacing: '0.04em',
            display: 'flex',
          },
        },
        'milestone.so · free until $100 MRR'
      )
    )
  )

  const svg = await satori(element, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
      { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
    ],
  })

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
  const pngData = resvg.render()
  return Buffer.from(pngData.asPng())
}
