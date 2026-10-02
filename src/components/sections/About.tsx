import { profile, stats } from '../../data/profile';
import AnimatedText from '../ui/AnimatedText';
import FadeIn from '../ui/FadeIn';
import Icon from '../ui/SocialIcon';

/** Purely decorative depth objects — CSS/SVG only, no WebGL payload. */
function CornerObjects() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden select-none md:block" aria-hidden="true">
      {/* Top-left: moon */}
      <div className="animate-soft-float absolute left-6 top-10 h-14 w-14 rounded-full border border-white/12 lg:left-12">
        <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-white/25 to-transparent" />
        <div className="absolute inset-4 rounded-full bg-[#0C0C0C]" />
      </div>
      {/* Bottom-left: floating cube */}
      <div className="animate-soft-float absolute bottom-16 left-8 h-16 w-16 [animation-delay:-3s] lg:left-16">
        <div className="h-full w-full rotate-12 rounded-2xl border border-white/12 bg-gradient-to-br from-white/[0.12] to-transparent" />
      </div>
      {/* Top-right: stacked bars */}
      <div className="animate-soft-float absolute right-8 top-12 flex flex-col gap-1.5 [animation-delay:-5s] lg:right-16">
        <span className="h-1.5 w-16 rounded-full bg-white/20" />
        <span className="h-1.5 w-10 rounded-full bg-white/12" />
        <span className="h-1.5 w-6 rounded-full bg-white/10" />
      </div>
      {/* Bottom-right: orbit group */}
      <div className="animate-orbit-slow absolute bottom-14 right-10 h-20 w-20 rounded-full border border-dashed border-white/12 lg:right-20">
        <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white/40" />
      </div>
      <div className="absolute bottom-20 right-16 h-24 w-24 rounded-full border border-white/8 lg:right-28" />
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
      <CornerObjects />

      <div className="relative mx-auto flex max-w-[1200px] flex-col gap-14">
        <FadeIn className="flex flex-col items-center text-center">
          <span className="label-xs">Introduction</span>
          <h2 className="text-gradient-hero mt-4 text-[clamp(2.5rem,8vw,6rem)] font-extrabold leading-[0.9] tracking-[-0.03em]">
            About me
          </h2>
        </FadeIn>

        <div className="flex flex-col gap-6">
          <AnimatedText
            text={profile.summary}
            className="text-lg leading-relaxed text-white/75 sm:text-xl lg:text-2xl"
          />
          <AnimatedText
            text={profile.summaryDeep}
            className="text-base leading-relaxed text-white/50 sm:text-lg"
          />
        </div>

        <FadeIn delay={0.1} className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <p className="text-lg italic leading-relaxed text-white/70 sm:text-xl">
            “{profile.quote}”
          </p>
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { key: 'Now', value: 'Final-year B.E. AI & Data Science, VTU — class of 2026' },
            { key: 'Focus', value: 'Agentic RAG · LLM integrations · Explainable AI' },
            { key: 'Base', value: profile.location },
          ].map((card, index) => (
            <FadeIn
              key={card.key}
              delay={index * 0.06}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
            >
              <p className="label-xs text-[#bbccd7]">{card.key}</p>
              <p className="mt-2 text-sm leading-snug text-white/70">{card.value}</p>
            </FadeIn>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <FadeIn
              key={stat.label}
              delay={index * 0.06}
              className="surface surface-hover rounded-3xl p-6"
            >
              <p className="text-gradient-soft text-5xl font-extrabold tracking-tight">
                {stat.value}
              </p>
              <p className="mt-3 text-sm font-medium uppercase tracking-[0.14em] text-white/70">
                {stat.label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/40">{stat.description}</p>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="flex flex-wrap gap-3">
          <a
            href={profile.resume}
            download={profile.resumeFileName}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-xs uppercase tracking-[0.18em] text-white/85 transition-colors hover:border-white/60 hover:bg-white/10 hover:text-white"
          >
            <Icon name="download" /> Download resume
          </a>
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-xs uppercase tracking-[0.18em] text-white/85 transition-colors hover:border-white/60 hover:bg-white/10 hover:text-white"
          >
            View projects <Icon name="arrow-right" />
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
