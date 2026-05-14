import { TwitterApi } from 'twitter-api-v2'

export function createTwitterClient() {
  return new TwitterApi({
    appKey: process.env.TWITTER_CLIENT_ID!,
    appSecret: process.env.TWITTER_CLIENT_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
  })
}

export async function postMilestoneTweet(
  saasName: string,
  amount: number,
  imageBuffer: Buffer
): Promise<string> {
  const client = createTwitterClient()

  const mediaId = await client.v1.uploadMedia(imageBuffer, { mimeType: 'image/png' })

  const text = buildTweetText(saasName, amount)

  const tweet = await client.v2.tweet({
    text,
    media: { media_ids: [mediaId] },
  })

  return tweet.data.id
}

function buildTweetText(saasName: string, amount: number): string {
  const formatted = formatMRR(amount)
  const milestoneEmojis: Record<number, string> = {
    1: '🌱',
    10: '🚀',
    50: '💫',
    100: '🎯',
    500: '⚡',
    1000: '🔥',
    5000: '💎',
    10000: '👑',
  }
  const emoji = milestoneEmojis[amount] ?? '🎉'

  return `${emoji} ${saasName} just hit $${formatted} MRR!\n\nBuilding in public. One milestone at a time.\n\n#buildinpublic #saas #indiehacker`
}

function formatMRR(amount: number): string {
  if (amount >= 1000) return `${amount / 1000}k`
  return amount.toString()
}
