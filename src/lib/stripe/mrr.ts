import Stripe from 'stripe'
import { MILESTONES, type MilestoneAmount } from '@/types'

export function createStripeClient(apiKey: string) {
  return new Stripe(apiKey, { apiVersion: '2026-04-22.dahlia' })
}

export async function calculateMRR(apiKey: string): Promise<number> {
  const stripe = createStripeClient(apiKey)
  let mrr = 0
  let hasMore = true
  let startingAfter: string | undefined

  while (hasMore) {
    const subscriptions = await stripe.subscriptions.list({
      status: 'active',
      limit: 100,
      starting_after: startingAfter,
      expand: ['data.items.data.price'],
    })

    for (const sub of subscriptions.data) {
      for (const item of sub.items.data) {
        const price = item.price
        const quantity = item.quantity ?? 1
        const amount = price.unit_amount ?? 0
        const currency = price.currency

        // Normalize to USD cents equivalent (simplified — assumes USD)
        if (currency !== 'usd') continue

        if (price.recurring?.interval === 'month') {
          mrr += (amount * quantity) / 100
        } else if (price.recurring?.interval === 'year') {
          mrr += (amount * quantity) / 100 / 12
        } else if (price.recurring?.interval === 'week') {
          mrr += ((amount * quantity) / 100) * (52 / 12)
        } else if (price.recurring?.interval === 'day') {
          mrr += ((amount * quantity) / 100) * (365 / 12)
        }
      }
    }

    hasMore = subscriptions.has_more
    if (hasMore) {
      startingAfter = subscriptions.data[subscriptions.data.length - 1].id
    }
  }

  return Math.round(mrr * 100) / 100
}

export async function getSubscriberCount(apiKey: string): Promise<number> {
  const stripe = createStripeClient(apiKey)
  let count = 0
  let hasMore = true
  let startingAfter: string | undefined

  while (hasMore) {
    const subs = await stripe.subscriptions.list({
      status: 'active',
      limit: 100,
      starting_after: startingAfter,
    })
    count += subs.data.length
    hasMore = subs.has_more
    if (hasMore) startingAfter = subs.data[subs.data.length - 1].id
  }

  return count
}

export function getNewMilestones(previousMRR: number, currentMRR: number): MilestoneAmount[] {
  return MILESTONES.filter(m => previousMRR < m && currentMRR >= m)
}

export function getNextMilestone(currentMRR: number): MilestoneAmount | null {
  return MILESTONES.find(m => m > currentMRR) ?? null
}
