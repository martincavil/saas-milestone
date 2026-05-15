"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

const FREE_FEATURES = [
  "All 6 milestone categories",
  "Multiple Stripe accounts",
  "Auto-post to X + LinkedIn",
  "Consolidated MRR/ARR view",
  "Full milestone history",
];

const PRO_FEATURES = [
  "Everything in free",
  "Per-product MRR breakdown",
  "MRR share % per SaaS",
  "Priority support",
];

const LAUNCH_FEATURES = [
  "Everything in Pro",
  "Price locked for life",
  "Priority access to new features",
  "Founding customer badge",
];

export function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const isAnnual = billing === "annual";

  return (
    <section
      id="pricing"
      className="border-t border-gray-100 bg-gray-50 p-8 md:py-16"
    >
      <div className="mx-auto max-w-5xl px-5">
        <ScrollReveal className="mb-10 max-w-lg">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
            Pricing
          </p>
          <h2 className="text-4xl font-bold text-gray-900 font-poppins">
            Free until you make money.
            <br />
            Then $9/month. That's it.
          </h2>
        </ScrollReveal>

        {/* Billing switch */}
        <ScrollReveal className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setBilling("monthly")}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                !isAnnual
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                isAnnual
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Annual
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold transition-colors ${
                  isAnnual
                    ? "bg-green-500/20 text-green-300"
                    : "bg-green-100 text-green-700"
                }`}
              >
                Save 27%
              </span>
            </button>
          </div>
        </ScrollReveal>

        {/* Launch offer banner — shown on annual */}
        {isAnnual && (
          <ScrollReveal className="mx-auto mb-6 max-w-3xl">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5 flex flex-col md:flex-row items-center gap-4">
              <span className="text-xl shrink-0">🚀</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-amber-900">
                  Launch offer — first 50 customers only
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Lock in <strong>$49/year forever</strong> instead of $79/year.
                  Only <strong>50 spots</strong> at this price.
                </p>
              </div>
              <Link
                href="/login"
                className="shrink-0 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white hover:bg-amber-400 transition-colors whitespace-nowrap"
              >
                Claim $49/yr →
              </Link>
            </div>
          </ScrollReveal>
        )}

        {/* Cards */}
        <div
          className={`grid max-w-3xl gap-4 mx-auto ${isAnnual ? "md:grid-cols-3" : "md:grid-cols-2"}`}
        >
          {/* Free */}
          <div className="order-1 md:order-0  flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="mb-1 text-sm font-medium text-gray-500">Free</p>
            <div className="mb-1 flex items-end gap-1">
              <span className="text-4xl font-extrabold text-gray-900 font-poppins">
                $0
              </span>
            </div>
            <p className="mb-5 text-sm text-gray-400">
              While your MRR is under $100
            </p>
            <ul className="mb-6 space-y-2.5 flex-1">
              {FREE_FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2.5 text-sm text-gray-600"
                >
                  <Check
                    size={13}
                    className="shrink-0 text-green-500"
                    strokeWidth={2.5}
                  />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="btn-secondary block w-full justify-center text-center"
            >
              Get started
            </Link>
          </div>

          {/* Launch offer — annual only */}
          {isAnnual && (
            <div className="order-0 md:order-1 flex flex-col relative overflow-hidden rounded-2xl border-2 border-amber-400 bg-white p-6 shadow-lg">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400" />
              <div className="absolute right-3 top-3">
                <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-white">
                  50 spots
                </span>
              </div>
              <p className="mb-1 text-sm font-bold text-amber-600">
                Launch offer
              </p>
              <div className="mb-1 flex items-end gap-1">
                <span className="text-4xl font-extrabold text-gray-900 font-poppins">
                  $49
                </span>
                <span className="mb-1.5 text-sm text-gray-500">/year</span>
              </div>
              <p className="mb-0.5 text-xs text-gray-400 line-through">
                $79/year
              </p>
              <p className="mb-5 text-xs font-semibold text-amber-600">
                Locked forever · save 38%
              </p>
              <ul className="mb-6 space-y-2.5 flex-1">
                {LAUNCH_FEATURES.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-gray-700"
                  >
                    <Check
                      size={13}
                      className="shrink-0 text-amber-500"
                      strokeWidth={2.5}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="btn-primary block w-full justify-center text-center bg-amber-500"
              >
                Claim your spot
              </Link>
            </div>
          )}

          {/* Pro */}
          <div className="order-2  flex flex-col relative overflow-hidden rounded-2xl bg-gray-900 p-6 text-white shadow-xl">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-600/10" />
            <div className="relative flex flex-col h-full">
              <p className="mb-1 text-sm font-medium text-gray-400">Pro</p>
              {isAnnual ? (
                <>
                  <div className="mb-1 flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-white font-poppins">
                      $79
                    </span>
                    <span className="mb-1.5 text-sm text-gray-400">/year</span>
                  </div>
                  <p className="mb-0.5 text-xs text-gray-500 line-through">
                    $108/year
                  </p>
                  <p className="mb-5 text-xs text-indigo-400 font-medium">
                    Save 27% vs monthly
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-1 flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-white font-poppins">
                      $9
                    </span>
                    <span className="mb-1.5 text-sm text-gray-400">/mo</span>
                  </div>
                  <p className="mb-5 text-xs text-gray-500">
                    After $100 MRR · cancel anytime
                  </p>
                </>
              )}
              <ul className="mb-6 space-y-2.5 flex-1">
                {PRO_FEATURES.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-gray-300"
                  >
                    <Check
                      size={13}
                      className="shrink-0 text-indigo-400"
                      strokeWidth={2.5}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="btn-primary block w-full justify-center text-center"
                
              >
                {isAnnual ? "Get Pro annual" : "Start free"}
              </Link>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <ScrollReveal className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Free until you hit $100 MRR. No credit card required to start.
            {isAnnual && " Annual plans billed once per year."}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
