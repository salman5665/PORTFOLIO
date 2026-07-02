// Server Component — fetches all portfolio data server-side
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import SkillsSection from '@/components/sections/SkillsSection'
import CodingProfilesSection, { type CodingProfilesConfig } from '@/components/sections/CodingProfilesSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import ExperienceSection from '@/components/sections/ExperienceSection'
import EducationSection from '@/components/sections/EducationSection'
import CertificatesSection from '@/components/sections/CertificatesSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import BlogSection from '@/components/sections/BlogSection'
import ContactSection from '@/components/sections/ContactSection'
import JsonLd from '@/components/seo/JsonLd'
import ScrollAnimations from '@/components/ui/ScrollAnimations'
import { createServerClient } from '@/lib/supabase/server'
import type { Profile, Skill, Project, Experience, Education, Certificate, Testimonial, BlogPost, JourneyItem } from '@/lib/supabase/types'


export const revalidate = 0 // Force dynamic rendering so new data always shows

async function fetchAllData() {
  const db = createServerClient()
  const [
    { data: profile },
    { data: skills },
    { data: projects },
    { data: experiences },
    { data: educations },
    { data: certificates },
    { data: testimonials },
    { data: blogPosts },
    { data: codingProfilesSetting },
    { data: journeySetting },
  ] = await Promise.all([
    db.from('profiles').select('*').order('updated_at', { ascending: false }).limit(1).single(),
    db.from('skills').select('*').order('sort_order'),
    db.from('projects').select('*').eq('status', 'published').order('sort_order'),
    db.from('experiences').select('*').order('sort_order'),
    db.from('education').select('*').order('sort_order'),
    db.from('certificates').select('*').order('issue_date', { ascending: false }),
    db.from('testimonials').select('*').order('sort_order'),
    db.from('blog_posts').select('*').eq('status', 'published').order('published_at', { ascending: false }).limit(6),
    db.from('settings').select('value').eq('key', 'coding_profiles').maybeSingle(),
    db.from('settings').select('value').eq('key', 'journey').maybeSingle(),
  ])

  return {
    profile: profile as Profile | null,
    skills: (skills || []) as Skill[],
    projects: (projects || []) as Project[],
    experiences: (experiences || []) as Experience[],
    educations: (educations || []) as Education[],
    certificates: (certificates || []) as Certificate[],
    testimonials: (testimonials || []) as Testimonial[],
    blogPosts: (blogPosts || []) as BlogPost[],
    codingProfiles: (codingProfilesSetting?.value || null) as CodingProfilesConfig | null,
    journey: (journeySetting?.value || null) as JourneyItem[] | null,
  }
}

export default async function HomePage() {
  const data = await fetchAllData()

  return (
    <>
      <JsonLd profile={data.profile} />
      <ScrollAnimations />
      <Navbar profile={data.profile} />
      <main className="portfolio-main">
        <HeroSection profile={data.profile} projects={data.projects} skills={data.skills} certificates={data.certificates} />
        <AboutSection profile={data.profile} projects={data.projects} skills={data.skills} certificates={data.certificates} journey={data.journey || undefined} />
        <SkillsSection skills={data.skills} />
        <CodingProfilesSection config={data.codingProfiles} />
        <ProjectsSection projects={data.projects} />
        <ExperienceSection experiences={data.experiences} />
        <EducationSection educations={data.educations} />
        <CertificatesSection certificates={data.certificates} />
        <TestimonialsSection testimonials={data.testimonials} />
        <BlogSection posts={data.blogPosts} />
        <ContactSection profile={data.profile} />
      </main>
      <Footer profile={data.profile} />
    </>
  )
}

