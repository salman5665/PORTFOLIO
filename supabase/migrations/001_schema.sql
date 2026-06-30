-- ============================================================
-- Vinit Soni Portfolio — Supabase Database Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ============================================================
-- PROFILES (admin/owner settings)
-- ============================================================
create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null default 'Vinit Soni',
  email text not null default 'vinitsonii@gmail.com',
  tagline text default 'Full-Stack Developer & MCA Student',
  bio text default '',
  avatar_url text,
  resume_url text,
  is_available_for_work boolean default true,
  location text default 'India',
  -- Social links
  github_url text default 'https://github.com/vinitsonii',
  linkedin_url text default 'https://linkedin.com/in/vinitsonii',
  twitter_url text,
  leetcode_url text,
  codeforces_url text,
  instagram_url text,
  -- SEO
  meta_title text default 'Vinit Soni | Full-Stack Developer',
  meta_description text default 'Premium developer portfolio of Vinit Soni — Full-Stack Developer, MCA Student.',
  og_image_url text,
  -- Theme
  theme_accent_color text default '#00f5ff',
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- PROJECTS
-- ============================================================
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  short_description text,
  long_description text,
  tech_stack text[] default '{}',
  github_url text,
  live_url text,
  thumbnail_url text,
  gallery_urls text[] default '{}',
  category text default 'web', -- web | mobile | api | ai | other
  status text default 'published' check (status in ('draft','published','archived')),
  is_featured boolean default false,
  sort_order integer default 0,
  view_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_projects_slug on projects(slug);
create index if not exists idx_projects_status on projects(status);
create index if not exists idx_projects_is_featured on projects(is_featured);
create index if not exists idx_projects_tech on projects using gin(tech_stack);
create index if not exists idx_projects_title_trgm on projects using gin(title gin_trgm_ops);

