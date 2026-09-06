import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Magnetic — wraps a button/link and gently pulls it toward the cursor
 * (max ~strength of the element's own radius), springing back on leave.
 * Enabled only on fine pointers without reduced motion so touch/keyboard
 * users always get a stable, static control.
 */
export default function Magnetic({ children, strength = 0.3, className = '', style, ...rest }) {
  const [enabled, setEnabled] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 16, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 260, damping: 16, mass: 0.4 });

  useEffect(() => {
    const mqFine = window.matchMedia('(pointer: fine)');
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(mqFine.matches && !mqMotion.matches);
    update();
    mqFine.addEventListener?.('change', update);
    mqMotion.addEventListener?.('change', update);
    return () => {
      mqFine.removeEventListener?.('change', update);
      mqMotion.removeEventListener?.('change', update);
    };
  }, []);

  const onMove = (e) => {
    if (!enabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    my.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      className={`inline-block will-change-transform ${className}`}
      style={{ x: sx, y: sy, ...style }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
