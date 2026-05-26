import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  const redirect = (path: string) => NextResponse.redirect(`${origin}${path}`)

  if (!code || !state) {
    return redirect('/dashboard/connectors?error=linkedin_missing_params')
  }

  const cookieStore = await cookies()
  const storedState = cookieStore.get('linkedin_oauth_state')?.value

  if (!storedState || storedState !== state) {
    console.error('LinkedIn callback: state mismatch', { storedState: !!storedState, state })
    return redirect('/dashboard/connectors?error=linkedin_state')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const clientId = process.env.LINKEDIN_CLIENT_ID
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? origin
  const redirectUri = `${appUrl}/api/linkedin-auth/callback`

  if (!clientId || !clientSecret) {
    console.error('LinkedIn callback: LINKEDIN_CLIENT_ID or LINKEDIN_CLIENT_SECRET not set')
    return redirect('/dashboard/connectors?error=linkedin_config')
  }

  try {
    // ── Step 1: Exchange code for access token ──────────────────────────────

    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }).toString(),
    })

    if (!tokenRes.ok) {
      const body = await tokenRes.text()
      console.error('LinkedIn token exchange failed:', tokenRes.status, body)
      return redirect('/dashboard/connectors?error=linkedin_auth')
    }

    const tokenData = await tokenRes.json()
    const accessToken: string = tokenData.access_token

    if (!accessToken) {
      console.error('LinkedIn token exchange: no access_token in response', tokenData)
      return redirect('/dashboard/connectors?error=linkedin_auth')
    }

    // ── Step 2: Fetch LinkedIn profile via OpenID Connect userinfo ──────────

    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!profileRes.ok) {
      const body = await profileRes.text()
      console.error('LinkedIn userinfo failed:', profileRes.status, body)
      return redirect('/dashboard/connectors?error=linkedin_auth')
    }

    const profileData = await profileRes.json()
    // OpenID Connect: sub = stable person identifier, name = display name
    const linkedInUserId: string = profileData.sub
    const name: string = profileData.name ?? profileData.given_name ?? 'LinkedIn User'

    if (!linkedInUserId) {
      console.error('LinkedIn userinfo: no sub in response', profileData)
      return redirect('/dashboard/connectors?error=linkedin_auth')
    }

    // ── Step 3: Upsert into linkedin_connections ────────────────────────────

    const service = await createServiceClient()
    await service.from('linkedin_connections').upsert(
      {
        user_id: user.id,
        linkedin_user_id: linkedInUserId,
        name,
        access_token: Buffer.from(accessToken).toString('base64'),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

    const response = redirect('/dashboard/connectors?linkedin=connected')
    response.cookies.delete('linkedin_oauth_state')
    return response
  } catch (err) {
    console.error('LinkedIn callback error:', err)
    return redirect('/dashboard/connectors?error=linkedin_auth')
  }
}
