import { achievements } from '../../data/achievements';
import FadeIn from '../ui/FadeIn';
import Icon from '../ui/SocialIcon';
import SectionHeading from '../ui/SectionHeading';

export default function Achievements() {
  return (
    <section id="achievements" className="relative px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="Recognition"
          title={
            <>
              Achievements<span className="text-white/25">.</span>
            </>
          }
          subtitle="Presentations and events where the work was put in front of an audience."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {achievements.map((achievement, index) => (
            <FadeIn
              key={achievement.title}
              delay={index * 0.06}
              className="surface surface-hover flex flex-col gap-4 rounded-3xl p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="label-xs">{achievement.year}</span>
                <Icon name="spark" className="text-base text-[#bbccd7]/70" />
              </div>
              <h3 className="text-xl font-semibold leading-tight tracking-tight text-white">
                {achievement.title}
              </h3>
              <p className="text-sm font-medium text-[#bbccd7]/75">{achievement.event}</p>
              <p className="text-sm leading-relaxed text-white/50">{achievement.description}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
