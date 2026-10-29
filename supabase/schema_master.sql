-- ============================================================
-- MASTER SUPABASE DATABASE SCHEMA
-- Portfolio Application — Clean, Empty & Production-Ready
-- ============================================================

-- 1. Enable Required Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ============================================================
-- TABLE: profiles
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null default 'Salman',
  email text not null default 'contact@salman.dev',
  tagline text default 'Full-Stack Developer',
  bio text default '',
  avatar_url text,
  resume_url text,
  is_available_for_work boolean default true,
  location text default 'India',
  -- Social links
  github_url text default 'https://github.com/salman5665',
  linkedin_url text default 'https://linkedin.com/in/salman',
  twitter_url text,
  leetcode_url text,
  codeforces_url text,
  instagram_url text,
  -- SEO & Branding
  meta_title text default 'Salman | Full-Stack Developer',
  meta_description text default 'Full-stack developer portfolio showcasing projects, experience, and modern web applications.',
  og_image_url text,
  favicon_url text,
  apple_icon_url text,
  theme_accent_color text default '#00f5ff',
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TABLE: projects
-- ============================================================
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text,
  long_description text,
  tech_stack jsonb default '[]'::jsonb,
  github_url text,
  live_url text,
  thumbnail_url text,
  gallery_urls jsonb default '[]'::jsonb,
  category text default 'web' check (category in ('web', 'mobile', 'api', 'ai', 'other')),
  status text default 'published' check (status in ('draft', 'published', 'archived')),
  is_featured boolean default false,
  sort_order integer default 0,
  view_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_projects_slug on public.projects(slug);
create index if not exists idx_projects_status on public.projects(status);
create index if not exists idx_projects_is_featured on public.projects(is_featured);
create index if not exists idx_projects_sort_order on public.projects(sort_order);

-- ============================================================
-- TABLE: skills
-- ============================================================
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon_url text,
  icon_slug text,
  category text not null check (category in ('frontend', 'backend', 'database', 'mobile', 'cloud', 'tools', 'ai', 'languages')),
  proficiency integer default 80 check (proficiency between 0 and 100),
  is_featured boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_skills_category on public.skills(category);
create index if not exists idx_skills_featured on public.skills(is_featured);
create index if not exists idx_skills_sort_order on public.skills(sort_order);

-- ============================================================
-- TABLE: experiences
-- ============================================================
create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  description text,
  logo_url text,
  start_date date not null,
  end_date date,
  is_current boolean default false,
  type text default 'job' check (type in ('job', 'internship', 'freelance', 'contract')),
  technologies jsonb default '[]'::jsonb,
  location text,
  company_url text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_experiences_sort_order on public.experiences(sort_order);

-- ============================================================
-- TABLE: education
-- ============================================================
create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  degree text not null,
  field text not null,
  grade text,
  logo_url text,
  institution_url text,
  start_date date not null,
  end_date date,
  is_current boolean default false,
  achievements jsonb default '[]'::jsonb,
  description text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_education_sort_order on public.education(sort_order);

-- ============================================================
-- TABLE: certificates
-- ============================================================
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issue_date date,
  expiry_date date,
  credential_id text,
  credential_url text,
  image_url text,
  is_featured boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_certificates_sort_order on public.certificates(sort_order);

-- ============================================================
-- TABLE: messages
-- ============================================================
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  body text not null,
  is_read boolean default false,
  is_replied boolean default false,
  ip_address text,
  created_at timestamptz default now()
);

create index if not exists idx_messages_is_read on public.messages(is_read);
create index if not exists idx_messages_created_at on public.messages(created_at desc);

-- ============================================================
-- TABLE: blog_posts
-- ============================================================
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image_url text,
  tags jsonb default '[]'::jsonb,
  status text default 'draft' check (status in ('draft', 'published')),
  is_featured boolean default false,
  view_count integer default 0,
  read_time_minutes integer default 5,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_blog_slug on public.blog_posts(slug);
create index if not exists idx_blog_status on public.blog_posts(status);

-- ============================================================
-- TABLE: testimonials
-- ============================================================
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  company text,
  avatar_url text,
  content text not null,
  rating integer default 5 check (rating between 1 and 5),
  is_featured boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_testimonials_sort_order on public.testimonials(sort_order);

-- ============================================================
-- TABLE: settings
-- ============================================================
create table if not exists public.settings (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);

