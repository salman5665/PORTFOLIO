-- ============================================================
-- Migration 005: Add missing AI, SEO & branding columns to profiles
-- These columns are referenced in TypeScript types and admin UI
-- but were never added to the initial schema.
-- ============================================================

-- AI assistant settings
alter table profiles add column if not exists is_ai_enabled boolean default true;
alter table profiles add column if not exists ai_provider text default 'groq';
alter table profiles add column if not exists ai_model text default 'llama-3.3-70b-versatile';
alter table profiles add column if not exists ai_api_key text;

-- SEO / branding assets
alter table profiles add column if not exists favicon_url text;
alter table profiles add column if not exists apple_icon_url text;
