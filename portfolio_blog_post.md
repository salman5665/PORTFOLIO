# I Shipped My First Full-Stack Developer Portfolio — Here's Everything I Built and Learned

> *This started as a simple portfolio idea. It ended up as a full-stack product with an admin dashboard, blog system, analytics, GitHub integrations, and 20+ features. Here's the entire honest journey.*

---

When most people build a portfolio, they pick a template, swap in their name and projects, and call it done.

I almost did that too.

But something felt wrong about it. A portfolio is supposed to *show* what you can build — and using someone else's template felt like showing up to a cooking competition with store-bought food. So I made a decision: **build it like a real product, not just a static page.**

Version 1 is now live. Here's everything I built, every decision I made, every thing I broke, and everything I learned.

---

## The Core Idea: A Portfolio That Manages Itself

From the beginning, the main goal was clear: **I should never have to touch the code just to update my content.**

Every time I finish a new project, add a certificate, write a blog post, or update my skills — I want to log in to an admin panel and make that change in 30 seconds. No git commits. No redeployments. No editing JSON files.

That one requirement changed everything. It forced me to build this like a real full-stack application, not a brochure website.

---

## What I Actually Built

Here's the full list of features that shipped in v1:

### 🌐 Public Portfolio
- **Dynamic homepage** — every section (hero, about, skills, projects, blog, testimonials, contact) is powered by live data from the database
- **Projects section** — with tech stack tags, live demo links, GitHub links, and featured flags
- **Blog system** — full blog with individual post pages, Markdown rendering, tags, and read-time estimates
- **Certificates section** — credential cards with issue date and verification links
- **Skills, Education & Experience** — all managed from the admin, displayed with clean timeline and grid layouts
- **Testimonials** — social proof section, fully admin-driven
- **Contact / Messages** — form submissions go directly to the database (and trigger an email via Resend)
- **Resume page** — printable, PDF-friendly layout — a clean resume that lives at its own URL

### ⚙️ Admin Dashboard
- **Custom admin panel** at `/admin` — not a third-party CMS, built entirely from scratch
- **Projects management** — create, edit, delete, publish/draft, reorder
- **Blog management** — Markdown editor, tag chips, publish date control, status toggle
- **Skills management** — category, proficiency level, icon
- **Experience & Education** — full CRUD with date ranges and achievement lists
- **Certificates** — with credential ID, URL, and expiry date
- **Testimonials** — manage quotes and avatars
- **Media uploads** — upload images via Supabase Storage, get URLs back
- **Messages** — read and manage contact form submissions
- **Settings** — edit your profile, bio, social links, SEO metadata, OG image — all from a form

### 📊 Analytics
- **Google Analytics** integration — standard traffic tracking
- **Custom visitor analytics** — a hand-rolled analytics system tracking page views, events, and visitor metadata stored in Supabase
- **Analytics dashboard** in admin — view traffic data without leaving the app

### 🔗 Integrations
- **GitHub API** — pulls live repository stats and profile data
- **LeetCode stats** — shows coding activity and problem-solving stats on the portfolio
- **Resend** — emails me when someone submits the contact form
- **Google Analytics** — for production traffic insights
- **Supabase Auth** — protects every admin route

### 🎨 UI/UX
- **Fully mobile responsive** — works across all screen sizes
- **Skeleton loading states** — content placeholders while data loads, no jarring layout shifts
- **Smooth section transitions** — Framer Motion animations throughout
- **Improved navbar** — sticky, blur-on-scroll, mobile hamburger menu
- **Footer** with social links pulled dynamically from the profile
- **Glassmorphism design language** — dark mode, cyan accent, grid overlays, subtle gradients

---

## The Tech Stack

### Frontend
| Tool | Why I chose it |
|---|---|
| **Next.js 16** | App Router, Server Components, built-in SEO metadata API, file-based routing |
| **React + TypeScript** | Type safety caught real bugs during development |
| **Bootstrap 5** | Grid and layout utilities — paired with heavy custom CSS so it doesn't look like Bootstrap |
| **Framer Motion** | Page transitions and micro-animations with almost no effort |
| **Lucide React** | Consistent, clean icon set |
| **Custom CSS** | CSS variables, `clamp()` typography, glassmorphism panels, hover effects |

