-- ============================================================
-- Migration 003: Create media_assets table for metadata,
-- duplicate detection, and usage tracking.
-- ============================================================

create table if not exists media_assets (
  id uuid primary key default uuid_generate_v4(),
  filename text not null,
  bucket text not null,
  url text not null unique,
  file_size integer not null,
  mime_type text not null,
  width integer,
  height integer,
  hash text, -- content hash for duplicate detection
  uploaded_at timestamptz default now()
);

-- Enable RLS
alter table media_assets enable row level security;

-- Public read access
create policy "Media assets viewable by all" on media_assets for select using (true);

-- Authenticated all permissions
create policy "Authenticated can manage media assets" on media_assets for all using (auth.role() = 'authenticated');
