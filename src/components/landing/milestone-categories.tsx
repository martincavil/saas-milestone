"use client";

import { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  Users,
  Globe,
  Star,
  Mail,
  Check,
  Pause,
  Play,
} from "lucide-react";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

function XIcon({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// ─── Per-category data ────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    key: "mrr",
    label: "MRR",
    description: "Monthly Recurring Revenue from Stripe",
    sourceAuto: true,
    icon: <TrendingUp size={18} />,
    color: {
      bg: "#eef2ff",
      text: "#4f46e5",
      border: "#c7d2fe",
      dot: "#6366f1",
      glow: "rgba(99,102,241,0.2)",
    },
    thresholds: ["$1", "$10", "$50", "$100", "$500", "$1k", "$5k", "$10k"],
    // Card data
    milestone: "$1k",
    milestoneRaw: 1000,
    milestoneLabel: "Monthly Recurring Revenue",
    prevValue: 120,
    chartData: [120, 240, 380, 560, 720, 890, 1000],
    chartLabels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    nextMilestone: "$5k",
    progressPct: 20,
    subStats: [
      { label: "12 active subscriptions", value: "" },
      { label: "Avg", value: "$83/mo per user" },
    ],
    tweetText:
      "Just crossed $1k MRR 🎯\n\nTook 8 months of building in public. Onwards to $5k.\n\n#buildinpublic #saas",
  },
  {
    key: "followers",
    label: "X Followers",
    description: "Twitter/X follower count",
    sourceAuto: true,
    icon: <XIcon size={18} />,
    color: {
      bg: "#f0f9ff",
      text: "#0284c7",
      border: "#bae6fd",
      dot: "#0ea5e9",
      glow: "rgba(14,165,233,0.2)",
    },
    thresholds: ["100", "500", "1k", "2k", "5k", "10k", "25k", "100k"],
    milestone: "2k",
    milestoneRaw: 2000,
    milestoneLabel: "X (Twitter) Followers",
    prevValue: 400,
    chartData: [400, 620, 880, 1100, 1450, 1780, 2000],
    chartLabels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    nextMilestone: "5k",
    progressPct: 40,
    subStats: [
      { label: "Avg engagement rate", value: "4.2%" },
      { label: "Posts per week", value: "5" },
    ],
    tweetText:
      "Just hit 2,000 followers on X 🙌\n\nHonestly wasn't focusing on it — just building in public and sharing progress.\n\n#buildinpublic",
  },
  {
    key: "users",
    label: "Users",
    description: "Registered users from Stripe",
    sourceAuto: true,
    icon: <Users size={18} />,
    color: {
      bg: "#f5f3ff",
      text: "#7c3aed",
      border: "#ddd6fe",
      dot: "#8b5cf6",
      glow: "rgba(139,92,246,0.2)",
    },
    thresholds: ["1", "10", "50", "100", "500", "1k", "5k", "10k"],
    milestone: "100",
    milestoneRaw: 100,
    milestoneLabel: "Registered Users",
    prevValue: 12,
    chartData: [12, 24, 41, 58, 74, 89, 100],
    chartLabels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    nextMilestone: "500",
    progressPct: 20,
    subStats: [
      { label: "Activation rate", value: "68%" },
      { label: "Churn", value: "4.2%/mo" },
    ],
    tweetText:
      "100 users signed up for my SaaS 🚀\n\nStarted with 0 in March. Slow and steady.\n\n#buildinpublic #indiemaker",
  },
  {
    key: "visits",
    label: "Monthly Visits",
    description: "Website monthly page views",
    sourceAuto: false,
    icon: <Globe size={18} />,
    color: {
      bg: "#ecfdf5",
      text: "#059669",
      border: "#a7f3d0",
      dot: "#10b981",
      glow: "rgba(16,185,129,0.2)",
    },
    thresholds: ["100", "500", "1k", "5k", "10k", "50k", "100k"],
    milestone: "10k",
    milestoneRaw: 10000,
    milestoneLabel: "Monthly Page Views",
    prevValue: 1200,
    chartData: [1200, 2400, 3900, 5600, 7200, 9100, 10000],
    chartLabels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    nextMilestone: "50k",
    progressPct: 20,
    subStats: [
      { label: "Bounce rate", value: "42%" },
      { label: "Avg session", value: "2m 14s" },
    ],
    tweetText:
      "10k monthly visitors to my SaaS landing page 📈\n\nAll organic — mostly SEO + #buildinpublic posts.\n\nJourney to 50k starts now.",
  },
  {
    key: "stars",
    label: "GitHub Stars",
    description: "GitHub repository stars",
    sourceAuto: false,
    icon: <Star size={18} />,
    color: {
      bg: "#fffbeb",
      text: "#d97706",
      border: "#fde68a",
      dot: "#f59e0b",
      glow: "rgba(245,158,11,0.2)",
    },
    thresholds: ["10", "50", "100", "500", "1k", "5k"],
    milestone: "500",
    milestoneRaw: 500,
    milestoneLabel: "GitHub Stars",
    prevValue: 80,
    chartData: [80, 120, 180, 260, 360, 450, 500],
    chartLabels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    nextMilestone: "1k",
    progressPct: 50,
    subStats: [
      { label: "Forks", value: "94" },
      { label: "Contributors", value: "12" },
    ],
    tweetText:
      "500 ⭐ on GitHub!\n\nStarted as a personal tool. Now 12 contributors and growing.\n\n#opensource #buildinpublic",
  },
  {
    key: "subscribers",
    label: "Email List",
    description: "Email subscribers",
    sourceAuto: false,
    icon: <Mail size={18} />,
    color: {
      bg: "#fff1f2",
      text: "#be185d",
      border: "#fecdd3",
      dot: "#f43f5e",
      glow: "rgba(244,63,94,0.2)",
    },
    thresholds: ["100", "500", "1k", "5k", "10k", "50k"],
    milestone: "1k",
    milestoneRaw: 1000,
    milestoneLabel: "Email Subscribers",
    prevValue: 180,
    chartData: [180, 310, 460, 620, 780, 920, 1000],
    chartLabels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    nextMilestone: "5k",
    progressPct: 20,
    subStats: [
      { label: "Open rate", value: "38%" },
      { label: "Click rate", value: "6.4%" },
    ],
    tweetText:
      "1,000 people on my email list ✉️\n\nTook 14 months. Every single one joined because of content I shared publicly.\n\n#buildinpublic",
  },
];

