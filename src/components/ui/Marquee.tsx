import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type RefObject,
} from 'react';
import {
  MARQUEE_LOAD_BUDGET,
  MARQUEE_MAX_MOUNTED,
  marqueeLabel,
  marqueeRows,
} from '../../data/marquee';
import { cn } from '../../lib/utils';

const GAP = 12; // gap-3

/**
 * Fraction of one set width the rows travel while the reel crosses the
 * viewport. The previous scroll-linked factor produced well under one tile of
 * drift across the whole pass, which read as a static reel.
 */
const TRAVEL_RATIO = 4;

interface RowHandle {
  measure: () => void;
  apply: (offset: number) => void;
}

interface RowProps {
  tiles: string[];
  /** 1 = drifts right with scroll, -1 = drifts left. */
  dir: 1 | -1;
  budget: number;
  /** False until the section is near the viewport / media loading allowed. */
  canLoad: boolean;
  staticMode: boolean;
}

const wrap = (value: number, range: number) => ((value % range) + range) % range;
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const MarqueeRow = forwardRef<RowHandle, RowProps>(function MarqueeRow(
  { tiles, dir, budget, canLoad, staticMode },
  ref,
) {
  const trackRef = useRef<HTMLDivElement>(null);
  const firstTileRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<[-1, -1] | [number, number]>([-1, -1]);
  const strideRef = useRef(0);
  const loadedRef = useRef<Set<number>>(new Set());
  const [, tick] = useState(0);

  const [range, setRange] = useState<[number, number]>(() => (staticMode ? [0, 5] : [-1, -1]));
  // Two copies of the set give a seamless wrap without tripling the DOM.
  const copies = 2;
  const tiles2 = copies * tiles.length;

  useImperativeHandle(
    ref,
    () => ({
      measure() {
        const first = firstTileRef.current;
        if (!first) return;
        strideRef.current = first.getBoundingClientRect().width + GAP;
      },
      /** `travel` is a signed pixel distance already scaled for visibility. */
      apply(travel: number) {
        const track = trackRef.current;
        const stride = strideRef.current || 432;
        if (!track) return;
        const setWidth = stride * tiles.length;
        // Wrap into one set width so the two copies hand off seamlessly.
        const shifted = -wrap(dir === 1 ? -travel : travel, setWidth);
        track.style.transform = `translate3d(${shifted.toFixed(2)}px,0,0)`;

        if (staticMode) return;
        const viewport = window.innerWidth;
        const from = clamp(Math.floor(-shifted / stride) - 1, 0, tiles2 - 1);
        const to = clamp(Math.ceil((-shifted + viewport) / stride) + 1, 0, tiles2 - 1);
        if (windowRef.current[0] !== from || windowRef.current[1] !== to) {
          windowRef.current = [from, to];
          setRange([from, to]);
        }
      },
    }),
    [dir, staticMode, tiles.length, tiles2],
  );

  // Claim unique sources as they enter the viewport, up to the row budget.
  useEffect(() => {
    if (range[0] < 0 || !canLoad) return;
    let changed = false;
    for (let i = range[0]; i <= range[1]; i += 1) {
      const source = i % tiles.length;
      if (loadedRef.current.has(source)) continue;
      if (loadedRef.current.size >= budget) break;
      loadedRef.current.add(source);
      changed = true;
    }
    if (changed) tick((value) => value + 1);
  }, [range, canLoad, budget, tiles.length]);


  return (
    <div className="relative w-full overflow-hidden">
      {/* The track transform is written imperatively by `apply()`; no React
          style prop here so there is exactly one owner of `transform`. */}
      <div ref={trackRef} className="flex w-max gap-3 will-change-transform">
        {Array.from({ length: tiles2 }, (_, index) => {
          const source = index % tiles.length;
          const src = tiles[source];
          // Only tiles inside the visible window and inside the load budget
          // ever mount an animated <img> — everything else is a branded tile.
          const inWindow = index >= range[0] && index <= range[1];
          // Mount the animated file only on the copy that is actually on
          // screen, so `MARQUEE_MAX_MOUNTED` counts real live animations.
          const allow = canLoad && inWindow && loadedRef.current.has(source);
          return (
            <div
              key={`${index}-${src}`}
              ref={index === 0 ? firstTileRef : undefined}
              className={cn(
                'relative h-[170px] w-[260px] shrink-0 overflow-hidden rounded-2xl border border-white/10',
                'bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent',
                'sm:h-[220px] sm:w-[340px] lg:h-[270px] lg:w-[420px]',
              )}
            >
              <div className="absolute inset-0 flex items-end p-3">
                <span className="label-xs !tracking-[0.2em] text-white/45">
                  {marqueeLabel(src)}
                </span>
              </div>
              {allow ? (
                <img
                  src={src}
                  alt=""
                  aria-hidden="true"
                  width={420}
                  height={270}
                  loading="lazy"
                  decoding="async"
                  className="relative h-full w-full object-cover opacity-90"
                />
              ) : null}
            </div>
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
 * Media only loads while the section is near the viewport.
 */
export default function Marquee() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rowRefs = useRef<Array<RefObject<RowHandle>>>([]);
  const [near, setNear] = useState(false);
  const [canLoad, setCanLoad] = useState(true);
  const [staticMode, setStaticMode] = useState(false);

  // One ref per row, created once.
  if (rowRefs.current.length !== marqueeRows.length) {
    rowRefs.current = marqueeRows.map(() => ({ current: null }));
  }

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setStaticMode(reduce.matches);
    update();
    reduce.addEventListener?.('change', update);

    // Skip multi-megabyte media on data-saver / slow connections.
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (
      connection?.saveData ||
      (connection?.effectiveType && /(^|-)2g$|^3g$/.test(connection.effectiveType))
    ) {
      setCanLoad(false);
    }

    return () => reduce.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setNear(entry.isIntersecting);
      },
      { rootMargin: '400px 0px', threshold: 0 },
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
      if (staticMode) return;

      const viewport = window.innerHeight;
      // How far the reel has travelled through the viewport, 0 → 1.
      // Normalising against the reel's own scroll span keeps the motion
      // clearly visible no matter where the section sits in the document,
      // instead of collapsing to a few pixels of drift.
      const span = sectionHeight + viewport;
      const progress = span > 0 ? (window.scrollY - sectionTop + viewport) / span : 0;

      // `TRAVEL_RATIO` × one set width ≈ 4 tiles of travel across the whole
      // pass — unmistakable on screen while still wrapping seamlessly.
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
  }, [near, staticMode]);

  // Split both budgets across the rows so the page-wide caps hold.
  const perRowBudget = Math.max(
    1,
    Math.min(
      Math.ceil(MARQUEE_LOAD_BUDGET / marqueeRows.length),
      Math.ceil(MARQUEE_MAX_MOUNTED / marqueeRows.length),
    ),
  );

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
            tiles={row.tiles}
            dir={index % 2 === 0 ? 1 : -1}
            budget={perRowBudget}
            canLoad={canLoad && near}
            staticMode={staticMode}
          />
        ))}
      </div>
    </section>
  );
}
