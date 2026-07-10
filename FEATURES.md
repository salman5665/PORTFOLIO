# 📋 Complete Feature List — Vinit Soni Portfolio

> Every single feature, big and small, documented from the actual source code.

---

## 🌐 1. PUBLIC PORTFOLIO — Pages & Routes

| Route | Description |
|---|---|
| `/` | Main portfolio homepage with all sections |
| `/blog` | Blog index page — lists all published posts |
| `/blog/[slug]` | Individual blog post page with Markdown rendering |
| `/resume` | Printable, PDF-friendly live resume page |
| `/admin` | Admin dashboard (protected) |
| `/admin/login` | Admin login page |

---

## 🏠 2. HERO SECTION

- **Animated name display** — gradient text shift animation (CSS `gradientShift` keyframe, 8s infinite cycle)
- **"Hi, I'm" soft prefix** + bold name with blue-to-purple gradient text
- **Availability badge** — glowing teal pill badge with animated breathing dot showing "Available for work" or "Open to collaborations"
- **Featured tech stack kicker** — monospace line above the name (e.g., `Next.js / TypeScript / Supabase`) pulled from live skills data
- **Tagline** — headline pulled dynamically from the profile database
- **Bio/lead paragraph** — description pulled from profile database
- **Decorative progress line** — animated gradient bar (cyan → purple → teal) that slides in on load
- **Magnetic CTA buttons** — "View Projects" and "Contact" buttons with physics-based magnetic hover effect (Framer Motion spring)
- **Tech stack chips** — up to 8 skills shown as pill badges, glow on hover with `translateY(-2px)`
- **Live stat counters** — 4 animated count-up stats: Projects, Years of Coding, Technologies, Certificates (all from live database)
- **Lottie animation panel** — right-side animated coding illustration (force-cache preloaded)
- **Glassmorphism scene shell** — macOS-style window chrome with 3 colored dots (cyan, teal, purple) framing the Lottie
- **Floating status cards** — "API · Stable" and "UI · Polished" overlay cards on the animation panel
- **Grid overlay background** — cyan grid lines with radial gradient + noise texture for depth
- **Scroll indicator** — animated vertical line with gradient drop animation + "SCROLL" label, appears after 2.2s delay
- **Bottom fade gradient** — smooth fade from section into next section
- **Reduced motion support** — breathing animation disabled via `@media (prefers-reduced-motion: reduce)`
- **LCP-safe animation** — name animates with `transform` only (no opacity) to not block Largest Contentful Paint
- **Responsive layout** — 2-column grid collapses to 1 column on tablet, full-width stacked on mobile; buttons go full-width on mobile

---

## 👤 3. ABOUT SECTION

- **Section tag** — "About Me" pill badge with User icon
- **Section title** — "Crafting Digital Experiences"
- **Profile card** — glassmorphism card with avatar, name, location, and bio
- **Avatar with IG-style popup** — click avatar to open full-screen blurred backdrop with enlarged photo, name, tagline, and availability badge; close with `Escape` key or click
- **"Open for Opportunities" badge** — animated green pulsing dot inside the card header
- **Bio paragraph** — from database `profiles.bio`
- **Quick facts grid** — 4 facts: Location, Status (Available/Unavailable), Focus, Passion
- **GitHub & LinkedIn buttons** — direct social links in the card footer
- **Journey timeline** — vertical timeline with year badge + title + description for each milestone
  - 2022: Started Coding Journey
  - 2023: Beginner Development
  - 2024: Full-Stack Developer
  - 2025: MCA & Advanced Tech
  - 2026+: Building at Scale
- **Animated stat cards** — 4 count-up cards: Projects Built, Technologies, Years of Coding, Certificates
- **CountUp animation** — stats animate from 0 to final value on scroll-into-view using `useInView` and eased `requestAnimationFrame`
- **Staggered reveal animations** — each card enters with `opacity: 0 → 1` + `y: 20 → 0`, staggered by `delay: i * 0.1`

---

## 🛠️ 4. PROJECTS SECTION