const CYCLE_INTERVAL = 3200;

// ─── Mini bar chart ───────────────────────────────────────────────────────────

function MiniBarChart({
  data,
  labels,
  color,
  prevOpacity = 0.25,
}: {
  data: number[];
  labels: string[];
  color: string;
  prevOpacity?: number;
}) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-20">
      {data.map((v, i) => {
        const isLast = i === data.length - 1;
        const pct = max > 0 ? (v / max) * 100 : 0;
        return (
          <div
            key={i}
            className="flex flex-1 flex-col items-center gap-1 justify-end"
          >
            <div
              className="w-full rounded-sm transition-all duration-500"
              style={{
                height: `${Math.max(pct, 4)}%`,
                background: isLast
                  ? color
                  : `${color}${Math.round(prevOpacity * 255)
                      .toString(16)
                      .padStart(2, "0")}`,
              }}
            />
            <span
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.2)", fontSize: "9px" }}
            >
              {labels[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MilestoneCategoriesSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-cycle with fade transition
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActiveIdx((i) => (i + 1) % CATEGORIES.length);
        setVisible(true);
      }, 280);
    }, CYCLE_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  function selectCategory(idx: number) {
    if (timerRef.current) clearInterval(timerRef.current);
    setVisible(false);
    setTimeout(() => {
      setActiveIdx(idx);
      setVisible(true);
      setPaused(true);
    }, 180);
  }

  function togglePause() {
    setPaused((v) => !v);
  }

  const cat = CATEGORIES[activeIdx];

  return (
    <section className="border-t border-gray-100 p-8 md:py-16">
      <div className="mx-auto max-w-5xl px-5">
        <ScrollReveal className="mb-14">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
            6 milestone types
          </p>
          <h2
            className="text-4xl font-bold text-gray-900 max-w-xl font-poppins"
          >
            Not just revenue.
            <br />
            Every founder win counts.
          </h2>
          <p className="mt-4 text-gray-500 max-w-lg">
            From your first dollar to 100k followers — every number that matters
            to a founder gets tracked and celebrated automatically.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            {/* ── Left: category list ── */}
            <div className="space-y-2">
              {/* Pause/play control */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-400">
                  Click to explore each type
                </p>
                <button
                  onClick={togglePause}
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors shadow-sm"
                >
                  {paused ? <Play size={10} /> : <Pause size={10} />}
                  {paused ? "Resume" : "Pause"}
                </button>
              </div>

              {CATEGORIES.map((c, idx) => {
                const active = idx === activeIdx;
                return (
                  <button
                    key={c.key}
                    onClick={() => selectCategory(idx)}
                    className="group w-full text-left rounded-2xl border p-4 transition-all duration-300"
                    style={{
                      borderColor: active ? c.color.border : "#e5e7eb",
                      background: active ? c.color.bg : "#fff",
                      boxShadow: active ? `0 4px 20px ${c.color.glow}` : "none",
                      transform: active ? "translateX(4px)" : "translateX(0)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Auto-play progress bar */}
                      <div className="relative shrink-0">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                          style={{
                            background: active ? c.color.bg : "#f9fafb",
                            border: `1px solid ${active ? c.color.border : "#e5e7eb"}`,
                            color: c.color.text,
                          }}
                        >
                          {c.icon}
                        </div>
                        {active && !paused && (
                          <svg
                            className="absolute inset-0 -rotate-90"
                            width="36"
                            height="36"
                          >
                            <circle
                              cx="18"
                              cy="18"
                              r="16"
                              fill="none"
                              stroke={c.color.dot}
                              strokeWidth="2"
                              strokeOpacity="0.3"
                            />
                            <circle
                              cx="18"
                              cy="18"
                              r="16"
                              fill="none"
                              stroke={c.color.dot}
                              strokeWidth="2"
                              strokeDasharray={`${2 * Math.PI * 16}`}
                              strokeDashoffset={`${2 * Math.PI * 16}`}
                              style={{
                                animation: `spin-progress ${CYCLE_INTERVAL}ms linear forwards`,
                              }}
                            />
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-gray-900">
                            {c.label}
                          </p>
                          <span
                            className="rounded-full px-2 py-0.5 text-xs font-medium"
                            style={{
                              background: c.sourceAuto ? "#ecfdf5" : "#f9fafb",
                              color: c.sourceAuto ? "#059669" : "#9ca3af",
                            }}
                          >
                            {c.sourceAuto ? "⚡ Auto" : "✎ Manual"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {c.description}
                        </p>
                      </div>

                      {/* Thresholds preview */}
                      {active && (
                        <div className="hidden sm:flex items-center gap-1 shrink-0">
                          {c.thresholds.slice(0, 4).map((t) => (
                            <span
                              key={t}
                              className="rounded-full px-2 py-0.5 text-xs font-medium"
                              style={{
                                background: c.color.bg,
                                color: c.color.text,
                                border: `1px solid ${c.color.border}`,
                              }}
                            >
                              {t}
                            </span>
                          ))}
                          {c.thresholds.length > 4 && (
                            <span className="text-xs text-gray-400">
                              +{c.thresholds.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── Right: animated card preview ── */}
            <div
              className="flex flex-col gap-3 transition-all duration-300"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
              }}
            >
              {/* Dashboard card */}
              <div
                className="overflow-hidden rounded-2xl bg-[#0a0a0a] shadow-2xl"
                style={{
                  boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${cat.color.dot}33`,
                }}
              >
                <div
                  className="h-px"
                  style={{
                    background: `linear-gradient(90deg, ${cat.color.dot}, transparent)`,
                  }}
                />
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-white/30 uppercase tracking-widest">
                        My SaaS
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs"
                      style={{
                        borderColor: `${cat.color.dot}40`,
                        background: `${cat.color.dot}18`,
                        color: cat.color.text,
                      }}
                    >
                      <div
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: cat.color.dot }}
                      />
                      Milestone Reached
                    </div>
                  </div>

                  {/* Big number */}
                  <p className="text-xs text-white/30 mb-1">
                    {cat.milestoneLabel}
                  </p>
                  <p
                    className="font-extrabold tracking-tight text-white leading-none mb-1"
                    style={{
                      fontFamily: "var(--font-poppins)",
                      fontSize: "3.5rem",
                    }}
                  >
                    {cat.milestone}
                  </p>
                  <p className="text-xs text-white/30 mb-4">
                    Next: {cat.nextMilestone} · {cat.progressPct}% there
                  </p>

                  {/* Progress */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8 mb-4">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${cat.progressPct}%`,
                        background: `linear-gradient(90deg, ${cat.color.dot}, ${cat.color.dot}99)`,
                      }}
                    />
                  </div>

                  {/* Chart */}
                  <MiniBarChart
                    data={cat.chartData}
                    labels={cat.chartLabels}
                    color={cat.color.dot}
                  />

                  {/* Sub-stats */}
                  <div className="mt-3 flex gap-4">
                    {cat.subStats.map((s) => (
                      <div key={s.label}>
                        <p className="text-xs text-white/25">{s.label}</p>
                        {s.value && (
                          <p className="text-xs font-semibold text-white/55">
                            {s.value}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tweet preview */}
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center text-xs font-bold text-white font-poppins"
                    >
                      M
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">
                        My SaaS
                      </p>
                      <p className="text-xs text-gray-400">
                        @mysaas · just now
                      </p>
                    </div>
                  </div>
                  <XIcon size={14} className="text-gray-300" />
                </div>
                <p className="text-xs leading-relaxed text-gray-700 whitespace-pre-line">
                  {cat.tweetText}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-green-600 font-medium">
                  <Check size={12} strokeWidth={2.5} />
                  Auto-posted by saas-milestone
                </div>
              </div>

              {/* Thresholds */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium text-gray-500 mb-2">
                  {cat.thresholds.length} milestones to unlock
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.thresholds.map((t, i) => (
                    <span
                      key={t}
                      className="rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{
                        background: i < 2 ? cat.color.bg : "#fff",
                        color: i < 2 ? cat.color.text : "#9ca3af",
                        border: `1px solid ${i < 2 ? cat.color.border : "#e5e7eb"}`,
                      }}
                    >
                      {i < 2 && <span className="mr-0.5">✓</span>}
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* CSS for progress ring */}
      <style>{`
        @keyframes spin-progress {
          from { stroke-dashoffset: ${2 * Math.PI * 16}px; }
          to   { stroke-dashoffset: 0px; }
        }
      `}</style>
    </section>
  );
}
