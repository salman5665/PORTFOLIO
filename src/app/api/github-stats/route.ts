import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'salman5665'

function getGitHubUsername(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')?.trim() || GITHUB_USERNAME
  return /^[a-zA-Z0-9-]{1,39}$/.test(username) ? username : GITHUB_USERNAME
}

function yearlyFallbackContributions() {
  const today = new Date()
  return Array.from({ length: 365 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (364 - index))
    return {
      date: date.toISOString().slice(0, 10),
      count: 0,
      level: 0,
    }
  })
}

export async function GET(request: Request) {
  try {
    const username = getGitHubUsername(request)
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github+json',
    }
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers, next: { revalidate: 3600 }, signal: AbortSignal.timeout(7000) }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers, next: { revalidate: 3600 }, signal: AbortSignal.timeout(7000) }),
    ])

    if (!userRes.ok) {
      return NextResponse.json({ error: 'GitHub user not found' }, { status: 404 })
    }

    const user = await userRes.json()
    const repos = reposRes.ok ? await reposRes.json() : []

    const html = await fetch(`https://github.com/${username}?tab=overview`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4500),
    }).then((res) => res.ok ? res.text() : '').catch(() => '')

    const $ = cheerio.load(html)
    const contributions: { date: string; count: number; level: number }[] = []
    
    // Total contributions text (e.g. "500 contributions in the last year")
    const totalContributionsText = $('.js-yearly-contributions h2').text().trim()
    const totalCommitsMatch = totalContributionsText.match(/([\d,]+)\s+contributions/)
    const totalCommits = totalCommitsMatch ? parseInt(totalCommitsMatch[1].replace(/,/g, '')) : 0

    // Parse the SVG rects for the calendar
    $('tool-tip').each((_, el) => {
      const toolTip = $(el)
      const forAttr = toolTip.attr('for')
      if (forAttr && forAttr.startsWith('contribution-day-component-')) {
        const date = forAttr.replace('contribution-day-component-', '')
        const text = toolTip.text().trim() // e.g. "No contributions on Sunday, January 1, 2023" or "5 contributions on Monday, January 2, 2023"
        let count = 0
        if (!text.toLowerCase().includes('no contributions')) {
           const match = text.match(/^(\d+)/)
           if (match) count = parseInt(match[1])
        }
        
        // Find the rect to get the level
        const rect = $(`rect#${forAttr}`)
        let level = 0
        if (rect.length > 0) {
           const levelAttr = rect.attr('data-level')
           if (levelAttr) level = parseInt(levelAttr)
        }
        
        contributions.push({ date, count, level })
      }
    })

    const totalStars = repos.reduce((sum: number, repo: { stargazers_count: number }) => sum + (repo.stargazers_count || 0), 0)
    const totalPrs = 0 // Would require another API call
    const finalContributions = contributions.length > 0
      ? contributions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      : yearlyFallbackContributions()
    
    return NextResponse.json({
      username,
      commits: totalCommits,
      repos: user.public_repos,
      prs: totalPrs,
      stars: totalStars,
      contributions: finalContributions
    })
  } catch (error) {
    console.error('GitHub API error:', error)
    return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 })
  }
}

