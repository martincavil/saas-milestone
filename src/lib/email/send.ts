import { Resend } from 'resend'
import {
  milestoneTemplate,
  welcomeTemplate,
  proWelcomeTemplate,
  type MilestoneEmailData,
} from './templates'

export type { MilestoneEmailData }

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

const FROM = 'MilestoneHit <hello@milestonehit.com>'

export async function sendMilestoneEmail(to: string, data: MilestoneEmailData): Promise<void> {
  const { subject, html, text } = milestoneTemplate(data)
  await getResend().emails.send({ from: FROM, to, subject, html, text })
}

export async function sendWelcomeEmail(to: string, saasName: string): Promise<void> {
  const { subject, html, text } = welcomeTemplate(saasName)
  await getResend().emails.send({ from: FROM, to, subject, html, text })
}

export async function sendProWelcomeEmail(to: string): Promise<void> {
  const { subject, html, text } = proWelcomeTemplate()
  await getResend().emails.send({ from: FROM, to, subject, html, text })
}