- **Section stats bar** — shows total projects count, featured count, and unique tech used count
- **Category filter pills** — dynamic pills generated from project categories: All, Web, Mobile, API, AI, Other (with matching icons)
- **Real-time search** — live search input filters by title, description, or tech stack as you type
- **"No results" empty state** — styled placeholder with icon when no projects match filters
- **Horizontal scrolling rail** — projects displayed in a smooth, touch-friendly horizontal scroll rail
- **Scroll snap** — `scroll-snap-type: x mandatory` for precise card stopping
- **Scroll progress bar** — animated gradient bar below the rail shows scroll position
- **Prev/Next navigation buttons** — left/right arrow buttons to scroll the rail programmatically
- **Mobile swipe hint** — "Swipe projects →" hint shown only on mobile screens
- **Project cards** — glassmorphism dark cards with:
  - Thumbnail image (or auto-generated visual fallback with grid + icon + initials)
  - "Featured" star badge (top-left)
  - Category badge with matching icon and color (top-right)
  - Title, short description (2-line clamp)
  - Tech stack badges (first 2 shown + `+N more`)
  - "Details" button (gradient) + GitHub icon + Live link icon
- **Project detail modal** — full-screen modal overlay on "Details" click with:
  - Left panel: large thumbnail / generated visual
  - Right panel: full description, tech stack list, modal action buttons (GitHub, Live Demo)
  - Featured + category pills in header
  - Close button (top-right) + `Escape` key support
  - Scroll lock on body when modal is open (`useBodyScrollLock` hook)
  - Glassmorphism backdrop blur
- **Featured projects sort first** — featured projects always appear before non-featured
- **Sort by `sort_order`** — secondary sort respects admin-defined order
- **Framer Motion layout animations** — smooth transitions when filter changes
- **Accessibility** — aria-labels on all icon buttons, `escape` key closes modal

---

## ✍️ 5. BLOG SECTION

- **Blog post cards** in a horizontal scrolling rail (snap scroll)
- **Cover image** — displayed if available; fallback to gradient grid + BookOpen icon
- **Image zoom on hover** — `transform: scale(1.05)` on card hover
- **Card metadata** — publish date + read time displayed in monospace pill badges
- **Post title** — 2-line clamped heading
- **Excerpt** — 3-line clamped excerpt text
- **Tags** — up to 3 tags shown as cyan pill badges with Tag icon
- **"Read Article" button** — links to `/blog/[slug]` individual post page
- **Prev/Next nav buttons** — desktop scroll controls
- **"View All" link** — links to `/blog` index
- **Scroll progress bar** — gradient bar tracking rail scroll position
- **Mobile swipe hint** — shown on small screens, hidden on desktop
- **Hover lift animation** — `whileHover={{ y: -5 }}` on each card
- **Hidden when empty** — section returns `null` if no published posts

---

## 📄 6. INDIVIDUAL BLOG POST PAGE (`/blog/[slug]`)

- Full Markdown rendering of post content
- Cover image displayed at top
- Publish date, read time, tags displayed
- Proper heading hierarchy (h1, h2, h3)
- Code block styling
- Responsive images inside Markdown
- Individual SEO metadata per post (title, description, OG image)

---

## 🏅 7. CERTIFICATES SECTION

- Certificate cards with:
  - Issuer name
  - Issue date
  - Credential ID
  - Verification link
  - Expiry date (if applicable)
- Section title and intro pulled from database
- Fully responsive grid layout
- Admin-managed: add/edit/delete from admin panel

---

## 💼 8. SKILLS SECTION

- Skills displayed in categorized groups:
  - `frontend`, `backend`, `database`, `cloud`, `tools`, `ai`
- Proficiency level (0–100) displayed per skill
- Icon per skill
- Section tag, title, and subtitle
- Responsive grid layout

---

## 📚 9. EXPERIENCE SECTION

- Job/internship/freelance history
- Fields: title, company, start date, end date, description, technologies used
- Timeline-style layout
- `technologies[]` array displayed as chip badges
- Date range displayed
- Admin-managed

---

## 🎓 10. EDUCATION SECTION

- Degree, institution, start/end year
- `achievements[]` array displayed as bullet points
- Timeline or card layout
- Admin-managed

---

## 🌟 11. TESTIMONIALS SECTION

- Quote cards with avatar, name, title/role
- Star rating display
- Admin-managed: add/edit/delete quotes and avatars

---

## 📬 12. CONTACT SECTION

