import { createClient, createServiceClient } from '@/lib/supabase/server'
import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' })

/**
 * Bypass webhooks: directly check Stripe for active subscriptions.
 * Called manually from Settings when webhook delivery fails (e.g. local dev).
 */
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = await createServiceClient()

  // Get Stripe customer id for this user
  const { data: sub } = await service
    .from('user_subscriptions')
    .select('stripe_customer_id, stripe_sub_id')
    .eq('user_id', user.id)
    .single()

  let customerId = sub?.stripe_customer_id

  // If no customer yet, search Stripe by email
  if (!customerId) {
    const customers = await stripe.customers.list({ email: user.email!, limit: 5 })
    const match = customers.data.find(c =>
      (c.metadata?.supabase_user_id === user.id) || c.email === user.email
    )
    if (!match) {
      return NextResponse.json({ status: 'no_customer', message: 'No Stripe customer found for this email.' })
    }
    customerId = match.id
  }

  // List active subscriptions for this customer
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status:   'active',
    limit:    10,
  })

  const activeSub = subscriptions.data[0] ?? null
  const newStatus = activeSub ? 'active' : (sub?.stripe_sub_id ? 'inactive' : 'inactive')

  // Upsert into user_subscriptions
  await service.from('user_subscriptions').upsert(
    {
      user_id:            user.id,
      stripe_customer_id: customerId,
      stripe_sub_id:      activeSub?.id ?? sub?.stripe_sub_id ?? null,
      status:             newStatus,
    },
    { onConflict: 'user_id' }
  )

  return NextResponse.json({
    synced:      true,
    status:      newStatus,
    customer_id: customerId,
    sub_id:      activeSub?.id ?? null,
  })
}
