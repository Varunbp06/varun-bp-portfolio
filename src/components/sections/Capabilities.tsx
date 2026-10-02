import { capabilities } from '../../data/capabilities';
import FadeIn from '../ui/FadeIn';
import SectionHeading from '../ui/SectionHeading';

export default function Capabilities() {
  return (
    <section
      id="capabilities"
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="What I build"
          title={
            <>
              Capabilities<span className="text-white/25">.</span>
            </>
          }
          subtitle="The engineering work behind the projects — from data layer to shipped interface."
        />

        <div className="mt-14 flex flex-col">
          {capabilities.map((capability, index) => (
            <FadeIn key={capability.number} delay={index * 0.04} y={20}>
              <div className="group grid gap-5 border-t border-white/10 py-8 transition-colors duration-500 hover:border-white/30 lg:grid-cols-[120px_1.05fr_1fr] lg:items-start lg:gap-10 lg:py-10">
                <span className="text-4xl font-extrabold leading-none tracking-tight text-white/20 transition-colors duration-500 group-hover:text-white/50 sm:text-5xl">
                  {capability.number}
                </span>
                <h3 className="text-2xl font-semibold leading-tight tracking-tight text-white transition-transform duration-500 ease-editorial sm:text-3xl lg:group-hover:translate-x-1.5">
                  {capability.title}
                </h3>
                <div className="flex flex-col gap-4">
                  <p className="text-sm leading-relaxed text-white/55 sm:text-base">
                    {capability.description}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {capability.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-white/45"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          ))}
          <div className="border-t border-white/10" />
        </div>
      </div>
    </section>
  );
}
