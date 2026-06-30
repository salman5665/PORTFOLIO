'use client'

import { motion } from 'framer-motion'
import { Mail, Code2, ChevronUp, User, Cpu, Layers, Briefcase, GraduationCap, MapPin, FileText, BookOpen, ExternalLink } from 'lucide-react'
import { FaGithub, FaLinkedinIn, FaTwitter, FaInstagram } from 'react-icons/fa'
import type { Profile } from '@/lib/supabase/types'

const NAV_LINKS = [
  { label: 'About', href: '#about', icon: User },
  { label: 'Skills', href: '#skills', icon: Cpu },
  { label: 'Projects', href: '#projects', icon: Layers },
  { label: 'Experience', href: '#experience', icon: Briefcase },
  { label: 'Education', href: '#education', icon: GraduationCap },
]

interface Props { profile?: Profile | null }

export default function Footer({ profile }: Props) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const name = profile?.name || 'Vinit Soni'
  const firstName = name.split(' ')[0]
  const tagline = profile?.tagline || 'Full-Stack Developer & MCA Student building premium web experiences.'
  const email = profile?.email || ''

  const socialLinks = [
    profile?.github_url    && { icon: FaGithub,      href: profile.github_url,    label: 'GitHub' },
    profile?.linkedin_url  && { icon: FaLinkedinIn,  href: profile.linkedin_url,  label: 'LinkedIn' },
    profile?.twitter_url   && { icon: FaTwitter,     href: profile.twitter_url,   label: 'Twitter' },
    profile?.instagram_url && { icon: FaInstagram,   href: profile.instagram_url, label: 'Instagram' },
    email                  && { icon: Mail,           href: `mailto:${email}`,     label: 'Email' },
  ].filter(Boolean) as { icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; href: string; label: string }[]

  const connectLinks = [
    profile?.github_url    && { label: 'GitHub',    href: profile.github_url,    icon: FaGithub },
    profile?.linkedin_url  && { label: 'LinkedIn',  href: profile.linkedin_url,  icon: FaLinkedinIn },
    profile?.instagram_url && { label: 'Instagram', href: profile.instagram_url, icon: FaInstagram },
    email                  && { label: 'Email',     href: `mailto:${email}`,     icon: Mail },
  ].filter(Boolean) as { label: string; href: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }[]

  return (
    <>
      <style>{`
        .ft-container {
          background: linear-gradient(180deg, #020617 0%, #030a16 100%);
          position: relative;
          overflow: hidden;
          border-top: 1px solid rgba(125, 211, 252, 0.12);
        }
        .ft-glow {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(rgba(125, 211, 252, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(125, 211, 252, 0.026) 1px, transparent 1px);
          background-size: 58px 58px;
          opacity: 0.7;
          pointer-events: none;
        }
        .ft-brand-icon {
          background: linear-gradient(135deg, #67e8f9 0%, #38bdf8 54%, #a78bfa 100%);
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #020617;
          box-shadow: 0 12px 28px rgba(14, 165, 233, 0.24);
        }
        .ft-social-btn {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.62);
          border: 1px solid rgba(125, 211, 252, 0.14);
          color: var(--color-text-sub);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }
        .ft-social-btn:hover {
          background: rgba(34, 211, 238, 0.1);
          color: #67e8f9;
          border-color: rgba(34, 211, 238, 0.34);
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        /* Instagram hover — pink/purple gradient */
        .ft-social-btn.instagram:hover {
          background: rgba(225, 48, 108, 0.12);
          color: #e1306c;
          border-color: rgba(225, 48, 108, 0.35);
          box-shadow: 0 10px 20px rgba(225, 48, 108, 0.15);
        }
        .ft-link {
          color: var(--color-text-sub);
          transition: all 0.2s ease;
          text-decoration: none;
          font-size: 0.95rem;
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }
        .ft-link-icon {
          width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ft-link:hover {
          color: #67e8f9;
          transform: translateX(4px);
        }
        .ft-bottom-bar {
          border-top: 1px solid rgba(125, 211, 252, 0.12);
          padding-top: 2rem;
          margin-top: 4rem;
        }
        .ft-scroll-top {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: rgba(15, 23, 42, 0.62);
          border: 1px solid rgba(125, 211, 252, 0.14);
          color: var(--color-text-sub);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .ft-scroll-top svg { display: block; }
        .ft-scroll-top:hover {
          background: rgba(34, 211, 238, 0.1);
          color: #fff;
          border-color: rgba(34, 211, 238, 0.34);
          transform: translateY(-2px);
        }
        .ft-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22d3ee;
          box-shadow: 0 0 10px rgba(34, 211, 238, 0.6);
          position: relative;
        }
        .ft-status-dot::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1px solid rgba(34, 211, 238, 0.4);
          animation: pulse 2s infinite;
        }
        .ft-brand-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .ft-brand-name {
          font-weight: 800;
          font-size: 1.4rem;
          color: #fff;
          letter-spacing: 0;
        }
        .ft-brand-accent { color: #67e8f9; }
        .ft-tagline {
          color: var(--color-text-sub);
          font-size: 0.95rem;
          line-height: 1.8;
          max-width: 320px;
        }
        .ft-presence {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .ft-presence-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-text-sub);
          font-size: 0.9rem;
        }
        .ft-presence-item.available {
          color: #67e8f9;
          font-weight: 500;
        }
        .ft-social-row { display: flex; gap: 0.75rem; }
        .ft-column-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #67e8f9;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }
        .ft-link-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        @keyframes pulse {
          0%   { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        @media (max-width: 767.98px) {
          .ft-container { border-top-color: rgba(34, 211, 238, 0.18); }
          .ft-container .container {
            padding-top: 3.5rem !important;
            padding-bottom: 2.5rem !important;
          }
          .ft-brand-block {
            text-align: center;
            padding: 1.35rem;
            border-radius: 22px;
            border: 1px solid rgba(125, 211, 252, 0.16);
            background: linear-gradient(145deg, rgba(15, 23, 42, 0.72), rgba(2, 6, 23, 0.58));
            box-shadow: 0 20px 54px rgba(2, 6, 23, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.045);
          }
          .ft-brand-row { justify-content: center; margin-bottom: 1rem; }
          .ft-brand-icon { width: 48px; height: 48px; border-radius: 15px; }
          .ft-brand-name { font-size: 1.35rem; }
          .ft-tagline {
            max-width: 30rem;
            margin: 0 auto 1.2rem;
            font-size: 0.94rem;
            line-height: 1.75;
          }
          .ft-presence { align-items: center; margin-bottom: 1.25rem; }
          .ft-presence-item { justify-content: center; text-align: center; }
          .ft-social-row { justify-content: center; gap: 0.7rem; }
          .ft-social-btn {
            width: 46px; height: 46px;
            border-radius: 14px;
            background: rgba(2, 6, 23, 0.54);
          }
          .ft-column {
            height: 100%;
            padding: 1.15rem;
            border-radius: 20px;
            border: 1px solid rgba(125, 211, 252, 0.14);
            background: linear-gradient(145deg, rgba(15, 23, 42, 0.66), rgba(2, 6, 23, 0.46));
            box-shadow: 0 16px 44px rgba(2, 6, 23, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.035);
          }
          .ft-mobile-col { flex: 0 0 100%; width: 100%; max-width: 100%; }
          .ft-column-title { margin-bottom: 1rem; text-align: center; letter-spacing: 0.12em; }
          .ft-link-list {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.65rem;
          }
          .ft-link-list li { min-width: 0; }
          .ft-link-list li:last-child:nth-child(odd) { grid-column: 1 / -1; }
          .ft-link {
            width: 100%;
            min-height: 42px;
            justify-content: center;
            gap: 0.55rem;
            padding: 0.62rem 0.72rem;
            border-radius: 13px;
            background: rgba(2, 6, 23, 0.34);
            border: 1px solid rgba(125, 211, 252, 0.1);
            font-size: 0.88rem;
            white-space: nowrap;
          }
          .ft-link:hover { transform: translateY(-1px); }
          .ft-link-icon { width: 18px; }
          .ft-connect-column .ft-link-list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .ft-connect-column .ft-link-list li:last-child:nth-child(odd) { grid-column: auto; }
          .ft-connect-column .ft-link {
            min-height: 46px;
            flex-direction: column;
            gap: 0.35rem;
            padding: 0.68rem 0.45rem;
            white-space: normal;
          }
          .ft-connect-column .ft-link-icon { width: auto; }
          .ft-bottom-bar {
            margin-top: 1.6rem;
            padding: 1.15rem 1rem;
            border: 1px solid rgba(125, 211, 252, 0.14);
            border-radius: 18px;
            background: linear-gradient(145deg, rgba(15, 23, 42, 0.58), rgba(2, 6, 23, 0.42));
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035);
          }
          .ft-bottom-bar p {
            max-width: 18rem;
            line-height: 1.55;
            font-size: 0.86rem !important;
          }
          .ft-scroll-top {
            width: 44px; height: 44px;
            border-radius: 14px;
            background: rgba(2, 6, 23, 0.48);
          }
        }

        @media (max-width: 374.98px) {
          .ft-link-list,
          .ft-connect-column .ft-link-list { grid-template-columns: 1fr; }
          .ft-link-list li:last-child:nth-child(odd) { grid-column: auto; }
          .ft-connect-column .ft-link { flex-direction: row; }
        }
      `}</style>

      <footer className="ft-container">
        <div className="ft-glow" />

        <div className="container py-5 position-relative" style={{ maxWidth: 1100, zIndex: 1 }}>
          <div className="row g-4 g-lg-5">

            {/* ── Brand ── */}
            <div className="col-12 col-lg-4 mb-4 mb-lg-0">
              <div className="ft-brand-block">
                <div className="ft-brand-row">
                  <div className="ft-brand-icon">
                    <Code2 size={20} strokeWidth={2.5} />
                  </div>
                  <span className="ft-brand-name">
                    {firstName}<span className="ft-brand-accent">.dev</span>
                  </span>
                </div>

                <p className="ft-tagline">{tagline}</p>

                <div className="ft-presence">
                  {profile?.location && (
                    <div className="ft-presence-item">
                      <MapPin size={16} style={{ opacity: 0.7 }} /> {profile.location}
                    </div>
                  )}
                  {profile?.is_available_for_work && (
                    <div className="ft-presence-item available">
                      <div className="ft-status-dot" />
                      Available for new opportunities
                    </div>
                  )}
                </div>

                <div className="ft-social-row">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith('mailto') ? '_self' : '_blank'}
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={`ft-social-btn${label === 'Instagram' ? ' instagram' : ''}`}
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Navigation ── */}
            <div className="col-6 col-md-4 col-lg-3 ft-mobile-col">
              <div className="ft-column ft-explore-column">
                <h4 className="font-mono ft-column-title">Explore</h4>
                <ul className="ft-link-list">
                  {NAV_LINKS.map((link) => {
                    const Icon = link.icon
                    return (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          onClick={(e) => {
                            e.preventDefault()
                            document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })
                          }}
                          className="ft-link"
                        >
                          <span className="ft-link-icon"><Icon size={16} style={{ opacity: 0.7 }} /></span>
                          {link.label}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>

            {/* ── Connect ── */}
            {connectLinks.length > 0 && (
              <div className="col-12 col-md-4 col-lg-3 ft-mobile-col">
                <div className="ft-column ft-connect-column">
                  <h4 className="font-mono ft-column-title">Connect</h4>
                  <ul className="ft-link-list">
                    {connectLinks.map((link) => {
                      const Icon = link.icon
                      return (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            target={link.href.startsWith('http') ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            className="ft-link"
                          >
                            <span className="ft-link-icon"><Icon size={16} style={{ opacity: 0.7 }} /></span>
                            {link.label}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            )}

            {/* ── Resources ── */}
            <div className="col-6 col-md-4 col-lg-2 ft-mobile-col">
              <div className="ft-column ft-resources-column">
                <h4 className="font-mono ft-column-title">Resources</h4>
                <ul className="ft-link-list">
                  {profile?.resume_url && (
                    <li>
                      <a href="/resume" className="ft-link">
                        <span className="ft-link-icon"><FileText size={16} style={{ opacity: 0.7 }} /></span>
                        Resume
                      </a>
                    </li>
                  )}
                  <li>
                    <a href="/blog" className="ft-link">
                      <span className="ft-link-icon"><BookOpen size={16} style={{ opacity: 0.7 }} /></span>
                      Blog
                    </a>
                  </li>
                  {profile?.github_url && (
                    <li>
                      <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="ft-link">
                        <span className="ft-link-icon"><ExternalLink size={16} style={{ opacity: 0.7 }} /></span>
                        Source Code
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>

          </div>

          {/* ── Bottom bar ── */}
          <div className="ft-bottom-bar d-flex flex-column flex-md-row align-items-center justify-content-between gap-4 text-center text-md-start">
            <p
              className="d-flex align-items-center justify-content-center gap-2 mb-0"
              style={{ color: 'var(--color-text-sub)', fontSize: '0.9rem' }}
            >
              © {new Date().getFullYear()} {name}. Built with Next.js.
            </p>

            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="ft-scroll-top mx-auto mx-md-0"
            >
              <ChevronUp size={20} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </footer>
    </>
  )
}
