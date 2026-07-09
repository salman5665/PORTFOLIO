'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { adminDb } from '@/lib/adminDb'

export interface UploadResult {
  url: string
  path: string
  bucket: string
  duplicate?: boolean
  asset?: any
}

export interface UseImageUploadOptions {
  bucket: string
  maxSizeMb?: number
}

export interface ImageUsage {
  table: string
  name: string
  id: string
}

/** Compute a SHA-256 hash of a file's content natively in the browser */
export async function computeFileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/** Retrieve image dimensions */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve({ width: 0, height: 0 })
      return
    }
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({ width: 0, height: 0 })
    }
    img.src = url
  })
}

/** Query all tables in the database to see where an image URL is used */
export async function getImageUsage(url: string): Promise<ImageUsage[]> {
  const usages: ImageUsage[] = []

  try {
    // 1. Projects
    const { data: projects } = await adminDb.from('projects').select()
    if (projects) {
      for (const p of (projects as any[])) {
        if (p.thumbnail_url === url) {
          usages.push({ table: 'Projects (Thumbnail)', name: p.title, id: p.id })
        }
        if (Array.isArray(p.gallery_urls) && p.gallery_urls.includes(url)) {
          usages.push({ table: 'Projects (Gallery)', name: p.title, id: p.id })
        }
      }
    }

    // 2. Blog Posts
    const { data: posts } = await adminDb.from('blog_posts').select()
    if (posts) {
      for (const b of (posts as any[])) {
        if (b.cover_image_url === url) {
          usages.push({ table: 'Blog Posts (Cover)', name: b.title, id: b.id })
        }
      }
    }

    // 3. Certificates
    const { data: certs } = await adminDb.from('certificates').select()
    if (certs) {
      for (const c of (certs as any[])) {
        if (c.image_url === url) {
          usages.push({ table: 'Certificates', name: c.title, id: c.id })
        }
      }
    }

    // 4. Testimonials
    const { data: testimonials } = await adminDb.from('testimonials').select()
    if (testimonials) {
      for (const t of (testimonials as any[])) {
        if (t.avatar_url === url) {
          usages.push({ table: 'Testimonials (Avatar)', name: t.name, id: t.id })
        }
      }
    }

    // 5. Profiles
    const { data: profiles } = await adminDb.from('profiles').select()
    if (profiles) {
      for (const p of (profiles as any[])) {
        if (p.avatar_url === url) {
          usages.push({ table: 'Profiles (Avatar)', name: p.name, id: p.id })
        }
        if (p.og_image_url === url) {
          usages.push({ table: 'Profiles (OG Image)', name: p.name, id: p.id })
        }
        if (p.favicon_url === url) {
          usages.push({ table: 'Profiles (Favicon)', name: p.name, id: p.id })
        }
        if (p.apple_icon_url === url) {
          usages.push({ table: 'Profiles (Apple Icon)', name: p.name, id: p.id })
        }
      }
    }
  } catch (e) {
    console.error('Error fetching image usage:', e)
  }

  return usages
}

export function useImageUpload({ bucket, maxSizeMb = 5 }: UseImageUploadOptions) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  /** Build a sanitized, timestamped filename to avoid collisions */
  const buildFileName = (file: File): string => {
    const safe = file.name
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '')

    const parts = safe.split('.')
    const ext = parts.pop() ?? 'bin'
    const base = parts.join('.') || 'image'

    const d = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const stamp = `${pad(d.getDate())}${pad(d.getMonth() + 1)}${String(d.getFullYear()).slice(-2)}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`

    return `${base}_${stamp}.${ext}`
  }

  /** Optionally compress the image using browser-image-compression if available */
  const maybeCompress = async (file: File, compress: boolean): Promise<File> => {
    if (!compress || !file.type.startsWith('image/')) return file
    try {
      // Dynamic import so the package is optional — falls back to original if not installed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mod = await import(/* webpackIgnore: true */ 'browser-image-compression' as any)
      const imageCompression = mod.default ?? mod
      const compressed = await imageCompression(file, {
        maxSizeMB: Math.min(maxSizeMb, 1),
        maxWidthOrHeight: 2048,
        useWebWorker: true,
        onProgress: (p: number) => setProgress(Math.round(p * 0.5)), // 0–50% for compression
      })
      return new File([compressed], file.name, { type: compressed.type })
    } catch {
      // If library not installed or compression fails, use original
      return file
    }
  }

  const upload = useCallback(
    async (file: File, compress = false, force = false, overwriteName?: string): Promise<UploadResult | null> => {
      setError(null)
      setProgress(0)

      // Validate size
      const maxBytes = maxSizeMb * 1024 * 1024
      if (file.size > maxBytes) {
        setError(`File too large. Maximum size is ${maxSizeMb}MB.`)
        return null
      }

      // Validate type
      if (!file.type.startsWith('image/')) {
        setError('Only image files are supported.')
        return null
      }

      setUploading(true)

      try {
        // Optional compression (0–50% of progress bar)
        const processedFile = await maybeCompress(file, compress)

        // Compute hash for duplicate detection
        const hash = await computeFileHash(processedFile)

        // Duplicate Detection: Check if hash already exists in media_assets
        if (!force && !overwriteName) {
          const { data: duplicates } = await adminDb.from<any>('media_assets').select({ where: { hash } })
          if (duplicates && duplicates.length > 0) {
            setUploading(false)
            return {
              url: duplicates[0].url,
              path: duplicates[0].filename,
              bucket: duplicates[0].bucket,
              duplicate: true,
              asset: duplicates[0],
            }
          }
        }

        const fileName = overwriteName || buildFileName(processedFile)
        const dimensions = await getImageDimensions(processedFile)

        // Simulate progress for the upload portion (50–100%)
        // Supabase JS v2 doesn't expose XHR progress, so we fake it
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            const next = prev + Math.random() * 12
            return next >= 90 ? 90 : Math.round(next)
          })
        }, 150)

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, processedFile, {
            cacheControl: '3600',
            upsert: !!overwriteName,
            contentType: processedFile.type,
          })

        clearInterval(progressInterval)

        if (uploadError) {
          setError(uploadError.message)
          setUploading(false)
          setProgress(0)
          return null
        }

        setProgress(100)

        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(fileName)

        // Save metadata automatically to media_assets
        const assetPayload = {
          filename: fileName,
          bucket,
          url: publicUrl,
          file_size: processedFile.size,
          mime_type: processedFile.type,
          width: dimensions.width || null,
          height: dimensions.height || null,
          hash,
          uploaded_at: new Date().toISOString(),
        }

        await adminDb.from('media_assets').upsert(assetPayload)

        setUploading(false)
        return { url: publicUrl, path: fileName, bucket }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Upload failed'
        setError(msg)
        setUploading(false)
        setProgress(0)
        return null
      }
    },
    [bucket, maxSizeMb]
  )

  const reset = useCallback(() => {
    setError(null)
    setProgress(0)
    setUploading(false)
  }, [])

  return { upload, uploading, progress, error, reset }
}
