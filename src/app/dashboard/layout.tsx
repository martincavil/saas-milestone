import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/sidebar'
import { MobileSidebarWrapper } from '@/components/dashboard/mobile-sidebar'

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
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a] font-nunito">
      {/* Sidebar — hidden on mobile, visible md+ */}
      <div className="hidden md:block">
        <Sidebar email={user.email!} isSubscribed={isSubscribed} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <MobileSidebarWrapper email={user.email!} isSubscribed={isSubscribed} />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
