"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Users,
  Globe,
  Star,
  Mail,
  Send,
  Loader2,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Lock,
} from "lucide-react";
import {
  MILESTONE_CONFIGS,
  CATEGORIES_ORDER,
  type MilestoneCategory,
} from "@/types";

// X icon
function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const CATEGORY_ICONS: Record<MilestoneCategory, React.ReactNode> = {
  mrr: <TrendingUp size={15} />,
  followers: <XIcon size={14} />,
  users: <Users size={15} />,
  visits: <Globe size={15} />,
  stars: <Star size={15} />,
  subscribers: <Mail size={15} />,
};

const CATEGORY_COLORS: Record<
  MilestoneCategory,
  { bg: string; text: string; border: string }
> = {
  mrr: {
    bg: "rgba(99,102,241,0.15)",
    text: "#a5b4fc",
    border: "rgba(99,102,241,0.3)",
  },
  followers: {
    bg: "rgba(14,165,233,0.15)",
    text: "#7dd3fc",
    border: "rgba(14,165,233,0.3)",
  },
  users: {
    bg: "rgba(139,92,246,0.15)",
    text: "#c4b5fd",
    border: "rgba(139,92,246,0.3)",
  },
  visits: {
    bg: "rgba(16,185,129,0.15)",
    text: "#6ee7b7",
    border: "rgba(16,185,129,0.3)",
  },
  stars: {
    bg: "rgba(245,158,11,0.15)",
    text: "#fcd34d",
    border: "rgba(245,158,11,0.3)",
  },
  subscribers: {
    bg: "rgba(244,63,94,0.15)",
    text: "#fda4af",
    border: "rgba(244,63,94,0.3)",
  },
};

interface ManualPostProps {
  isSubscribed: boolean;
  saasName: string;
  currentMRR?: number;
  twitterConnected: boolean;
}

