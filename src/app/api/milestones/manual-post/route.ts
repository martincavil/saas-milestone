import { withPro, err } from '@/lib/api-helpers'
import { NextResponse } from 'next/server'
import { generateMilestoneImage } from '@/lib/satori/generate-image'
import { postMilestoneTweet } from '@/lib/twitter/post'
import { MILESTONE_CONFIGS, type MilestoneCategory } from '@/types'

export async function POST(request: Request) {
  return withPro(async (user, service) => {
    const { category, milestone, currentValue, saasName } = await request.json() as {
      category: MilestoneCategory
      milestone: number
      currentValue: number
      saasName: string
    }

    const config = MILESTONE_CONFIGS[category]
    if (!config) return err('Invalid category')
    if (!config.thresholds.includes(milestone)) return err('Invalid milestone for this category')

    const [{ data: twitterConn }, { data: linkedinConn }] = await Promise.all([
      service.from('twitter_connections').select('access_token, access_token_secret, screen_name').eq('user_id', user.id).single(),
      service.from('linkedin_connections').select('linkedin_user_id, access_token').eq('user_id', user.id).single(),
    ])

    if (!twitterConn && !linkedinConn) {
      return err('Connect X (Twitter) or LinkedIn first in the Connectors tab.', 400)
    }

    const imageBuffer = await generateMilestoneImage(saasName, milestone, currentValue, { category })

    let tweetId: string | null = null
    if (twitterConn) {
      try {
        tweetId = await postMilestoneTweet(saasName, milestone, imageBuffer, {
          accessToken:       twitterConn.access_token,
          accessTokenSecret: twitterConn.access_token_secret,
        })
      } catch (e) {
        console.error('Twitter manual post failed:', e)
      }
    }

    if (linkedinConn) {
      try {
        const { postMilestoneLinkedIn } = await import('@/lib/linkedin/post')
        const accessToken = Buffer.from(linkedinConn.access_token, 'base64').toString('utf-8')
        await postMilestoneLinkedIn(saasName, milestone, imageBuffer, linkedinConn.linkedin_user_id, accessToken)
      } catch (e) {
        console.error('LinkedIn manual post failed:', e)
      }
    }

    await service
      .from('milestones_hit')
      .insert({ user_id: user.id, category, amount: milestone, hit_at: new Date().toISOString(), tweet_id: tweetId, posted: true })

    return NextResponse.json({
      success:  true,
      tweetId,
      tweetUrl: tweetId ? `https://x.com/i/web/status/${tweetId}` : null,
    })
  })
}
