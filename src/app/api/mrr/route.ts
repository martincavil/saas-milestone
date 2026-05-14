import { createClient, createServiceClient } from '@/lib/supabase/server'
import { calculateMRR } from '@/lib/stripe/mrr'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = await createServiceClient()

  const { data: conn } = await service
    .from('stripe_connections')
    .select('stripe_api_key_encrypted, stripe_account_name')
    .eq('user_id', user.id)
    .single()

  if (!conn) return NextResponse.json({ mrr: null, connected: false })

  try {
    const apiKey = Buffer.from(conn.stripe_api_key_encrypted, 'base64').toString('utf-8')
    const mrr = await calculateMRR(apiKey)
    return NextResponse.json({ mrr, connected: true, accountName: conn.stripe_account_name })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch MRR', connected: true, mrr: null }, { status: 500 })
  }
}
