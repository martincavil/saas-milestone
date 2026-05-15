import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MilestoneFeed } from '@/components/dashboard/milestone-feed'
import { MILESTONE_CONFIGS, type MilestoneCategory } from '@/types'
import { Check } from 'lucide-react'

export default async function MilestonesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const service = await createServiceClient()
  const { data: milestones } = await service
    .from('milestones_hit')
    .select('*')
    .eq('user_id', user.id)
    .order('hit_at', { ascending: false })

  const all = milestones ?? []
  const posted = all.filter(m => m.posted).length

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white font-poppins">Milestones</h1>
        <p className="text-xs text-white/35 mt-0.5">Every threshold you've ever crossed</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total hit', value: all.length },
          { label: 'Auto-posted', value: posted },
          { label: 'Not posted', value: all.length - posted },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-white/8 bg-white/4 p-4 text-center">
            <p className="text-2xl font-extrabold text-white font-poppins">{s.value}</p>
            <p className="text-xs text-white/35 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Roadmap per category */}
      <div className="space-y-4">
        <p className="text-xs font-medium text-white/35 uppercase tracking-wider">Roadmap</p>
        {(['mrr', 'followers', 'users', 'visits', 'stars', 'subscribers'] as MilestoneCategory[]).map(cat => {
          const config = MILESTONE_CONFIGS[cat]
          const hitForCat = new Set(all.filter(m => (m.category ?? 'mrr') === cat).map(m => m.amount))
          if (hitForCat.size === 0) return null
          return (
            <div key={cat} className="rounded-xl border border-white/8 bg-white/4 p-4">
              <p className="text-xs font-semibold text-white/50 mb-3">{config.label}</p>
              <div className="flex flex-wrap gap-2">
                {config.thresholds.map(t => {
                  const hit = hitForCat.has(t)
                  return (
                    <div
                      key={t}
                      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                        hit ? 'border-indigo-500/40 bg-indigo-500/12 text-indigo-300' : 'border-white/8 bg-white/3 text-white/25'
                      }`}
                    >
                      {hit && <Check size={10} strokeWidth={2.5} />}
                      {config.formatValue(t)}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Full feed */}
      <div>
        <p className="text-xs font-medium text-white/35 uppercase tracking-wider mb-3">History</p>
        <MilestoneFeed milestones={all} />
      </div>
    </div>
  )
}
