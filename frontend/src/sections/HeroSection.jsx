import React, { useRef } from "react";
import { motion } from "framer-motion";
import OrbitRings from "@/components/site/OrbitRings";
import UrbanScene from "@/illustrations/UrbanScene";
import { HERO_ORBIT } from "@/data/site";
import { useIsDesktop } from "@/hooks/useResponsive";

/**
 * Static "pulse ring" background effect for Section 1:
 * concentric pale blue-lavender rings, a horizontal light beam, a soft center
 * glow, and a few sparkles. Purely decorative, sits behind all content (z-0).
 */
function PulseRingBackground() {
  const cx = 1000;
  const cy = 380;
  const rings = [90, 170, 250, 330, 410, 500, 600];
  const sparkles = [
    { x: 1000, y: 380, r: 3.5, o: 0.95 },
    { x: 830, y: 300, r: 2.2, o: 0.7 },
    { x: 1170, y: 300, r: 2.4, o: 0.65 },
    { x: 760, y: 470, r: 1.8, o: 0.5 },
    { x: 1250, y: 470, r: 2.6, o: 0.55 },
    { x: 920, y: 200, r: 2.0, o: 0.45 },
    { x: 1090, y: 560, r: 2.2, o: 0.5 },
    { x: 690, y: 380, r: 1.6, o: 0.4 },
  ];
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" data-testid="hero-pulse-bg">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="pulse-center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(178,190,255,0.55)" />
            <stop offset="45%" stopColor="rgba(178,190,255,0.18)" />
            <stop offset="100%" stopColor="rgba(178,190,255,0)" />
          </radialGradient>
          <linearGradient id="pulse-beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(150,165,235,0)" />
            <stop offset="50%" stopColor="rgba(150,165,235,0.5)" />
            <stop offset="100%" stopColor="rgba(150,165,235,0)" />
          </linearGradient>
          <filter id="pulse-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* soft center glow */}
        <circle cx={cx} cy={cy} r="360" fill="url(#pulse-center-glow)" />

        {/* horizontal light beam through the center */}
        <rect x="0" y={cy - 22} width="1440" height="44" fill="url(#pulse-beam)" filter="url(#pulse-soft)" />
        <rect x="0" y={cy - 1} width="1440" height="2" fill="url(#pulse-beam)" />

        {/* concentric pale blue-lavender rings */}
        {rings.map((r, i) => (
          <circle
            key={r}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(150,162,225,1)"
            strokeWidth={i === 0 ? 2 : 1.4}
            opacity={Math.max(0.08, 0.42 - i * 0.05)}
          />
        ))}

        {/* sparkles */}
        {sparkles.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ffffff" opacity={s.o} />
        ))}
        {sparkles.slice(0, 5).map((s, i) => (
          <circle key={`h${i}`} cx={s.x} cy={s.y} r={s.r * 3} fill="rgba(190,200,255,0.5)" filter="url(#pulse-soft)" />
        ))}
      </svg>
    </div>
  );
}

export default function HeroSection({ onCaptionsDone }) {
  const ref = useRef(null);
  const isDesktop = useIsDesktop();

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen w-full flex items-center pt-28 pb-16 overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #FFF3B0 0%, #FFFCFA 100%)" }}
      data-testid="section-hero"
    >
      {isDesktop && <PulseRingBackground />}

      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-10 items-center relative z-10">
        {/* Left: headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass glass-yellow text-[#142984] text-xs font-body font-medium mb-6">
            Customer • Collect • Credit
          </span>
          <h1 className="font-head text-4xl sm:text-5xl lg:text-6xl leading-[1.02] text-[#142984]">
            Where rural truth<br />meets{" "}
            <span className="relative inline-block">
              resolution
              <span className="absolute left-0 -bottom-1 h-2 w-full bg-[#FCDD15] -z-10 rounded" />
            </span>
          </h1>
          <p className="mt-6 max-w-md font-body text-base sm:text-lg text-[#142984]/75">
            An AI-powered debt resolution network built for Bharat — uncovering the delta
            between borrowing and repayment, and restoring dignity, trust, and clarity.
          </p>
        </motion.div>

        {/* Right: urban orbit (river originates from the bottom of this circle) */}
        <div className="relative flex justify-center lg:justify-end z-10">
          <OrbitRings
            outer={HERO_ORBIT.outer}
            inner={HERO_ORBIT.inner}
            theme="navy"
            diameter={isDesktop ? 340 : 240}
            animate={isDesktop}
            testid="hero-orbit"
            circleId="urban"
            onAllRevealed={onCaptionsDone}
          >
            <UrbanScene className="w-full h-full" />
          </OrbitRings>
        </div>
      </div>
    </section>
  );
}
