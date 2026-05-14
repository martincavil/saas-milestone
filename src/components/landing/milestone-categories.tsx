'use client'

import { useState } from 'react'
import { TrendingUp, Users, Globe, Star, Mail, Check } from 'lucide-react'
import { ScrollReveal } from '@/components/landing/scroll-reveal'

// X (Twitter) SVG since lucide doesn't have it
function XIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

const CATEGORIES = [
  {
    key: 'mrr',
    label: 'MRR',
    description: 'Monthly Recurring Revenue from Stripe subscriptions. Auto-detected.',
    source: 'Connected via Stripe restricted key',
    sourceAuto: true,
    icon: <TrendingUp size={20} />,
    color: { bg: '#eef2ff', text: '#4f46e5', border: '#c7d2fe', dot: '#6366f1' },
    thresholds: ['$1', '$10', '$50', '$100', '$500', '$1k', '$5k', '$10k'],
    example: '$1k MRR',
    exampleSub: 'Monthly Recurring Revenue',
  },
  {
    key: 'followers',
    label: 'X Followers',
    description: 'Your Twitter/X follower count. Checked hourly once you connect your account.',
    source: 'Connected via X OAuth',
    sourceAuto: true,
    icon: <XIcon size={20} />,
    color: { bg: '#f0f9ff', text: '#0284c7', border: '#bae6fd', dot: '#0ea5e9' },
    thresholds: ['100', '500', '1k', '2k', '5k', '10k', '25k', '100k'],
    example: '1k followers',
    exampleSub: 'X (Twitter)',
  },
  {
    key: 'users',
    label: 'Users',
    description: 'Total registered users or Stripe customers. Auto-counted from your Stripe connection.',
    source: 'Counted from Stripe customers',
    sourceAuto: true,
    icon: <Users size={20} />,
    color: { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe', dot: '#8b5cf6' },
    thresholds: ['1', '10', '50', '100', '500', '1k', '5k', '10k'],
    example: '100 users',
    exampleSub: 'Registered customers',
  },
  {
    key: 'visits',
    label: 'Monthly Visits',
    description: 'Website monthly page views. Enter your URL — we check via a lightweight analytics ping.',
    source: 'Enter your website URL',
    sourceAuto: false,
    icon: <Globe size={20} />,
    color: { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0', dot: '#10b981' },
    thresholds: ['100', '500', '1k', '5k', '10k', '50k', '100k', '500k'],
    example: '10k visits',
    exampleSub: 'Monthly page views',
  },
  {
    key: 'stars',
    label: 'GitHub Stars',
    description: 'Stars on your public GitHub repository. Just paste the repo URL.',
    source: 'Enter your GitHub repo URL',
    sourceAuto: false,
    icon: <Star size={20} />,
    color: { bg: '#fffbeb', text: '#d97706', border: '#fde68a', dot: '#f59e0b' },
    thresholds: ['10', '50', '100', '500', '1k', '5k', '10k'],
    example: '1k stars',
    exampleSub: 'GitHub repository',
  },
  {
    key: 'subscribers',
    label: 'Email List',
    description: 'Email subscribers. Connect Mailchimp, ConvertKit, or log manually.',
    source: 'Manual or newsletter tool (soon)',
    sourceAuto: false,
    icon: <Mail size={20} />,
    color: { bg: '#fff1f2', text: '#be185d', border: '#fecdd3', dot: '#f43f5e' },
    thresholds: ['100', '500', '1k', '5k', '10k', '50k'],
    example: '1k subscribers',
    exampleSub: 'Email list',
  },
]

export function MilestoneCategoriesSection() {
  const [active, setActive] = useState('mrr')
  const cat = CATEGORIES.find(c => c.key === active)!

  return (
    <section className="border-t border-gray-100 py-24">
      <div className="mx-auto max-w-5xl px-5">
        <ScrollReveal className="mb-14">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
            6 milestone types
          </p>
          <h2 className="text-4xl font-bold text-gray-900 max-w-xl" style={{ fontFamily: 'var(--font-poppins)' }}>
            Not just revenue.
            <br />Every founder win counts.
          </h2>
          <p className="mt-4 text-gray-500 max-w-lg">
            From your first dollar to 100k followers — every number that matters to a founder
            gets tracked and celebrated automatically.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* Left: category grid */}
            <div className="space-y-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setActive(c.key)}
                  className="w-full text-left rounded-2xl border p-4 transition-all duration-200"
                  style={{
                    borderColor: active === c.key ? c.color.border : '#e5e7eb',
                    background: active === c.key ? c.color.bg : '#fff',
                    boxShadow: active === c.key ? `0 2px 12px ${c.color.dot}22` : 'none',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-all"
                      style={{
                        background: active === c.key ? c.color.bg : '#f9fafb',
                        color: c.color.text,
                        border: `1px solid ${active === c.key ? c.color.border : '#e5e7eb'}`,
                      }}
                    >
                      {c.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-sm text-gray-900">{c.label}</p>
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{
                            background: c.sourceAuto ? '#ecfdf5' : '#f9fafb',
                            color: c.sourceAuto ? '#059669' : '#9ca3af',
                          }}
                        >
                          {c.sourceAuto ? '⚡ Auto' : '✎ Manual'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{c.description}</p>
                      {active === c.key && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {c.thresholds.map((t) => (
                            <span
                              key={t}
                              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                              style={{ background: c.color.bg, color: c.color.text, border: `1px solid ${c.color.border}` }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Right: preview card */}
            <div className="hidden lg:flex flex-col gap-4">
              {/* Card preview */}
              <div className="overflow-hidden rounded-2xl bg-[#0a0a0a] shadow-xl">
                <div className="h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />
                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-widest text-white/25">My SaaS</span>
                    <div
                      className="flex items-center gap-1.5 rounded-full border px-2.5 py-0.5"
                      style={{ borderColor: `${cat.color.dot}40`, background: `${cat.color.dot}15` }}
                    >
                      <div className="h-1.5 w-1.5 rounded-full" style={{ background: cat.color.dot }} />
                      <span className="text-xs" style={{ color: cat.color.text }}>Milestone Reached</span>
                    </div>
                  </div>
                  <p className="text-5xl font-extrabold tracking-tight text-white mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {cat.example}
                  </p>
                  <p className="text-xs text-white/35 mb-5">{cat.exampleSub}</p>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: '35%', background: `linear-gradient(90deg, ${cat.color.dot}, ${cat.color.dot}99)` }}
                    />
                  </div>
                  <p className="mt-5 text-right text-xs text-white/15">saas-milestone · free until $100 MRR</p>
                </div>
              </div>

              {/* Source info */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Data source</p>
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: cat.color.bg }}>
                    <div className="h-2 w-2 rounded-full" style={{ background: cat.color.dot }} />
                  </div>
                  <span className="text-xs text-gray-500">{cat.source}</span>
                  {cat.sourceAuto && (
                    <span className="ml-auto text-xs font-medium text-green-600">Auto-detected</span>
                  )}
                </div>
              </div>

              {/* Thresholds for this category */}
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-xs font-medium text-gray-700 mb-3">{cat.thresholds.length} milestones to unlock</p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.thresholds.map((t, i) => (
                    <span
                      key={t}
                      className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{
                        background: i < 2 ? cat.color.bg : '#f9fafb',
                        color: i < 2 ? cat.color.text : '#9ca3af',
                        border: `1px solid ${i < 2 ? cat.color.border : '#e5e7eb'}`,
                      }}
                    >
                      {i < 2 && <Check size={9} strokeWidth={3} />}
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