- Contact form with fields: name, email, subject, message
- Form submission stored directly in Supabase `messages` table
- Email notification via **Resend** triggered on submission (HTML email template)
- Form validation and error states
- Success feedback on submission
- Social links displayed (GitHub, LinkedIn, Email)

---

## 📄 13. RESUME PAGE (`/resume`)

- Dedicated `/resume` route with a clean, minimal layout
- Live data rendered from the same Supabase tables (no separate data)
- Sections: Education, Experience, Skills, Certificates
- **Print-to-PDF** — `Ctrl+P` triggers browser print dialog for instant PDF export
- Print-optimized CSS — layout reflows cleanly for A4/letter paper
- Always up to date — no PDF file to maintain

---

## 🔗 14. GITHUB INTEGRATION

- Pulls live repository stats via the **GitHub API**
- Server-side via Next.js API route (keeps token server-side, never exposed to client)
- Displays: stars, forks, language, last updated
- Shows live coding activity

---

## 💻 15. LEETCODE INTEGRATION

- Fetches live problem-solving stats via the **LeetCode API**
- Stats shown: total solved, ranking, streak
- Server-side API route
- LeetcodeWidget component in About section

---

## 🤖 16. "ASK VINIT" AI CHATBOT

- Floating Action Button (FAB) fixed at bottom-right — gradient button with Sparkles icon
- **Draggable** — the entire FAB + panel is draggable anywhere on screen with physics constraints
- Click FAB or press **`/`** key to open
- Press **`Escape`** to close
- Animated open/close transitions (opacity + scale + y with spring ease)
- **Streaming AI responses** — responses stream token-by-token with a blinking cursor
- **Typing indicator** — 3-dot bounce animation shown while waiting for response
- **Suggestion chips** — 4 quick-start suggestions shown on first load:
  - "Is Vinit available for hire?"
  - "What tech stack does he use?"
  - "Tell me about his projects"
  - "What is his education?"
- Suggestions disappear after first message
- **Chat history persisted** — saved to `localStorage` between sessions
- **Session ID** — unique session ID generated and stored in localStorage
- **Rate limit** — max 10 user messages per session; shows warning and disables input at limit
- **Character limit** — max 300 characters per message; live counter shown (turns amber at ≤30 chars left)
- **Copy message button** — appears on hover over any message (copies to clipboard, shows ✓ checkmark for 2s)
- **Clear chat button** — trash icon in header resets conversation + localStorage
- **Unread indicator** — green dot on FAB when chat has unread message (clears on open)
- **Online status indicator** — green dot with "Online · N messages left" or amber "Limit reached" in header
- **Auto-scroll** — chat scrolls to bottom on each new message
- **Mobile responsive** — panel width adapts to `calc(100vw - 24px)` on small screens

---

## 📊 17. ANALYTICS — DUAL LAYER SYSTEM

### Layer 1: Google Analytics
- Standard GA4 integration via `@next/third-parties/google`
- Traffic sources, sessions, bounce rate, device breakdown
- Loaded from environment variable (`NEXT_PUBLIC_GA_ID`)

### Layer 2: Custom Visitor Tracker (`VisitorTracker.tsx`)

**Session & Visitor Management:**
- Persistent `visitorId` (UUID) stored in localStorage — identifies returning visitors
- Session ID with 30-minute timeout — new session created on expiry
- Tracks: `firstSeen`, `lastSeen`, `totalVisits`, `totalSessions`, `visitNumber`, `returningVisitor`
- `firstLandingPage` and `latestLandingPage` recorded
- Bots excluded via `isLikelyBot(userAgent)` check

**Events Tracked:**
- `page_view` — fired on every page navigation
- `scroll_25`, `scroll_50`, `scroll_75`, `scroll_90`, `scroll_100` — scroll depth milestones
- `scroll` — throttled scroll position updates (900ms throttle)
- `click` — all clicks on links, buttons, inputs, textareas, selects
- `page_exit` — fires when tab becomes hidden (visibility change)

