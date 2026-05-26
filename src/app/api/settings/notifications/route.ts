import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = await createServiceClient()
  const { data } = await service
    .from('user_settings')
    .select('email_milestone, email_weekly_digest')
    .eq('user_id', user.id)
    .single()

  return NextResponse.json({
    email_milestone:     data?.email_milestone     ?? true,
    email_weekly_digest: data?.email_weekly_digest ?? false,
  })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as { email_milestone?: boolean; email_weekly_digest?: boolean }
  const service = await createServiceClient()

  await service.from('user_settings').upsert(
    { user_id: user.id, ...body, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  )

  return NextResponse.json({ ok: true })
}
