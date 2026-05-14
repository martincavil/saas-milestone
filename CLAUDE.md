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

- `stripe_connections` — Stripe OAuth tokens per user
- `milestones_hit` — which milestones have already been posted (idempotency)
- `user_subscriptions` — $9/mo subscription state
- `twitter_connections` — Twitter OAuth 1.0a tokens per user

## Known gotchas

- Next.js 16 uses `proxy.ts` instead of `middleware.ts` — export a `proxy` function, not `middleware`
- Twitter posting uses OAuth 1.0a app-level tokens (not OAuth 2.0)

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
TWITTER_API_KEY
TWITTER_API_SECRET
TWITTER_ACCESS_TOKEN
TWITTER_ACCESS_TOKEN_SECRET
RESEND_API_KEY
CRON_SECRET              # verifies /api/cron/check-mrr calls
```

## What still needs to be done

- [ ] Apply `supabase/schema.sql` in Supabase SQL editor
- [ ] Create Twitter OAuth 1.0a app and get API credentials
- [ ] Create Stripe $9/mo Product + Price, copy Price ID to env
- [ ] Set Stripe webhook → `/api/webhooks/stripe`
- [ ] Deploy to Vercel with all env vars set
