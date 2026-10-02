import type { MarqueeRow } from './types';

/**
 * Marquee media, same-origin and self-hosted.
 *
 * The design supplied 21 remote GIFs on motionsites.ai. They were a liability
 * for production in two ways: multi-megabyte animated files decoded in
 * parallel, and one asset (`celestia`) that now 404s upstream entirely — which
 * is what left dark cards on screen.
 *
 * Every preview is therefore transcoded at build-prep time into two layers:
 *
 *   /marquee/<slug>/poster.webp   ~25 KB  first frame, rendered immediately
 *   /marquee/<slug>/preview.webm  ~200 KB VP9 animation, played only while the
 *                                       tile is actually on screen
 *
 * Total weight dropped from 169 MB of GIFs to 5.4 MB, all 21 have a real
 * poster, and a failed or skipped animation can never produce a blank card.
 */
export interface MarqueeItem {
  slug: string;
  label: string;
  poster: string;
  animation: string;
  width: number;
  height: number;
}

const items: Array<[slug: string, label: string, width: number, height: number]> = [
  ['space-voyage', 'Space Voyage', 800, 588],
  ['codenest', 'CodeNest', 800, 576],
  ['vex-ventures', 'Vex Ventures', 800, 604],
  ['stellar-ai-v2', 'Stellar AI v2', 800, 598],
  ['asme', 'ASME', 800, 582],
  ['transform-data', 'Transform Data', 800, 592],
  ['vitara', 'Vitara', 800, 556],
  ['terra', 'Terra', 800, 582],
  ['skyelite', 'SkyElite', 800, 606],
  ['aethera', 'Aethera', 800, 582],
  ['designpro', 'DesignPro', 800, 570],
  ['stellar-ai', 'Stellar AI', 800, 708],
  ['xportfolio', 'XPortfolio', 800, 608],
  ['orbit-web3', 'Orbit Web3', 800, 604],
  ['nexora', 'Nexora', 800, 552],
  ['evr-ventures', 'EVR Ventures', 800, 624],
  ['planet-orbit', 'Planet Orbit', 800, 612],
  ['new-era', 'New Era', 800, 568],
  ['wealth', 'Wealth', 800, 570],
  ['luminex', 'Luminex', 800, 600],
  ['celestia', 'Celestia', 800, 586],
];

export const marqueeItems: MarqueeItem[] = items.map(([slug, label, width, height]) => ({
  slug,
  label,
  // Root-relative so these resolve identically at any nesting depth and on
  // Vercel, where only `public/` is published.
  poster: `/marquee/${slug}/poster.webp`,
  animation: `/marquee/${slug}/preview.webm`,
  width,
  height,
}));

/** Two rows: first 11 previews travel one way, the remaining 10 the other. */
export const marqueeRows: MarqueeRow[] = [
  { id: 'row-1', tiles: marqueeItems.slice(0, 11) },
  { id: 'row-2', tiles: marqueeItems.slice(11) },
];

/**
 * How many tiles may play their animation at once. Posters are always
 * rendered for every tile, so this caps only the expensive decoding work —
 * it never decides whether a card has an image.
 */
export const MARQUEE_MAX_ANIMATED = 6;
