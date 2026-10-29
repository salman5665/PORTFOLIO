-- ============================================================
-- OPTIONAL STARTER SEED (Clean & Minimal)
-- Run this AFTER schema_master.sql if you want initial blank starter records
-- ============================================================

-- 1. Initial Profile
insert into public.profiles (
  name,
  email,
  tagline,
  bio,
  location,
  github_url,
  linkedin_url,
  is_available_for_work,
  theme_accent_color
) values (
  'Salman',
  'mspatel920@gmail.com',
  'Full-Stack Developer',
  'Welcome to my portfolio. I build clean, modern, and performant web applications.',
  'India',
  'https://github.com/salman5665',
  'https://linkedin.com/in/salman',
  true,
  '#00f5ff'
) on conflict do nothing;

-- 2. Initial Settings
insert into public.settings (key, value)
values
  ('hero_typing_texts', '["Full-Stack Developer", "Software Engineer", "Modern Web Apps"]'::jsonb),
  ('show_availability', 'true'::jsonb),
  ('visitor_count', '0'::jsonb),
  ('coding_profiles', '{"status":"published","github_url":"https://github.com/salman5665","leetcode_url":""}'::jsonb),
  ('journey', '[]'::jsonb)
on conflict (key) do nothing;

