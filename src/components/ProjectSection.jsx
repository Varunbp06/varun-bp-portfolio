import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaExternalLinkAlt,
  FaGithub,
  FaTimes,
  FaPython,
  FaReact,
  FaDatabase,
  FaDocker,
  FaGitAlt,
  FaRocket,
} from 'react-icons/fa';
import {
  SiFastapi,
  SiNextdotjs,
  SiTailwindcss,
  SiPostgresql,
  SiRedis,
  SiPytorch,
  SiTypescript,
  SiJavascript,
  SiHuggingface,
} from 'react-icons/si';
import { PiCodeBold } from 'react-icons/pi';
import { LuBadge } from 'react-icons/lu';
import { LiaLayerGroupSolid } from 'react-icons/lia';
import { useNavbar } from '../contexts/NavbarContext';
import TiltCard from './TiltCard';
import CertificatesGallery from './certs/CertificatesGallery';
import { sTierProjects, aTierProjects, certifications } from '../data';

const iconMap = {
  Python: <FaPython className="text-[#3776AB]" />,
  SQL: <FaDatabase className="text-[#336791]" />,
  TypeScript: <SiTypescript className="text-[#3178C6]" />,
  JavaScript: <SiJavascript className="text-[#F7DF1E]" />,
  PyTorch: <SiPytorch className="text-[#EE4C2C]" />,
  FastAPI: <SiFastapi className="text-[#009688]" />,
  React: <FaReact className="text-[#61DAFB]" />,
  NextJs: <SiNextdotjs className="text-slate-900 dark:text-white" />,
  PostgreSQL: <SiPostgresql className="text-[#336791]" />,
  Redis: <SiRedis className="text-[#DC382D]" />,
  Docker: <FaDocker className="text-[#2496ED]" />,
  Git: <FaGitAlt className="text-[#F05032]" />,
  HuggingFace: <SiHuggingface className="text-[#FFD21E]" />,
};

const LineShadowText = ({ children, shadowColor = '#4079ff', ...props }) => (
  <motion.span style={{ '--shadow-color': shadowColor }} className="line-shadow-effect relative z-0" data-text={children} {...props}>
    {children}
  </motion.span>
);

