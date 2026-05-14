import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MilestoneFeed } from '@/components/dashboard/milestone-feed'
import { StripeConnectForm } from '@/components/dashboard/stripe-connect-form'
import { TwitterConnect } from '@/components/dashboard/twitter-connect'
import { PaywallBanner } from '@/components/dashboard/paywall-banner'
import { ManualPost } from '@/components/dashboard/manual-post'
import { ProDashboard } from '@/components/dashboard/pro-dashboard'
import { DashboardHeader } from './dashboard-header'
import { MILESTONE_CONFIGS, type MilestoneCategory } from '@/types'
import { Check } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const service = await createServiceClient()

  const [
    { data: stripeConns },
    { data: milestones },
    { data: twitterConn },
    { data: subscription },
  ] = await Promise.all([
    service.from('stripe_connections').select('id, stripe_account_name').eq('user_id', user.id).order('created_at'),
    service.from('milestones_hit').select('*').eq('user_id', user.id).order('hit_at', { ascending: false }),
    service.from('twitter_connections').select('screen_name').eq('user_id', user.id).single(),
    service.from('user_subscriptions').select('status').eq('user_id', user.id).single(),
  ])

  const isSubscribed  = subscription?.status === 'active'
  const allMilestones = milestones ?? []
  const connections   = stripeConns ?? []
  const primarySaaS   = connections[0]?.stripe_account_name ?? 'My SaaS'

  // Paywall MRR check: use first account only (lightweight)
  let paywall_mrr = 0
  if (connections.length > 0) {
    const { data: conn } = await service
      .from('stripe_connections')
      .select('stripe_api_key_encrypted')
      .eq('id', connections[0].id)
      .single()
    if (conn) {
      try {
        const { calculateMRR } = await import('@/lib/stripe/mrr')
        const apiKey = Buffer.from(conn.stripe_api_key_encrypted, 'base64').toString('utf-8')
        paywall_mrr = await calculateMRR(apiKey)
      } catch {}
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]" style={{ fontFamily: 'var(--font-nunito)' }}>
      <DashboardHeader email={user.email!} isSubscribed={isSubscribed} />

      <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">

        {/* Paywall */}
        <PaywallBanner mrr={paywall_mrr} isSubscribed={isSubscribed} />

        {/* ── Pro: unified analytics hub ────────────────────────────────── */}
        {isSubscribed && (
          <div className="space-y-3">
            <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider">Overview</h2>
            <ProDashboard milestones={allMilestones} isSubscribed={isSubscribed} />
          </div>
        )}

        {/* ── Free: simple MRR card (first account) ─────────────────────── */}
        {!isSubscribed && connections.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/12 p-10 text-center">
            <p className="text-sm text-white/35">Connect Stripe to track your MRR</p>
          </div>
        )}

        {/* ── Integrations ──────────────────────────────────────────────── */}
        <div className="space-y-3">
          <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider">Integrations</h2>
          <StripeConnectForm connections={connections} />
          <TwitterConnect
            isConnected={!!twitterConn}
            screenName={twitterConn?.screen_name}
          />
        </div>

        {/* ── Post a milestone (Pro) ─────────────────────────────────────── */}
        <div className="space-y-3">
          <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider">Post a milestone</h2>
          <ManualPost
            isSubscribed={isSubscribed}
            saasName={primarySaaS}
            twitterConnected={!!twitterConn}
          />
        </div>

        {/* ── Milestone history ──────────────────────────────────────────── */}
        <div className="space-y-3">
          <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider">History</h2>
          <MilestoneFeed milestones={allMilestones} />
        </div>

        {/* ── MRR roadmap (all thresholds) ───────────────────────────────── */}
        <MilestoneRoadmap hitAmounts={allMilestones.map(m => m.amount)} />

      </main>
    </div>
  )
}

function MilestoneRoadmap({ hitAmounts }: { hitAmounts: number[] }) {
  const config = MILESTONE_CONFIGS.mrr
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider">MRR roadmap</h2>
      <div className="grid grid-cols-4 gap-2">
        {config.thresholds.slice(0, 8).map((m: number) => {
          const hit = hitAmounts.includes(m)
          return (
            <div
              key={m}
              className={`rounded-xl border p-3 text-center transition-all ${
                hit ? 'border-indigo-500/40 bg-indigo-500/10' : 'border-white/8 bg-white/3'
              }`}
            >
              <p
                className={`text-xs font-medium ${hit ? 'text-indigo-300' : 'text-white/30'}`}
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {config.formatValue(m)}
              </p>
              {hit && (
                <div className="mt-1 flex justify-center">
                  <Check size={11} className="text-indigo-400" strokeWidth={2.5} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
