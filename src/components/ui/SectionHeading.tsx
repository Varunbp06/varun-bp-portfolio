import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import FadeIn from './FadeIn';

interface SectionHeadingProps {
  /** Small uppercase label above the title. */
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <FadeIn
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start',
        className,
      )}
    >
      <span className="label-xs">{eyebrow}</span>
      <h2 className="text-gradient-soft text-4xl font-bold leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </FadeIn>
  );
}
