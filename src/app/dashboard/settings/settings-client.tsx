"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Zap,
  CreditCard,
  Check,
  ExternalLink,
  RefreshCw,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  email: string;
  isSubscribed: boolean;
  hasStripeCustomer: boolean;
}

export function SettingsClient({
  email,
  isSubscribed,
  hasStripeCustomer,
}: Props) {
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [notifMilestone, setNotifMilestone] = useState(true);
  const [notifDigest, setNotifDigest] = useState(false);
  const [notifSaving, setNotifSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/settings/notifications')
      .then(r => r.json())
      .then(d => {
        setNotifMilestone(d.email_milestone ?? true)
        setNotifDigest(d.email_weekly_digest ?? false)
      })
      .catch(() => {})
  }, [])

  async function saveNotif(key: 'email_milestone' | 'email_weekly_digest', value: boolean) {
    setNotifSaving(true)
    await fetch('/api/settings/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [key]: value }),
    }).catch(() => {})
    setNotifSaving(false)
  }

  async function handleSync() {
    setSyncLoading(true);
    setSyncResult(null);
    const res = await fetch("/api/sync-subscription", { method: "POST" });
    const data = await res.json();
    setSyncLoading(false);
    if (data.status === "active") {
      setSyncResult("✓ Pro access activated!");
      setTimeout(() => router.refresh(), 800);
    } else if (data.status === "no_customer") {
      setSyncResult("No Stripe payment found for this email.");
    } else {
      setSyncResult("No active subscription found.");
    }
  }

  async function handleUpgrade() {
    setUpgradeLoading(true);
    const res = await fetch("/api/upgrade-checkout", { method: "POST" });
    const { url } = await res.json();
    if (url) window.location.href = url;
    setUpgradeLoading(false);
  }

  async function handlePortal() {
    setPortalLoading(true);
    const res = await fetch("/api/billing-portal", { method: "POST" });
    const { url } = await res.json();
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
    setPortalLoading(false);
  }

  return (
    <div className="p-6 space-y-8 max-w-lg">
      <div>
        <h1
          className="text-xl font-bold text-white font-poppins"
        >
          Settings
        </h1>
        <p className="text-xs text-white/35 mt-0.5">Account and subscription</p>
      </div>

      {/* Account */}
      <section className="space-y-3">
        <p className="text-xs font-medium text-white/35 uppercase tracking-wider">
          Account
        </p>
        <div className="rounded-2xl border border-white/8 bg-white/4 px-5 py-4">
          <p className="text-xs text-white/40 mb-1">Email</p>
          <p className="text-sm font-medium text-white">{email}</p>
        </div>
      </section>

      {/* Plan */}
      <section className="space-y-3">
        <p className="text-xs font-medium text-white/35 uppercase tracking-wider">
          Plan
        </p>

        {isSubscribed ? (
          <div className="rounded-2xl border border-indigo-500/25 bg-indigo-500/8 p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <Zap size={14} className="text-white" fill="white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Pro</p>
                <p className="text-xs text-indigo-300">$9/month · Active</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 rounded-full border border-green-500/25 bg-green-500/12 px-2.5 py-1 text-xs text-green-400">
                <Check size={10} strokeWidth={2.5} />
                Active
              </div>
            </div>
            <ul className="space-y-1.5 mb-4">
              {[
                "Full analytics dashboard",
                "Multi-SaaS overview",
                "Manual posting",
                "Priority support",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-xs text-white/55"
                >
                  <Check
                    size={11}
                    className="text-indigo-400 shrink-0"
                    strokeWidth={2.5}
                  />
                  {f}
                </li>
              ))}
            </ul>
            {hasStripeCustomer && (
              <button
                onClick={handlePortal}
                disabled={portalLoading}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/60 hover:text-white/90 hover:border-white/20 transition-colors disabled:opacity-50"
              >
                {portalLoading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <CreditCard size={12} />
                )}
                Manage billing
                <ExternalLink size={11} />
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/8">
                <Zap size={14} className="text-white/40" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Free</p>
                <p className="text-xs text-white/40">Until $100 MRR</p>
              </div>
            </div>

            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/8 p-4 mb-4">
              <p className="text-xs font-semibold text-indigo-300 mb-2">
                Upgrade to Pro — $9/month
              </p>
              <ul className="space-y-1.5 mb-3">
                {[
                  "Full analytics dashboard",
                  "Multi-SaaS MRR breakdown",
                  "Manual milestone posting",
                  "Priority support",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-xs text-white/50"
                  >
                    <div className="h-1 w-1 rounded-full bg-indigo-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleUpgrade}
                disabled={upgradeLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
              >
                {upgradeLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Zap size={14} fill="white" />
                )}
                Upgrade now
              </button>
            </div>
            <p className="text-xs text-white/25 text-center">
              Cancel anytime · No questions asked
            </p>
          </div>
        )}
      </section>

      {/* Sync subscription */}
      <section className="space-y-3">
        <p className="text-xs font-medium text-white/35 uppercase tracking-wider">
          Troubleshooting
        </p>
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
          <p className="text-xs font-medium text-white/70 mb-1">
            Already paid but not on Pro?
          </p>
          <p className="text-xs text-white/35 mb-3">
            Webhooks can fail in local or staging environments. This will check
            Stripe directly and activate your account.
          </p>
          <button
            onClick={handleSync}
            disabled={syncLoading}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/60 hover:text-white/90 hover:border-white/20 transition-colors disabled:opacity-50"
          >
            {syncLoading ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <RefreshCw size={12} />
            )}
            Sync subscription from Stripe
          </button>
          {syncResult && (
            <p
              className={`mt-2 text-xs ${syncResult.startsWith("✓") ? "text-green-400" : "text-amber-400"}`}
            >
              {syncResult}
            </p>
          )}
        </div>
      </section>

      {/* Notifications */}
      <section className="space-y-3">
        <p className="text-xs font-medium text-white/35 uppercase tracking-wider">
          Notifications
        </p>
        <div className="rounded-2xl border border-white/8 bg-white/4 divide-y divide-white/6">
          {[
            {
              key: "email_milestone" as const,
              label: "Milestone alerts",
              desc: "Email when a new milestone is reached",
              value: notifMilestone,
              setter: setNotifMilestone,
            },
            {
              key: "email_weekly_digest" as const,
              label: "Weekly digest",
              desc: "Summary of your MRR and milestones each week",
              value: notifDigest,
              setter: setNotifDigest,
            },
          ].map(({ key, label, desc, value, setter }) => (
            <div key={key} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <Bell size={14} className="text-white/30 shrink-0" />
                <div>
                  <p className="text-sm text-white/80">{label}</p>
                  <p className="text-xs text-white/35 mt-0.5">{desc}</p>
                </div>
              </div>
              <button
                disabled={notifSaving}
                onClick={() => {
                  const next = !value
                  setter(next)
                  saveNotif(key, next)
                }}
                className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors disabled:opacity-50 ${
                  value ? "border-indigo-500/40 bg-indigo-600" : "border-white/15 bg-white/8"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    value ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Links */}
      <section className="space-y-2">
        <p className="text-xs font-medium text-white/35 uppercase tracking-wider">
          Links
        </p>
        <div className="rounded-2xl border border-white/8 bg-white/4 overflow-hidden">
          {[
            { label: "Landing page", href: "/" },
            { label: "Connectors", href: "/dashboard/connectors" },
          ].map((l, i, arr) => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center justify-between px-5 py-3 text-sm text-white/55 hover:bg-white/6 hover:text-white/90 transition-colors ${i < arr.length - 1 ? "border-b border-white/6" : ""}`}
            >
              {l.label}
              <ExternalLink size={12} className="text-white/25" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
