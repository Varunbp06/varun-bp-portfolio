import React, { useEffect, useState, Suspense } from 'react';

/**
 * Anti-lag 3D gate.
 * - Only mounts 3D content on desktop (>=1024px) with fine pointer.
 * - Respects prefers-reduced-motion (and re-evaluates if it changes at runtime).
 * - All 3D components are React.lazy so the WebGL bundle only loads when needed.
 */
export function useSceneEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setEnabled(false);
      return undefined;
    }
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqFine = window.matchMedia('(pointer: fine)');
    const check = () => {
      const next = window.innerWidth >= 1024 && mqFine.matches && !mqMotion.matches;
      setEnabled(next);
    };
    check();
    mqMotion.addEventListener?.('change', check);
    mqFine.addEventListener?.('change', check);
    window.addEventListener('resize', check);
    return () => {
      mqMotion.removeEventListener?.('change', check);
      mqFine.removeEventListener?.('change', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  return enabled;
}

export default function SceneGate({ children, className, fallback = null }) {
  const enabled = useSceneEnabled();
  if (!enabled) return null;

  return (
    <div className={className} aria-hidden="true">
      <Suspense fallback={fallback}>{children}</Suspense>
    </div>
  );
}
