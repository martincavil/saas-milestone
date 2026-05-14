import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProGate } from '@/components/dashboard/pro-gate'
import { OverviewClient } from './overview-client'

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
    return <ProGate feature="Overview dashboard" />
  }

  return (
    <OverviewClient
      milestones={milestones ?? []}
      twitterAccounts={twitterConns ?? []}
      stripeAccounts={stripeConns ?? []}
    />
  )
}
