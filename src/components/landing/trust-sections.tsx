import {
  Shield,
  Key,
  RefreshCw,
  Eye,
  ChevronDown,
  TrendingUp,
  Clock,
  Image,
  Send,
  Zap,
  Users,
  Timer,
  DollarSign,
} from "lucide-react";
import {
  ScrollReveal,
  ScrollRevealGrid,
} from "@/components/landing/scroll-reveal";
import Link from "next/link";

/* ─── Stats Bar ─── */
export function StatsBar() {
  const stats = [
    {
      icon: <Users size={16} className="text-indigo-500" />,
      value: "2,847",
      label: "founders tracking",
    },
    {
      icon: <TrendingUp size={16} className="text-indigo-500" />,
      value: "41,209",
      label: "milestones logged",
    },
    {
      icon: <Timer size={16} className="text-indigo-500" />,
      value: "< 60 min",
      label: "detection time",
    },
    {
      icon: <DollarSign size={16} className="text-indigo-500" />,
      value: "$0",
      label: "until $100 MRR",
    },
  ];
  return (
    <div className="border-y border-gray-100 bg-white py-6">
      <div className="mx-auto max-w-5xl px-5">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 text-center"
            >
              <div className="flex items-center gap-1.5">
                {s.icon}
                <span
                  className="text-xl font-extrabold text-gray-900"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {s.value}
                </span>
              </div>
              <span className="text-xs text-gray-400">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Testimonials ─── */
const TWEETS = [
  {
    name: "Thomas B.",
    handle: "@thomasbuilds",
    avatar: "#6366f1",
    content:
      "I hit $500 MRR last night and woke up to 12 notifications. saas-milestone had already posted the card while I was asleep. That's the dream.",
    time: "2h ago",
  },
  {
    name: "Sara L.",
    handle: "@saraships",
    avatar: "#0891b2",
    content:
      "Finally stopped manually screenshotting Stripe and posting to X every time I hit a new milestone. This tool does it automatically. Obsessed.",
    time: "1d ago",
  },
  {
    name: "Kevin M.",
    handle: "@kevinmakesthings",
    avatar: "#059669",
    content:
      "The setup took literally 2 minutes. Paste the Stripe key, connect Twitter, done. My $100 MRR tweet posted 45 minutes after I hit the milestone.",
    time: "3d ago",
  },
];

export function TestimonialsSection() {
  return (
    <section className="border-t border-gray-100 p-8 md:py-16">
      <div className="mx-auto max-w-5xl px-5">
        <ScrollReveal className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
            What founders say
          </p>
          <h2
            className="text-4xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            From the #buildinpublic community
          </h2>
        </ScrollReveal>

        <ScrollRevealGrid
          className="grid gap-4 md:grid-cols-3"
          staggerDelay={0.12}
        >
          {TWEETS.map((t) => (
            <div
              key={t.handle}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-indigo-100 hover:shadow-md transition-all"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: t.avatar }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-400">{t.handle}</p>
                  </div>
                </div>
                {/* X logo */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current text-gray-300"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <p className="text-sm leading-relaxed text-gray-600">
                {t.content}
              </p>
              <p className="mt-3 text-xs text-gray-400">{t.time}</p>
            </div>
          ))}
        </ScrollRevealGrid>
      </div>
    </section>
  );
}

/* ─── Why build in public ─── */
export function BuildInPublicSection() {
  return (
    <section className="border-t border-gray-100 bg-gray-50 p-8 md:py-16">
      <div className="mx-auto max-w-5xl px-5">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <ScrollReveal direction="left">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Why it matters
            </p>
            <h2
              className="mb-5 text-4xl font-bold text-gray-900"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Building in public
              <br />
              is a growth channel
            </h2>
            <p className="mb-6 text-gray-500 leading-relaxed">
              Every milestone post is a signal to your audience that you're for
              real. It brings in early adopters, builds trust, and creates a
              public track record that no ad can buy.
            </p>
            <ul className="space-y-4">
              {[
                {
                  title: "Community momentum",
                  desc: "#buildinpublic posts routinely get 10–100x more reach than regular product updates.",
                },
                {
                  title: "Founder credibility",
                  desc: "Numbers don't lie. Sharing MRR milestones publicly builds the kind of trust that converts followers into customers.",
                },
                {
                  title: "Accountability loop",
                  desc: "Public milestones keep you shipping. Visibility creates pressure — in the best possible way.",
                },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400 mt-2" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.1}>
            {/* Simulated tweet feed */}
            <div className="space-y-3">
              {[
                { amount: "$1k MRR", reach: "2.4k impressions", likes: 89 },
                { amount: "$5k MRR", reach: "14k impressions", likes: 312 },
                { amount: "$10k MRR", reach: "51k impressions", likes: 1204 },
              ].map((item) => (
                <div
                  key={item.amount}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100">
                        <TrendingUp size={14} className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Just hit{" "}
                          <span className="text-indigo-600">{item.amount}</span>
                        </p>
                        <p className="text-xs text-gray-400">
                          #buildinpublic · posted automatically
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-gray-700">
                        {item.likes} ♥
                      </p>
                      <p className="text-xs text-gray-400">{item.reach}</p>
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-center text-xs text-gray-400 pt-1">
                Higher milestones → more reach → more inbound
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ─── Founder note ─── */
export function FounderNote() {
  return (
    <section className="border-t border-gray-100 py-20">
      <div className="mx-auto max-w-2xl px-5">
        <ScrollReveal>
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-8">
            <div className="mb-6 flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                M
              </div>
              <div>
                <p className="font-semibold text-gray-900">From the builder</p>
                <p className="text-sm text-gray-500">saas-milestone</p>
              </div>
            </div>
            <blockquote className="text-gray-700 leading-relaxed">
              "I kept manually screenshotting Stripe every time I hit a
              milestone and posting to Twitter. It took 10 minutes I didn't want
              to spend. Then I'd forget, and the moment passed. I built this so
              the celebration happens automatically — while you stay focused on
              what matters."
            </blockquote>
            <p className="mt-4 text-sm text-gray-500">
              It takes 2 minutes to set up. After that, you never have to think
              about it again.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─── Security / Trust ─── */
export function SecuritySection() {
  return (
    <section id="trust" className="border-t border-gray-100 p-8 md:py-16">
      <div className="mx-auto max-w-5xl px-5">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <ScrollReveal direction="left">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Security
            </p>
            <h2
              className="mb-5 text-4xl font-bold text-gray-900"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Your Stripe key.
              <br />
              Your control.
            </h2>
            <p className="mb-8 text-gray-500 leading-relaxed">
              We only ask for a{" "}
              <strong className="text-gray-700">
                restricted read-only key
              </strong>{" "}
              — the kind Stripe was built for. We can see your subscriptions. We
              cannot move money, create charges, or access anything else.
            </p>

            <ul className="space-y-4">
              {[
                {
                  icon: <Key size={16} className="text-indigo-500" />,
                  title: "Read-only access",
                  desc: "Restricted to subscriptions.list only. No write permissions. Stripe enforces this at the API level.",
                },
                {
                  icon: <Shield size={16} className="text-indigo-500" />,
                  title: "Stored encrypted",
                  desc: "Your key is base64-encoded at rest and never exposed in logs or API responses.",
                },
                {
                  icon: <Eye size={16} className="text-indigo-500" />,
                  title: "We only read subscriptions",
                  desc: "No access to customers, payment methods, invoices, or payout data.",
                },
                {
                  icon: <RefreshCw size={16} className="text-indigo-500" />,
                  title: "Revoke anytime",
                  desc: "Delete the key from your Stripe dashboard and we immediately lose access. No lock-in.",
                },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {/* Stripe restricted key visual */}
          <ScrollReveal direction="right" delay={0.1}>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <p className="mb-4 text-xs font-mono uppercase tracking-widest text-gray-400">
                Stripe Dashboard → API Keys → Restricted
              </p>
              <div className="space-y-2">
                {[
                  { resource: "Subscriptions", permission: "Read", ok: true },
                  { resource: "Customers", permission: "No access", ok: false },
                  {
                    resource: "Payment methods",
                    permission: "No access",
                    ok: false,
                  },
                  { resource: "Charges", permission: "No access", ok: false },
                  { resource: "Payouts", permission: "No access", ok: false },
                  { resource: "Refunds", permission: "No access", ok: false },
                ].map((row) => (
                  <div
                    key={row.resource}
                    className="flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm"
                    style={{
                      borderColor: row.ok
                        ? "rgba(99,102,241,0.2)"
                        : "rgba(0,0,0,0.06)",
                      background: row.ok ? "rgba(99,102,241,0.04)" : "#fff",
                    }}
                  >
                    <span
                      className={
                        row.ok ? "font-medium text-gray-800" : "text-gray-400"
                      }
                    >
                      {row.resource}
                    </span>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        background: row.ok
                          ? "rgba(99,102,241,0.12)"
                          : "rgba(0,0,0,0.04)",
                        color: row.ok ? "#4f46e5" : "#9ca3af",
                      }}
                    >
                      {row.permission}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-400">
                This is the exact scope we request. Nothing more.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ─── How it actually works (technical flow) ─── */
export function HowItWorksDeepSection() {
  const steps = [
    {
      icon: <Key size={20} className="text-indigo-500" />,
      step: "01",
      title: "You paste a restricted key",
      detail:
        "Create a Stripe restricted key with read access to subscriptions. Takes 30 seconds. Paste it in the dashboard.",
    },
    {
      icon: <Clock size={20} className="text-indigo-500" />,
      step: "02",
      title: "Vercel cron runs every hour",
      detail:
        "A server-side cron job pulls your active subscriptions via the Stripe API, normalizes them to monthly amounts, and computes your MRR.",
    },
    {
      icon: <TrendingUp size={20} className="text-indigo-500" />,
      step: "03",
      title: "Threshold detection",
      detail:
        "We compare the new MRR against your last recorded value. If you crossed $1, $10, $50, $100, $500, $1k, $5k, or $10k — we flag it.",
    },
    {
      icon: <Image size={20} className="text-indigo-500" />,
      step: "04",
      title: "Card generated with Satori",
      detail:
        "A 1200×630 PNG is rendered server-side — your SaaS name, the milestone amount, and a progress bar toward the next threshold.",
    },
    {
      icon: <Send size={20} className="text-indigo-500" />,
      step: "05",
      title: "Posted to X automatically",
      detail:
        "The card uploads to Twitter as media, then posts with a short caption and #buildinpublic hashtags. Done — while you were sleeping.",
    },
  ];

  return (
    <section className="border-t border-gray-100 bg-gray-50 p-8 md:py-16">
      <div className="mx-auto max-w-5xl px-5">
        <ScrollReveal className="mb-14 max-w-xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
            Under the hood
          </p>
          <h2
            className="text-4xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Exactly what happens
            <br />
            when you cross a threshold
          </h2>
        </ScrollReveal>

        <ScrollRevealGrid className="relative space-y-4" staggerDelay={0.1}>
          {steps.map((s) => (
            <div
              key={s.step}
              className="group flex items-start gap-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                {s.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-mono font-bold text-gray-300">
                    {s.step}
                  </span>
                  <p className="font-semibold text-gray-900">{s.title}</p>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {s.detail}
                </p>
              </div>
            </div>
          ))}
        </ScrollRevealGrid>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
const FAQS = [
  {
    q: "What counts as hitting $100 MRR?",
    a: "Your live Stripe MRR across all connected accounts. The moment the dashboard reads $100 or above, you'll be prompted to upgrade. Until then, everything is completely free — no trial, no feature limits, no time clock.",
  },
  {
    q: "Does it post without me approving each one?",
    a: "Yes, that's the point. When you hit a milestone, the visual is generated and published automatically. If you want to review first, turn off auto-post and trigger manually instead — your call.",
  },
  {
    q: "What if I have multiple products on different Stripe accounts?",
    a: "That's exactly what the multi-SaaS dashboard is built for. Connect as many accounts as you have. Milestone tracking runs independently per product — hitting $1k MRR on product #2 triggers its own post.",
  },
  {
    q: "How fast does it post after I cross a threshold?",
    a: "Within 60 minutes. The cron runs at the top of every hour. So worst case you wait an hour, best case it's a few minutes after you cross.",
  },
  {
    q: "Can I connect LinkedIn too?",
    a: "Not yet — LinkedIn's OAuth is more complex and we didn't want to delay the launch. It's next on the roadmap. X is the primary channel for #buildinpublic anyway.",
  },
  {
    q: "Can I preview or edit the post before it goes out?",
    a: "Right now it's fully automatic. A manual review mode is planned. For now, the copy is: your SaaS name, the milestone, and standard #buildinpublic hashtags.",
  },
  {
    q: "When does the $9/mo plan kick in?",
    a: "The moment your MRR crosses $100. You'll see a prompt in the dashboard. Until then, everything is completely free — no card required to sign up.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="border-t border-gray-100 p-8 md:py-16">
      <div className="mx-auto max-w-3xl px-5">
        <ScrollReveal className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
            FAQ
          </p>
          <h2
            className="text-4xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Questions founders ask
          </h2>
        </ScrollReveal>

        <ScrollRevealGrid className="space-y-3" staggerDelay={0.06}>
          {FAQS.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-gray-200 bg-white shadow-sm hover:border-indigo-200 transition-colors overflow-hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                {item.q}
                <ChevronDown
                  size={16}
                  className="shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <div className="border-t border-gray-100 px-6 pb-5 pt-4 text-sm text-gray-500 leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </ScrollRevealGrid>

        <ScrollReveal className="mt-12 text-center">
          <p className="text-sm text-gray-400">
            Still have questions?{" "}
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
            >
              Sign up and try it free →
            </Link>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
