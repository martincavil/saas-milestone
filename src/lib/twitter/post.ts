import { TwitterApi } from 'twitter-api-v2'
import { fmtCount } from '@/lib/utils'

const MILESTONE_EMOJIS: Record<number, string> = {
  1: '🌱', 10: '🚀', 50: '💫', 100: '🎯',
  500: '⚡', 1000: '🔥', 5000: '💎', 10000: '👑',
}

export interface UserTokens {
  accessToken: string        // base64-encoded in DB, decoded here
  accessTokenSecret: string  // base64-encoded in DB, decoded here
}

/**
 * Post a milestone card to X using the user's own OAuth 1.0a tokens.
 * Tokens come from the twitter_connections table (stored base64-encoded).
 */
export async function postMilestoneTweet(
  saasName: string,
  amount: number,
  imageBuffer: Buffer,
  userTokens: UserTokens
): Promise<string> {
  const appKey    = process.env.TWITTER_API_KEY    ?? process.env.TWITTER_CLIENT_ID!
  const appSecret = process.env.TWITTER_API_SECRET ?? process.env.TWITTER_CLIENT_SECRET!

  if (!appKey || !appSecret) {
    throw new Error('TWITTER_API_KEY and TWITTER_API_SECRET must be set (OAuth 1.0a Consumer Keys)')
  }

  // Decode tokens stored as base64 in the DB
  const accessToken  = Buffer.from(userTokens.accessToken, 'base64').toString('utf-8')
  const accessSecret = Buffer.from(userTokens.accessTokenSecret, 'base64').toString('utf-8')

  const client = new TwitterApi({ appKey, appSecret, accessToken, accessSecret })

  const mediaId = await client.v1.uploadMedia(imageBuffer, { mimeType: 'image/png' })

  const emoji = MILESTONE_EMOJIS[amount] ?? '🎉'
  const text  = `${emoji} ${saasName} just hit $${fmtCount(amount)} MRR!\n\nBuilding in public. One milestone at a time.\n\n#buildinpublic #saas #indiehacker`

  const tweet = await client.v2.tweet({ text, media: { media_ids: [mediaId] } })
  return tweet.data.id
}
