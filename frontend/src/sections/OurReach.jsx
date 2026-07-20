import React from "react";

const slug = (s) => s.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

const STATS = [
  { value: "10+", label: "Lenders" },
  { value: "3", label: "States" },
  { value: "35", label: "Districts" },
  { value: "957K+", label: "Villages" },
];

// Live-coded yellow glows over the India map, positioned as a % of the map image.
const GLOWS = [
  { name: "Uttar Pradesh", left: "51.5%", top: "31.5%" },
  { name: "Maharashtra", left: "32.5%", top: "57%" },
  { name: "Assam", left: "82.3%", top: "37.2%" },
];

export default function OurReach() {
  return (
    <section id="reach" className="relative w-full py-24 bg-[#FFFCFA] scroll-mt-24" data-testid="section-reach">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center relative z-10">
        {/* Left column: heading, subheading pill, stat pills */}
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

          <div className="mt-8 flex flex-col gap-4 max-w-md" data-testid="reach-stats">
            {STATS.map((s) => (
              <div
                key={s.label}
                data-testid={`reach-stat-${slug(s.label)}`}
                className="inline-flex items-baseline gap-4 px-7 py-4 rounded-full font-body font-bold leading-snug glass glass-navy text-white"
              >
                <span className="font-head text-3xl lg:text-4xl leading-none text-white tabular-nums">{s.value}</span>
                <span className="text-base lg:text-lg text-white">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: India map with live-coded state glows */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-xl" data-testid="reach-map">
            <img
              src="/india-reach-map.png"
              alt="cGreen network reach across India"
              className="w-full h-auto select-none"
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
                  width: 60,
                  height: 60,
                  transform: "translate(-50%, -50%)",
                  background:
                    "radial-gradient(circle, rgba(252,221,21,0.95) 0%, rgba(252,221,21,0.6) 34%, rgba(252,221,21,0) 70%)",
                  animation: "river-glow-pulse 2.4s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
