import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { MarqueeItem } from '../../data/marquee';

interface MarqueeTileProps {
  item: MarqueeItem;
  /** The parent grants this when the tile is on screen and within budget. */
  animate: boolean;
}

/**
 * A single preview tile, built in two layers so a card can never be blank:
 *
 *   Layer 1 (poster) — a ~25 KB WebP first frame, mounted for the tile's
 *                      whole life. Every tile has one, unconditionally.
 *   Layer 2 (video)  — the VP9 loop. Mounted only while the parent says this
 *                      tile is on screen and within the animation budget, and
 *                      paused whenever it scrolls out. It fades in over the
 *                      poster, so a slow load, a decode error or a paused
 *                      video all leave the poster visible underneath.
 *
 * The filename is never rendered as UI.
 */
const MarqueeTile = forwardRef<HTMLDivElement, MarqueeTileProps>(function MarqueeTile(
  { item, animate },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [onScreen, setOnScreen] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  // Keep our own ref while still honouring the ref forwarded from the row.
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  // Observe the tile itself — the <video> only exists once this has reported
  // the tile as on screen, so it cannot be the observation target.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setOnScreen(entry.isIntersecting);
      },
      { rootMargin: '120px 0px', threshold: 0.01 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const showVideo = animate && onScreen && !videoFailed;

  // Play while shown, pause the moment it leaves.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (showVideo) {
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
    } else {
      video.pause();
    }
  }, [showVideo]);

  return (
    <div
      ref={setRef}
      data-slug={item.slug}
      className="relative h-[170px] w-[260px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent sm:h-[220px] sm:w-[340px] lg:h-[270px] lg:w-[420px]"
    >
      {/* Layer 1 — poster. Always mounted, never conditional. Posters are
          ~25 KB each, so they are fetched eagerly: lazy loading only created a
          window where a tile had entered the viewport but had not yet decoded,
          which is exactly the blank card this layer exists to prevent. */}
      <img
        src={item.poster}
        alt=""
        aria-hidden="true"
        width={item.width}
        height={item.height}
        loading="eager"
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Layer 2 — animation, visible cards only. */}
      {showVideo ? (
        <video
          ref={videoRef}
          src={item.animation}
          poster={item.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setVideoFailed(true)}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 [animation:marquee-fade-in_0.28s_ease-out_forwards]"
        />
      ) : null}
    </div>
  );
});

export default MarqueeTile;
