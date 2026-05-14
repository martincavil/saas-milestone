import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const service = await createServiceClient()
  const { data: sub } = await service
    .from('user_subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .single()

  const isSubscribed = sub?.status === 'active'

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-[#0a0a0a] transition-colors duration-200" style={{ fontFamily: 'var(--font-nunito)' }}>
      <Sidebar email={user.email!} isSubscribed={isSubscribed} />
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-200">
        {children}
      </main>
    </div>
  )
}
