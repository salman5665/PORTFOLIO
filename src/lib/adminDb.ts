import { supabase } from '@/lib/supabase/client'

/**
 * adminDb - Client-side helper that sends all admin writes through the
 * /api/admin-db server route (which uses the service_role key to bypass RLS).
 *
 * Usage:
 *   const { data, error } = await adminDb.from('skills').select()
 *   const { data, error } = await adminDb.from('skills').insert({ name: 'React', ... })
 *   const { data, error } = await adminDb.from('skills').update({ name: 'Vue' }, 'skill-id')
 *   const { data, error } = await adminDb.from('skills').delete('skill-id')
 */

interface DbResult<T = unknown> {
  data: T | null
  error: string | null
}

interface QueryOptions {
  select?: string
  order?: string
  ascending?: boolean
  limit?: number
  single?: boolean
  where?: Record<string, unknown>
}

async function send<T = unknown>(body: object): Promise<DbResult<T>> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/admin-db', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify(body),
    })
    const json = await res.json()
    if (!res.ok) return { data: null, error: json.error || 'Request failed' }
    return { data: json.data, error: null }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { data: null, error: err.message || 'Network error' }
    }
    return { data: null, error: 'Network error' }
  }
}

function tableBuilder<T = unknown>(table: string) {
  return {
    /** SELECT rows from a table */
    select(opts?: QueryOptions): Promise<DbResult<T[]>> {
      return send<T[]>({ table, action: 'select', data: opts, where: opts?.where })
    },
    /** SELECT a single row */
    single(opts?: Omit<QueryOptions, 'single'>): Promise<DbResult<T>> {
      return send<T>({ table, action: 'select', data: { ...opts, single: true }, where: opts?.where })
    },
    /** INSERT a new row */
    insert(data: Partial<T> | object): Promise<DbResult<T>> {
      return send<T>({ table, action: 'insert', data })
    },
    /** UPDATE an existing row by id */
    update(data: Partial<T> | object, id: string): Promise<DbResult<T>> {
      return send<T>({ table, action: 'update', data, id })
    },
    /** DELETE a row by id */
    delete(id: string): Promise<DbResult<T>> {
      return send<T>({ table, action: 'delete', id })
    },
    /** UPSERT rows */
    upsert(data: Partial<T> | object): Promise<DbResult<T>> {
      return send<T>({ table, action: 'upsert', data })
    },
  }
}

export const adminDb = {
  from: <T = unknown>(table: string) => tableBuilder<T>(table),
}
