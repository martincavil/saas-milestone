// Force dynamic so Next.js never prerenders this page at build time.
// The Supabase client needs real env vars and a real browser session.
export const dynamic = 'force-dynamic'

import { ResetPasswordForm } from './reset-form'

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}
