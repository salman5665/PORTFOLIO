import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

export const runtime = 'nodejs'

const TABLES = [
  'profiles',
  'projects',
  'skills',
  'experiences',
  'education',
  'certificates',
  'testimonials',
  'blog_posts',
  'media_assets',
  'messages',
  'settings',
  'activity_logs',
]

// ─────────────────────────────────────────────
// SQL Formatting Helper
// ─────────────────────────────────────────────
function formatSqlValue(val: unknown): string {
  if (val === null || val === undefined) return 'NULL'
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE'
  if (typeof val === 'number') return String(val)
  if (typeof val === 'object') {
    // Arrays or JSON
    const jsonStr = JSON.stringify(val).replace(/'/g, "''")
    if (Array.isArray(val)) {
      // Postgres array literal or JSONB
      return `'${jsonStr}'::jsonb`
    }
    return `'${jsonStr}'::jsonb`
  }
  // String escaping
  const escaped = String(val).replace(/'/g, "''")
  return `'${escaped}'`
}

function generateSqlDump(dataMap: Record<string, any[]>): string {
  const now = new Date().toISOString()
  let sql = `-- ============================================================\n`
  sql += `-- Supabase Database Full Backup\n`
  sql += `-- Project: Salman Portfolio\n`
  sql += `-- Generated: ${now}\n`
  sql += `-- ============================================================\n\n`

  for (const [table, rows] of Object.entries(dataMap)) {
    if (!rows || rows.length === 0) continue

    sql += `-- ------------------------------------------------------------\n`
    sql += `-- Table: ${table} (${rows.length} rows)\n`
    sql += `-- ------------------------------------------------------------\n`

    for (const row of rows) {
      const keys = Object.keys(row)
      const colsStr = keys.map(k => `"${k}"`).join(', ')
      const valsStr = keys.map(k => formatSqlValue(row[k])).join(', ')

      if (row.id) {
        const updateStr = keys
          .filter(k => k !== 'id')
          .map(k => `"${k}" = EXCLUDED."${k}"`)
          .join(', ')
        sql += `INSERT INTO "${table}" (${colsStr}) VALUES (${valsStr}) ON CONFLICT ("id") DO UPDATE SET ${updateStr};\n`
      } else if (table === 'settings' && row.key) {
        sql += `INSERT INTO "${table}" (${colsStr}) VALUES (${valsStr}) ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updated_at" = EXCLUDED."updated_at";\n`
      } else {
        sql += `INSERT INTO "${table}" (${colsStr}) VALUES (${valsStr});\n`
      }
    }
    sql += `\n`
  }

  return sql
}

// ─────────────────────────────────────────────
// GitHub Commit Helper
// ─────────────────────────────────────────────
async function commitToGitHub(filename: string, content: string, message: string) {
  const token = process.env.GITHUB_TOKEN
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'salman5665'
  const repo = process.env.GITHUB_REPO || 'PORTFOLIO'

  if (!token) throw new Error('GITHUB_TOKEN is missing in environment variables')

  const path = `backups/${filename}`
  const url = `https://api.github.com/repos/${username}/${repo}/contents/${path}`

  // Check if file already exists to get SHA for update
  let sha: string | undefined
  try {
    const checkRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Salman-Portfolio-Backup',
      },
    })
    if (checkRes.ok) {
      const checkJson = await checkRes.json()
      sha = checkJson.sha
    }
  } catch {}

  const base64Content = Buffer.from(content).toString('base64')

  const putRes = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Salman-Portfolio-Backup',
    },
    body: JSON.stringify({
      message: message || `chore(backup): automated database backup ${filename}`,
      content: base64Content,
      ...(sha ? { sha } : {}),
    }),
  })

  if (!putRes.ok) {
    const errorJson = await putRes.json().catch(() => ({}))
    throw new Error(`GitHub API error (${putRes.status}): ${errorJson.message || putRes.statusText}`)
  }

  return await putRes.json()
}

// ─────────────────────────────────────────────
// Fetch All Data Helper
// ─────────────────────────────────────────────
async function fetchAllDatabaseTables() {
  const db = createServerClient()
  const dataMap: Record<string, any[]> = {}

  for (const table of TABLES) {
    try {
      const { data, error } = await db.from(table).select('*')
      if (!error && data) {
        dataMap[table] = data
      } else {
        dataMap[table] = []
      }
    } catch {
      dataMap[table] = []
    }
  }

  return dataMap
}

