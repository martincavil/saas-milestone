import Link from 'next/link'
import { Lock, Zap } from 'lucide-react'

export function ProGate({ feature = 'This feature' }: { feature?: string }) {
  return (
    <div className="flex flex-1 items-center justify-center p-12">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <Lock size={22} className="text-white/40" />
        </div>
        <h2 className="mb-2 text-lg font-bold text-white font-poppins">
          {feature} — Pro only
        </h2>
        <p className="mb-6 text-sm text-white/45 leading-relaxed">
          Upgrade to Pro to unlock the full analytics dashboard, manual posting, and multi-account overview.
        </p>
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          <Zap size={14} fill="white" />
          Upgrade to Pro — $9/mo
        </Link>
        <p className="mt-3 text-xs text-white/25">Free until $100 MRR. No credit card needed to try.</p>
      </div>
    </div>
  )
}
