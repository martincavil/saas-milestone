import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'

type ServiceClient = Awaited<ReturnType<typeof createServiceClient>>

export async function withAuth<T extends NextResponse>(
  handler: (user: User, service: ServiceClient) => Promise<T>
): Promise<T | NextResponse> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) as T
    }

    const service = await createServiceClient()
    return await handler(user, service)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Internal server error'
    console.error('[withAuth]', message)
    return NextResponse.json({ error: message }, { status: 500 }) as T
  }
}

export async function withPro<T extends NextResponse>(
  handler: (user: User, service: ServiceClient) => Promise<T>
): Promise<T | NextResponse> {
  return withAuth(async (user, service) => {
    const { data: sub } = await service
      .from('user_subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .single()

    if (sub?.status !== 'active') {
      return NextResponse.json({ error: 'Pro subscription required.' }, { status: 403 }) as T
    }

    return handler(user, service)
  })
}

export function err(message: string, status = 400): NextResponse {
  return NextResponse.json({ error: message }, { status })
}

export function ok(data: Record<string, unknown> = {}): NextResponse {
  return NextResponse.json({ success: true, ...data })
}