**Data Collected Per Event:**
- **Browser:** userAgent, platform, touch support, cookieEnabled, language, preferred languages, timezone
- **Device:** screenWidth, screenHeight, viewportWidth, viewportHeight, devicePixelRatio, colorDepth, orientation, orientationMode
- **Hardware** *(lazy, collected on idle):* CPU cores, device memory, GPU vendor, GPU renderer, WebGL version, max texture size
- **Network:** effectiveConnectionType, RTT, downlink speed, saveData preference, online status
- **Preferences:** darkMode, lightMode, reducedMotion, reducedData, highContrast, preferredColorScheme
- **Navigation:** landingPage, previousPage, currentPage, visitedPages array, navigationSequence, referrerInfo
- **Engagement:** maxScroll, totalScrollEvents, clickCategory, clickText, clickedAt, timeBeforeFirstInteraction, timePerPage

**Click Categorization** — automatic labeling of clicks:
- Navigation, Header, Footer, Resume, GitHub, LinkedIn, Email, Phone, Projects, Blogs, Contact Form, CTA Button, Interaction

**Batching & Reliability:**
- Events are queued and flushed in batches of up to 12
- Auto-flush every 5 seconds
- On `page_exit`, remaining events are force-flushed
- Failed sends are retried after 2.5s
- Uses `keepalive: true` on fetch to survive page unloads

**Admin tracking excluded** — `/admin` and `/login` routes are never tracked

### Layer 3: Vercel Speed Insights
- `@vercel/speed-insights/next` — Core Web Vitals tracked automatically

---

## ⚙️ 18. ADMIN DASHBOARD — Complete Feature List

**Access:** Protected by Supabase Auth — all routes redirect to `/admin/login` if unauthenticated

### Admin Layout
- **Sidebar navigation** — collapsible on mobile to hamburger
- **Top bar** — shows current page title and logged-in user email
- **Smooth page transitions** via `AdminAnimations.tsx`
- **Auth guard** — `AdminAuthGuard.tsx` wraps all admin pages; checks session on every route

### Admin Dashboard Home (`/admin`)
- Overview stats cards (total projects, blog posts, messages, certificates, etc.)
- Quick-action shortcuts to each management section
- Recent activity log

### Projects Management (`/admin/projects`)
- **List view** — all projects with status, featured flag, sort order
- **Create new project** — full form modal
- **Edit project** — pre-populated form
- **Delete project** — with confirmation
- **Publish / Draft toggle** — one-click status change with optimistic UI update
- **Featured flag toggle** — mark/unmark as featured
- **Reorder** — drag-and-drop or sort_order field
- **Fields:** title, slug, short description, full description, category, tech_stack (array), thumbnail URL, gallery_urls (array), live_url, github_url, is_featured, status, sort_order

**Individual Project Editor (`/admin/projects/[id]`):**
- Dedicated full-page editor for a single project
- Image picker integration for thumbnail

### Blog Management (`/admin/blog`)
- **List view** — all posts with status, publish date, read time
- **Create new post** — Markdown editor
- **Edit post** — pre-populated Markdown editor
- **Delete post** — with confirmation
- **Publish / Draft toggle** — one-click
- **Slug auto-generation** — auto-generates from title; can be overridden
- **Tag chips** — press Enter, comma, or Space to add a tag; click × to remove
- **Publish date control** — custom date or auto-fills on first publish
- **Read time field** — set estimated read time in minutes
- **Cover image URL** — with media picker

### Skills Management (`/admin/skills`)
- Create, edit, delete skills
- Fields: name, category (frontend/backend/database/cloud/tools/ai), proficiency (0–100), icon

### Experience Management (`/admin/experience`)
- Create, edit, delete experience entries
- Fields: title, company, start date, end date, description, technologies[] (array)

### Education Management (`/admin/education`)
- Create, edit, delete education entries
- Fields: degree, institution, start year, end year, achievements[] (array)

### Certificates Management (`/admin/certificates`)
- Create, edit, delete certificates
- Fields: name, issuer, issue date, expiry date, credential ID, credential URL

### Testimonials Management (`/admin/testimonials`)
- Create, edit, delete testimonials
- Fields: quote, author name, author title/role, avatar URL, star rating

### Messages Management (`/admin/messages`)
- View all contact form submissions
- Mark as read / unread
- Mark as replied
- View full message content with timestamp

### Media Management (`/admin/media`)
- **Image uploader** (`ImageUploader.tsx`) — drag-and-drop or browse to upload images
- **Upload progress bar** (`UploadProgress.tsx`) — real-time progress feedback
- **Image preview** (`ImagePreview.tsx`) — preview uploaded images
- **Media picker modal** (`MediaPickerModal.tsx`) — browse and select from already-uploaded media library
- Images stored in **Supabase Storage**; URL returned for use in any field
- Used in: blog cover images, project thumbnails, profile avatar, OG image