-- ============================================================
-- TABLE: media_assets
-- ============================================================
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  bucket text not null,
  url text not null unique,
  file_size integer not null,
  mime_type text not null,
  width integer,
  height integer,
  hash text,
  uploaded_at timestamptz default now()
);

create index if not exists idx_media_assets_bucket on public.media_assets(bucket);
create index if not exists idx_media_assets_uploaded_at on public.media_assets(uploaded_at desc);

-- ============================================================
-- TABLE: analytics_events
-- ============================================================
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  page text,
  metadata jsonb default '{}'::jsonb,
  user_agent text,
  ip_address text,
  created_at timestamptz default now()
);

create index if not exists idx_analytics_event_type on public.analytics_events(event_type);
create index if not exists idx_analytics_created_at on public.analytics_events(created_at desc);
create index if not exists idx_analytics_metadata_gin on public.analytics_events using gin (metadata);

-- ============================================================
-- TABLE: activity_logs
-- ============================================================
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_activity_logs_created_at on public.activity_logs(created_at desc);

-- ============================================================
-- TABLE: ai_chat_logs (legacy compatibility)
-- ============================================================
create table if not exists public.ai_chat_logs (
  id uuid primary key default gen_random_uuid(),
  user_message text not null,
  ai_response text,
  is_recruiter boolean default false,
  is_technical boolean default false,
  user_agent text,
  page text,
  ip text,
  session_id text,
  created_at timestamptz default now()
);

-- ============================================================
-- TRIGGERS: Auto-update updated_at timestamp
-- ============================================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.update_updated_at();

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at before update on public.projects for each row execute function public.update_updated_at();

drop trigger if exists experiences_updated_at on public.experiences;
create trigger experiences_updated_at before update on public.experiences for each row execute function public.update_updated_at();

drop trigger if exists blog_posts_updated_at on public.blog_posts;
create trigger blog_posts_updated_at before update on public.blog_posts for each row execute function public.update_updated_at();

drop trigger if exists settings_updated_at on public.settings;
create trigger settings_updated_at before update on public.settings for each row execute function public.update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.certificates enable row level security;
alter table public.messages enable row level security;
alter table public.blog_posts enable row level security;
alter table public.testimonials enable row level security;
alter table public.settings enable row level security;
alter table public.media_assets enable row level security;
alter table public.analytics_events enable row level security;
alter table public.activity_logs enable row level security;
alter table public.ai_chat_logs enable row level security;

-- Profiles: Public can read, authenticated can manage
drop policy if exists "Public profiles are viewable" on public.profiles;
create policy "Public profiles are viewable" on public.profiles for select using (true);

drop policy if exists "Authenticated can manage profiles" on public.profiles;
create policy "Authenticated can manage profiles" on public.profiles for all using (auth.role() = 'authenticated');

-- Projects: Public can read published, authenticated can manage all
drop policy if exists "Published projects viewable by all" on public.projects;
create policy "Published projects viewable by all" on public.projects for select using (status = 'published' or auth.role() = 'authenticated');

drop policy if exists "Authenticated can manage projects" on public.projects;
create policy "Authenticated can manage projects" on public.projects for all using (auth.role() = 'authenticated');

-- Skills: Public can read, authenticated can manage
drop policy if exists "Skills viewable by all" on public.skills;
create policy "Skills viewable by all" on public.skills for select using (true);

drop policy if exists "Authenticated can manage skills" on public.skills;
create policy "Authenticated can manage skills" on public.skills for all using (auth.role() = 'authenticated');

-- Experiences: Public can read, authenticated can manage
drop policy if exists "Experiences viewable by all" on public.experiences;
create policy "Experiences viewable by all" on public.experiences for select using (true);

drop policy if exists "Authenticated can manage experiences" on public.experiences;
create policy "Authenticated can manage experiences" on public.experiences for all using (auth.role() = 'authenticated');

-- Education: Public can read, authenticated can manage
drop policy if exists "Education viewable by all" on public.education;
create policy "Education viewable by all" on public.education for select using (true);

drop policy if exists "Authenticated can manage education" on public.education;
create policy "Authenticated can manage education" on public.education for all using (auth.role() = 'authenticated');

-- Certificates: Public can read, authenticated can manage
drop policy if exists "Certificates viewable by all" on public.certificates;
create policy "Certificates viewable by all" on public.certificates for select using (true);

drop policy if exists "Authenticated can manage certificates" on public.certificates;
create policy "Authenticated can manage certificates" on public.certificates for all using (auth.role() = 'authenticated');

