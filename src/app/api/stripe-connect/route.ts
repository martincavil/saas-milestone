import { withAuth, err, ok } from '@/lib/api-helpers'
import { createStripeClient } from '@/lib/stripe/mrr'

export async function POST(request: Request) {
  return withAuth(async (user, service) => {
    const { apiKey, accountName, connectionId } = await request.json()

    if (!apiKey?.startsWith('sk_') && !apiKey?.startsWith('rk_')) {
      return err('Invalid Stripe API key format')
    }

    try {
      await createStripeClient(apiKey).subscriptions.list({ limit: 1 })
    } catch {
      return err('Invalid Stripe API key — could not authenticate')
    }

    const encrypted = Buffer.from(apiKey).toString('base64')

    if (connectionId) {
      const { error } = await service
        .from('stripe_connections')
        .update({ stripe_api_key_encrypted: encrypted, stripe_account_name: accountName || 'My SaaS' })
        .eq('id', connectionId)
        .eq('user_id', user.id)
      if (error) return err(error.message, 500)
    } else {
      const { error } = await service
        .from('stripe_connections')
        .insert({ user_id: user.id, stripe_api_key_encrypted: encrypted, stripe_account_name: accountName || 'My SaaS' })
      if (error) return err(error.message, 500)
    }

    return ok()
  })
}

export async function DELETE(request: Request) {
  return withAuth(async (user, service) => {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      await service.from('stripe_connections').delete().eq('id', id).eq('user_id', user.id)
    } else {
      await service.from('stripe_connections').delete().eq('user_id', user.id)
    }

    return ok()
  })
}
