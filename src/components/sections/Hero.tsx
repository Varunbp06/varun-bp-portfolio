import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { heroFacts, profile } from '../../data/profile';
import { EASE } from '../../lib/motion';
import { prefersReducedMotion } from '../../lib/utils';
import ContactButton from '../ui/ContactButton';
import Icon from '../ui/SocialIcon';
import Magnet from '../ui/Magnet';

const firstNameLine = "Hi, I'm";
const firstSentence = `${profile.summary.split('. ')[0]}.`;

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const timer = window.setInterval(
      () => setRoleIndex((index) => (index + 1) % profile.roles.length),
      2600,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-10 lg:pt-32"
    >
      {/* Ambient depth: vignette + faint grid + drifting glow */}
      <div className="pointer-events-none absolute inset-0 ink-vignette" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '96px 96px',
          maskImage: 'radial-gradient(80% 60% at 50% 40%, black, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(80% 60% at 50% 40%, black, transparent 75%)',
        }}
      />

      <div className="relative mx-auto grid w-full max-w-[1600px] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        {/* ---------------- Copy ---------------- */}
        <div className="order-2 flex flex-col items-start gap-5 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="flex flex-wrap items-center gap-3"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70 motion-reduce:hidden" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/60">
                Open to Work
              </span>
            </span>
            <span className="label-xs">{profile.location}</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="text-sm uppercase tracking-[0.4em] text-white/45"
          >
            {firstNameLine}
          </motion.p>

          {/* The name is ~4.32em wide and the two-column layout leaves it
              ~0.51 vw per unit, so at 11vw the two met within a pixel between
              1040px and 1160px and the trailing "P" dropped onto a line of its
              own. 10vw clears the column with margin, and nowrap makes a single
              line a guarantee rather than a coincidence. */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="text-gradient-hero whitespace-nowrap text-[clamp(3rem,10vw,9.5rem)] font-extrabold leading-[0.86] tracking-[-0.03em]"
          >
            {profile.name}
          </motion.h1>

          {/* Rotating role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
            className="flex h-[2.6em] items-center overflow-hidden"
          >
            <span className="mr-3 hidden h-px w-10 bg-white/25 sm:block" aria-hidden="true" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={profile.roles[roleIndex]}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="text-gradient-soft text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl"
              >
                {profile.roles[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
            className="max-w-xl text-sm leading-relaxed text-white/60 sm:text-base"
          >
            {firstSentence}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
            className="mt-2 flex flex-wrap items-center gap-3"
          >
            <ContactButton href="#contact">Let&apos;s talk</ContactButton>
            <ContactButton href={profile.resume} download={profile.resumeFileName}>
              <Icon name="download" /> Resume
            </ContactButton>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.2em] text-white/80 transition-colors duration-300 hover:border-white/60 hover:bg-white/10 hover:text-white"
            >
              View projects <Icon name="arrow-right" className="text-sm" />
            </a>
            <div className="flex items-center gap-2">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-lg text-white/70 transition-colors hover:border-white/40 hover:text-white"
              >
                <Icon name="github" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-lg text-white/70 transition-colors hover:border-white/40 hover:text-white"
              >
                <Icon name="linkedin" />
              </a>
            </div>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="flex flex-wrap gap-2 pt-1"
          >
            {heroFacts.map((fact) => (
              <li
                key={fact}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-white/45"
              >
                {fact}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* ---------------- Magnetic portrait ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
          className="order-1 flex justify-center lg:order-2 lg:justify-end"
        >
          <Magnet padding={150} strength={3} className="relative">
            <div className="relative aspect-[4/5] w-[240px] sm:w-[320px] lg:w-[380px] xl:w-[440px]">
              {/* Halo */}
              <div
                className="absolute -inset-8 rounded-full opacity-70"
                aria-hidden="true"
                style={{
                  background:
                    'radial-gradient(60% 60% at 50% 40%, rgba(187,204,215,0.22), transparent 70%)',
                }}
              />
              {/* Orbiting ring */}
              <div
                className="animate-orbit-slow absolute -inset-6 rounded-full border border-dashed border-white/12"
                aria-hidden="true"
              />
              {/* Portrait — fixed aspect ratio, no layout shift */}
              <div className="relative h-full w-full overflow-hidden rounded-[36px] border border-white/15 bg-[#111]">
                <img
                  src={profile.photo}
                  alt={`${profile.name} — ${profile.title}`}
                  width={880}
                  height={1100}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-cover object-top"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-transparent to-transparent"
                  aria-hidden="true"
                />
              </div>

              {/* Floating caption cards */}
              <div className="absolute -left-4 bottom-6 hidden rounded-2xl border border-white/12 bg-[#111]/95 px-4 py-3 sm:block">
                <p className="label-xs">Focus</p>
                <p className="mt-1 text-xs font-medium text-white/80">
                  Agentic RAG · LLM apps
                </p>
              </div>
              <div className="animate-soft-float absolute -right-3 top-8 hidden rounded-2xl border border-white/12 bg-[#111]/95 px-4 py-3 sm:block">
                <p className="label-xs">Based in</p>
                <p className="mt-1 text-xs font-medium text-white/80">Karnataka, India</p>
              </div>
            </div>
          </Magnet>
        </motion.div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to the About section"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40 transition-colors hover:text-white lg:flex"
      >
        Scroll
        <Icon name="arrow-down" className="text-base motion-safe:animate-bounce" />
      </a>
    </section>
  );
}