// ─────────────────────────────────────────────
// Handler (GET & POST)
// ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  return handleBackupRequest(req)
}

export async function POST(req: NextRequest) {
  return handleBackupRequest(req)
}

async function handleBackupRequest(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const format = url.searchParams.get('format') || 'json' // 'sql' | 'json'
    const action = url.searchParams.get('action') // 'download' | 'github' | 'email' | 'cron'

    const dataMap = await fetchAllDatabaseTables()
    const dateStr = new Date().toISOString().split('T')[0]

    // 1. Action: Direct Download
    if (action === 'download' || (!action && format)) {
      if (format === 'sql') {
        const sqlContent = generateSqlDump(dataMap)
        return new Response(sqlContent, {
          headers: {
            'Content-Type': 'application/x-sql; charset=utf-8',
            'Content-Disposition': `attachment; filename="supabase-db-backup-${dateStr}.sql"`,
          },
        })
      } else {
        const jsonContent = JSON.stringify(
          {
            backup_date: new Date().toISOString(),
            tables: dataMap,
          },
          null,
          2
        )
        return new Response(jsonContent, {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Disposition': `attachment; filename="supabase-db-backup-${dateStr}.json"`,
          },
        })
      }
    }

    // 2. Action: GitHub Commit & Email
    if (action === 'github' || action === 'cron' || action === 'email') {
      // Optional security verification for Vercel Cron
      if (action === 'cron' && process.env.CRON_SECRET) {
        const authHeader = req.headers.get('authorization')
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
          return NextResponse.json({ error: 'Unauthorized Cron trigger' }, { status: 401 })
        }
      }
      const sqlContent = generateSqlDump(dataMap)
      const filename = `db-backup-${dateStr}.sql`
      
      let githubResult: any = null
      let githubError: string | null = null
      try {
        githubResult = await commitToGitHub(
          filename,
          sqlContent,
          `chore(backup): automated daily database backup ${dateStr}`
        )
      } catch (err: any) {
        githubError = err.message || 'GitHub commit failed'
      }

      // If triggered by email or cron, send email notification
      if (action === 'cron' || action === 'email') {
        const resendKey = process.env.RESEND_API_KEY
        const recipient = process.env.CONTACT_EMAIL_TO || 'contact@salman.dev'
        
        if (resendKey) {
          const resend = new Resend(resendKey)
          await resend.emails.send({
            from: 'Portfolio Backup <onboarding@resend.dev>',
            to: recipient,
            subject: `📦 Daily Supabase Database Backup (${dateStr})`,
            html: `
              <div style="font-family: system-ui, sans-serif; padding: 20px; color: #1e293b;">
                <h2 style="color: #0ea5e9;">📦 Daily Portfolio Backup Complete</h2>
                <p>Your daily database backup for <strong>${dateStr}</strong> has been executed.</p>
                <ul>
                  <li><strong>Status:</strong> Success</li>
                  <li><strong>GitHub Sync:</strong> ${githubError ? `❌ ${githubError}` : '✅ Committed to backups/' + filename}</li>
                  <li><strong>Tables backed up:</strong> ${Object.keys(dataMap).join(', ')}</li>
                </ul>
                <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
                  Sent automatically by Salman Portfolio Backup Service.
                </p>
              </div>
            `,
            attachments: [
              {
                filename: `db-backup-${dateStr}.sql`,
                content: Buffer.from(sqlContent),
              },
            ],
          }).catch(console.error)
        }
      }

      return NextResponse.json({
        success: true,
        date: dateStr,
        github: githubError ? { success: false, error: githubError } : { success: true, commit: githubResult?.content?.html_url },
        tablesCount: Object.keys(dataMap).length,
      })
    }

    // Default JSON response summary
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tableCounts: Object.fromEntries(
        Object.entries(dataMap).map(([k, v]) => [k, v.length])
      ),
    })
  } catch (err: any) {
    console.error('[Backup API Error]:', err)
    return NextResponse.json({ error: err.message || 'Backup failed' }, { status: 500 })
  }
}


