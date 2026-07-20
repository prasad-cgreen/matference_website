import React from "react";

const slug = (s) => s.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

const STATS = [
  { value: "10+", label: "Lenders" },
  { value: "3", label: "States" },
  { value: "35", label: "Districts" },
  { value: "957K+", label: "Villages" },
];

// Live-coded yellow pulsing glows layered over the baked-in dots on the map image.
// Coordinates are a % of the map image's own width/height.
const GLOWS = [
  { name: "Maharashtra", left: "33.3%", top: "55.4%" },
  { name: "Uttar Pradesh", left: "50.8%", top: "28.6%" },
  { name: "Assam", left: "74.6%", top: "34.5%" },
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
                className="w-full flex flex-col items-center justify-center text-center px-7 py-4 rounded-[28px] font-head leading-none glass glass-navy text-white"
              >
                <span className="text-3xl lg:text-4xl text-white tabular-nums">{s.value}</span>
                <span className="text-sm lg:text-base text-white mt-2">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: India map with live-coded pulsing glows over baked-in dots */}
        <div className="flex justify-center">
          <div className="relative w-full lg:mt-[40px]" data-testid="reach-map">
            <img
              src="/india-reach-map-v2.png"
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
