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
  category: MilestoneCategory
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

export interface MetricConnection {
  id: string
  user_id: string
  category: MilestoneCategory
  config: Record<string, string> // e.g. { github_repo: 'user/repo', website_url: 'https://...' }
  last_value: number
  last_checked_at: string | null
  enabled: boolean
}

// ─── Milestone categories ───────────────────────────────────────────────────

export type MilestoneCategory =
  | 'mrr'
  | 'followers'
  | 'users'
  | 'visits'
  | 'stars'
  | 'subscribers'

export interface MilestoneConfig {
  category: MilestoneCategory
  label: string        // "MRR"
  description: string  // "Monthly Recurring Revenue"
  unit: string         // "$" | ""
  suffix: string       // "" | " followers" | " users" | " visits"
  thresholds: number[]
  source: 'stripe' | 'twitter_api' | 'github_api' | 'manual'
  color: string        // tailwind color token for UI
  formatValue: (n: number) => string
}

export const MILESTONE_CONFIGS: Record<MilestoneCategory, MilestoneConfig> = {
  mrr: {
    category: 'mrr',
    label: 'MRR',
    description: 'Monthly Recurring Revenue',
    unit: '$',
    suffix: '',
    thresholds: [1, 10, 50, 100, 500, 1000, 5000, 10000, 25000, 50000, 100000],
    source: 'stripe',
    color: 'indigo',
    formatValue: (n) => n >= 1000 ? `$${n / 1000}k` : `$${n}`,
  },
  followers: {
    category: 'followers',
    label: 'X Followers',
    description: 'Twitter/X follower count',
    unit: '',
    suffix: ' followers',
    thresholds: [100, 500, 1000, 2000, 5000, 10000, 25000, 50000, 100000],
    source: 'twitter_api',
    color: 'sky',
    formatValue: (n) => n >= 1000 ? `${n / 1000}k` : `${n}`,
  },
  users: {
    category: 'users',
    label: 'Users',
    description: 'Registered users / customers',
    unit: '',
    suffix: ' users',
    thresholds: [1, 10, 50, 100, 500, 1000, 5000, 10000],
    source: 'stripe',
    color: 'violet',
    formatValue: (n) => n >= 1000 ? `${n / 1000}k` : `${n}`,
  },
  visits: {
    category: 'visits',
    label: 'Monthly Visits',
    description: 'Website monthly page views',
    unit: '',
    suffix: ' visits',
    thresholds: [100, 500, 1000, 5000, 10000, 50000, 100000, 500000],
    source: 'manual',
    color: 'emerald',
    formatValue: (n) => n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `${n}`,
  },
  stars: {
    category: 'stars',
    label: 'GitHub Stars',
    description: 'GitHub repository stars',
    unit: '',
    suffix: ' stars',
    thresholds: [10, 50, 100, 500, 1000, 5000, 10000],
    source: 'github_api',
    color: 'amber',
    formatValue: (n) => n >= 1000 ? `${n / 1000}k` : `${n}`,
  },
  subscribers: {
    category: 'subscribers',
    label: 'Email List',
    description: 'Email subscribers',
    unit: '',
    suffix: ' subs',
    thresholds: [100, 500, 1000, 5000, 10000, 50000],
    source: 'manual',
    color: 'rose',
    formatValue: (n) => n >= 1000 ? `${n / 1000}k` : `${n}`,
  },
}

export const CATEGORIES_ORDER: MilestoneCategory[] = ['mrr', 'followers', 'users', 'visits', 'stars', 'subscribers']

// Legacy — kept for backward compat in cron logic
export const MILESTONES = MILESTONE_CONFIGS.mrr.thresholds as readonly number[]
export type MilestoneAmount = number
