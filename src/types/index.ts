export interface StripeConnection {
  id: string
  user_id: string
  stripe_api_key_encrypted: string
  stripe_account_name: string
  created_at: string
}

export interface MilestoneHit {
  id: string
  user_id: string
  amount: number
  hit_at: string
  tweet_id: string | null
  image_url: string | null
  posted: boolean
}

export interface UserSubscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_sub_id: string | null
  status: 'active' | 'inactive' | 'trialing' | 'past_due' | 'canceled'
}

export const MILESTONES = [1, 10, 50, 100, 500, 1000, 5000, 10000] as const
export type MilestoneAmount = (typeof MILESTONES)[number]
