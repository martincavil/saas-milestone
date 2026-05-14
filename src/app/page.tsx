import Link from "next/link";
import { Key, Clock, Check, ArrowRight, Zap, X, Bell } from "lucide-react";
import { HeroAnimation } from "@/components/landing/hero-animation";
import {
  ScrollReveal,
  ScrollRevealGrid,
} from "@/components/landing/scroll-reveal";
import { Navbar } from "@/components/landing/navbar";
import {
  SecuritySection,
  HowItWorksDeepSection,
  FAQSection,
  StatsBar,
  TestimonialsSection,
  BuildInPublicSection,
  FounderNote,
} from "@/components/landing/trust-sections";
import { MilestoneCategoriesSection } from "@/components/landing/milestone-categories";

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "var(--font-nunito)" }}
    >
      <Navbar />
      {/* Spacer for fixed navbar */}
      <div className="h-[60px]" />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {/* Orb 1 — indigo, top-left */}
          <div
            className="orb-1 absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle at center, #6366f1 0%, transparent 70%)",
              filter: "blur(64px)",
            }}
          />
          {/* Orb 2 — violet, top-right */}
          <div
            className="orb-2 absolute -right-40 top-0 h-[480px] w-[480px] rounded-full opacity-25"
            style={{
              background:
                "radial-gradient(circle at center, #8b5cf6 0%, transparent 70%)",
              filter: "blur(72px)",
            }}
          />
          {/* Orb 3 — cyan, bottom-right */}
          <div
            className="orb-3 absolute bottom-0 right-1/4 h-[360px] w-[360px] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle at center, #06b6d4 0%, transparent 70%)",
              filter: "blur(56px)",
            }}
          />
          {/* Orb 4 — indigo soft, center */}
          <div
            className="orb-4 absolute left-1/3 top-1/4 h-[300px] w-[300px] rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle at center, #a5b4fc 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </div>

        {/* Dot grid background */}
        <div className="dot-grid absolute inset-0 opacity-40" />
        {/* Soft fade to white at bottom so sections connect cleanly */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />

        <div className="relative mx-auto max-w-5xl px-5 pt-20 pb-12">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left — copy */}
            <div>
              {/* Badge */}
              <div className="hero-fade-1 mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1 text-xs font-medium text-indigo-600">
                <span
                  className="flex h-1.5 w-1.5 rounded-full bg-indigo-500"
                  style={{ animation: "pulse-dot 1.5s ease-in-out infinite" }}
                />
                Free until your MRR hits $100
              </div>

              {/* Headline */}
              <h1
                className="hero-fade-2 mb-4 text-[2.75rem] font-extrabold leading-[1.08] tracking-tight text-gray-900 lg:text-5xl"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Track your wins.
                <br />
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Post them automatically.
                </span>
              </h1>

              <p className="hero-fade-3 mb-8 max-w-md text-[1.05rem] leading-relaxed text-gray-500">
                Connect your tools, hit a milestone, watch it go live on X and
                LinkedIn — no copy-paste, no manual work.
              </p>

              {/* CTAs */}
              <div className="hero-fade-4 flex flex-wrap items-center gap-3">
                <Link href="/login" className="btn-primary">
                  Start tracking free →
                  <ArrowRight size={15} />
                </Link>
                <a href="#how" className="btn-secondary">
                  See how it works
                </a>
              </div>

              {/* Social proof */}
              <div className="hero-fade-5 mt-8 flex items-center gap-3">
                <div className="flex items-center -space-x-1.5">
                  {["#4f46e5", "#7c3aed", "#0891b2", "#059669", "#d97706"].map(
                    (color, i) => (
                      <div
                        key={i}
                        className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-white text-xs font-bold"
                        style={{ background: color }}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ),
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  2,847 founders tracking 41,209 milestones
                </p>
              </div>
            </div>

            {/* Right — animated product mockup */}
            <HeroAnimation />
          </div>
        </div>
      </section>

      <StatsBar />

      {/* How it works */}
      <section id="how" className="p-8 md:py-16">
        <div className="mx-auto max-w-5xl px-5">
          <ScrollReveal className="mb-14 max-w-lg">
            <p
              className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              How it works
            </p>
            <h2
              className="text-4xl font-bold text-gray-900"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Three steps. Done.
            </h2>
          </ScrollReveal>

          <ScrollRevealGrid
            className="grid gap-6 md:grid-cols-3"
            staggerDelay={0.12}
          >
            {[
              {
                icon: <Key size={22} className="text-indigo-600" />,
                num: "01",
                title: "Connect your stack",
                desc: "Link Stripe, GitHub, and your social accounts — takes under 5 minutes.",
              },
              {
                icon: <Clock size={22} className="text-indigo-600" />,
                num: "02",
                title: "Hit a milestone",
                desc: "We watch your MRR, users, visitors, followers, stars, and subscribers around the clock.",
              },
              {
                icon: <X size={22} className="text-indigo-600" />,
                num: "03",
                title: "It posts itself",
                desc: "The moment you hit a milestone, a visual is auto-generated and published to X and LinkedIn automatically.",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="h-full group relative rounded-2xl border border-gray-200 bg-white p-7 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="absolute right-5 top-5 text-xs font-mono font-bold text-gray-200 group-hover:text-indigo-100 transition-colors">
                  {item.num}
                </div>
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                  {item.icon}
                </div>
                <h3 className="mb-2 font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </ScrollRevealGrid>
        </div>
      </section>

      <MilestoneCategoriesSection />

      {/* Card preview */}
      <section className="p-8 md:py-16">
        <div className="mx-auto max-w-5xl px-5">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <ScrollReveal direction="left">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
                Auto-generated visuals
              </p>
              <h2
                className="mb-5 text-4xl font-bold text-gray-900"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Auto-generated visuals,
                <br />
                auto-posted for you
              </h2>
              <p className="mb-6 text-gray-500 leading-relaxed">
                When you hit a milestone, a visual is generated and posted to X
                and LinkedIn without you touching anything. No screenshot, no
                Canva, no "I should tweet about this later" that never happens.
                It just goes out.
              </p>
              <ul className="space-y-3">
                {[
                  "Your SaaS name, front and center",
                  "Progress toward the next milestone",
                  "Date and branding on every card",
                  "Posts to X and LinkedIn automatically",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3 text-sm text-gray-600"
                  >
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
                      <Check
                        size={11}
                        className="text-indigo-600"
                        strokeWidth={2.5}
                      />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            {/* Card mockup — static version */}
            <ScrollReveal direction="right" delay={0.1}>
              <div className="relative">
                <div className="absolute inset-0 -m-4 rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50" />
                <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-gray-200">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />
                  <div className="bg-[#0a0a0a] p-8">
                    <div className="mb-5 flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-widest text-white/30">
                        My SaaS
                      </span>
                      <div className="flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                        <span className="text-xs text-indigo-300">
                          Milestone Reached
                        </span>
                      </div>
                    </div>
                    <p
                      className="mb-1 text-[4.5rem] font-extrabold leading-none tracking-tighter text-white"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      $1k
                    </p>
                    <p className="mb-6 text-sm text-white/40">
                      Monthly Recurring Revenue
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-white/30">
                        <span>Progress to $5k</span>
                        <span>20%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                        <div className="h-full w-1/5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                      </div>
                      <div className="flex justify-between text-xs text-white/20">
                        <span>$1</span>
                        <span>$10k</span>
                      </div>
                    </div>
                    <p className="mt-6 text-right text-xs text-white/15">
                      saas-milestone · free until $100 MRR
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="border-t border-gray-100 bg-gray-50 p-8 md:py-16"
      >
        <div className="mx-auto max-w-5xl px-5">
          <ScrollReveal className="mb-14 max-w-lg">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Pricing
            </p>
            <h2
              className="text-4xl font-bold text-gray-900"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Free until you make money.
              <br />
              Then $9/month. That's it.
            </h2>
          </ScrollReveal>

          <ScrollRevealGrid
            className="grid max-w-2xl gap-4 md:grid-cols-2 mx-auto"
            staggerDelay={0.15}
          >
            {/* Free */}
            <div className="h-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <p className="mb-1 text-sm font-medium text-gray-500">Free</p>
              <div className="mb-1 flex items-end gap-1">
                <span
                  className="text-5xl font-extrabold text-gray-900"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  $0
                </span>
              </div>
              <p className="mb-7 text-sm text-gray-400">
                While your MRR is under $100
              </p>
              <ul className="mb-8 space-y-3">
                {[
                  "All 6 milestone categories",
                  "Multiple Stripe accounts",
                  "Auto-post to X + LinkedIn",
                  "Consolidated MRR/ARR view",
                  "Full milestone history",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-gray-600"
                  >
                    <Check
                      size={14}
                      className="flex-shrink-0 text-green-500"
                      strokeWidth={2.5}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="btn-secondary block w-full justify-center"
              >
                Get started
              </Link>
            </div>

            {/* Pro */}
            <div className="h-full relative overflow-hidden rounded-2xl bg-gray-900 p-8 text-white shadow-xl">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-600/10" />
              <div className="absolute -bottom-8 -right-4 h-28 w-28 rounded-full bg-violet-600/10" />
              <div className="relative">
                <p className="mb-1 text-sm font-medium text-gray-400">Pro</p>
                <div className="mb-1 flex items-end gap-1">
                  <span
                    className="text-5xl font-extrabold text-white"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    $9
                  </span>
                  <span className="mb-2 text-sm text-gray-400">/mo</span>
                </div>
                <p className="mb-7 text-sm text-gray-400">After $100 MRR</p>
                <ul className="mb-8 space-y-3">
                  {[
                    "Everything in free",
                    "Per-product MRR breakdown",
                    "MRR share % per SaaS",
                    "Priority support",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2.5 text-sm text-gray-300"
                    >
                      <Check
                        size={14}
                        className="flex-shrink-0 text-indigo-400"
                        strokeWidth={2.5}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className="btn-primary block w-full justify-center"
                  style={{ background: "#fff", color: "#111827" }}
                >
                  Start free, upgrade when ready
                </Link>
              </div>
            </div>
          </ScrollRevealGrid>
        </div>
      </section>

      <TestimonialsSection />
      <BuildInPublicSection />
      <HowItWorksDeepSection />
      <SecuritySection />
      <FounderNote />
      <FAQSection />

      {/* Final CTA */}
      <section className="bg-gray-900 p-8 md:py-16">
        <ScrollReveal className="mx-auto max-w-2xl px-5 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600">
              <Bell size={24} className="text-white" />
            </div>
          </div>
          <h2
            className="mb-4 text-4xl font-extrabold text-white"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Stop letting milestones go unannounced.
          </h2>
          <p className="mb-8 text-gray-400">
            You did the work. The least you can do is let people know.
          </p>
          <Link
            href="/login"
            className="btn-primary"
            style={{
              background: "#fff",
              color: "#111827",
              padding: "12px 28px",
            }}
          >
            Connect Stripe — it's free →
            <ArrowRight size={15} />
          </Link>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600">
              <Zap size={12} className="text-white" fill="white" />
            </div>
            <span
              className="text-sm font-semibold text-white"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              saas-milestone
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Built with Next.js, Supabase & Stripe · © 2025
          </p>
          <Link
            href="/login"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </footer>
    </div>
  );
}
