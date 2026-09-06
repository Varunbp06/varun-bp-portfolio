import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

function ParallaxText({ children, baseVelocity = 100, ...props }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

  const [repetitions, setRepetitions] = useState(1);
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const calculateRepetitions = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const textWidth = textRef.current.offsetWidth;
        setRepetitions(Math.ceil(containerWidth / textWidth) + 2);
      }
    };
    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);
    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [children]);

  const x = useTransform(baseX, (v) => `${wrap(-100 / repetitions, 0, v)}%`);
  const directionFactor = React.useRef(1);

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    directionFactor.current = vf < 0 ? -1 : vf > 0 ? 1 : directionFactor.current;
    moveBy += directionFactor.current * moveBy * vf;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div ref={containerRef} className="w-full overflow-hidden whitespace-nowrap" {...props}>
      <motion.div className="inline-block" style={{ x }}>
        {Array.from({ length: repetitions }).map((_, i) => (
          <span key={i} ref={i === 0 ? textRef : null}>
            {children}{' '}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function VelocityScroll({ defaultVelocity = 5, numRows = 2, children, className, ...props }) {
  return (
    <div className={cn('relative w-full text-4xl font-bold tracking-[-0.02em] md:text-7xl md:leading-[5rem]', className)} {...props}>
      {Array.from({ length: numRows }).map((_, i) => (
        <ParallaxText key={i} baseVelocity={defaultVelocity * (i % 2 === 0 ? 1 : -1)}>
          {children}
        </ParallaxText>
      ))}
    </div>
  );
}