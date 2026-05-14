import { createServiceClient } from '@/lib/supabase/server'
import { calculateMRR, getNewMilestones, getSubscriberCount } from '@/lib/stripe/mrr'
import { generateMilestoneImage } from '@/lib/satori/generate-image'
import { postMilestoneTweet } from '@/lib/twitter/post'
import { NextResponse } from 'next/server'

export const maxDuration = 300

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const service = await createServiceClient()

  const { data: connections, error } = await service
    .from('stripe_connections')
    .select('user_id, stripe_api_key_encrypted, stripe_account_name')

  if (error || !connections) {
    return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 })
  }

  const results = []

  for (const conn of connections) {
    try {
      const apiKey = Buffer.from(conn.stripe_api_key_encrypted, 'base64').toString('utf-8')

      // Fetch MRR + subscriber count in parallel
      const [currentMRR, subscriberCount] = await Promise.all([
        calculateMRR(apiKey),
        getSubscriberCount(apiKey),
      ])

      // Get last known MRR milestone for this user
      const { data: lastMilestone } = await service
        .from('milestones_hit')
        .select('amount')
        .eq('user_id', conn.user_id)
        .eq('category', 'mrr')
        .order('hit_at', { ascending: false })
        .limit(1)
        .single()

      const previousMRR = lastMilestone?.amount ?? 0
      const newMilestones = getNewMilestones(previousMRR, currentMRR)

      for (const milestone of newMilestones) {
        const avgRevenue = subscriberCount > 0 ? Math.round(milestone / subscriberCount) : 0
        const growthPct  = previousMRR > 0
          ? Math.round(((milestone - previousMRR) / previousMRR) * 100)
          : 0

        // Generate dashboard-style analytics screenshot card
        const imageBuffer = await generateMilestoneImage(
          conn.stripe_account_name,
          milestone,
          currentMRR,
          {
            subscriberCount,
            avgRevenue,
            previousMRR,
            category: 'mrr',
          }
        )

        let tweetId: string | null = null

        const { data: twitterCreds } = await service
          .from('twitter_connections')
          .select('access_token, access_token_secret')
          .eq('user_id', conn.user_id)
          .single()

        if (twitterCreds) {
          try {
            tweetId = await postMilestoneTweet(
              conn.stripe_account_name,
              milestone,
              imageBuffer,
              {
                accessToken:       twitterCreds.access_token,
                accessTokenSecret: twitterCreds.access_token_secret,
              }
            )
          } catch (err) {
            console.error('Twitter post failed:', err)
          }
        }

        await service.from('milestones_hit').insert({
          user_id:   conn.user_id,
          category:  'mrr',
          amount:    milestone,
          hit_at:    new Date().toISOString(),
          tweet_id:  tweetId,
          image_url: null,
          posted:    !!tweetId,
        })

        results.push({ user_id: conn.user_id, milestone, posted: !!tweetId, subscribers: subscriberCount })
      }

      // ── Check X followers milestone ────────────────────────────────────────
      const { data: twitterConn } = await service
        .from('twitter_connections')
        .select('twitter_user_id, access_token, access_token_secret')
        .eq('user_id', conn.user_id)
        .single()

      if (twitterConn) {
        await checkFollowersMilestone(service, conn, twitterConn, apiKey, currentMRR)
      }

    } catch (err) {
      console.error(`Error processing user ${conn.user_id}:`, err)
    }
  }

  return NextResponse.json({ processed: connections.length, milestones: results })
}

// ─── Followers milestone check ─────────────────────────────────────────────

async function checkFollowersMilestone(
  service: Awaited<ReturnType<typeof createServiceClient>>,
  conn: { user_id: string; stripe_account_name: string },
  twitterConn: { twitter_user_id: string; access_token: string; access_token_secret: string },
  _apiKey: string,
  currentMRR: number
) {
  try {
    const { TwitterApi } = await import('twitter-api-v2')
    const accessToken  = Buffer.from(twitterConn.access_token, 'base64').toString('utf-8')
    const accessSecret = Buffer.from(twitterConn.access_token_secret, 'base64').toString('utf-8')

    const client = new TwitterApi({
      appKey:      process.env.TWITTER_API_KEY    ?? process.env.TWITTER_CLIENT_ID!,
      appSecret:   process.env.TWITTER_API_SECRET ?? process.env.TWITTER_CLIENT_SECRET!,
      accessToken,
      accessSecret,
    })

    const user = await client.v2.user(twitterConn.twitter_user_id, {
      'user.fields': ['public_metrics'],
    })
    const followerCount = user.data.public_metrics?.followers_count ?? 0

    // Get last known followers milestone
    const { data: lastFollowerMilestone } = await service
      .from('milestones_hit')
      .select('amount')
      .eq('user_id', conn.user_id)
      .eq('category', 'followers')
      .order('hit_at', { ascending: false })
      .limit(1)
      .single()

    const prevFollowers = lastFollowerMilestone?.amount ?? 0
    const followerThresholds = [100, 500, 1000, 2000, 5000, 10000, 25000, 50000, 100000]
    const newFollowerMilestones = followerThresholds.filter(
      t => prevFollowers < t && followerCount >= t
    )

    for (const milestone of newFollowerMilestones) {
      const imageBuffer = await generateMilestoneImage(
        conn.stripe_account_name,
        milestone,
        currentMRR,
        { category: 'followers', previousMRR: prevFollowers }
      )

      let tweetId: string | null = null
      try {
        const { postMilestoneTweet } = await import('@/lib/twitter/post')
        tweetId = await postMilestoneTweet(conn.stripe_account_name, milestone, imageBuffer, {
          accessToken:       twitterConn.access_token,
          accessTokenSecret: twitterConn.access_token_secret,
        })
      } catch {}

      await service.from('milestones_hit').insert({
        user_id:  conn.user_id,
        category: 'followers',
        amount:   milestone,
        hit_at:   new Date().toISOString(),
        tweet_id: tweetId,
        posted:   !!tweetId,
      })
    }
  } catch {
    // Followers check is best-effort
  }
}
