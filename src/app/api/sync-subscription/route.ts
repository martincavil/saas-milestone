import { withAuth } from '@/lib/api-helpers'
import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' })

/** Bypass webhooks: pull subscription status directly from Stripe. */
export async function POST() {
  return withAuth(async (user, service) => {
    const { data: existing } = await service
      .from('user_subscriptions')
      .select('stripe_customer_id, stripe_sub_id')
      .eq('user_id', user.id)
      .single()

    // Find Stripe customer by stored ID or by email
    let customerId = existing?.stripe_customer_id
    if (!customerId) {
      const customers = await stripe.customers.list({ email: user.email!, limit: 5 })
      const match = customers.data.find(
        c => c.metadata?.supabase_user_id === user.id || c.email === user.email
      )
      if (!match) {
        return NextResponse.json({ status: 'no_customer', message: 'No Stripe customer found for this email.' })
      }
      customerId = match.id
    }

    const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: 'active', limit: 1 })
    const activeSub     = subscriptions.data[0] ?? null
    const newStatus     = activeSub ? 'active' : 'inactive'

    await service.from('user_subscriptions').upsert(
      { user_id: user.id, stripe_customer_id: customerId, stripe_sub_id: activeSub?.id ?? null, status: newStatus },
      { onConflict: 'user_id' }
    )

    return NextResponse.json({ synced: true, status: newStatus, customer_id: customerId })
  })
}
