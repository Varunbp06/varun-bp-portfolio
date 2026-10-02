import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface ProjectButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  /** Rendered as a disabled-looking row when a project has no public link. */
  muted?: boolean;
  ariaLabel?: string;
}

/**
 * Ghost / outline pill used for GitHub + live-demo actions. Never rendered
 * with a placeholder destination — callers pass only verified URLs.
 */
export default function ProjectButton({
  children,
  href,
  onClick,
  className,
  muted = false,
  ariaLabel,
}: ProjectButtonProps) {
  const classes = cn(
    'inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-medium uppercase tracking-[0.16em]',
    'transition-colors duration-300 ease-editorial',
    muted
      ? 'border-white/10 text-white/40'
      : 'border-white/25 text-[#dbe3ea] hover:border-white/60 hover:bg-white/10 hover:text-white',
    className,
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={classes}
      aria-label={ariaLabel}
      disabled={!onClick}
    >
      {children}
    </button>
  );
}
