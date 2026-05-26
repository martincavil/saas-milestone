'use client'

import { useState } from 'react'
import { GitHubIcon } from '@/components/ui/brand-logos'
import { Pencil, Check, X } from 'lucide-react'

interface GitHubConnectProps {
  githubRepo?: string // e.g. "owner/repo" if already configured
}

export function GitHubConnect({ githubRepo }: GitHubConnectProps) {
  const [repo, setRepo] = useState(githubRepo ?? '')
  const [editing, setEditing] = useState(!githubRepo)
  const [inputValue, setInputValue] = useState(githubRepo ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSave() {
    setError(null)
    setSuccess(false)

    const trimmed = inputValue.trim()
    if (!trimmed) {
      setError('Please enter a repo in owner/name format.')
      return
    }
    if (!/^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/.test(trimmed)) {
      setError('Invalid format. Use owner/name (e.g. vercel/next.js).')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/connectors/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ github_repo: trimmed }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to save.')
      } else {
        setRepo(trimmed)
        setEditing(false)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleCancel() {
    setInputValue(repo)
    setEditing(false)
    setError(null)
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ background: 'rgba(230,237,243,0.08)', color: '#e6edf3' }}
        >
          <GitHubIcon size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div>
              <p className="text-sm font-semibold text-white">GitHub Stars</p>
              <p className="text-xs text-white/30">Track star count milestones</p>
            </div>

            {repo && !editing && (
              <button
                onClick={() => { setEditing(true); setInputValue(repo) }}
                className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/4 px-2.5 py-1.5 text-xs text-white/50 hover:text-white/70 hover:border-white/15 transition-colors"
              >
                <Pencil size={10} />
                Change
              </button>
            )}
          </div>

          {/* Display mode */}
          {repo && !editing && (
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/25 bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Connected
              </span>
              <span className="text-xs text-white/40 font-mono">{repo}</span>
            </div>
          )}

          {/* Edit mode */}
          {editing && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSave()
                    if (e.key === 'Escape') handleCancel()
                  }}
                  placeholder="owner/repo-name"
                  className="flex-1 rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/25 transition-colors"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                >
                  <Check size={14} className="text-white" />
                </button>
                {repo && (
                  <button
                    onClick={handleCancel}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/4 hover:bg-white/8 transition-colors"
                  >
                    <X size={14} className="text-white/50" />
                  </button>
                )}
              </div>

              {error && (
                <p className="text-xs text-red-400">{error}</p>
              )}
              <p className="text-xs text-white/25">Format: owner/repo (e.g. vercel/next.js)</p>
            </div>
          )}

          {success && (
            <p className="mt-2 text-xs text-green-400">Repo saved — stars will be tracked on the next cron run.</p>
          )}
        </div>
      </div>
    </div>
  )
}
