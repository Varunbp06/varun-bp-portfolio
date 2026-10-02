import { education } from '../../data/education';
import { languages } from '../../data/profile';
import FadeIn from '../ui/FadeIn';
import SectionHeading from '../ui/SectionHeading';

export default function Education() {
  return (
    <section id="education" className="relative px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="Academic background"
          title={
            <>
              Education<span className="text-white/25">.</span>
            </>
          }
          subtitle="Formal computer-science foundation, from school through to a B.E. in AI & Data Science."
        />

        <ol className="mt-12 flex flex-col gap-8 border-l border-white/10 pl-6 sm:pl-8">
          {education.map((entry, index) => (
            <FadeIn
              key={entry.institution}
              delay={index * 0.05}
              as="li"
              className="relative flex flex-col gap-3"
            >
              <span
                className="absolute -left-[31px] top-2 h-2.5 w-2.5 rounded-full bg-[#bbccd7] sm:-left-[39px]"
                aria-hidden="true"
              />
              <span className="label-xs">{entry.years}</span>
              <h3 className="text-xl font-semibold leading-tight tracking-tight text-white sm:text-2xl">
                {entry.qualification}
              </h3>
              <p className="text-sm text-white/55">
                {entry.institution} · {entry.detail}
              </p>
              <p className="inline-flex w-fit rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.14em] text-[#bbccd7]/80">
                {entry.score}
              </p>
              {entry.coursework.length ? (
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {entry.coursework.map((course) => (
                    <li
                      key={course}
                      className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1 text-[11px] text-white/45"
                    >
                      {course}
                    </li>
                  ))}
                </ul>
              ) : null}
            </FadeIn>
          ))}
        </ol>

        <FadeIn className="mt-14">
          <p className="label-xs mb-3">Languages</p>
          <ul className="flex flex-wrap gap-2">
            {languages.map((language) => (
              <li
                key={language.name}
                className="rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-xs text-white/60"
              >
                <span className="font-medium text-white/85">{language.name}</span> ·{' '}
                {language.level}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
