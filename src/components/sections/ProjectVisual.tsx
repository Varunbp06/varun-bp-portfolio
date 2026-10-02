import type { Project } from '../../data/types';
import { cn } from '../../lib/utils';

/**
 * Project visual: two stacked panels on the left, one tall panel on the right.
 *
 * These are branded compositions, not screenshots — no stock imagery and no
 * implied screenshots. If real screenshots are ever added to a project's
 * `images` array, they render here instead.
 */
export default function ProjectVisual({ project }: { project: Project }) {
  const words = project.title.split(' ');

  if (project.images.length > 0) {
    const [first, second, third] = project.images;
    return (
      <div className="grid h-full grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          {[first, second].filter(Boolean).map((src) => (
            <div key={src} className="overflow-hidden rounded-2xl border border-white/10">
              <img
                src={src}
                alt={`${project.title} interface`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        {third ? (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <img
              src={third}
              alt={`${project.title} interface detail`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-2 gap-3">
      <div className="flex flex-col gap-3">
        {/* Panel 1 — wordmark */}
        <div
          className={cn(
            'relative flex flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br p-5',
            project.accent,
          )}
        >
          <span className="label-xs">{project.category}</span>
          <p className="text-xl font-bold leading-tight tracking-tight text-white/90">
            {words.map((word, index) => (
              <span key={`${word}-${index}`} className="block">
                {word}
              </span>
            ))}
          </p>
          <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
            {project.year}
          </span>
        </div>

        {/* Panel 2 — architecture flow */}
        <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <span className="label-xs">Pipeline</span>
          <ol className="mt-3 flex flex-col gap-2">
            {project.flow.slice(0, 4).map((step, index) => (
              <li key={step} className="flex items-start gap-2 text-[11px] leading-snug text-white/55">
                <span className="mt-0.5 text-[10px] text-white/30">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Tall panel — monogram + grid */}
      <div
        className={cn(
          'relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b p-5',
          project.accent,
        )}
      >
        <div
          className="absolute inset-0 opacity-25"
          aria-hidden="true"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        />
        <span className="relative text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-none tracking-tighter text-white/85">
          {words
            .map((word) => word[0])
            .join('')
            .slice(0, 3)}
        </span>
        <span className="relative mt-3 text-center text-[10px] uppercase tracking-[0.24em] text-white/45">
          {project.status}
        </span>
      </div>
    </div>
  );
}
