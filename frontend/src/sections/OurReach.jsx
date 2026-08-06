import React, { useState, useEffect, useRef } from "react";

const slug = (s) => s.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

// Yellow line-art icons matching the attached set.
const YELLOW = "#FCDD15";
const p = (s) => ({
  width: s,
  height: s,
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: YELLOW,
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

const PeopleGroup = (s) => (
  <svg {...p(s)}>
    <circle cx={24} cy={15} r={5.5} />
    <path d="M14 35 v-1.5 a10 10 0 0 1 20 0 V35" />
    <circle cx={11.5} cy={19.5} r={3.8} />
    <path d="M5 32 a7 7 0 0 1 6.5 -4.8" />
    <circle cx={36.5} cy={19.5} r={3.8} />
    <path d="M43 32 a7 7 0 0 0 -6.5 -4.8" />
  </svg>
);

const MapPin = (s) => (
  <svg {...p(s)}>
    <path d="M24 10 a9 9 0 0 1 9 9 c0 7 -9 17 -9 17 s-9 -10 -9 -17 a9 9 0 0 1 9 -9 Z" />
    <circle cx={24} cy={19} r={3.4} />
  </svg>
);

const Buildings = (s) => (
  <svg {...p(s)}>
    <line x1={8} y1={36} x2={40} y2={36} />
    <rect x={19} y={13} width={10} height={23} />
    <line x1={24} y1={9} x2={24} y2={13} />
    <rect x={10} y={20} width={9} height={16} />
    <rect x={29} y={24} width={8} height={12} />
    <line x1={21.5} y1={17} x2={23} y2={17} />
    <line x1={25} y1={17} x2={26.5} y2={17} />
    <line x1={21.5} y1={21} x2={23} y2={21} />
    <line x1={25} y1={21} x2={26.5} y2={21} />
    <line x1={21.5} y1={25} x2={23} y2={25} />
    <line x1={25} y1={25} x2={26.5} y2={25} />
  </svg>
);

const Houses = (s) => (
  <svg {...p(s)}>
    <line x1={7} y1={36} x2={41} y2={36} />
    <polyline points="8,25 13,20 18,25" />
    <polyline points="30,25 35,20 40,25" />
    <polyline points="14,26 24,17 34,26" />
    <polyline points="16,25 16,36 32,36 32,25" />
    <rect x={21} y={30} width={6} height={6} />
  </svg>
);

const STATS = [
  { value: "29+", label: "Lenders", Icon: PeopleGroup },
  { value: "3", label: "States", Icon: MapPin },
  { value: "35", label: "Districts", Icon: Buildings },
  { value: "957K+", label: "Villages", Icon: Houses },
];

// Live-coded yellow pulsing glows over the baked-in dots — % of the cropped map image.
const GLOWS = [
  { name: "Maharashtra", left: "18.93%", top: "57.03%" },
  { name: "Uttar Pradesh", left: "48.44%", top: "27.29%" },
  { name: "Assam", left: "88.57%", top: "33.84%" },
];

// Fires once when `ref` first enters the viewport.
function useInViewOnce(ref, threshold = 0.35) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || seen) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [ref, seen, threshold]);
  return seen;
}

// Counts the numeric part of a stat (e.g. "957K+") from 0 to target once `start` is true.
function CountUpStat({ value, start, duration = 1800 }) {
  const m = String(value).match(/^([\d,]+)(.*)$/);
  const target = m ? parseInt(m[1].replace(/,/g, ""), 10) : 0;
  const suffix = m ? m[2] : String(value);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf, s0;
    const step = (ts) => {
      if (s0 == null) s0 = ts;
      const p = Math.min((ts - s0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
      else setN(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return <>{n.toLocaleString("en-IN")}{suffix}</>;
}

export default function OurReach() {
  const statsRef = useRef(null);
  const started = useInViewOnce(statsRef);
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

          <div className="mt-8 flex flex-col gap-4" data-testid="reach-stats" ref={statsRef}>
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
                  <span className="text-3xl lg:text-4xl text-white tabular-nums">
                    <CountUpStat value={s.value} start={started} />
                  </span>
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
