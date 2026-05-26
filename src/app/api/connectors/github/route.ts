import { withAuth, err, ok } from '@/lib/api-helpers'

const REPO_REGEX = /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/

export async function POST(request: Request) {
  return withAuth(async (user, service) => {
    const body = await request.json()
    const { github_repo } = body as { github_repo?: string }

    if (!github_repo || typeof github_repo !== 'string') {
      return err('github_repo is required')
    }

    const trimmed = github_repo.trim()

    if (!REPO_REGEX.test(trimmed)) {
      return err('Invalid repo format. Use owner/name (e.g. vercel/next.js)')
    }

    // Upsert metric_connections row for this user + category 'stars'
    const { error } = await service
      .from('metric_connections')
      .upsert(
        {
          user_id:         user.id,
          category:        'stars',
          config:          { github_repo: trimmed },
          enabled:         true,
          last_value:      0,
          last_checked_at: null,
        },
        {
          onConflict:        'user_id,category',
          ignoreDuplicates:  false,
        }
      )

    if (error) {
      return err(error.message, 500)
    }

    return ok({ github_repo: trimmed })
  })
}

export async function DELETE(_request: Request) {
  return withAuth(async (user, service) => {
    const { error } = await service
      .from('metric_connections')
      .delete()
      .eq('user_id', user.id)
      .eq('category', 'stars')

    if (error) {
      return err(error.message, 500)
    }

    return ok()
  })
}
