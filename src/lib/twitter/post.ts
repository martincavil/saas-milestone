import { TwitterApi } from 'twitter-api-v2'
import { fmtCount } from '@/lib/utils'

// Uses OAuth 1.0a API Key/Secret (not OAuth 2.0 Client ID)
function createClient() {
  return new TwitterApi({
    appKey:      process.env.TWITTER_API_KEY    ?? process.env.TWITTER_CLIENT_ID!,
    appSecret:   process.env.TWITTER_API_SECRET ?? process.env.TWITTER_CLIENT_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
  })
}

const MILESTONE_EMOJIS: Record<number, string> = {
  1: '🌱', 10: '🚀', 50: '💫', 100: '🎯',
  500: '⚡', 1000: '🔥', 5000: '💎', 10000: '👑',
}

export async function postMilestoneTweet(saasName: string, amount: number, imageBuffer: Buffer): Promise<string> {
  const client  = createClient()
  const mediaId = await client.v1.uploadMedia(imageBuffer, { mimeType: 'image/png' })
  const emoji   = MILESTONE_EMOJIS[amount] ?? '🎉'
  const text    = `${emoji} ${saasName} just hit $${fmtCount(amount)} MRR!\n\nBuilding in public. One milestone at a time.\n\n#buildinpublic #saas #indiehacker`
  const tweet   = await client.v2.tweet({ text, media: { media_ids: [mediaId] } })
  return tweet.data.id
}
