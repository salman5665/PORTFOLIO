-- ============================================================
-- Seed data for Vinit Soni's portfolio
-- ============================================================

-- Profile
insert into profiles (name, email, tagline, bio, is_available_for_work, location, github_url, linkedin_url, meta_title, meta_description, theme_accent_color)
values (
  'Vinit Soni',
  'vinitsonii@gmail.com',
  'Full-Stack Developer · MCA Student · Building the Future',
  'I''m Vinit Soni, a passionate Full-Stack Developer and MCA student with a strong interest in modern web development, UI/UX design, scalable backend systems, and AI-powered tools. I love crafting beautiful, performant web applications that solve real-world problems.',
  true,
  'India',
  'https://github.com/vinitsonii',
  'https://linkedin.com/in/vinitsonii',
  'Vinit Soni Full-Stack Developer',
  'Vinit Soni Full-Stack Developer: Building scalable web and mobile applications with clean code and exceptional user experiences.',
  '#00f5ff'
) on conflict do nothing;

-- Skills — Frontend
insert into skills (name, icon_slug, category, proficiency, sort_order) values
  ('React', 'react', 'frontend', 92, 1),
  ('Next.js', 'nextdotjs', 'frontend', 90, 2),
  ('TypeScript', 'typescript', 'frontend', 88, 3),
  ('JavaScript', 'javascript', 'frontend', 95, 4),
  ('Tailwind CSS', 'tailwindcss', 'frontend', 93, 5),
  ('HTML5', 'html5', 'frontend', 98, 6),
  ('CSS3', 'css3', 'frontend', 95, 7),
  ('Framer Motion', 'framer', 'frontend', 80, 8),
  ('GSAP', 'greensock', 'frontend', 75, 9),
  ('Three.js', 'threedotjs', 'frontend', 70, 10);

-- Skills — Backend
insert into skills (name, icon_slug, category, proficiency, sort_order) values
  ('Node.js', 'nodedotjs', 'backend', 88, 1),
  ('Express.js', 'express', 'backend', 85, 2),
  ('Python', 'python', 'backend', 80, 3),
  ('PHP', 'php', 'backend', 78, 4),
  ('REST APIs', 'fastapi', 'backend', 90, 5),
  ('GraphQL', 'graphql', 'backend', 70, 6);

-- Skills — Database
insert into skills (name, icon_slug, category, proficiency, sort_order) values
  ('PostgreSQL', 'postgresql', 'database', 85, 1),
  ('MySQL', 'mysql', 'database', 88, 2),
  ('MongoDB', 'mongodb', 'database', 82, 3),
  ('Supabase', 'supabase', 'database', 88, 4),
  ('Firebase', 'firebase', 'database', 80, 5),
  ('Redis', 'redis', 'database', 70, 6);

-- Skills — Tools
insert into skills (name, icon_slug, category, proficiency, sort_order) values
  ('Git', 'git', 'tools', 92, 1),
  ('GitHub', 'github', 'tools', 92, 2),
  ('VS Code', 'visualstudiocode', 'tools', 95, 3),
  ('Docker', 'docker', 'tools', 72, 4),
  ('Postman', 'postman', 'tools', 88, 5),
  ('Figma', 'figma', 'tools', 78, 6);

-- Skills — Cloud
insert into skills (name, icon_slug, category, proficiency, sort_order) values
  ('Vercel', 'vercel', 'cloud', 90, 1),
  ('Netlify', 'netlify', 'cloud', 85, 2),
  ('AWS', 'amazonaws', 'cloud', 65, 3),
  ('Supabase Cloud', 'supabase', 'cloud', 88, 4);

-- Skills — AI
insert into skills (name, icon_slug, category, proficiency, sort_order) values
  ('OpenAI API', 'openai', 'ai', 80, 1),
  ('LangChain', 'langchain', 'ai', 70, 2),
  ('Gemini API', 'google', 'ai', 75, 3);

-- Education
insert into education (institution, degree, field, grade, start_date, is_current, description, sort_order)
values
  ('MCA University', 'Master of Computer Applications', 'Computer Applications', 'Pursuing', '2023-07-01', true, 'Pursuing MCA with focus on full-stack development, software engineering, algorithms, and emerging technologies.', 1),
  ('BCA College', 'Bachelor of Computer Applications', 'Computer Applications', '8.5 CGPA', '2020-07-01', false, 'Completed BCA with strong foundation in programming, data structures, databases, and web development.', 2);

-- Sample Projects
insert into projects (title, slug, short_description, long_description, tech_stack, github_url, category, status, is_featured, sort_order)
values
  (
    'DevPortfolio CMS',
    'devportfolio-cms',
    'A full-stack dynamic portfolio with admin CMS, built with Next.js 15 and Supabase.',
    'A production-grade dynamic portfolio platform where all content is managed via a secure admin CMS. Features Three.js 3D backgrounds, Framer Motion animations, and real-time Supabase integration.',
    ARRAY['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Three.js', 'Framer Motion'],
    'https://github.com/vinitsonii',
    'web',
    'published',
    true,
    1
  ),
  (
    'Hotel Reservation System',
    'hotel-reservation-system',
    'A complete hotel management and reservation system built with PHP, MySQL and modern UI.',
    'A comprehensive hotel management system with room booking, admin panel, payment integration, and real-time availability tracking.',
    ARRAY['PHP', 'MySQL', 'JavaScript', 'Tailwind CSS', 'AJAX'],
    'https://github.com/vinitsonii',
    'web',
    'published',
    true,
    2
  );

-- Settings defaults
insert into settings (key, value) values
  ('hero_typing_texts', '["Full-Stack Developer", "MCA Student", "UI/UX Enthusiast", "Backend Engineer", "Open Source Contributor"]'),
  ('visitor_count', '0'),
  ('show_availability', 'true'),
  ('social_github', '"https://github.com/vinitsonii"'),
  ('social_linkedin', '"https://linkedin.com/in/vinitsonii"')
on conflict (key) do nothing;
