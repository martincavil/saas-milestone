import Link from 'next/link'

const MILESTONES = [1, 10, 50, 100, 500, 1000, 5000, 10000]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="border-b border-white/8 px-6 h-14 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xl">🚀</span>
          <span className="font-semibold text-white">Milestone MRR</span>
        </div>
        <Link
          href="/login"
          className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 text-sm font-medium transition-colors"
        >
          Get started free
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs text-indigo-400 mb-6">
          <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Free until $100 MRR
        </div>

        <h1 className="text-5xl font-bold tracking-tight leading-tight mb-4">
          Celebrate every{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            MRR milestone
          </span>{' '}
          automatically
        </h1>

        <p className="text-lg text-white/50 max-w-xl mx-auto mb-8">
          Connect your Stripe account. When you cross a milestone, we generate a
          beautiful card and post it to X (Twitter) automatically.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/login"
            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-sm font-medium transition-colors"
          >
            Start for free →
          </Link>
          <a
            href="#how"
            className="rounded-xl border border-white/10 hover:border-white/20 px-6 py-3 text-sm font-medium text-white/60 hover:text-white/80 transition-colors"
          >
            How it works
          </a>
        </div>
      </section>

      {/* Milestone grid preview */}
      <section className="max-w-2xl mx-auto px-6 pb-16">
        <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
          <p className="text-xs text-white/30 text-center mb-4 uppercase tracking-wider">MRR Milestones</p>
          <div className="grid grid-cols-4 gap-2">
            {MILESTONES.map((m, i) => (
              <div
                key={m}
                className={`rounded-xl border p-3 text-center ${
                  i < 4
                    ? 'border-indigo-500/40 bg-indigo-500/10'
                    : 'border-white/8 bg-white/3'
                }`}
              >
                <p className={`text-sm font-bold ${i < 4 ? 'text-indigo-300' : 'text-white/25'}`}>
                  {m >= 1000 ? `$${m / 1000}k` : `$${m}`}
                </p>
                {i < 4 && <div className="text-xs mt-0.5 text-indigo-400">✓</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-center mb-10">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Connect Stripe',
              desc: 'Paste your Stripe read-only API key. We calculate your MRR every hour.',
            },
            {
              step: '02',
              title: 'Hit a milestone',
              desc: 'When you cross $1, $10, $100, $1k… we detect it automatically.',
            },
            {
              step: '03',
              title: 'Auto-post to X',
              desc: 'A beautiful card is generated and posted to your Twitter timeline.',
            },
          ].map(item => (
            <div key={item.step} className="rounded-2xl border border-white/10 bg-white/3 p-6">
              <div className="text-xs font-mono text-indigo-400/60 mb-3">{item.step}</div>
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-white/40">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-sm mx-auto px-6 pb-24 text-center">
        <h2 className="text-2xl font-bold mb-2">Simple pricing</h2>
        <p className="text-white/40 text-sm mb-8">No credit card required to start.</p>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="text-4xl font-bold mb-1">Free</div>
          <div className="text-white/40 text-sm mb-6">while your MRR is under $100</div>
          <div className="space-y-3 text-sm text-white/60 text-left mb-8">
            {['All 8 milestones tracked', 'Auto-post to X (Twitter)', 'Beautiful milestone cards', 'Hourly MRR checks'].map(f => (
              <div key={f} className="flex items-center gap-2">
                <span className="text-indigo-400">✓</span> {f}
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-white/8 p-3 text-xs text-white/40">
            After $100 MRR → <span className="text-white/60 font-medium">$9/mo</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-6 text-center text-xs text-white/20">
        Built with Next.js, Supabase, and Stripe · © 2025 Milestone MRR
      </footer>
    </div>
  )
}
