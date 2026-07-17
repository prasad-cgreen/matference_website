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
- **Urban flare repositioned**: deleted the in-circle `centerGlow` (was clipped by the circle's `overflow-hidden`) and replaced it with an `edgeGlow` prop on `OrbitRings` that renders the pulsing blue-white flare ON the circle's bottom-left edge at ~7:30 o'clock (`angleDeg` 128, computed as center + radius·cos/sin from the live circle box so it can't drift), blooming across the boundary above the circle — at the point where the river breaks through.
- **River 2 highlight direction fixed**: the traveling highlight swept right→left in image space; since River 2's source (blue) is on the image's left, that ran logo→rural (backward). Added `flowReverse` prop (highlight `animationDirection: reverse`), set on River 2 only, so the highlight now flows rural→logo. Particles already traveled rural→logo (path Tu→Tr) and were left unchanged. River 1 untouched.

## Round 19 (2026-07-16) — VERIFIED visually
- Removed the urban circle edge-glow entirely (per request).
- **Static "ECOSYSTEM FACTORS" lists** added beneath both circles via a new reusable `components/site/EcosystemFactors.jsx` (exports `URBAN_FACTORS` / `RURAL_FACTORS` with canonical lucide line-icons). Small-caps letter-spaced header flanked by divider lines; wrapping grid of outlined pill chips (icon + label), always visible. Urban = navy scheme / 9 factors; rural = yellow scheme / 6 factors. Orbiting pills and rivers left untouched (coexist beneath the circle).

## Round 22 (2026-07-16) — VERIFIED (desktop hover + keyboard)
- Converted the always-visible orbit pills into a **hover-reveal constellation** (rewrote `OrbitRings`; removed the old pill/reveal/`CaptionPill`-orbit implementation and unused `onAllRevealed`).
  - Rest: dim (~0.3) glowing dots on two orbit rings, staggered twinkle; no labels. Rings slowly rotate on desktop, static on mobile.
  - Reveal: mouse proximity (~36px, rAF distance check), keyboard focus, or tap → dot brightens + scales 1.5×, a connector line + glass tooltip (navy urban / yellow rural) slides in on the outward side (200–300ms). Exit fades out.
  - Multiple simultaneous reveals supported (union of proximity + focus + tap sets). Mobile tap toggles; background tap clears. Dots are focusable `<button>`s; Enter/Space toggles. Reduced-motion disables twinkle.
- Constellation CSS lives in `index.css` (`.orbit-dot*`, `@keyframes dot-twinkle`). Static "Ecosystem Factors" lists and both rivers untouched.
- **Round 21 note**: dots are tiny and the two rings sit comfortably in the band between the circle edge and the column, with no overlap — the circle-shrink of Round 21 appears **unnecessary**.

## Round 20+21 (2026-07-16) — VERIFIED (desktop)
- **Circle shrink to fit list in-viewport (Round 21 done, not skipped)**: reduced urban & rural circle diameter 401→300 (desktop), tightened orbit band (`maxWidth diameter+150`), reduced hero padding (`pt-24 pb-12`) and factor-list top margin (`mt-6`). At 1440×900 the full Ecosystem Factors list bottom = 782 ≤ 900 → circle + complete list visible with no scroll (more headroom at 1920×1080).
- **Bidirectional dot↔chip sync (Round 20)**: each section holds `dotActive`/`chipActive`; `active = chipActive || dotActive` drives both. `OrbitRings` gained `onActive` (reports its single primary locally-active factor) and `forcedActive` (a hovered chip forces its dot to reveal). `EcosystemFactors` chips are now buttons with `activeLabel` + `onHover`; the active chip inverts to a solid fill (navy+white urban / yellow+navy rural). Hovering/focusing/tapping either side highlights the pair; exit reverts both together; exactly one pair active at a time. Verified both directions + revert.

## Round 23 (2026-07-17) — VERIFIED (desktop)
- Tightened the factor list's top margin (`mt-6`→`mt-3`, header `mb-2.5`) so it sits closer to each circle without overlapping the lowest orbit dots (both sections).
- Renamed headers via theme: urban → "ECOSYSTEM ADVANTAGES", rural → "ECOSYSTEM DISADVANTAGES".
- Added a single shared, synced explanation line between the header and chip grid (`{testid}-desc`, `aria-live=polite`, fixed min-height to avoid layout jump). Neutral placeholder at rest; shows the active factor's bespoke one-liner (from per-factor `desc` in `URBAN_FACTORS`/`RURAL_FACTORS`) driven by the same `activeLabel`, appearing/clearing exactly in sync with the highlight. Urban list still fits in-viewport at 1440×900 (bottom 799 ≤ 900).

## Round 24 (2026-07-17) — VERIFIED
- Bolded the shared factor description (`font-bold`, 700) and wrapped it in a per-section pill: urban = `glass glass-yellow` (matches hero tagline pill) with navy #142984 text; rural = navy tint `rgba(20,41,132,0.15)` + glass blur/border with yellow #FCDD15 text. px-5 py-2.5 rounded-full, applied to both placeholder + active states, both sections.

## Round 25 (2026-07-17) — VERIFIED
- Fixed low-contrast rural description pill: replaced the faint `glass` + `rgba(20,41,132,0.15)` fill with a **solid navy** pill (`rgba(20,41,132,0.92)` + navy border, no glass overlay) keeping bold yellow #FCDD15 text. Now reads as a clearly solid navy pill (same weight as active chips). Urban yellow pill unchanged.

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
