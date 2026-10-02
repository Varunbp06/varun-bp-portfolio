import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { Project } from '../../data/types';
import { archiveProjects, featuredProjects } from '../../data/projects';
import { useBodyScrollLock, useMediaQuery, useMounted } from '../../lib/hooks';
import { cn, prefersReducedMotion } from '../../lib/utils';
import { createPortal } from 'react-dom';
import FadeIn from '../ui/FadeIn';
import Icon from '../ui/SocialIcon';
import ProjectButton from '../ui/ProjectButton';
import SectionHeading from '../ui/SectionHeading';
import ProjectVisual from './ProjectVisual';

function TechChips({ tech, limit }: { tech: string[]; limit?: number }) {
  const shown = limit ? tech.slice(0, limit) : tech;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {shown.map((item) => (
        <li
          key={item}
          className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-white/50"
        >
          {item}
        </li>
      ))}
      {limit && tech.length > limit ? (
        <li className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-white/35">
          +{tech.length - limit}
        </li>
      ) : null}
    </ul>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useBodyScrollLock(true);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} details`}
      className="fixed inset-0 z-[80] overflow-y-auto px-4 py-10 sm:px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/80" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/12 bg-[#0f0f0f]">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
          <div>
            <p className="label-xs">{project.category}</p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-white/50">
              {project.tagline} · {project.year}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            aria-label="Close project details"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="flex flex-col gap-6 p-6">
          <p className="text-sm leading-relaxed text-white/70 sm:text-base">
            {project.description}
          </p>

          <div>
            <p className="label-xs mb-3">Engineering highlights</p>
            <ul className="flex flex-col gap-2">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-sm leading-relaxed text-white/60">
                  <Icon name="check" className="mt-1 shrink-0 text-emerald-400/80" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-xs mb-3">Architecture</p>
            <ol className="flex flex-wrap gap-2">
              {project.flow.map((step, index) => (
                <li
                  key={step}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/55"
                >
                  <span className="text-white/30">{String(index + 1).padStart(2, '0')}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <p className="label-xs mb-3">Stack</p>
            <TechChips tech={project.tech} />
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            {project.github ? <ProjectButton href={project.github}>GitHub</ProjectButton> : null}
            {project.live ? (
              <ProjectButton href={project.live}>
                Live demo <Icon name="external" className="text-xs" />
              </ProjectButton>
            ) : null}
            {project.repoNote ? (
              <span className="inline-flex items-center rounded-full border border-white/10 px-5 py-2.5 text-xs uppercase tracking-[0.16em] text-white/35">
                {project.repoNote}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

interface CardProps {
  project: Project;
  index: number;
  total: number;
  isDesktop: boolean;
  onOpen: (project: Project) => void;
}

function StackedCard({ project, index, total, isDesktop, onOpen }: CardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  });
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, isDesktop ? targetScale : 1]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center lg:sticky lg:top-0 lg:h-[85vh]"
    >
      <motion.article
        style={{ scale, top: isDesktop ? index * 28 : 0 }}
        className={cn(
          'relative w-full max-w-[1400px] overflow-hidden rounded-[28px] border-2 border-white/10 bg-[#0f0f0f]',
          'lg:h-[76vh] lg:min-h-[560px] lg:rounded-[48px]',
        )}
      >
        <div className="grid h-full gap-6 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:p-10">
          <div className="flex min-h-0 flex-col gap-4 lg:justify-center">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-extrabold leading-none tracking-tighter text-white/15 sm:text-6xl">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="label-xs">{project.category}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/35">
                  {project.year} · {project.status}
                </p>
              </div>
            </div>

            <h3 className="text-3xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-4xl xl:text-5xl">
              {project.title}
            </h3>
            <p className="text-sm font-medium text-[#bbccd7]/80">{project.tagline}</p>
            <p className="max-w-xl text-sm leading-relaxed text-white/55">
              {project.description}
            </p>

            <TechChips tech={project.tech} limit={7} />

            <div className="mt-2 flex flex-wrap items-center gap-3">
              {project.github ? (
                <ProjectButton href={project.github} ariaLabel={`${project.title} on GitHub`}>
                  <Icon name="github" className="text-sm" /> GitHub
                </ProjectButton>
              ) : null}
              {project.live ? (
                <ProjectButton href={project.live} ariaLabel={`${project.title} live demo`}>
                  <Icon name="external" className="text-sm" /> Live demo
                </ProjectButton>
              ) : null}
              <ProjectButton onClick={() => onOpen(project)}>
                Technical detail <Icon name="arrow-right" className="text-sm" />
              </ProjectButton>
            </div>
          </div>

          <div className="min-h-0 lg:h-full">
            <div className="h-[240px] sm:h-[300px] lg:h-full">
              <ProjectVisual project={project} />
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function Projects() {
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const mounted = useMounted();
  const reduce = mounted && prefersReducedMotion();
  const stackDesktop = isDesktop && !reduce;

  return (
    <section id="projects" className="relative px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Selected work"
          title={
            <>
              Featured projects<span className="text-white/25">.</span>
            </>
          }
          subtitle="Three production platforms, each deployed and open on GitHub. Every claim below traces back to the repository."
        />
      </div>

      <div className="mx-auto mt-12 flex max-w-[1400px] flex-col gap-6 lg:gap-0">
        {featuredProjects.map((project, index) => (
          <StackedCard
            key={project.id}
            project={project}
            index={index}
            total={featuredProjects.length}
            isDesktop={stackDesktop}
            onOpen={setOpenProject}
          />
        ))}
      </div>

      {/* ---------------- Archive ---------------- */}
      <div className="mx-auto mt-24 max-w-[1400px]">
        <SectionHeading
          eyebrow="More work"
          title={
            <>
              Other projects<span className="text-white/25">.</span>
            </>
          }
          subtitle="Earlier full-stack builds and college research — kept here rather than folded into the featured set."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {archiveProjects.map((project, index) => (
            <FadeIn
              key={project.id}
              delay={(index % 3) * 0.05}
              className="surface surface-hover flex flex-col gap-3 rounded-3xl p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="label-xs">{project.category}</span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-white/30">
                  {project.year}
                </span>
              </div>
              <h3 className="text-lg font-semibold leading-tight tracking-tight text-white">
                {project.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/50">{project.tagline}</p>
              <TechChips tech={project.tech} limit={4} />
              <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                <ProjectButton onClick={() => setOpenProject(project)}>
                  Details
                </ProjectButton>
                {project.repoNote ? (
                  <span className="text-[11px] uppercase tracking-[0.14em] text-white/30">
                    {project.repoNote}
                  </span>
                ) : null}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {openProject ? (
        <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
      ) : null}
    </section>
  );
}
