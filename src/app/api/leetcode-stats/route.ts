import { NextResponse } from 'next/server'
import { LeetCode } from 'leetcode-query'

const LEETCODE_USERNAME = 'vinitsonii' // Replace with actual LeetCode username

function getLeetCodeUsername(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')?.trim() || LEETCODE_USERNAME
  return /^[a-zA-Z0-9_-]{1,30}$/.test(username) ? username : LEETCODE_USERNAME
}

export async function GET(request: Request) {
  try {
    const username = getLeetCodeUsername(request)
    const lc = new LeetCode()
    const user = await lc.user(username)

    if (!user) {
      return NextResponse.json({ error: 'LeetCode user not found' }, { status: 404 })
    }

    return NextResponse.json({
      username: user.matchedUser?.username,
      profile: user.matchedUser?.profile,
      submitStats: user.matchedUser?.submitStats,
    })
  } catch (error) {
    console.error('LeetCode API error:', error)
    return NextResponse.json({ error: 'Failed to fetch LeetCode data' }, { status: 500 })
  }
}
