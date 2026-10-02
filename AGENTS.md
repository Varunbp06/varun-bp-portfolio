# Varun B P — Portfolio · Agent Guide

Context for any future coding agent (or human) working on this portfolio.
Keep this file updated when architecture, data or conventions change.

## Project at a glance

- **Production URL:** <https://varunbp-portfolio.vercel.app/> (Vercel project
  `varunbp-portfolio`, linked via `.vercel/project.json`). The URL must not
  change — deploys go through this same project.
- **Stack:** Vite 5 + React 18 + **TypeScript** + Tailwind CSS 3 +
  Framer Motion. No WebGL / Three.js: the 3D feel is built from CSS depth,
  sticky stacking, transforms and motion (deliberate, for performance).
- **Entry:** `index.html` → `src/main.tsx` → `src/App.tsx`.
- **One page, anchored sections, in this order:** `#home` (hero) → marquee →
  `#about` → `#capabilities` → `#projects` → `#skills` → `#education` →
  `#certifications` → `#achievements` → `#contact` → footer.

## Source-of-truth rule (unchanged, and important)

All personal content — name, positioning, projects, links, education,
certifications, achievements, contact — is real and traceable to one of:

1. `public/Varun BP Engg Resume.pdf` (the E-drive resume, copied byte-for-byte),
2. Varun's own repositories / live deployments (`github.com/Varunbp06`,
   `*.vercel.app` builds owned by him),
3. the previous portfolio source (`Varunbp06/varun-portfolio`,
   `src/data/portfolioData.js`) for the earlier full-stack projects,
   education detail, certifications and achievements.

**Never invent** a metric, client, employer, credential, project, screenshot,
repository or URL. Every external link in `src/data/` was HTTP-verified; if you
add one, verify it (`curl -sIL`) first. Projects without a public repo must keep
their `repoNote` instead of a link.

## Commands

```bash
npm run dev         # dev server (localhost:5173)
npm run typecheck   # tsc --noEmit (strict, noUnusedLocals/Parameters)
npm run build       # production build -> dist/
npm run preview     # serve dist (use --port 4175 for the QA script)
node qa-check.mjs   # headless-Chrome QA against http://127.0.0.1:4175/
                    # start preview as:
                    #   npm run preview -- --port 4175 --strictPort --host 127.0.0.1
                    # (without --host, Vite may bind IPv6-only and QA sees an empty page)
```

`qa-check.mjs` drives real Chrome over CDP and asserts: the nine sections
exist, no broken in-page anchors, one `<h1>` with the real name, safe external
links, the resume file resolves, the portrait loads, three sticky project cards
with the real GitHub repos, three live demo links, the marquee media budget,
⌘K palette + Escape, nav scrolling, mobile menu open/Escape, no horizontal
overflow or clipped UI at 360/390/430/640/768/1024/1280/1440/1920, reduced-motion
content parity, and a clean console. Run it before reporting any UI change done.

## Architecture

```
src/
  App.tsx                 section composition, ⌘K shortcut, MotionConfig
  main.tsx                React root
  styles/index.css        design tokens, #0C0C0C base, Kanit, reduced-motion
  data/                   typed content (types.ts + one module per domain)
  lib/                    cn(), motion variants, hooks (active section, media query…)
  components/
    layout/               Navbar, Footer, ProgressBar, ScrollToTop, CommandPalette
    ui/                   FadeIn, Magnet, AnimatedText, Marquee, ContactButton,
                          ProjectButton, SectionHeading, SocialIcon
    sections/             Hero, About, Capabilities, Projects (+ProjectVisual),
                          Skills, Education, Certifications, Achievements, Contact
```

Content is **never** hardcoded in a component — components render from
`src/data/*` typed by `src/data/types.ts`. If a data shape changes, update
`types.ts` and every consumer in the same change.

## Design system

- Base `#0C0C0C`, text light blue-gray (`#bbccd7` family), Kanit 300–900.
- `.text-gradient-hero` = `linear-gradient(180deg,#646973,#BBCCD7)` clipped to
  text — used for the hero name and section-level display type.
- `.label-xs` = uppercase micro label; `.surface` / `.surface-hover` = card
  shell; `.ink-vignette` = ambient depth wash.
- `ContactButton` implements the specified gradient pill (magenta → violet →
  amber, inset glow, white 2px outline, wide-tracked uppercase).
- Tiles/media are 420×270 at `lg`, scaling down below that; never introduce
  fixed heights that break the aspect ratio.

## Performance contracts (do not regress)

- **No scroll position or cursor position in React state.** Scroll-driven
  effects use `useScroll` motion values, refs, and one rAF-coalesced passive
  listener. `ProgressBar`, `Magnet`, `AnimatedText` and `Marquee` all follow
  this rule.
- **Marquee:** the supplied motion GIFs are multi-megabyte files. `Marquee`
  keeps the exact two-row visual but mounts an `<img>` only for tiles inside
  the viewport window, only while the section is near the viewport, and only
  up to `MARQUEE_MAX_MOUNTED` / `MARQUEE_LOAD_BUDGET` (see `src/data/marquee.ts`).
  Everything else renders an identically sized branded tile. It also skips all
  media on `saveData` / slow connections and stops moving under reduced motion.
  Do not "simplify" this back to rendering every GIF.
- **Sticky project stack:** sticky positioning only from `lg` and only when the
  visitor has not requested reduced motion (`useMediaQuery` + `useMediaQuery`
  gate in `Projects.tsx`). Mobile is normal flow, never blocked by sticky math.
- Transform/opacity only; avoid animating `width`, `height`, `top`, `left`.
- One animation library (Framer Motion). Do not add GSAP/AOS/another scroll lib.

## Accessibility & overlays

- `MotionConfig reducedMotion="user"` in `App.tsx` neutralises transform
  animations for reduced-motion visitors; CSS additionally stops the marquee,
  float and orbit keyframes. Content is never hidden.
- Every overlay (mobile menu, command palette, project modal, credential modal)
  is portalled to `document.body`, closes on Escape, locks body scroll via
  `useBodyScrollLock`, autofocuses its close control, and returns focus to the
  previously focused element.
- Anchor targets rely on `scroll-margin-top` (see `index.css`) plus
  `scrollToSection()` — do not reintroduce brittle manual scroll offsets.
- Interactive targets must be ≥24px tall (QA flags smaller ones).

## Security

- No secrets in source. `VITE_WEB3FORMS_KEY` and `RESEND_API_KEY` come from the
  environment (see `.env.example`); `.env*` files are git-ignored.
- Contact form order: **Web3Forms** (the delivery method the earlier site
  used, active whenever `VITE_WEB3FORMS_KEY` is set) → `/api/contact` (Vercel
  function + Resend) → an inline error that names the email address. The form
  must never open the visitor's mail client on submit, and must never silently
  drop a message. A 200 that is not a real `{ ok: true }` / `{ success: true }`
  JSON body must never count as delivered.
- Keep the `botcheck` honeypot field (Web3Forms' own field name), the
  email-format validation, and `rel="noopener noreferrer"` on every external
  `target="_blank"` link.

## Deployment

`main` on `github.com/Varunbp06/varun-bp-portfolio` auto-deploys to the existing
Vercel project — same URL, no new project. Build command `npm run build`, output
`dist`, and `api/contact.js` as a serverless function. Do not add a
`vercel.json` rewrite that breaks the SPA fallback or the API route.
