import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StripeConnectForm } from "@/components/dashboard/stripe-connect-form";
import { TwitterConnect } from "@/components/dashboard/twitter-connect";
import { PaywallBanner } from "@/components/dashboard/paywall-banner";
import { calculateMRR } from "@/lib/stripe/mrr";
import {
  RedditIcon, SubstackIcon, LinkedInIcon,
  GitHubIcon, TikTokIcon, YouTubeIcon, ProductHuntIcon,
} from "@/components/ui/brand-logos";

const COMING_SOON: {
  name: string
  icon: React.ReactNode
  color: string
  bg: string
  desc: string
}[] = [
  {
    name: "Reddit",
    icon: <RedditIcon size={18} />,
    color: "#ff4500",
    bg: "rgba(255,69,0,0.12)",
    desc: "Track subreddit followers and post engagement milestones",
  },
  {
    name: "LinkedIn",
    icon: <LinkedInIcon size={18} />,
    color: "#0a66c2",
    bg: "rgba(10,102,194,0.12)",
    desc: "Auto-post milestones to your LinkedIn profile",
  },
  {
    name: "GitHub",
    icon: <GitHubIcon size={18} />,
    color: "#e6edf3",
    bg: "rgba(230,237,243,0.08)",
    desc: "Track stars, forks, and contributor count",
  },
  {
    name: "Substack",
    icon: <SubstackIcon size={18} />,
    color: "#ff6719",
    bg: "rgba(255,103,25,0.12)",
    desc: "Track newsletter subscriber milestones",
  },
  {
    name: "TikTok",
    icon: <TikTokIcon size={18} />,
    color: "#fe2c55",
    bg: "rgba(254,44,85,0.12)",
    desc: "Track follower and view milestones",
  },
  {
    name: "YouTube",
    icon: <YouTubeIcon size={18} />,
    color: "#ff0000",
    bg: "rgba(255,0,0,0.1)",
    desc: "Track subscriber and view count milestones",
  },
  {
    name: "Product Hunt",
    icon: <ProductHuntIcon size={18} />,
    color: "#da552f",
    bg: "rgba(218,85,47,0.12)",
    desc: "Track upvotes and ranking milestones",
  },
];

const ERROR_MESSAGES: Record<string, string> = {
  twitter_cookie:
    "OAuth cookie missing. This usually means you're on HTTP (localhost). The fix is already applied — try again.",
  twitter_auth:
    "Twitter authentication failed. Check that your API Key/Secret are OAuth 1.0a credentials, not OAuth 2.0.",
  twitter_keys:
    'Invalid Twitter API keys. Use the OAuth 1.0a "API Key" and "API Key Secret" from developer.twitter.com, not the OAuth 2.0 Client ID.',
  twitter_config:
    "TWITTER_API_KEY or TWITTER_API_SECRET not set in .env.local.",
  twitter_missing_params: "OAuth params missing. Try connecting again.",
};

export default async function ConnectorsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; twitter?: string; msg?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const params = await searchParams;

  const service = await createServiceClient();

  const [{ data: stripeConns }, { data: twitterConn }, { data: sub }] =
    await Promise.all([
      service
        .from("stripe_connections")
        .select("id, stripe_account_name")
        .eq("user_id", user.id)
        .order("created_at"),
      service
        .from("twitter_connections")
        .select("screen_name")
        .eq("user_id", user.id)
        .single(),
      service
        .from("user_subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .single(),
    ]);

  const isSubscribed = sub?.status === "active";
  const connections = stripeConns ?? [];

  let paywall_mrr = 0;
  if (connections.length > 0) {
    const { data: conn } = await service
      .from("stripe_connections")
      .select("stripe_api_key_encrypted")
      .eq("id", connections[0].id)
      .single();
    if (conn) {
      try {
        const apiKey = Buffer.from(
          conn.stripe_api_key_encrypted,
          "base64",
        ).toString("utf-8");
        paywall_mrr = await calculateMRR(apiKey);
      } catch {}
    }
  }

  const errorMsg = params.error
    ? (ERROR_MESSAGES[params.error] ?? params.msg ?? "An error occurred.")
    : null;
  const successMsg =
    params.twitter === "connected"
      ? "X (Twitter) connected successfully!"
      : null;

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1
          className="text-xl font-bold text-white"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Connectors
        </h1>
        <p className="text-xs text-white/35 mt-0.5">
          Link your tools to start tracking
        </p>
      </div>

      {/* Auth feedback */}
      {errorMsg && (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <p className="font-medium mb-0.5">Connection failed</p>
          <p className="text-xs text-red-400/70">{errorMsg}</p>
        </div>
      )}
      {successMsg && (
        <div className="rounded-xl border border-green-500/25 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {successMsg}
        </div>
      )}

      <PaywallBanner mrr={paywall_mrr} isSubscribed={isSubscribed} />

      {/* Active connectors */}
      <section className="space-y-3">
        <p className="text-xs font-medium text-white/35 uppercase tracking-wider">
          Active
        </p>
        <StripeConnectForm connections={connections} />
        <TwitterConnect
          isConnected={!!twitterConn}
          screenName={twitterConn?.screen_name}
        />
      </section>

      {/* Coming soon */}
      <section className="space-y-3">
        <p className="text-xs font-medium text-white/35 uppercase tracking-wider">
          Coming soon
        </p>
        <div className="grid grid-cols-2 gap-3">
          {COMING_SOON.map((c) => (
            <div
              key={c.name}
              className="rounded-2xl border border-white/8 bg-white/3 p-4 opacity-60"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: c.bg, color: c.color }}
                >
                  {c.icon}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white/60">
                    {c.name}
                  </p>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/30">
                    Soon
                  </span>
                </div>
              </div>
              <p className="text-xs text-white/30 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
