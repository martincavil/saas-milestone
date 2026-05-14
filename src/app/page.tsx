import Link from 'next/link'
import {
  Key,
  Clock,
  TrendingUp,
  Check,
  ArrowRight,
  Zap,
  X,
  ChevronRight,
  BarChart2,
  Bell,
} from 'lucide-react'
import { HeroAnimation } from '@/components/landing/hero-animation'

const MILESTONES = [
  { amount: 1,     label: '$1',   icon: <TrendingUp size={16} className="text-indigo-400" /> },
  { amount: 10,    label: '$10',  icon: <TrendingUp size={16} className="text-indigo-400" /> },
  { amount: 50,    label: '$50',  icon: <TrendingUp size={16} className="text-indigo-400" /> },
  { amount: 100,   label: '$100', icon: <TrendingUp size={16} className="text-indigo-400" /> },
  { amount: 500,   label: '$500', icon: <BarChart2  size={16} className="text-violet-400" /> },
  { amount: 1000,  label: '$1k',  icon: <BarChart2  size={16} className="text-violet-400" /> },
  { amount: 5000,  label: '$5k',  icon: <Zap        size={16} className="text-amber-400"  /> },
  { amount: 10000, label: '$10k', icon: <Zap        size={16} className="text-amber-400"  /> },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-dm-sans)' }}>

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
              <Zap size={14} className="text-white" fill="white" />
            </div>
            <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'var(--font-syne)' }}>
              saas-milestone
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-gray-500 md:flex">
            <a href="#how" className="hover:text-gray-900 transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden text-sm text-gray-500 hover:text-gray-900 transition-colors sm:block px-3 py-1.5">
              Sign in
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
            >
              Connect Stripe free
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Dot grid background */}
        <div className="dot-grid absolute inset-0 opacity-60" />
        {/* Radial fade over dots */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-white" />

        <div className="relative mx-auto max-w-5xl px-5 pt-20 pb-12">
          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Left — copy */}
            <div>
              {/* Badge */}
              <div className="hero-fade-1 mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1 text-xs font-medium text-indigo-600">
                <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500" style={{ animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
                Free under $100 MRR
              </div>

              {/* Headline */}
              <h1
                className="hero-fade-2 mb-4 text-[2.75rem] font-extrabold leading-[1.08] tracking-tight text-gray-900 lg:text-5xl"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                Stripe hit $1k.
                <br />
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  X got the tweet.
                </span>
                <br />
                You were asleep.
              </h1>

              <p className="hero-fade-3 mb-8 max-w-md text-[1.05rem] leading-relaxed text-gray-500">
                Paste a Stripe key. When your MRR crosses $1, $10, $1k — a card posts to X within the hour.
                Set up once, runs forever.
              </p>

              {/* CTAs */}
              <div className="hero-fade-4 flex flex-wrap items-center gap-3">
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors shadow-sm"
                >
                  Connect Stripe for free
                  <ArrowRight size={15} />
                </Link>
                <a href="#how" className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors">
                  See how it works
                </a>
              </div>

              {/* Social proof */}
              <div className="hero-fade-5 mt-8 flex items-center gap-3">
                <div className="flex items-center -space-x-1.5">
                  {['#4f46e5','#7c3aed','#0891b2','#059669','#d97706'].map((color, i) => (
                    <div key={i} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-white text-xs font-bold" style={{ background: color }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400">
                  Indie founders building in public
                </p>
              </div>
            </div>

            {/* Right — animated product mockup */}
            <HeroAnimation />
          </div>
        </div>
      </section>

      {/* Logos / trust strip */}
      <div className="border-y border-gray-100 bg-gray-50 py-4">
        <div className="mx-auto max-w-5xl px-5">
          <p className="text-center text-xs font-medium uppercase tracking-widest text-gray-400">
            Works with any Stripe subscription product
          </p>
        </div>
      </div>

      {/* How it works */}
      <section id="how" className="py-24">
        <div className="mx-auto max-w-5xl px-5">
          <div className="mb-14 max-w-lg">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600" style={{ fontFamily: 'var(--font-syne)' }}>
              How it works
            </p>
            <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-syne)' }}>
              Three steps. Then you forget it exists.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: <Key size={22} className="text-indigo-600" />,
                num: '01',
                title: 'Paste one API key',
                desc: 'Create a restricted Stripe key with read-only access to subscriptions. Paste it in. We never touch your money.',
              },
              {
                icon: <Clock size={22} className="text-indigo-600" />,
                num: '02',
                title: 'We check every hour',
                desc: 'A Vercel cron job reads your active subscriptions and computes MRR. No polling from your end.',
              },
              {
                icon: <X size={22} className="text-indigo-600" />,
                num: '03',
                title: 'Card posts to X',
                desc: 'A 1200×630 card with your SaaS name, the number, and your progress fires to your timeline within 60 minutes.',
              },
            ].map((item) => (
              <div key={item.num} className="group relative rounded-2xl border border-gray-200 bg-white p-7 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all">
                <div className="absolute right-5 top-5 text-xs font-mono font-bold text-gray-200 group-hover:text-indigo-100 transition-colors" style={{ fontFamily: 'var(--font-syne)' }}>
                  {item.num}
                </div>
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                  {item.icon}
                </div>
                <h3 className="mb-2 font-bold text-gray-900" style={{ fontFamily: 'var(--font-syne)' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones grid */}
      <section className="border-t border-gray-100 bg-gray-50 py-24">
        <div className="mx-auto max-w-5xl px-5">
          <div className="mb-12 grid gap-4 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600" style={{ fontFamily: 'var(--font-syne)' }}>
                8 thresholds
              </p>
              <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-syne)' }}>
                Every crossing
                <br />gets a post.
              </h2>
            </div>
            <p className="text-gray-500 lg:text-right">
              From first dollar to $10k. Each one hits your timeline with a custom card.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {MILESTONES.map((m) => (
              <div
                key={m.amount}
                className="group flex flex-col items-center gap-2.5 rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm hover:border-indigo-200 hover:shadow-md transition-all cursor-default"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 group-hover:bg-indigo-50 transition-colors">
                  {m.icon}
                </div>
                <span className="text-sm font-bold text-gray-900" style={{ fontFamily: 'var(--font-syne)' }}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Card preview */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-5">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600" style={{ fontFamily: 'var(--font-syne)' }}>
                The card
              </p>
              <h2 className="mb-5 text-4xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-syne)' }}>
                What posts
                <br />to your timeline
              </h2>
              <p className="mb-6 text-gray-500 leading-relaxed">
                1200×630 PNG. Dark background, gradient accent bar, your SaaS name, the MRR number, and a progress bar toward the next threshold. Posted with #buildinpublic so the right people see it.
              </p>
              <ul className="space-y-3">
                {[
                  'Your SaaS name, front and center',
                  'Progress toward the next milestone',
                  'Date and branding on every card',
                  '#buildinpublic hashtags auto-added',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
                      <Check size={11} className="text-indigo-600" strokeWidth={2.5} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Card mockup — static version */}
            <div className="relative">
              <div className="absolute inset-0 -m-4 rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50" />
              <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-gray-200">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />
                <div className="bg-[#0a0a0a] p-8">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-widest text-white/30">My SaaS</span>
                    <div className="flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      <span className="text-xs text-indigo-300">Milestone Reached</span>
                    </div>
                  </div>
                  <p
                    className="mb-1 text-[4.5rem] font-extrabold leading-none tracking-tighter text-white"
                    style={{ fontFamily: 'var(--font-syne)' }}
                  >
                    $1k
                  </p>
                  <p className="mb-6 text-sm text-white/40">Monthly Recurring Revenue</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-white/30">
                      <span>Progress to $5k</span>
                      <span>20%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                      <div className="h-full w-1/5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                    </div>
                    <div className="flex justify-between text-xs text-white/20">
                      <span>$1</span>
                      <span>$10k</span>
                    </div>
                  </div>
                  <p className="mt-6 text-right text-xs text-white/15">saas-milestone · free until $100 MRR</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-gray-100 bg-gray-50 py-24">
        <div className="mx-auto max-w-5xl px-5">
          <div className="mb-14 max-w-lg">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600" style={{ fontFamily: 'var(--font-syne)' }}>
              Pricing
            </p>
            <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-syne)' }}>
              Free until you're
              <br />making real money.
            </h2>
          </div>

          <div className="grid max-w-2xl gap-4 md:grid-cols-2">
            {/* Free */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <p className="mb-1 text-sm font-medium text-gray-500">Free</p>
              <div className="mb-1 flex items-end gap-1">
                <span className="text-5xl font-extrabold text-gray-900" style={{ fontFamily: 'var(--font-syne)' }}>$0</span>
              </div>
              <p className="mb-7 text-sm text-gray-400">While MRR is under $100</p>
              <ul className="mb-8 space-y-3">
                {[
                  'All 8 milestones tracked',
                  'Auto-post to X',
                  '1200×630 card per milestone',
                  'Hourly MRR checks',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <Check size={14} className="flex-shrink-0 text-green-500" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block w-full rounded-xl border border-gray-200 py-2.5 text-center text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                Get started
              </Link>
            </div>

            {/* Pro */}
            <div className="relative overflow-hidden rounded-2xl bg-gray-900 p-8 text-white shadow-xl">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-600/10" />
              <div className="absolute -bottom-8 -right-4 h-28 w-28 rounded-full bg-violet-600/10" />
              <div className="relative">
                <p className="mb-1 text-sm font-medium text-gray-400">Pro</p>
                <div className="mb-1 flex items-end gap-1">
                  <span className="text-5xl font-extrabold text-white" style={{ fontFamily: 'var(--font-syne)' }}>$9</span>
                  <span className="mb-2 text-sm text-gray-400">/mo</span>
                </div>
                <p className="mb-7 text-sm text-gray-400">After $100 MRR — when it makes sense</p>
                <ul className="mb-8 space-y-3">
                  {[
                    'Everything in Free',
                    'Unlimited milestone posts',
                    'Priority hourly checks',
                    'LinkedIn posting (soon)',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                      <Check size={14} className="flex-shrink-0 text-indigo-400" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="relative block w-full rounded-xl bg-white py-2.5 text-center text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                  Start free, upgrade when ready
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-900 py-24">
        <div className="mx-auto max-w-2xl px-5 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600">
              <Bell size={24} className="text-white" />
            </div>
          </div>
          <h2
            className="mb-4 text-4xl font-extrabold text-white"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Your first dollar is out there.
            <br />Go get it.
          </h2>
          <p className="mb-8 text-gray-400">
            Paste a Stripe key. That's the whole setup.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Connect Stripe for free
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600">
              <Zap size={12} className="text-white" fill="white" />
            </div>
            <span className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-syne)' }}>saas-milestone</span>
          </div>
          <p className="text-xs text-gray-500">Built with Next.js, Supabase & Stripe · © 2025</p>
          <Link href="/login" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Sign in</Link>
        </div>
      </footer>

    </div>
  )
}
