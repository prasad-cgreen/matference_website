# cGreen Website — PRD

## Original Problem Statement
Build the cGreen marketing landing page per a detailed, authoritative spec: a single-page,
animation-heavy site for an AI-powered rural debt-resolution network ("Where rural truth meets
resolution"). Locked design system (Navy #142984, Yellow #FCDD15, Cream #FFFCFA), glassmorphism
"glass recipe", Montserrat Extra Bold headings + Inter Tight Light body. Nine content sections
plus footer, three distinct scroll path animations, orbit rings, count-up stats, a logo-glow
reveal sequence, service toggle tabs, and a contact form (CRM target flagged undecided → stub).

## User Choices
- Full-fidelity animations (desktop-focused).
- Illustrations built as coded SVG scenes (Urban + Rural).
- Team/partner/lender assets = placeholders (real assets to be provided later).
- Contact form: save to MongoDB + stubbed (no real CRM).

## Architecture
- **Frontend**: React 19 (CRA + craco), TailwindCSS, shadcn/ui, framer-motion, lucide-react, sonner.
  - `pages/CGreenLanding.jsx` composes all sections.
  - `components/site/`: Navbar, OrbitRings (reusable, opposite-spin rings + permanent staggered caption reveal + slowdown), DataRiver (scroll-tied two-lane bit-complement 0/1 river with blurred outline + mask reveal, reversible).
  - `illustrations/`: UrbanScene.jsx, RuralScene.jsx (flat-vector coded SVG).
  - `sections/`: HeroSection, BharatProblem, ScalingWithPurpose (count-up + logo glow/lines/9-caption sequence with fast-scroll fallback + permanence), PlatformVisionMission (yellow bg, navy glass Vision/Mission, blue-grey branching circuit, purple-gradient empty 16:9 video placeholder), OurServices (Pragati/Lending toggle tabs), OurTeam, PartnersInImpact, Lenders (marquee), ContactUs, Footer.
  - `data/site.js`: all copy/content. `hooks/`: useCountUp, useResponsive.
- **Backend**: FastAPI + Motor/MongoDB. Routes: `GET /api/`, `POST /api/status`, `GET /api/status`,
  `POST /api/contact` (persists lead), `GET /api/contact` (list leads).
- Env: MONGO_URL, DB_NAME (backend); REACT_APP_BACKEND_URL (frontend). No hardcoding.

## User Personas
- Pragati Kendra franchisee prospects (want to become certified & earn via financial services).
- Lending institutions (want higher repayment / lower NPAs).
- Investors / partners / media.

## Core Requirements (static)
- Locked palette, glass recipe, typography applied globally.
- Persistent glass pill nav with dropdowns, Login (external) + Book a Demo (scroll to Contact).
- Three distinct path animations kept separate; captions "permanent once revealed".
- Contact form UI + validation; submit is a clearly-marked stub (→ MongoDB).
- Mobile: static/simplified fallback (content preserved, animations dropped).

## Implemented (2026-07-07)
- Full site MVP: all 9 sections + footer, navbar w/ dropdowns & CTAs, both SVG illustrations,
  orbit rings, scroll-tied data rivers, count-up stats, logo glow/lines/captions reveal (permanent
  + fast-scroll snap fallback), branching circuit, service toggle tabs, contact form → backend.
- Transparent + white cGreen logos generated and wired.
- Backend contact persistence. Verified: testing_agent iteration_1 → backend 100%, frontend 100%,
  zero console errors.

## Backlog / Remaining
- **P1**: Wire contact form to real CRM/endpoint once provided (currently DB stub, FLAGGED-UNDECIDED).
- **P1**: Replace placeholders with real team photos, LinkedIn links, partner & lender logos.
- **P2**: Real platform video in the purple video placeholder.
- **P2**: Terms & Conditions / Privacy Policy pages (footer links are `#`).
- **P2**: Mobile-specific animation spec (currently static fallback per spec flag).
- **P2**: Fine-tune river weaving geometry / morph transitions across section boundaries.

## Next Tasks
1. Collect CRM endpoint + real assets from client.
2. Implement Terms/Privacy pages.
3. Polish desktop animation timing & river continuity if requested.
