import { createClient } from '@/lib/supabase/server'
import { TwitterApi } from 'twitter-api-v2'
import { NextResponse } from 'next/server'

// OAuth 1.0a flow — requires API Key + API Key Secret from developer.twitter.com
// NOT the OAuth 2.0 Client ID. Get them from:
// developer.twitter.com → Your App → Keys and Tokens → Consumer Keys
export async function GET(request: Request) {
  const { origin } = new URL(request.url)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(`${origin}/login`)

  const appKey    = process.env.TWITTER_API_KEY    ?? process.env.TWITTER_CLIENT_ID
  const appSecret = process.env.TWITTER_API_SECRET ?? process.env.TWITTER_CLIENT_SECRET

  if (!appKey || !appSecret) {
    console.error('Twitter OAuth: missing TWITTER_API_KEY or TWITTER_API_SECRET')
    return NextResponse.redirect(`${origin}/dashboard/connectors?error=twitter_config`)
  }

  try {
    const client = new TwitterApi({ appKey, appSecret })

    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/twitter-auth/callback`
    const { url, oauth_token, oauth_token_secret } = await client.generateAuthLink(callbackUrl, {
      linkMode: 'authorize',
    })

    const isProduction = process.env.NODE_ENV === 'production'

    const response = NextResponse.redirect(url)
    response.cookies.set('twitter_oauth_token', oauth_token, {
      httpOnly: true,
      secure:   isProduction,   // false on localhost — cookies only work over HTTPS in prod
      sameSite: 'lax',
      maxAge:   600,
      path:     '/',
    })
    response.cookies.set('twitter_oauth_token_secret', oauth_token_secret, {
      httpOnly: true,
      secure:   isProduction,
      sameSite: 'lax',
      maxAge:   600,
      path:     '/',
    })

    return response
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Twitter OAuth initiation failed:', msg)

    // Most likely cause: TWITTER_CLIENT_ID is an OAuth 2.0 key, not an OAuth 1.0a API Key.
    // Fix: go to developer.twitter.com → App → Keys and Tokens → Consumer Keys (API Key + Secret)
    return NextResponse.redirect(
      `${origin}/dashboard/connectors?error=twitter_keys&msg=${encodeURIComponent(msg)}`
    )
  }
}
