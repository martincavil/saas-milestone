import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsClient } from './settings-client'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const service = await createServiceClient()
  const { data: sub } = await service
    .from('user_subscriptions')
    .select('status, stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  return (
    <SettingsClient
      email={user.email!}
      isSubscribed={sub?.status === 'active'}
      hasStripeCustomer={!!sub?.stripe_customer_id}
    />
  )
}
