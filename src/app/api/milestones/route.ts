import { withAuth } from '@/lib/api-helpers'
import { NextResponse } from 'next/server'

export async function GET() {
  return withAuth(async (user, service) => {
    const { data, error } = await service
      .from('milestones_hit')
      .select('*')
      .eq('user_id', user.id)
      .order('hit_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ milestones: data })
  })
}
