import { withAuth, err } from '@/lib/api-helpers'
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

    if (!sub?.stripe_customer_id) return err('No billing account found.', 404)

    const session = await getStripe().billingPortal.sessions.create({
      customer:   sub.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
    })

    return NextResponse.json({ url: session.url })
  })
}
