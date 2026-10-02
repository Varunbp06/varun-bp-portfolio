import type { MarqueeRow } from './types';

const A = 'https://motionsites.ai/assets/';

/**
 * Marquee media, exactly as supplied by the design specification.
 *
 * Engineering note: these preview GIFs are multi-megabyte animated files
 * (measured 5–15 MB each). Decoding two rows of 21 of them, or even tripling
 * the sets, would wreck first-load and scroll performance — so `Marquee`
 * mounts them through two hard budgets below and renders an identically sized
 * branded tile for everything else. The visual composition is unchanged; the
 * network cost is bounded.
 */
const sources: string[] = [
  'hero-space-voyage-preview-eECLH3Yc.gif',
  'hero-codenest-preview-Cgppc2qV.gif',
  'hero-vex-ventures-preview-BczMFIiw.gif',
  'hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'hero-asme-preview-B_nGDnTP.gif',
  'hero-transform-data-preview-Cx5OU29N.gif',
  'hero-vitara-preview-Cjz2QYyU.gif',
  'hero-terra-preview-BFjrCr7T.gif',
  'hero-skyelite-preview-DHaZIgUv.gif',
  'hero-aethera-preview-DknSlcTa.gif',
  'hero-designpro-preview-D8c5_een.gif',
  'hero-stellar-ai-preview-D3HL6bw1.gif',
  'hero-xportfolio-preview-D4A8maiC.gif',
  'hero-orbit-web3-preview-BXt4OttD.gif',
  'hero-nexora-preview-cx5HmUgo.gif',
  'hero-evr-ventures-preview-DZxeVFEX.gif',
  'hero-planet-orbit-preview-DWAP8Z1P.gif',
  'hero-new-era-preview-CocuDUm9.gif',
  'hero-wealth-preview-B70idl_u.gif',
  'hero-luminex-preview-CxOP7ce6.gif',
  'hero-celestia-preview-0yO3jXO8.gif',
].map((file) => `${A}${file}`);

/** Two rows: first 11 sources scroll one way, the remaining 10 the other. */
export const marqueeRows: MarqueeRow[] = [
  { id: 'row-1', tiles: sources.slice(0, 11) },
  { id: 'row-2', tiles: sources.slice(11) },
];

/**
 * Performance budget.
 * `MAX_MOUNTED`  — how many animated tiles may be live at once, page-wide.
 * `LOAD_BUDGET`  — how many unique GIF files may ever be fetched, page-wide
 *                  (tiles beyond the budget stay as branded placeholders).
 *
 * Kept deliberately small: every live tile decodes a multi-megabyte animated
 * GIF, so a handful on screen at once is already the difference between a
 * smooth page and a janky one. The composition is unchanged — the remaining
 * tiles render as identically sized branded placeholders.
 */
export const MARQUEE_MAX_MOUNTED = 4;
export const MARQUEE_LOAD_BUDGET = 5;

/** Readable label rendered on each tile (and used as its placeholder text). */
export const marqueeLabel = (src: string): string =>
  src
    .split('/')
    .pop()
    ?.replace('hero-', '')
    .replace('-preview', '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') ?? 'Preview';
