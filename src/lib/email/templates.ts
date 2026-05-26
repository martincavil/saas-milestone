const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://saas-milestone.vercel.app'

const COLORS = {
  bg: '#0a0a0a',
  surface: '#111111',
  border: '#1f1f1f',
  text: '#ffffff',
  muted: '#a1a1aa',
  accent: '#6366f1',
  accentHover: '#4f46e5',
}

function base(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
</head>
<body style="margin:0;padding:0;background:${COLORS.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${COLORS.bg};padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="560" style="max-width:560px;width:100%;background:${COLORS.surface};border:1px solid ${COLORS.border};border-radius:12px;overflow:hidden;">
        <tr><td style="padding:32px 40px;">
          <p style="margin:0 0 24px;font-size:22px;font-weight:700;color:${COLORS.text};letter-spacing:-0.3px;">MilestoneHit</p>
          ${content}
          <hr style="border:none;border-top:1px solid ${COLORS.border};margin:32px 0;" />
          <p style="margin:0;font-size:12px;color:${COLORS.muted};line-height:1.6;">You're receiving this because you have milestone notifications enabled in MilestoneHit.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function ctaButton(label: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;margin-top:24px;padding:12px 24px;background:${COLORS.accent};color:#fff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">${label}</a>`
}

function formatAmount(amount: number): string {
  if (amount >= 1000) return `$${amount / 1000}k`
  return `$${amount}`
}

function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    mrr: 'MRR',
    followers: 'followers',
    users: 'users',
    visits: 'visits',
    stars: 'stars',
    subscribers: 'subscribers',
  }
  return map[category] ?? category
}

export interface MilestoneEmailData {
  saasName: string
  amount: number
  category: 'mrr' | 'followers' | 'users' | 'visits' | 'stars' | 'subscribers'
  posted: boolean
  tweetUrl?: string
}

export function milestoneTemplate(data: MilestoneEmailData): { subject: string; html: string; text: string } {
  const formatted = formatAmount(data.amount)
  const cat = categoryLabel(data.category)
  const subject = `🎉 ${data.saasName} just hit ${formatted} ${data.category === 'mrr' ? 'MRR' : cat}!`

  const postedLine = data.posted && data.tweetUrl
    ? `<p style="margin:16px 0 0;font-size:14px;color:${COLORS.muted};">Your milestone was automatically posted on X. <a href="${data.tweetUrl}" style="color:${COLORS.accent};text-decoration:none;">View the tweet →</a></p>`
    : data.posted
    ? `<p style="margin:16px 0 0;font-size:14px;color:${COLORS.muted};">Your milestone was automatically posted on X.</p>`
    : `<p style="margin:16px 0 0;font-size:14px;color:${COLORS.muted};">Connect your X account to auto-post future milestones.</p>`

  const html = base(`
    <p style="margin:0 0 8px;font-size:28px;font-weight:800;color:${COLORS.text};">🎉 Congratulations!</p>
    <p style="margin:0 0 24px;font-size:16px;color:${COLORS.muted};line-height:1.6;"><strong style="color:${COLORS.text};">${data.saasName}</strong> just crossed a new milestone.</p>
    <div style="padding:24px;background:${COLORS.bg};border:1px solid ${COLORS.border};border-radius:10px;text-align:center;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:${COLORS.muted};letter-spacing:0.05em;text-transform:uppercase;">${cat}</p>
      <p style="margin:0;font-size:48px;font-weight:800;color:${COLORS.accent};letter-spacing:-1px;">${formatted}</p>
    </div>
    ${postedLine}
    ${ctaButton('View your dashboard', `${APP_URL}/dashboard/milestones`)}
  `)

  const text = [
    subject,
    '',
    `${data.saasName} just hit ${formatted} ${cat}!`,
    '',
    data.posted && data.tweetUrl
      ? `Your milestone was posted on X: ${data.tweetUrl}`
      : data.posted
      ? 'Your milestone was automatically posted on X.'
      : 'Connect your X account to auto-post future milestones.',
    '',
    `View your dashboard: ${APP_URL}/dashboard/milestones`,
  ].join('\n')

  return { subject, html, text }
}

export function welcomeTemplate(saasName: string): { subject: string; html: string; text: string } {
  const subject = `You're all set! MilestoneHit is watching your ${saasName}`

  const html = base(`
    <p style="margin:0 0 8px;font-size:24px;font-weight:800;color:${COLORS.text};">You're all set! 🚀</p>
    <p style="margin:0 0 24px;font-size:16px;color:${COLORS.muted};line-height:1.6;">
      MilestoneHit is now connected to <strong style="color:${COLORS.text};">${saasName}</strong> and watching your Stripe MRR.
    </p>
    <ul style="margin:0 0 8px;padding:0 0 0 20px;color:${COLORS.muted};font-size:14px;line-height:2;">
      <li>Your MRR is checked hourly for milestone crossings</li>
      <li>When you hit <strong style="color:${COLORS.text};">$1 / $10 / $50 / $100 / $500 / $1k / $5k / $10k MRR</strong>, we'll notify you</li>
      <li>Connect your X account to auto-post announcements instantly</li>
    </ul>
    ${ctaButton('View your dashboard', `${APP_URL}/dashboard`)}
  `)

  const text = [
    subject,
    '',
    `MilestoneHit is now connected to ${saasName}.`,
    '',
    '- Your MRR is checked hourly for milestone crossings',
    '- Milestones tracked: $1 / $10 / $50 / $100 / $500 / $1k / $5k / $10k MRR',
    '- Connect your X account to auto-post announcements',
    '',
    `View your dashboard: ${APP_URL}/dashboard`,
  ].join('\n')

  return { subject, html, text }
}

export function proWelcomeTemplate(): { subject: string; html: string; text: string } {
  const subject = 'Welcome to Pro — MilestoneHit'

  const html = base(`
    <p style="margin:0 0 8px;font-size:24px;font-weight:800;color:${COLORS.text};">Welcome to Pro ✨</p>
    <p style="margin:0 0 24px;font-size:16px;color:${COLORS.muted};line-height:1.6;">
      Your Pro subscription is now active. Here's what you've unlocked:
    </p>
    <ul style="margin:0 0 8px;padding:0 0 0 20px;color:${COLORS.muted};font-size:14px;line-height:2;">
      <li><strong style="color:${COLORS.text};">Unlimited milestone tracking</strong> — MRR, followers, users, and more</li>
      <li><strong style="color:${COLORS.text};">Auto-post to X</strong> — tweet milestones the moment they happen</li>
      <li><strong style="color:${COLORS.text};">Custom milestone images</strong> — branded announcement cards</li>
      <li><strong style="color:${COLORS.text};">Priority checks</strong> — your metrics run first in every cron cycle</li>
    </ul>
    ${ctaButton('Go to dashboard', `${APP_URL}/dashboard`)}
  `)

  const text = [
    subject,
    '',
    'Your Pro subscription is now active. Here\'s what you\'ve unlocked:',
    '',
    '- Unlimited milestone tracking (MRR, followers, users, and more)',
    '- Auto-post to X when milestones happen',
    '- Custom milestone images',
    '- Priority metric checks',
    '',
    `Go to dashboard: ${APP_URL}/dashboard`,
  ].join('\n')

  return { subject, html, text }
}
