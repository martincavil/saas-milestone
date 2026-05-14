import { createClient, createServiceClient } from '@/lib/supabase/server'
import { generateMilestoneImage } from '@/lib/satori/generate-image'
import { postMilestoneTweet } from '@/lib/twitter/post'
import { MILESTONE_CONFIGS, type MilestoneCategory } from '@/types'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = await createServiceClient()

  // ── Gate: Pro subscribers only ───────────────────────────────────────────
  const { data: sub } = await service
    .from('user_subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .single()

  if (sub?.status !== 'active') {
    return NextResponse.json(
      { error: 'Manual posting requires a Pro subscription.' },
      { status: 403 }
    )
  }

  // ── Validate input ────────────────────────────────────────────────────────
  const body = await request.json()
  const { category, milestone, currentValue, saasName } = body as {
    category: MilestoneCategory
    milestone: number
    currentValue: number
    saasName: string
  }

  const config = MILESTONE_CONFIGS[category]
  if (!config) return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  if (!config.thresholds.includes(milestone)) {
    return NextResponse.json({ error: 'Invalid milestone for this category' }, { status: 400 })
  }

  // ── Check X is connected ──────────────────────────────────────────────────
  const { data: twitterConn } = await service
    .from('twitter_connections')
    .select('screen_name')
    .eq('user_id', user.id)
    .single()

  if (!twitterConn) {
    return NextResponse.json({ error: 'Connect X (Twitter) first.' }, { status: 400 })
  }

  // ── Generate card ─────────────────────────────────────────────────────────
  const imageBuffer = await generateMilestoneImage(
    saasName,
    milestone,
    currentValue,
    { category }
  )

  // ── Post to X ─────────────────────────────────────────────────────────────
  let tweetId: string | null = null
  try {
    tweetId = await postMilestoneTweet(saasName, milestone, imageBuffer)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Twitter post failed: ${msg}` }, { status: 500 })
  }

  // ── Record in DB ──────────────────────────────────────────────────────────
  const { data: inserted } = await service
    .from('milestones_hit')
    .insert({
      user_id:  user.id,
      category,
      amount:   milestone,
      hit_at:   new Date().toISOString(),
      tweet_id: tweetId,
      posted:   true,
    })
    .select('id')
    .single()

  return NextResponse.json({
    success: true,
    tweetId,
    milestoneId: inserted?.id,
    tweetUrl: `https://x.com/i/web/status/${tweetId}`,
  })
}
