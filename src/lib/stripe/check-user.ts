/**
 * Run a milestone check for a single user (called after Stripe connect).
 * Mirrors the cron logic but:
 *   - only processes one user
 *   - does NOT post to Twitter/LinkedIn (first connection — avoid spam)
 *   - best-effort — errors are swallowed so they don't block the API response
 */

import { createServiceClient } from '@/lib/supabase/server'
import { calculateMRR, getNewMilestones, getSubscriberCount } from '@/lib/stripe/mrr'

export async function checkUserMilestones(userId: string): Promise<void> {
  try {
    const service = await createServiceClient()

    // Fetch the user's Stripe connection
    const { data: conn } = await service
      .from('stripe_connections')
      .select('stripe_api_key_encrypted, stripe_account_name')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!conn) return

    const apiKey = Buffer.from(conn.stripe_api_key_encrypted, 'base64').toString('utf-8')

    // Calculate current MRR and subscriber count in parallel
    const [currentMRR, subscriberCount] = await Promise.all([
      calculateMRR(apiKey),
      getSubscriberCount(apiKey),
    ])

    // Get last known MRR milestone for this user
    const { data: lastMilestone } = await service
      .from('milestones_hit')
      .select('amount')
      .eq('user_id', userId)
      .eq('category', 'mrr')
      .order('hit_at', { ascending: false })
      .limit(1)
      .single()

    const previousMRR = lastMilestone?.amount ?? 0
    const newMilestones = getNewMilestones(previousMRR, currentMRR)

    for (const milestone of newMilestones) {
      const avgRevenue = subscriberCount > 0 ? Math.round(milestone / subscriberCount) : 0

      // Insert the milestone — no Twitter/LinkedIn posting on first connect
      await service.from('milestones_hit').insert({
        user_id:   userId,
        category:  'mrr',
        amount:    milestone,
        hit_at:    new Date().toISOString(),
        tweet_id:  null,
        image_url: null,
        posted:    false,
      })

      // Suppress unused variable warning
      void avgRevenue
    }
  } catch {
    // Best-effort — never throw, never block the caller
  }
}
