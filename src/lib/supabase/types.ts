// ============================================================
// Supabase Database TypeScript Types
// Generated from schema — update when schema changes
// ============================================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Project, 'id' | 'created_at'>>
      }
      skills: {
        Row: Skill
        Insert: Omit<Skill, 'id' | 'created_at'>
        Update: Partial<Omit<Skill, 'id' | 'created_at'>>
      }
      experiences: {
        Row: Experience
        Insert: Omit<Experience, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Experience, 'id' | 'created_at'>>
      }
      education: {
        Row: Education
        Insert: Omit<Education, 'id' | 'created_at'>
        Update: Partial<Omit<Education, 'id' | 'created_at'>>
      }
      certificates: {
        Row: Certificate
        Insert: Omit<Certificate, 'id' | 'created_at'>
        Update: Partial<Omit<Certificate, 'id' | 'created_at'>>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, 'id' | 'created_at'>
        Update: Partial<Omit<Message, 'id' | 'created_at'>>
      }
      blog_posts: {
        Row: BlogPost
        Insert: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<BlogPost, 'id' | 'created_at'>>
      }
      testimonials: {
        Row: Testimonial
        Insert: Omit<Testimonial, 'id' | 'created_at'>
        Update: Partial<Omit<Testimonial, 'id' | 'created_at'>>
      }
      settings: {
        Row: Setting
        Insert: Setting
        Update: Partial<Setting>
      }
      analytics_events: {
        Row: AnalyticsEvent
        Insert: Omit<AnalyticsEvent, 'id' | 'created_at'>
        Update: never
      }
      activity_logs: {
        Row: ActivityLog
        Insert: Omit<ActivityLog, 'id' | 'created_at'>
        Update: never
      }
    }
  }
}

// ============================================================
// Entity types
// ============================================================

export interface Profile {
  id: string
  user_id: string | null
  name: string
  email: string
  tagline: string | null
  bio: string | null
  avatar_url: string | null
  resume_url: string | null
  is_available_for_work: boolean
  location: string | null
  github_url: string | null
  linkedin_url: string | null
  twitter_url: string | null
  leetcode_url: string | null
  codeforces_url: string | null
  instagram_url: string | null
  meta_title: string | null
  meta_description: string | null
  og_image_url: string | null
  favicon_url: string | null
  apple_icon_url: string | null
  theme_accent_color: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  short_description: string | null
  long_description: string | null
  tech_stack: string[]
  github_url: string | null
  live_url: string | null
  thumbnail_url: string | null
  gallery_urls: string[]
  category: string
  status: 'draft' | 'published' | 'archived'
  is_featured: boolean
  sort_order: number
  view_count: number
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  icon_url: string | null
  icon_slug: string | null
  category: 'frontend' | 'backend' | 'database' | 'mobile' | 'cloud' | 'tools' | 'ai'
  proficiency: number
  is_featured: boolean
  sort_order: number
  created_at: string
}

export interface Experience {
  id: string
  company: string
  role: string
  description: string | null
  logo_url: string | null
  start_date: string
  end_date: string | null
  is_current: boolean
  type: 'job' | 'internship' | 'freelance' | 'contract'
  technologies: string[]
  location: string | null
  company_url: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  grade: string | null
  logo_url: string | null
  institution_url: string | null
  start_date: string
  end_date: string | null
  is_current: boolean
  achievements: string[]
  description: string | null
  sort_order: number
  created_at: string
}

export interface Certificate {
  id: string
  title: string
  issuer: string
  issue_date: string | null
  expiry_date: string | null
  credential_id: string | null
  credential_url: string | null
  image_url: string | null
  is_featured: boolean
  sort_order: number
  created_at: string
}

export interface Message {
  id: string
  name: string
  email: string
  subject: string | null
  body: string
  is_read: boolean
  is_replied: boolean
  ip_address: string | null
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_image_url: string | null
  tags: string[]
  status: 'draft' | 'published'
  is_featured: boolean
  view_count: number
  read_time_minutes: number
  created_at: string
  published_at: string | null
  updated_at: string
}

export interface Testimonial {
  id: string
  name: string
  role: string | null
  company: string | null
  avatar_url: string | null
  content: string
  rating: number
  is_featured: boolean
  sort_order: number
  created_at: string
}

export interface Setting {
  key: string
  value: Json
  updated_at: string
}

export interface AnalyticsEvent {
  id: string
  event_type: string
  page: string | null
  metadata: Json
  user_agent: string | null
  ip_address: string | null
  created_at: string
}

export interface ActivityLog {
  id: string
  action: string
  entity_type: string | null
  entity_id: string | null
  metadata: Json
  created_at: string
}
