import { createClient, createServiceClient } from '@/lib/supabase/server'
import { TwitterApi } from 'twitter-api-v2'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const oauthToken = searchParams.get('oauth_token')
  const oauthVerifier = searchParams.get('oauth_verifier')

  const cookieStore = await cookies()
  const storedToken = cookieStore.get('twitter_oauth_token')?.value
  const storedSecret = cookieStore.get('twitter_oauth_token_secret')?.value

  if (!oauthToken || !oauthVerifier || !storedToken || !storedSecret) {
    return NextResponse.redirect(`${origin}/dashboard?error=twitter_auth`)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.redirect(`${origin}/login`)

  try {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_CLIENT_ID!,
      appSecret: process.env.TWITTER_CLIENT_SECRET!,
      accessToken: storedToken,
      accessSecret: storedSecret,
    })

    const { accessToken, accessSecret, screenName, userId: twitterUserId } =
      await client.login(oauthVerifier)

    const service = await createServiceClient()
    await service.from('twitter_connections').upsert(
      {
        user_id: user.id,
        twitter_user_id: twitterUserId,
        screen_name: screenName,
        access_token: Buffer.from(accessToken).toString('base64'),
        access_token_secret: Buffer.from(accessSecret).toString('base64'),
      },
      { onConflict: 'user_id' }
    )

    const response = NextResponse.redirect(`${origin}/dashboard?twitter=connected`)
    response.cookies.delete('twitter_oauth_token')
    response.cookies.delete('twitter_oauth_token_secret')
    return response
  } catch (err) {
    console.error('Twitter callback error:', err)
    return NextResponse.redirect(`${origin}/dashboard?error=twitter_auth`)
  }
}
