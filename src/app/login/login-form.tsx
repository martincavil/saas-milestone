"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

// ─── Google icon ─────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

type Tab = "signin" | "signup";

interface Props {
  error?: string;
  message?: string;
}

export function LoginForm({ error, message }: Props) {
  const [tab, setTab] = useState<Tab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [err, setErr] = useState(error ?? "");
  const [success, setSuccess] = useState("");

  const supabase = createClient();

  function reset() {
    setErr("");
    setSuccess("");
  }

  // ── Sign in ───────────────────────────────────────────────────────────────
  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); reset()

    try {
      const { error: authErr } = await supabase.auth.signInWithPassword({ email, password })
      if (authErr) {
        setErr(authErr.message === 'Invalid login credentials' ? 'Wrong email or password.' : authErr.message)
        return
      }
      window.location.href = '/dashboard'
    } catch (ex) {
      setErr('Connection error — check your internet and try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Sign up ───────────────────────────────────────────────────────────────
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setErr('Password must be at least 8 characters.'); return }
    setLoading(true); reset()

    try {
      const { error: authErr } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${location.origin}/api/auth/callback` },
      })
      if (authErr) { setErr(authErr.message); return }
      setSuccess('Account created! Check your inbox to confirm your email.')
    } catch (ex) {
      setErr('Connection error — check your internet and try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Google OAuth ──────────────────────────────────────────────────────────
  async function handleGoogle() {
    setGLoading(true);
    reset();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/api/auth/callback` },
    });
  }

  // ── Forgot password ───────────────────────────────────────────────────────
  async function handleForgot() {
    if (!email) {
      setErr("Enter your email address first.");
      return;
    }
    setLoading(true);
    reset();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    });
    setLoading(false);
    setSuccess("Password reset email sent — check your inbox.");
  }

  if (success) {
    return (
      <div
        className="rounded-2xl border p-8 text-center bg-surf border-edge"
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <span className="text-xl">✓</span>
        </div>
        <p
          className="font-semibold font-poppins mb-1 text-ink"
        >
          {success}
        </p>
        <button
          onClick={() => setSuccess("")}
          className="mt-4 text-xs text-indigo-500 hover:text-indigo-600 transition-colors"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div
      className="border border-indigo-300 rounded-2xl overflow-hidden bg-surf"
    >
      {/* Tabs */}
      <div className="flex border-b border-edge">
        {(["signin", "signup"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              reset();
            }}
            className={`flex-1 py-3.5 text-sm font-semibold transition-all border-b-2 ${tab === t ? "text-indigo-600 bg-surf border-indigo-500" : "text-ink-2 bg-base-2 border-transparent"}`}
          >
            {t === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <div className="p-6 space-y-4">
        {/* Google button */}
        <button
          onClick={handleGoogle}
          disabled={gLoading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border py-2.5 text-sm font-medium transition-all hover:shadow-sm disabled:opacity-50 border-edge text-ink bg-surf hover:bg-base-2"
          >
          {gLoading ? (
            <Loader2 size={16} className="animate-spin text-gray-400" />
          ) : (
            <GoogleIcon />
          )}
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-edge" />
          <span className="text-xs text-ink-3">
            or
          </span>
          <div className="flex-1 h-px bg-edge" />
        </div>

        {/* Error */}
        {err && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600">
            <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
            {err}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={tab === "signin" ? handleSignIn : handleSignUp}
          className="space-y-3"
        >
          {/* Email */}
          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-ink"
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="t-input"
            />
          </div>

          {/* Password */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                className="text-sm font-medium text-ink"
              >
                Password
              </label>
              {tab === "signin" && (
                <button
                  type="button"
                  onClick={handleForgot}
                  className="text-xs text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  tab === "signup" ? "Minimum 8 characters" : "••••••••"
                }
                required
                minLength={tab === "signup" ? 8 : undefined}
                className="t-input pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors text-ink-3"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--text-2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-3)")
                }
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {tab === "signup" && password.length > 0 && password.length < 8 && (
              <p className="mt-1 text-xs text-red-500">
                {8 - password.length} more character
                {8 - password.length > 1 ? "s" : ""} needed
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center mt-1"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ArrowRight size={15} />
            )}
            {loading
              ? tab === "signin"
                ? "Signing in…"
                : "Creating account…"
              : tab === "signin"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        {tab === "signup" && (
          <p className="text-center text-xs text-ink-3">
            By creating an account you agree to our{" "}
            <a
              href="#"
              className="text-indigo-500 hover:text-indigo-600 transition-colors"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-indigo-500 hover:text-indigo-600 transition-colors"
            >
              Privacy Policy
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}
