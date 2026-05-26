import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { OverviewClient } from './overview-client'
import { FreeOverview } from '@/components/dashboard/free-overview'
import { calculateMRR } from '@/lib/stripe/mrr'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const service = await createServiceClient()

  const [
    { data: sub },
    { data: milestones },
    { data: twitterConns },
    { data: stripeConns },
  ] = await Promise.all([
    service.from('user_subscriptions').select('status').eq('user_id', user.id).single(),
    service.from('milestones_hit').select('*').eq('user_id', user.id).order('hit_at', { ascending: false }).limit(50),
    service.from('twitter_connections').select('screen_name, twitter_user_id').eq('user_id', user.id),
    service.from('stripe_connections').select('id, stripe_account_name').eq('user_id', user.id),
  ])

  const isSubscribed = sub?.status === 'active'

  if (!isSubscribed) {
    // Fetch current MRR for free users (best-effort, for the teaser view)
    let currentMRR = 0
    if (stripeConns && stripeConns.length > 0) {
      try {
        const { data: connWithKey } = await service
          .from('stripe_connections')
          .select('stripe_api_key_encrypted')
          .eq('id', stripeConns[0].id)
          .single()
        if (connWithKey) {
          const apiKey = Buffer.from(connWithKey.stripe_api_key_encrypted, 'base64').toString('utf-8')
          currentMRR = await calculateMRR(apiKey)
        }
      } catch {
        // Best-effort — show $0 if we can't fetch
      }
    }

    return (
      <FreeOverview
        milestones={milestones ?? []}
        twitterAccounts={twitterConns ?? []}
        stripeAccounts={stripeConns ?? []}
        currentMRR={currentMRR}
      />
    )
  }

  return (
    <OverviewClient
      milestones={milestones ?? []}
      twitterAccounts={twitterConns ?? []}
      stripeAccounts={stripeConns ?? []}
    />
  )
}
