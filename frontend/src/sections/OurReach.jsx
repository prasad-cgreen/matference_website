import React from "react";
import { FEATURE_ICONS } from "@/components/site/LogoFeatureIcons";

const slug = (s) => s.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

// Match the site's gold line-art feature-icon style.
const GOLD = "#D4A017";
const p = (s) => ({
  width: s,
  height: s,
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: GOLD,
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

const Buildings = (s) => (
  <svg {...p(s)}>
    <line x1={8} y1={38} x2={40} y2={38} />
    <rect x={11} y={22} width={9} height={16} />
    <rect x={21} y={14} width={10} height={24} />
    <rect x={32} y={26} width={7} height={12} />
    <line x1={14} y1={26} x2={17} y2={26} />
    <line x1={14} y1={31} x2={17} y2={31} />
    <line x1={24} y1={19} x2={28} y2={19} />
    <line x1={24} y1={24} x2={28} y2={24} />
    <line x1={24} y1={29} x2={28} y2={29} />
  </svg>
);

const House = (s) => (
  <svg {...p(s)}>
    <polyline points="11,25 24,14 37,25" />
    <polyline points="15,23 15,37 33,37 33,23" />
    <rect x={21} y={30} width={6} height={7} />
  </svg>
);

const STATS = [
  { value: "10+", label: "Lenders", Icon: FEATURE_ICONS["Financial Inclusion"] },
  { value: "3", label: "States", Icon: FEATURE_ICONS["Customer Place Verification"] },
  { value: "35", label: "Districts", Icon: Buildings },
  { value: "957K+", label: "Villages", Icon: House },
];

// Live-coded yellow pulsing glows over the baked-in dots — % of the cropped map image.
const GLOWS = [
  { name: "Maharashtra", left: "18.93%", top: "57.03%" },
  { name: "Uttar Pradesh", left: "48.44%", top: "27.29%" },
  { name: "Assam", left: "88.57%", top: "33.84%" },
];

export default function OurReach() {
  return (
    <section id="reach" className="relative w-full py-24 bg-[#FFFCFA] scroll-mt-24" data-testid="section-reach">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[2fr_3fr] gap-14 items-start relative z-10">
        {/* Left column: heading, subheading pill, stat boxes */}
        <div>
          <h2 className="font-head text-3xl lg:text-4xl text-[#142984]" data-testid="reach-heading">
            OUR REACH
          </h2>

          <div className="mt-4">
            <span
              data-testid="reach-subheading"
              className="inline-block text-center px-5 py-2.5 rounded-full text-sm font-body font-bold leading-snug glass glass-yellow text-[#142984]"
            >
              OUR FOOTPRINT IN ACTION
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-4" data-testid="reach-stats">
            {STATS.map((s) => (
              <div
                key={s.label}
                data-testid={`reach-stat-${slug(s.label)}`}
                className="w-full flex items-center justify-center gap-5 px-7 py-4 rounded-[28px] glass glass-navy text-white"
              >
                <span className="shrink-0" data-testid={`reach-stat-icon-${slug(s.label)}`}>
                  {s.Icon && s.Icon(42)}
                </span>
                <div className="flex flex-col items-center justify-center text-center font-head leading-none">
                  <span className="text-3xl lg:text-4xl text-white tabular-nums">{s.value}</span>
                  <span className="text-sm lg:text-base text-white mt-2">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: India map with live-coded pulsing glows over baked-in dots */}
        <div className="flex justify-center">
          <div className="relative w-full lg:w-[645px] lg:mt-[56px]" data-testid="reach-map">
            <img
              src="/india-reach-map-v3.png"
              alt="cGreen network reach across India"
              className="w-full h-auto select-none"
              style={{ opacity: 0.9 }}
              draggable="false"
            />
            {GLOWS.map((g) => (
              <span
                key={g.name}
                data-testid={`reach-glow-${slug(g.name)}`}
                aria-hidden="true"
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: g.left,
                  top: g.top,
                  width: 48,
                  height: 48,
                  transform: "translate(-50%, -50%)",
                  background:
                    "radial-gradient(circle, rgba(252,221,21,0.95) 0%, rgba(252,221,21,0.6) 34%, rgba(252,221,21,0) 70%)",
                  animation: "reach-glow-pulse 2.4s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
