import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { STATS, SOLUTION_CAPTIONS } from "@/data/site";
import { useCountUp } from "@/hooks/useCountUp";
import { useIsDesktop } from "@/hooks/useResponsive";

function StatItem({ value, suffix, label, active }) {
  const n = useCountUp(value, active);
  return (
    <div className="text-center" data-testid={`stat-${label.toLowerCase()}`}>
      <div className="font-head text-3xl lg:text-4xl text-[#FCDD15] tabular-nums whitespace-nowrap">
        {n}
        {suffix}
      </div>
      <div className="font-body text-sm mt-1 text-[#FCDD15]/90">{label}</div>
    </div>
  );
}

function LogoSolution({ isDesktop }) {
  const ref = useRef(null);
  const firedRef = useRef(false);
  const [fired, setFired] = useState(false);
  const [glow, setGlow] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const total = SOLUTION_CAPTIONS.length;

  // Robust trigger: fire as soon as the logo enters the viewport — works for both
  // normal scroll-paced arrival AND fast-scroll. Fires once; captions stay permanent.
  useEffect(() => {
    if (!isDesktop) return;
    const check = () => {
      if (firedRef.current) return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.8 && r.bottom > 0) {
        firedRef.current = true;
        setFired(true);
        setGlow(true);
        setTimeout(() => setGlow(false), 3000); // glow holds 3s then fades (cosmetic only)
      }
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [isDesktop]);

  // Paced caption reveal after firing (self-clearing interval).
  useEffect(() => {
    if (!fired) return;
    const id = setInterval(() => {
      setRevealed((r) => {
        const next = Math.min(total, r + 1);
        if (next >= total) clearInterval(id);
        return next;
      });
    }, 240);
    return () => clearInterval(id);
  }, [fired, total]);

  if (!isDesktop) {
    return (
      <div ref={ref} className="flex flex-col items-center gap-6" data-testid="solution-logo-static">
        <img src="/cgreen-logo.png" alt="cGreen" className="w-56 h-auto" />
        <div className="flex flex-wrap justify-center gap-2 max-w-md">
          {SOLUTION_CAPTIONS.map((c) => (
            <span key={c} className="glass glass-navy rounded-full px-3 py-1.5 text-xs font-body text-[#142984] border border-[#142984]/25">
              {c}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const SIZE = 600;
  const center = SIZE / 2;
  const R = 238;
  return (
    <div ref={ref} className="relative mx-auto" style={{ width: SIZE, height: SIZE, maxWidth: "100%" }} data-testid="solution-logo">
      {/* radiating lines (thick, high-contrast navy) */}
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 w-full h-full pointer-events-none">
        {SOLUTION_CAPTIONS.map((_, i) => {
          const a = (Math.PI * 2 * i) / total - Math.PI / 2;
          const x2 = center + Math.cos(a) * R;
          const y2 = center + Math.sin(a) * R;
          return (
            <motion.line
              key={i}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="#142984"
              strokeWidth="3.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={i < revealed ? { pathLength: 1, opacity: 0.9 } : {}}
              transition={{ duration: 0.5 }}
            />
          );
        })}
      </svg>

      {/* yellow bloom / halo behind the logo */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0"
        style={{
          width: 380,
          height: 380,
          background:
            "radial-gradient(circle, rgba(252,221,21,0.95) 0%, rgba(252,221,21,0.5) 42%, rgba(252,221,21,0) 72%)",
          filter: "blur(8px)",
          opacity: glow ? 1 : 0,
          transition: "opacity 0.9s ease",
        }}
      />

      {/* logo — large focal point, roughly the width of the stats box; river terminates here */}
      <div
        data-river-anchor="logo"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFFCFA] px-10 py-8 border border-[#142984]/10 z-10"
        style={{
          animation: glow ? "logo-pulse 1.2s ease-in-out infinite" : "none",
          boxShadow: glow
            ? "0 0 90px 26px rgba(252,221,21,0.9), 0 0 30px 6px rgba(252,221,21,1)"
            : "0 12px 34px rgba(20,41,132,0.18)",
          transition: "box-shadow 0.9s ease",
        }}
      >
        <img src="/cgreen-logo.png" alt="cGreen" className="w-[260px] h-auto" />
      </div>

      {/* captions */}
      {SOLUTION_CAPTIONS.map((c, i) => {
        const a = (Math.PI * 2 * i) / total - Math.PI / 2;
        const x = center + Math.cos(a) * R;
        const y = center + Math.sin(a) * R;
        return (
          <div
            key={c}
            className="absolute z-20"
            style={{
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              opacity: i < revealed ? 1 : 0,
              scale: i < revealed ? 1 : 0.5,
              transition: "opacity 0.4s ease, scale 0.4s ease",
            }}
          >
            <span
              className="glass glass-navy whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-body font-medium text-[#142984] shadow"
              style={{ border: "1px solid rgba(20,41,132,0.3)" }}
            >
              {c}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function ScalingWithPurpose() {
  const ref = useRef(null);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.4 });
  const isDesktop = useIsDesktop();

  return (
    <section id="solution" ref={ref} className="relative w-full py-24 overflow-hidden" data-testid="section-scaling">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center relative z-10">
        {/* Left column */}
        <div ref={statsRef}>
          <div className="glass glass-navy rounded-[28px] p-8" data-testid="stats-block">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {STATS.map((s) => (
                <StatItem key={s.label} {...s} active={statsInView} />
              ))}
            </div>
          </div>

          <p className="font-head text-2xl lg:text-3xl text-[#FCDD15] mt-8 leading-tight">
            SCALING WITH PURPOSE, SOLVING FOR BHARAT
          </p>

          <div className="mt-8">
            <h2 className="font-head text-3xl lg:text-4xl text-[#142984]">OUR SOLUTION</h2>
            <p className="font-body text-base lg:text-lg text-[#142984]/70 mt-1">THE CGREEN APPROACH</p>
            <ArrowRight className="text-[#142984] mt-3" size={30} />
          </div>
        </div>

        {/* Right column: logo sequence */}
        <div className="flex justify-center">
          <LogoSolution isDesktop={isDesktop} />
        </div>
      </div>
    </section>
  );
}
