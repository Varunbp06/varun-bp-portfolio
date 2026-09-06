# Varun B P — Portfolio · Agent Guide

Context for any future coding agent (or human) working on this portfolio.
Keep this file updated when architecture or conventions change.

## Project at a glance

- **Stack:** Vite + React 18 (JSX) + Tailwind CSS 3 + Framer Motion + Three.js (React Three Fiber / drei).
- **Entry:** `src/main.jsx` → `src/App.jsx` (Header, FloatingThemeToggle, Home with preloader).
- **Single page, anchor sections:** `#home` (hero) → `#about` → `#projects` → `#skills` → `#education` → `#contact`.
- **Content lives in one file:** `src/data.js` (profile, stats, skills, sTierProjects, aTierProjects, education, certifications, languages, typewriterRoles).

## Source-of-truth rule

All personal content (name, title, projects, descriptions, links, education,
certifications, contact) comes from **the E-drive resume** (`E:\Varun_B_P_Resume.pdf`,
copied byte-for-byte to `public/Varun BP Engg Resume.pdf`). Never invent facts, links,
repos, or credentials. When adding a claim, it must be traceable to the E-drive resume or
to a verified live URL/repo owned by Varun (`github.com/Varunbp06`, Vercel deploys).

## Commands

```bash
npm run dev       # dev server (localhost:5173)
npm run build     # production build -> dist/
npm run preview   # serve dist locally (default :4173)
node audit-ui.mjs # headless-Chrome UI audit (requires `npm run preview -- --port 4175` running)
```

The audit (`audit-ui.mjs`) opens the site at `http://127.0.0.1:4175/`, clicks nav,
switches the Projects/Certifications tabs, opens modals, and asserts: all 5 nav
anchors work, the 15 credential cards render (5 earned + 4 resume-verified
completed + 6 honest "available to earn" programs), filters work, certificate vs open-program modals
show status-appropriate content (real cert modal shows recipient/date/course +
download controls; open-program modal shows a Verify/Open CTA to the issuer),
the navbar hides behind modals, Escape closes modals, the flagship spotlight is
present, and the console is free of errors. Run it after any change that
touches those flows. (Note: `a[download]`/programmatic downloads
are canceled inside headless Chrome — verify the PNG-export path by code review,
not by watching files land.)

## Architecture notes

- **Navbar hiding is a stack, not a boolean.** `NavbarContext` keeps a
  `hideCount`; modals call `hideNavbar()` on mount and `showNavbar()` on unmount
  (balanced), and `hideNavbar`/`showNavbar` are `useCallback`-memoized. Never
  change it to a plain boolean — two open modals would fight and re-show the
  navbar over the other (a past bug).
- **Header hit-testing:** the fixed header wrapper is `pointer-events-none`, so
  the `<header>` element itself MUST carry `pointer-events-auto` — without it,
  desktop nav links silently ignore real mouse/touch clicks (synthetic
  `el.click()` in CDP still fires, which masks the bug; always verify nav with
  real `Input.dispatchMouseEvent` clicks).
- **Modals are portalled + measured.** `CertificateModal` and
  `ProjectDetailModal` render via `createPortal(..., document.body)` — never
  rely on nested fixed positioning (an ancestor transform/filter/backdrop
  silently re-anchors `fixed` overlays and crops content). The earned
  certificate uses `EarnedDoc`: it reads the SVG viewBox ratio, measures the
  real viewport space below the viewer, and sizes the sheet in pixels so the
  whole document is visible on open (zoom controls grow it with native pan).
- **Tiers:** `sTierProjects` = top 3 production platforms (Aurelia AI is
  `flagship: true` and featured in the flagship spotlight banner + S-tier row +
  detail modal). Each S-tier entry carries a `flow[]` pipeline rendered by
  `FlowStrip` in the flagship spotlight and the detail modal — steps must be
  traceable to the project description, never invented metrics. `aTierProjects`
  = college builds; do not invent repos/links for
  them — modals already state "repo not yet made public".
- **Certifications:** `src/components/certs/CertificatesGallery.jsx` renders two
  visually separate sections: "My credentials" (5 earned + 4 completed dossier
  cards in a 1/2/3-col grid) and "Recommended to earn" (6 open programs as
  dashed, non-document `RecommendRow` list rows — never confusable with real
  credentials). Three visually distinct states — gold-framed EARNED (real HF cert, cyan COMPLETED (labelled
  representation, "CERTIFICATE IMAGE UNAVAILABLE · RESUME-VERIFIED", evidence
  button → resume PDF), slate AVAILABLE ("PREVIEW — NOT EARNED"). `kind:
  'certificate'` renders the real Hugging Face cert (`HuggingFaceCertificateSvg`
  in `CertificateArt.jsx`, issued 2026-07-06) whose gradient ids are
  `useId`-namespaced (safe when card + modal are mounted together). Each
  `kind: 'certificate'` entry also has `asset` pointing at its standalone copy
  in `public/certificates/` — keep that static SVG in sync with
  `CertificateArt.jsx`. `downloadSvgNodeAsPng()` rasterizes the live SVG to a
  hi-res PNG client-side (with raw-SVG fallback). `kind: 'credential'` entries
  render the premium `CredentialCover` concept preview (document frame + corner
  ticks, provider badge, title, topics, level, solid state band — never a fake
  issued document) and link to the issuer's official course page (`verifyUrl`
  for completed, `learnUrl` for open) — do not re-issue or fabricate
  third-party documents. Every entry carries `topics[]` plus verified program
  facts (`credentialType/cost/certIssued/requirements`, researched Sep 2026)
  shown in the modal facts table, and a truthful credibility checklist built by
  `credibilityFor()` — only true attributes, never scores. Each dossier card has
  a valid-HTML action footer (Details / Open-or-Verify / File-download-when-earned)
  outside the preview button, with 44px targets; card text never clips
  (wrapping + min-heights, verified by a CDP clip audit). Filters are
  status + subject (`credentialFilters`: All/Earned/Completed/Available +
  4 categories) via `STATUS_FILTERS`. Cards add a cursor spotlight
  (`--spot-x/--spot-y`, hidden under reduced motion) on top of `TiltCard` tilt,
  hover document elevation, and sheen sweep.