### Journey Management (`/admin/journey`)
- Create, edit, delete timeline journey entries
- Fields: year, title, description

### Analytics Dashboard (`/admin/analytics`)
- View custom visitor analytics without leaving the app
- Shows data from `analytics_events` Supabase table
- Page views, unique visitors, event breakdown

### Settings (`/admin/settings`)
- Edit profile name, bio, tagline, location
- Edit social links: GitHub URL, LinkedIn URL
- Toggle `is_available_for_work`
- Edit SEO: meta title, meta description
- Upload/change OG image URL
- Upload/change favicon URL
- Upload/change Apple touch icon URL
- Edit theme accent color
- All saved to `profiles` table in Supabase

---

## 🗄️ 19. DATABASE DESIGN (Supabase / PostgreSQL)

| Table | Key Fields |
|---|---|
| `profiles` | name, bio, tagline, location, avatar_url, github_url, linkedin_url, meta_title, meta_description, og_image_url, favicon_url, apple_icon_url, is_available_for_work, theme_accent_color |
| `projects` | title, slug, short_description, description, category, tech_stack[], thumbnail_url, gallery_urls[], live_url, github_url, is_featured, status, sort_order |
| `skills` | name, category, proficiency (0–100), icon |
| `experiences` | title, company, start_date, end_date, description, technologies[] |
| `education` | degree, institution, start_year, end_year, achievements[] |
| `certificates` | name, issuer, issue_date, expiry_date, credential_id, credential_url |
| `blog_posts` | title, slug, content (Markdown), excerpt, cover_image_url, tags[], status, read_time_minutes, published_at |
| `testimonials` | quote, author_name, author_title, avatar_url, rating |
| `messages` | name, email, subject, message, is_read, is_replied, created_at |
| `analytics_events` | event_type, page, referrer, session, browser, device, hardware, network, preferences, navigation, engagement, metadata |
| `activity_logs` | admin action history |
| `settings` | key-value store for misc config |

**PostgreSQL array fields** — `tech_stack[]`, `tags[]`, `achievements[]`, `gallery_urls[]`, `technologies[]`

**Row Level Security (RLS):**
- Public reads allowed only on published/active content
- All writes require authenticated Supabase session
- Admin routes protected by both RLS policies and Next.js middleware

---

## 🔒 20. AUTHENTICATION & SECURITY

- **Supabase Auth** — JWT-based authentication for admin panel
- **Next.js middleware** (`middleware.ts`) — redirects unauthenticated users away from `/admin` routes
- **`AdminAuthGuard` component** — client-side session check wrapper on all admin pages
- **Row Level Security (RLS)** on all Supabase tables — server-enforced data protection
- **Service Role Key** kept server-side only via API routes — never exposed to browser
- **Admin panel runs at `/admin`** — custom path, not discoverable by default

---

## 🌐 21. API ROUTES (Next.js Server-Side)

| Route | Purpose |
|---|---|
| `/api/contact` | Handles contact form submission → saves to DB + sends Resend email |
| `/api/github-stats` | Fetches live GitHub repo + profile stats (server-side, token hidden) |
| `/api/leetcode-stats` | Fetches live LeetCode problem-solving stats (server-side) |
| `/api/track` | Receives analytics events from `VisitorTracker` and writes to Supabase |
| `/api/ask` | AI chatbot endpoint — streams responses for "Ask Vinit" feature |
| `/api/analytics` | Admin analytics data endpoint |
| `/api/admin-db` | Admin database operations endpoint |
| `/api/resume` | Resume data endpoint |

---

## 🎨 22. UI / UX & DESIGN SYSTEM

### Design Language
- **Dark mode only** (currently) — `#020617` background (near-black navy)
- **Glassmorphism panels** — `rgba()` backgrounds + `backdrop-filter: blur()`
- **Cyan accent** — `#67e8f9`, `#22d3ee`, `#38bdf8` for highlights, borders, glow
- **Purple secondary** — `#a78bfa`, `#8b5cf6` for gradient accents
- **Teal tertiary** — `#14b8a6`, `#2dd4bf` for badges and availability indicators
- **Grid overlay backgrounds** — subtle cyan grid lines at 72px intervals with mask fade
- **Noise texture overlay** — SVG fractal noise at 3.8% opacity for depth