export function ManualPost({
  isSubscribed,
  saasName,
  currentMRR,
  twitterConnected,
}: ManualPostProps) {
  const [category, setCategory] = useState<MilestoneCategory>("mrr");
  const [rawValue, setRawValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ tweetUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const config = MILESTONE_CONFIGS[category];
  const parsed = parseInt(rawValue.replace(/[^0-9]/g, ""), 10) || 0;
  // Find the highest threshold the user has crossed
  const milestone =
    [...config.thresholds].reverse().find((t) => parsed >= t) ?? null;

  async function handlePost() {
    if (!milestone) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/milestones/manual-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, milestone, currentValue: parsed, saasName }),
      });

      // Always parse JSON — api-helpers now guarantees a JSON response
      const data = await res.json().catch(() => ({ error: `Server error (HTTP ${res.status})` }));

      if (!res.ok) {
        setError(data.error ?? "Post failed — check server logs.");
        return;
      }

      setResult({ tweetUrl: data.tweetUrl });
      // Don't router.refresh() — it triggers the loading skeleton which looks like a loop
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error — is the server running?");
    } finally {
      setLoading(false);
    }
  }

  // ── Locked state (free tier) ──────────────────────────────────────────────
  if (!isSubscribed) {
    return (
      <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15">
            <Lock size={15} className="text-amber-400" />
          </div>
          <div className="flex-1">
            <p
              className="text-sm font-semibold text-white"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Manual posting — Pro only
            </p>
            <p className="text-xs text-white/40 mt-1">
              Choose any metric, pick a milestone, post to X instantly.
              Available when you upgrade to Pro ($9/mo).
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── No Twitter connected ──────────────────────────────────────────────────
  if (!twitterConnected) {
    return (
      <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/15">
            <XIcon size={15} />
          </div>
          <div>
            <p
              className="text-sm font-semibold text-white"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Connect X to post manually
            </p>
            <p className="text-xs text-white/40 mt-1">
              Connect your X account above first.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const colors = CATEGORY_COLORS[category];

  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-5 space-y-5">
      <div>
        <p
          className="text-sm font-semibold text-white"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Post a milestone manually
        </p>
        <p className="text-xs text-white/40 mt-0.5">
          Choose any metric, enter your current value, post the card.
        </p>
      </div>

      {/* ── Category picker ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2">
        {CATEGORIES_ORDER.map((cat) => {
          const cfg = MILESTONE_CONFIGS[cat];
          const active = cat === category;
          const c = CATEGORY_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setRawValue("");
                setError(null);
                setResult(null);
              }}
              className="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all"
              style={{
                borderColor: active ? c.border : "rgba(255,255,255,0.08)",
                background: active ? c.bg : "rgba(255,255,255,0.03)",
                color: active ? c.text : "rgba(255,255,255,0.4)",
              }}
            >
              <span style={{ color: c.text, opacity: active ? 1 : 0.5 }}>
                {CATEGORY_ICONS[cat]}
              </span>
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* ── Value input ───────────────────────────────────────────────────── */}
      <div>
        <label className="mb-1.5 block text-xs text-white/45">
          Your current {config.description.toLowerCase()}
        </label>
        <div className="relative">
          {config.unit && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-white/40">
              {config.unit}
            </span>
          )}
          <input
            type="text"
            inputMode="numeric"
            value={rawValue}
            onChange={(e) => {
              setRawValue(e.target.value);
              setError(null);
              setResult(null);
            }}
            placeholder={config.thresholds[
              Math.floor(config.thresholds.length / 2)
            ].toString()}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm text-white placeholder-white/20 focus:border-white/25 focus:outline-none transition-colors"
            style={{
              paddingLeft: config.unit ? "28px" : "14px",
              paddingRight: "14px",
            }}
          />
        </div>
      </div>

      {/* ── Milestone detected ────────────────────────────────────────────── */}
      {parsed > 0 && (
        <div
          className="rounded-xl border p-3.5 transition-all"
          style={{
            borderColor: milestone ? colors.border : "rgba(255,255,255,0.08)",
            background: milestone ? colors.bg : "rgba(255,255,255,0.03)",
          }}
        >
          {milestone ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40 mb-0.5">
                  Milestone to post
                </p>
                <p
                  className="text-lg font-extrabold"
                  style={{
                    color: colors.text,
                    fontFamily: "var(--font-poppins)",
                  }}
                >
                  {config.formatValue(milestone)}
                  <span className="text-sm font-medium text-white/40 ml-1">
                    {config.suffix}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/30">You're at</p>
                <p className="text-sm font-semibold text-white/60">
                  {config.unit}
                  {parsed.toLocaleString()}
                  {config.suffix}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-white/35">
              No milestone threshold reached yet. First threshold: {config.unit}
              {config.thresholds[0]}
              {config.suffix}
            </p>
          )}
        </div>
      )}

      {/* ── Error / success ───────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-xs text-red-400">
          <AlertCircle size={13} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {result && (
        <div className="flex items-center justify-between rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-green-400 font-medium">
            <CheckCircle2 size={15} />
            Posted to X!
          </div>
          <a
            href={result.tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors"
          >
            View tweet
            <ExternalLink size={11} />
          </a>
        </div>
      )}

      {/* ── Post button ───────────────────────────────────────────────────── */}
      <button
        onClick={handlePost}
        disabled={!milestone || loading || !!result}
        className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40"
        style={{
          background: milestone
            ? `linear-gradient(135deg, ${colors.bg}, rgba(255,255,255,0.06))`
            : "rgba(255,255,255,0.04)",
          border: `1px solid ${milestone ? colors.border : "rgba(255,255,255,0.08)"}`,
          color: milestone ? colors.text : "rgba(255,255,255,0.3)",
        }}
      >
        {loading ? (
          <Loader2 size={15} className="animate-spin" />
        ) : result ? (
          <CheckCircle2 size={15} />
        ) : (
          <Send size={15} />
        )}
        {loading ? "Generating & posting…" : result ? "Posted!" : "Post to X"}
      </button>

      {/* Thresholds hint */}
      {!milestone && parsed === 0 && (
        <div className="flex flex-wrap gap-1.5">
          {config.thresholds.slice(0, 5).map((t) => (
            <button
              key={t}
              onClick={() => setRawValue(t.toString())}
              className="rounded-full border border-white/8 bg-white/4 px-2.5 py-1 text-xs text-white/35 hover:border-white/15 hover:text-white/60 transition-colors"
            >
              {config.unit}
              {t >= 1000 ? `${t / 1000}k` : t}
              {config.suffix}
            </button>
          ))}
          <span className="px-1 text-xs text-white/20 self-center">
            ← click to fill
          </span>
        </div>
      )}
    </div>
  );
}
