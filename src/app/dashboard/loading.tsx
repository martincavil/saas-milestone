export default function DashboardLoading() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Top progress bar */}
      <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500"
          style={{ animationName: "loading-bar", animationDuration: "1.4s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite" }}
        />
      </div>

      <div className="p-6 space-y-6 animate-pulse">
        {/* Page header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 w-28 rounded-lg bg-white/8" />
            <div className="h-3 w-44 rounded-md bg-white/5" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded-lg bg-white/6" />
            <div className="h-8 w-24 rounded-lg bg-white/6" />
          </div>
        </div>

        {/* Big stat cards row */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/8 bg-white/4 p-4 space-y-3">
              <div className="h-3 w-20 rounded bg-white/8" />
              <div className="h-7 w-24 rounded-lg bg-white/10" />
              <div className="h-2.5 w-32 rounded bg-white/6" />
              {/* Sparkline placeholder */}
              <div className="h-7 w-full rounded bg-white/5" />
            </div>
          ))}
        </div>

        {/* Section label */}
        <div className="h-3 w-24 rounded bg-white/8" />

        {/* Wide card */}
        <div className="rounded-2xl border border-white/8 bg-white/4 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3 w-28 rounded bg-white/8" />
            <div className="h-3 w-16 rounded bg-white/6" />
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="h-2.5 rounded bg-white/6 w-[60px]" />
                <div className="h-2.5 w-10 rounded bg-white/6" />
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/6">
                <div className="h-full rounded-full bg-white/12" />
              </div>
            </div>
          ))}
        </div>

        {/* Section label */}
        <div className="h-3 w-32 rounded bg-white/8" />

        {/* List cards */}
        <div className="rounded-2xl border border-white/8 bg-white/4 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 px-4 py-3 ${i < 4 ? 'border-b border-white/6' : ''}`}
            >
              <div className="h-9 w-9 rounded-full bg-white/8 flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-32 rounded bg-white/8" />
                <div className="h-2.5 w-20 rounded bg-white/5" />
              </div>
              <div className="h-6 w-16 rounded-full bg-white/6" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
