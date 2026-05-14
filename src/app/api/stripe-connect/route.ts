import { createClient, createServiceClient } from '@/lib/supabase/server'
import { createStripeClient } from '@/lib/stripe/mrr'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { apiKey, accountName } = await request.json()

  if (!apiKey?.startsWith('sk_')) {
    return NextResponse.json({ error: 'Invalid Stripe API key format' }, { status: 400 })
  }

  // Validate the key works
  try {
    const stripe = createStripeClient(apiKey)
    await stripe.subscriptions.list({ limit: 1 })
  } catch {
    return NextResponse.json({ error: 'Invalid Stripe API key — could not authenticate' }, { status: 400 })
  }

  // Simple obfuscation — in production use proper encryption (e.g., AES via crypto)
  const encrypted = Buffer.from(apiKey).toString('base64')

  const service = await createServiceClient()

  // Upsert connection
  const { error } = await service
    .from('stripe_connections')
    .upsert(
      {
        user_id: user.id,
        stripe_api_key_encrypted: encrypted,
        stripe_account_name: accountName || 'My SaaS',
      },
      { onConflict: 'user_id' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = await createServiceClient()
  await service.from('stripe_connections').delete().eq('user_id', user.id)

  return NextResponse.json({ success: true })
}