### Typography
- **Primary font:** Outfit (Google Fonts) — weights 400, 500, 600, 700
- **Monospace font:** JetBrains Mono (Google Fonts) — weights 400, 500, 600
- `clamp()` fluid typography — text scales fluidly between breakpoints without media queries

### Animations & Motion
- **Framer Motion** used throughout — page transitions, section reveals, card hovers
- **Lottie** — animated coding illustration in hero section
- **Scroll-triggered reveals** — `whileInView` with `viewport={{ once: false }}` for re-animation on scroll-back
- **Staggered entry animations** — children animate in sequence with `delay: i * 0.05–0.1`
- **Magnetic button effect** — physics spring on mouse position for hero CTAs
- **AnimatePresence** — smooth mount/unmount for modals, chat panel, avatar popup
- **Lenis smooth scroll** — `LenisProvider` wraps the entire app for butter-smooth page scrolling

### Micro-interactions
- Card `translateY(-4px)` + box-shadow on hover
- Button `translateY(-2px)` on hover
- Tech chip `translateY(-2px)` + glow on hover
- Category pill active state with glow border
- Blog card `scale(1.05)` image zoom on hover
- Avatar circle `scale(1.06)` on hover
- Magnetic buttons that follow cursor

### Custom Cursor
- `CustomCursor.tsx` — custom cursor component (present in UI components)

### Scroll Animations
- `ScrollAnimations.tsx` — additional scroll-based animation utility component

### Loading States
- **Skeleton loaders** (`LoadingSkeletons.tsx`) — shimmer placeholder cards while data loads
- Shimmer animation (`@keyframes shimmer`) with `background-position` sweep
- `loading.tsx` at both root and admin level for route-level Suspense

### Toast Notifications
- **Sonner** toaster integrated globally in layout
- Rich colors, custom styling (Outfit font, rounded corners, white background)
- Positioned at `bottom-right`

### Responsive Design
- Mobile-first breakpoints at `640px`, `768px`, `1080px`
- 3-column → 2-column → 1-column grid transitions
- Admin sidebar collapses to hamburger on narrow viewports
- Touch-friendly tap targets on all interactive elements
- `min-height: 100dvh` (dynamic viewport height) for correct mobile sizing
- `-webkit-overflow-scrolling: touch` on scroll rails

---

## 🔍 23. SEO & METADATA

- **Dynamic metadata** — `generateMetadata()` in `layout.tsx` fetches live data from Supabase `profiles` table
- **Title template** — `%s | Vinit Soni` applied to all pages
- **Meta description** — from database
- **Open Graph tags** — og:title, og:description, og:image (1200×630), og:type, og:url, og:siteName, og:locale
- **Twitter Card** — `summary_large_image` with title, description, creator, and image
- **Keywords array** — 12 keywords including name, role, skills, location
- **Canonical URL** — set to site URL
- **Dynamic favicon** — loaded from database `favicon_url` field with cache-busting (`?v=updated_at`)
- **Apple touch icon** — loaded from database `apple_icon_url` field
- **Robots meta** — `index: true, follow: true` with full Googlebot config
- **JSON-LD structured data** (`JsonLd.tsx`) — Schema.org markup for search engines
- **Sitemap** (`sitemap.ts`) — auto-generated sitemap for all public pages and blog posts
- **robots.txt** (`robots.ts`) — configured to allow all crawlers on public routes
- **PWA manifest** (`manifest.ts`) — Web App Manifest for installability
- **ISR (Incremental Static Regeneration)** — `revalidate = 60` on layout for 60-second cache refresh
- **Viewport meta** — `width=device-width, initialScale=1, maximumScale=5, themeColor=#020817`
- **Apple mobile web app** meta tags — `apple-mobile-web-app-capable`, status bar style, app title
- **Lottie preload** — `<link rel="preload">` with `fetchPriority="high"` so animation loads before it's needed

---

## 🧰 24. CUSTOM HOOKS

