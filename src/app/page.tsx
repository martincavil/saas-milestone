import Link from 'next/link'

const MILESTONES = [
  { amount: 1, label: '$1', emoji: '🌱' },
  { amount: 10, label: '$10', emoji: '🚀' },
  { amount: 50, label: '$50', emoji: '💫' },
  { amount: 100, label: '$100', emoji: '🎯' },
  { amount: 500, label: '$500', emoji: '⚡' },
  { amount: 1000, label: '$1k', emoji: '🔥' },
  { amount: 5000, label: '$5k', emoji: '💎' },
  { amount: 10000, label: '$10k', emoji: '👑' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-sm">🚀</div>
            <span className="text-sm font-semibold text-gray-900">saas-milestone</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-gray-500 md:flex">
            <a href="#features" className="hover:text-gray-900 transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block px-3 py-1.5">
              Sign in
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-5 pt-20 pb-16 text-center">

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1 text-xs font-medium text-indigo-600">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
          </span>
          Free until $100 MRR — no credit card required
        </div>

        {/* Headline */}
        <h1 className="mb-5 text-5xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl">
          Every milestone deserves{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            a celebration
          </span>
        </h1>

        <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-gray-500">
          Connect Stripe. When your MRR crosses $1, $10, $1k… we auto-generate a
          card and post it to X. Building in public, automated.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700 transition-colors shadow-sm"
          >
            Start tracking for free →
          </Link>
          <a
            href="#features"
            className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors"
          >
            See how it works
          </a>
        </div>

        {/* Social proof */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {['🧑‍💻', '👩‍💼', '🧑‍🚀', '👨‍💻', '👩‍🔬'].map((emoji, i) => (
              <div
                key={i}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs"
              >
                {emoji}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Joined by <span className="font-medium text-gray-900">indie hackers</span> building in public
          </p>
        </div>
      </section>

      {/* Product mockup */}
      <section className="mx-auto max-w-4xl px-5 pb-20">
        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-2xl shadow-gray-100">
          {/* Fake browser chrome */}
          <div className="flex h-10 items-center gap-2 border-b border-gray-200 bg-white px-4">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div className="mx-auto flex h-6 w-64 items-center justify-center rounded-md bg-gray-100">
              <span className="text-xs text-gray-400">saas-milestone.vercel.app/dashboard</span>
            </div>
          </div>

          {/* Dashboard preview — dark */}
          <div className="bg-[#0a0a0a] p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-white/40 font-mono">My SaaS · Live</span>
              </div>
              <span className="rounded-full bg-green-500/15 border border-green-500/20 px-2.5 py-0.5 text-xs text-green-400">Connected</span>
            </div>

            <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Monthly Recurring Revenue</p>
            <p className="text-5xl font-bold text-white tracking-tight mb-1">$842</p>
            <p className="text-xs text-white/30 mb-6">$158 to next milestone</p>

            <div className="mb-2 flex justify-between text-xs text-white/30">
              <span>Progress to $1k</span>
              <span>84%</span>
            </div>
            <div className="mb-8 h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
              <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
            </div>

            <div className="space-y-2">
              {[
                { amount: '$500 MRR', date: '2 days ago', emoji: '⚡' },
                { amount: '$100 MRR', date: '3 weeks ago', emoji: '🎯' },
                { amount: '$50 MRR', date: '1 month ago', emoji: '💫' },
              ].map((m) => (
                <div key={m.amount} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-base">{m.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{m.amount}</p>
                      <p className="text-xs text-white/30">{m.date}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-sky-500/15 border border-sky-500/20 px-2.5 py-1 text-xs text-sky-400">
                    <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    Posted
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features / How it works */}
      <section id="features" className="border-t border-gray-100 bg-gray-50 py-20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold text-indigo-600 uppercase tracking-wide">How it works</p>
            <h2 className="text-3xl font-bold text-gray-900">Set it up in 2 minutes</h2>
            <p className="mt-3 text-gray-500">No code. No webhooks. Just paste your Stripe key.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: '01', icon: '🔑', title: 'Connect Stripe', desc: 'Paste a read-only Stripe API key. We calculate your MRR from active subscriptions every hour.' },
              { step: '02', icon: '📊', title: 'We detect milestones', desc: 'When you cross $1, $10, $50, $100, $500, $1k, $5k or $10k MRR, we catch it automatically.' },
              { step: '03', icon: '🐦', title: 'Auto-post to X', desc: 'A beautiful milestone card is generated and posted to your Twitter/X profile. You just ship.' },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs font-mono font-medium text-gray-400">{item.step}</span>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones grid */}
      <section className="border-t border-gray-100 py-20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">8 milestones to unlock</h2>
            <p className="mt-2 text-gray-500">Every one gets a card posted to your timeline.</p>
          </div>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {MILESTONES.map((m) => (
              <div
                key={m.amount}
                className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm hover:border-indigo-200 hover:shadow-md transition-all cursor-default"
              >
                <span className="text-xl">{m.emoji}</span>
                <span className="text-sm font-bold text-gray-900">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Card preview */}
      <section className="border-t border-gray-100 bg-gray-50 py-20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold text-indigo-600 uppercase tracking-wide">The milestone card</p>
              <h2 className="mb-4 text-3xl font-bold text-gray-900">Beautiful cards, auto-generated</h2>
              <p className="mb-6 text-gray-500 leading-relaxed">
                Each milestone generates a 1200×630 card in dark premium style.
                Posted instantly to X with hashtags to reach the #buildinpublic community.
              </p>
              <ul className="space-y-3">
                {['Dark, premium aesthetic', 'Progress bar toward next milestone', 'Your SaaS name front and center', 'Automated #buildinpublic hashtags'].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
                      <svg className="h-3 w-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Card mockup */}
            <div className="overflow-hidden rounded-2xl bg-[#0a0a0a] shadow-2xl shadow-gray-300 relative">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />
              <div className="p-8">
                <p className="text-xs uppercase tracking-widest text-white/30 mb-4">My SaaS</p>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  <span className="text-xs text-indigo-300">Milestone Reached</span>
                </div>
                <p className="text-7xl font-bold text-white tracking-tight mb-2">$1k</p>
                <p className="text-sm text-white/40 mb-6">Monthly Recurring Revenue</p>
                <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden mb-2">
                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                </div>
                <div className="flex justify-between text-xs text-white/20">
                  <span>$1</span>
                  <span>$10k</span>
                </div>
                <p className="mt-6 text-xs text-white/15">saas-milestone · free until $100 MRR</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-gray-100 py-20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Honest pricing</h2>
            <p className="mt-2 text-gray-500">Start free. Pay when you're actually making money.</p>
          </div>
          <div className="mx-auto grid max-w-2xl gap-4 md:grid-cols-2">
            {/* Free */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <p className="mb-1 text-sm font-medium text-gray-500">Free</p>
              <p className="mb-1 text-4xl font-bold text-gray-900">$0</p>
              <p className="mb-6 text-sm text-gray-400">While MRR is under $100</p>
              <ul className="mb-8 space-y-3">
                {['All 8 milestones tracked', 'Auto-post to X (Twitter)', 'Milestone card generation', 'Hourly MRR checks'].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                      <svg className="h-2.5 w-2.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block w-full rounded-xl border border-gray-200 py-2.5 text-center text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-indigo-600 p-8 shadow-lg shadow-indigo-200/50 text-white">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
              <div className="absolute -right-4 -bottom-4 h-20 w-20 rounded-full bg-white/5" />
              <div className="relative">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-200">Pro</p>
                  <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium">When you're growing</span>
                </div>
                <p className="mb-1 text-4xl font-bold">$9</p>
                <p className="mb-6 text-sm text-indigo-200">/month · after $100 MRR</p>
                <ul className="mb-8 space-y-3">
                  {['Everything in Free', 'Unlimited milestone posts', 'Priority MRR checks', 'LinkedIn posting (soon)'].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-indigo-100">
                      <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                        <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="relative block w-full rounded-xl bg-white py-2.5 text-center text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors">
                  Start free, upgrade later
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-900 py-20">
        <div className="mx-auto max-w-xl px-5 text-center">
          <h2 className="mb-3 text-3xl font-bold text-white">Your next milestone is closer than you think</h2>
          <p className="mb-8 text-gray-400">Connect Stripe in 30 seconds. We'll handle the rest.</p>
          <Link href="/login" className="inline-block rounded-xl bg-white px-8 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
            Start for free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 py-8">
        <div className="mx-auto max-w-5xl px-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-xs">🚀</div>
            <span className="text-sm font-medium text-white">saas-milestone</span>
          </div>
          <p className="text-xs text-gray-500">Built with Next.js, Supabase & Stripe · © 2025</p>
          <Link href="/login" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Sign in</Link>
        </div>
      </footer>

    </div>
  )
}