// RAG / system pipeline strip — steps come straight from the project data
// (no invented metrics, just the documented architecture).
const FlowStrip = ({ flow, compact = false }) => {
  if (!Array.isArray(flow) || flow.length === 0) return null;
  return (
    <div className="w-full">
      <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200/60">
        System flow
      </p>
      <ol className="flex items-stretch gap-1.5 overflow-x-auto pb-1">
        {flow.map((step, i) => (
          <li key={step} className="flex min-w-0 flex-shrink-0 items-stretch">
            <span
              className={`flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.07] backdrop-blur-sm ${
                compact ? 'px-2.5 py-1.5 text-[10px]' : 'px-3 py-2 text-[11px]'
              } font-mono font-medium text-slate-200`}
            >
              <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/25 text-[9px] font-bold text-cyan-200">
                {i + 1}
              </span>
              {step}
            </span>
            {i < flow.length - 1 && (
              <span aria-hidden="true" className="mx-1 self-center font-mono text-cyan-400/70">
                →
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

// ============ PROJECT DETAIL MODAL ============
const ProjectDetailModal = ({ project, onClose }) => {
  if (!project) return null;
  // Portalled to document.body so no ancestor transform/filter/backdrop can
  // hijack the fixed overlay's viewport positioning.
  const overlay = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative my-auto flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute right-4 top-4 z-20">
          <button
            onClick={onClose}
            aria-label="Close details"
            className="group rounded-full bg-slate-200/80 p-3 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/20 dark:border-white/10 dark:bg-black/40"
          >
            <FaTimes className="text-slate-600 group-hover:text-red-500 dark:text-white/70" />
          </button>
        </div>

        <div className="flex flex-col overflow-y-auto">
          <div
            className="px-8 py-10 text-white"
            style={{
              background:
                project.tier === 'S'
                  ? 'linear-gradient(120deg, #00b3a4 0%, #0891b2 55%, #4079ff 100%)'
                  : 'linear-gradient(120deg, #334155 0%, #475569 60%, #64748b 100%)',
            }}
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm text-white/80">{project.category}</span>
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                  project.tier === 'S'
                    ? 'border border-yellow-300/50 bg-yellow-400/20 text-yellow-100'
                    : 'border border-white/25 bg-white/10 text-white/90'
                }`}
              >
                {project.tier}-TIER {project.year}
              </span>
              {project.flagship && (
                <span className="rounded-full border border-white/30 bg-white/10 px-3 py-0.5 text-xs font-bold text-cyan-100">
                  ⭐ FLAGSHIP 2026
                </span>
              )}
            </div>
            <h2 className="font-display text-3xl font-bold leading-tight">{project.name}</h2>
            <p className="mt-1 text-sm text-white/85">{project.tagline}</p>
          </div>

          <div className="flex flex-col gap-6 p-8 md:p-10">
            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">{project.description}</p>

            {project.points && (
              <ul className="list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300">
                {project.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            )}

            {project.flow && (
              <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/[0.03] p-4 dark:bg-cyan-500/[0.04]">
                <FlowStrip flow={project.flow} compact />
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-cyan-300 bg-cyan-100 px-3 py-1.5 font-mono text-xs text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-300"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-2 flex flex-col gap-4 border-t border-slate-200 pt-8 dark:border-white/10 sm:flex-row">
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/30"
                >
                  <FaRocket />
                  <span>Live Demo</span>
                </a>
              )}
              {project.github ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-700 px-6 py-4 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                  <FaGithub className="text-xl" />
                  <span>View on GitHub</span>
                </a>
              ) : project.source ? (
                <a
                  href={project.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-400/40 bg-slate-500/10 px-6 py-4 font-bold text-slate-200 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-500/20"
                >
                  <FaGithub className="text-xl" />
                  <span>View Source Project</span>
                </a>
              ) : (
                <span className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-6 py-4 font-mono text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  College project · repo not yet made public
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(overlay, document.body);
};

// ============ PROJECT CARD ============
const ProjectCard = ({ project, index, onClick }) => {
  const isS = project.tier === 'S';
  const cardRef = useRef(null);

  // Track the pointer for a radial "spotlight" that follows the cursor.
  const handleMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - r.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - r.top}px`);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.1, ease: 'easeOut' }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
      onClick={() => onClick(project)}
      style={{
        '--spot-x': '50%',
        '--spot-y': '0%',
        background: isS
          ? 'radial-gradient(circle at 15% 15%, rgba(0,255,220,0.16), transparent 45%), radial-gradient(circle at 85% 85%, rgba(64,121,255,0.22), transparent 50%), #0f172a'
          : 'radial-gradient(circle at 20% 20%, rgba(64,121,255,0.10), transparent 50%), radial-gradient(circle at 80% 90%, rgba(148,163,184,0.14), transparent 55%), #0f172a',
      }}
    >
      {/* Cursor spotlight overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at var(--spot-x) var(--spot-y), ${isS ? 'rgba(0,255,220,0.14)' : 'rgba(64,121,255,0.12)'}, transparent 65%)`,
        }}
      />

      {/* Corner tier badge */}
      <div className="pointer-events-none absolute -right-6 -top-6 z-[1]">
        <div
          className="flex h-24 w-24 rotate-45 items-end justify-center pb-3 font-display text-2xl font-bold text-black"
          style={{
            background: isS ? 'linear-gradient(135deg, #00ffdc, #40ffaa)' : 'linear-gradient(135deg, #94a3b8, #cbd5e1)',
          }}
        >
          <span className="-rotate-45">{project.tier}</span>
        </div>
      </div>

      <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/10" />

      <div className="relative z-[2] flex h-auto min-h-[300px] flex-1 flex-col justify-between gap-4 p-6">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                isS
                  ? 'bg-cyan-500/20 text-cyan-200'
                  : 'bg-slate-500/20 text-slate-200'
              }`}
            >
              {project.tier}-TIER {project.year}
            </span>
            {project.flagship && (
              <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-yellow-200 backdrop-blur-sm">
                ⭐ Flagship
              </span>
            )}
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-slate-300 backdrop-blur-sm">
              {project.category}
            </span>
          </div>
          <h3
            className={`font-display text-2xl font-bold transition-colors group-hover:text-cyan-300 ${
              isS ? 'text-white' : 'text-slate-100'
            }`}
          >
            {project.shortName}
          </h3>
          <p className="mt-1 text-sm font-medium text-cyan-200/80">{project.tagline}</p>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-300">{project.description}</p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {project.tech.slice(0, 4).map((t) => (
              <span key={t} className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-100 backdrop-blur-sm">
                {t}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">
                +{project.tech.length - 4}
              </span>
            )}
          </div>

          {/* Action buttons — real links for S-tier */}
          <div className="flex flex-wrap gap-2.5">
            {isS ? (
              <>
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/30 sm:text-sm"
                  >
                    <FaRocket /> Live Demo
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 sm:text-sm"
                  >
                    <FaGithub /> GitHub
                  </a>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick(project);
                  }}
                  aria-label={`Details for ${project.name}`}
                  className="flex items-center justify-center rounded-lg border border-cyan-400/40 px-3 py-2.5 text-xs font-semibold text-cyan-200 transition-all duration-300 hover:bg-cyan-500/20"
                >
                  <FaExternalLinkAlt />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick(project);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-500/40 bg-slate-500/10 px-4 py-2.5 text-xs font-semibold text-slate-200 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-500/25 sm:text-sm"
                >
                  <FaExternalLinkAlt /> Read Case Study
                </button>
                <span className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-cyan-200">
                  College Build · 2025
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className={`pointer-events-none absolute inset-0 rounded-2xl border transition-colors duration-300 ${
          isS ? 'border-white/10 group-hover:border-cyan-400/50' : 'border-white/10 group-hover:border-slate-400/50'
        }`}
      />
    </motion.div>
  );
};

// ============ TECH STACK TAB ============
const techStack = [
  { category: 'Programming', items: ['Python', 'TypeScript', 'JavaScript', 'SQL'] },
  { category: 'Deep Learning', items: ['PyTorch'] },
  { category: 'LLM & AI', items: ['FastAPI', 'HuggingFace', 'React'] },
  { category: 'Backend & Databases', items: ['PostgreSQL', 'Redis', 'Docker'] },
  { category: 'Frontend', items: ['React', 'NextJs', 'TailwindCSS'] },
  { category: 'Tools', items: ['Git', 'Docker'] },
];

// ============ MAIN SECTION ============
const ProjectSection = () => {
  const [activeTab, setActiveTab] = useState('Projects');
  const [previewProject, setPreviewProject] = useState(null);
  const { hideNavbar, showNavbar } = useNavbar();
  const flagship = sTierProjects.find((p) => p.flagship);

  useEffect(() => {
    if (previewProject) hideNavbar();
    else showNavbar();
  }, [previewProject, hideNavbar, showNavbar]);

  useEffect(() => {
    return () => showNavbar();
  }, [showNavbar]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setPreviewProject(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const tabs = [
    { id: 'Projects', label: 'Projects', icon: <PiCodeBold className="mb-1 text-[1.7em]" /> },
    { id: 'Certifications', label: 'Certifications', icon: <LuBadge className="mb-1 text-[1.5em]" /> },
    { id: 'Tech Stack', label: 'Tech Stack', icon: <LiaLayerGroupSolid className="mb-1 text-[1.5em]" /> },
  ];

  return (
    /* Nested inside Home's <section id="projects"> — keep a single id on the page. */
    <section className="py-20">
      <style>{`
        @keyframes line-shadow-anim { 0% { background-position: 0 0; } 100% { background-position: 100% 100%; } }
        .line-shadow-effect::after { content: attr(data-text); position: absolute; z-index: -1; left: 0.04em; top: 0.04em; background-image: linear-gradient(45deg, transparent 45%, var(--shadow-color) 45%, var(--shadow-color) 55%, transparent 0); background-size: 0.06em 0.06em; -webkit-background-clip: text; background-clip: text; color: transparent; animation: line-shadow-anim 30s linear infinite; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="mb-16 text-center"
      >
        <h2 className="font-display text-4xl font-bold">
          <span className="text-cyan-600 dark:text-[#00ffdc]">
            <LineShadowText shadowColor="#00b3a4">PORTFOLIO</LineShadowText>
          </span>{' '}
          <span className="text-slate-800 dark:text-white">
            <LineShadowText shadowColor="#bbbbbb">SHOWCASE</LineShadowText>
          </span>
        </h2>
        <p className="mt-3 font-mono text-sm text-slate-500 dark:text-slate-400">
          {flagship.name} — Flagship · Three S-Tier platforms · Four A-Tier research builds
        </p>
      </motion.div>

      <div className="w-full">
        {/* Tabs */}
        <div className="mb-12 flex justify-center">
          <motion.div
            layout
            role="tablist"
            aria-label="Portfolio sections"
            className="inline-flex w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-2 shadow-lg backdrop-blur-md dark:border-slate-800 dark:bg-gradient-to-r dark:from-[#101624] dark:via-[#0a1627] dark:to-[#0a223a]"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-1 flex-col items-center justify-center rounded-2xl px-2 py-7 text-base font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#101624] ${
                  activeTab === tab.id ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300'
                }`}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.03 }}
                style={{ zIndex: 1, minWidth: 0 }}
              >
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute inset-0 rounded-2xl border border-slate-200 bg-slate-100 dark:border-transparent dark:bg-gradient-to-br dark:from-[#0a223a] dark:to-[#101624]"
                    transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    style={{ zIndex: -1, opacity: 0.96 }}
                  />
                )}
                <span className="relative z-10 flex flex-col items-center gap-2">
                  {tab.icon}
                  <span className="font-bold">{tab.label}</span>
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Content */}
        <div
          className="mx-auto max-w-7xl rounded-3xl border border-slate-100 bg-white shadow-xl dark:border-slate-800/60 dark:bg-slate-900/50 md:p-6"
          style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              role="tabpanel"
              id={`panel-${activeTab}`}
              aria-label={`${activeTab} content`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 md:p-10"
            >
              {activeTab === 'Projects' && (
                <div className="space-y-14">
                  {/* ===== FLAGSHIP SPOTLIGHT (appears in the S-tier area, the tier row & the modal) ===== */}
                  <TiltCard maxTilt={4} scale={1.004} glare={false} className="rounded-3xl">
                    <div
                      onClick={() => setPreviewProject(flagship)}
                      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-cyan-500/30 transition-all duration-300 hover:border-cyan-400/60"
                      style={{
                        background:
                          'radial-gradient(1100px 460px at 12% 0%, rgba(0,255,220,0.16), transparent 60%), radial-gradient(900px 420px at 100% 100%, rgba(64,121,255,0.20), transparent 55%), #0a1226',
                      }}
                    >
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-[0.05]"
                        style={{
                          backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
                          backgroundSize: '46px 46px',
                        }}
                      />
                      <div className="relative grid grid-cols-1 items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1.05fr_0.95fr]">
                        {/* Copy */}
                        <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
                          <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                            <span className="rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-black shadow-lg shadow-yellow-500/20">
                              ⭐ Flagship · 2026
                            </span>
                            <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-cyan-200">
                              {flagship.category}
                            </span>
                          </div>
                          <h3 className="font-display text-4xl font-bold text-white sm:text-5xl">{flagship.name}</h3>
                          <p className="font-display text-base font-semibold text-cyan-200/90 sm:text-lg">{flagship.tagline}</p>
                          <p className="max-w-xl text-sm leading-relaxed text-slate-300">{flagship.description}</p>
                          <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                            {flagship.tech.slice(0, 4).map((t) => (
                              <span key={t} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-slate-200 backdrop-blur-sm">
                                {t}
                              </span>
                            ))}
                          </div>
                          <div className="w-full max-w-xl">
                            <FlowStrip flow={flagship.flow} compact />
                          </div>
                          <div className="mt-1 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                            <a
                              href={flagship.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/40"
                            >
                              <FaRocket /> Live Demo
                            </a>
                            <a
                              href={flagship.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
                            >
                              <FaGithub /> GitHub
                            </a>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewProject(flagship);
                              }}
                              className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 px-5 py-3 text-sm font-semibold text-cyan-200 transition-all duration-300 hover:bg-cyan-500/15"
                            >
                              Case Study
                            </button>
                          </div>
                        </div>

                        {/* Layered 3D platform visual (desktop) */}
                        <div className="relative hidden min-h-[330px] items-center justify-center [perspective:1200px] lg:flex">
                          <div aria-hidden="true" className="absolute h-56 w-56 rounded-full bg-cyan-500/25 blur-3xl" />
                          <div aria-hidden="true" className="animate-rotate-slower absolute h-72 w-72 rounded-full border border-dashed border-cyan-400/20" />
                          <div aria-hidden="true" className="animate-rotate-slow absolute h-56 w-56 rounded-full border border-cyan-400/15" style={{ animationDirection: 'reverse' }} />

                          {/* Front window */}
                          <div className="relative w-[86%] max-w-[400px]" style={{ transformStyle: 'preserve-3d' }}>
                            <div
                              className="animate-float-slow rounded-2xl border border-white/15 bg-[#0e1830]/80 p-5 shadow-2xl backdrop-blur-md"
                              style={{ transform: 'rotateY(-9deg) rotateX(4deg) translateZ(24px)' }}
                            >
                              <div className="mb-4 flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
                                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/90" />
                                <span className="h-2.5 w-2.5 rounded-full bg-green-400/90" />
                                <span className="ml-2 truncate font-mono text-[10px] text-slate-400">
                                  aurelia-ai — multi-tenant knowledge base
                                </span>
                              </div>
                              <div className="space-y-2">
                                <div className="h-2.5 w-3/4 rounded-full bg-white/15" />
                                <div className="h-2.5 w-full rounded-full bg-white/10" />
                                <div className="h-2.5 w-5/6 rounded-full bg-white/10" />
                              </div>
                              <div className="mt-4 flex items-center justify-between rounded-lg border border-cyan-400/20 bg-cyan-500/10 px-3 py-2">
                                <span className="font-mono text-[10px] text-cyan-200">SSE stream · chat</span>
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                              </div>
                            </div>

                            {/* Back screen */}
                            <div
                              className="animate-float-slower absolute inset-x-8 -top-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                              style={{ transform: 'rotateY(10deg) rotateX(-5deg) translateZ(-30px)' }}
                            >
                              <div className="mb-3 h-2 w-1/2 rounded-full bg-cyan-300/25" />
                              <div className="flex gap-2">
                                {['Qdrant', 'RAG', 'Vector'].map((c) => (
                                  <span key={c} className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-2.5 py-1 text-[9px] font-semibold text-cyan-200">
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Floating chips */}
                            {[
                              { label: 'RAG', cls: 'left-0 top-2 animate-float-slow', delay: '0s' },
                              { label: 'SSE', cls: 'right-2 top-8 animate-float-slower', delay: '0.8s' },
                              { label: 'RBAC', cls: 'bottom-6 left-6 animate-float-slower', delay: '1.4s' },
                            ].map((c) => (
                              <span
                                key={c.label}
                                className={`${c.cls} absolute rounded-full border border-white/20 bg-white/10 px-2.5 py-1 font-mono text-[9px] font-bold text-cyan-100 shadow-lg backdrop-blur-md`}
                                style={{ animationDelay: c.delay }}
                              >
                                {c.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TiltCard>

                  {/* S-TIER — top 3 production platforms */}
                  <div>
                    <div className="mb-8 text-center">
                      <h3 className="font-display text-2xl font-bold text-slate-800 dark:text-white">
                        <span className="text-cyan-600 dark:text-[#00ffdc]">S-TIER</span> — PRODUCTION PLATFORMS
                      </h3>
                      <p className="mt-2 font-mono text-xs text-slate-500 dark:text-slate-400">
                        Deployed, full-stack Agentic AI products · Live demo + source code
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                      {sTierProjects.map((p, i) => (
                        <ProjectCard key={p.name} project={p} index={i} onClick={setPreviewProject} />
                      ))}
                    </div>
                  </div>

                  {/* A-TIER — best research projects of 2025 */}
                  <div>
                    <div className="mb-8 text-center">
                      <h3 className="font-display text-2xl font-bold text-slate-800 dark:text-white">
                         <span className="text-slate-500 dark:text-slate-300">A-TIER</span> — COLLEGE AI &amp; DATA SCIENCE PROJECTS · 2025
                      </h3>
                      <p className="mt-2 font-mono text-xs text-slate-500 dark:text-slate-400">
                        Original builds from my AI & Data Science coursework — deep learning, digital forensics, healthcare ML & NLP
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                      {aTierProjects.map((p, i) => (
                        <ProjectCard key={p.name} project={p} index={i} onClick={setPreviewProject} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Certifications' && (
                <div className="space-y-8">
                  <div className="mx-auto max-w-2xl text-center">
                    <h3 className="font-display text-xl font-bold text-slate-800 dark:text-white">
                      Credentials &amp; Certificates
                    </h3>
                    <p className="mt-2 font-mono text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {certifications.length} real programs across four tracks —{' '}
                      <span className="text-yellow-600 dark:text-yellow-300">Earned</span> (document in hand),{' '}
                      <span className="text-cyan-600 dark:text-cyan-300">Completed</span> (resume-verified course), and{' '}
                      <span className="text-sky-600 dark:text-sky-300">Available to earn</span> (free official programs,
                      shown as clearly labelled previews until earned).
                    </p>
                  </div>
                  <CertificatesGallery certs={certifications} />
                </div>
              )}

              {activeTab === 'Tech Stack' && (
                <div className="mx-auto max-w-4xl space-y-8">
                  {techStack.map((group) => (
                    <div key={group.category}>
                      <h3 className="mb-4 border-b-2 border-slate-200 pb-2 text-xl font-bold capitalize text-cyan-600 dark:border-slate-800 dark:text-cyan-300">
                        {group.category}
                      </h3>
                      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {group.items.map((tech, i) => (
                          <div
                            key={i}
                            className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-md transition-all duration-300 hover:border-cyan-500/30 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none dark:hover:bg-slate-800/50"
                          >
                            <div className="text-4xl">{iconMap[tech] || <FaDatabase className="text-cyan-500" />}</div>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              {tech === 'NextJs' ? 'Next.js' : tech === 'TailwindCSS' ? 'Tailwind CSS' : tech === 'HuggingFace' ? 'Hugging Face' : tech}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {previewProject && <ProjectDetailModal project={previewProject} onClose={() => setPreviewProject(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default ProjectSection;