| Hook | File | Purpose |
|---|---|---|
| `useBodyScrollLock` | `src/lib/hooks/useBodyScrollLock.ts` | Locks body scroll when a modal/drawer is open; cross-browser compatible |
| `useImageUpload` | `src/lib/hooks/useImageUpload.ts` | Handles image upload to Supabase Storage with progress, error states, and URL return |
| `useCountUp` | Inside `HeroSection.tsx` | Counts a number from 0 to target with eased `requestAnimationFrame` loop, triggered by `useInView` |

---

## 📧 25. EMAIL SYSTEM (Resend)

- **Contact form email** — HTML email sent to developer's inbox on every contact form submission
- **Rich HTML templates** (`emailTemplates.ts`) — professionally styled HTML email with sender name, email, subject, and message
- **Server-side only** — Resend API key never exposed to client
- **Confirmation/error handling** — form shows success/error state after submission

---

## 🏗️ 26. ARCHITECTURE & INFRASTRUCTURE

### Frontend Framework
- **Next.js 16** — App Router, Server Components, file-based routing
- **React** with TypeScript — strict typing throughout
- **Bootstrap 5** — grid and layout utilities (paired with heavy custom CSS so it doesn't look like Bootstrap)
- **Custom CSS** — CSS variables (`var(--color-bg)`, `var(--color-text)`, etc.), `clamp()` typography, component-level `<style>` tags

### Backend
- **Supabase** — PostgreSQL + Auth + Storage + real-time on one platform
- **Next.js API Routes** — thin server-side handlers for secrets-dependent integrations
- **`adminDb.ts`** — server-only admin Supabase client using service role key

### Supabase Clients (3 separate clients)
- `client.ts` — public browser client for read operations
- `server.ts` — server component client (no service key)
- `admin.ts` — service role client for write operations in API routes

### Deployment
- **Vercel** — zero-config deployment, push to `main` = live
- Automatic branch preview deployments
- Environment variables managed in Vercel dashboard

### TypeScript Types
- `types.ts` in `src/lib/supabase/` — full typed interfaces for all database tables:
  `Profile`, `Project`, `Skill`, `Certificate`, `BlogPost`, `Experience`, `Education`, `Testimonial`, `Message`, `JourneyItem`, etc.

### Analytics Intelligence
- `intelligence.ts` in `src/lib/analytics/` — utility functions: `getReferrerInfo()` (parses referrer source), `isLikelyBot()` (bot detection by userAgent)

### Page Transitions
- `PageTransition.tsx` — wraps page content in Framer Motion `AnimatePresence` for smooth route-to-route transitions

---

## 📦 27. THIRD-PARTY LIBRARIES & INTEGRATIONS

| Library | Purpose |
|---|---|
| `framer-motion` | All animations: page transitions, section reveals, card hovers, modals |
| `lottie-react` | Hero section animated coding illustration |
| `@lenis/react` | Smooth scroll provider for the entire site |
| `react-countup` | Count-up animation for About section stats |
| `lucide-react` | Icon set (Layers, Code2, Star, Search, BookOpen, etc.) |
| `react-icons` | GitHub, LinkedIn brand icons (`FaGithub`, `FaLinkedinIn`) |
| `next/image` | Optimized image rendering with `fill`, `sizes`, lazy loading |
| `@supabase/supabase-js` | Database, Auth, Storage client |
| `resend` | Transactional email on contact form |
| `sonner` | Toast notification system |
| `@next/third-parties` | Google Analytics integration |
| `@vercel/speed-insights` | Core Web Vitals tracking |
| `react-markdown` | Markdown rendering for blog post pages |
| `Outfit` (Google Fonts) | Primary typeface |
| `JetBrains Mono` (Google Fonts) | Monospace typeface for code and labels |

---

## 🔢 28. NUMBERS AT A GLANCE

| Metric | Count |
|---|---|
| Public pages / routes | 6+ |
| Admin management sections | 13 |
| API routes | 8 |
| React components | 30+ |
| Custom hooks | 3 |
| Database tables | 12 |
| Analytics event types | 10+ |
| Analytics data fields per event | 30+ |
| Third-party libraries integrated | 17+ |
| CSS keyframe animations | 8+ |
| Responsive breakpoints | 3 |

---

*Generated from full source code audit — every feature documented from actual implementation.*
*Stack: Next.js 16 · React · TypeScript · Supabase · PostgreSQL · Framer Motion · Lottie · Lenis · Bootstrap 5 · Resend · Vercel*
