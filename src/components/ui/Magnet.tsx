import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '../../lib/utils';

interface MagnetProps {
  children: ReactNode;
  className?: string;
  /** Distance (px) beyond the element bounds where the pull starts. */
  padding?: number;
  /** Higher = weaker pull. Translation = offset / strength. */
  strength?: number;
}

/**
 * Magnetic hover: the wrapped element drifts toward the cursor while it is
 * inside `padding`, then springs home. Enabled only for fine pointers without
 * reduced motion, so touch and keyboard users get a perfectly static target.
 *
 * Performance contract: one passive window listener, work coalesced into a
 * single rAF, cursor position kept in motion values (never React state), and
 * each element's rect cached per frame from a single layout read.
 */
export default function Magnet({
  children,
  className,
  padding = 150,
  strength = 3,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 120, damping: 14, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 120, damping: 14, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(fine.matches && !reduce.matches);
    update();
    fine.addEventListener?.('change', update);
    reduce.addEventListener?.('change', update);
    return () => {
      fine.removeEventListener?.('change', update);
      reduce.removeEventListener?.('change', update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let rect: DOMRect | null = null;

    const apply = () => {
      frame = 0;
      if (!rect) rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = pointerX - cx;
      const dy = pointerY - cy;
      const withinX = Math.abs(dx) - rect.width / 2 < padding;
      const withinY = Math.abs(dy) - rect.height / 2 < padding;
      if (withinX && withinY) {
        x.set(dx / strength);
        y.set(dy / strength);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const invalidate = () => {
      rect = null;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', invalidate, { passive: true });
    window.addEventListener('resize', invalidate);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', invalidate);
      window.removeEventListener('resize', invalidate);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled, padding, strength, x, y]);

  return (
    <motion.div
      ref={ref}
      className={cn('inline-flex will-change-transform', className)}
      style={enabled ? { x: sx, y: sy, translateZ: 0 } : undefined}
    >
      {children}
    </motion.div>
  );
}
