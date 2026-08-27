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

## Round 26 (2026-07-17) — VERIFIED
- Rural description pill now uses the site's standard glass recipe: `glass glass-navy` (rgba(20,41,132,0.38) + backdrop blur(18px) + border + specular), text changed yellow → white. Reads as genuine translucent glass (blurred backdrop visible), legible. Urban yellow pill unchanged.

## Round 27 (2026-07-17) — VERIFIED
- Fully rebuilt the Vision & Mission section (`PlatformVisionMission.jsx`) to the approved reference: cream→gold gradient bg; centered navy header with line–dot–line divider; staggered cascade (navy VISION card upper-left larger + yellow MISSION card lower-right smaller, overlapping stair-step); inverted card colors; outlined circular icon badges (lucide `Eye` yellow / `Target` navy) beside headings; yellow elbow SVG connector with end nodes linking Vision→Mission; flat matte cards, rounded-[28px], soft shadows. Copy unchanged. Platform subsection untouched.

## Round 28 (2026-07-17) — VERIFIED
- Merged "Our Services" into the cGreen logo section (`ScalingWithPurpose.jsx`). Left column: removed the stats box + "SCALING WITH PURPOSE" heading; heading changed OUR SOLUTION→OUR SERVICES (kept "THE CGREEN APPROACH"); moved in the services intro, the two tab toggles (same `cgreen:services-tab` behavior), and the 3 active-tab cards restacked as a single vertical column. Service cards now use glass fill `rgba(20,41,132,0.45)` + standard glass recipe (blur/border/specular). Right column (logo hub + binary captions) unchanged.
- Deleted the standalone `OurServices.jsx` section entirely and removed it from `CGreenLanding.jsx` (no duplicate, no gap).

## Round 29 (2026-07-17) — VERIFIED
Within the merged services column (`ScalingWithPurpose.jsx`):
1. Eyebrow label → pill badge using the inactive-tab glass fill (`glass glass-navy`), white text (no underline).
2. 3 cards → one-at-a-time carousel: prev/next chevron buttons + dot indicator + "n of 3"; switching tabs resets to card 1.
3. "For Lending Institutions" tab: inactive text now yellow #FCDD15 (active stays navy on yellow fill).
4. Card text split: icon + heading stay yellow, eyebrow label white (in badge). Applied to both tab views.

## Round 30 (2026-07-17) — VERIFIED
- Replaced the binary "code condensation" logo labels with an icon + circuit-trace style. New `components/site/LogoFeatureIcons.jsx` provides 9 distinct gold line-art icons (gear+chip, gear+people, chip+check, bank+smile, pin+dots, mic+waves, gear+person, water-tower+house+gear, chip+wifi). In `ScalingWithPurpose.jsx` each node renders the icon + bold monospace navy label beneath, at the same 9 relative positions; navy right-angle PCB traces with hollow nodes connect each icon toward the logo (shared corridors near center = branching network). Central white logo capsule, purple data-stream, and background unchanged. Removed the old `CodeLabel`/`randBits` treatment.

## Round 31 (2026-07-17) — VERIFIED
- Rebuilt the 9 logo connector traces (`traceOf` in `ScalingWithPurpose.jsx`): each icon now routes via a short stub + 2 right-angle bends to its OWN distinct endpoint on the logo capsule edge (per-trace lane offset prevents collapse/shared spine), with 3 hollow nodes each (icon end + 2 bends). Strictly horizontal/vertical segments — the Intent & Ability diagonal is corrected. Line color/weight, icons, logo, background unchanged.

## Round 33 (2026-07-20) — VERIFIED
- Deleted the central white pill, the plain `/cgreen-logo.png` inside it, and all 9 navy connector traces from `ScalingWithPurpose.jsx` (removed from code — `traceOf` + trace SVG gone; `/cgreen-logo.png` now only in Navbar).
- Inserted `brain-logo-composite.png` (transparent, native 666×375, aspect preserved, ~480px wide) in the same central position, in a boxless transparent container. Kept the `solution-logo-hub` testid on it so River 2 still anchors/glows here.
- Widened icon radius (236→258) so the 9 icons keep even spacing around the larger composite. Icons intentionally have NO connector lines now (accepted temporary state per spec).

## Round 34 (2026-06) — VERIFIED
- Enlarged `brain-logo-composite.png` from 480px → 560px wide in `ScalingWithPurpose.jsx`.
- Reshaped the 9 feature icons from a circle into a horizontal pill/capsule: replaced single `iconR=258` with independent `radiusX=300` and `radiusY=182` (~0.7 vertical squash), so top/bottom icons sit closer to center while sides keep a slightly wider spread. Container `SIZE` bumped 600→680; bloom halo 420→520px. Connector lines remain off per Round 33.

## Round 36 (2026-06) — VERIFIED
- **Logo locked at 600px** (`w-[600px] max-w-none`; note: Tailwind Preflight `img{max-width:100%}` + prior `max-w-full` had been clamping it — `max-w-none` is required for the width to apply).
- **Icon overlaps fixed** via per-icon `OFFSETS` in `ScalingWithPurpose.jsx` (base radiusX=295/radiusY=190, canvas SIZE=740, label width 140): Financial Inclusion dx+60, Customer Place Verification dx+75/dy+35, Voice Transcription dx-45. Other 6 icons unchanged.
- **River 2 anchor**: `dstAnchor` in `CGreenLanding.jsx` changed to `x: D.x - D.R*1.15` so the purple end tucks behind the logo's left side (underlap; logo z-10 over river z-5).
- **Tabs**: grid changed to `lg:grid-cols-[minmax(0,470px)_1fr]`; tab row `flex flex-wrap lg:flex-nowrap`, buttons `whitespace-nowrap shrink-0` → both tabs on one line, full width restored.

