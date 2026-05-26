@AGENTS.md

# saas-milestone.com

Auto-posts MRR milestones to X (Twitter) and LinkedIn when Stripe MRR crosses a threshold.

## Stack

- **Framework:** Next.js 16 App Router (TypeScript)
- **Styling:** Tailwind CSS
- **Database:** Supabase — `wokjwxunyddjiaeuwiow.supabase.co`
- **Image generation:** Satori
- **Email:** Resend
- **Deploy:** Vercel
- **Cron:** Vercel cron — runs hourly at `/api/cron/check-mrr`

## Business logic

- Free when user's Stripe MRR < $100
- $9/mo paywall once MRR ≥ $100
- Milestones tracked: $1 / $10 / $50 / $100 / $500 / $1k / $5k / $10k

## Database tables

- `stripe_connections` — Stripe API keys per user (multi-SaaS)
- `milestones_hit` — every milestone hit with tweet_id for idempotency
- `user_subscriptions` — $9/mo subscription state
- `twitter_connections` — Twitter OAuth 1.0a tokens per user
- `linkedin_connections` — LinkedIn OAuth 2.0 tokens per user
- `metric_connections` — GitHub stars config + last known value per user
- `user_settings` — notification preferences (email_milestone, email_weekly_digest)

## Known gotchas

- Next.js 16 uses `proxy.ts` instead of `middleware.ts` — export a `proxy` function, not `middleware`
- Twitter posting uses OAuth 1.0a app-level tokens (not OAuth 2.0)
- LinkedIn posting uses OAuth 2.0 with scopes: `openid profile w_member_social`
- Tokens are stored base64-encoded in DB, decoded before use
- Cron respects `user_settings.email_milestone` (default: true)

## Skills to use

- Before writing any marketing copy → use `copywriting` skill
- Before implementing any feature → use `test-driven-development` skill
- Before claiming work is done → use `verification-before-completion` skill
- When debugging → use `systematic-debugging` skill
- When building UI components → use `frontend-design` skill
- When reviewing copy for AI writing patterns → use `stop-slop` skill
- When optimizing the landing page for conversions → use `page-cro` skill

## Environment variables needed

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_ID          # $9/mo subscription price
TWITTER_API_KEY          # OAuth 1.0a Consumer Key
TWITTER_API_SECRET       # OAuth 1.0a Consumer Key Secret
TWITTER_ACCESS_TOKEN
TWITTER_ACCESS_TOKEN_SECRET
LINKEDIN_CLIENT_ID       # LinkedIn OAuth 2.0 app
LINKEDIN_CLIENT_SECRET
RESEND_API_KEY
CRON_SECRET              # verifies /api/cron/check-mrr calls
NEXT_PUBLIC_APP_URL      # https://saas-milestone.vercel.app
```

## What still needs to be done

- [ ] Apply `supabase/schema.sql` in Supabase SQL editor (new tables: linkedin_connections, metric_connections, user_settings)
- [ ] Create Twitter OAuth 1.0a app and get API credentials
- [ ] Create LinkedIn OAuth 2.0 app — scopes: openid, profile, w_member_social — redirect URI: /api/linkedin-auth/callback
- [ ] Create Stripe $9/mo Product + Price, copy Price ID to env
- [ ] Set Stripe webhook → `/api/webhook` (not /api/webhooks/stripe)
- [ ] Configure Resend: verify domain milestonehit.com, sender hello@milestonehit.com
- [ ] Deploy to Vercel with all env vars set
