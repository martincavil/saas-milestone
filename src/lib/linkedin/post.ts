import { fmtCount } from '@/lib/utils'

/**
 * Post a milestone image to LinkedIn using the user's OAuth 2.0 access token.
 * The token is stored base64-encoded in the DB and must be decoded before calling.
 *
 * @param saasName       Display name of the SaaS product
 * @param amount         MRR milestone amount in dollars
 * @param imageBuffer    PNG image buffer to attach
 * @param linkedInUserId LinkedIn person URN sub (e.g. "abcdef123")
 * @param accessToken    Raw (decoded) OAuth 2.0 access token
 * @returns              Post URN string
 */
export async function postMilestoneLinkedIn(
  saasName: string,
  amount: number,
  imageBuffer: Buffer,
  linkedInUserId: string,
  accessToken: string
): Promise<string> {
  const authorUrn = `urn:li:person:${linkedInUserId}`

  // ── Step 1: Register the upload ──────────────────────────────────────────

  const registerRes = await fetch(
    'https://api.linkedin.com/v2/assets?action=registerUpload',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({
        registerUploadRequest: {
          recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
          owner: authorUrn,
          serviceRelationships: [
            {
              relationshipType: 'OWNER',
              identifier: 'urn:li:userGeneratedContent',
            },
          ],
        },
      }),
    }
  )

  if (!registerRes.ok) {
    const body = await registerRes.text()
    throw new Error(`LinkedIn registerUpload failed (${registerRes.status}): ${body}`)
  }

  const registerData = await registerRes.json()
  const uploadUrl: string =
    registerData?.value?.uploadMechanism?.[
      'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
    ]?.uploadUrl
  const assetUrn: string = registerData?.value?.asset

  if (!uploadUrl || !assetUrn) {
    throw new Error('LinkedIn registerUpload: missing uploadUrl or asset URN in response')
  }

  // ── Step 2: Upload the binary image ──────────────────────────────────────

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'image/png',
    },
    body: new Uint8Array(imageBuffer),
  })

  if (!uploadRes.ok) {
    const body = await uploadRes.text()
    throw new Error(`LinkedIn image upload failed (${uploadRes.status}): ${body}`)
  }

  // ── Step 3: Create the UGC post ───────────────────────────────────────────

  const postText =
    `🎉 ${saasName} just hit $${fmtCount(amount)} MRR!\n\n` +
    `Building in public, one milestone at a time.\n\n` +
    `#buildinpublic #saas #indiehacker #startup`

  const postRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: postText },
          shareMediaCategory: 'IMAGE',
          media: [
            {
              status: 'READY',
              description: { text: 'MilestoneHit' },
              media: assetUrn,
              title: { text: 'Milestone reached!' },
            },
          ],
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    }),
  })

  if (!postRes.ok) {
    const body = await postRes.text()
    throw new Error(`LinkedIn ugcPosts failed (${postRes.status}): ${body}`)
  }

  const postData = await postRes.json()
  const postUrn: string = postData?.id ?? postData?.value?.id ?? ''

  return postUrn
}
