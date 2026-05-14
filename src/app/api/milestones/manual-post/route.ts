import { withPro, err } from '@/lib/api-helpers'
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

    const { data: twitterConn } = await service
      .from('twitter_connections')
      .select('screen_name')
      .eq('user_id', user.id)
      .single()

    if (!twitterConn) return err('Connect X (Twitter) first.', 400)

    const imageBuffer = await generateMilestoneImage(saasName, milestone, currentValue, { category })

    let tweetId: string
    try {
      tweetId = await postMilestoneTweet(saasName, milestone, imageBuffer)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      return err(`Twitter post failed: ${msg}`, 500)
    }

    const { data: inserted } = await service
      .from('milestones_hit')
      .insert({ user_id: user.id, category, amount: milestone, hit_at: new Date().toISOString(), tweet_id: tweetId, posted: true })
      .select('id')
      .single()

    return Response.json({
      success:     true,
      tweetId,
      milestoneId: inserted?.id,
      tweetUrl:    `https://x.com/i/web/status/${tweetId}`,
    })
  })
}
