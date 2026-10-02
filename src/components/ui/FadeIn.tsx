import { type ElementType, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { EASE } from '../../lib/motion';
import { cn } from '../../lib/utils';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  /** Entrance duration in seconds. */
  duration?: number;
  /** Vertical offset in px. */
  y?: number;
  delay?: number;
  as?: ElementType;
}

/**
 * Scroll-reveal wrapper. Runs once when the element enters the viewport —
 * never re-animates on the way back up.
 */
export default function FadeIn({
  children,
  className,
  duration = 0.7,
  y = 30,
  delay = 0,
  as = 'div',
}: FadeInProps) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}
