import { withAuth } from '@/lib/api-helpers'
import { calculateMRR, getSubscriberCount } from '@/lib/stripe/mrr'
import { NextResponse } from 'next/server'

export async function GET() {
  return withAuth(async (user, service) => {
    const { data: connections } = await service
      .from('stripe_connections')
      .select('id, stripe_api_key_encrypted, stripe_account_name')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (!connections?.length) {
      return NextResponse.json({ totalMRR: 0, totalARR: 0, accounts: [], connected: false })
    }

    const accounts = await Promise.all(
      connections.map(async (conn) => {
        try {
          const apiKey = Buffer.from(conn.stripe_api_key_encrypted, 'base64').toString('utf-8')
          const [mrr, subscribers] = await Promise.all([
            calculateMRR(apiKey),
            getSubscriberCount(apiKey),
          ])
          return { id: conn.id, name: conn.stripe_account_name, mrr, arr: Math.round(mrr * 12), subscribers, error: null }
        } catch {
          return { id: conn.id, name: conn.stripe_account_name, mrr: 0, arr: 0, subscribers: 0, error: 'Failed to fetch' }
        }
      })
    )

    const totalMRR  = Math.round(accounts.reduce((s, a) => s + a.mrr, 0) * 100) / 100
    const totalSubs = accounts.reduce((s, a) => s + a.subscribers, 0)

    return NextResponse.json({
      connected:        true,
      totalMRR,
      totalARR:         Math.round(totalMRR * 12),
      totalSubscribers: totalSubs,
      accounts,
    })
  })
}
