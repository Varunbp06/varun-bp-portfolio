import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Reading-progress bar. Purely a motion value written to `scaleX`, so it
 * never triggers a React render while scrolling.
 */
export default function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 40, mass: 0.3 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-gradient-to-r from-[#646973] via-[#9fb0bd] to-[#bbccd7]"
      style={{ scaleX }}
    />
  );
}
