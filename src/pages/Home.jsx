import React, { lazy, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload, FaBriefcase, FaDatabase, FaGraduationCap, FaGlobe, FaArrowRight, FaChevronDown, FaMapMarkerAlt } from 'react-icons/fa';
import { ButtonMovingBorder } from '../components/MovingBorderButton';
import { VelocityScroll } from '../components/VelocityScroll';
import GradientTypewriter from '../components/GradientTypewriter';
import TextGenerateEffect from '../components/TextGenerateEffect';
import { AnimatedGradientBadge } from '../components/AnimatedGradientBadge';
import SceneGate, { useSceneEnabled } from '../components/three/SceneGate';
import ProjectSection from '../components/ProjectSection';
import Contact from '../components/Contact';
import { useTheme } from '../contexts/ThemeContext';
import Magnetic from '../components/Magnetic';
import TiltCard from '../components/TiltCard';
import { profile, stats, education, languages, skills } from '../data';

// 3D scenes are lazy so the WebGL bundle only loads when a desktop machine
// actually renders them (anti-lag).
const HeroOrbit = lazy(() => import('../components/three/HeroOrbit'));
const AboutCore = lazy(() => import('../components/three/AboutCore'));
const SkillsCore = lazy(() => import('../components/three/SkillsCore'));

const Home = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const aboutSceneOn = useSceneEnabled();
  // Skill tracer — select a skill to highlight every group that uses it.
  const [tracedSkill, setTracedSkill] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 mx-auto max-w-7xl px-8"
    >
      {/* ================= HERO ================= */}
      <section id="home" className="relative flex flex-col items-center gap-10 pt-20 pb-16 md:flex-row lg:pt-10 lg:pb-20">
        <div className="order-last flex flex-1 flex-col items-center space-y-6 pt-16 text-center md:order-none md:items-start md:pt-40 md:text-left">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}>
            <AnimatedGradientBadge>✨ AI/ML Engineer</AnimatedGradientBadge>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: 'easeOut' }}
            className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-cyan-200/60"
          >
            Hello, I&apos;m
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
            className="font-display text-5xl font-bold leading-tight select-none md:text-6xl"
            style={{
              color: isDark ? '#00ffdc' : '#0f172a',
              textShadow: isDark ? '0 2px 0 rgba(0, 255, 220, 0.45), 0 0 24px rgba(56, 189, 248, 0.35), 0 0 64px rgba(37, 99, 235, 0.28)' : 'none',
            }}
          >
            VARUN B P
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
            className="font-display text-lg font-semibold text-slate-600 dark:text-slate-200 md:text-xl"
          >
            I build production-ready Agentic AI systems
          </motion.p>

          <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}>
            <GradientTypewriter className="font-mono font-bold" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55, ease: 'easeOut' }} className="font-mono text-sm md:text-base">
            <TextGenerateEffect words={profile.summary} />
          </motion.div>

          {/* Primary / secondary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: 'easeOut' }}
            className="flex flex-col items-center gap-3 pt-2 sm:flex-row md:justify-start"
          >
            <Magnetic strength={0.22}>
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <FaBriefcase /> View Projects <FaArrowRight className="text-xs" />
              </a>
            </Magnetic>
            <Magnetic strength={0.22}>
              <a
                href={profile.resume}
                download="Varun BP Engg Resume.pdf"
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-7 py-3.5 text-sm font-bold text-cyan-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:text-cyan-200"
              >
                <FaDownload /> Download Resume
              </a>
            </Magnetic>
          </motion.div>

          {/* Fact chips — degree, base, output (all traceable to data.js) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="flex flex-wrap items-center justify-center gap-2 pt-1 md:justify-start"
          >
            {['B.E. AI & Data Science · VTU', 'Karnataka, India', '3 production AI platforms'].map((fact) => (
              <span
                key={fact}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-1 font-mono text-[11px] text-slate-500 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
              >
                {fact}
              </span>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8, ease: 'easeOut' }} className="mt-8 flex flex-row gap-4">
            <Magnetic strength={0.5}>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all duration-300 hover:border-cyan-400 hover:bg-slate-50 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/[0.8] dark:text-white dark:hover:bg-slate-800 dark:hover:shadow-[0_0_24px_2px_#00ffdc]"
              >
                <FaGithub className="h-6 w-6 text-slate-600 transition-all duration-300 group-hover:text-cyan-600 dark:text-slate-400 dark:group-hover:text-cyan-300" />
              </a>
            </Magnetic>
            <Magnetic strength={0.5}>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all duration-300 hover:border-cyan-400 hover:bg-slate-50 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/[0.8] dark:text-white dark:hover:bg-slate-800 dark:hover:shadow-[0_0_24px_2px_#00ffdc]"
              >
                <FaLinkedin className="h-6 w-6 text-slate-600 transition-all duration-300 group-hover:text-cyan-600 dark:text-slate-400 dark:group-hover:text-cyan-300" />
              </a>
            </Magnetic>
            <Magnetic strength={0.5}>
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email Me"
                className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all duration-300 hover:border-cyan-400 hover:bg-slate-50 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/[0.8] dark:text-white dark:hover:bg-slate-800 dark:hover:shadow-[0_0_24px_2px_#00ffdc]"
              >
                <FaEnvelope className="h-6 w-6 text-slate-600 transition-all duration-300 group-hover:text-cyan-600 dark:text-slate-400 dark:group-hover:text-cyan-300" />
              </a>
            </Magnetic>
          </motion.div>
        </div>

        {/* Photo with 3D orbit behind it (photo stays fully visible on top) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          className="relative order-first flex justify-center md:order-none md:flex-1"
        >
          <div className="relative flex h-[400px] w-[400px] items-center justify-center sm:h-[460px] sm:w-[460px]">
            {/* 3D orbit (desktop only, lazy, pauses offscreen) */}
            <SceneGate className="absolute inset-0">
              <HeroOrbit />
            </SceneGate>

            {/* Glow behind photo */}
            <div className="absolute h-64 w-64 rounded-full bg-cyan-500/20 blur-2xl dark:bg-[#00ffdc]/20 sm:h-80 sm:w-80" />

            {/* Photo circle — always on top, never cropped; pointer-reactive tilt */}
            <TiltCard maxTilt={7} scale={1.015} glare={false} className="relative z-10">
              <div
                className={`aspect-square w-64 overflow-hidden rounded-full border-4 sm:w-80 md:w-[340px] ${
                  isDark ? 'border-[#00ffdc]/40' : 'border-cyan-500/40'
                }`}
                style={{
                  boxShadow: isDark ? '0 0 40px 4px rgba(0,255,220,0.35)' : '0 0 32px 4px rgba(6,182,212,0.25)',
                }}
              >
                <img
                  src={profile.photo}
                  alt="Varun B P — AI/ML Engineer"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
            </TiltCard>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.a
          href="#about"
          aria-label="Scroll to About section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400 transition-colors hover:text-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:text-slate-500 md:flex"
        >
          Scroll
          <FaChevronDown className="motion-safe:animate-bounce text-cyan-500" aria-hidden="true" />
        </motion.a>
      </section>

      {/* ================= ABOUT ================= */}
      <section
        id="about"
        className="py-12 md:py-18"
        style={{ width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          <div className="relative mb-20 flex w-full flex-col items-center justify-center overflow-hidden">
            <VelocityScroll defaultVelocity={3} numRows={1} className="max-w-full opacity-60">
              <span
                className="font-display font-bold"
                style={{
                  fontSize: '2.5rem',
                  lineHeight: 1.1,
                  color: isDark ? '#00ffdc' : '#0891b2',
                }}
              >
                ABOUT <span style={{ color: isDark ? '#fff' : '#0891b2' }}>ME</span>
              </span>
            </VelocityScroll>
            <div className={`pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r ${isDark ? 'from-[#030817]' : 'from-slate-50'}`} />
            <div className={`pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l ${isDark ? 'from-[#030817]' : 'from-slate-50'}`} />
          </div>
          <p className="mb-20 mt-2 px-1 font-mono text-lg text-slate-600 dark:text-cyan-200/70">
            ✧ Building intelligent, production-ready AI systems ✧
          </p>
        </motion.div>

        <div className="flex flex-col items-center justify-center px-4 md:flex-row md:px-8">
          {/* 3D AI core — only reserves layout space on capable desktops, so mobile/tablet/reduced-motion get a clean full-width profile instead of dead space */}
          {aboutSceneOn && (
            <div className="mb-10 h-[360px] w-full max-w-[380px] md:mb-0 md:w-1/3">
              <SceneGate className="h-full w-full">
                <AboutCore />
              </SceneGate>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className={`text-center md:text-left ${aboutSceneOn ? 'md:w-2/3' : 'md:w-full'}`}
          >
            <p className="font-display text-2xl text-slate-500 dark:text-gray-300 md:my-0">Hello, I'm</p>
            <h3 className="font-display my-2 text-4xl font-bold text-slate-900 dark:text-white">{profile.name}</h3>
            <p className="mt-4 text-justify font-mono leading-relaxed text-slate-600 dark:text-white/80">{profile.quote}</p>
            <p className="mt-4 text-justify font-mono leading-relaxed text-slate-600 dark:text-white/70">{profile.summary}</p>

            <div className="mt-6 rounded-r-lg border-l-4 border-cyan-600 bg-slate-50 p-4 font-mono italic text-slate-700 shadow-md dark:border-[#00ffdc] dark:bg-slate-900/50 dark:text-white/70 dark:shadow-none">
              "Intelligence is the ability to adapt to change."
            </div>

            <div className="mt-8 flex flex-row flex-wrap items-center justify-center gap-4 md:justify-start">
              <Magnetic strength={0.22}>
                <ButtonMovingBorder
                  as="a"
                  href={profile.resume}
                  download="Varun BP Engg Resume.pdf"
                  duration={3000}
                  borderRadius="0.75rem"
                  className="flex h-16 w-40 items-center justify-center border border-slate-200 bg-white font-semibold text-slate-800 shadow-md transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/[0.8] dark:text-white dark:shadow-none dark:hover:shadow-[0_0_24px_8px_#40ffaa]"
                >
                  <FaDownload /> Download Resume
                </ButtonMovingBorder>
              </Magnetic>
              <Magnetic strength={0.22}>
                <ButtonMovingBorder
                  as="a"
                  href="#projects"
                  duration={3000}
                  borderRadius="0.75rem"
                  className="flex h-16 w-40 items-center justify-center border border-slate-200 bg-white font-semibold text-slate-800 shadow-md transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/[0.8] dark:text-white dark:shadow-none dark:hover:shadow-[0_0_24px_8px_#40ffaa]"
                >
                  <FaBriefcase /> View Projects
                </ButtonMovingBorder>
              </Magnetic>
            </div>

            {/* Now / Focus / Base — factual snapshot, no filler */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { k: 'Now', v: 'Final-year B.E. AI & Data Science, VTU — class of 2026' },
                { k: 'Focus', v: 'Agentic RAG · LLM integrations · Explainable AI' },
                { k: 'Base', v: 'Nelamangala, Karnataka, India' },
              ].map((c) => (
                <div
                  key={c.k}
                  className="rounded-xl border border-slate-200 bg-white/70 p-3.5 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/50 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-cyan-300/40"
                >
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">{c.k}</p>
                  <p className="mt-1 text-[13px] font-medium leading-snug text-slate-600 dark:text-slate-200">{c.v}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
          className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-8 px-4 md:grid-cols-3 md:px-0"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:border-cyan-400/50 hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-900/90 dark:shadow-none dark:hover:shadow-[0_0_24px_0px_#00ffdc50]"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <div className="mb-4 w-max rounded-full border border-slate-100 bg-slate-50 p-3 transition-all duration-300 group-hover:border-cyan-200 group-hover:bg-cyan-50 dark:border-slate-700/60 dark:bg-slate-800/80 dark:group-hover:bg-cyan-900/50">
                    <div className="text-2xl text-slate-500 transition-colors duration-300 group-hover:text-cyan-600 dark:text-slate-400 dark:group-hover:text-cyan-300">
                      {index === 0 ? <FaDatabase /> : index === 1 ? <FaGraduationCap /> : <FaGlobe />}
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 transition-colors duration-300 group-hover:text-cyan-700 dark:text-slate-400 dark:group-hover:text-slate-300">
                    {stat.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{stat.description}</p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="font-display text-5xl font-bold text-slate-900 transition-all duration-300 group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-300">
                    {stat.value}
                  </p>
                  <FaArrowRight className="mt-auto -rotate-45 text-slate-400 transition-all duration-300 group-hover:text-cyan-500" />
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ================= PROJECTS / SKILLS / CERTIFICATIONS ================= */}
      <section id="projects" className="py-12 md:py-18">
        <ProjectSection />
      </section>

      {/* ================= SKILLS ================= */}
      <section id="skills" className="py-12 pb-20 md:py-18">
        <div className="relative mx-auto mb-10 flex h-40 max-w-4xl items-center justify-center md:h-52">
          {/* 3D knowledge-graph constellation behind the heading (desktop only) */}
          <SceneGate className="absolute inset-0">
            <SkillsCore />
          </SceneGate>
          <div className="relative z-10 text-center">
            <h2 className="font-display text-4xl font-bold">
              <span className="text-cyan-600 dark:text-[#00ffdc]">TECHNICAL</span>{' '}
              <span className="text-slate-800 dark:text-white">SKILLS</span>
            </h2>
            <p className="mt-3 font-mono text-xs text-slate-500 dark:text-slate-400">
              ✦ The tools I ship production AI systems with ✦
            </p>
            <p className="mt-2 font-mono text-[11px] text-slate-400 dark:text-slate-500" aria-live="polite">
              {tracedSkill ? (
                <>Tracing <span className="font-bold text-cyan-600 dark:text-cyan-300">{tracedSkill}</span> — select it again to clear</>
              ) : (
                'Select any skill to trace it across groups'
              )}
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, idx) => {
            const containsTraced = tracedSkill && group.items.includes(tracedSkill);
            return (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className={`rounded-2xl border bg-white p-6 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-xl dark:bg-slate-900/70 dark:shadow-none dark:hover:shadow-[0_0_24px_0px_#00ffdc30] ${
                containsTraced
                  ? 'border-cyan-400/70 shadow-[0_0_24px_-6px_rgba(6,182,212,0.55)] dark:border-cyan-300/50 dark:shadow-[0_0_24px_0px_#00ffdc40]'
                  : 'border-slate-200 dark:border-slate-700/50'
              } ${tracedSkill && !containsTraced ? 'opacity-60' : ''}`}
            >
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-cyan-600 dark:text-cyan-300">{group.category}</h3>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {group.items.length} skills
              </p>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => {
                  const active = tracedSkill === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTracedSkill(active ? null : item)}
                      aria-pressed={active}
                      title={active ? `${item} — selected, select again to clear` : `Trace ${item} across groups`}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                        active
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_14px_-2px_rgba(6,182,212,0.8)]'
                          : 'bg-slate-100 text-slate-700 hover:border hover:border-cyan-400/50 hover:shadow-[0_0_14px_-4px_rgba(6,182,212,0.6)] dark:bg-slate-800 dark:text-slate-300 dark:hover:border-cyan-400/40 dark:hover:bg-slate-700/80 dark:hover:shadow-[0_0_14px_-4px_rgba(0,255,220,0.45)]'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================= EDUCATION / CERTIFICATIONS ================= */}
      <section id="education" className="py-12 pb-20 md:py-18">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="font-display text-4xl font-bold">
              <span className="text-cyan-600 dark:text-[#00ffdc]">EDUCATION</span>{' '}
              <span className="text-slate-800 dark:text-white">& LANGUAGES</span>
            </h2>
            <a
              href="#projects"
              className="mt-3 inline-flex items-center gap-2 font-mono text-xs text-slate-500 underline decoration-cyan-500/40 underline-offset-4 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300"
            >
              🎓 Certificates & credentials live under PORTFOLIO → Certifications
            </a>
          </div>

          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.school} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white">{edu.school}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{edu.detail}</p>
                </div>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-500">{edu.years}</span>
              </div>
            ))}
          </div>


          <h3 className="mt-10 mb-4 text-xl font-bold text-slate-800 dark:text-white">Languages</h3>
          <div className="flex flex-wrap gap-3">
            {languages.map((lang) => (
              <span
                key={lang.name}
                className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border hover:border-cyan-400/50 hover:shadow-[0_0_12px_-4px_rgba(6,182,212,0.6)] dark:bg-slate-800 dark:text-slate-300 dark:hover:border-cyan-400/40"
              >
                {lang.name} · {lang.level}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="py-20 pb-16">
        <Contact />
      </section>

      <footer className="bg-gradient-to-t from-slate-100/50 to-transparent py-12 pb-16 text-center text-slate-400 dark:bg-gradient-to-t dark:from-slate-900/50 dark:to-transparent">
        <div className="text-sm">© {new Date().getFullYear()} {profile.name}. All rights reserved.</div>
        <div className="mt-2 text-xs">
          Built with <span className="text-red-500">♥</span> using React, Tailwind CSS, Framer Motion & Three.js.
        </div>
      </footer>
    </motion.div>
  );
};

export default Home;