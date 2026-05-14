import { createClient } from '@/lib/supabase/server'
import { TwitterApi } from 'twitter-api-v2'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const client = new TwitterApi({
    appKey: process.env.TWITTER_CLIENT_ID!,
    appSecret: process.env.TWITTER_CLIENT_SECRET!,
  })

  const { url, oauth_token, oauth_token_secret } = await client.generateAuthLink(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/twitter-auth/callback`,
    { linkMode: 'authorize' }
  )

  // Store temp tokens in cookie
  const response = NextResponse.redirect(url)
  response.cookies.set('twitter_oauth_token', oauth_token, { httpOnly: true, secure: true, maxAge: 600 })
  response.cookies.set('twitter_oauth_token_secret', oauth_token_secret, { httpOnly: true, secure: true, maxAge: 600 })

  return response
}
