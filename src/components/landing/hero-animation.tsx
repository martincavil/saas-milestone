"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Check, Loader2, Zap, Bell } from "lucide-react";
import { XIcon } from "@/components/ui/x-icon";
import { fmtMoney } from "@/lib/utils";

// Each MRR value shown, one per tick
const MRR_STEPS = [340, 512, 689, 821, 934, 978, 1000];

// ms between each MRR number tick — slow enough to read
const TICK_MS = 1600;

type Phase =
  | "idle" // initial: "cron job running..."
  | "counting" // MRR ticks up one by one
  | "crossed" // "$1k crossed!" big moment
  | "generating" // "Generating card..."
  | "posting" // "Posting to X..."
  | "posted" // tweet card visible
  | "reset";

interface LogEntry {
  icon: React.ReactNode;
  text: string;
  color: string;
}

export function HeroAnimation() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);

  function addLog(entry: LogEntry) {
    setLog((prev) => [entry, ...prev].slice(0, 4));
  }

  useEffect(() => {
    if (phase === "idle") {
      addLog({
        icon: <Loader2 size={11} className="animate-spin text-white/40" />,
        text: "Cron job running — checking MRR…",
        color: "text-white/40",
      });
      const t = setTimeout(() => setPhase("counting"), 2200);
      return () => clearTimeout(t);
    }

    if (phase === "counting") {
      if (step < MRR_STEPS.length - 1) {
        const next = step + 1;
        const t = setTimeout(() => {
          setStep(next);
          addLog({
            icon: <TrendingUp size={11} className="text-indigo-400" />,
            text: `MRR updated — ${fmtMoney(MRR_STEPS[next])}`,
            color: "text-white/50",
          });
        }, TICK_MS);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("crossed"), 600);
        return () => clearTimeout(t);
      }
    }

    if (phase === "crossed") {
      addLog({
        icon: <Bell size={11} className="text-amber-400" />,
        text: "$1k MRR threshold crossed!",
        color: "text-amber-400",
      });
      const t = setTimeout(() => setPhase("generating"), 2400);
      return () => clearTimeout(t);
    }

    if (phase === "generating") {
      addLog({
        icon: <Loader2 size={11} className="animate-spin text-indigo-400" />,
        text: "Generating milestone card…",
        color: "text-white/40",
      });
      const t = setTimeout(() => setPhase("posting"), 2000);
      return () => clearTimeout(t);
    }

    if (phase === "posting") {
      addLog({
        icon: <XIcon size={11} className="text-sky-400" />,
        text: "Posting to X (Twitter)…",
        color: "text-white/40",
      });
      const t = setTimeout(() => setPhase("posted"), 2000);
      return () => clearTimeout(t);
    }

    if (phase === "posted") {
      addLog({
        icon: <Check size={11} className="text-green-400" />,
        text: "Tweet posted — @mysaas",
        color: "text-green-400",
      });
      const t = setTimeout(() => setPhase("reset"), 6000);
      return () => clearTimeout(t);
    }

    if (phase === "reset") {
      const t = setTimeout(() => {
        setStep(0);
        setLog([]);
        setPhase("idle");
      }, 800);
      return () => clearTimeout(t);
    }
  }, [phase, step]);

  const mrr = MRR_STEPS[step];
  const progress = Math.min((mrr / 1000) * 100, 100);
  const isCrossed =
    phase === "crossed" ||
    phase === "generating" ||
    phase === "posting" ||
    phase === "posted";
  const isPosted = phase === "posted";

  return (
    <div className="relative select-none">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 -m-8 rounded-3xl transition-all duration-1000"
        style={{
          background: isCrossed
            ? "radial-gradient(ellipse at 60% 40%, rgba(99,102,241,0.2) 0%, transparent 65%)"
            : "radial-gradient(ellipse at 60% 40%, rgba(99,102,241,0.08) 0%, transparent 65%)",
        }}
      />

      {/* ── Dashboard card ── */}
      <div
        className="relative overflow-hidden rounded-2xl transition-all duration-700"
        style={{
          border: `1px solid ${isCrossed ? "rgba(99,102,241,0.35)" : "rgba(255,255,255,0.07)"}`,
          background: "#0d0d0f",
          boxShadow: isCrossed
            ? "0 0 0 1px rgba(99,102,241,0.2), 0 32px 64px rgba(0,0,0,0.6)"
            : "0 24px 48px rgba(0,0,0,0.4)",
        }}
      >
        {/* Top gradient bar */}
        <div
          className="absolute inset-x-0 top-0 h-px transition-opacity duration-700"
          style={{
            background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)",
            opacity: isCrossed ? 1 : 0.35,
          }}
        />

        <div className="p-5">
          {/* ── Header row ── */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full transition-all duration-500"
                style={{
                  background: isCrossed ? "#34d399" : "#6366f1",
                  boxShadow: isCrossed ? "0 0 8px #34d399" : "0 0 6px #6366f1",
                }}
              />
              <span className="text-xs font-mono text-white/35">My SaaS</span>
            </div>

            {/* Phase badge */}
            <span
              className="rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all duration-500"
              style={{
                borderColor: isCrossed
                  ? "rgba(52,211,153,0.25)"
                  : "rgba(255,255,255,0.08)",
                background: isCrossed
                  ? "rgba(52,211,153,0.08)"
                  : "rgba(255,255,255,0.04)",
                color: isCrossed ? "#34d399" : "rgba(255,255,255,0.3)",
              }}
            >
              {isCrossed ? "Milestone hit!" : "Tracking…"}
            </span>
          </div>

          {/* ── MRR number ── */}
          <div className="mb-1">
            <p className="mb-1 text-xs font-mono uppercase tracking-widest text-white/25">
              Monthly Recurring Revenue
            </p>
            <p
              className="font-extrabold leading-none tracking-tighter transition-all duration-300"
              style={{
                fontFamily: "var(--font-poppins)",
                fontSize: "3.25rem",
                color: isCrossed ? "#a5b4fc" : "#ffffff",
                textShadow: isCrossed
                  ? "0 0 40px rgba(99,102,241,0.5)"
                  : "none",
              }}
            >
              {fmtMoney(mrr)}
            </p>
          </div>

          <p className="mb-4 text-xs text-white/25">
            {isCrossed
              ? "🎯 Threshold crossed — posting now"
              : `$${(1000 - mrr).toLocaleString()} to $1k`}
          </p>

          {/* ── Progress bar ── */}
          <div className="mb-1 flex items-center justify-between text-xs text-white/25">
            <span>Progress to $1k</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: isCrossed
                  ? "linear-gradient(90deg, #34d399, #10b981)"
                  : "linear-gradient(90deg, #6366f1, #8b5cf6)",
              }}
            />
          </div>

          {/* ── Activity log ── */}
          <div className="space-y-1.5 rounded-xl border border-white/6 bg-white/3 p-3">
            <p className="mb-2 text-xs font-mono uppercase tracking-widest text-white/20">
              Activity
            </p>
            {log.length === 0 && (
              <p className="text-xs text-white/20 italic">
                Waiting for next check…
              </p>
            )}
            {log.map((entry, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 transition-all duration-300 ${i === 0 ? "opacity-100" : "opacity-40"}`}
              >
                <span className="shrink-0">{entry.icon}</span>
                <span className={`text-xs font-mono ${entry.color}`}>
                  {entry.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tweet card — slides up when posted ── */}
      <div
        className="absolute -bottom-5 left-1/2 w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#111317] shadow-2xl transition-all duration-700"
        style={{
          transform: `translateX(-50%) translateY(${isPosted ? "0px" : "20px"}) scale(${isPosted ? 1 : 0.96})`,
          opacity: isPosted ? 1 : 0,
          pointerEvents: isPosted ? "auto" : "none",
          zIndex: 10,
        }}
      >
        {/* X-style tweet chrome */}
        <div className="border-b border-white/8 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white font-poppins"
            >
              M
            </div>
            <div>
              <p className="text-xs font-semibold text-white">My SaaS</p>
              <p className="text-xs text-white/30">@mysaas · just now</p>
            </div>
          </div>
          <XIcon size={13} className="text-white/25" />
        </div>

        <div className="px-4 py-3">
          <p className="text-sm leading-relaxed text-white/85">
            Just crossed <span className="font-bold text-white">$1k MRR</span> —
            milestone unlocked.
            <br />
            <span className="text-indigo-400 text-xs">
              #buildinpublic #saas #indiehacker
            </span>
          </p>

          {/* Mini card preview inside tweet */}
          <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a]">
            <div className="h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />
            <div className="px-3 py-2.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-white/30 mb-0.5">
                  MY SAAS
                </p>
                <p
                  className="text-xl font-extrabold text-white leading-none font-poppins"
                >
                  $1k
                </p>
                <p className="text-xs text-white/25 mt-0.5">
                  Monthly Recurring Revenue
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20">
                <Zap size={14} className="text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500/20">
              <Check size={10} className="text-green-400" strokeWidth={2.5} />
            </div>
            <span className="text-xs text-green-400 font-medium">
              Posted automatically
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
