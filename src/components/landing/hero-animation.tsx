'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, X, Check } from 'lucide-react'

const MRR_STEPS = [342, 489, 612, 788, 901, 967, 1000]
const TICK_INTERVAL = 900 // ms per step

function formatMRR(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
  return `$${n}`
}

export function HeroAnimation() {
  const [step, setStep] = useState(0)
  const [posted, setPosted] = useState(false)
  const [phase, setPhase] = useState<'counting' | 'hit' | 'tweeted' | 'reset'>('counting')

  useEffect(() => {
    if (phase === 'counting') {
      if (step < MRR_STEPS.length - 1) {
        const t = setTimeout(() => setStep((s) => s + 1), TICK_INTERVAL)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase('hit'), 400)
        return () => clearTimeout(t)
      }
    }

    if (phase === 'hit') {
      const t = setTimeout(() => {
        setPosted(true)
        setPhase('tweeted')
      }, 900)
      return () => clearTimeout(t)
    }

    if (phase === 'tweeted') {
      const t = setTimeout(() => {
        setPhase('reset')
      }, 3200)
      return () => clearTimeout(t)
    }

    if (phase === 'reset') {
      setStep(0)
      setPosted(false)
      const t = setTimeout(() => setPhase('counting'), 400)
      return () => clearTimeout(t)
    }
  }, [phase, step])

  const mrr = MRR_STEPS[step]
  const isHit = phase === 'hit' || phase === 'tweeted'
  const progress = Math.min((mrr / 1000) * 100, 100)

  return (
    <div className="relative">
      {/* Glow behind */}
      <div
        className="absolute inset-0 -m-6 rounded-3xl opacity-40 transition-all duration-700"
        style={{
          background: isHit
            ? 'radial-gradient(ellipse at center, rgba(99,102,241,0.25) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(99,102,241,0.1) 0%, transparent 70%)',
        }}
      />

      {/* Main dashboard card */}
      <div
        className="relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500"
        style={{
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: isHit ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)',
          background: '#0a0a0a',
          boxShadow: isHit
            ? '0 0 0 1px rgba(99,102,241,0.3), 0 25px 60px rgba(0,0,0,0.5)'
            : '0 25px 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Top accent bar */}
        <div
          className="absolute inset-x-0 top-0 h-0.5 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)',
            opacity: isHit ? 1 : 0.4,
          }}
        />

        <div className="p-6">
          {/* Status row */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full transition-colors duration-300"
                style={{ background: isHit ? '#34d399' : '#6366f1', boxShadow: isHit ? '0 0 6px #34d399' : 'none' }}
              />
              <span className="text-xs font-mono text-white/40">My SaaS · Live</span>
            </div>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs transition-all duration-300 ${
              isHit
                ? 'border-green-500/30 bg-green-500/15 text-green-400'
                : 'border-white/10 bg-white/5 text-white/40'
            }`}>
              {isHit ? 'Milestone!' : 'Tracking'}
            </span>
          </div>

          {/* MRR number */}
          <div className="mb-1">
            <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-1">MRR</p>
            <p
              className="font-extrabold tracking-tighter transition-all duration-200"
              style={{
                fontFamily: 'var(--font-syne)',
                fontSize: '3.5rem',
                lineHeight: 1,
                color: isHit ? '#a5b4fc' : '#ffffff',
                textShadow: isHit ? '0 0 30px rgba(99,102,241,0.4)' : 'none',
              }}
            >
              {formatMRR(mrr)}
            </p>
          </div>

          <p className="mb-5 text-xs text-white/30">
            {isHit ? 'Threshold crossed!' : `$${1000 - mrr} to $1k`}
          </p>

          {/* Progress bar */}
          <div className="mb-1 flex justify-between text-xs text-white/30">
            <span>Progress to $1k</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: isHit
                  ? 'linear-gradient(90deg, #34d399, #10b981)'
                  : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              }}
            />
          </div>

          {/* Recent milestones mini-list */}
          <div className="space-y-2">
            {[
              { label: '$100 MRR', time: '3 weeks ago', done: true },
              { label: '$50 MRR',  time: '6 weeks ago', done: true },
              { label: '$10 MRR',  time: '2 months ago', done: true },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/4 px-4 py-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20">
                    <TrendingUp size={12} className="text-indigo-400" />
                  </div>
                  <p className="text-xs font-semibold text-white">{m.label}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/25">{m.time}</span>
                  <div className="flex items-center gap-1 rounded-full border border-sky-500/20 bg-sky-500/10 px-2 py-0.5">
                    <X size={9} className="text-sky-400" />
                    <span className="text-xs text-sky-400">Posted</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tweet card — floats in when milestone hit */}
      <div
        className="absolute -right-4 -bottom-4 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#111] p-4 shadow-2xl transition-all duration-700"
        style={{
          opacity: posted ? 1 : 0,
          transform: posted ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
        }}
      >
        <div className="mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white" style={{ fontFamily: 'var(--font-syne)' }}>M</div>
            <div>
              <p className="text-xs font-semibold text-white">My SaaS</p>
              <p className="text-xs text-white/30">@mysaas</p>
            </div>
          </div>
          <X size={14} className="text-white/30" />
        </div>
        <p className="text-xs leading-relaxed text-white/80">
          Just crossed <span className="font-bold text-white">$1k MRR</span> 🎯 Building in public, one milestone at a time.
          <span className="text-indigo-400"> #buildinpublic #saas</span>
        </p>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-green-400">
          <Check size={12} strokeWidth={2.5} />
          <span>Posted to X</span>
        </div>
      </div>
    </div>
  )
}