### Backend & Database
| Tool | Why I chose it |
|---|---|
| **Supabase** | PostgreSQL + Auth + Storage + real-time in one platform |
| **PostgreSQL** | Structured relational data with arrays, JSON fields, and proper RLS |
| **Supabase Auth** | JWT-based auth, row-level security policies, zero boilerplate |
| **Supabase Storage** | Media uploads for images, handled server-side |
| **Next.js API Routes** | Thin server-side handlers for integrations that need server secrets |

### Integrations
| Tool | Purpose |
|---|---|
| **GitHub API** | Live repo stats and profile data |
| **LeetCode API** | Coding stats (problems solved, streak, ranking) |
| **Resend** | Transactional email on contact form submission |
| **Google Analytics** | Production traffic tracking |

### Deployment
- **Vercel** — push to `main`, it's live. Zero config, automatic previews for branches.

---

## The Database Design

Getting the schema right early was one of the best decisions I made. The database ended up with these tables:

- `profiles` — personal info, social links, SEO metadata, theme settings
- `projects` — with `tech_stack[]`, `gallery_urls[]`, `slug`, `status`, `is_featured`, `sort_order`
- `skills` — categorized (`frontend`, `backend`, `database`, `cloud`, `tools`, `ai`), with proficiency 0–100
- `experiences` — job/internship/freelance history with `technologies[]`
- `education` — degrees with `achievements[]`
- `certificates` — with credential ID, issuer, expiry
- `blog_posts` — Markdown content, `tags[]`, `status`, `read_time_minutes`, `published_at`
- `testimonials` — quotes with rating
- `messages` — contact form submissions with read/replied flags
- `analytics_events` — custom event tracking
- `activity_logs` — admin action history
- `settings` — key-value store for misc config

Row Level Security (RLS) was set up on day one. Public reads on published content only. All writes require authenticated sessions. This meant the admin panel was secure from the start without any extra middleware.

---

## Building the Admin Panel

This was the most ambitious part of the project, and the part I'm most proud of.

I built the entire admin from scratch — no third-party CMS, no Sanity, no Contentful. Just my own React components talking to Supabase.

**What made it challenging:**

- **Scroll locking** — when a modal is open, the page behind it shouldn't scroll. Getting this to work consistently across browsers and mobile required a custom `useBodyScrollLock` hook.
- **Form state management** — every admin section has complex forms with arrays (tags, tech stack, achievements). Managing these without a form library while keeping the UI responsive took careful state design.
- **Optimistic updates** — after toggling publish status or deleting an item, the UI should update instantly without waiting for a re-fetch. This required updating local state immediately alongside the async Supabase call.
- **Markdown editor** — the blog editor is a plain `<textarea>` with monospace styling. Simple, but it works. The slug auto-generates from the title (but you can override it), tags work as keyboard-activated chips (press Enter, comma, or space to add), and publish date can be custom-set or auto-filled on first publish.

---

## The Blog System

Building a blog inside my own portfolio was something I didn't originally plan — but I'm really glad I did.

The flow:
1. Write Markdown content in the admin editor
2. Add tags, excerpt, cover image URL, publish date
3. Hit "Publish" — post appears instantly at `/blog/[slug]`

The blog index at `/blog` shows all published posts in a responsive 3-column grid with cover images, read-time, tags, and excerpts. Individual post pages render the Markdown with proper heading hierarchy, code blocks, and responsive images.

The whole thing is CMS-driven. This post you're reading right now? Published from the admin panel.

---

## Resume Page

One of my favourite smaller features: a dedicated `/resume` page with a print-friendly layout.

Instead of hosting a PDF and hoping it's not out of date, the resume page renders live data from the database. Education, experience, skills, and certificates — all pulled from the same Supabase tables that power the rest of the portfolio.

Hit `Ctrl+P` and print to PDF. Always up to date.

---

## GitHub & LeetCode Integrations

I wanted the portfolio to feel alive — not just a static list of things I've done, but something that shows what I'm actively working on.

The **GitHub integration** pulls repo data via the GitHub API — stars, forks, language, last updated. It gives visitors a real sense of my coding activity.

The **LeetCode integration** fetches my problem-solving stats — total solved, ranking, and streak. For someone studying DSA and competitive programming, this felt important to include.

Both integrations run server-side via Next.js API routes, keeping the API keys out of the client bundle.

---

## Analytics: Two Layers

I went with two analytics systems:

**Google Analytics** — for standard traffic data: sessions, bounce rate, traffic sources, device breakdown. This is what most sites have.

**Custom analytics** — a hand-rolled system using a `analytics_events` Supabase table. Every page view and significant user action gets tracked with metadata (page, user-agent, timestamp). This lives in the admin dashboard so I can see what's happening without leaving my own app.

