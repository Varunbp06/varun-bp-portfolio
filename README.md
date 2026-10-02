# Varun B P — Portfolio

Cinematic single-page developer portfolio for **Varun B P** — Software Engineer,
Full Stack Developer and AI Developer. Dark editorial design system with a
magnetic portrait, a scroll-driven preview reel, sticky-stacking project cards
and honest, source-verified content.

**Live:** <https://varunbp-portfolio.vercel.app/>

## Stack

- Vite 5 + React 18 + **TypeScript** (strict)
- Tailwind CSS 3 (Kanit typography, `#0C0C0C` ink base)
- Framer Motion for all motion — no WebGL, no second animation library
- Vercel serverless function (`api/contact.js`) with Resend for the contact form

## Getting started

```bash
npm install
npm run dev         # http://localhost:5173
npm run typecheck   # tsc --noEmit
npm run build       # production build -> dist/
npm run preview     # serve the build
node qa-check.mjs   # headless-Chrome QA (see below)
```

For the QA script, start preview with an explicit host so Chrome can reach it:

```bash
npm run preview -- --port 4175 --strictPort --host 127.0.0.1
node qa-check.mjs
```

The script asserts section anchors, link hygiene, the resume asset, the sticky
project stack, the marquee media budget, ⌘K palette, mobile menu, responsive
overflow at nine widths, reduced-motion parity and a clean console.

## Content

All copy and links live in `src/data/` (`projects.ts`, `certifications.ts`,
`education.ts`, `skills.ts`, `achievements.ts`, `capabilities.ts`, `profile.ts`)
and are typed by `src/data/types.ts`. Nothing is hardcoded in a component.

Content is traceable to the resume (`public/Varun BP Engg Resume.pdf`) and to
Varun's own repositories and deployments. Credentials are labelled honestly:
**earned** (document in hand, shown and downloadable), **completed**
(resume-verified course, linked to the issuer's official page) and **next up**
(preview of a program not yet earned). No metric, client, credential or URL on
this site is invented.

## Environment variables

See `.env.example`. `VITE_WEB3FORMS_KEY` (Web3Forms contact form, client-side)
and `RESEND_API_KEY` (the `/api/contact` serverless backup) are read from the
environment and are never committed.

The contact form posts to Web3Forms first — the same delivery method the
earlier portfolio used — and falls back to `/api/contact` when the key is not
present. If both are unavailable it shows an inline error with the email
address rather than opening the visitor's mail client.

## Deployment

Pushing to `main` deploys to the existing Vercel project — the production URL
above never changes.

See `AGENTS.md` for the architecture, conventions and performance contracts.
