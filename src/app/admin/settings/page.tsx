'use client'

import { useEffect, useState } from 'react'
import { Save, User, Link as LinkIcon, Globe, Activity, Bot, Database, Download, GitBranch, Mail, ShieldCheck } from 'lucide-react'
import { adminDb } from '@/lib/adminDb'
import { toast } from 'sonner'
import AdminTopBar from '@/components/admin/AdminTopBar'
import type { Profile } from '@/lib/supabase/types'
import ImageUploader from '@/components/admin/image/ImageUploader'

const SECTION_STYLE = { borderRadius: 14, border: '1px solid var(--admin-border)' }
const HEADER_STYLE = { fontWeight: 700, color: 'var(--admin-text)', fontSize: '0.875rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--admin-border)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState<Partial<Profile>>({
    name: 'Salman', email: 'contact@salman.dev', tagline: 'Full-Stack Developer - MCA Student',
    bio: '', location: 'India', github_url: 'https://github.com/salman5665',
    linkedin_url: 'https://linkedin.com/in/salman', twitter_url: '', leetcode_url: '',
    is_available_for_work: true, is_ai_enabled: true, ai_provider: 'groq', ai_model: 'qwen/qwen3.6-27b', ai_api_key: '',
    meta_title: 'Salman | Full-Stack Developer', meta_description: '',
  })
  const [saving, setSaving] = useState(false)
  const [profileId, setProfileId] = useState<string | null>(null)
  const [backingUp, setBackingUp] = useState<string | null>(null)

  const handleDownloadBackup = (format: 'sql' | 'json') => {
    window.open(`/api/admin/backup?action=download&format=${format}`, '_blank')
  }

  const handleSyncGithub = async () => {
    setBackingUp('github')
    try {
      const res = await fetch('/api/admin/backup?action=github', { method: 'POST' })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.github?.error || json.error || 'Sync failed')
      }
      toast.success('Database backup committed to GitHub!')
    } catch (err: any) {
      toast.error('GitHub sync failed: ' + err.message)
    } finally {
      setBackingUp(null)
    }
  }

  useEffect(() => {
    adminDb.from<Profile>('profiles').select({ order: 'updated_at', ascending: false, limit: 1 }).then(({ data }) => {
      if (data && data.length > 0) { const d = data[0]; setProfile(d); setProfileId(d.id) }
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    // Strip immutable/server-managed fields before sending to the API
    const { id: _id, created_at: _ca, user_id: _uid, ...rest } = profile as Profile & { id?: string; created_at?: string; user_id?: string }
    const payload = {
      ...rest,
      updated_at: new Date().toISOString(),
      theme_accent_color: profile.theme_accent_color || '#22d3ee',
    }
    if (profileId) {
      const { error } = await adminDb.from('profiles').update(payload, profileId)
      if (error) { toast.error('Failed to save: ' + error); setSaving(false); return }
    } else {
      const { data, error } = await adminDb.from('profiles').insert(payload)
      if (error) { toast.error('Failed to save: ' + error); setSaving(false); return }
      const created = Array.isArray(data) ? data[0] : data
      if (created && typeof created === 'object' && 'id' in created) setProfileId((created as Profile).id)
    }
    window.dispatchEvent(new CustomEvent('admin-settings-updated', { detail: payload }))
    toast.success('Settings saved!'); setSaving(false)
  }

  const set = (key: keyof Profile, val: string | boolean) => setProfile(p => ({ ...p, [key]: val }))

  return (
    <>
      <AdminTopBar title="Settings" subtitle="Profile & portfolio configuration"
        action={
          <button onClick={handleSave} disabled={saving} className="btn btn-sm d-flex align-items-center gap-2"
            style={{ background: 'var(--admin-text)', color: 'var(--admin-surface)', borderRadius: 10 }} id="settings-save">
            {saving ? <span className="spinner-border spinner-border-sm" role="status" /> : <Save size={15} />}
            Save Changes
          </button>
        }
      />

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="admin-page-content admin-settings-content">
        <div className="admin-settings-grid">

          {/* ── Profile Information ── */}
          <div className="card shadow-sm" style={SECTION_STYLE}>
            <div className="card-body p-4 p-md-5">
              <div style={HEADER_STYLE}>
                <User size={16} color="#67e8f9" /> Profile Information
              </div>
              <div className="row g-3 mb-3">
                <div className="col-sm-6"><label className="form-label" htmlFor="settings-name">Full Name</label><input id="settings-name" className="form-control" value={profile.name || ''} onChange={e => set('name', e.target.value)} placeholder="Your full name" /></div>
                <div className="col-sm-6"><label className="form-label" htmlFor="settings-email">Email</label><input id="settings-email" type="email" className="form-control" value={profile.email || ''} onChange={e => set('email', e.target.value)} placeholder="your@email.com" /></div>
                <div className="col-sm-6"><label className="form-label" htmlFor="settings-tagline">Tagline</label><input id="settings-tagline" className="form-control" value={profile.tagline || ''} onChange={e => set('tagline', e.target.value)} placeholder="Your headline" /></div>
                <div className="col-sm-6"><label className="form-label" htmlFor="settings-location">Location</label><input id="settings-location" className="form-control" value={profile.location || ''} onChange={e => set('location', e.target.value)} placeholder="City, Country" /></div>
                <div className="col-12"><label className="form-label" htmlFor="settings-bio">Bio</label><textarea id="settings-bio" className="form-control" rows={4} value={profile.bio || ''} onChange={e => set('bio', e.target.value)} placeholder="Tell visitors about yourself..." style={{ resize: 'none' }} /></div>

                {/* ── Profile Photo ── */}
                <div className="col-12">
                  <ImageUploader
                    value={profile.avatar_url || ''}
                    onChange={url => set('avatar_url', url)}
                    bucket="avatars"
                    label="Profile Photo"
                    aspectRatio="1/1"
                  />
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-between p-3 rounded-3" style={{ background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--admin-text)', fontSize: '0.875rem' }}>Available for Work</div>
                  <div style={{ color: 'var(--admin-text-sub)', fontSize: '0.75rem' }}>Shows green availability badge on portfolio</div>
                </div>
                <div className="form-check form-switch mb-0">
                  <input className="form-check-input" type="checkbox" role="switch" id="settings-availability-toggle"
                    checked={!!profile.is_available_for_work} onChange={e => set('is_available_for_work', e.target.checked)}
                    style={{ width: 44, height: 22, cursor: 'pointer' }} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Social Links ── */}
          <div className="card shadow-sm" style={SECTION_STYLE}>
            <div className="card-body p-4 p-md-5">
              <div style={HEADER_STYLE}><LinkIcon size={16} color="#67e8f9" /> Social Links</div>
              <div className="row g-3">
                {([
                  { key: 'github_url',      label: 'GitHub URL',      ph: 'https://github.com/...' },
                  { key: 'linkedin_url',    label: 'LinkedIn URL',    ph: 'https://linkedin.com/in/...' },
                  { key: 'twitter_url',     label: 'Twitter / X URL', ph: 'https://twitter.com/...' },
                  { key: 'leetcode_url',    label: 'LeetCode URL',    ph: 'https://leetcode.com/...' },
                  { key: 'codeforces_url',  label: 'Codeforces URL',  ph: 'https://codeforces.com/...' },
                  { key: 'instagram_url',   label: 'Instagram URL',   ph: 'https://instagram.com/...' },
                  { key: 'resume_url',      label: 'Resume URL',      ph: 'https://...' },
                ] as const).map(({ key, label, ph }) => (
                  <div className="col-sm-6" key={key}>
                    <label className="form-label" htmlFor={`settings-${key}`}>{label}</label>
                    <input id={`settings-${key}`} type="url" className="form-control" value={(profile[key as keyof Profile] as string) || ''} onChange={e => set(key as keyof Profile, e.target.value)} placeholder={ph} />
                  </div>
                ))}
              </div>

              {/* Icon & brand asset uploaders */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--admin-border)' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--admin-text-sub)', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>
                  Icons & Brand Assets
                </div>
                <div className="row g-4">
                  <div className="col-sm-6">
                    <ImageUploader
                      value={profile.favicon_url || ''}
                      onChange={url => set('favicon_url', url)}
                      bucket="seo"
                      label="Favicon (32×32px)"
                      aspectRatio="1/1"
                      maxSizeMb={0.5}
                      accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml"
                    />
                  </div>
                  <div className="col-sm-6">
                    <ImageUploader
                      value={profile.apple_icon_url || ''}
                      onChange={url => set('apple_icon_url', url)}
                      bucket="seo"
                      label="Apple Touch Icon (180×180px)"
                      aspectRatio="1/1"
                      maxSizeMb={1}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── SEO Metadata ── */}
          <div className="card shadow-sm" style={SECTION_STYLE}>
            <div className="card-body p-3 p-sm-4 p-md-5">
              <div style={HEADER_STYLE}><Globe size={16} color="#67e8f9" /> SEO Metadata</div>
              <div className="mb-3">
                <label className="form-label" htmlFor="settings-meta-title">Meta Title</label>
                <input id="settings-meta-title" className="form-control" value={profile.meta_title || ''} onChange={e => set('meta_title', e.target.value)} placeholder="Page title for search engines" />
              </div>
              <div className="mb-1">
                <label className="form-label" htmlFor="settings-meta-desc">Meta Description</label>
                <textarea id="settings-meta-desc" className="form-control" rows={3} value={profile.meta_description || ''} onChange={e => set('meta_description', e.target.value)} placeholder="150-160 character description for search results" style={{ resize: 'none' }} />
              </div>
              <div className="text-end mb-3" style={{ fontSize: '0.75rem', color: 'var(--admin-text-sub)' }}>{(profile.meta_description || '').length}/160</div>
              <div>
                <ImageUploader
                  value={(profile as any).og_image_url || ''}
                  onChange={url => set('og_image_url' as keyof Profile, url)}
                  bucket="seo"
                  label="OG Image (1200 × 630px recommended)"
                  aspectRatio="1200/630"
                />
              </div>
            </div>
          </div>

          {/* ── AI Assistant Settings ── */}
          <div className="card shadow-sm" style={SECTION_STYLE}>
            <div className="card-body p-3 p-sm-4 p-md-5">
              <div style={HEADER_STYLE}><Bot size={16} color="#67e8f9" /> Ask Salman AI Assistant</div>
              
              <div className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-4 gap-3" style={{ background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--admin-text)', fontSize: '0.875rem' }}>Enable AI Chatbot</div>
                  <div style={{ color: 'var(--admin-text-sub)', fontSize: '0.75rem' }}>Shows or hides the floating Ask Salman AI widget on the portfolio</div>
                </div>
                <div className="form-check form-switch mb-0 flex-shrink-0">
                  <input className="form-check-input" type="checkbox" role="switch" id="settings-ai-toggle"
                    checked={profile.is_ai_enabled !== false} onChange={e => set('is_ai_enabled', e.target.checked)}
                    style={{ width: 44, height: 22, cursor: 'pointer' }} />
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="settings-ai-provider">AI Provider</label>
                  <select
                    id="settings-ai-provider"
                    className="form-select"
                    value={profile.ai_provider || 'groq'}
                    onChange={e => set('ai_provider', e.target.value)}
                  >
                    <option value="groq">Groq Cloud (Fast LLMs)</option>
                    <option value="gemini">Google Gemini AI</option>
                    <option value="openai">OpenAI / OpenRouter API</option>
                    <option value="custom">Custom OpenAI-Compatible API</option>
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="settings-ai-model">Model Name / ID</label>
                  <input
                    id="settings-ai-model"
                    type="text"
                    className="form-control"
                    value={profile.ai_model || ''}
                    onChange={e => set('ai_model', e.target.value)}
                    placeholder="e.g. qwen/qwen3.6-27b or gemini-2.0-flash"
                  />
                </div>

                <div className="col-12">
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-sub)', marginBottom: 6 }}>
                    Quick Model Presets (click to apply):
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {[
                      { provider: 'groq', model: 'qwen/qwen3.6-27b', label: 'Groq Qwen 3.6 27B' },
                      { provider: 'groq', model: 'openai/gpt-oss-20b', label: 'Groq GPT-OSS 20B' },
                      { provider: 'gemini', model: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
                      { provider: 'openai', model: 'gpt-4o-mini', label: 'OpenAI GPT-4o-mini' },
                      { provider: 'openai', model: 'deepseek/deepseek-chat', label: 'OpenRouter DeepSeek' },
                    ].map(preset => (
                      <button
                        key={preset.model}
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          set('ai_provider', preset.provider)
                          set('ai_model', preset.model)
                        }}
                        style={{ fontSize: '0.75rem', borderRadius: 8 }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-12 mt-3">
                  <label className="form-label" htmlFor="settings-ai-key">API Key Override (Optional)</label>
                  <input
                    id="settings-ai-key"
                    type="password"
                    autoComplete="off"
                    className="form-control"
                    value={profile.ai_api_key || ''}
                    onChange={e => set('ai_api_key', e.target.value)}
                    placeholder="Leave empty to use environment variables (.env.local)"
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-sub)', marginTop: 4 }}>
                    If empty, backend uses <code>GROQ_API_KEY</code>, <code>GEMINI_API_KEY</code>, or <code>OPENAI_API_KEY</code> from server environment.
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ── Database Backups & Recovery ── */}
          <div className="card shadow-sm" style={SECTION_STYLE}>
            <div className="card-body p-3 p-sm-4 p-md-5">
              <div style={HEADER_STYLE}><Database size={16} color="#67e8f9" /> Database Backups & Recovery</div>
              
              <div className="p-3 rounded-3 mb-4" style={{ background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)' }}>
                <div className="d-flex align-items-center gap-2 mb-1" style={{ fontWeight: 600, color: 'var(--admin-text)', fontSize: '0.875rem' }}>
                  <ShieldCheck size={16} color="#10b981" /> Automated Daily Backups Active
                </div>
                <div style={{ color: 'var(--admin-text-sub)', fontSize: '0.78rem', lineHeight: 1.5 }}>
                  Every day at 00:00 UTC, Vercel Cron automatically generates a database snapshot, commits a <code>.sql</code> backup to GitHub repository (<code>backups/</code> folder), and emails a copy to your configured contact email.
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <button
                    type="button"
                    className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                    onClick={() => handleDownloadBackup('sql')}
                    style={{ background: 'rgba(34, 211, 238, 0.12)', border: '1px solid rgba(34, 211, 238, 0.3)', color: '#67e8f9', fontSize: '0.82rem', fontWeight: 600 }}
                  >
                    <Download size={15} /> Download SQL Dump (.sql)
                  </button>
                  <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-sub)', marginTop: 4, textAlign: 'center' }}>
                    Executable PostgreSQL queries for 1-click restore
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <button
                    type="button"
                    className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                    onClick={() => handleDownloadBackup('json')}
                    style={{ background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#c4b5fd', fontSize: '0.82rem', fontWeight: 600 }}
                  >
                    <Download size={15} /> Download JSON Backup (.json)
                  </button>
                  <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-sub)', marginTop: 4, textAlign: 'center' }}>
                    Raw JSON dump of all 12 database tables
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <button
                    type="button"
                    disabled={backingUp === 'github'}
                    className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                    onClick={handleSyncGithub}
                    style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#6ee7b7', fontSize: '0.82rem', fontWeight: 600 }}
                  >
                    {backingUp === 'github' ? <span className="spinner-border spinner-border-sm" role="status" /> : <GitBranch size={15} />}
                    Sync to GitHub Now
                  </button>
                  <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-sub)', marginTop: 4, textAlign: 'center' }}>
                    Commits backup to <code>salman5665/PORTFOLIO</code>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ── System Info ── */}
          <div className="card shadow-sm" style={SECTION_STYLE}>
            <div className="card-body p-3 p-sm-4 p-md-5">
              <div style={HEADER_STYLE}><Activity size={16} color="#67e8f9" /> System Info</div>
              <div className="row g-3">
                {[
                  { label: 'Framework', value: 'Next.js 16 (App Router)' },
                  { label: 'Database',  value: 'Supabase (PostgreSQL)' },
                  { label: 'Styling',   value: 'Bootstrap 5' },
                  { label: 'Deployment',value: 'Vercel' },
                ].map(({ label, value }) => (
                  <div className="col-sm-6" key={label}>
                    <div className="p-3 rounded-3" style={{ background: 'var(--admin-main-bg)', border: '1px solid var(--admin-border)' }}>
                      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--admin-text-sub)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{label}</div>
                      <div style={{ fontWeight: 600, color: 'var(--admin-text)', fontSize: '0.875rem' }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </form>
    </>
  )
}

