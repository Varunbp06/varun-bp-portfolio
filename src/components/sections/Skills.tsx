import { useState } from 'react';
import { skillGroups } from '../../data/skills';
import { cn } from '../../lib/utils';
import FadeIn from '../ui/FadeIn';
import SectionHeading from '../ui/SectionHeading';

export default function Skills() {
  const [traced, setTraced] = useState<string | null>(null);

  const tracedGroups = traced
    ? skillGroups.filter((group) => group.items.includes(traced)).length
    : 0;

  return (
    <section id="skills" className="relative px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Toolkit"
          title={
            <>
              Skills<span className="text-white/25">.</span>
            </>
          }
          subtitle="Select any skill to trace where it is used across the stack."
        />

        <p aria-live="polite" className="mt-6 text-xs uppercase tracking-[0.18em] text-white/40">
          {traced ? (
            <>
              Tracing <span className="text-[#bbccd7]">{traced}</span> — found in {tracedGroups}{' '}
              {tracedGroups === 1 ? 'group' : 'groups'}. Select again to clear.
            </>
          ) : (
            'Nothing selected'
          )}
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {skillGroups.map((group, index) => {
            const contains = traced ? group.items.includes(traced) : false;
            const dimmed = Boolean(traced) && !contains;
            return (
              <FadeIn
                key={group.category}
                delay={(index % 4) * 0.05}
                className={cn(
                  'flex flex-col gap-4 rounded-3xl border p-6 transition-all duration-500',
                  contains
                    ? 'border-[#bbccd7]/45 bg-white/[0.05]'
                    : 'border-white/10 bg-white/[0.02]',
                  dimmed ? 'opacity-45' : 'opacity-100',
                )}
              >
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-white">
                    {group.category}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-white/40">{group.summary}</p>
                </div>
                <ul className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => {
                    const active = traced === item;
                    return (
                      <li key={item}>
                        <button
                          type="button"
                          aria-pressed={active}
                          onClick={() => setTraced(active ? null : item)}
                          title={
                            active
                              ? `${item} — selected, select again to clear`
                              : `Trace ${item} across groups`
                          }
                          className={cn(
                            'rounded-full border px-3 py-1.5 text-xs transition-colors duration-300',
                            active
                              ? 'border-[#bbccd7] bg-[#bbccd7] text-[#0C0C0C]'
                              : 'border-white/12 bg-white/[0.03] text-white/60 hover:border-white/35 hover:text-white',
                          )}
                        >
                          {item}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
