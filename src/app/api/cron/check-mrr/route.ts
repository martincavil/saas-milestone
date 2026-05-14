import { createServiceClient } from '@/lib/supabase/server'
import { calculateMRR, getNewMilestones } from '@/lib/stripe/mrr'
import { generateMilestoneImage } from '@/lib/satori/generate-image'
import { postMilestoneTweet } from '@/lib/twitter/post'
import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Vercel cron: runs every hour
export const maxDuration = 300

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const service = await createServiceClient()

  // Get all stripe connections
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
      const currentMRR = await calculateMRR(apiKey)

      // Get last known MRR from most recent milestone
      const { data: lastMilestone } = await service
        .from('milestones_hit')
        .select('amount')
        .eq('user_id', conn.user_id)
        .order('hit_at', { ascending: false })
        .limit(1)
        .single()

      const previousMRR = lastMilestone?.amount ?? 0
      const newMilestones = getNewMilestones(previousMRR, currentMRR)

      for (const milestone of newMilestones) {
        // Generate image
        const imageBuffer = await generateMilestoneImage(
          conn.stripe_account_name,
          milestone,
          currentMRR
        )

        let tweetId: string | null = null
        let imageUrl: string | null = null

        // Check if user has Twitter connected
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
              imageBuffer
            )
          } catch (twitterErr) {
            console.error('Twitter post failed:', twitterErr)
          }
        }

        // Store milestone
        await service.from('milestones_hit').insert({
          user_id: conn.user_id,
          amount: milestone,
          hit_at: new Date().toISOString(),
          tweet_id: tweetId,
          image_url: imageUrl,
          posted: !!tweetId,
        })

        results.push({ user_id: conn.user_id, milestone, posted: !!tweetId })
      }
    } catch (err) {
      console.error(`Error processing user ${conn.user_id}:`, err)
    }
  }

  return NextResponse.json({ processed: connections.length, milestones: results })
}
