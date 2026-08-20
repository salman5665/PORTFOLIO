'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, Copy, Check, MapPin, Clock } from 'lucide-react'
import { FaGithub, FaLinkedinIn, FaTwitter, FaInstagram } from 'react-icons/fa'
import { toast } from 'sonner'
import type { Profile } from '@/lib/supabase/types'

interface Props { profile?: Profile | null }

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
      onClick={copy} aria-label="Copy"
      className="btn btn-sm d-flex align-items-center justify-content-center"
      style={{ width: 30, height: 30, background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 8, padding: 0, color: 'var(--color-text-muted)' }}>
      {copied ? <Check size={13} color="#22c55e" /> : <Copy size={13} />}
    </motion.button>
  )
}

export default function ContactSection({ profile }: Props) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', body: '' })
  const [sending, setSending] = useState(false)

  const email = profile?.email || 'vinitsonii@gmail.com'
  const location = profile?.location || 'India'
  const isAvailable = profile ? profile.is_available_for_work : true

  const socialCards = [
    profile?.github_url && { label: 'GitHub', href: profile.github_url, icon: FaGithub, display: '@' + (profile.github_url.replace('https://github.com/', '')) },
    profile?.linkedin_url && { label: 'LinkedIn', href: profile.linkedin_url, icon: FaLinkedinIn, display: profile.linkedin_url.split('/in/')[1] || 'LinkedIn' },
    { label: 'Email', href: `mailto:${email}`, icon: Mail, display: email },
    (profile?.instagram_url || 'https://instagram.com/vinitsonii') && {
      label: 'Instagram',
      href: profile?.instagram_url || 'https://instagram.com/vinitsonii',
      icon: FaInstagram,
      display:
        '@' +
        (profile?.instagram_url || 'vinitsonii')
          .replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '')
          .replace(/^@/, '')
          .replace(/\/$/, '')
    }
  ].filter(Boolean) as { label: string; href: string; icon: React.ComponentType<{ size?: number }>; display: string }[]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.body) { toast.error('Please fill in all required fields.'); return }
    setSending(true)
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) { toast.success("Message sent! I'll get back to you soon."); setForm({ name: '', email: '', subject: '', body: '' }) }
      else toast.error('Failed to send. Please try emailing me directly.')
    } catch { toast.error('Network error. Please try again.') } finally { setSending(false) }
  }

  return (
    <section id="contact" className="section section-alt">
      <div className="container" style={{ maxWidth: 1000 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.35 }} className="mb-5">
          <div className="section-tag gap-2 mb-3"><Mail size={13} /> Get In Touch</div>
          <h2 className="section-title">Let&apos;s Build Something Great</h2>
          <p className="section-subtitle">
            {isAvailable
              ? "I'm currently open to freelance work and full-time opportunities. Have a project in mind?"
              : "Have a project or question? Send me a message and I'll get back to you!"}
          </p>
        </motion.div>

        <div className="row g-5 align-items-start">
          {/* Left — Info */}
          <motion.div className="col-lg-5"
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ delay: 0.05, duration: 0.35 }}>
            <motion.div className="card shadow-vs mb-4" whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.8 }}
                    style={{ width: 10, height: 10, borderRadius: '50%', background: isAvailable ? '#22c55e' : '#f59e0b', display: 'inline-block' }} />
                  <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>
                    {isAvailable ? 'Currently Available' : 'Open to Discuss'}
                  </span>
                </div>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="font-mono" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={11} /> Location
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.9rem' }}>{location}</div>
                  </div>
                  <div className="col-6">
                    <div className="font-mono" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={11} /> Response
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.9rem' }}>Within 24h</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="d-flex flex-column gap-3">
              {socialCards.map((link, i) => (
                <motion.div key={link.label} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ delay: i * 0.05, duration: 0.3 }}>
                  <div className="card shadow-vs">
                    <div className="card-body p-3 d-flex align-items-center gap-3">
                      <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                        style={{ width: 40, height: 40, background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                        <link.icon size={17} />
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="font-mono" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: 2 }}>{link.label}</div>
                        <a href={link.href} target={link.href.startsWith('mailto') ? '_self' : '_blank'} rel="noopener noreferrer"
                          style={{ color: 'var(--color-text)', fontSize: '0.85rem', fontWeight: 600, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: 'none' }}>
                          {link.display}
                        </a>
                      </div>
                      <CopyButton text={link.display} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div className="col-lg-7"
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ delay: 0.1, duration: 0.35 }}>
            <div className="card shadow-vs">
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit} id="contact-form">
                  <div className="row g-4 mb-4">
                    <div className="col-sm-6">
                      <label htmlFor="contact-name" className="form-label">Name *</label>
                      <input id="contact-name" type="text" className="form-control" placeholder="Your name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="contact-email" className="form-label">Email *</label>
                      <input id="contact-email" type="email" className="form-control" placeholder="your@email.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="contact-subject" className="form-label">Subject</label>
                    <input id="contact-subject" type="text" className="form-control" placeholder="Project idea, job opportunity..." value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="contact-message" className="form-label">Message *</label>
                    <textarea id="contact-message" className="form-control" rows={5} placeholder="Tell me about your project..." value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} required style={{ resize: 'none' }} />
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    type="submit" disabled={sending} className="btn btn-dark w-100 d-flex align-items-center justify-content-center gap-2"
                    id="contact-submit" style={{ padding: '0.875rem', fontWeight: 700 }}>
                    {sending
                      ? <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> Sending...</>
                      : <><Send size={16} /> Send Message</>}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
