import { withAuth } from '@/lib/api-helpers'
import Stripe from 'stripe'
import { NextResponse } from 'next/server'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error("STRIPE_SECRET_KEY not set")
  return new Stripe(key, { apiVersion: "2026-04-22.dahlia" })
}

export async function POST() {
  return withAuth(async (user, service) => {
    const { data: sub } = await service
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    let customerId = sub?.stripe_customer_id
    if (!customerId) {
      const customer = await getStripe().customers.create({
        email:    user.email,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
      await service.from('user_subscriptions').upsert(
        { user_id: user.id, stripe_customer_id: customerId, status: 'inactive' },
        { onConflict: 'user_id' }
      )
    }

    const session = await getStripe().checkout.sessions.create({
      customer:             customerId,
      payment_method_types: ['card'],
      mode:                 'subscription',
      line_items:           [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      success_url:          `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?upgraded=true`,
      cancel_url:           `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
      metadata:             { user_id: user.id },
    })

    return NextResponse.json({ url: session.url })
  })
}
