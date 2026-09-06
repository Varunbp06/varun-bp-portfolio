import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * PointerGlow — a soft ambient blue light that follows the cursor behind the
 * content. It is a cosmetic layer:
 *  - enabled only for fine pointers, ≥1024px, and when the user has NOT asked
 *    for reduced motion (matching the 3D anti-lag contract),
 *  - springs are damping-heavy so the glow trails smoothly instead of jittering,
 *  - rendered as `pointer-events-none` fixed layer under the page content.
 */
export default function PointerGlow() {
  const [enabled, setEnabled] = useState(false);
  const mx = useMotionValue(-600);
  const my = useMotionValue(-600);
  const sx = useSpring(mx, { stiffness: 45, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 45, damping: 18, mass: 0.6 });

  useEffect(() => {
    const mqFine = window.matchMedia('(pointer: fine)');
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqWidth = window.matchMedia('(min-width: 1024px)');
    const update = () => setEnabled(mqFine.matches && !mqMotion.matches && mqWidth.matches);
    update();
    mqFine.addEventListener?.('change', update);
    mqMotion.addEventListener?.('change', update);
    mqWidth.addEventListener?.('change', update);
    return () => {
      mqFine.removeEventListener?.('change', update);
      mqMotion.removeEventListener?.('change', update);
      mqWidth.removeEventListener?.('change', update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    const onMove = (e) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, mx, my]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[1] hidden lg:block"
      style={{ x: sx, y: sy }}
    >
      <div className="h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.14),rgba(37,99,235,0.08)_42%,transparent_70%)]" />
    </motion.div>
  );
}
