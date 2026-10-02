import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type RefObject,
} from 'react';
import MarqueeTile from './MarqueeTile';
import { MARQUEE_MAX_ANIMATED, marqueeRows, type MarqueeItem } from '../../data/marquee';

const GAP = 12; // gap-3

/**
 * Fraction of one set width the rows travel while the reel crosses the
 * viewport. The previous scroll-linked factor produced well under one tile of
 * drift across the whole pass, which read as a static reel.
 */
const TRAVEL_RATIO = 4;

interface RowHandle {
  measure: () => void;
  apply: (travel: number) => void;
}

interface RowProps {
  id: string;
  items: MarqueeItem[];
  /** 1 = drifts right with scroll, -1 = drifts left. */
  dir: 1 | -1;
  /** How many tiles in this row may animate at once. */
  animationSlots: number;
  /** False until the reel is near the viewport — animation waits, posters do not. */
  near: boolean;
  reducedMotion: boolean;
}

const wrap = (value: number, range: number) => ((value % range) + range) % range;
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const MarqueeRow = forwardRef<RowHandle, RowProps>(function MarqueeRow(
  { id, items, dir, animationSlots, near, reducedMotion },
  ref,
) {
  const trackRef = useRef<HTMLDivElement>(null);
  const firstTileRef = useRef<HTMLDivElement>(null);
  const strideRef = useRef(0);
  const visibleRef = useRef<[-1, -1] | [number, number]>([-1, -1]);
  const liveRef = useRef<[-1, -1] | [number, number]>([-1, -1]);
  const [live, setLive] = useState<[number, number]>([-1, -1]);

  // Two copies of the set give a seamless wrap without tripling the DOM.
  const tiles2 = 2 * items.length;

  useImperativeHandle(
    ref,
    () => ({
      measure() {
        const first = firstTileRef.current;
        if (!first) return;
        strideRef.current = first.getBoundingClientRect().width + GAP;
      },
      /** `travel` is a pixel distance already scaled for visibility. */
      apply(travel: number) {
        const track = trackRef.current;
        const stride = strideRef.current || 432;
        if (!track) return;
        const setWidth = stride * items.length;
        // Wrap into one set width so the two copies hand off seamlessly.
        const shifted = -wrap(dir === 1 ? -travel : travel, setWidth);
        track.style.transform = `translate3d(${shifted.toFixed(2)}px,0,0)`;

        const viewport = window.innerWidth;
        // Which tiles are horizontally on screen right now.
        const from = clamp(Math.floor(-shifted / stride) - 1, 0, tiles2 - 1);
        const to = clamp(Math.ceil((-shifted + viewport) / stride) + 1, 0, tiles2 - 1);
        if (visibleRef.current[0] !== from || visibleRef.current[1] !== to) {
          visibleRef.current = [from, to];
        }

        // Grant animation to at most `animationSlots` tiles, centred on the
        // viewport so the budget never lands entirely on one side.
        let next: [number, number] = [-1, -1];
        if (!reducedMotion && to >= from) {
          const mid = (from + to) / 2;
          let l = Math.round(mid - (animationSlots - 1) / 2);
          let r = l + animationSlots - 1;
          if (l < from) {
            l = from;
            r = from + animationSlots - 1;
          }
          if (r > to) {
            r = to;
            l = r - animationSlots + 1;
          }
          next = [clamp(l, from, to), clamp(r, from, to)];
        }
        if (liveRef.current[0] !== next[0] || liveRef.current[1] !== next[1]) {
          liveRef.current = next;
          setLive(next);
        }
      },
    }),
    [dir, items.length, tiles2, animationSlots, reducedMotion],
  );

  return (
    <div className="relative w-full overflow-hidden">
      {/* The track transform is written imperatively by `apply()`; no React
          style prop here so there is exactly one owner of `transform`. */}
      <div ref={trackRef} className="flex w-max gap-3 will-change-transform">
        {Array.from({ length: tiles2 }, (_, index) => {
          const item = items[index % items.length];
          return (
            <MarqueeTile
              key={`${id}-${index}-${item.slug}`}
              ref={index === 0 ? firstTileRef : undefined}
              item={item}
              animate={near && index >= live[0] && index <= live[1]}
            />
          );
        })}
      </div>
    </div>
  );
});

/**
 * Two-row preview reel. Rows travel in opposite directions as the page
 * scrolls, driven by one rAF-coalesced passive scroll listener that writes
 * transforms directly to the DOM — no React state per frame, no remounting.
 *
 * Every tile renders its poster unconditionally, so the reel always reads as a
 * continuous gallery of real previews. Only the animation layer is budgeted.
 */
export default function Marquee() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rowRefs = useRef<Array<RefObject<RowHandle>>>([]);
  const [near, setNear] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // One ref per row, created once.
  if (rowRefs.current.length !== marqueeRows.length) {
    rowRefs.current = marqueeRows.map(() => ({ current: null }));
  }

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setNear(entry.isIntersecting);
      },
      // Keep observing well past the viewport so the reel is already warm when
      // it scrolls into view. Never require 100% visibility.
      { rootMargin: '600px 0px', threshold: 0 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!near) return;
    let frame = 0;
    let sectionTop = 0;
    let sectionHeight = 0;

    const measure = () => {
      const section = sectionRef.current;
      if (section) {
        const rect = section.getBoundingClientRect();
        // Absolute document position — never assume 0, and never cache a stale
        // value across a resize or a layout shift above the reel.
        sectionTop = rect.top + window.scrollY;
        sectionHeight = rect.height;
      }
      rowRefs.current.forEach((row) => row.current?.measure());
      paint();
    };

    const paint = () => {
      frame = 0;
      const viewport = window.innerHeight;
      // How far the reel has travelled through the viewport, 0 → 1. Normalising
      // against the reel's own scroll span keeps the motion clearly visible no
      // matter where the section sits in the document.
      const span = sectionHeight + viewport;
      const progress = span > 0 ? (window.scrollY - sectionTop + viewport) / span : 0;
      const travel = progress * TRAVEL_RATIO * sectionHeight;

      // `apply()` owns the direction via each row's `dir` prop — pass the
      // unsigned distance so the two rows travel in opposite directions.
      rowRefs.current.forEach((row) => row.current?.apply(travel));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    // Images/fonts finishing can shift layout; re-measure once settled.
    const settle = window.setTimeout(measure, 400);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      window.clearTimeout(settle);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [near]);

  // Split the animation budget across rows so the page-wide cap holds.
  const perRowSlots = Math.max(1, Math.floor(MARQUEE_MAX_ANIMATED / marqueeRows.length));

  return (
    <section ref={sectionRef} aria-label="Animated interface preview reel" className="relative py-6">
      <div className="mb-4 flex justify-center px-4">
        <span className="label-xs">Decorative motion reel · interface previews, not client work</span>
      </div>
      <div className="flex flex-col gap-3">
        {marqueeRows.map((row, index) => (
          <MarqueeRow
            key={row.id}
            ref={rowRefs.current[index]}
            id={row.id}
            items={row.tiles}
            dir={index % 2 === 0 ? 1 : -1}
            animationSlots={perRowSlots}
            near={near}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </section>
  );
}
