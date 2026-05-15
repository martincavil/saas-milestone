import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ManualPost } from '@/components/dashboard/manual-post'
import { ProGate } from '@/components/dashboard/pro-gate'

export default async function PostPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const service = await createServiceClient()

  const [
    { data: sub },
    { data: twitterConn },
    { data: stripeConn },
  ] = await Promise.all([
    service.from('user_subscriptions').select('status').eq('user_id', user.id).single(),
    service.from('twitter_connections').select('screen_name').eq('user_id', user.id).single(),
    service.from('stripe_connections').select('stripe_account_name').eq('user_id', user.id).limit(1).single(),
  ])

  const isSubscribed = sub?.status === 'active'
  if (!isSubscribed) return <ProGate feature="Manual posting" />

  return (
    <div className="p-6 space-y-5 max-w-lg">
      <div>
        <h1 className="text-xl font-bold text-white font-poppins">Post a milestone</h1>
        <p className="text-xs text-white/35 mt-0.5">Choose any metric and trigger an X post manually</p>
      </div>
      <ManualPost
        isSubscribed={isSubscribed}
        saasName={stripeConn?.stripe_account_name ?? 'My SaaS'}
        twitterConnected={!!twitterConn}
      />
    </div>
  )
}
