import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface ContactButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  download?: string;
  external?: boolean;
  'aria-label'?: string;
}

/**
 * Contact CTA — the gradient pill from the design specification, adapted to
 * the personal brand: magenta → violet → amber gradient, inset accent glow,
 * white 2px outline, uppercase wide-tracked label.
 */
export default function ContactButton({
  children,
  href,
  onClick,
  className,
  type = 'button',
  disabled,
  download,
  external,
  ...rest
}: ContactButtonProps) {
  const classes = cn(
    'group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5',
    'text-[13px] font-semibold uppercase tracking-[0.22em] text-white',
    'outline outline-2 outline-offset-[-2px] outline-white/85',
    'transition-transform duration-300 ease-editorial will-change-transform',
    'hover:-translate-y-0.5 active:translate-y-0',
    'disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0',
    className,
  );

  const style = {
    background:
      'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
    boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
  } as const;

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        style={style}
        download={download}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} style={style} {...rest}>
      {children}
    </button>
  );
}
