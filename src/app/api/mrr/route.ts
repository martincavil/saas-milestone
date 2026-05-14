import { createClient, createServiceClient } from '@/lib/supabase/server'
import { calculateMRR, getSubscriberCount } from '@/lib/stripe/mrr'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = await createServiceClient()

  const { data: connections } = await service
    .from('stripe_connections')
    .select('id, stripe_api_key_encrypted, stripe_account_name')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (!connections || connections.length === 0) {
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

  const totalMRR = accounts.reduce((sum, a) => sum + a.mrr, 0)
  const totalARR = Math.round(totalMRR * 12)
  const totalSubs = accounts.reduce((sum, a) => sum + a.subscribers, 0)

  return NextResponse.json({
    connected: true,
    totalMRR: Math.round(totalMRR * 100) / 100,
    totalARR,
    totalSubscribers: totalSubs,
    accounts,
  })
}