-- Messages: Anyone can submit (insert), only authenticated can view/update
drop policy if exists "Anyone can submit message" on public.messages;
create policy "Anyone can submit message" on public.messages for insert with check (true);

drop policy if exists "Only auth can view messages" on public.messages;
create policy "Only auth can view messages" on public.messages for select using (auth.role() = 'authenticated');

drop policy if exists "Only auth can update messages" on public.messages;
create policy "Only auth can update messages" on public.messages for update using (auth.role() = 'authenticated');

-- Blog Posts: Public can read published, authenticated can manage all
drop policy if exists "Published blog posts viewable by all" on public.blog_posts;
create policy "Published blog posts viewable by all" on public.blog_posts for select using (status = 'published' or auth.role() = 'authenticated');

drop policy if exists "Authenticated can manage blog posts" on public.blog_posts;
create policy "Authenticated can manage blog posts" on public.blog_posts for all using (auth.role() = 'authenticated');

-- Testimonials: Public can read, authenticated can manage
drop policy if exists "Testimonials viewable by all" on public.testimonials;
create policy "Testimonials viewable by all" on public.testimonials for select using (true);

drop policy if exists "Authenticated can manage testimonials" on public.testimonials;
create policy "Authenticated can manage testimonials" on public.testimonials for all using (auth.role() = 'authenticated');

-- Settings: Public can read, authenticated can manage
drop policy if exists "Settings viewable by all" on public.settings;
create policy "Settings viewable by all" on public.settings for select using (true);

drop policy if exists "Authenticated can manage settings" on public.settings;
create policy "Authenticated can manage settings" on public.settings for all using (auth.role() = 'authenticated');

-- Media Assets: Public can read, authenticated can manage
drop policy if exists "Media assets viewable by all" on public.media_assets;
create policy "Media assets viewable by all" on public.media_assets for select using (true);

drop policy if exists "Authenticated can manage media assets" on public.media_assets for all using (auth.role() = 'authenticated');

-- Analytics Events: Public can insert, only authenticated can read
drop policy if exists "Anyone can log analytics" on public.analytics_events;
create policy "Anyone can log analytics" on public.analytics_events for insert with check (true);

drop policy if exists "Only auth can read analytics" on public.analytics_events;
create policy "Only auth can read analytics" on public.analytics_events for select using (auth.role() = 'authenticated');

-- Activity Logs: Only authenticated can access
drop policy if exists "Only auth can access activity logs" on public.activity_logs;
create policy "Only auth can access activity logs" on public.activity_logs for all using (auth.role() = 'authenticated');

-- AI Chat Logs: Public can insert, only authenticated can read
drop policy if exists "Anyone can log AI chats" on public.ai_chat_logs;
create policy "Anyone can log AI chats" on public.ai_chat_logs for insert with check (true);

drop policy if exists "Only auth can read AI chats" on public.ai_chat_logs;
create policy "Only auth can read AI chats" on public.ai_chat_logs for select using (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKETS SETUP
-- ============================================================
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('projects', 'projects', true),
  ('certificates', 'certificates', true),
  ('resumes', 'resumes', true),
  ('blog', 'blog', true),
  ('seo', 'seo', true)
on conflict (id) do update set public = true;

-- Storage Objects Policies (Public Read, Authenticated/Service Role Write)
drop policy if exists "Public Access Storage Objects" on storage.objects;
create policy "Public Access Storage Objects" on storage.objects
  for select using (bucket_id in ('avatars', 'projects', 'certificates', 'resumes', 'blog', 'seo'));

drop policy if exists "Authenticated Upload Storage Objects" on storage.objects;
create policy "Authenticated Upload Storage Objects" on storage.objects
  for insert with check (
    bucket_id in ('avatars', 'projects', 'certificates', 'resumes', 'blog', 'seo')
    and (auth.role() = 'authenticated' or auth.role() = 'service_role')
  );

drop policy if exists "Authenticated Update Storage Objects" on storage.objects;
create policy "Authenticated Update Storage Objects" on storage.objects
  for update using (
    bucket_id in ('avatars', 'projects', 'certificates', 'resumes', 'blog', 'seo')
    and (auth.role() = 'authenticated' or auth.role() = 'service_role')
  );

drop policy if exists "Authenticated Delete Storage Objects" on storage.objects;
create policy "Authenticated Delete Storage Objects" on storage.objects
  for delete using (
    bucket_id in ('avatars', 'projects', 'certificates', 'resumes', 'blog', 'seo')
    and (auth.role() = 'authenticated' or auth.role() = 'service_role')
  );
