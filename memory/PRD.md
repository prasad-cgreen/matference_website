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

## Round 7 Fixes (2026-07-10) — VERIFIED (iteration_8, frontend 100%)
- 4-lane data river (two complement pairs, wider body: bodyWidth 54 / laneWidth 80).
- Section 3 captions now reveal strictly when the river reaches the logo (logo center ≤ 45% vh), sequential at 160ms.
- Decoded captions enlarged to 17px / font-weight 800.
- Hero & Bharat orbit circles enlarged to 340px (OrbitRings offsets tightened: rInner +70, rOuter +120).
- Static Hero pulse-ring background added (data-testid=hero-pulse-bg): concentric rings, horizontal beam, center glow, sparkles.

## Round 9-11 (2026-07-11)
- Pulse-ring in Hero: replaced coded version with supplied raster image, positioned so the glow core sits below the "W" of "Where" on line 1 (percentage-based layer, tracks headline). Hero bg set to #F7F8FB.
- Vision/Mission: heading "VISION AND MISSION", bg #fff236 with glassy sheen, cards opaque navy; Our Services cards brighter blue, yellow icon chips w/ navy glyph, yellow headings, white body.
- Round 11: swapped urban & rural circle illustrations to supplied raster PNGs (urban-scene.png / rural-scene.png). Updated GlobalRiver rural entry→~12 o'clock, exit→~7:30 to match new image's river; urban entry (6 o'clock) unchanged.

## Round 16 (2026-07-15) — VERIFIED (contact form: iteration_9 backend+frontend 100%)
- **Fixed blocker**: page was crashing/blank — `DataRiverOverlay` had been refactored to require props but `CGreenLanding` rendered it with none. Restored River 1 config.
- `DataRiverOverlay` is now a fully reusable, prop-driven component (src, imgW/imgH, blue/purple focal points, srcSel/dstSel, srcAnchor/dstAnchor, onArrive).
- Single shared `river-wrap` (isolate) now spans Hero + BharatProblem + ScalingWithPurpose so both rivers share one coordinate space (nav-stacking fix preserved).
- **River 1** (Urban→Rural): `river-stream-v3.png`, unchanged behavior.
- **River 2** (Rural→Logo): NEW `river_asset_rural_to_logo.png`. Source tip focal {0.02,0.17}, dest tip {0.97,0.81}. Rural exit ~4:30 o'clock (underlapping), logo entry at left edge (underlapping). Scroll-scrubbed reveal (freezes on stop).
- Logo glow + code-condensation caption reveal in `ScalingWithPurpose.jsx` now fires on River 2 arrival (window `river-logo-arrived` event at scroll progress ≥0.92); old generic scroll-into-view trigger deleted.

## Round 17 (2026-07-16) — VERIFIED visually (frontend-only animation changes)
- **Rivers reverted to continuous autoplay** (both segments): removed ALL scroll-tied clip-path/mask reveal from `DataRiverOverlay`. Full river image shows immediately; highlight sweep + particles + endpoint glows loop continuously; scroll now only toggles play/pause based on whether each river's own vertical span is in the viewport. River 2's logo caption/glow trigger (`river-logo-arrived`) now fires when River 2 enters view.
- **Urban interior glow**: added `centerGlow` prop to `OrbitRings`; HeroSection renders a pulsing blue-white radial glow (~46%/67%) inside the urban circle at the river origin, above the artwork, clipped to the circle. (Note: sits above the artwork AND the underlapping river, since the circle renders above the river by design — visual "emerging from the city" goal met; placeholder-quality default, revisit if a reference is supplied.)
- **Wider rural→logo start**: warped `river_asset_rural_to_logo.png` in place (numpy column-wise vertical scale, factor 1.7 at the rural-exit end tapering to 1.0 by ~30% length). Logo end unchanged.

## Round 18 (2026-07-16) — VERIFIED visually (frontend-only)
- **Urban flare repositioned**: deleted the in-circle `centerGlow` (was clipped by the circle's `overflow-hidden`) and replaced it with an `edgeGlow` prop on `OrbitRings` that renders the pulsing blue-white flare ON the circle's bottom-left edge (ox -0.98, oy 0.21), blooming across the boundary above the circle — matching the reference where the river breaks through.
- **River 2 highlight direction fixed**: the traveling highlight swept right→left in image space; since River 2's source (blue) is on the image's left, that ran logo→rural (backward). Added `flowReverse` prop (highlight `animationDirection: reverse`), set on River 2 only, so the highlight now flows rural→logo. Particles already traveled rural→logo (path Tu→Tr) and were left unchanged. River 1 untouched.

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
