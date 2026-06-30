'use client';

import { useEffect, useState, useRef } from 'react';
import type { MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useInView } from 'framer-motion';
import Lottie from 'lottie-react';
import type { Profile, Skill, Project, Certificate } from '@/lib/supabase/types'


function useCountUp(to: number, durationMs = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const start = performance.now();
    let id = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / durationMs, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -12 * p);
      setCount(Math.round(eased * to));
      if (p < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [inView, to, durationMs]);

  return { count, ref };
}

function StatItem({ to, suffix, label }: { to: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(to);
  return (
    <div ref={ref} className="hs-stat">
      <div className="hs-stat-value">
        <span className="hs-stat-num">{count}</span>
        <span className="hs-stat-suffix">{suffix}</span>
      </div>
      <span className="hs-stat-label">{label}</span>
    </div>
  );
}

function MagneticButton({
  href,
  variant,
  children,
  target,
  rel,
}: {
  href: string;
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  target?: string;
  rel?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left - r.width / 2) * 0.2);
    y.set((e.clientY - r.top - r.height / 2) * 0.2);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      className={variant === 'primary' ? 'hs-btn-p' : 'hs-btn-s'}
      style={{ x: sx, y: sy, display: 'inline-flex' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      target={target}
      rel={rel}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.a>
  );
}

function DecorativeLine() {
  return (
    <div className="hs-deco-line">
      <motion.div
        className="hs-deco-progress"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}


function HeroAnimation({ animationData }: { animationData: object | null }) {
  if (!animationData) {
    // Invisible placeholder keeps layout stable — nothing visible while loading
    return <div className="hs-spline-wrapper" aria-hidden="true" />;
  }

  return (
    <motion.div
      className="hs-spline-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <div className="hs-scene-shell">
        <div className="hs-panel-bar">
          <span /><span /><span />
        </div>
        <div className="hs-lottie-inner">
          <Lottie
            animationData={animationData}
            loop
            autoplay
            className="hs-lottie-player"
          />
        </div>
        <div className="hs-scene-card hs-scene-card-a">
          <span>API</span>
          <strong>Stable</strong>
        </div>
        <div className="hs-scene-card hs-scene-card-b">
          <span>UI</span>
          <strong>Polished</strong>
        </div>
      </div>
    </motion.div>
  );
}


interface HeroSectionProps {
  profile?: Profile | null;
  projects?: Project[];
  skills?: Skill[];
  certificates?: Certificate[];
}

export default function HeroSection({ profile, projects = [], skills = [], certificates = [] }: HeroSectionProps) {
  const [lottieData, setLottieData] = useState<object | null>(null);

  useEffect(() => {
    // 'force-cache' reuses the preloaded response from <link rel="preload">
    // so no extra network round-trip happens — the data is already in memory
    fetch('/hero-animation.json', { cache: 'force-cache' })
      .then((r) => r.json())
      .then(setLottieData)
      .catch(() => { }); // silent fail — animation simply won't show
  }, []);

  const techStack = skills.slice(0, 8);
  const displayName = profile?.name?.trim() || 'Vinit Soni';
  const tagline = profile?.tagline?.trim() || 'Full-Stack Developer';
  const lead = profile?.bio?.trim() || 'I build fast, reliable web and mobile products with clean architecture, thoughtful interfaces, and production-minded engineering.';
  const availabilityLabel = profile?.is_available_for_work === false ? 'Open to collaborations' : 'Available for work';
  const featuredStack = techStack.slice(0, 4).map((skill) => skill.name).join(' / ') || 'Next.js / TypeScript / Supabase';
  const yearsCoding = Math.max(1, new Date().getFullYear() - 2022);
  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  });
  // LCP-safe: animate only transform, never hide opacity so browser can measure paint immediately
  const revealLCP = (delay: number) => ({
    initial: { y: 18 },
    animate: { y: 0 },
    transition: { delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <>
      <style>{`
        .hs-root *, .hs-root *::before, .hs-root *::after { box-sizing: border-box; }

        .hs-root {
          position: relative;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          overflow: hidden;
          background:
            linear-gradient(135deg, rgba(12, 22, 36, 0.96) 0%, rgba(2, 6, 23, 1) 44%, rgba(4, 12, 22, 1) 100%);
          isolation: isolate;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .hs-root::before {
          content: '';
          position: absolute; inset: 0; z-index: 1;
          pointer-events: none;
          background:
            linear-gradient(rgba(56, 189, 248, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.055) 1px, transparent 1px),
            linear-gradient(115deg, transparent 0%, rgba(14, 165, 233, 0.16) 48%, transparent 78%);
          background-size: 72px 72px, 72px 72px, 100% 100%;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 92%);
        }
        .hs-root::after {
          content: '';
          position: absolute; inset: 0; z-index: 2;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
          opacity: 0.38;
        }


        .hs-container {
          position: relative; z-index: 10;
          width: 100%; max-width: 1240px;
          margin: 0 auto; padding: 7.5rem 3rem 6.5rem;
          display: flex; flex-direction: column;
        }

        .hs-top-row {
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(420px, 1fr);
          gap: 4rem;
          align-items: center;
          width: 100%;
        }

        .hs-bottom-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          margin-top: 4rem;
        }

        .hs-left { display: flex; flex-direction: column; align-items: flex-start; max-width: 620px; }

        .hs-right {
          position: relative;
          width: 100%; min-height: 520px;
          display: flex; align-items: center; justify-content: center;
        }

        .hs-badge {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 8px 18px 8px 12px; border-radius: 100px;
          background: rgba(20, 184, 166, 0.1); border: 1px solid rgba(45, 212, 191, 0.24);
          color: #99f6e4; font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          margin-bottom: 1.2rem; backdrop-filter: blur(12px);
        }
        .hs-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #2dd4bf;
          box-shadow: 0 0 0 2px rgba(45, 212, 191, 0.2), 0 0 12px rgba(45, 212, 191, 0.5);
          animation: breathe 3s ease-in-out infinite;
        }
        @keyframes breathe {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.85); }
        }

        .hs-kicker {
          margin: 0 0 1.15rem;
          color: rgba(125, 211, 252, 0.82);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .hs-name {
          font-size: 4.6rem; font-weight: 800;
          letter-spacing: 0; line-height: 0.96; color: #f8fafc; margin-bottom: 1rem;
        }
        .hs-name-soft {
          display: block;
          color: rgba(226, 232, 240, 0.72);
          font-size: 0.46em;
          font-weight: 600;
          line-height: 1.2;
          margin-bottom: 0.3rem;
        }
        .hs-name-accent {
          display: block;
          background: linear-gradient(135deg, #f8fafc 0%, #7dd3fc 44%, #a78bfa 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; background-size: 200% 200%;
          animation: gradientShift 8s ease infinite;
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }

        .hs-headline {
          font-size: 1.18rem; font-weight: 600;
          color: #bae6fd; letter-spacing: 0; margin-bottom: 1.15rem; line-height: 1.4;
        }
        .hs-desc {
          font-size: 1.02rem; font-weight: 400;
          color: rgba(203, 213, 225, 0.76); line-height: 1.85;
          max-width: 560px; margin-bottom: 2.35rem;
        }
        .hs-desc strong { font-weight: 600; color: rgba(226, 232, 240, 0.92); }

        .hs-deco-line {
          width: 86px; height: 2px; background: rgba(148, 163, 184, 0.14);
          margin-bottom: 2.35rem; position: relative; overflow: hidden; border-radius: 999px;
        }
        .hs-deco-progress {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, #22d3ee, #8b5cf6, #14b8a6); transform-origin: left;
        }

        .hs-tech { display: flex; flex-wrap: wrap; gap: 9px; margin-bottom: 2.0rem; max-width: 840px; justify-content: center; }
        .hs-tech-chip {
          padding: 7px 15px; border-radius: 999px;
          background: rgba(15, 23, 42, 0.64); border: 1px solid rgba(125, 211, 252, 0.14);
          color: rgba(203, 213, 225, 0.78); font-size: 0.76rem; font-weight: 600;
          font-family: 'JetBrains Mono', monospace; letter-spacing: 0;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); cursor: default;
        }
        .hs-tech-chip:hover {
          background: rgba(14, 165, 233, 0.12); border-color: rgba(56, 189, 248, 0.36);
          color: rgba(240, 249, 255, 0.95); transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(14, 165, 233, 0.14);
        }

        .hs-actions { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; width: 100%; }

        .hs-btn-p {
          align-items: center; gap: 10px; padding: 14px 32px; border-radius: 12px;
          font-size: 0.9rem; font-weight: 700; color: #020617;
          background: linear-gradient(135deg, #67e8f9 0%, #38bdf8 48%, #a78bfa 100%);
          border: none; text-decoration: none; position: relative; overflow: hidden;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; letter-spacing: 0;
        }
        .hs-btn-p::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, #cffafe 0%, #7dd3fc 55%, #c4b5fd 100%);
          opacity: 0; transition: opacity 0.35s;
        }
        .hs-btn-p:hover::before { opacity: 1; }
        .hs-btn-p span { position: relative; z-index: 1; }
        .hs-btn-p:hover { transform: translateY(-2px); box-shadow: 0 16px 46px rgba(14, 165, 233, 0.28); }

        .hs-btn-s {
          align-items: center; gap: 10px; padding: 14px 28px; border-radius: 12px;
          font-size: 0.9rem; font-weight: 600; color: rgba(226, 232, 240, 0.78);
          background: rgba(15, 23, 42, 0.56); border: 1px solid rgba(125, 211, 252, 0.18);
          text-decoration: none; transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer; letter-spacing: 0;
        }
        .hs-btn-s:hover {
          color: rgba(248, 250, 252, 0.96); background: rgba(14, 165, 233, 0.1);
          border-color: rgba(56, 189, 248, 0.42); transform: translateY(-2px);
        }

        .hs-stats {
          display: flex; gap: 0; margin-top: 3.25rem; padding: 1rem;
          border: 1px solid rgba(125, 211, 252, 0.12);
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.76), rgba(2, 6, 23, 0.42));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.045);
          width: 100%; justify-content: center;
        }
        .hs-stat {
          min-width: 140px;
          padding: 0.85rem 1.35rem;
          text-align: center;
          border-right: 1px solid rgba(125, 211, 252, 0.1);
        }
        .hs-stat:last-child { border-right: 0; }
        .hs-stat-value {
          justify-content: center;
          display: flex; align-items: baseline; gap: 3px;
          font-size: 2rem; font-weight: 800;
          color: #f8fafc; letter-spacing: 0; line-height: 1;
        }
        .hs-stat-suffix {
          font-size: 1.4rem; font-weight: 500;
          background: linear-gradient(135deg, #67e8f9, #a78bfa);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .hs-stat-label {
          font-size: 0.68rem; font-weight: 700; color: rgba(148, 163, 184, 0.74);
          text-transform: uppercase; letter-spacing: 0.2em; margin-top: 8px; display: block;
        }

        .hs-spline-wrapper {
          position: relative;
          width: 100%; height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          overflow: visible;
        }

        .hs-scene-shell {
          position: relative;
          width: min(100%, 560px);
          margin-inline: auto;
          min-height: 460px;
          border: 1px solid rgba(125, 211, 252, 0.16);
          border-radius: 28px;
          background:
            linear-gradient(rgba(125, 211, 252, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(125, 211, 252, 0.045) 1px, transparent 1px),
            linear-gradient(145deg, rgba(15, 23, 42, 0.76), rgba(2, 6, 23, 0.44));
          background-size: 38px 38px, 38px 38px, 100% 100%;
          box-shadow: 0 28px 90px rgba(2, 6, 23, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06);
          overflow: hidden;
        }

        .hs-panel-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 42px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 18px;
          border-bottom: 1px solid rgba(125, 211, 252, 0.1);
          background: rgba(2, 6, 23, 0.36);
          z-index: 2;
        }
        .hs-panel-bar span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(148, 163, 184, 0.55);
        }
        .hs-panel-bar span:nth-child(1) { background: #38bdf8; }
        .hs-panel-bar span:nth-child(2) { background: #14b8a6; }
        .hs-panel-bar span:nth-child(3) { background: #8b5cf6; }

        /* Lottie */
        .hs-lottie-inner {
          width: 100%; min-height: 460px;
          display: flex; align-items: flex-start; justify-content: center;
          background: transparent;
          padding-top: 34px;
        }
        .hs-lottie-player {
          width: 100%; height: 420px;
          background: transparent !important;
        }
        .hs-lottie-player > div,
        .hs-lottie-player svg {
          background: transparent !important;
        }

        /* Skeleton shimmer */
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .hs-lottie-skeleton {
          align-items: center;
          padding-top: 0;
        }
        .hs-skeleton-inner {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 24px; width: 100%;
          padding: 60px 32px;
        }
        .hs-skeleton-circle {
          width: 180px; height: 180px; border-radius: 50%;
          background: linear-gradient(90deg,
            rgba(125,211,252,0.06) 25%,
            rgba(125,211,252,0.14) 50%,
            rgba(125,211,252,0.06) 75%
          );
          background-size: 600px 100%;
          animation: shimmer 1.6s infinite linear;
        }
        .hs-skeleton-lines {
          display: flex; flex-direction: column;
          align-items: center; gap: 12px; width: 100%;
        }
        .hs-skeleton-line {
          height: 12px; border-radius: 999px;
          background: linear-gradient(90deg,
            rgba(125,211,252,0.06) 25%,
            rgba(125,211,252,0.14) 50%,
            rgba(125,211,252,0.06) 75%
          );
          background-size: 600px 100%;
          animation: shimmer 1.6s infinite linear;
        }
        .hs-skeleton-bar {
          width: 60%; height: 38px; border-radius: 12px;
          background: linear-gradient(90deg,
            rgba(125,211,252,0.06) 25%,
            rgba(125,211,252,0.14) 50%,
            rgba(125,211,252,0.06) 75%
          );
          background-size: 600px 100%;
          animation: shimmer 1.6s infinite linear;
        }

        .hs-scene-card {
          position: absolute;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border: 1px solid rgba(125, 211, 252, 0.18);
          border-radius: 14px;
          background: rgba(2, 6, 23, 0.68);
          backdrop-filter: blur(14px);
          box-shadow: 0 16px 38px rgba(2, 6, 23, 0.34);
          color: #e2e8f0;
        }
        .hs-scene-card span {
          color: #67e8f9;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
        }
        .hs-scene-card strong {
          font-size: 0.82rem;
          letter-spacing: 0;
        }
        .hs-scene-card-a { left: 24px; bottom: 26px; }
        .hs-scene-card-b { right: 24px; top: 68px; }

        .hs-spline-fade-l, .hs-spline-fade-r,
        .hs-spline-fade-t, .hs-spline-fade-b {
          display: none;
        }

        .hs-scroll {
          position: absolute; bottom: 2.5rem; left: 50%;
          transform: translateX(-50%); z-index: 10;
          display: flex; flex-direction: column; align-items: center; gap: 10px;
        }
        .hs-scroll-line {
          width: 1px; height: 48px;
          background: linear-gradient(to bottom, rgba(125, 211, 252, 0.34), transparent);
          position: relative; overflow: hidden;
        }
        .hs-scroll-line::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 16px;
          background: linear-gradient(to bottom, #67e8f9, #a78bfa);
          animation: scrollDrop 2.5s ease-in-out infinite;
        }
        @keyframes scrollDrop {
          0%   { transform: translateY(-20px); opacity: 0; }
          30%  { opacity: 1; }
          70%  { transform: translateY(48px); opacity: 1; }
          100% { transform: translateY(48px); opacity: 0; }
        }
        .hs-scroll-label {
          font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(148, 163, 184, 0.55); font-weight: 600;
        }
        .hs-fade {
          position: absolute; bottom: 0; left: 0; right: 0; height: 200px;
          background: linear-gradient(to top, #020617, transparent);
          pointer-events: none; z-index: 5;
        }

                @media (max-width: 1080px) {
          .hs-top-row { grid-template-columns: 1fr; gap: 4rem; text-align: center; }
          .hs-container { padding: 7rem 2.5rem 6rem; }
          .hs-left { align-items: center; }
          .hs-desc { text-align: center; }
          .hs-tech { justify-content: center; }
          .hs-right { min-height: 340px; }
          .hs-bottom-row { margin-top: 2.75rem; }
        }
        @media (max-width: 640px) {
          .hs-name { font-size: 3.35rem; }
          .hs-stats { gap: 2rem; flex-wrap: wrap; }
          .hs-stat { border-right: 0; min-width: 120px; padding: 0.65rem 0.75rem; }
          .hs-stat-value { font-size: 1.7rem; }
          .hs-actions { width: 100%; flex-direction: column; }
          .hs-btn-p, .hs-btn-s { width: 100%; justify-content: center; }
          .hs-container { padding: 6rem 1.25rem 5rem; }
          .hs-right { min-height: 230px; }
          .hs-scene-shell { min-height: 300px; border-radius: 22px; }
          .hs-lottie-inner { min-height: 300px; }
          .hs-lottie-player { height: 280px; }
          .hs-scene-card { display: none; }
          .hs-badge { margin-bottom: 1.75rem; }
          .hs-desc { margin-bottom: 2rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hs-badge-dot     { animation: none; }
        }
      `}</style>

      <section className="hs-root">

        <div className="hs-container">
          <div className="hs-top-row">

            <div className="hs-left">
              <motion.div
                className="hs-badge"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="hs-badge-dot" />
                {availabilityLabel}
              </motion.div>

              <motion.p className="hs-kicker" {...reveal(0.08)}>
                {featuredStack}
              </motion.p>

              <motion.div
                initial={{ y: 24 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="hs-name" aria-label={`Hi, I'm ${displayName}`}>
                  <span className="hs-name-soft" aria-hidden="true">Hi, I&apos;m</span>
                  <span className="hs-name-accent" aria-hidden="true">{displayName}</span>
                </h1>
              </motion.div>

              <motion.p
                className="hs-headline"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {tagline}
              </motion.p>

              <motion.p className="hs-desc" {...revealLCP(0.35)}>
                {lead}
              </motion.p>

              <DecorativeLine />


            </div>


            <div className="hs-right">
              <HeroAnimation animationData={lottieData} />
            </div>
          </div>

          <div className="hs-bottom-row">
            <motion.div className="hs-tech" {...reveal(0.5)}>
              {techStack.map((tech) => (
                <span key={tech.name} className="hs-tech-chip">{tech.name}</span>
              ))}
            </motion.div>
            <motion.div className="hs-actions" {...reveal(0.6)}>
              <MagneticButton href="#projects" variant="primary">
                <span>View Projects</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </MagneticButton>


              <MagneticButton href="#contact" variant="secondary">
                <span>Contact</span>
              </MagneticButton>
            </motion.div>

            <div className="hs-stats">
              <StatItem to={projects.length || 1} suffix="+" label="Projects" />
              <StatItem to={yearsCoding} suffix="+" label="Years" />
              <StatItem to={skills.length || 1} suffix="+" label="Tech" />
              <StatItem to={certificates.length || 0} suffix="+" label="Certificates" />
            </div>
          </div>
        </div>

        <motion.div
          className="hs-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
        >
          <div className="hs-scroll-line" />
          <span className="hs-scroll-label">Scroll</span>
        </motion.div>

        <div className="hs-fade" />
      </section>
    </>
  );
}
