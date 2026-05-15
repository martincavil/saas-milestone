"use client";

import { StripeIcon } from "@/components/ui/brand-logos"
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Connection {
  id: string;
  stripe_account_name: string;
}

interface StripeConnectFormProps {
  connections: Connection[];
}

function AddForm({
  connectionId,
  initialName,
  onSuccess,
  onCancel,
}: {
  connectionId?: string;
  initialName?: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [apiKey, setApiKey] = useState("");
  const [name, setName] = useState(initialName ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/stripe-connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey, accountName: name, connectionId }),
    });

    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    onSuccess();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 pt-3 border-t border-white/8"
    >
      <div>
        <label className="mb-1.5 block text-xs text-white/50">SaaS name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Awesome SaaS"
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white placeholder-white/20 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-colors"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs text-white/50">
          Restricted API key
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="rk_live_…"
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 font-mono text-sm text-white placeholder-white/20 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-colors"
        />
      </div>
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          <AlertCircle size={13} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : connectionId ? (
            "Save"
          ) : (
            "Connect"
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/50 hover:text-white/80 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function StripeConnectForm({ connections }: StripeConnectFormProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(connections.length === 0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete(id: string) {
    setDeletingId(id);
    await fetch(`/api/stripe-connect?id=${id}`, { method: "DELETE" });
    setDeletingId(null);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-sm font-semibold text-white font-poppins"
          >
            Stripe
          </p>
          <p className="text-xs text-white/35 mt-0.5">
            {connections.length === 0
              ? "No accounts connected"
              : `${connections.length} account${connections.length > 1 ? "s" : ""} connected`}
          </p>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50 hover:text-white/80 hover:border-white/20 transition-all"
        >
          <Plus size={12} />
          Add SaaS
        </button>
      </div>

      {/* Existing connections */}
      {connections.map((conn) => (
        <div key={conn.id}>
          {editingId === conn.id ? (
            <AddForm
              connectionId={conn.id}
              initialName={conn.stripe_account_name}
              onSuccess={() => {
                setEditingId(null);
                router.refresh();
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/3 px-3.5 py-2.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15">
                  <CreditCard size={13} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white">
                    {conn.stripe_account_name}
                  </p>
                  <p className="text-xs text-white/30">Stripe connected</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditingId(conn.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-white/35 hover:bg-white/8 hover:text-white/70 transition-colors"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => handleDelete(conn.id)}
                  disabled={deletingId === conn.id}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400/50 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                  {deletingId === conn.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add form */}
      {showAdd && (
        <AddForm
          onSuccess={() => {
            setShowAdd(false);
            router.refresh();
          }}
          onCancel={() => setShowAdd(connections.length === 0 ? true : false)}
        />
      )}
    </div>
  );
}