Was building custom analytics overkill? Probably. Did I learn a lot from it? Absolutely.

---

## Honest Challenges & Things I'd Do Differently

**Scroll behavior and overlays** took way more time than expected. Getting modals, drawers, and fixed navbars to all coexist without fighting each other was the most frustrating debugging session of the project. The fix ended up being a combination of scroll-lock hooks, z-index discipline, and accepting that some browser quirks just need workarounds.

**TypeScript strictness** — I started with loose types and tightened them later. Every time I retrofitted a type, I found an actual bug hiding in the code. Lesson learned: start strict.

**Building admin before public UI** — I built the admin panel before properly designing the public portfolio. This meant I was writing data management code without a clear picture of how that data would actually look. Next time: design the public UI first, then build the CMS to feed it.

**CSS organization** — scoped styles inside JSX `<style>` tags worked fine for individual components, but as the project grew, finding a specific CSS rule became a treasure hunt. A proper CSS module setup or design token system from the start would have helped.

---

## What I Learned

This project taught me more than any tutorial or course could. Here's what actually stuck:

**Full-stack application structure** — understanding how the frontend, backend, database, and auth layer need to talk to each other — and where things go wrong when they don't.

**Admin dashboard workflows** — building tools that *you* use every day teaches you to care about UX in a way that client-facing features don't. If the admin is frustrating, you'll hate using it.

**Authentication and protected routes** — Supabase Auth + RLS + Next.js middleware gave me a solid understanding of how auth actually works at the infrastructure level.

**Dynamic content management** — the difference between a site where content lives in the code and one where it lives in a database is night and day when you want to update something at 11pm without touching git.

**Database design** — spending time upfront on schema design paid off many times over. Arrays in PostgreSQL (`text[]`) for things like tags and tech stack were genuinely useful.

**Debugging scroll behavior and overlays** — I could write a whole post about this alone. Fixed elements, z-index stacking contexts, iOS scroll momentum — all of these are traps.

**Handling forms, uploads, and messages** — real form handling (validation, error states, success feedback, optimistic UI) is much more work than tutorials show.

**Making a project feel production-ready** — skeleton loaders, empty states, error handling, SEO metadata, sitemap, robots.txt, OG images — none of these are hard individually, but doing all of them is what separates "demo" from "shipped."

---

## Responsive Design

Every section of the portfolio works on mobile. This meant:
- Single-column layouts on small screens
- Collapsing the admin sidebar to a hamburger on narrow viewports
- Touch-friendly tap targets for all interactive elements
- Testing on real devices, not just DevTools responsive mode

The grid system shifts from 3 columns → 2 columns → 1 column across breakpoints using Bootstrap's responsive utilities, combined with CSS `clamp()` for fluid typography that never needs a wall of `@media` overrides.

---

## What's Next for v2

Version 1 is shipped, but I'm already thinking about what comes next:

- **WYSIWYG / rich text editor** in the admin — writing raw Markdown works, but a better editor would make blogging faster
- **Dark/light mode toggle** for visitors — the design is currently dark-mode-only
- **Post series / categories** — for grouping related blog posts
- **Newsletter integration** — collect emails and send updates when I publish new posts
- **More GitHub data** — contribution graph, commit history, pinned repos
- **Performance optimizations** — image optimization pipeline, more aggressive caching

---

## Final Thoughts

If I had to summarize what I built in one sentence:

> *A full-stack content management system that happens to look like a portfolio.*

Building this taught me more about real-world web development than anything else I've worked on. Every bug was a lesson. Every redesign was a better decision. Every integration that took twice as long as expected taught me something I'll carry into the next project.

If you're a developer who keeps putting off building your portfolio because you're not sure what to use or how to start — I get it. But the answer isn't to wait for the perfect tech stack or the perfect design. Ship something. Then improve it.

Version 1 is always better than version 0.

---

🔗 **GitHub:** [github.com/vinitsonii/vinitsonii-portfolio](https://github.com/vinitsonii/vinitsonii-portfolio)  
🌐 **Live Portfolio:** *(link coming soon)*

---

*Stack: Next.js 16 · React · TypeScript · Supabase · PostgreSQL · Bootstrap 5 · Framer Motion · Lucide React · Resend · Vercel · GitHub API · LeetCode API · Google Analytics*

*Tags: next.js · react · typescript · supabase · portfolio · full-stack · web-development · developer-journey · admin-dashboard · build-in-public · mca*
