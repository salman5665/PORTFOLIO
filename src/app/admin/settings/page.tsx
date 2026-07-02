'use client'

import { useEffect, useState } from 'react'
import { Save, User, Link as LinkIcon, Globe, Activity } from 'lucide-react'
import { adminDb } from '@/lib/adminDb'
import { toast } from 'sonner'
import AdminTopBar from '@/components/admin/AdminTopBar'
import type { Profile } from '@/lib/supabase/types'

const SECTION_STYLE = { borderRadius: 14, border: '1px solid var(--admin-border)' }
const HEADER_STYLE = { fontWeight: 700, color: 'var(--admin-text)', fontSize: '0.875rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--admin-border)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState<Partial<Profile>>({
    name: 'Vinit Soni', email: 'vinitsonii@gmail.com', tagline: 'Full-Stack Developer - MCA Student',
    bio: '', location: 'India', github_url: 'https://github.com/vinitsonii',
    linkedin_url: 'https://linkedin.com/in/vinitsonii', twitter_url: '', leetcode_url: '',
    is_available_for_work: true, meta_title: 'Vinit Soni | Full-Stack Developer', meta_description: '',
  })
  const [saving, setSaving] = useState(false)
  const [profileId, setProfileId] = useState<string | null>(null)

  useEffect(() => {
    adminDb.from('profiles').single({ order: 'updated_at', ascending: false, limit: 1 }).then(({ data }) => {
      if (data) { const d = data as Profile; setProfile(d); setProfileId(d.id) }
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      ...profile,
      updated_at: new Date().toISOString(),
      theme_accent_color: profile.theme_accent_color || '#22d3ee',
    }
    if (profileId) {
      const { error } = await adminDb.from('profiles').update(payload, profileId)
      if (error) { toast.error('Failed to save settings'); setSaving(false); return }
    } else {
      const { data, error } = await adminDb.from('profiles').insert(payload)
      if (error) { toast.error('Failed to save settings'); setSaving(false); return }
      const created = Array.isArray(data) ? data[0] : data
      if (created && typeof created === 'object' && 'id' in created) setProfileId((created as Profile).id)
    }
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

      <div className="admin-page-content admin-settings-content">
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
                  <label className="form-label" htmlFor="settings-avatar-url">Profile Photo URL</label>
                  <div className="d-flex gap-3 align-items-center">
                    {/* Live preview circle */}
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                      border: '2px solid var(--admin-border)',
                      background: 'var(--admin-surface)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden', fontWeight: 800, fontSize: '1.25rem',
                      color: 'var(--admin-text-sub)',
                    }}>
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Avatar preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                        />
                      ) : (profile.name || 'V').charAt(0)}
                    </div>
                    <input
                      id="settings-avatar-url"
                      type="url"
                      className="form-control"
                      value={profile.avatar_url || ''}
                      onChange={e => set('avatar_url', e.target.value)}
                      placeholder="https://... paste your profile photo URL"
                    />
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-sub)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
                    Paste any public image URL · Appears in the About section on your portfolio
                  </div>
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
                  { key: 'github_url',      label: 'GitHub URL',           ph: 'https://github.com/...' },
                  { key: 'linkedin_url',    label: 'LinkedIn URL',         ph: 'https://linkedin.com/in/...' },
                  { key: 'twitter_url',     label: 'Twitter / X URL',      ph: 'https://twitter.com/...' },
                  { key: 'leetcode_url',    label: 'LeetCode URL',         ph: 'https://leetcode.com/...' },
                  { key: 'codeforces_url',  label: 'Codeforces URL',       ph: 'https://codeforces.com/...' },
                  { key: 'instagram_url',   label: 'Instagram URL',        ph: 'https://instagram.com/...' },
                  { key: 'resume_url',      label: 'Resume URL',           ph: 'https://...' },
                  { key: 'favicon_url',     label: 'Favicon URL',          ph: 'https://...' },
                  { key: 'apple_icon_url',  label: 'Apple Touch Icon URL', ph: 'https://...' },
                ] as const).map(({ key, label, ph }) => (
                  <div className="col-sm-6" key={key}>
                    <label className="form-label" htmlFor={`settings-${key}`}>{label}</label>
                    <input id={`settings-${key}`} type="url" className="form-control" value={(profile[key as keyof Profile] as string) || ''} onChange={e => set(key as keyof Profile, e.target.value)} placeholder={ph} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── SEO Metadata ── */}
          <div className="card shadow-sm" style={SECTION_STYLE}>
            <div className="card-body p-4 p-md-5">
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
                <label className="form-label" htmlFor="settings-og-image">OG Image URL</label>
                <input id="settings-og-image" type="url" className="form-control" value={(profile as any).og_image_url || ''} onChange={e => set('og_image_url' as keyof Profile, e.target.value)} placeholder="https://... (1200x630px recommended)" />
              </div>
            </div>
          </div>

          {/* ── System Info ── */}
          <div className="card shadow-sm" style={SECTION_STYLE}>
            <div className="card-body p-4 p-md-5">
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
      </div>
    </>
  )
}