## Round 37 (2026-06) — VERIFIED
- New section `sections/OurReach.jsx` inserted in `CGreenLanding.jsx` between `PlatformVisionMission` and `OurTeam` (`id="reach"`, cream bg).
- Two columns: left = "OUR REACH" heading (font-head navy, matches OUR SERVICES) + "OUR FOOTPRINT IN ACTION" pill (exact urban-pill CSS: `glass glass-yellow text-[#142984]`) + 4 stacked stat pills (exact rural-pill CSS `glass glass-navy`, white number+label): 10+ Lenders / 3 States / 35 Districts / 957K+ Villages.
- Right = India network map. Downloaded artifact had a baked-in transparency checkerboard (RGB); cleaned to true alpha via border-flood-fill (scipy ndimage.label) preserving interior star-nodes → `/india-reach-map.png` (1254×1254 RGBA).
- Three live-coded `#FCDD15` radial glows (reusing `@keyframes river-glow-pulse`) at % coords: UP 51.5%/31.5%, Maharashtra 32.5%/57%, Assam 82.3%/37.2% — verified in-state via marker overlay (UP was nudged east from the initial 43.9%/34.3% estimate).

## Round 38 (2026-06) — VERIFIED
- Our Reach map width set to exactly 590px (opacity 0.75 on the image only; glows stay full intensity).
- New `@keyframes reach-glow-pulse` (floor raised to scale 1.05, max 1.15 unchanged, 2.4s) for the 3 state glows; positions are % so they auto-scaled correctly after resize (UP/Maharashtra/Assam still in-state).
- Four stat boxes: pills → `rounded-[28px]` rectangles (matches Vision/Mission cards), width fixed 224px, number stacked over label, both `font-head text-3xl lg:text-4xl` white, centered. Verified no text overflow at 224px.

## Round 39 (2026-06) — VERIFIED
- Our Reach: column ratio 50/50 → 40/60 (`lg:grid-cols-[2fr_3fr]`); map now `w-full` filling its column (~706px at 1440), aspect preserved, glows (%) scaled with it and stay in-state.
- Stat boxes: fixed 224px → `w-full` (470px, matches text column), content centered; label font reduced to `text-sm lg:text-base` (~44% of number) so all four boxes + full map fit within 1440×900 without scroll.

## Round 41 (2026-06) — VERIFIED
- Replaced Our Reach map: deleted `india-reach-map.png` (file + code) and its old glows; inserted `india-reach-map-v2.png` (transparent RGBA 666×375, landscape, baked-in dots+labels for MH/UP/AS).
- Map width = column width (706px, `w-full`), opacity 0.9, grid `items-start` + `lg:mt-[40px]` so the map's visible top tip aligns exactly with the "OUR FOOTPRINT IN ACTION" pill top (Δ0). Bottom tip is ~197px above the last stat box — aspect-ratio limited (landscape map can't span the 552px left column at fixed width without stretching); top alignment prioritized per spec.
- Three live-coded `reach-glow-pulse` yellow glows at % coords MH 33.3/55.4, UP 50.8/28.6, AS 74.6/34.5; base 48px (min ~50px visible). Verified each sits directly on its baked-in dot — no individual nudge needed.

