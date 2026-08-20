-- ============================================================
-- Supabase Database Full Backup
-- Project: Vinit Soni Portfolio
-- Generated: 2026-08-20T11:30:26.769Z
-- ============================================================

-- ------------------------------------------------------------
-- Table: profiles (7 rows)
-- ------------------------------------------------------------
INSERT INTO "profiles" ("id", "user_id", "name", "email", "tagline", "bio", "avatar_url", "resume_url", "is_available_for_work", "location", "github_url", "linkedin_url", "twitter_url", "leetcode_url", "codeforces_url", "instagram_url", "meta_title", "meta_description", "og_image_url", "theme_accent_color", "created_at", "updated_at", "favicon_url", "apple_icon_url", "is_ai_enabled", "ai_provider", "ai_model", "ai_api_key") VALUES ('37721015-a9b1-4861-b0b4-66b2746854cd', NULL, 'Vinit Soni', 'vinitsoni5911@gmail.com', 'Full-Stack Developer · MCA Student · Building the Future', 'I''m Vinit Soni, a passionate Full-Stack Developer and MCA student with a strong interest in modern web development, UI/UX design, scalable backend systems, and AI-powered tools. I love crafting beautiful, performant web applications that solve real-world problems.', NULL, NULL, TRUE, 'India', 'https://github.com/vinitsonii', 'https://linkedin.com/in/vinitsonii', NULL, NULL, NULL, NULL, 'Vinit Soni | Full-Stack Developer', 'Premium portfolio of Vinit Soni — Full-Stack Developer, MCA Student. Expert in React, Next.js, Node.js, and modern web technologies.', NULL, '#00f5ff', '2026-05-27T15:50:28.049548+00:00', '2026-05-30T11:37:30.446469+00:00', NULL, NULL, TRUE, 'groq', 'llama-3.3-70b-versatile', NULL) ON CONFLICT ("id") DO UPDATE SET "user_id" = EXCLUDED."user_id", "name" = EXCLUDED."name", "email" = EXCLUDED."email", "tagline" = EXCLUDED."tagline", "bio" = EXCLUDED."bio", "avatar_url" = EXCLUDED."avatar_url", "resume_url" = EXCLUDED."resume_url", "is_available_for_work" = EXCLUDED."is_available_for_work", "location" = EXCLUDED."location", "github_url" = EXCLUDED."github_url", "linkedin_url" = EXCLUDED."linkedin_url", "twitter_url" = EXCLUDED."twitter_url", "leetcode_url" = EXCLUDED."leetcode_url", "codeforces_url" = EXCLUDED."codeforces_url", "instagram_url" = EXCLUDED."instagram_url", "meta_title" = EXCLUDED."meta_title", "meta_description" = EXCLUDED."meta_description", "og_image_url" = EXCLUDED."og_image_url", "theme_accent_color" = EXCLUDED."theme_accent_color", "created_at" = EXCLUDED."created_at", "updated_at" = EXCLUDED."updated_at", "favicon_url" = EXCLUDED."favicon_url", "apple_icon_url" = EXCLUDED."apple_icon_url", "is_ai_enabled" = EXCLUDED."is_ai_enabled", "ai_provider" = EXCLUDED."ai_provider", "ai_model" = EXCLUDED."ai_model", "ai_api_key" = EXCLUDED."ai_api_key";
INSERT INTO "profiles" ("id", "user_id", "name", "email", "tagline", "bio", "avatar_url", "resume_url", "is_available_for_work", "location", "github_url", "linkedin_url", "twitter_url", "leetcode_url", "codeforces_url", "instagram_url", "meta_title", "meta_description", "og_image_url", "theme_accent_color", "created_at", "updated_at", "favicon_url", "apple_icon_url", "is_ai_enabled", "ai_provider", "ai_model", "ai_api_key") VALUES ('f9c06173-19cb-4375-ab1b-c1bf5c8c5dc5', NULL, 'Vinit Soni', 'vinitsoni5911@gmail.com', 'Full-Stack Developer', 'MCA student seeking a software development internship to apply skills in web technologies and backend development while gaining hands-on industry experience.', NULL, NULL, TRUE, 'Vadodara', 'https://github.com/vinitsonii', 'https://linkedin.com/in/vinitsonii', NULL, NULL, NULL, NULL, 'Vinit Soni | Full-Stack Developer', 'Premium developer portfolio of Vinit Soni — Full-Stack Developer, MCA Student.', NULL, '#3b82f6', '2026-05-30T18:41:17.348058+00:00', '2026-05-30T18:41:17.348058+00:00', NULL, NULL, TRUE, 'groq', 'llama-3.3-70b-versatile', NULL) ON CONFLICT ("id") DO UPDATE SET "user_id" = EXCLUDED."user_id", "name" = EXCLUDED."name", "email" = EXCLUDED."email", "tagline" = EXCLUDED."tagline", "bio" = EXCLUDED."bio", "avatar_url" = EXCLUDED."avatar_url", "resume_url" = EXCLUDED."resume_url", "is_available_for_work" = EXCLUDED."is_available_for_work", "location" = EXCLUDED."location", "github_url" = EXCLUDED."github_url", "linkedin_url" = EXCLUDED."linkedin_url", "twitter_url" = EXCLUDED."twitter_url", "leetcode_url" = EXCLUDED."leetcode_url", "codeforces_url" = EXCLUDED."codeforces_url", "instagram_url" = EXCLUDED."instagram_url", "meta_title" = EXCLUDED."meta_title", "meta_description" = EXCLUDED."meta_description", "og_image_url" = EXCLUDED."og_image_url", "theme_accent_color" = EXCLUDED."theme_accent_color", "created_at" = EXCLUDED."created_at", "updated_at" = EXCLUDED."updated_at", "favicon_url" = EXCLUDED."favicon_url", "apple_icon_url" = EXCLUDED."apple_icon_url", "is_ai_enabled" = EXCLUDED."is_ai_enabled", "ai_provider" = EXCLUDED."ai_provider", "ai_model" = EXCLUDED."ai_model", "ai_api_key" = EXCLUDED."ai_api_key";
INSERT INTO "profiles" ("id", "user_id", "name", "email", "tagline", "bio", "avatar_url", "resume_url", "is_available_for_work", "location", "github_url", "linkedin_url", "twitter_url", "leetcode_url", "codeforces_url", "instagram_url", "meta_title", "meta_description", "og_image_url", "theme_accent_color", "created_at", "updated_at", "favicon_url", "apple_icon_url", "is_ai_enabled", "ai_provider", "ai_model", "ai_api_key") VALUES ('131c4619-d4a9-46ef-b418-b808467e74e0', NULL, 'Vinit Soni', 'vinitsoni5911@gmail.com', 'Full-Stack Developer Â· MCA Student', '', NULL, NULL, TRUE, 'India', 'https://github.com/vinitsonii', 'https://linkedin.com/in/vinitsonii', '', '', NULL, 'https://instagram/vinitsonii', 'Vinit Soni | Full-Stack Developer', '', NULL, '#00f5ff', '2026-05-30T20:43:48.777401+00:00', '2026-05-30T20:43:48.777401+00:00', NULL, NULL, TRUE, 'groq', 'llama-3.3-70b-versatile', NULL) ON CONFLICT ("id") DO UPDATE SET "user_id" = EXCLUDED."user_id", "name" = EXCLUDED."name", "email" = EXCLUDED."email", "tagline" = EXCLUDED."tagline", "bio" = EXCLUDED."bio", "avatar_url" = EXCLUDED."avatar_url", "resume_url" = EXCLUDED."resume_url", "is_available_for_work" = EXCLUDED."is_available_for_work", "location" = EXCLUDED."location", "github_url" = EXCLUDED."github_url", "linkedin_url" = EXCLUDED."linkedin_url", "twitter_url" = EXCLUDED."twitter_url", "leetcode_url" = EXCLUDED."leetcode_url", "codeforces_url" = EXCLUDED."codeforces_url", "instagram_url" = EXCLUDED."instagram_url", "meta_title" = EXCLUDED."meta_title", "meta_description" = EXCLUDED."meta_description", "og_image_url" = EXCLUDED."og_image_url", "theme_accent_color" = EXCLUDED."theme_accent_color", "created_at" = EXCLUDED."created_at", "updated_at" = EXCLUDED."updated_at", "favicon_url" = EXCLUDED."favicon_url", "apple_icon_url" = EXCLUDED."apple_icon_url", "is_ai_enabled" = EXCLUDED."is_ai_enabled", "ai_provider" = EXCLUDED."ai_provider", "ai_model" = EXCLUDED."ai_model", "ai_api_key" = EXCLUDED."ai_api_key";
INSERT INTO "profiles" ("id", "user_id", "name", "email", "tagline", "bio", "avatar_url", "resume_url", "is_available_for_work", "location", "github_url", "linkedin_url", "twitter_url", "leetcode_url", "codeforces_url", "instagram_url", "meta_title", "meta_description", "og_image_url", "theme_accent_color", "created_at", "updated_at", "favicon_url", "apple_icon_url", "is_ai_enabled", "ai_provider", "ai_model", "ai_api_key") VALUES ('aaf7b785-dfeb-4066-acac-b8e56b3c4b8a', NULL, 'Vinit Soni', 'vinitsoni5911@gmail.com', 'Full-Stack Developer Â· MCA Student', '', NULL, NULL, TRUE, 'India', 'https://github.com/vinitsonii', 'https://linkedin.com/in/vinitsonii', '', '', NULL, NULL, 'Vinit Soni | Full-Stack Developer', '', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/avatars/7cxfuz6hc2b_1780173929281.jpg', '#00f5ff', '2026-05-30T20:46:11.86416+00:00', '2026-05-30T20:46:11.86416+00:00', NULL, NULL, TRUE, 'groq', 'llama-3.3-70b-versatile', NULL) ON CONFLICT ("id") DO UPDATE SET "user_id" = EXCLUDED."user_id", "name" = EXCLUDED."name", "email" = EXCLUDED."email", "tagline" = EXCLUDED."tagline", "bio" = EXCLUDED."bio", "avatar_url" = EXCLUDED."avatar_url", "resume_url" = EXCLUDED."resume_url", "is_available_for_work" = EXCLUDED."is_available_for_work", "location" = EXCLUDED."location", "github_url" = EXCLUDED."github_url", "linkedin_url" = EXCLUDED."linkedin_url", "twitter_url" = EXCLUDED."twitter_url", "leetcode_url" = EXCLUDED."leetcode_url", "codeforces_url" = EXCLUDED."codeforces_url", "instagram_url" = EXCLUDED."instagram_url", "meta_title" = EXCLUDED."meta_title", "meta_description" = EXCLUDED."meta_description", "og_image_url" = EXCLUDED."og_image_url", "theme_accent_color" = EXCLUDED."theme_accent_color", "created_at" = EXCLUDED."created_at", "updated_at" = EXCLUDED."updated_at", "favicon_url" = EXCLUDED."favicon_url", "apple_icon_url" = EXCLUDED."apple_icon_url", "is_ai_enabled" = EXCLUDED."is_ai_enabled", "ai_provider" = EXCLUDED."ai_provider", "ai_model" = EXCLUDED."ai_model", "ai_api_key" = EXCLUDED."ai_api_key";
INSERT INTO "profiles" ("id", "user_id", "name", "email", "tagline", "bio", "avatar_url", "resume_url", "is_available_for_work", "location", "github_url", "linkedin_url", "twitter_url", "leetcode_url", "codeforces_url", "instagram_url", "meta_title", "meta_description", "og_image_url", "theme_accent_color", "created_at", "updated_at", "favicon_url", "apple_icon_url", "is_ai_enabled", "ai_provider", "ai_model", "ai_api_key") VALUES ('f4f0bc1c-3e76-4035-af4f-3e36543b5488', NULL, 'Vinit Soni', 'vinitsoni5911@gmail.com', 'Full-Stack Developer Â· MCA Student', '', NULL, NULL, TRUE, 'India', 'https://github.com/vinitsonii', 'https://linkedin.com/in/vinitsonii', '', '', NULL, NULL, 'Vinit Soni | Full-Stack Developer', '', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/avatars/7cxfuz6hc2b_1780173929281.jpg', '#00f5ff', '2026-05-30T20:46:23.613317+00:00', '2026-05-30T20:46:23.613317+00:00', NULL, NULL, TRUE, 'groq', 'llama-3.3-70b-versatile', NULL) ON CONFLICT ("id") DO UPDATE SET "user_id" = EXCLUDED."user_id", "name" = EXCLUDED."name", "email" = EXCLUDED."email", "tagline" = EXCLUDED."tagline", "bio" = EXCLUDED."bio", "avatar_url" = EXCLUDED."avatar_url", "resume_url" = EXCLUDED."resume_url", "is_available_for_work" = EXCLUDED."is_available_for_work", "location" = EXCLUDED."location", "github_url" = EXCLUDED."github_url", "linkedin_url" = EXCLUDED."linkedin_url", "twitter_url" = EXCLUDED."twitter_url", "leetcode_url" = EXCLUDED."leetcode_url", "codeforces_url" = EXCLUDED."codeforces_url", "instagram_url" = EXCLUDED."instagram_url", "meta_title" = EXCLUDED."meta_title", "meta_description" = EXCLUDED."meta_description", "og_image_url" = EXCLUDED."og_image_url", "theme_accent_color" = EXCLUDED."theme_accent_color", "created_at" = EXCLUDED."created_at", "updated_at" = EXCLUDED."updated_at", "favicon_url" = EXCLUDED."favicon_url", "apple_icon_url" = EXCLUDED."apple_icon_url", "is_ai_enabled" = EXCLUDED."is_ai_enabled", "ai_provider" = EXCLUDED."ai_provider", "ai_model" = EXCLUDED."ai_model", "ai_api_key" = EXCLUDED."ai_api_key";
INSERT INTO "profiles" ("id", "user_id", "name", "email", "tagline", "bio", "avatar_url", "resume_url", "is_available_for_work", "location", "github_url", "linkedin_url", "twitter_url", "leetcode_url", "codeforces_url", "instagram_url", "meta_title", "meta_description", "og_image_url", "theme_accent_color", "created_at", "updated_at", "favicon_url", "apple_icon_url", "is_ai_enabled", "ai_provider", "ai_model", "ai_api_key") VALUES ('aa9a6f08-698c-422b-8834-292bdd5a238c', NULL, 'Vinit Soni', 'vinitsonii@gmail.com', 'Full-Stack Developer - MCA Student', 'A passionate Full-Stack Developer and MCA student with a strong interest in modern web development, UI/UX design, scalable backend systems, and AI-powered tools. I love crafting beautiful, performant web applications that solve real-world problems.', NULL, NULL, TRUE, 'India', 'https://github.com/vinitsonii', 'https://linkedin.com/in/vinitsonii', '', '', NULL, NULL, 'Vinit Soni | Full-Stack Developer', '', NULL, '#00f5ff', '2026-06-01T15:40:54.07897+00:00', '2026-06-01T15:40:54.07897+00:00', NULL, NULL, TRUE, 'groq', 'llama-3.3-70b-versatile', NULL) ON CONFLICT ("id") DO UPDATE SET "user_id" = EXCLUDED."user_id", "name" = EXCLUDED."name", "email" = EXCLUDED."email", "tagline" = EXCLUDED."tagline", "bio" = EXCLUDED."bio", "avatar_url" = EXCLUDED."avatar_url", "resume_url" = EXCLUDED."resume_url", "is_available_for_work" = EXCLUDED."is_available_for_work", "location" = EXCLUDED."location", "github_url" = EXCLUDED."github_url", "linkedin_url" = EXCLUDED."linkedin_url", "twitter_url" = EXCLUDED."twitter_url", "leetcode_url" = EXCLUDED."leetcode_url", "codeforces_url" = EXCLUDED."codeforces_url", "instagram_url" = EXCLUDED."instagram_url", "meta_title" = EXCLUDED."meta_title", "meta_description" = EXCLUDED."meta_description", "og_image_url" = EXCLUDED."og_image_url", "theme_accent_color" = EXCLUDED."theme_accent_color", "created_at" = EXCLUDED."created_at", "updated_at" = EXCLUDED."updated_at", "favicon_url" = EXCLUDED."favicon_url", "apple_icon_url" = EXCLUDED."apple_icon_url", "is_ai_enabled" = EXCLUDED."is_ai_enabled", "ai_provider" = EXCLUDED."ai_provider", "ai_model" = EXCLUDED."ai_model", "ai_api_key" = EXCLUDED."ai_api_key";
INSERT INTO "profiles" ("id", "user_id", "name", "email", "tagline", "bio", "avatar_url", "resume_url", "is_available_for_work", "location", "github_url", "linkedin_url", "twitter_url", "leetcode_url", "codeforces_url", "instagram_url", "meta_title", "meta_description", "og_image_url", "theme_accent_color", "created_at", "updated_at", "favicon_url", "apple_icon_url", "is_ai_enabled", "ai_provider", "ai_model", "ai_api_key") VALUES ('a4dab674-de55-4e17-8f81-71ad43b4566b', NULL, 'Vinit Soni', 'vinitsoni5911@gmail.com', 'Full-Stack Developer | MCA Student', 'I am Vinit Soni, a Full-Stack Developer and MCA student. I build fast, reliable web and mobile apps. I focus on clean code, modern architecture, and exceptional user experiences.', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/avatars/IMG_20260301_221015_641_100726_130635.webp', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/resumes/sbdxv7rb1m_1780728077203.pdf', TRUE, 'Vadodara', 'https://github.com/vinitsonii', 'https://linkedin.com/in/vinitsonii', '', '', NULL, 'https://www.instagram.com/vinitsonii', 'Vinit Soni | Portfolio — Full-Stack Developer', 'Vinit Soni — Full-Stack Developer: Building scalable web and mobile applications with clean code and exceptional user experiences.', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/avatars/og-image_070626_1542.png', '#00f5ff', '2026-06-01T15:41:02.362059+00:00', '2026-08-20T11:20:29.824656+00:00', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/avatars/favicon_hd_070626_1615.ico', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/avatars/apple-touch-icon_070626_1615.png', TRUE, 'groq', 'llama-3.3-70b-versatile/', 'Vinit8160698196') ON CONFLICT ("id") DO UPDATE SET "user_id" = EXCLUDED."user_id", "name" = EXCLUDED."name", "email" = EXCLUDED."email", "tagline" = EXCLUDED."tagline", "bio" = EXCLUDED."bio", "avatar_url" = EXCLUDED."avatar_url", "resume_url" = EXCLUDED."resume_url", "is_available_for_work" = EXCLUDED."is_available_for_work", "location" = EXCLUDED."location", "github_url" = EXCLUDED."github_url", "linkedin_url" = EXCLUDED."linkedin_url", "twitter_url" = EXCLUDED."twitter_url", "leetcode_url" = EXCLUDED."leetcode_url", "codeforces_url" = EXCLUDED."codeforces_url", "instagram_url" = EXCLUDED."instagram_url", "meta_title" = EXCLUDED."meta_title", "meta_description" = EXCLUDED."meta_description", "og_image_url" = EXCLUDED."og_image_url", "theme_accent_color" = EXCLUDED."theme_accent_color", "created_at" = EXCLUDED."created_at", "updated_at" = EXCLUDED."updated_at", "favicon_url" = EXCLUDED."favicon_url", "apple_icon_url" = EXCLUDED."apple_icon_url", "is_ai_enabled" = EXCLUDED."is_ai_enabled", "ai_provider" = EXCLUDED."ai_provider", "ai_model" = EXCLUDED."ai_model", "ai_api_key" = EXCLUDED."ai_api_key";

-- ------------------------------------------------------------
-- Table: projects (11 rows)
-- ------------------------------------------------------------
INSERT INTO "projects" ("id", "title", "slug", "short_description", "long_description", "tech_stack", "github_url", "live_url", "thumbnail_url", "gallery_urls", "category", "status", "is_featured", "sort_order", "view_count", "created_at", "updated_at") VALUES ('67044b22-acdf-487f-87ac-3c5303b400bf', 'Job Portal', 'job-portal', 'Built a job portal web application using ASP.NET with separate admin and user modules.', 'Built a job portal web application using ASP.NET with separate admin and user modules. Implemented features like job posting, application management, and user authentication.', '["ASP.NET","MSSQL"]'::jsonb, '', '', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/projects/3016y5hvx9n_1780465022514.png', '[]'::jsonb, 'web', 'published', FALSE, 7, 0, '2026-05-30T18:41:17.880657+00:00', '2026-06-05T17:59:29.480291+00:00') ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "slug" = EXCLUDED."slug", "short_description" = EXCLUDED."short_description", "long_description" = EXCLUDED."long_description", "tech_stack" = EXCLUDED."tech_stack", "github_url" = EXCLUDED."github_url", "live_url" = EXCLUDED."live_url", "thumbnail_url" = EXCLUDED."thumbnail_url", "gallery_urls" = EXCLUDED."gallery_urls", "category" = EXCLUDED."category", "status" = EXCLUDED."status", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "view_count" = EXCLUDED."view_count", "created_at" = EXCLUDED."created_at", "updated_at" = EXCLUDED."updated_at";
INSERT INTO "projects" ("id", "title", "slug", "short_description", "long_description", "tech_stack", "github_url", "live_url", "thumbnail_url", "gallery_urls", "category", "status", "is_featured", "sort_order", "view_count", "created_at", "updated_at") VALUES ('a7a151d3-e03b-4089-86bb-1723f244924b', 'Hotel Reservation System', 'hotel-reservation-system', 'Premium PHP/MySQL hotel reservation system with booking, invoices, admin CRUD, coupons, reviews, and analytics.', 'A complete hotel reservation platform built with PHP and MySQL. It includes room search, overlap-safe booking, Razorpay test-mode simulation, invoice generation, reviews, admin CRUD, coupons, analytics charts, and a booking calendar.', '["PHP","MySQL","CSS","JavaScript"]'::jsonb, 'https://github.com/vinitsonii/Hotel-Reservation-System', '', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/projects/s6w1wmtpz4_1780465079534.png', '[]'::jsonb, 'web', 'published', FALSE, 2, 0, '2026-06-01T09:20:35.735382+00:00', '2026-06-03T05:39:58.058518+00:00') ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "slug" = EXCLUDED."slug", "short_description" = EXCLUDED."short_description", "long_description" = EXCLUDED."long_description", "tech_stack" = EXCLUDED."tech_stack", "github_url" = EXCLUDED."github_url", "live_url" = EXCLUDED."live_url", "thumbnail_url" = EXCLUDED."thumbnail_url", "gallery_urls" = EXCLUDED."gallery_urls", "category" = EXCLUDED."category", "status" = EXCLUDED."status", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "view_count" = EXCLUDED."view_count", "created_at" = EXCLUDED."created_at", "updated_at" = EXCLUDED."updated_at";
INSERT INTO "projects" ("id", "title", "slug", "short_description", "long_description", "tech_stack", "github_url", "live_url", "thumbnail_url", "gallery_urls", "category", "status", "is_featured", "sort_order", "view_count", "created_at", "updated_at") VALUES ('24b1106e-61d1-4146-b429-06b895e3071b', 'Vinit Soni Portfolio', 'vinitsoni-portfolio', 'Personal dynamic portfolio/CMS built with TypeScript, Next.js, PostgreSQL and Supabase. ', 'A full-stack personal portfolio project using TypeScript, Next.js, PostgreSQL and Supabase. It showcases project content, admin-managed data, database integration, and modern portfolio engineering.', '["TypeScript","Next.js","Supabase","PostgreSQL"]'::jsonb, 'https://github.com/vinitsonii/vinitsonii-portfolio', 'https://vinitsoni.vercel.app', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/projects/portfolio_110726_235314.png', '[]'::jsonb, 'web', 'published', TRUE, 2, 0, '2026-06-01T09:20:35.735382+00:00', '2026-07-19T17:37:22.504655+00:00') ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "slug" = EXCLUDED."slug", "short_description" = EXCLUDED."short_description", "long_description" = EXCLUDED."long_description", "tech_stack" = EXCLUDED."tech_stack", "github_url" = EXCLUDED."github_url", "live_url" = EXCLUDED."live_url", "thumbnail_url" = EXCLUDED."thumbnail_url", "gallery_urls" = EXCLUDED."gallery_urls", "category" = EXCLUDED."category", "status" = EXCLUDED."status", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "view_count" = EXCLUDED."view_count", "created_at" = EXCLUDED."created_at", "updated_at" = EXCLUDED."updated_at";
INSERT INTO "projects" ("id", "title", "slug", "short_description", "long_description", "tech_stack", "github_url", "live_url", "thumbnail_url", "gallery_urls", "category", "status", "is_featured", "sort_order", "view_count", "created_at", "updated_at") VALUES ('6519d1fa-192d-4657-9eee-57fb812c0d0e', 'School Admission System', 'school-admission-system', 'PHP and MySQL school admission platform for inquiries, registrations, student records, and request tracking.', 'A web-based School Admission Management System built with HTML5, PHP, MySQL, CSS, and JavaScript. It helps administrators manage admission inquiries and student records while students can register, apply for admission, and track request status.', '["PHP","MySQL","HTML5","CSS","JavaScript"]'::jsonb, 'https://github.com/vinitsonii/School_Admission_System', '', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/projects/cm8imb5rpxk_1780465118498.png', '[]'::jsonb, 'web', 'published', FALSE, 5, 0, '2026-06-01T09:20:35.735382+00:00', '2026-06-03T05:57:22.113824+00:00') ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "slug" = EXCLUDED."slug", "short_description" = EXCLUDED."short_description", "long_description" = EXCLUDED."long_description", "tech_stack" = EXCLUDED."tech_stack", "github_url" = EXCLUDED."github_url", "live_url" = EXCLUDED."live_url", "thumbnail_url" = EXCLUDED."thumbnail_url", "gallery_urls" = EXCLUDED."gallery_urls", "category" = EXCLUDED."category", "status" = EXCLUDED."status", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "view_count" = EXCLUDED."view_count", "created_at" = EXCLUDED."created_at", "updated_at" = EXCLUDED."updated_at";
INSERT INTO "projects" ("id", "title", "slug", "short_description", "long_description", "tech_stack", "github_url", "live_url", "thumbnail_url", "gallery_urls", "category", "status", "is_featured", "sort_order", "view_count", "created_at", "updated_at") VALUES ('f4d60d00-a0f2-49e9-99a3-06ba27dec82c', 'College Event Management System', 'college-event-management-system', 'JSP, Servlet, JDBC, and MySQL platform for college events, student registration, and participant management.', 'A web-based College Event Management System built with Java Servlets, JSP, JDBC, and MySQL. It helps colleges manage events, student registrations, participant records, and event workflows from a centralized admin platform.', '["Java","JSP","Servlet","JDBC","MySQL","CSS","HTML"]'::jsonb, 'https://github.com/vinitsonii/college-event-management', '', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/projects/xgplopmzke_1780465556749.png', '[]'::jsonb, 'web', 'published', FALSE, 4, 0, '2026-06-01T09:20:35.735382+00:00', '2026-06-03T05:47:12.003143+00:00') ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "slug" = EXCLUDED."slug", "short_description" = EXCLUDED."short_description", "long_description" = EXCLUDED."long_description", "tech_stack" = EXCLUDED."tech_stack", "github_url" = EXCLUDED."github_url", "live_url" = EXCLUDED."live_url", "thumbnail_url" = EXCLUDED."thumbnail_url", "gallery_urls" = EXCLUDED."gallery_urls", "category" = EXCLUDED."category", "status" = EXCLUDED."status", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "view_count" = EXCLUDED."view_count", "created_at" = EXCLUDED."created_at", "updated_at" = EXCLUDED."updated_at";
INSERT INTO "projects" ("id", "title", "slug", "short_description", "long_description", "tech_stack", "github_url", "live_url", "thumbnail_url", "gallery_urls", "category", "status", "is_featured", "sort_order", "view_count", "created_at", "updated_at") VALUES ('714c2d97-5efe-4ee0-9507-d3e3e4a9d7d5', 'Flutter TODO App', 'flutter-todo-app', 'Flutter and Firebase task management app with realtime task updates and mobile-friendly CRUD flows.', 'A task management application built with Flutter and Firebase. It lets users add, edit, complete, and delete tasks with a clean mobile interface, Firebase database integration, and realtime task updates.', '["Flutter","Dart","Firebase","Google authentication"]'::jsonb, 'https://github.com/vinitsonii/flutter-todo-app', '', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/projects/8zay7g9022_1780464982108.png', '[]'::jsonb, 'mobile', 'published', FALSE, 3, 0, '2026-06-01T09:20:35.735382+00:00', '2026-06-03T05:57:10.984851+00:00') ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "slug" = EXCLUDED."slug", "short_description" = EXCLUDED."short_description", "long_description" = EXCLUDED."long_description", "tech_stack" = EXCLUDED."tech_stack", "github_url" = EXCLUDED."github_url", "live_url" = EXCLUDED."live_url", "thumbnail_url" = EXCLUDED."thumbnail_url", "gallery_urls" = EXCLUDED."gallery_urls", "category" = EXCLUDED."category", "status" = EXCLUDED."status", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "view_count" = EXCLUDED."view_count", "created_at" = EXCLUDED."created_at", "updated_at" = EXCLUDED."updated_at";
INSERT INTO "projects" ("id", "title", "slug", "short_description", "long_description", "tech_stack", "github_url", "live_url", "thumbnail_url", "gallery_urls", "category", "status", "is_featured", "sort_order", "view_count", "created_at", "updated_at") VALUES ('143db10d-649b-4f8a-9bea-4477d5ee3b26', 'Payroll Management System', 'payroll-management-system', 'PHP and MySQL payroll system for employee records, salary processing, attendance tracking, and payroll operations.', 'A Payroll Management System developed using PHP and MySQL for managing employee records, salary processing, attendance tracking, payroll operations, workflows and CRUD operations.', '["PHP","MySQL","Html5","Bootstrap"]'::jsonb, 'https://github.com/vinitsonii/Payroll-management-system', 'https://payroll.gt.tc/', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/projects/5d4rpu5av0f_1780463429716.png', '[]'::jsonb, 'web', 'published', FALSE, 3, 0, '2026-06-01T09:20:35.735382+00:00', '2026-06-05T17:59:00.510248+00:00') ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "slug" = EXCLUDED."slug", "short_description" = EXCLUDED."short_description", "long_description" = EXCLUDED."long_description", "tech_stack" = EXCLUDED."tech_stack", "github_url" = EXCLUDED."github_url", "live_url" = EXCLUDED."live_url", "thumbnail_url" = EXCLUDED."thumbnail_url", "gallery_urls" = EXCLUDED."gallery_urls", "category" = EXCLUDED."category", "status" = EXCLUDED."status", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "view_count" = EXCLUDED."view_count", "created_at" = EXCLUDED."created_at", "updated_at" = EXCLUDED."updated_at";
INSERT INTO "projects" ("id", "title", "slug", "short_description", "long_description", "tech_stack", "github_url", "live_url", "thumbnail_url", "gallery_urls", "category", "status", "is_featured", "sort_order", "view_count", "created_at", "updated_at") VALUES ('992cf0e0-548b-4cf4-89ba-17d193e11823', 'Alumni Platform', 'alumni-platform', 'ASP.NET alumni platform for database-backed alumni records and institution/community workflows.', 'A web-based alumni platform built with ASP.NET, CSS, and Visual Basic .NET. It focuses on database-backed record management and academic/community platform workflows.', '["ASP.NET","CSS","Visual Basic .NET"]'::jsonb, 'https://github.com/vinitsonii/Alumni_Platform', NULL, NULL, '[]'::jsonb, 'web', 'draft', FALSE, 8, 0, '2026-05-30T18:41:17.880657+00:00', '2026-06-01T09:26:51.618162+00:00') ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "slug" = EXCLUDED."slug", "short_description" = EXCLUDED."short_description", "long_description" = EXCLUDED."long_description", "tech_stack" = EXCLUDED."tech_stack", "github_url" = EXCLUDED."github_url", "live_url" = EXCLUDED."live_url", "thumbnail_url" = EXCLUDED."thumbnail_url", "gallery_urls" = EXCLUDED."gallery_urls", "category" = EXCLUDED."category", "status" = EXCLUDED."status", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "view_count" = EXCLUDED."view_count", "created_at" = EXCLUDED."created_at", "updated_at" = EXCLUDED."updated_at";
INSERT INTO "projects" ("id", "title", "slug", "short_description", "long_description", "tech_stack", "github_url", "live_url", "thumbnail_url", "gallery_urls", "category", "status", "is_featured", "sort_order", "view_count", "created_at", "updated_at") VALUES ('48aed8e2-df49-4cfd-a54f-8b24598d3c38', 'VSports', 'vsports', 'HTML sports-themed frontend project.', 'A lightweight sports-themed web project using HTML. This can be expanded later with a stronger description once the exact feature set is documented.', '["HTML","CSS","JavaScript"]'::jsonb, 'https://github.com/vinitsonii/vsports', NULL, NULL, '[]'::jsonb, 'web', 'draft', FALSE, 9, 0, '2026-06-01T09:20:35.735382+00:00', '2026-06-01T09:26:52.683076+00:00') ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "slug" = EXCLUDED."slug", "short_description" = EXCLUDED."short_description", "long_description" = EXCLUDED."long_description", "tech_stack" = EXCLUDED."tech_stack", "github_url" = EXCLUDED."github_url", "live_url" = EXCLUDED."live_url", "thumbnail_url" = EXCLUDED."thumbnail_url", "gallery_urls" = EXCLUDED."gallery_urls", "category" = EXCLUDED."category", "status" = EXCLUDED."status", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "view_count" = EXCLUDED."view_count", "created_at" = EXCLUDED."created_at", "updated_at" = EXCLUDED."updated_at";
INSERT INTO "projects" ("id", "title", "slug", "short_description", "long_description", "tech_stack", "github_url", "live_url", "thumbnail_url", "gallery_urls", "category", "status", "is_featured", "sort_order", "view_count", "created_at", "updated_at") VALUES ('459f795d-8a18-4a19-83e3-230b5a84ea28', 'GitHub Profile README', 'github-profile-readme', 'Developer profile README for Vinit Soni on GitHub.', 'Your GitHub profile repository containing your developer bio, tech stack, featured projects, GitHub stats, DSA focus, and social links. Kept as draft because it is profile content, not a normal project.', '["Markdown","GitHub"]'::jsonb, 'https://github.com/vinitsonii/vinitsonii', NULL, NULL, '[]'::jsonb, 'other', 'draft', FALSE, 10, 0, '2026-06-01T09:20:35.735382+00:00', '2026-06-01T15:34:11.839721+00:00') ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "slug" = EXCLUDED."slug", "short_description" = EXCLUDED."short_description", "long_description" = EXCLUDED."long_description", "tech_stack" = EXCLUDED."tech_stack", "github_url" = EXCLUDED."github_url", "live_url" = EXCLUDED."live_url", "thumbnail_url" = EXCLUDED."thumbnail_url", "gallery_urls" = EXCLUDED."gallery_urls", "category" = EXCLUDED."category", "status" = EXCLUDED."status", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "view_count" = EXCLUDED."view_count", "created_at" = EXCLUDED."created_at", "updated_at" = EXCLUDED."updated_at";
INSERT INTO "projects" ("id", "title", "slug", "short_description", "long_description", "tech_stack", "github_url", "live_url", "thumbnail_url", "gallery_urls", "category", "status", "is_featured", "sort_order", "view_count", "created_at", "updated_at") VALUES ('5480e36f-1c02-4991-a5c5-9fe40201ebed', 'Cloud Kitchen Management System', 'cloud-kitchen-management-system', 'ASP.NET and MSSQL cloud kitchen platform for food ordering, menus, orders, email notifications, and admin operations.', 'A database-driven Cloud Kitchen Management System built with ASP.NET and MSSQL. It supports customer registration, food menu management, online order placement, order tracking, email notifications, and admin dashboard workflows.', '["ASP.NET","Visual Basic .NET","MSSQL"]'::jsonb, 'https://github.com/vinitsonii/Cloud-kitchen-management-system', 'https://www.cloudkitchen.somee.com', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/projects/i11wjlfy79_1780465006980.png', '[]'::jsonb, 'web', 'published', TRUE, 1, 0, '2026-06-01T09:20:35.735382+00:00', '2026-06-07T09:00:23.711223+00:00') ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "slug" = EXCLUDED."slug", "short_description" = EXCLUDED."short_description", "long_description" = EXCLUDED."long_description", "tech_stack" = EXCLUDED."tech_stack", "github_url" = EXCLUDED."github_url", "live_url" = EXCLUDED."live_url", "thumbnail_url" = EXCLUDED."thumbnail_url", "gallery_urls" = EXCLUDED."gallery_urls", "category" = EXCLUDED."category", "status" = EXCLUDED."status", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "view_count" = EXCLUDED."view_count", "created_at" = EXCLUDED."created_at", "updated_at" = EXCLUDED."updated_at";

-- ------------------------------------------------------------
-- Table: skills (21 rows)
-- ------------------------------------------------------------
INSERT INTO "skills" ("id", "name", "icon_url", "icon_slug", "category", "proficiency", "is_featured", "sort_order", "created_at") VALUES ('3ab31a28-d220-4ce8-b519-de261e55d3c1', 'CSS3', NULL, 'css', 'frontend', 80, TRUE, 2, '2026-06-04T05:41:08.69346+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "icon_url" = EXCLUDED."icon_url", "icon_slug" = EXCLUDED."icon_slug", "category" = EXCLUDED."category", "proficiency" = EXCLUDED."proficiency", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "skills" ("id", "name", "icon_url", "icon_slug", "category", "proficiency", "is_featured", "sort_order", "created_at") VALUES ('af21c39d-8d89-4006-b87c-6ddb762d937b', 'JavaScript', NULL, 'javascript', 'frontend', 75, TRUE, 3, '2026-06-04T05:41:08.69346+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "icon_url" = EXCLUDED."icon_url", "icon_slug" = EXCLUDED."icon_slug", "category" = EXCLUDED."category", "proficiency" = EXCLUDED."proficiency", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "skills" ("id", "name", "icon_url", "icon_slug", "category", "proficiency", "is_featured", "sort_order", "created_at") VALUES ('34170834-85a9-4a6c-8051-c43c2d0c7bfc', 'Bootstrap', NULL, 'bootstrap', 'frontend', 70, TRUE, 5, '2026-06-04T05:41:08.69346+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "icon_url" = EXCLUDED."icon_url", "icon_slug" = EXCLUDED."icon_slug", "category" = EXCLUDED."category", "proficiency" = EXCLUDED."proficiency", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "skills" ("id", "name", "icon_url", "icon_slug", "category", "proficiency", "is_featured", "sort_order", "created_at") VALUES ('fcc6c417-0bd7-4c6e-ab1f-d99c5019322e', 'Next.js', NULL, 'nextdotjs', 'frontend', 60, TRUE, 6, '2026-06-04T05:41:08.69346+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "icon_url" = EXCLUDED."icon_url", "icon_slug" = EXCLUDED."icon_slug", "category" = EXCLUDED."category", "proficiency" = EXCLUDED."proficiency", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "skills" ("id", "name", "icon_url", "icon_slug", "category", "proficiency", "is_featured", "sort_order", "created_at") VALUES ('f5eb1f96-edc7-479a-b054-dd5114cd8c92', 'ASP.NET', NULL, 'dotnet', 'backend', 70, TRUE, 1, '2026-06-04T05:41:08.69346+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "icon_url" = EXCLUDED."icon_url", "icon_slug" = EXCLUDED."icon_slug", "category" = EXCLUDED."category", "proficiency" = EXCLUDED."proficiency", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "skills" ("id", "name", "icon_url", "icon_slug", "category", "proficiency", "is_featured", "sort_order", "created_at") VALUES ('68d43a18-9c2a-460c-9596-767a2436e2c6', 'JDBC', NULL, 'openjdk', 'backend', 70, TRUE, 2, '2026-06-04T05:41:08.69346+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "icon_url" = EXCLUDED."icon_url", "icon_slug" = EXCLUDED."icon_slug", "category" = EXCLUDED."category", "proficiency" = EXCLUDED."proficiency", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "skills" ("id", "name", "icon_url", "icon_slug", "category", "proficiency", "is_featured", "sort_order", "created_at") VALUES ('5f6b172b-2fcb-4b58-b78b-f94e7905d94b', 'Firebase', NULL, 'firebase', 'backend', 65, TRUE, 4, '2026-06-04T05:41:08.69346+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "icon_url" = EXCLUDED."icon_url", "icon_slug" = EXCLUDED."icon_slug", "category" = EXCLUDED."category", "proficiency" = EXCLUDED."proficiency", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "skills" ("id", "name", "icon_url", "icon_slug", "category", "proficiency", "is_featured", "sort_order", "created_at") VALUES ('9166104a-70bb-44ff-bd94-612970a2eb61', 'Supabase', NULL, 'supabase', 'backend', 65, TRUE, 5, '2026-06-04T05:41:08.69346+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "icon_url" = EXCLUDED."icon_url", "icon_slug" = EXCLUDED."icon_slug", "category" = EXCLUDED."category", "proficiency" = EXCLUDED."proficiency", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "skills" ("id", "name", "icon_url", "icon_slug", "category", "proficiency", "is_featured", "sort_order", "created_at") VALUES ('a2492541-105c-42be-ba0f-e86d2df59758', 'Java', NULL, 'openjdk', 'languages', 75, TRUE, 1, '2026-06-04T05:41:08.69346+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "icon_url" = EXCLUDED."icon_url", "icon_slug" = EXCLUDED."icon_slug", "category" = EXCLUDED."category", "proficiency" = EXCLUDED."proficiency", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "skills" ("id", "name", "icon_url", "icon_slug", "category", "proficiency", "is_featured", "sort_order", "created_at") VALUES ('16c30451-f66b-41f0-8fce-d8bbbb7b8817', 'C#', NULL, 'c', 'languages', 75, TRUE, 2, '2026-06-04T05:41:08.69346+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "icon_url" = EXCLUDED."icon_url", "icon_slug" = EXCLUDED."icon_slug", "category" = EXCLUDED."category", "proficiency" = EXCLUDED."proficiency", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "skills" ("id", "name", "icon_url", "icon_slug", "category", "proficiency", "is_featured", "sort_order", "created_at") VALUES ('94b90c2a-1724-4c42-9619-cdfcb7a52916', 'VB.NET', NULL, 'dotnet', 'languages', 70, TRUE, 3, '2026-06-04T05:41:08.69346+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "icon_url" = EXCLUDED."icon_url", "icon_slug" = EXCLUDED."icon_slug", "category" = EXCLUDED."category", "proficiency" = EXCLUDED."proficiency", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "skills" ("id", "name", "icon_url", "icon_slug", "category", "proficiency", "is_featured", "sort_order", "created_at") VALUES ('2f3467dd-76fb-4459-ae70-1d68b6182867', 'Python', NULL, 'python', 'languages', 75, TRUE, 4, '2026-06-04T05:41:08.69346+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "icon_url" = EXCLUDED."icon_url", "icon_slug" = EXCLUDED."icon_slug", "category" = EXCLUDED."category", "proficiency" = EXCLUDED."proficiency", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "skills" ("id", "name", "icon_url", "icon_slug", "category", "proficiency", "is_featured", "sort_order", "created_at") VALUES ('e845160c-c74d-4ea7-9c91-dce43a706b2c', 'PHP', NULL, 'php', 'languages', 80, TRUE, 5, '2026-06-04T05:41:08.69346+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "icon_url" = EXCLUDED."icon_url", "icon_slug" = EXCLUDED."icon_slug", "category" = EXCLUDED."category", "proficiency" = EXCLUDED."proficiency", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "skills" ("id", "name", "icon_url", "icon_slug", "category", "proficiency", "is_featured", "sort_order", "created_at") VALUES ('afd1bcee-2926-4f8c-890a-a1e74f7fcf32', 'Dart', NULL, 'dart', 'languages', 65, TRUE, 6, '2026-06-04T05:41:08.69346+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "icon_url" = EXCLUDED."icon_url", "icon_slug" = EXCLUDED."icon_slug", "category" = EXCLUDED."category", "proficiency" = EXCLUDED."proficiency", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "skills" ("id", "name", "icon_url", "icon_slug", "category", "proficiency", "is_featured", "sort_order", "created_at") VALUES ('c10a6554-62af-4ad5-8bda-141245a80bf2', 'MySQL', NULL, 'mysql', 'database', 80, TRUE, 1, '2026-06-04T05:41:08.69346+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "icon_url" = EXCLUDED."icon_url", "icon_slug" = EXCLUDED."icon_slug", "category" = EXCLUDED."category", "proficiency" = EXCLUDED."proficiency", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "skills" ("id", "name", "icon_url", "icon_slug", "category", "proficiency", "is_featured", "sort_order", "created_at") VALUES ('e817977a-8b5e-4208-a326-14eabafc4bf0', 'Microsoft SQL Server', NULL, 'microsoftsqlserver', 'database', 80, TRUE, 2, '2026-06-04T05:41:08.69346+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "icon_url" = EXCLUDED."icon_url", "icon_slug" = EXCLUDED."icon_slug", "category" = EXCLUDED."category", "proficiency" = EXCLUDED."proficiency", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "skills" ("id", "name", "icon_url", "icon_slug", "category", "proficiency", "is_featured", "sort_order", "created_at") VALUES ('b8caf0d4-5d20-4ff9-a37c-ae540ddefa47', 'MongoDB', NULL, 'mongodb', 'database', 70, TRUE, 4, '2026-06-04T05:41:08.69346+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "icon_url" = EXCLUDED."icon_url", "icon_slug" = EXCLUDED."icon_slug", "category" = EXCLUDED."category", "proficiency" = EXCLUDED."proficiency", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "skills" ("id", "name", "icon_url", "icon_slug", "category", "proficiency", "is_featured", "sort_order", "created_at") VALUES ('2852d5cf-52f9-4ff3-9b3d-4872eb14f334', 'Flutter', NULL, 'flutter', 'mobile', 70, TRUE, 1, '2026-06-04T05:41:08.69346+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "icon_url" = EXCLUDED."icon_url", "icon_slug" = EXCLUDED."icon_slug", "category" = EXCLUDED."category", "proficiency" = EXCLUDED."proficiency", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "skills" ("id", "name", "icon_url", "icon_slug", "category", "proficiency", "is_featured", "sort_order", "created_at") VALUES ('f7864808-10ae-4f21-a7bb-e2eab2b42454', 'HTML5', NULL, 'html5', 'frontend', 95, TRUE, 1, '2026-06-04T05:41:08.69346+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "icon_url" = EXCLUDED."icon_url", "icon_slug" = EXCLUDED."icon_slug", "category" = EXCLUDED."category", "proficiency" = EXCLUDED."proficiency", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "skills" ("id", "name", "icon_url", "icon_slug", "category", "proficiency", "is_featured", "sort_order", "created_at") VALUES ('86f44a8f-ad31-4c68-aa6c-e64ac625bc8e', 'PostgreSQL', NULL, 'postgresql', 'database', 75, TRUE, 20, '2026-06-09T05:24:00.289117+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "icon_url" = EXCLUDED."icon_url", "icon_slug" = EXCLUDED."icon_slug", "category" = EXCLUDED."category", "proficiency" = EXCLUDED."proficiency", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "skills" ("id", "name", "icon_url", "icon_slug", "category", "proficiency", "is_featured", "sort_order", "created_at") VALUES ('42493490-c411-4aee-85d6-17ef11609dc0', 'REST API', NULL, 'swagger', 'backend', 60, TRUE, 36, '2026-06-04T06:05:06.565219+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "icon_url" = EXCLUDED."icon_url", "icon_slug" = EXCLUDED."icon_slug", "category" = EXCLUDED."category", "proficiency" = EXCLUDED."proficiency", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";

-- ------------------------------------------------------------
-- Table: education (2 rows)
-- ------------------------------------------------------------
INSERT INTO "education" ("id", "institution", "degree", "field", "grade", "logo_url", "institution_url", "start_date", "end_date", "is_current", "achievements", "description", "sort_order", "created_at") VALUES ('18f6029d-9378-4d1b-9a90-95394120c641', 'SEMCOM College', 'Bachelor of Computer Applications (BCA)', 'Computer Science & Technology', '9.55/10', NULL, NULL, '2022-07-18', '2025-04-30', FALSE, '["Rising Star Of Semcom"]'::jsonb, '', 2, '2026-05-30T18:41:48.82916+00:00') ON CONFLICT ("id") DO UPDATE SET "institution" = EXCLUDED."institution", "degree" = EXCLUDED."degree", "field" = EXCLUDED."field", "grade" = EXCLUDED."grade", "logo_url" = EXCLUDED."logo_url", "institution_url" = EXCLUDED."institution_url", "start_date" = EXCLUDED."start_date", "end_date" = EXCLUDED."end_date", "is_current" = EXCLUDED."is_current", "achievements" = EXCLUDED."achievements", "description" = EXCLUDED."description", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "education" ("id", "institution", "degree", "field", "grade", "logo_url", "institution_url", "start_date", "end_date", "is_current", "achievements", "description", "sort_order", "created_at") VALUES ('07a2e59a-1b4d-4ed3-b334-729c5ea4144c', 'Sardar Patel University, Vallabh Vidyanagar', 'Master of Computer Applications (MCA)', 'Computer Science & Technology', '', NULL, NULL, '2025-08-14', NULL, TRUE, '[]'::jsonb, '', 1, '2026-05-30T18:41:48.82916+00:00') ON CONFLICT ("id") DO UPDATE SET "institution" = EXCLUDED."institution", "degree" = EXCLUDED."degree", "field" = EXCLUDED."field", "grade" = EXCLUDED."grade", "logo_url" = EXCLUDED."logo_url", "institution_url" = EXCLUDED."institution_url", "start_date" = EXCLUDED."start_date", "end_date" = EXCLUDED."end_date", "is_current" = EXCLUDED."is_current", "achievements" = EXCLUDED."achievements", "description" = EXCLUDED."description", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";

-- ------------------------------------------------------------
-- Table: certificates (9 rows)
-- ------------------------------------------------------------
INSERT INTO "certificates" ("id", "title", "issuer", "issue_date", "expiry_date", "credential_id", "credential_url", "image_url", "is_featured", "sort_order", "created_at") VALUES ('ec697668-974e-42cd-a551-806dd478057f', 'SQL for Data Science', 'University of California, Davis', '2023-10-01', NULL, NULL, 'https://coursera.org/share/7030f67c50a19ef5998ea9dd89e4a2f3', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/certificates/xyi4j1j4o2k_1780462357931.png', TRUE, 0, '2026-05-30T18:49:13.569634+00:00') ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "issuer" = EXCLUDED."issuer", "issue_date" = EXCLUDED."issue_date", "expiry_date" = EXCLUDED."expiry_date", "credential_id" = EXCLUDED."credential_id", "credential_url" = EXCLUDED."credential_url", "image_url" = EXCLUDED."image_url", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "certificates" ("id", "title", "issuer", "issue_date", "expiry_date", "credential_id", "credential_url", "image_url", "is_featured", "sort_order", "created_at") VALUES ('f8d357c2-ab6d-4c7e-aaa1-b669ba66eb3d', 'Exploratory Data Analysis for Machine Learning', 'IBM', '2025-01-01', NULL, 'Coursera', 'https://coursera.org/share/0d578c6809cb9e38b68dbd8322de2371', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/certificates/i8dzftly4y_1780462335686.jpg', TRUE, 0, '2026-05-30T18:49:13.569634+00:00') ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "issuer" = EXCLUDED."issuer", "issue_date" = EXCLUDED."issue_date", "expiry_date" = EXCLUDED."expiry_date", "credential_id" = EXCLUDED."credential_id", "credential_url" = EXCLUDED."credential_url", "image_url" = EXCLUDED."image_url", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "certificates" ("id", "title", "issuer", "issue_date", "expiry_date", "credential_id", "credential_url", "image_url", "is_featured", "sort_order", "created_at") VALUES ('61c68cf2-54ff-4e19-a3e6-30ff1abf033b', 'Python Basics: Selection and Iteration', 'Codio', '2024-02-01', NULL, NULL, 'https://coursera.org/share/1bbe181c1f51f3362a978b4add22aa7a', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/certificates/udte7kgvd2f_1780462303617.jpg', FALSE, 0, '2026-05-30T18:49:13.569634+00:00') ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "issuer" = EXCLUDED."issuer", "issue_date" = EXCLUDED."issue_date", "expiry_date" = EXCLUDED."expiry_date", "credential_id" = EXCLUDED."credential_id", "credential_url" = EXCLUDED."credential_url", "image_url" = EXCLUDED."image_url", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "certificates" ("id", "title", "issuer", "issue_date", "expiry_date", "credential_id", "credential_url", "image_url", "is_featured", "sort_order", "created_at") VALUES ('e8bb83d5-3ea9-4d43-859e-8b984c4056d7', 'Python Basic Structures: Lists, Strings, and Files', 'Codio', '2024-02-01', NULL, NULL, 'https://coursera.org/share/c2238b0f8fae2234ac3263dd6d2c6574', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/certificates/exejzeu3a2a_1780462294540.jpg', FALSE, 0, '2026-05-30T18:49:13.569634+00:00') ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "issuer" = EXCLUDED."issuer", "issue_date" = EXCLUDED."issue_date", "expiry_date" = EXCLUDED."expiry_date", "credential_id" = EXCLUDED."credential_id", "credential_url" = EXCLUDED."credential_url", "image_url" = EXCLUDED."image_url", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "certificates" ("id", "title", "issuer", "issue_date", "expiry_date", "credential_id", "credential_url", "image_url", "is_featured", "sort_order", "created_at") VALUES ('1d3274b4-a11f-4fa5-81c3-53f6e62a2f0b', 'Introduction to Java Enterprise Edition (EE)', 'LearnQuest', '2024-06-01', NULL, NULL, 'https://coursera.org/share/4a59db71aaa7fc8abbcf9d05ad00321f', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/certificates/qtf9p8p6f2e_1780462267817.jpg', TRUE, 0, '2026-05-30T18:49:13.569634+00:00') ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "issuer" = EXCLUDED."issuer", "issue_date" = EXCLUDED."issue_date", "expiry_date" = EXCLUDED."expiry_date", "credential_id" = EXCLUDED."credential_id", "credential_url" = EXCLUDED."credential_url", "image_url" = EXCLUDED."image_url", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "certificates" ("id", "title", "issuer", "issue_date", "expiry_date", "credential_id", "credential_url", "image_url", "is_featured", "sort_order", "created_at") VALUES ('876b5a60-5196-4ee7-846e-dd72a9a6d68a', 'Introduction to Java', 'LearnQuest', '2023-09-01', NULL, NULL, 'https://coursera.org/share/dc353e2fa74bed2baa04d80c30c5eb10', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/certificates/ruxlrdc9q9_1780462328873.jpg', FALSE, 0, '2026-05-30T18:49:13.569634+00:00') ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "issuer" = EXCLUDED."issuer", "issue_date" = EXCLUDED."issue_date", "expiry_date" = EXCLUDED."expiry_date", "credential_id" = EXCLUDED."credential_id", "credential_url" = EXCLUDED."credential_url", "image_url" = EXCLUDED."image_url", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "certificates" ("id", "title", "issuer", "issue_date", "expiry_date", "credential_id", "credential_url", "image_url", "is_featured", "sort_order", "created_at") VALUES ('a3c56eb4-5740-4cbe-98f1-687a57316c6d', 'Software Development Processes and Methodologies', 'University of Minnesota', '2023-10-01', NULL, NULL, 'https://coursera.org/verify/FMTXU6CX896V', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/certificates/yutcr82aizr_1780463282599.jpg', FALSE, 0, '2026-05-30T18:49:13.569634+00:00') ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "issuer" = EXCLUDED."issuer", "issue_date" = EXCLUDED."issue_date", "expiry_date" = EXCLUDED."expiry_date", "credential_id" = EXCLUDED."credential_id", "credential_url" = EXCLUDED."credential_url", "image_url" = EXCLUDED."image_url", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "certificates" ("id", "title", "issuer", "issue_date", "expiry_date", "credential_id", "credential_url", "image_url", "is_featured", "sort_order", "created_at") VALUES ('c17919e5-096c-4a56-9608-ba4c5f562576', 'Introduction to Artificial Intelligence (AI)', 'IBM', '2024-06-01', NULL, NULL, 'https://coursera.org/share/2ccc9de040f12ecb134bfccb1e5c69c3', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/certificates/e0ai5e85gue_1780463271400.jpg', TRUE, 0, '2026-05-30T18:49:13.569634+00:00') ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "issuer" = EXCLUDED."issuer", "issue_date" = EXCLUDED."issue_date", "expiry_date" = EXCLUDED."expiry_date", "credential_id" = EXCLUDED."credential_id", "credential_url" = EXCLUDED."credential_url", "image_url" = EXCLUDED."image_url", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";
INSERT INTO "certificates" ("id", "title", "issuer", "issue_date", "expiry_date", "credential_id", "credential_url", "image_url", "is_featured", "sort_order", "created_at") VALUES ('21d4432d-4468-495b-9407-515a0db61062', 'Introduction to the Internet of Things and Embedded Systems', 'University of California, Irvine', '2025-01-01', NULL, NULL, 'https://coursera.org/share/3f7870a9f33e1404cdaa298dd9b2d540', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/certificates/c3_110726_234942.jpg', TRUE, 0, '2026-05-30T18:49:13.569634+00:00') ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "issuer" = EXCLUDED."issuer", "issue_date" = EXCLUDED."issue_date", "expiry_date" = EXCLUDED."expiry_date", "credential_id" = EXCLUDED."credential_id", "credential_url" = EXCLUDED."credential_url", "image_url" = EXCLUDED."image_url", "is_featured" = EXCLUDED."is_featured", "sort_order" = EXCLUDED."sort_order", "created_at" = EXCLUDED."created_at";

-- ------------------------------------------------------------
-- Table: blog_posts (1 rows)
-- ------------------------------------------------------------
INSERT INTO "blog_posts" ("id", "title", "slug", "excerpt", "content", "cover_image_url", "tags", "status", "is_featured", "view_count", "read_time_minutes", "created_at", "published_at", "updated_at") VALUES ('1ee02bb2-567d-4a41-bbbd-cc1ecb6e3fda', 'Building a Scalable Cloud Kitchen App with ASP.NET', 'scalable-cloud-kitchen-asp-net', 'Built a full-featured Cloud Kitchen Management System using ASP.NET and SQL Server during TYBCA Semester 6 at SEMCOM. The project focused on online food ordering, secure authentication, dynamic menu management, and efficient order processing while strengthening my backend development and database design skills.', '<div class="project-blog">

  <!-- HERO SECTION -->
  <div class="project-hero">
    <span class="project-badge">TYBCA Semester 6 Project</span>

    <h1>Cloud Kitchen Management System</h1>

    <p class="project-intro">
      During my TYBCA Semester 6 at SEMCOM, I developed a complete
      <strong>Cloud Kitchen Management System</strong> focused on delivering
      a seamless and efficient experience for both customers and administrators.
      The project was designed to simplify online food ordering while providing
      powerful backend management for menus, orders, and customer interactions.
    </p>
  </div>

  <!-- TECHNOLOGY STACK -->
  <div class="project-section">
    <h2>🚀 Technology Stack</h2>

    <p>
      The application was built using
      <strong>ASP.NET</strong>,
      <strong>VB.NET</strong>, and
      <strong>SQL Server</strong>.
    </p>

    <p>
      ASP.NET provided a scalable and structured backend environment, while
      VB.NET enabled secure and efficient business logic implementation.
      The system followed a database-driven architecture to ensure smooth
      order handling, secure authentication, and reliable data management.
    </p>
  </div>

  <!-- PROJECT OBJECTIVES -->
  <div class="project-section">
    <h2>🎯 Project Objectives</h2>

    <ul class="project-list">
      <li>Develop a complete online food ordering platform.</li>
      <li>Create an efficient admin management system.</li>
      <li>Implement secure authentication and database handling.</li>
      <li>Provide a responsive and user-friendly experience.</li>
      <li>Improve order tracking and menu management.</li>
    </ul>
  </div>

  <!-- FEATURES -->
  <div class="project-section">
    <h2>✨ Key Features</h2>

    <div class="feature-grid">

      <div class="feature-card">
        <h3>🔐 Secure Authentication</h3>
        <p>
          Implemented secure login and access control for both customers and administrators.
        </p>
      </div>

      <div class="feature-card">
        <h3>📋 Dynamic Menu Management</h3>
        <p>
          Administrators can manage food items, pricing, and availability in real time.
        </p>
      </div>

      <div class="feature-card">
        <h3>🛒 Order Processing System</h3>
        <p>
          Customers can place orders while administrators can monitor and process them efficiently.
        </p>
      </div>

      <div class="feature-card">
        <h3>📱 Responsive User Interface</h3>
        <p>
          Designed for a smooth and user-friendly experience across devices.
        </p>
      </div>

    </div>
  </div>

  <!-- CHALLENGES -->
  <div class="project-section">
    <h2>⚡ Challenges Faced</h2>

    <p>
      One of the major challenges during development was designing an efficient
      order processing workflow while maintaining proper database relationships
      and ensuring smooth user interaction across different modules.
    </p>

    <p>
      Managing dynamic menu updates, authentication flow, and responsive layouts
      also helped improve my problem-solving and debugging skills.
    </p>
  </div>

  <!-- LEARNING -->
  <div class="project-section">
    <h2>📚 What I Learned</h2>

    <p>
      This project significantly improved my understanding of backend architecture,
      database relationships, authentication systems, and real-world web application development.
    </p>

    <p>
      It also strengthened my skills in building scalable systems using
      <strong>ASP.NET</strong> and
      <strong>SQL Server</strong>.
    </p>
  </div>

  <!-- FUTURE ENHANCEMENTS -->
  <div class="project-section">
    <h2>🚀 Future Enhancements</h2>

    <ul class="project-list">
      <li>Mobile application integration.</li>
    </ul>
  </div>

  <!-- PROJECT GUIDANCE -->
  <div class="project-section">
    <h2>👨‍🏫 Project Guidance</h2>

    <p>
      This project was developed during TYBCA Semester 6 at SEMCOM under the
      guidance of <strong>Mr. Premal Soni</strong> and coordinated by
      <strong>Mrs. Palak Patel</strong> and <strong>Dr. Mehul Patel</strong>
    </p>

    <p>
      Their continuous support, mentorship, and valuable insights played an
      important role throughout the development process.
    </p>
  </div>

</div>

<style>
.project-blog {
  color: #e2e8f0;
  line-height: 1.9;
}

.project-hero {
  padding: 2.2rem;
  border-radius: 22px;
  background: linear-gradient(
    135deg,
    rgba(15,23,42,0.96),
    rgba(30,41,59,0.92)
  );
  border: 1px solid rgba(125,211,252,0.15);
  margin-bottom: 2.5rem;
  box-shadow: 0 20px 60px rgba(0,0,0,0.35);
}

.project-badge {
  display: inline-block;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: rgba(34,211,238,0.1);
  border: 1px solid rgba(34,211,238,0.25);
  color: #67e8f9;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.project-hero h1 {
  font-size: 3rem;
  line-height: 1.1;
  margin-bottom: 1rem;
  color: white;
}

.project-intro {
  color: #cbd5e1;
  font-size: 1.05rem;
}

.project-section {
  margin-bottom: 3rem;
}

.project-section h2 {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.7rem;
}

.project-section p {
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.project-list {
  padding-left: 1.5rem;
  color: #cbd5e1;
}

.project-list li {
  margin-bottom: 0.7rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.feature-card {
  padding: 1.25rem;
  border-radius: 18px;
  background: rgba(15,23,42,0.72);
  border: 1px solid rgba(125,211,252,0.12);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: rgba(34,211,238,0.32);
  box-shadow: 0 10px 30px rgba(34,211,238,0.08);
}

.feature-card h3 {
  margin-bottom: 0.7rem;
  color: #67e8f9;
  font-size: 1rem;
}

.feature-card p {
  font-size: 0.93rem;
  color: #cbd5e1;
}

@media (max-width: 768px) {

  .project-hero {
    padding: 1.5rem;
  }

  .project-hero h1 {
    font-size: 2rem;
  }

  .project-section h2 {
    font-size: 1.35rem;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>', 'https://gyxmopzajamqwcynwiyx.supabase.co/storage/v1/object/public/projects/w6uirohd79r_1780589255863.jpg', '["ASP.NET","VB.NET","SQL Server","backend"]'::jsonb, 'published', TRUE, 142, 4, '2026-05-30T19:07:00.722725+00:00', '2026-05-13T21:13:00+00:00', '2026-06-06T14:54:20.002815+00:00') ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "slug" = EXCLUDED."slug", "excerpt" = EXCLUDED."excerpt", "content" = EXCLUDED."content", "cover_image_url" = EXCLUDED."cover_image_url", "tags" = EXCLUDED."tags", "status" = EXCLUDED."status", "is_featured" = EXCLUDED."is_featured", "view_count" = EXCLUDED."view_count", "read_time_minutes" = EXCLUDED."read_time_minutes", "created_at" = EXCLUDED."created_at", "published_at" = EXCLUDED."published_at", "updated_at" = EXCLUDED."updated_at";

-- ------------------------------------------------------------
-- Table: messages (4 rows)
-- ------------------------------------------------------------
INSERT INTO "messages" ("id", "name", "email", "subject", "body", "is_read", "is_replied", "ip_address", "created_at") VALUES ('63da4792-b9d5-4992-b39f-21c6e5eda96f', 'Dhruvil Rana', 'idkranadhruvil2209@gmail.com', 'Want to make an AI web game on android with swift for linux', '😐😶‍🌫️', TRUE, FALSE, '1.39.57.24', '2026-06-05T06:05:20.76341+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "subject" = EXCLUDED."subject", "body" = EXCLUDED."body", "is_read" = EXCLUDED."is_read", "is_replied" = EXCLUDED."is_replied", "ip_address" = EXCLUDED."ip_address", "created_at" = EXCLUDED."created_at";
INSERT INTO "messages" ("id", "name", "email", "subject", "body", "is_read", "is_replied", "ip_address", "created_at") VALUES ('ad00d442-2faa-48f1-8ae1-847c3b31c4bb', 'Raviraj Chauhan', 'ravirajchauhan219@gmail.com', 'Testing ', 'Hello.Vinyabhauu 😁🫡 Jabrdasti design ho baki ', TRUE, FALSE, '47.11.96.62', '2026-06-07T13:27:28.087676+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "subject" = EXCLUDED."subject", "body" = EXCLUDED."body", "is_read" = EXCLUDED."is_read", "is_replied" = EXCLUDED."is_replied", "ip_address" = EXCLUDED."ip_address", "created_at" = EXCLUDED."created_at";
INSERT INTO "messages" ("id", "name", "email", "subject", "body", "is_read", "is_replied", "ip_address", "created_at") VALUES ('55c84c4e-9eee-450c-aaf9-b15dce3d8f4a', 'Prince Patel', 'princezoom24@gmail.com', 'Kem che bhaii', 'Kem che mara bhaiiii 😁', TRUE, FALSE, '152.59.3.91', '2026-08-07T17:11:07.860244+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "subject" = EXCLUDED."subject", "body" = EXCLUDED."body", "is_read" = EXCLUDED."is_read", "is_replied" = EXCLUDED."is_replied", "ip_address" = EXCLUDED."ip_address", "created_at" = EXCLUDED."created_at";
INSERT INTO "messages" ("id", "name", "email", "subject", "body", "is_read", "is_replied", "ip_address", "created_at") VALUES ('9c72ee04-60e3-433f-8448-0b1c4f78b456', 'Raja rajesh', 'rajeshdethariya19@gmail.com', 'portfolio', 'Bhai muje apna portfolio banana hai aap agar hamara marg darshan kare to acha lagega hame.', TRUE, FALSE, '152.59.3.118', '2026-08-10T16:49:21.065835+00:00') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "email" = EXCLUDED."email", "subject" = EXCLUDED."subject", "body" = EXCLUDED."body", "is_read" = EXCLUDED."is_read", "is_replied" = EXCLUDED."is_replied", "ip_address" = EXCLUDED."ip_address", "created_at" = EXCLUDED."created_at";

-- ------------------------------------------------------------
-- Table: settings (8 rows)
-- ------------------------------------------------------------
INSERT INTO "settings" ("key", "value", "updated_at") VALUES ('hero_typing_texts', '["Full-Stack Developer","MCA Student","UI/UX Enthusiast","Backend Engineer","Open Source Contributor"]'::jsonb, '2026-05-27T15:50:28.049548+00:00') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updated_at" = EXCLUDED."updated_at";
INSERT INTO "settings" ("key", "value", "updated_at") VALUES ('visitor_count', 0, '2026-05-27T15:50:28.049548+00:00') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updated_at" = EXCLUDED."updated_at";
INSERT INTO "settings" ("key", "value", "updated_at") VALUES ('show_availability', TRUE, '2026-05-27T15:50:28.049548+00:00') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updated_at" = EXCLUDED."updated_at";
INSERT INTO "settings" ("key", "value", "updated_at") VALUES ('social_github', 'https://github.com/vinitsonii', '2026-05-27T15:50:28.049548+00:00') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updated_at" = EXCLUDED."updated_at";
INSERT INTO "settings" ("key", "value", "updated_at") VALUES ('social_linkedin', 'https://linkedin.com/in/vinitsonii', '2026-05-27T15:50:28.049548+00:00') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updated_at" = EXCLUDED."updated_at";
INSERT INTO "settings" ("key", "value", "updated_at") VALUES ('coding_profiles', '{"status":"draft","github_url":"","leetcode_url":""}'::jsonb, '2026-06-04T06:04:16.358+00:00') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updated_at" = EXCLUDED."updated_at";
INSERT INTO "settings" ("key", "value", "updated_at") VALUES ('journey', '[{"id":"1","desc":"Began my BCA journey and discovered a passion for programming and web development.","year":"2022","title":"Started Coding Journey"},{"id":"2","desc":"Mastered HTML, CSS, JavaScript, PHP. Built first real web projects.","year":"2023","title":"Beginner Development"},{"id":"3","desc":"Learned ASP.NET Core, Flutter, DSA, and many more... during BCA.","year":"2024","title":"Full-Stack Developer"},{"id":"4","desc":"Started MCA. Deep-dived into Next.js, TypeScript, cloud services, and AI.","year":"2025","title":"MCA & Advanced Tech"},{"id":"5","desc":"Building production-grade applications, exploring AI integrations and DevOps.","year":"2026+","title":"Building at Scale"}]'::jsonb, '2026-07-02T07:54:39.164+00:00') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updated_at" = EXCLUDED."updated_at";
INSERT INTO "settings" ("key", "value", "updated_at") VALUES ('journey_items', '[{"id":"j1","desc":"Began my BCA journey and discovered a passion for programming and web development.","year":"2022","title":"Started Coding Journey"},{"id":"j2","desc":"Mastered HTML, CSS, JavaScript, PHP. Built first real web projects.","year":"2023","title":"Beginner Development"},{"id":"j3","desc":"Learned ASP.NET Core, Flutter, DSA, and many more... during BCA.","year":"2024","title":"Full-Stack Developer"},{"id":"j4","desc":"Started MCA. Deep-dived into Next.js, TypeScript, cloud services, and AI.","year":"2025","title":"MCA & Advanced Tech"},{"id":"j5","desc":"Building production-grade applications, exploring AI integrations and DevOps.","year":"2026+","title":"Building at Scale"}]'::jsonb, '2026-07-01T16:05:00.574+00:00') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updated_at" = EXCLUDED."updated_at";

