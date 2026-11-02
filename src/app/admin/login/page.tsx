'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Code2, Mail, Lock, Eye, EyeOff, Shield, AlertCircle, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Link from 'next/link'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [redirect, setRedirect] = useState('/admin')
  const router = useRouter()

  useEffect(() => {
    const nextRedirect = new URLSearchParams(window.location.search).get('redirect')
    if (nextRedirect?.startsWith('/admin')) setRedirect(nextRedirect)
  }, [])

  // If already logged in, skip to admin
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace(redirect)
    })
  }, [redirect, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('Email is required.'); return }
    if (!password) { setError('Password is required.'); return }
    setLoading(true)

    const { error: authErr } = await supabase.auth.signInWithPassword({ email: email.trim(), password })

    if (authErr) {
      // Show user-friendly error messages
      const msg =
        authErr.message.includes('Invalid login') ? 'Invalid email or password.' :
        authErr.message.includes('Email not confirmed') ? 'Please confirm your email first.' :
        authErr.message.includes('Too many') ? 'Too many attempts. Please wait a moment.' :
        authErr.message
      setError(msg)
      setLoading(false)
      return
    }

    toast.success('Welcome back! Redirecting...')
    router.replace(redirect)
    router.refresh()
  }

  const inputStyle = {
    background: 'var(--admin-main-bg)',
    border: '1px solid var(--admin-border)',
    borderRadius: 12,
    color: 'var(--admin-text)',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-outfit)',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    height: 44,
  }
  const focusIn = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#D4AF37'
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212, 175, 55,0.14)'
    e.currentTarget.style.background = 'var(--admin-surface)'
  }
  const focusOut = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'var(--admin-border)'
    e.currentTarget.style.boxShadow = 'none'
    e.currentTarget.style.background = 'var(--admin-main-bg)'
  }

  return (
    <form onSubmit={handleSubmit} id="admin-login-form" noValidate>
      {/* Error banner */}
      {error && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="d-flex align-items-start gap-2 p-3 rounded-3 mb-4"
          style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '0.875rem' }}>
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Email */}
      <div className="mb-3">
        <label htmlFor="admin-email" className="form-label d-flex align-items-center gap-1"
          style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--admin-text)' }}>
          <Mail size={13} /> Email Address
        </label>
        <input
          id="admin-email" type="email" value={email}
          onChange={e => setEmail(e.target.value)}
          required autoComplete="email"
          className="form-control"
          style={inputStyle}
          onFocus={focusIn} onBlur={focusOut}
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <label htmlFor="admin-password" className="form-label d-flex align-items-center gap-1"
          style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--admin-text)' }}>
          <Lock size={13} /> Password
        </label>
        <div className="position-relative">
          <input
            id="admin-password" type={showPw ? 'text' : 'password'}
            value={password} onChange={e => setPassword(e.target.value)}
            required autoComplete="current-password"
            className="form-control"
            style={{ ...inputStyle, paddingRight: '3rem' }}
            onFocus={focusIn} onBlur={focusOut}
          />
          <button type="button" onClick={() => setShowPw(v => !v)}
            className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent me-3"
            style={{ color: 'var(--admin-text-sub)', cursor: 'pointer', padding: 4 }}
            aria-label="Toggle password visibility">
            {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <motion.button
        type="submit" disabled={loading}
        whileHover={loading ? {} : { scale: 1.01 }} whileTap={loading ? {} : { scale: 0.98 }}
        className="btn w-100 d-flex align-items-center justify-content-center gap-2"
        id="admin-login-submit"
        style={{
          background: 'linear-gradient(135deg, #F5D77F, #D4AF37 52%, #B8860B)', color: '#0A0800', borderRadius: 12,
          height: 46, fontWeight: 700, fontSize: '0.92rem', border: 'none',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={e => !loading && ((e.currentTarget as HTMLElement).style.filter = 'brightness(1.08)')}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.filter = 'none')}
      >
        {loading
          ? <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> Signing in...</>
          : <><Shield size={17} /> Sign in to Dashboard</>}
      </motion.button>

      <p className="text-center mt-4 mb-0" style={{ fontSize: '0.75rem', color: 'var(--admin-text-sub)' }}>
        Private portfolio workspace.
      </p>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="admin-login-screen min-vh-100 w-100 d-flex align-items-center justify-content-center p-3"
      style={{ background: 'linear-gradient(135deg, #0A0800 0%, #120E04 52%, #0A0800 100%)' }}>
      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: 380 }}>

        {/* Card */}
        <div className="admin-login-card card shadow-sm" style={{ borderRadius: 18, border: '1px solid var(--admin-border)', overflow: 'hidden' }}>
          {/* Top accent bar */}
          <div style={{ height: 4, background: 'linear-gradient(90deg, #F5D77F, #D4AF37, #B8860B)' }} />

          <div className="card-body p-4">
            {/* Logo */}
            <div className="text-center mb-4">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #F5D77F, #D4AF37 52%, #B8860B)', borderRadius: 14, boxShadow: '0 12px 34px rgba(212, 175, 55,0.24)' }}>
                <Code2 size={24} color="#0A0800" />
              </motion.div>
              <h1 style={{ fontWeight: 800, color: 'var(--admin-text)', fontSize: '1.35rem', letterSpacing: '-0.02em', marginBottom: 4 }}>
                Salman Studio
              </h1>
              <p style={{ color: 'var(--admin-text-sub)', fontSize: '0.72rem', margin: 0, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Private Control Room
              </p>
            </div>

            <LoginForm />
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-4">
          <Link href="/"
            className="d-inline-flex align-items-center gap-2"
            style={{ color: 'var(--admin-text-sub)', fontSize: '0.825rem', textDecoration: 'none', fontFamily: 'var(--font-mono)', transition: 'color 0.2s ease' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--admin-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--admin-text-sub)')}>
            <ArrowLeft size={14} /> Back to portfolio
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