- **GitHub asset audit (conclusive):** a recursive tree scan of Varun's repos
  (`Varunbp06/aurelia-ai`, `nexamind-ai`, `aurevia-health-ai`) found NO
  certificate files — the only certificate asset in existence is the in-hand
  Hugging Face cert replica at `public/certificates/`. So the "completed"
  credentials (DeepLearning.AI, Databricks, Microsoft, IBM) must stay as
  resume-verified links, never re-issued documents, and the "open" programs
  stay clearly labelled previews. Do not repeat this scan expecting new assets
  unless Varun uploads files.
- **Per-cert E2E:** `node cert-e2e.mjs` clicks all 12 cards individually and asserts
  each modal opens with matching title + working CTAs and closes on Escape,
  then asserts all 8 filters render exact counts (All 15 / Earned 5 /
  Completed 4 / Available 6 / LLM & Gen AI 9 / AI & ML 3 / Cloud & Data 2 /
  Cybersecurity 1) — plus desktop/mobile overflow, mobile modal, keyboard
  Enter, and zero console errors; Escape is listened on `window` (not `document`) inside
  the modal — when testing via CDP, dispatch key events on `window` and use
  real `Input.dispatchKeyEvent` sequences (rawKeyDown → char → keyUp) for
  Enter/Space button activation, since synthetic `dispatchEvent` on a `<button>`
  does not fire `onClick`.
- **3D scenes:** `src/components/three/` holds the gated scenes (HeroOrbit,
  AboutCore, SkillsCore). Add any new scene behind `SceneGate` + `React.lazy`
  exactly like the existing ones; the Skills heading area hosts `SkillsCore`.
  HeroOrbit includes a pointer-parallax `Rig` plus `Satellites` (data-node
  spheres on faint orbit paths) — keep node counts low and reuse the same
  gated/pause contract.
- **Skills tracer:** the Skills grid in `Home.jsx` renders each skill as a
  toggle button (`aria-pressed`); selecting one highlights every group that
  contains it and dims the rest. Skill names come from `src/data.js` only —
  never add proficiency scores or skills not in the data.
- **IDs & landmarks:** each page id (`#home #about #projects #skills #education
  #contact`) appears exactly once in the DOM — nested section wrappers must NOT
  re-declare ids (`<Contact/>` and `ProjectSection` omit `id`; their parents in
  `Home.jsx` own the anchors). One `<h1>` per page; header brand is a `<span>`.
  The Projects/Certifications/Tech-Stack switcher is `role="tablist"` with
  `aria-selected` tabs + labelled tabpanels.
- **3D / animation:**
  - WebGL scenes (`src/components/three/`) are lazy-loaded behind `SceneGate`
    and only run on desktop (≥1024px), with capped pixel ratio, pause when
    offscreen, and reduced-motion support — preserve this anti-lag contract when
    adding scenes.
  - `SceneGate` exports `useSceneEnabled()` (same gate logic). Layout that is
    purely decorative (e.g. the About 3D column) must reserve space via
    `useSceneEnabled()` — render the column only when on and let text span full
    width otherwise, so mobile/tablet/reduced-motion never shows dead space.
  - `TiltCard` provides pointer-based CSS 3D tilt (fine-pointer + no reduced
    motion only, rAF-throttled, no WebGL).
  - Keyframes `float-y` / `rotate360` live in `src/index.css`.
## Reusable agent capabilities (with fallbacks)

For future portfolio tasks prefer, in order:

1. **Content editing** — edit `src/data.js` only; components render from it.
   If data shape changes, update every consumer (ProjectSection, CertificatesGallery,
   Home) in the same change.
2. **Verification** — verify every external URL with `curl -sIL` before wiring
   it in; `target="_blank"` links must carry `rel="noopener noreferrer"`.
3. **Design/UX polish** — keep the dark `#060010` + cyan `#00ffdc` accent system;
   use existing Tailwind tokens/`index.css` keyframes; run `npm run build` and a
   headless-Chrome check (console errors, rendered anchors, click-through of
   tabs/modals/nav) before reporting done.
4. **Deep research / trending work** — only if the user asks for research: use
   web search + GitHub API checks (stars/license/activity) and never copy
   third-party project claims into Varun's own project entries.
5. **Skipped tooling** — Browser-Use, Agent Memory MCP, scientific/cyber skill
   bundles, RTX/plugin tooling, etc., are NOT embedded in this repo. If a future
   task lists them, treat them as optional external agent tooling: enable only
   what is genuinely usable in the current environment, and otherwise fall back
   to the built-in verification + design conventions above.

## Security reminders

- No API keys / secrets may ever live in frontend code or `data.js`. If one is
  found (e.g., in this workspace's `nemetron/nemotron.py` — a real `nvapi-…`
  key), flag it, never commit it, and recommend revocation.
- Escape all user content rendered via JSX; keep `dangerouslySetInnerHTML` out.
