import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MRRCard } from '@/components/dashboard/mrr-card'
import { MilestoneFeed } from '@/components/dashboard/milestone-feed'
import { StripeConnectForm } from '@/components/dashboard/stripe-connect-form'
import { TwitterConnect } from '@/components/dashboard/twitter-connect'
import { PaywallBanner } from '@/components/dashboard/paywall-banner'
import { calculateMRR } from '@/lib/stripe/mrr'
import { DashboardHeader } from './dashboard-header'
import { MILESTONES } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const service = await createServiceClient()

  // Fetch all data in parallel
  const [
    { data: stripeConn },
    { data: milestones },
    { data: twitterConn },
    { data: subscription },
  ] = await Promise.all([
    service.from('stripe_connections').select('*').eq('user_id', user.id).single(),
    service.from('milestones_hit').select('*').eq('user_id', user.id).order('hit_at', { ascending: false }),
    service.from('twitter_connections').select('screen_name').eq('user_id', user.id).single(),
    service.from('user_subscriptions').select('status').eq('user_id', user.id).single(),
  ])

  let currentMRR = 0
  if (stripeConn) {
    try {
      const apiKey = Buffer.from(stripeConn.stripe_api_key_encrypted, 'base64').toString('utf-8')
      currentMRR = await calculateMRR(apiKey)
    } catch {}
  }

  const isSubscribed = subscription?.status === 'active'

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <DashboardHeader email={user.email!} isSubscribed={isSubscribed} />

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Paywall banner */}
        <PaywallBanner mrr={currentMRR} isSubscribed={isSubscribed} />

        {/* MRR card */}
        {stripeConn ? (
          <MRRCard mrr={currentMRR} accountName={stripeConn.stripe_account_name} />
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/3 p-8 text-center">
            <p className="text-white/40 text-sm">Connect Stripe to see your MRR</p>
          </div>
        )}

        {/* Integrations */}
        <div className="space-y-3">
          <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider">Integrations</h2>
          <StripeConnectForm
            isConnected={!!stripeConn}
            accountName={stripeConn?.stripe_account_name}
          />
          <TwitterConnect
            isConnected={!!twitterConn}
            screenName={twitterConn?.screen_name}
          />
        </div>

        {/* Milestone history */}
        <div className="space-y-3">
          <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider">
            Milestone History
          </h2>
          <MilestoneFeed milestones={milestones ?? []} />
        </div>

        {/* Next milestones */}
        <MilestoneRoadmap currentMRR={currentMRR} hitAmounts={(milestones ?? []).map(m => m.amount)} />
      </main>
    </div>
  )
}

function MilestoneRoadmap({ currentMRR, hitAmounts }: { currentMRR: number; hitAmounts: number[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider">All Milestones</h2>
      <div className="grid grid-cols-4 gap-2">
        {MILESTONES.map((m: number) => {
          const hit = hitAmounts.includes(m)
          const current = currentMRR >= m
          return (
            <div
              key={m}
              className={`rounded-xl border p-3 text-center transition-all ${
                hit
                  ? 'border-indigo-500/40 bg-indigo-500/10'
                  : current
                  ? 'border-green-500/30 bg-green-500/8'
                  : 'border-white/8 bg-white/3'
              }`}
            >
              <p className={`text-xs font-medium ${hit ? 'text-indigo-300' : current ? 'text-green-400' : 'text-white/30'}`}>
                {m >= 1000 ? `$${m / 1000}k` : `$${m}`}
              </p>
              {hit && <div className="mt-1 text-xs">✓</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