-- ============================================================
-- SKILLS
-- ============================================================
create table if not exists skills (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  icon_url text,
  icon_slug text, -- for devicons / simple-icons
  category text not null check (category in ('frontend','backend','database','mobile','cloud','tools','ai')),
  proficiency integer default 80 check (proficiency between 0 and 100),
  is_featured boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_skills_category on skills(category);

-- ============================================================
-- EXPERIENCES
-- ============================================================
create table if not exists experiences (
  id uuid primary key default uuid_generate_v4(),
  company text not null,
  role text not null,
  description text,
  logo_url text,
  start_date date not null,
  end_date date,
  is_current boolean default false,
  type text default 'job' check (type in ('job','internship','freelance','contract')),
  technologies text[] default '{}',
  location text,
  company_url text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- EDUCATION
-- ============================================================
create table if not exists education (
  id uuid primary key default uuid_generate_v4(),
  institution text not null,
  degree text not null,
  field text not null,
  grade text,
  logo_url text,
  institution_url text,
  start_date date not null,
  end_date date,
  is_current boolean default false,
  achievements text[] default '{}',
  description text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- CERTIFICATES
-- ============================================================
create table if not exists certificates (
  id uuid primary key default uuid_generate_v4(),
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

-- ============================================================
-- MESSAGES (contact form)
-- ============================================================
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text,
  body text not null,
  is_read boolean default false,
  is_replied boolean default false,
  ip_address text,
  created_at timestamptz default now()
);

create index if not exists idx_messages_is_read on messages(is_read);
create index if not exists idx_messages_created_at on messages(created_at desc);

-- ============================================================
-- BLOG POSTS
-- ============================================================
create table if not exists blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text, -- rich text / markdown
  cover_image_url text,
  tags text[] default '{}',
  status text default 'draft' check (status in ('draft','published')),
  is_featured boolean default false,
  view_count integer default 0,
  read_time_minutes integer default 5,
  created_at timestamptz default now(),
  published_at timestamptz,
  updated_at timestamptz default now()
);

create index if not exists idx_blog_slug on blog_posts(slug);
create index if not exists idx_blog_status on blog_posts(status);
create index if not exists idx_blog_tags on blog_posts using gin(tags);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
create table if not exists testimonials (
  id uuid primary key default uuid_generate_v4(),
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

-- ============================================================
-- SETTINGS (key-value store)
-- ============================================================
create table if not exists settings (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);

-- ============================================================
-- ANALYTICS EVENTS
-- ============================================================
create table if not exists analytics_events (
  id uuid primary key default uuid_generate_v4(),
  event_type text not null, -- page_view | project_view | resume_download | contact_submit
  page text,
  metadata jsonb default '{}',
  user_agent text,
  ip_address text,
  created_at timestamptz default now()
);

create index if not exists idx_analytics_event_type on analytics_events(event_type);
create index if not exists idx_analytics_created_at on analytics_events(created_at desc);

-- ============================================================
-- AI CHAT LOGS
-- ============================================================
create table if not exists ai_chat_logs (
  id uuid primary key default uuid_generate_v4(),
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

create index if not exists idx_ai_chat_logs_created_at on ai_chat_logs(created_at desc);
create index if not exists idx_ai_chat_logs_session_id on ai_chat_logs(session_id);

-- ============================================================
-- ADMIN ACTIVITY LOGS
-- ============================================================
create table if not exists activity_logs (
  id uuid primary key default uuid_generate_v4(),
  action text not null,  -- create | update | delete | login | logout
  entity_type text,      -- project | skill | experience | etc.
  entity_id uuid,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Profiles: only owner can write
alter table profiles enable row level security;
create policy "Public profiles are viewable" on profiles for select using (true);
create policy "Only owner can update profile" on profiles for all using (auth.role() = 'authenticated');

-- Projects: public read, auth write
alter table projects enable row level security;
create policy "Published projects viewable by all" on projects for select using (status = 'published' or auth.role() = 'authenticated');
create policy "Authenticated can manage projects" on projects for all using (auth.role() = 'authenticated');

-- Skills: public read, auth write
alter table skills enable row level security;
create policy "Skills viewable by all" on skills for select using (true);
create policy "Authenticated can manage skills" on skills for all using (auth.role() = 'authenticated');

-- Experiences: public read, auth write
alter table experiences enable row level security;
create policy "Experiences viewable by all" on experiences for select using (true);
create policy "Authenticated can manage experiences" on experiences for all using (auth.role() = 'authenticated');

-- Education: public read, auth write
alter table education enable row level security;
create policy "Education viewable by all" on education for select using (true);
create policy "Authenticated can manage education" on education for all using (auth.role() = 'authenticated');

-- Certificates: public read, auth write
alter table certificates enable row level security;
create policy "Certificates viewable by all" on certificates for select using (true);
create policy "Authenticated can manage certificates" on certificates for all using (auth.role() = 'authenticated');

-- Messages: public insert, auth read
alter table messages enable row level security;
create policy "Anyone can submit message" on messages for insert with check (true);
create policy "Only auth can read messages" on messages for select using (auth.role() = 'authenticated');
create policy "Only auth can update messages" on messages for update using (auth.role() = 'authenticated');

-- Blog posts: public read published, auth all
alter table blog_posts enable row level security;
create policy "Published posts viewable by all" on blog_posts for select using (status = 'published' or auth.role() = 'authenticated');
create policy "Authenticated can manage posts" on blog_posts for all using (auth.role() = 'authenticated');

-- Testimonials: public read, auth write
alter table testimonials enable row level security;
create policy "Testimonials viewable by all" on testimonials for select using (true);
create policy "Authenticated can manage testimonials" on testimonials for all using (auth.role() = 'authenticated');

-- Settings: public read, auth write
alter table settings enable row level security;
create policy "Settings viewable by all" on settings for select using (true);
create policy "Authenticated can manage settings" on settings for all using (auth.role() = 'authenticated');

-- Analytics: public insert, auth read
alter table analytics_events enable row level security;
create policy "Anyone can log analytics" on analytics_events for insert with check (true);
create policy "Only auth can read analytics" on analytics_events for select using (auth.role() = 'authenticated');

-- AI chat logs: public insert, auth read
alter table ai_chat_logs enable row level security;
create policy "Anyone can log AI chats" on ai_chat_logs for insert with check (true);
create policy "Only auth can read AI chats" on ai_chat_logs for select using (auth.role() = 'authenticated');

-- Activity logs: auth only
alter table activity_logs enable row level security;
create policy "Only auth can access activity logs" on activity_logs for all using (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKETS (run in Supabase dashboard or via CLI)
-- ============================================================
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
-- insert into storage.buckets (id, name, public) values ('projects', 'projects', true);
-- insert into storage.buckets (id, name, public) values ('certificates', 'certificates', true);
-- insert into storage.buckets (id, name, public) values ('resumes', 'resumes', true);
-- insert into storage.buckets (id, name, public) values ('blog', 'blog', true);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto update updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at before update on projects for each row execute function update_updated_at();
create trigger experiences_updated_at before update on experiences for each row execute function update_updated_at();
create trigger blog_posts_updated_at before update on blog_posts for each row execute function update_updated_at();
create trigger profiles_updated_at before update on profiles for each row execute function update_updated_at();
