import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

// GET /api/linkedin-auth
// Redirects the user to LinkedIn OAuth 2.0 with required scopes
export async function GET(request: Request) {
  const { origin } = new URL(request.url)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(`${origin}/login`)

  const clientId = process.env.LINKEDIN_CLIENT_ID
  if (!clientId) {
    console.error('LinkedIn OAuth: LINKEDIN_CLIENT_ID not set')
    return NextResponse.redirect(`${origin}/dashboard/connectors?error=linkedin_config`)
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? origin
  const redirectUri = `${appUrl}/api/linkedin-auth/callback`
  const state = randomBytes(16).toString('hex')

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'openid profile w_member_social',
    state,
  })

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`

  const isProduction = process.env.NODE_ENV === 'production'

  const response = NextResponse.redirect(authUrl)
  response.cookies.set('linkedin_oauth_state', state, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })

  return response
}
