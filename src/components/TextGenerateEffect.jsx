import { useEffect } from 'react';
import { motion, stagger, useAnimate } from 'framer-motion';
import { cn } from '../lib/utils';

const TextGenerateEffect = ({ words, className, filter = true, duration = 0.5 }) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(' ');

  useEffect(() => {
    animate(
      'span',
      { opacity: 1, filter: filter ? 'blur(0px)' : 'none' },
      { duration, delay: stagger(0.12) }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope.current]);

  return (
    <div className={cn('font-mono', className)}>
      <div className="mt-4 text-left leading-snug tracking-wide sm:text-left md:text-left lg:text-left">
        <motion.div ref={scope}>
          {wordsArray.map((word, idx) => (
            <motion.span
              key={`${word}-${idx}`}
              className="text-slate-700 opacity-0 dark:text-slate-200"
              style={{ filter: filter ? 'blur(10px)' : 'none' }}
            >
              {word}{' '}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TextGenerateEffect;