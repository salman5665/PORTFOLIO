'use client'

import { motion } from 'framer-motion'
import { Code2, ExternalLink } from 'lucide-react'
import GithubContributionGraph from './GithubContributionGraph'
import LeetcodeWidget from './LeetcodeWidget'

interface Props {
  config?: CodingProfilesConfig | null
}

export interface CodingProfilesConfig {
  status?: 'draft' | 'published'
  github_url?: string
  leetcode_url?: string
}

function usernameFromUrl(url: string | null | undefined, host: 'github.com' | 'leetcode.com') {
  if (!url) return ''
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`)
    if (!parsed.hostname.toLowerCase().includes(host)) return ''
    const parts = parsed.pathname.split('/').filter(Boolean)
    if (host === 'leetcode.com' && parts[0] === 'u') return parts[1] || ''
    return parts[0] || ''
  } catch {
    return ''
  }
}

export default function CodingProfilesSection({ config }: Props) {
  const source = config?.status === 'published' ? config : null
  const githubUrl = source?.github_url || ''
  const leetcodeUrl = source?.leetcode_url || ''
  const githubUsername = usernameFromUrl(githubUrl, 'github.com')
  const leetcodeUsername = usernameFromUrl(leetcodeUrl, 'leetcode.com')

  if (!githubUsername && !leetcodeUsername) return null

  return (
    <section id="coding-profiles" className="section section-alt">
      <div className="container" style={{ maxWidth: 1100 }}>
        <style>{`
          .coding-head {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            gap: 1.25rem;
            align-items: end;
            margin-bottom: 2.4rem;
          }

          .coding-quick-links {
            display: flex;
            flex-wrap: wrap;
            gap: 0.65rem;
            justify-content: flex-end;
          }

          .coding-link {
            min-height: 40px;
            padding: 0 0.9rem;
            border-radius: 12px;
            border: 1px solid rgba(125, 211, 252, 0.18);
            background: rgba(15, 23, 42, 0.55);
            color: var(--color-text-sub);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
            font-size: 0.82rem;
            font-weight: 700;
            transition: all 0.2s var(--ease);
          }

          .coding-link:hover {
            color: #67e8f9;
            border-color: rgba(34, 211, 238, 0.38);
            background: rgba(34, 211, 238, 0.1);
            transform: translateY(-1px);
          }

          .coding-grid {
            display: grid;
            grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.8fr);
            gap: 1.1rem;
          }

          .coding-grid.single {
            grid-template-columns: minmax(0, 1fr);
          }

          @media (max-width: 991.98px) {
            .coding-head {
              grid-template-columns: 1fr;
            }

            .coding-quick-links {
              justify-content: flex-start;
            }

            .coding-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 767.98px) {
            .coding-head {
              margin-bottom: 1.55rem;
            }

            .coding-link {
              flex: 1 1 150px;
              justify-content: center;
            }
          }
        `}</style>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="coding-head"
        >
          <div>
            <div className="section-tag"><Code2 size={13} /> Coding Profiles</div>
            <h2 className="section-title">Developer Proof</h2>
            <p className="section-subtitle mb-0">
              Live coding signals from GitHub and LeetCode, shaped into a clean proof-of-work dashboard.
            </p>
          </div>

          <div className="coding-quick-links">
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="coding-link">
                GitHub <ExternalLink size={13} />
              </a>
            )}
            {leetcodeUrl && (
              <a href={leetcodeUrl} target="_blank" rel="noopener noreferrer" className="coding-link">
                LeetCode <ExternalLink size={13} />
              </a>
            )}
          </div>
        </motion.div>

        <div className={`coding-grid ${!githubUsername || !leetcodeUsername ? 'single' : ''}`}>
          {githubUsername && (
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.12 }} transition={{ delay: 0.1 }}>
              <GithubContributionGraph username={githubUsername} profileUrl={githubUrl} />
            </motion.div>
          )}

          {leetcodeUsername && (
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.12 }} transition={{ delay: 0.18 }}>
              <LeetcodeWidget username={leetcodeUsername} profileUrl={leetcodeUrl} />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
