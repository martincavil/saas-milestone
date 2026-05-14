/**
 * Creates all Stripe products and prices for saas-milestone.
 * Run once: npx tsx scripts/setup-stripe.ts
 *
 * Requires STRIPE_SECRET_KEY in .env.local (or env).
 * Prints the Price IDs to add to your .env.local.
 */

import Stripe from 'stripe'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const key = process.env.STRIPE_SECRET_KEY
if (!key || key.startsWith('sk_live_...') || key === 'sk_live_...') {
  console.error('❌  Set a real STRIPE_SECRET_KEY in .env.local first.')
  process.exit(1)
}

const stripe = new Stripe(key, { apiVersion: '2026-04-22.dahlia' })

async function main() {
  console.log(`\nConnecting to Stripe (${key.startsWith('sk_test') ? 'TEST mode' : 'LIVE mode'})...\n`)

  // ── Product ──────────────────────────────────────────────────────────────────
  const product = await stripe.products.create({
    name:        'saas-milestone Pro',
    description: 'Auto-post MRR milestones to X. Full analytics dashboard. Multi-SaaS.',
    metadata:    { app: 'saas-milestone' },
  })
  console.log(`✓ Product created: ${product.id} — "${product.name}"`)

  // ── Price: $9/month ───────────────────────────────────────────────────────────
  const monthly = await stripe.prices.create({
    product:    product.id,
    currency:   'usd',
    unit_amount: 900,
    recurring:  { interval: 'month' },
    nickname:   'Pro Monthly',
    metadata:   { plan: 'pro_monthly' },
  })
  console.log(`✓ Price created: ${monthly.id} — $9/month`)

  // ── Price: $79/year ───────────────────────────────────────────────────────────
  const annual = await stripe.prices.create({
    product:    product.id,
    currency:   'usd',
    unit_amount: 7900,
    recurring:  { interval: 'year' },
    nickname:   'Pro Annual',
    metadata:   { plan: 'pro_annual' },
  })
  console.log(`✓ Price created: ${annual.id} — $79/year`)

  // ── Price: $49/year launch offer ──────────────────────────────────────────────
  const launch = await stripe.prices.create({
    product:    product.id,
    currency:   'usd',
    unit_amount: 4900,
    recurring:  { interval: 'year' },
    nickname:   'Launch Offer — $49/yr (first 50)',
    metadata:   { plan: 'pro_launch' },
  })
  console.log(`✓ Price created: ${launch.id} — $49/year (launch)\n`)

  // ── Output ────────────────────────────────────────────────────────────────────
  console.log('─────────────────────────────────────────────')
  console.log('Add these to your .env.local:\n')
  console.log(`STRIPE_PRICE_ID=${monthly.id}`)
  console.log(`STRIPE_PRICE_ID_MONTHLY=${monthly.id}`)
  console.log(`STRIPE_PRICE_ID_ANNUAL=${annual.id}`)
  console.log(`STRIPE_PRICE_ID_LAUNCH=${launch.id}`)
  console.log('─────────────────────────────────────────────\n')
  console.log('✅  Done. Update .env.local and redeploy.')
}

main().catch((e) => { console.error('❌', e.message); process.exit(1) })
