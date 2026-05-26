/**
 * Fetch the public star count for a GitHub repository.
 * No authentication required for public repos.
 *
 * @param repo - "owner/name" format, e.g. "martincavil/saas-milestone"
 * @returns star count as a number
 * @throws if the repo doesn't exist or the API returns an error
 */
export async function getGitHubStars(repo: string): Promise<number> {
  const url = `https://api.github.com/repos/${repo}`

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'MilestoneHit/1.0',
      'Accept': 'application/vnd.github.v3+json',
    },
    // No cache — we always want the live count
    cache: 'no-store',
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`GitHub repo not found: ${repo}`)
    }
    throw new Error(`GitHub API error ${response.status} for repo: ${repo}`)
  }

  const data = await response.json() as { stargazers_count: number }
  return data.stargazers_count
}
