import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code  = searchParams.get('code')
  const error = searchParams.get('error')
  const next  = searchParams.get('next') ?? '/dashboard'

  // OAuth error from provider (e.g. user cancelled Google login)
  if (error) {
    const desc = searchParams.get('error_description') ?? error
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(desc)}`)
  }

  // PKCE code flow (magic link + Google OAuth)
  if (code) {
    try {
      const supabase = await createClient()
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      if (!exchangeError) {
        return NextResponse.redirect(`${origin}${next}`)
      }
      console.error('Auth callback exchange error:', exchangeError.message)
    } catch (e) {
      console.error('Auth callback exception:', e)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
