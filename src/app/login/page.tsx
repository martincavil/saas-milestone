import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import Link from "next/link";
import { Zap, TrendingUp, Check } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  const params = await searchParams;

  return (
    <div
      className="min-h-screen bg-white flex"
      style={{ fontFamily: "var(--font-nunito)" }}
    >
      {/* Left — dark panel */}
      <div className="relative hidden w-[45%] flex-col overflow-hidden bg-gray-900 p-12 lg:flex">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
            <Zap size={14} className="text-white" fill="white" />
          </div>
          <span
            className="text-sm font-semibold text-white"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            saas-milestone
          </span>
        </Link>

        {/* Middle — mini card preview */}
        <div className="flex flex-1 flex-col justify-center">
          <p
            className="mb-6 text-2xl font-bold leading-tight text-white"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Hit a milestone.
            <br />
            <span className="text-indigo-400">X finds out first.</span>
          </p>

          {/* Milestone card preview */}
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a]">
            <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />
            <div className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-white/30">
                  Your SaaS
                </span>
                <div className="flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  <span className="text-xs text-indigo-300">Milestone</span>
                </div>
              </div>
              <p
                className="text-5xl font-extrabold tracking-tighter text-white"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                $1k
              </p>
              <p className="mt-1 text-xs text-white/40">
                Monthly Recurring Revenue
              </p>
              <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/8">
                <div className="h-full w-1/5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
              </div>
            </div>
          </div>

          {/* Features list */}
          <ul className="mt-8 space-y-3">
            {[
              "Paste one Stripe key — done",
              "Checks your MRR every hour",
              "Posts to X the moment you cross",
              "Free under $100 MRR",
            ].map((f) => (
              <li
                key={f}
                className="flex items-center gap-2.5 text-sm text-gray-400"
              >
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/20">
                  <Check
                    size={11}
                    className="text-indigo-400"
                    strokeWidth={2.5}
                  />
                </div>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-gray-600">© 2026 saas-milestone</p>
      </div>

      {/* Right — login form */}
      <div className="flex flex-1 flex-col">
        {/* Mobile nav */}
        <div className="flex h-14 items-center justify-between border-b border-gray-100 px-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
              <Zap size={14} className="text-white" fill="white" />
            </div>
            <span
              className="text-sm font-semibold text-gray-900"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              saas-milestone
            </span>
          </Link>
        </div>

        {/* Form center */}
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1
                className="text-2xl font-bold text-gray-900"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Sign in
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                No password. A magic link lands in your inbox.
              </p>
            </div>
            <LoginForm error={params.error} message={params.message} />
          </div>
        </div>
      </div>
    </div>
  );
}
