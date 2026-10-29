<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</div>

<h1 align="center">Salman - Premium Developer Portfolio</h1>

<p align="center">
  A highly dynamic, full-stack developer portfolio built to showcase projects, skills, certifications, and experience. Engineered with Next.js App Router, fully managed by a secure Supabase backend, and styled with Tailwind CSS & Framer Motion for a premium, glassmorphic dark-mode aesthetic.
</p>

---

## ✨ Key Features

- **Dynamic Data-Driven UI:** Everything from the Hero Section to the Projects and Certifications is dynamically pulled from Supabase. No hardcoded content.
- **Secure Admin Dashboard:** A custom-built, authenticated admin panel to manage, add, or delete projects, skills, blogs, and experiences on the fly.
- **Automated Resume Generation:** Features a dedicated `/resume` route that seamlessly acts as a beautiful web resume and exports as a perfectly formatted PDF.
- **Dynamic Blog System:** A fully functional blog engine for sharing technical articles and personal insights.
- **Premium Aesthetics:** Carefully crafted with dark mode, glowing accents, and smooth micro-animations using Framer Motion.
- **SEO Optimized:** Implemented standard JSON-LD and robust metadata for optimal search engine indexing.

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework:** Next.js (App Router, Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom Design System)
- **Animations:** Framer Motion, Lottie
- **Icons:** Lucide React, React Icons

### Backend & Database
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth (for Admin Panel)
- **Data Fetching:** Native `fetch` with aggressive caching and ISR (Incremental Static Regeneration) support.

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed, as well as a [Supabase](https://supabase.com/) account.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/salman5665/PORTFOLIO.git
   cd portfolio-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## 📂 Project Structure

```text
src/
├── app/                  # Next.js App Router pages (Home, Resume, Admin)
├── components/           # Reusable React components
│   ├── admin/            # Admin dashboard components
│   ├── layout/           # Navbar, Footer, etc.
│   ├── sections/         # Hero, About, Projects, Skills sections
│   └── resume/           # PDF Generation and Web Resume UI
├── lib/                  # Utilities, Types, and Supabase config
└── styles/               # Global CSS and Tailwind directives
```

## 🌐 Deployment

This project is optimized for deployment on **Vercel**. 
Simply import your GitHub repository into Vercel and map your Supabase environment variables.

## 👨‍💻 Author

**Salman**  
*Full-Stack Developer & MCA Student*  
[LinkedIn](https://linkedin.com/in/salman5665) • [GitHub](https://github.com/salman5665)

---
*Built with passion and modern web technologies.*