## Round 42 (2026-06) — VERIFIED
- Added gold line-art icons (site feature-icon style, #D4A017 stroke-2 48vb) left of each stat box's number/label: Lenders=bank (reused `Financial Inclusion`), States=pin (reused `Customer Place Verification`), Districts=new `Buildings`, Villages=new `House`. Box row = icon + centered number/label column.
- Map height increased to span pill-top → Villages-box-bottom (topDelta 0, botDelta 1), aspect preserved. Solved the landscape-aspect conflict by cropping the transparent padding: `india-reach-map-v2.png` (666×375, 1.78:1) → `india-reach-map-v3.png` (395×338, 1.17:1). Rendered at `lg:w-[645px]` (< 706 column, so no column-widening), `lg:mt-[56px]`.
- Glow % recomputed for the cropped image: MH 18.93/57.03, UP 48.44/27.29, AS 88.57/33.84; verified each still on its baked dot.

## Round 43 (2026-06) — VERIFIED
- Replaced stat-box icons with the new yellow (#FCDD15) line-art set drawn locally in OurReach: PeopleGroup→Lenders, MapPin→States, Buildings→Districts, Houses→Villages (removed FEATURE_ICONS import / gold set). Size 42px, consistent.
- Icon+number+label centered as one group (`flex items-center justify-center`) — verified equal left/right gaps on all four boxes.

## Round 44 (2026-06) — VERIFIED
- New `sections/PlatformDiagram.jsx` rendered under the PLATFORM heading in `PlatformVisionMission.jsx` (video placeholder kept below).
- Concentric SVG circles (outer dashed boundary r293 + inner hub r172) centered at (47.2%,45.55%); hub = cgreen-logo + "Empower. Enrich. Enable." No hub↔node connectors.
- Six capability nodes on a CSS square ring (`.plat-ring`, 20s linear) revolving continuously; each node counter-rotates (`.plat-upright`) to stay upright while its icon re-rotates (`.plat-icon`) to follow the curve. Glass-navy circles + labels + hover tooltip. Orbit never pauses (pure CSS). Hover uses native hit-testing on transformed elements.
- Left Data Sources panel (glass) w/ 3 cards + navy SVG connectors to hub; ambient chasing glow via `@property --plat-ang` conic-gradient border mask; Lender Data highlights yellow on hover only + its connector brightens.
- Right Omni-Channel Sub Channels panel (glass, ambient glow); hovering the Omni-Channel Outreach node pulses this panel yellow (`.plat-panel-hot`) via shared React state; no literal connector to the moving node.
- CSS added to index.css: plat-orbit-spin/counter/icon, plat-ambient (+@property), plat-panel-pulse; reduced-motion disables them.
- Note: Playwright can't hover a continuously-animating node ("element not stable"); verified Omni→panel + tooltip via synthetic mouseover event.

## Round 45 (2026-06) — VERIFIED
- Platform diagram fixes: each of the 6 side-panel cards now owns its own hover state in `SidePanelCard` (useState) → only the hovered card turns yellow; Lender Data also brightens its hub connector. Root-cause fix: spinning ring square corners were intercepting panel hovers → set `.plat-ring` container `pointer-events-none` and node wrappers `pointer-events-auto`.
- Right "Omni-Channel Sub Channels" panel repositioned to mirror Data Sources (top 16.3%, height 48.9%).
- Removed the leftover video placeholder box from `PlatformVisionMission.jsx`.
- Both panels given a static (non-animated) 1.5px #FCDD15 border, in addition to the existing ambient chasing glow.

## Round 46 (2026-06) — VERIFIED
- Omni-Channel Sub Channels panel now vertically centered on the hub: top 16.3%→21.1% (height 48.9% → center = 45.55% = hub CY). Verified panel-center vs hub-center delta = 0; Data Sources untouched (top 16.3%).
- Root-cause fix: `.plat-ambient` (defined after Tailwind utilities) set `position:relative`, overriding the `absolute` utility → both panels were in normal flow, so % `top` never resolved against the container. Added inline `position:"absolute"` to both panels (inline beats class).

## Round 47 (2026-06) — VERIFIED
- Added right-side connector in PlatformDiagram SVG: `M 886 482 H 1173` (hub right edge → Omni-Channel Sub Channels panel left edge, at shared center y=482), with matching endpoint dots.
- Restyled both left & right connectors with a faint metallic-blue sheen: `linearGradient #metalBlue` (navy→#A9C3F4 highlight→navy, userSpaceOnUse across the connector span) at group `opacity 0.6`, replacing flat #142984. Endpoint dots → #3A5BBF @0.6. Lender Data connector keeps its yellow-on-hover (full opacity).

## Round 48 (2026-06) — VERIFIED
- New `sections/AICommandCenter.jsx` inserted between OurReach and OurTeam (`#ai-command-center`). Static "Coming Soon" AI dashboard, Lending Institution tab content only.
- Cream section w/ "COMING SOON" header + subtitle; bordered dark-navy container (yellow border) holding: header ("AI COMMAND CENTER" + tagline + yellow COMING SOON badge); left sidebar 3 persona tabs (Lending Institution active=yellow, other two inactive/no logic); flat AI Risk Score gauge (SVG, 72%/Low Risk, tri-color legend dots, no 3D); Live Voice AI panel (live dot, call timer, 5 transcript lines w/ sentiment tags, waveform bars, "Sentiment: At Risk" footer); 3 alert cards; 4 bottom stat cards.
- Static only — Rounds 49/50 will add tab switching + live behavior.

## Round 49 (2026-06) — VERIFIED
- AICommandCenter refactored to a `DATA` map keyed by persona + `useState` active tab (default lending-institution). Clicking any sidebar tab highlights it yellow, deactivates others, and swaps gauge / live panel / alerts / bottom stats.
- Pragati Kendra: Franchise Health 88%/Excellent, Live Field Activity feed, franchise alerts, village stats, "collections by village" bar chart.
- Internal Ops: Team Efficiency 91%/High, Live Agent Queue, ops alerts, agent stats, "call volume by hour" bar chart.
- New generic `BarChart` (navy/yellow) infographic for both new tabs; Lending keeps waveform + Sentiment footer. TagPill extended (Positive/Active green, At Risk amber, Follow-up Needed blue). All illustrative preview data.

## Round 50 (2026-06) — VERIFIED (screenshot)
- AICommandCenter live-feel animations. Dashboard content extracted into `<DashboardBody key={active} />` so switching tabs forces a full remount → all animations restart from scratch.
- `useCountUp` RAF hook (ease-out cubic): gauge counts 0→pct with arc filling in sync; stat cards count 0→target via `AnimatedStatValue` (preserves ₹/%/commas/decimals via regex, en-IN formatting).
- `useLiveFeed` hook reveals live-panel rows one-by-one every 2.2s then loops from empty; each row uses `.ai-line-in` entrance.
- Alert cards: `.ai-alert-pulse` breathing glow (staggered delay, `--pulse-color` per alert) + `.ai-hover-card` lift/yellow-glow. Stat cards also `.ai-hover-card`.
- Bar charts grow in with `.ai-bar-grow` (staggered). CSS keyframes in index.css; all respect `prefers-reduced-motion`.

## Round 69 (2026-06) — VERIFIED (screenshots + testing_agent iteration_10, 100% frontend pass)
- Spacing: AICommandCenter py-24→pt-10 pb-24 (Coming Soon top gap). PlatformVisionMission pb-24→pb-8; OurReach py-24→pt-12 pb-24 (Platform→Our Reach gap).
- OurTeam: sub-headings now letter-spaced uppercase (text-lg/xl) — "MANAGING TEAM" added above 6 cards, plus "NOMINEE DIRECTORS ON BOARD" and "ADVISORS TO THE BOARD". Main "OUR TEAM" kept large. Updated 6 member titles/bios (Co-Founder titles, years of experience) in site.js TEAM.
- OurReach map: replaced with /india-map-outlined.png (states pre-outlined in yellow in artwork); removed coded GLOWS dots; added navy bold labels Uttar Pradesh/Maharashtra/Assam; repositioned lg:-mt-6 to align top with heading.
- Contact: ContactUs listens for CustomEvent 'cgreen:contact-subject'; Navbar goPragatiKendra() dispatches 'Start a Pragati Kendra' + scrolls/navigates to #contact (works cross-page from /life-at-cgreen).
- Footer: social links wired (LinkedIn/YouTube/Instagram, target _blank noopener); email mailto:, phone tel:.

## Round 68b (2026-06) — VERIFIED (screenshot)
- Swapped logos to transparent-background versions: /cgreen-logo-transparent.png (nav, platform hub, footer with brightness-0 invert → clean white on navy, no white box) and /brain-logo-composite-transparent.png (Our Services hub, both desktop w-[600px] + mobile w-72). Orbit nodes, feature icons and connectors unchanged.

## Round 68 (2026-06) — VERIFIED (screenshot)
- Nav: added "Be a Pragati Kendra" CTA (outlined secondary) beside "Book a Demo" (primary); scrolls to #contact; added to mobile menu.
- Our Reach map: swapped to /india-map-2026.png; GLOWS recoordinated Maharashtra 33.6/54.9, UP 45.3/36.6, Assam 81.5/38.9.
- Logo swaps: nav + platform hub + footer → /cgreen-logo-2026.webp (footer shows in white card since asset has white bg). Our Services hub composite → /brain-logo-composite-2026.png. Feature icons/connectors and orbit nodes unchanged.

## Round 67 (2026-06) — VERIFIED (sequential screenshots)
- Life at CGreen timeline: replaced single spine with 3 parallel `.tl-trace` metallic-blue lines (circuit bundle). Added `.tl-pulse` travelling signal (keyframe tl-pulse-move, golden head + fading tail, loops over --tl-duration 7s). Year markers glow on pulse arrival via `tl-marker-glow` with per-marker animation-delay computed in useLayoutEffect from measured marker offsets (fraction*DURATION), so glow syncs to pulse passing each. Respects prefers-reduced-motion.

## Round 66 (2026-06) — VERIFIED (screenshot)
- Life at CGreen subheading "Moments from our Journey" wrapped in glass-yellow pill (same CSS as other site pills), centered under heading.
- Timeline restructured: year markers moved to left edge (flex row: w-20 marker column + boxes flex-1), spine at left-10 runs down through markers; boxes sit to the right of each marker.

## Round 65 (2026-06) — VERIFIED (screenshot)
- New standalone page /life-at-cgreen (App.js now uses BrowserRouter: "/" landing, "/life-at-cgreen"). Nav: "Our Solution" replaced with "Life at CGreen" (to:"/life-at-cgreen"); #solution section kept on landing, just unlinked. Navbar refactored with useNavigate/useLocation so hash links work cross-page (navigate "/" then scroll).
- LifeAtCGreen.jsx: cream header (LIFE AT CGREEN / Moments from our Journey), vertical timeline with `.timeline-line` metallic-blue shimmer (keyframe timeline-flow in index.css), year nodes 2026/2025/2024/2023. 2026+2025 = 3 category glass boxes (Business Events/Cultural Event/Team Photos); 2024+2023 = single wide pooled box. Placeholder images via picsum seeds (counts vary).
- GalleryModal: dimmed backdrop, grid of category/pooled images, close button + click-outside + ESC, body scroll lock; handles any image count. Verified nav routing, timeline, category-specific + pooled modals, click-outside close.

## Round 64 (2026-06) — VERIFIED (screenshot)
- OurTeam restructured into 3 sub-sections (same card design + shared TeamCard component, avatar = User icon placeholder). Our Team: 6 members (Vipir Raj Bhardwaj MD & CEO, Vinay Shetty, Dipanshu Rajpurohit COO [no bio], Nikhar Agrawal, Makrand Manjrekar, Vineet Singh); bio hidden when empty. Nominee Directors On Board: Vikas Guru, Ankit Kumar (NOMINEE_DIRECTORS in site.js). Advisors To The Board: visible "Coming Soon" card.

## Round 62 (2026-06) — VERIFIED (screenshot)
- For Lenders box #B3C9F2 → #7C97D6 (darker for legible yellow heading/white body; still lightest, lighter than For Customers #5568AD).
- Branch connector top node tucked half behind Mission card: connector div md:-mt-3 → md:-mt-[26px] + relative z-0 (Mission z-20 clips top half). Node cy=6.

## Round 61 (2026-06) — VERIFIED (screenshot)
- Branch connector now touches Mission bottom (connector div mt-10→md:-mt-3, trunk node cy 8→6). 
- Added circular yellow icon badges (Vision/Mission style, border-#FCDD15) above each box heading; all 4 headings + icons yellow (#FCDD15); body stays cream. Icons: Landmark/Users/Store/Network.
- For Lenders box #7E8FCB → pastel blue #B3C9F2 (lightest kept; others unchanged).

## Round 60 (2026-06) — VERIFIED (screenshot)
- Vision & Mission copy replaced in site.js (longer AI-led resolution network text); cards auto-expand, no overflow.
- Added branching connector below Mission (copies Vision→Mission elbow style: #FCDD15 stroke 2.5, r5 nodes navy stroke): trunk from Mission bottom → horizontal bus → 4 legs into boxes, SVG viewBox 1000x130 w-full.
- Added 4 stepped-navy audience boxes (grid-cols-4): For Lenders #7E8FCB, For Customers #5568AD, For Local Entrepreneurs #2C3D8F, For CGreen #142984; white bold heading + cream body, no title above.

## Round 59 (2026-06) — VERIFIED (screenshot)
- Closed oversized gap between Our Services and Vision & Mission. ScalingWithPurpose py-24 → pt-24 pb-6; PlatformVisionMission py-24 → pt-12 pb-24. Only inter-section padding reduced; internal spacing untouched.

## Round 58 (2026-06) — VERIFIED (screenshot)
- Replaced all 6 service card texts (PRAGATI_CARDS + LENDING_CARDS in site.js): number-title → heading, short line → eyebrow pill (value), paragraph → body. Icons/structure/carousel unchanged. Pragati: Institutional Work Opportunities / Technology-Enabled Field Operations / Training, Support and Growth. Lending: Digital and Remote Collections / Field Collections and Verification / Customer and Voice Intelligence.

## Round 57 (2026-06) — VERIFIED (screenshot)
- OUR SERVICES tagline wrapped in a centered glass-yellow pill (copied Our Reach pill CSS: px-5 py-2.5 rounded-full glass glass-yellow), placed below heading, above banner.
- Closed banner→tabs/hub gap: top block mb-16→mb-6 and grid lg:-mt-16 (pulls both columns up together, tab/hub alignment preserved, section position unchanged).

## Round 56 (2026-06) — VERIFIED (screenshot)
- OUR SERVICES restructured. Added full-width centered top block: heading "OUR SERVICES", plain tagline (SERVICES_TAGLINE, no pill) + full-width banner paragraph (SERVICES_BANNER). Replaced SERVICES_INTRO in site.js with these two constants.
- Removed old left-column heading, "THE CGREEN APPROACH" subheading, and old intro paragraph. Left column now starts directly with toggle tabs + carousel (unchanged content).
- Left column offset lg:mt-[140px] so tab tops align with the top of the logo hub graphic; two-column side-by-side + hub unchanged.

## Round 55 (2026-06) — VERIFIED (screenshot)
- Hero headline → "Borrower intelligence, better resolution." (yellow underline kept on "resolution"); hero subtext → new Customer 360 copy. Styling unchanged.
- BHARAT_COPY changed to a 2-paragraph array; BharatProblem renders both `<p>` with same styling + gap. New copy applied.

## Round 54 (2026-06) — VERIFIED (screenshot)
- 9 feature labels (ScalingWithPurpose solution logo): replaced Courier New monospace/800 with Inter Tight/600 (medium-bold); color/size/position unchanged.
- PlatformDiagram: Omni-Channel card "Smart Connect" → "Smart Collect" (others unchanged); removed hub tagline "Empower. Enrich. Enable." (logo/circle kept).
- OurReach: Lenders stat value "10+" → "29+" (label/icon/others unchanged).

## Round 53 (2026-06) — VERIFIED (screenshot)
- Footer redesigned to reference layout on existing navy bg: 4 cols — Brand (white logo + description), Company links, Address (bold "Communication Address Office" + "Registered Address" headings), Socials (LinkedIn/Instagram/YouTube circular buttons + bold EMAIL/Website/CIN/GST/Contact labels), centered copyright "© {year} Matference Technologies India Private Limited". Updated FOOTER data in site.js with real content from reference (addresses, CIN U66190MH2021PTC358948, GST 27AAOCM5134C1ZJ, info@cgreen.in, +91-96533 13952).
- PlatformDiagram: removed stray diagonal line (was `.glass::before` specular streak) via new `.glass-no-shine` class applied only to the Data Sources panel. Bracket connectors untouched.
- PlatformDiagram hover fix: replaced single `lenderHot` bool with `hotSource` id; extracted all 3 Data-Sources branch stubs (lender y307, socio y465, environment y603) into individually highlightable paths+dots; wired every card's onHover. All three now brighten their own branch yellow on hover.

## Round 52 (2026-06) — VERIFIED (screenshot)
- Fixed Round 51 glass regression. Cause: `.glass` is defined after `@tailwind utilities`, so its `position:relative` overrode the Tailwind `absolute` class on the nav shine layer → the layer collapsed and the frosted blur vanished. Fix: force `position:absolute` on the shine `<span>` via inline style (highest priority). Glass blur restored AND dropdown stacking fix intact.

## Round 51 (2026-06) — VERIFIED (screenshot)
- Fixed nav dropdowns (About Us / Services) rendering clipped/behind content. Root cause: `<nav>` used `.glass` (which sets `overflow:hidden`), trapping the absolute dropdown. Moved glass/shine to an isolated absolute inset `<span>` (own overflow-hidden clips its streak) and wrapped nav content in `relative z-10`; nav itself now overflows freely. Dropdown wrapper raised to `z-[60]`. Glass look unchanged.
- OurReach: scroll-triggered count-up. `useInViewOnce` (IntersectionObserver, threshold 0.35, fires once) + `CountUpStat` (RAF, ease-out cubic, ~1.8s) animate 10+/3/35/957K+ from 0 on first viewport entry; does not replay on re-scroll.



## Backlog / Remaining
- **P1 — Reconnect feature icons to the composite** (Round 33 accepted gap): route new connector lines (or another treatment) from the 9 floating icons to the brain+logo composite.
- **P1**: Wire contact form to real CRM/endpoint once provided (currently DB stub, FLAGGED-UNDECIDED).
- **P1**: Replace placeholders with real team photos, LinkedIn links, partner & lender logos.
- **P2**: Real platform video in the purple video placeholder.
- **P2**: Terms & Conditions / Privacy Policy pages (footer links are `#`).
- **P2**: Mobile-specific animation spec (currently static fallback per spec flag).
- **P2**: Fine-tune river weaving geometry / morph transitions across section boundaries.

## Next Tasks
1. Collect CRM endpoint + real assets from client.
2. Implement Terms & Conditions page (Privacy Policy PDF now linked; T&C footer link still `#`).
3. Polish desktop animation timing & river continuity if requested.

## Round 70 (2026-06-08) — VERIFIED (screenshots + curl)
- **Privacy Policy PDF**: uploaded `/public/Cgreen_Privacy_Policy.pdf`; footer "Privacy Policy" now links to it, opens in a new tab (Footer.jsx adds target=_blank for non-hash links; site.js href updated). Curl → 200 application/pdf.
- **"Be a Pragati Kendra" button**: restyled to solid navy bg / white text (matches Book a Demo default), hover → yellow bg / navy text. Desktop + mobile.
- **"Book a Demo" → Contact auto-select**: Navbar `goBookDemo()` dispatches `cgreen:contact-subject` = "Request Product Demo" + scrolls to #contact (cross-page). Verified subject pre-selects.
- **Life at CGreen founding line**: italic Inter-Light quote "CGreen commenced business from 11th Feb, 2023" added directly below the "Moments from our Journey" pill.
- **Our Services hub**: composite shrunk 600→470px and shifted right (CX = SIZE/2 + 42); 9 feature-icon radii scaled (radiusX 295→232, radiusY 190→150) + per-icon OFFSETS scaled; halo 500→400. Toggle tabs widened (flex-1, wrap, items-stretch) so both fill the left column (grid left min 470→520).
- **Our Reach map**: labels repositioned near their states (UP center-top, Maharashtra west margin, Assam NE) with cream text-shadow halo for contrast over the bright map; added 3 pulsing yellow dots (reach-glow-pulse) inside each outlined state.


## Round 71 (2026-06-08) — VERIFIED (screenshot)
- "Be a Pragati Kendra" font → Montserrat (font-head), desktop + mobile.
- Our Reach map: removed all coded state text labels + pulsing glow dots (kept yellow outlines in image).

## Round 85 (2026-06-10) — Life at CGreen 2026/2025 rows + picnic cover — VERIFIED (screenshots)
- 2026 row: removed Cultural Event box; remaining Picnic + Team Photos reflow to 2 even columns (cat grid → grid-cols-1 sm:grid-cols-2).
- 2025 row: 3 "Coming soon" boxes replaced by a single full-width pool box "2025 Highlights" matching 2024/2023 exactly.
- Picnic cover: GalleryBox gains optional `cover` prop; picnic cover = PICNIC[1] (2nd carousel image). "11 photos" + carousel unchanged.
- FLAG: picnic cover photo has a burned-in "01 August 2026 13:42" timestamp watermark (shipped per instruction; crop/edit needed later if undesired).
- **Makrand Manjrekar title** (site.js): "Co-Founder & Head, Operations Risk & Compliance" → "Co-Founder & Head, Risk & Compliance" (title only).
- **Platform video** (PlatformGrid.jsx): src /957K_1.mp4 → /957K_3.mp4; old file deleted, no dead refs (verified). Same attributes/full-bleed/strip. New mp4 serves 200 (19.4MB). Known baked-in video text errors ("Digital Connection", "Priortised Worklists") shipped as-is per instruction.
- FLAG (repeat): poster still NOT generatable in-env (no ffmpeg/decoder; headless won't decode) — poster attribute omitted; video autoplays.
- **robots.txt** + **sitemap.xml** added to /public (serve 200; sitemap lists / and /life-at-cgreen with cgreen.in URLs).
- **Domain**: JSON-LD updated www.cgreen.in → https://cgreen.in throughout.
- **Contact form email (Resend)**: POST /api/contact now saves to Mongo (backup) AND emails info@cgreen.in via Resend with a formatted table (First/Last Name, Email, Subject, Message, Accepted Terms, Submitted At) + reply-to = submitter. Email send is async and wrapped in try/except so a failure NEVER blocks the user's success response. Backend env: RESEND_API_KEY (set), SENDER_EMAIL, NOTIFY_EMAIL=info@cgreen.in. Verified: live send returned a Resend message id to info@cgreen.in.
- resend==2.40.2 added to requirements.txt.
- FLAG: cgreen.in domain NOT yet verified in Resend (DNS propagating) → SENDER currently onboarding@resend.dev, which delivers to info@cgreen.in because it's the Resend account owner. Once the domain verifies, change SENDER_EMAIL to no-reply@cgreen.in (enables sending to any recipient + better deliverability).
- **Title** (public/index.html): "AI-Powered Loan Collections and Borrower Intelligence for Banks & NBFCs".
- **Meta description**: exact 159-char SEO string.
- **JSON-LD** (@graph in index.html <head>): Organization (CGreen / Matference, areaServed Bharat, keywords), WebSite, 3 Service entries (Services for Lending Institutions; One Resolution System = Pragati Kendra Network; AI-Powered Customer 360), SoftwareApplication (Platform Built for Lenders), 8 Person entries (TEAM+NOMINEE exact titles/bios), BreadcrumbList. NO AggregateRating/Review (per instruction). keywords on Org + Services.
- **Privacy PDF**: /Cgreen_Privacy_Policy.pdf overwritten with new upload (footer link path unchanged) — serves 200 application/pdf.
- **AI Command Center badge**: "COMING SOON" → "AI Command Center — In Development" (AICommandCenter.jsx, only that label).
- No other visible copy/layout changed. index.html changes are static so carry into production build. Restarted frontend to pick up index.html.
- **Ecosystem headers** (EcosystemFactors.jsx): "Ecosystem Advantages/Disadvantages" → "Urban Ecosystem Advantage" / "Rural Ecosystem Disadvantage" (singular, per instruction; CSS still uppercases). FLAG: singular confirmed with user.
- **Hero intro paragraph** (HeroSection.jsx): text-[#142984]/75 → text-[#142984] (solid navy). "Hover a factor" subtext untouched.
- **Makrand Manjrekar title** (site.js): → "Co-Founder & Head, Operations Risk & Compliance".
- **Platform video** (PlatformGrid.jsx): src /Video_Project_2.mp4 → /957K_1.mp4; old file deleted, no dead refs. Same attributes (autoplay/loop/muted/playsinline, full-bleed) + strip below unchanged.
- FLAG: poster could NOT be regenerated in-env (no ffmpeg/cv2/imageio; headless Chromium won't decode the mp4 → only a blank frame). Poster attribute omitted; video autoplays. Provide a first-frame JPG to wire a poster.
- **Reach→Platform gap**: root cause was the new v2 map PNG's built-in transparent bottom padding (1309px tall). Trimmed to content (924×870) → gap normalized (0px between sections, consistent with the rest of the page). No padding changes needed.
- **River trails (zoom root cause)**: CSS `zoom:0.85` scales getBoundingClientRect but not the px lengths set on children → trails rendered at 0.85² (too short / endpoints off). Fixed in DataRiverOverlay.jsx by auto-detecting zoom `Z = wrap.offsetWidth ? wr.width/wrap.offsetWidth : 1` and dividing all wrap-relative S/D coords by Z; evalInView multiplies Tu/Tr.y by Z for correct play/pause. This single component renders all 3 trails (hero→city, bharat→rural, rural→services hub) so all fixed at once. Hero blue glow now sits behind the city circle and the services trail reaches the CGreen hub.
- Checked other decorative elements: OrbitRings (hero/bharat) are CSS-positioned (scale with zoom naturally); no other JS-measured absolute decorations exist. No additional zoom breakage found.
- **Site zoom**: `zoom: 0.85` on the App root (App.js) — applies for all visitors, all routes. Glass sections confirmed intact after zoom (backdrop blur still 18px; nav + panels render fine).
- **Platform section**: DELETED the entire 5-column grid + all hover/mutual-exclusion JS + infinity-loop (no dead code). Replaced with a single full-bleed `<video src=/Video_Project_2.mp4 autoplay loop muted playsinline preload=auto>` (breaks out to viewport width via w-screen). Capability strip preserved and sits directly below the video (mt 32). PlatformGrid.jsx now only renders video + BottomStrip.
- **Our Reach map**: swapped to new transparent PNG (india_map_transparent_v2) at same path /india-map-final.png — direct asset swap, no layout change.
- FLAGS: (a) Poster frame NOT generated (no ffmpeg/network in pod) — poster attribute omitted; video autoplays so minimal impact. (b) zoom is non-standard (Chrome/Safari/Edge; Firefox supports it recently) — transform:scale fallback available if needed. (c) Backdrop blur is a fixed px and does not scale with zoom (expected, looked fine).
- **Equal height reinstated** (align-items stretch); all 5 cols = 563px. Std card stacks vertically centred (flex-1 justify-center); Intelligence stays top-aligned (dominance cue).
- **Grid** 1fr 1fr 1.4fr 1fr 1fr (hero 40% wider → 210px vs 295px). Gap 24px.
- **Spacing shrunk**: column padding 16, card padding 10/14, card gap 8, hero overhang 16px (paddingBottom 32).
- **Type shrunk**: headers 16px/1.5 (hero 17px), card labels 14px, strip labels 14px.
- **Icons**: side columns standalone 20px navy (no badge); hero 32px yellow badge (bg 0.18, 2px border), icon 17px yellow.
- **Hero contrast fix**: outer border 4px #FCDD15 + halo box-shadow 0 0 24px rgba(252,221,21,0.2); inner card bg 0.16 (hover 0.22), border 2px rgba(252,221,21,0.6) (hover 0.85). Blur preserved.
- **Top clearance** heading→cols 24px; **cols→strip** 32px; strip padding 16, icon 24; arrows 3px line / 16px head.
- **Fit**: heading→strip bottom = 529px (< 900). Interaction logic (hover/mutual-exclusion/loop) untouched.
- **Columns**: rebuilt as CSS grid `minmax(0,1fr) x4 + minmax(0,1.15fr)` col3, gap 24px (only spacing), align-items stretch → cols 1/2/4/5 = 221px, col3 = 254px (exactly 15% wider), all equal height; cards stack top, leftover space at bottom; labels wrap cleanly (minmax(0,…) prevents min-content stretch).
- **Arrows** (REVERSAL of prior "no arrows"): 4 static yellow line+triangle connectors, one per gap, vertically centred, anchored via position:relative on the std columns (col3 stays unpositioned to protect its card backdrop-filter — gap3 arrow anchored to Execution's left).
- **Bottom capability strip** (built for first time): full-width, mt 48px, 5 items (Cloud Native / Microservices / Real-Time Processing / Bank-Grade Security / Audit Trails) with 1px vertical dividers, navy lucide icons, Inter Tight 500 16px. Static.
- **120px gap** re-measured from real strip bottom to AICC container = 120px (Platform pb-8 32 + AICC pt-[88px]).
- **Infinity loop delivered**: /infinity_loop.webm downloaded to public root; video is a sibling absolutely-positioned on the grid wrapper (outside col3), near col3 right edge / ML Scoring row, opacity 0 default → 1 on col3 hover (150ms); col3 hover also lightens card fill 0.08→0.14 & brightens border. Renders with REAL transparency (gold shape, not black box) in automated Chromium; recommend a final live-Chrome glance.
- RECONCILIATION FLAG: Item 1's equal-grid (no gutter track) conflicts with Item 4's "150px flow gutter". Kept the equal 5-col grid + arrows (per reference image / Item 1) and placed the loop as an absolutely-positioned transparent overlay so nothing shifts and col3 gains no position/transform.
- **Platform rebuilt**: deleted old orbit diagram (PlatformDiagram.jsx removed) + all `.plat-*` CSS/keyframes (orbit spin, ambient glow, panel pulse). New `PlatformGrid.jsx`: 5 groups (Stakeholders/Inputs/Intelligence/Execution/Outputs), 28 item cards, Intelligence Layer = permanent navy hero (yellow border/header, blur cards, yellow icons, 32px overhang, 15% wider). Box-level vs section-level yellow-glass hover with mutual exclusion (glass glass-yellow recipe); Intelligence hover lightens cards + fades in 150px infinity-loop gutter video. Mobile (<900px) stacks vertically, loop gutter below Intelligence, tap-to-toggle. Existing PLATFORM h3 heading untouched. Icons = lucide (matches OrbitRings style); reused RefreshCw/AudioLines for Customer 360 / Voice AI.
- **Font swap**: Inter Tight Light (300) → Medium (500) sitewide (body + .font-body; font-light→font-medium in ScalingWithPurpose & LifeAtCGreen; Life founding line inline 300→500). font-head (Montserrat) and the 9 feature labels (600) untouched.
- **AICC heading removed**: deleted "COMING SOON" h2 + "A preview…" subline; set 120px gap (Platform pb-8 32px + AICC pt-[88px]).
- **Our Services icons**: FEATURE_ICONS GOLD #D4A017 → #FCDD15 (colour only).
- **FLAG**: `infinity_loop.webm` NOT yet uploaded — video wired to /infinity_loop.webm (hidden opacity:0 until hover); upload to /app/frontend/public/ and verify VP8-alpha transparency in live Chrome.
- **Section reorder**: Hero → Bharat Problem → Our Services → Vision & Mission → Our Reach → Platform → AI Command Center → Our Team → Partners → Lenders → Contact → Footer. Platform split into standalone `PlatformSection.jsx` (id=platform, cream bg) inserted after Our Reach; removed from PlatformVisionMission.
- **Our Services default tab** → "For Lending Institutions" (useState("lending")).
- **Mission copy** updated to add "within 3 years".
- **Partners**: Indifly & TiE logos enlarged (max-h-[72px] max-w-[190px]).
- **Backgrounds**: Vision & Mission and Platform sections → cream #FFFCFA (yellow removed).
- **"Coming Soon"** reduced to label size in AI header (text-sm/base) and Advisors card (text-sm).
- **Nav**: "Book a Demo" → "Partner with Us" (same behavior, subject Request Product Demo). Login → https://newapp.cgreen.in/login same tab (desktop + mobile).
- **Lenders marquee**: expanded 16 → 30 logos (added Home Credit, FLot, Northern Arc, Third Unicorn, TVS Credit, Bajaj Finance, Cholamandalam, Credgenics, FatakPay, Fibe, AEON, Arth Finance, AU Small Finance Bank, Axis Bank).
- Internal animations (Platform orbit, V&M connector, Our Reach count-up) confirmed working in new positions.
- **Scroll Reveal (Life at CGreen)**: each year block (marker + boxes) fades/slides in on scroll via framer-motion whileInView (once), with staggered box delays.
- **Gallery cleanup**: removed all dummy picsum images; every non-Picnic gallery is now empty and shows a clean "Coming soon" placeholder (no broken imgs). Picnic (11 photos) intact.
- **Partners in Impact**: removed TGS100 and old TiE; reordered to 2 rows of 5 — R1: IIMA Ventures, Indifly, Pontaq, STPI, Sarthy; R2: DPIIT, Wadhwani, SIES, FACE SRO, TiE Delhi-NCR. New logos added (/partners/indifly.jpg, face.jpg, dpiit.png, tie-new.jpg); grid lg:grid-cols-5.
- **Terms & Conditions**: replaced /Terms_and_Conditions.pdf with the newly uploaded file (serves 200 application/pdf).
- **Footer communication address**: updated to "Matference Technologies India Pvt Ltd, Building No. 1 (61), B Wing, Sector 2, Millenium Business Park, Mahape, Navi Mumbai – 400710. Landmark: Near post office building" (old removed).
- **Life at CGreen**: 2026 "Business Events" box renamed "Picnic" with 11 new photos (/life/picnic/picnic-1..11.jpeg). GalleryModal rewritten as a single-image lightbox (prev/next arrows, keyboard, counter 1/11..11/11).
- **Team LinkedIn**: all 8 cards now have real LinkedIn anchor links (target=_blank); hrefs in site.js TEAM & NOMINEE_DIRECTORS. OurTeam TeamCard renders <a> when member.linkedin present.
- **Footer T&C**: links to /Terms_and_Conditions.pdf (new tab), served 200 application/pdf.
- **Platform mobile (<1024px)**: orbit diagram replaced by static stacked list (MobilePlatform: 6 capability rows + Data Sources + Omni-Channel panels single-column); desktop orbit unchanged (useIsDesktop).
- **AI Command Center desktop**: container no longer resizes during animation — all transcript rows always rendered (opacity toggles), content pane fixed lg:h-[620px] overflow-y-auto. Stable at 758px across tabs + animation.
- **AI Command Center mobile (<1024px)**: tabs are a horizontal row; all animations removed (static gauge/rows/stats, no pulse/loop); content pane min-height locked via useLayoutEffect to tallest tab so no resize on tab switch. Stable at 1687px.
- CEO name corrected "Vipir" → "Vipr" (site.js TEAM); "Vipir" nowhere on site.
- India map replaced with /india-map-final.png (labels + yellow outlines baked in, no coded overlays); PNG whitespace trimmed 1024x1536 → 1011x1064 to remove dead space and close the section gap.
- All 8 team members now use real headshots (/team/*.png) via OurTeam Avatar (rounded-2xl object-cover, User-icon fallback). Dipanshu & Ankit swapped to new square-filling photos.
- Lenders marquee: 16 real logos (/lenders/*.png) in white tiles (object-contain, aspect preserved, x2 loop).
- Partners in Impact: 8 real logos (/partners/*.png) in white tiles (md:grid-cols-4).
- Our Reach → Coming Soon gap reduced (OurReach pb-24→pb-8, AICommandCenter pt-10→pt-6; root cause was the portrait map's built-in whitespace, fixed via crop).

## Round 86 (2026-06) — Code Quality Report fixes — VERIFIED (backend pytest 10/10, frontend compiles + smoke screenshot)
- **P0 Python is/==**: `tests/test_contact.py` + `tests/backend_test.py` — `assert data["accepted_terms"] is True` → `== True` (value equality). 10/10 tests pass.
- **P0 React hook dep**: `LifeAtCGreen.jsx` — hoisted `const DURATION = 7` from component scope to module scope, resolving the `useLayoutEffect([])` missing-dependency warning (also used by `glowStyleFor`). No behavior change.
  - NOTE: the other flagged hook effects (`OrbitRings` RAF loop, `useCountUp` x2, `ScalingWithPurpose` arrive-listener, `useLiveFeed`) were reviewed and are CORRECT ref-based / complete-dep patterns; the report's "missing 31+ deps" counts stable refs which must NOT be added (would restart RAF loops). Left intentionally unchanged to preserve animation behavior.
- **P1 array-index keys** replaced with stable keys:
  - `BharatProblem.jsx` → `key={para}`; `Lenders.jsx` → `key={`${l.alt}-${i}`}` (marquee duplicates need index disambiguation); `DataRiverOverlay.jsx` particles → `key={`river-particle-${i}`}`.
  - `AICommandCenter.jsx` (7): metrics `key={m.l}`, rows `key={l.text}`, alerts `key={a.title}`, stats `key={s.label}`, bar bars `key={chart.labels[i]}`, bar labels `key={l}`, waveform `key={`wave-${i}`}`.
- **P2 cleanup (safe only)**: `ContactUs.jsx` removed debug `console.log` + outdated CRM-stub TODO comment (backend now emails via Resend). `DataRiverOverlay.jsx` flattened nested ternary `pCount = mobile ? 5 : tablet ? 9 : 15` → if/else.
- **P2 deep refactor (DELIBERATELY MINIMAL)**: per "safe extractions only / no behavior change" + pixel-perfect constraint, large animation files (DataRiverOverlay/OrbitRings/Navbar) were NOT structurally split — extraction there risks the zoom math and continuous animations. Flagged as intentional scope decision.

## Round 87 (2026-06) — Code Quality Report (2nd pass) — VERIFIED (backend pytest 10/10, frontend compiles + smoke)
- **Python boolean (report reversed prior guidance)**: `assert data["accepted_terms"] == True` → `assert data["accepted_terms"]` (direct truthiness) in both test files. 10/10 pass.
- **Console statements**: `ContactUs.jsx` remaining `console.error(err)` now guarded by `if (process.env.NODE_ENV === "development")`.
- **Inline animation objects (56)**: hoisted static framer-motion prop objects to module-level constants (spread via `{...VARIANT}`, behavior-identical — no re-render/visual change):
  - `PlatformVisionMission.jsx`: `FADE_UP` + `VISION_T`/`MISSION_T`.
  - `BharatProblem.jsx`: `CARD_REVEAL` (incl. transition).
  - `PartnersInImpact.jsx`: `POP_IN` (dynamic per-item delay left inline).
  - `OurTeam.jsx`: `CARD_REVEAL` (dynamic delay inline).
  - `ScalingWithPurpose.jsx`: `CARD_SWAP` (AnimatePresence enter/exit).
  - `LifeAtCGreen.jsx`: `YEAR_BLOCK` + `BOX_REVEAL` (dynamic delays inline).
- **Hook deps re-review**: `ContactUs.jsx` `onSubject` is defined INSIDE its effect (correct, no missing dep — report false positive). `use-toast.js` is shadcn boilerplate (left as-is). All other flagged effects remain correct ref/complete-dep patterns.
- **Complexity / long-function splits (DataRiverOverlay 225L, Navbar 207L, OrbitRings Constellation, GalleryModal, DashboardBody) STILL DEFERRED**: structural extraction of the animation-engine files is held back to protect the zoom math + pixel-perfect behavior (standing "no behavior change" guardrail). Available on explicit request.
