"use client";

import { useEffect, useState, useCallback } from "react";
import { StatCard, HorizontalBars } from "@/components/dashboard/charts";
import { ChartsPanel } from "@/components/dashboard/charts-panel";
import {
  MILESTONE_CONFIGS,
  type MilestoneCategory,
  type MilestoneHit,
} from "@/types";
import {
  TrendingUp,
  Users,
  Globe,
  Star,
  Mail,
  Trophy,
  Zap,
  Settings2,
  X,
  RefreshCw,
} from "lucide-react";

// X icon (not in lucide as "Twitter")
function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `$${n.toFixed(0)}`;
}
function fmtNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}
function fmtDate(s: string): string {
  return new Date(s).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const WIDGET_KEYS = [
  "mrr",
  "accounts",
  "milestones",
  "categories",
  "recent",
  "social",
] as const;
type WidgetKey = (typeof WIDGET_KEYS)[number];
const WIDGET_LABELS: Record<WidgetKey, string> = {
  mrr: "MRR / ARR",
  accounts: "SaaS Breakdown",
  milestones: "Milestone Stats",
  categories: "By Category",
  recent: "Recent Activity",
  social: "Social Accounts",
};

const DEFAULT_HIDDEN = new Set<WidgetKey>();

interface Props {
  milestones: MilestoneHit[];
  twitterAccounts: { screen_name: string; twitter_user_id: string }[];
  stripeAccounts: { id: string; stripe_account_name: string }[];
}

export function OverviewClient({
  milestones,
  twitterAccounts,
  stripeAccounts,
}: Props) {
  const [mrrData, setMrrData] = useState<any>(null);
  const [mrrLoading, setMrrLoading] = useState(true);
  const [configOpen, setConfigOpen] = useState(false);
  const [hidden, setHidden] = useState<Set<WidgetKey>>(DEFAULT_HIDDEN);

  useEffect(() => {
    fetch("/api/mrr")
      .then((r) => r.json())
      .then((d) => {
        setMrrData(d);
        setMrrLoading(false);
      });
  }, []);

  const toggleWidget = (k: WidgetKey) => {
    setHidden((prev) => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });
  };

  const show = (k: WidgetKey) => !hidden.has(k);

  // Derived milestone stats
  const totalPosted = milestones.filter((m) => m.posted).length;
  const postingRate =
    milestones.length > 0
      ? Math.round((totalPosted / milestones.length) * 100)
      : 0;
  const thisMonth = milestones.filter(
    (m) => new Date(m.hit_at) > new Date(Date.now() - 30 * 24 * 3600 * 1000),
  ).length;
  const byCategory = Object.entries(
    milestones.reduce<Record<string, number>>((a, m) => {
      const c = m.category ?? "mrr";
      a[c] = (a[c] ?? 0) + 1;
      return a;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="min-h-full p-6 space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Overview
          </h1>
          <p className="text-xs text-white/35 mt-0.5">
            All your metrics in one place
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMrrLoading(true);
              fetch("/api/mrr")
                .then((r) => r.json())
                .then((d) => {
                  setMrrData(d);
                  setMrrLoading(false);
                });
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:bg-white/8 hover:text-white/70 transition-colors"
          >
            <RefreshCw size={13} />
          </button>
          <button
            onClick={() => setConfigOpen((v) => !v)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
              configOpen
                ? "border-indigo-500/40 bg-indigo-500/15 text-indigo-300"
                : "border-white/10 text-white/40 hover:bg-white/8 hover:text-white/70"
            }`}
          >
            <Settings2 size={13} />
            Customize
          </button>
        </div>
      </div>

      {/* Widget config panel */}
      {configOpen && (
        <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
          <p className="text-xs font-semibold text-white/60 mb-3">
            Show / hide widgets
          </p>
          <div className="flex flex-wrap gap-2">
            {WIDGET_KEYS.map((k) => (
              <button
                key={k}
                onClick={() => toggleWidget(k)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                  hidden.has(k)
                    ? "border-white/10 bg-white/3 text-white/30"
                    : "border-indigo-500/30 bg-indigo-500/12 text-indigo-300"
                }`}
              >
                {hidden.has(k) ? "+ " : "✓ "}
                {WIDGET_LABELS[k]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── MRR / ARR ── */}
      {show("mrr") && (
        <section>
          <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3">
            Revenue
          </p>
          {mrrLoading ? (
            <div className="rounded-2xl border border-white/8 bg-white/4 p-5 text-xs text-white/30">
              Loading…
            </div>
          ) : mrrData?.connected ? (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard
                label="Total MRR"
                value={fmt(mrrData.totalMRR)}
                sub={`${stripeAccounts.length} account${stripeAccounts.length !== 1 ? "s" : ""}`}
                color="#6366f1"
                sparkData={[
                  mrrData.totalMRR * 0.3,
                  mrrData.totalMRR * 0.5,
                  mrrData.totalMRR * 0.65,
                  mrrData.totalMRR * 0.8,
                  mrrData.totalMRR * 0.9,
                  mrrData.totalMRR,
                ]}
              />
              <StatCard
                label="ARR"
                value={fmt(mrrData.totalARR)}
                sub="Annualized"
                color="#8b5cf6"
              />
              <StatCard
                label="Subscribers"
                value={fmtNum(mrrData.totalSubscribers ?? 0)}
                sub="Active subscriptions"
                color="#06b6d4"
              />
              <StatCard
                label="Avg / subscriber"
                value={
                  mrrData.totalSubscribers > 0
                    ? fmt(
                        Math.round(mrrData.totalMRR / mrrData.totalSubscribers),
                      )
                    : "—"
                }
                sub="MRR per user"
                color="#10b981"
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/12 p-8 text-center">
              <p className="text-sm text-white/35">
                Connect Stripe in the Connectors tab.
              </p>
            </div>
          )}
        </section>
      )}

      {/* ── Interactive charts ── */}
      {show("mrr") && mrrData?.connected && (
        <section>
          <ChartsPanel
            accounts={mrrData.accounts ?? []}
            totalMRR={mrrData.totalMRR ?? 0}
            milestones={milestones}
          />
        </section>
      )}

      {/* ── SaaS Breakdown ── */}
      {show("accounts") && mrrData?.accounts?.length > 0 && (
        <section>
          <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3">
            SaaS breakdown
          </p>
          <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
            <HorizontalBars
              data={mrrData.accounts.map((a: any) => ({
                label: a.name,
                value: a.mrr,
                color: "linear-gradient(90deg, #6366f1, #8b5cf6)",
              }))}
              formatValue={fmt}
            />
            {mrrData.accounts.length > 1 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {mrrData.accounts.map((a: any) => (
                  <div
                    key={a.id}
                    className="rounded-xl border border-white/8 bg-white/3 px-3 py-2"
                  >
                    <p className="text-xs text-white/45 truncate">{a.name}</p>
                    <p
                      className="text-sm font-bold text-white"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      {fmt(a.mrr)}
                    </p>
                    <p className="text-xs text-white/30">
                      {mrrData.totalMRR > 0
                        ? Math.round((a.mrr / mrrData.totalMRR) * 100)
                        : 0}
                      % of total
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Milestone stats ── */}
      {show("milestones") && (
        <section>
          <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3">
            Milestones
          </p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              label="Total hit"
              value={milestones.length.toString()}
              sub="All time"
              color="#f59e0b"
            />
            <StatCard
              label="This month"
              value={thisMonth.toString()}
              sub="Last 30 days"
              color="#f59e0b"
            />
            <StatCard
              label="Auto-posted"
              value={totalPosted.toString()}
              sub="Posted to X"
              color="#0ea5e9"
            />
            <StatCard
              label="Posting rate"
              value={`${postingRate}%`}
              sub={`${totalPosted}/${milestones.length}`}
              color="#10b981"
            />
          </div>
        </section>
      )}

      {/* ── By category ── */}
      {show("categories") && byCategory.length > 0 && (
        <section>
          <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3">
            By category
          </p>
          <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
            <HorizontalBars
              data={byCategory.map(([cat, count]) => {
                const config = MILESTONE_CONFIGS[cat as MilestoneCategory];
                const colorMap: Record<string, string> = {
                  mrr: "linear-gradient(90deg,#6366f1,#8b5cf6)",
                  followers: "linear-gradient(90deg,#0ea5e9,#38bdf8)",
                  users: "linear-gradient(90deg,#8b5cf6,#a78bfa)",
                  visits: "linear-gradient(90deg,#10b981,#34d399)",
                  stars: "linear-gradient(90deg,#f59e0b,#fcd34d)",
                  subscribers: "linear-gradient(90deg,#f43f5e,#fb7185)",
                };
                return {
                  label: config?.label ?? cat,
                  value: count,
                  color: colorMap[cat],
                };
              })}
            />
          </div>
        </section>
      )}

      {/* ── Social accounts ── */}
      {show("social") && (
        <section>
          <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3">
            Connected social accounts
          </p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {/* X accounts */}
            {twitterAccounts.length > 0 ? (
              twitterAccounts.map((acc) => (
                <div
                  key={acc.twitter_user_id}
                  className="rounded-2xl border border-sky-500/20 bg-sky-500/8 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/20 text-sky-400">
                      <XIcon size={13} />
                    </div>
                    <p className="text-xs font-semibold text-sky-300">
                      X (Twitter)
                    </p>
                  </div>
                  <p className="text-sm font-bold text-white">
                    @{acc.screen_name}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5">
                    Auto-posts enabled
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 p-4 text-xs text-white/25 col-span-1">
                No X account — connect in Connectors
              </div>
            )}

            {/* Reddit placeholder */}
            <div className="rounded-2xl border border-dashed border-white/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/15">
                  <span className="text-xs font-bold text-orange-400">R</span>
                </div>
                <p className="text-xs font-semibold text-white/30">Reddit</p>
              </div>
              <p className="text-xs text-white/20">Coming soon</p>
            </div>

            {/* Substack placeholder */}
            <div className="rounded-2xl border border-dashed border-white/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/15">
                  <span className="text-xs font-bold text-amber-400">S</span>
                </div>
                <p className="text-xs font-semibold text-white/30">Substack</p>
              </div>
              <p className="text-xs text-white/20">Coming soon</p>
            </div>
          </div>
        </section>
      )}

      {/* ── Recent activity ── */}
      {show("recent") && milestones.length > 0 && (
        <section>
          <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3">
            Recent activity
          </p>
          <div className="rounded-2xl border border-white/8 bg-white/4 overflow-hidden">
            {milestones.slice(0, 8).map((m, i) => {
              const cat = (m.category ?? "mrr") as MilestoneCategory;
              const config = MILESTONE_CONFIGS[cat];
              const label = config
                ? `${config.formatValue(m.amount)} ${config.label}`
                : `$${m.amount}`;
              const catColors: Record<MilestoneCategory, string> = {
                mrr: "text-indigo-400",
                followers: "text-sky-400",
                users: "text-violet-400",
                visits: "text-emerald-400",
                stars: "text-amber-400",
                subscribers: "text-rose-400",
              };
              return (
                <div
                  key={m.id}
                  className={`flex items-center gap-3 px-4 py-3 ${i < milestones.slice(0, 8).length - 1 ? "border-b border-white/6" : ""}`}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/6">
                    <Trophy
                      size={12}
                      className={catColors[cat] ?? "text-white/40"}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="text-xs text-white/30">{fmtDate(m.hit_at)}</p>
                  </div>
                  {m.posted ? (
                    <span className="flex items-center gap-1 rounded-full border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-xs text-sky-400">
                      <XIcon size={9} /> Posted
                    </span>
                  ) : (
                    <span className="text-xs text-white/20">Not posted</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {milestones.length === 0 && !mrrLoading && (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
          <Zap size={24} className="text-white/20 mx-auto mb-3" />
          <p className="text-sm text-white/35">
            No milestones yet. Connect Stripe to start tracking.
          </p>
        </div>
      )}
    </div>
  );
}
