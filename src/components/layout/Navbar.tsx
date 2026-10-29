'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Code2, Download, Mail, User, Zap, Layers, Briefcase, GraduationCap, Award, FileText } from 'lucide-react'
import { FaGithub, FaLinkedinIn, FaInstagram } from 'react-icons/fa'
import type { Profile } from '@/lib/supabase/types'
import { useBodyScrollLock } from '@/lib/hooks/useBodyScrollLock'

const navItems = [
  { label: 'About', href: '#about', icon: User },
  { label: 'Skills', href: '#skills', icon: Zap },
  { label: 'Projects', href: '#projects', icon: Layers },
  { label: 'Experience', href: '#experience', icon: Briefcase },
  { label: 'Education', href: '#education', icon: GraduationCap },
  { label: 'Certificates', href: '#certificates', icon: Award },
  { label: 'Blog', href: '#blog', icon: FileText },
  { label: 'Contact', href: '#contact', icon: Mail },
]

interface Props { profile?: Profile | null }

export default function Navbar({ profile }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const pathname = usePathname()

  const firstName = (profile?.name || 'Salman').split(' ')[0]
  const resumeUrl = '/resume'
  useBodyScrollLock(mobileOpen)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id) }),
      { threshold: 0.3 }
    )
    document.querySelectorAll('section[id]').forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [pathname])

  const handleNav = (href: string) => {
  const isMobileMenuOpen = mobileOpen

  setMobileOpen(false)

  const scrollToSection = () => {
    const element = document.querySelector(href)

    if (element) {
      if ((window as any).lenis) {
        ;(window as any).lenis.scrollTo(element, { offset: -80, duration: 0.9 })
      } else {
        const navbarHeight = 80
        const elementPosition = element.getBoundingClientRect().top + window.scrollY
        window.scrollTo({
          top: elementPosition - navbarHeight,
        })
      }
    }
  }

  if (isMobileMenuOpen) {
    setTimeout(scrollToSection, 300)
  } else {
    scrollToSection()
  }
}

  const mobileSocials = [
    profile?.github_url && { icon: FaGithub, href: profile.github_url, label: 'GitHub' },
    profile?.linkedin_url && { icon: FaLinkedinIn, href: profile.linkedin_url, label: 'LinkedIn' },
    profile?.instagram_url && { icon: FaInstagram, href: profile.instagram_url, label: 'Instagram' },
    profile?.email && { icon: Mail, href: `mailto:${profile.email}`, label: 'Email' },
  ].filter(Boolean) as { icon: React.ComponentType<{ size?: number }>; href: string; label: string }[]

  return (
    <>
      <style>{`
        .portfolio-brand {
          display: inline-flex;
          align-items: center;
          gap: 0.72rem;
          padding: 0.35rem 0.58rem 0.35rem 0.38rem;
          border-radius: 16px;
          text-decoration: none;
          transition: background-color 0.22s ease, border-color 0.22s ease, transform 0.22s ease;
          border: 1px solid transparent;
        }

        .portfolio-brand:hover {
          background: rgba(15, 23, 42, 0.48);
          border-color: rgba(125, 211, 252, 0.14);
          transform: translateY(-1px);
        }

        .portfolio-brand-mark {
          position: relative;
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #020617;
          background: linear-gradient(135deg, #67e8f9 0%, #38bdf8 48%, #8b5cf6 100%);
          box-shadow: 0 14px 34px rgba(14, 165, 233, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.36);
          overflow: hidden;
          flex-shrink: 0;
        }

        .portfolio-brand-mark::before {
          content: '';
          position: absolute;
          inset: 1px;
          border-radius: 13px;
          background:
            linear-gradient(rgba(255, 255, 255, 0.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.14) 1px, transparent 1px);
          background-size: 10px 10px;
          opacity: 0.45;
        }

        .portfolio-brand-mark svg {
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 1px 0 rgba(255,255,255,0.35));
        }

        .portfolio-brand-copy {
          display: flex;
          flex-direction: column;
          line-height: 1.05;
        }

        .portfolio-brand-name {
          color: #f8fafc;
          font-size: 1.04rem;
          font-weight: 850;
          letter-spacing: 0;
        }

        .portfolio-brand-suffix {
          background: linear-gradient(90deg, #67e8f9, #a78bfa);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .portfolio-brand-role {
          color: rgba(148, 163, 184, 0.82);
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-top: 0.22rem;
        }

        @media (max-width: 575.98px) {
          .portfolio-brand {
            gap: 0.55rem;
            padding-right: 0.35rem;
          }

          .portfolio-brand-mark {
            width: 38px;
            height: 38px;
            border-radius: 13px;
          }

          .portfolio-brand-role {
            display: none;
          }

          .portfolio-brand-name {
            font-size: 0.98rem;
          }
        }

        .nav-mobile-social-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
        }

        .nav-mobile-social-btn:hover {
          background: rgba(34, 211, 238, 0.1);
          color: #67e8f9;
          border-color: rgba(34, 211, 238, 0.34);
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(34, 211, 238, 0.16);
        }

        .nav-mobile-social-btn.instagram:hover {
          background: rgba(225, 48, 108, 0.12);
          color: #e1306c;
          border-color: rgba(225, 48, 108, 0.35);
          box-shadow: 0 8px 16px rgba(225, 48, 108, 0.15);
        }
      `}</style>

      <nav
        className="navbar portfolio-nav fixed-top navbar-expand-xl"
        style={{
          zIndex: 1050,
          fontFamily: "'Inter', sans-serif",
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          background: scrolled || mobileOpen ? 'rgba(5, 7, 20, 0.85)' : 'transparent',
          backdropFilter: scrolled || mobileOpen ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled || mobileOpen ? 'blur(20px)' : 'none',
          borderBottom: scrolled || mobileOpen ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid transparent',
          padding: scrolled ? '0.75rem 0' : '1.25rem 0',
        }}
      >
        <div className="container" style={{ maxWidth: 1280 }}>
          {/* Logo */}
          <Link href="/" className="navbar-brand portfolio-brand" aria-label={profile?.name || 'Portfolio'}>
            <div className="portfolio-brand-mark">
              <Code2 size={20} strokeWidth={2.6} />
            </div>
            <span className="portfolio-brand-copy">
              <span className="portfolio-brand-name">{firstName}<span className="portfolio-brand-suffix">.dev</span></span>
              <span className="portfolio-brand-role">Full-stack</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav align-items-center gap-1 me-4">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.replace('#', '')
                return (
                  <li className="nav-item" key={item.href}>
                    <button
                      onClick={() => handleNav(item.href)}
                      className="nav-link btn btn-link text-decoration-none px-3 py-2 d-flex align-items-center gap-2 position-relative group"
                      style={{
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                        fontSize: '0.85rem',
                        border: 'none',
                        background: 'none',
                        borderRadius: 8,
                        transition: 'color 0.2s ease',
                      }}>
                      <item.icon size={15} style={{ 
                        color: isActive ? '#00D4FF' : 'rgba(255,255,255,0.4)',
                        transition: 'color 0.2s ease'
                      }} />
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="position-absolute bottom-0 start-50 translate-middle-x"
                          style={{ width: '60%', height: 2, background: 'linear-gradient(90deg, #5B5FEE, #00D4FF)', borderRadius: 2 }}
                        />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="d-flex align-items-center">
              <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                href={resumeUrl} target="_blank" rel="noopener noreferrer"
                className="btn d-flex align-items-center gap-2"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  borderRadius: 12,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  padding: '10px 20px',
                  backdropFilter: 'blur(10px)',
                }}>
                <Download size={15} /> Resume
              </motion.a>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button className="navbar-toggler border-0 shadow-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu">
            {mobileOpen ? <X size={22} color="#ffffff" /> : <Menu size={22} color="#ffffff" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }} 
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }} 
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }} 
            transition={{ duration: 0.3 }}
            className="position-fixed w-100 overflow-auto overlay-scroll-lock"
            style={{ top: 0, bottom: 0, left: 0, zIndex: 1040, background: 'rgba(5, 7, 20, 0.98)', paddingTop: 100, paddingLeft: 24, paddingRight: 24, paddingBottom: 'max(24px, env(safe-area-inset-bottom))', height: '100dvh', maxHeight: '100dvh', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}>
            <ul className="list-unstyled mb-5">
              {navItems.map((item, i) => {
                const isActive = activeSection === item.href.replace('#', '')
                return (
                  <motion.li 
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <button onClick={() => handleNav(item.href)}
                      className="btn btn-link text-decoration-none w-100 text-start py-3 d-flex align-items-center gap-3"
                      style={{ 
                        color: isActive ? '#fff' : 'rgba(255,255,255,0.7)', 
                        fontWeight: isActive ? 600 : 500, 
                        fontSize: '1.25rem',
                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                      }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: isActive ? 'rgba(0, 212, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isActive ? '#00D4FF' : 'rgba(255,255,255,0.5)',
                      }}>
                        <item.icon size={20} />
                      </div>
                      {item.label}
                    </button>
                  </motion.li>
                )
              })}
            </ul>
            <motion.a 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              href={resumeUrl} target="_blank" rel="noopener noreferrer"
              className="btn w-100 mb-4 d-flex align-items-center justify-content-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #5B5FEE 0%, #7C3AED 100%)',
                color: '#fff', border: 'none', borderRadius: 14, padding: '14px',
                fontWeight: 600, fontSize: '1rem',
                boxShadow: '0 10px 25px rgba(91,95,238,0.3)'
              }}>
              <Download size={18} /> Download Resume
            </motion.a>
            {mobileSocials.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="d-flex justify-content-center gap-4 pt-4 pb-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {mobileSocials.map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} target={href.startsWith('mailto') ? '_self' : '_blank'}
                    rel="noopener noreferrer" aria-label={label}
                    className={`nav-mobile-social-btn ${label.toLowerCase()}`}>
                    <Icon size={20} />
                  </a>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
