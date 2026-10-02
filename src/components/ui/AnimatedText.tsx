import { useMemo, useRef, type ElementType } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { cn } from '../../lib/utils';

interface TokenProps {
  token: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  word: boolean;
}

function Token({ token, progress, start, end, word }: TokenProps) {
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  return (
    <motion.span
      className={cn('inline-block', word ? 'whitespace-nowrap' : 'whitespace-pre')}
      style={{ opacity }}
    >
      {token}
    </motion.span>
  );
}

interface AnimatedTextProps {
  text: string;
  className?: string;
  as?: ElementType;
  /** Above this length the reveal steps down to word level (cheap DOM). */
  charLimit?: number;
}

/**
 * Character-by-character reveal driven by scroll progress: every glyph starts
 * at 0.2 opacity and resolves to 1 as the paragraph crosses the viewport.
 *
 * Each glyph reads one shared progress motion value, so revealing the whole
 * paragraph costs zero React renders — the browser composites the styles.
 * Long copy switches to word-level reveals to keep the DOM small.
 */
export default function AnimatedText({
  text,
  className,
  as = 'p',
  charLimit = 320,
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.4'],
  });

  const useChars = text.length <= charLimit;

  const tokens = useMemo(() => {
    if (useChars) {
      // Split on words so wrapping still happens between words, not mid-word.
      return text.split(/(\s+)/).flatMap((chunk) => {
        if (/^\s+$/.test(chunk)) return [{ value: chunk, word: false }];
        return chunk.split('').map((char) => ({ value: char, word: false }));
      });
    }
    return text.split(/(\s+)/).map((chunk) => ({
      value: chunk,
      word: !/^\s+$/.test(chunk),
    }));
  }, [text, useChars]);

  const MotionTag = motion[as as keyof typeof motion] as typeof motion.p;
  const step = 1 / Math.max(tokens.length, 1);

  return (
    <MotionTag ref={ref as never} className={cn(className)}>
      {tokens.map((token, index) => (
        <Token
          key={`${index}-${token.value}`}
          token={token.value}
          progress={scrollYProgress}
          start={index * step * 0.85}
          end={index * step * 0.85 + 0.18}
          word={token.word}
        />
      ))}
    </MotionTag>
  );
}
