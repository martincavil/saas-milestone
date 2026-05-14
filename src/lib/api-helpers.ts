import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'

type ServiceClient = Awaited<ReturnType<typeof createServiceClient>>

/** Wraps an API route handler with auth. Returns 401 if not logged in. */
export async function withAuth<T extends NextResponse>(
  handler: (user: User, service: ServiceClient) => Promise<T>
): Promise<T | NextResponse> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) as T
  }

  const service = await createServiceClient()
  return handler(user, service)
}

/** Wraps an API route handler — also checks Pro subscription. Returns 403 if free. */
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
      return NextResponse.json(
        { error: 'Pro subscription required.' },
        { status: 403 }
      ) as T
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
