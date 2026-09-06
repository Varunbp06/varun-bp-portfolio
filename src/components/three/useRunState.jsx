import { useEffect, useRef, useState } from 'react';

/**
 * Returns { ref, run }: `run` is true only while the element is
 * in the viewport AND the document tab is visible. Used to pause
 * WebGL rendering for battery/CPU savings (anti-lag).
 */
export function useRunState(threshold = 0.05) {
  const ref = useRef(null);
  const [run, setRun] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => setRun(entry.isIntersecting),
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  useEffect(() => {
    const onVis = () => setRun(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return { ref, run };
}