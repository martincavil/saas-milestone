import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// POST /api/linkedin-auth/disconnect
// Removes the linkedin_connection for the authenticated user
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = await createServiceClient()
  await service.from('linkedin_connections').delete().eq('user_id', user.id)

  return NextResponse.json({ success: true })
}
