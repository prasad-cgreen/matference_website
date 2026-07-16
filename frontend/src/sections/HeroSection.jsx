import React, { useRef } from "react";
import { motion } from "framer-motion";
import OrbitRings from "@/components/site/OrbitRings";
import UrbanScene from "@/illustrations/UrbanScene";
import EcosystemFactors, { URBAN_FACTORS } from "@/components/site/EcosystemFactors";
import { HERO_ORBIT } from "@/data/site";
import { useIsDesktop } from "@/hooks/useResponsive";

export default function HeroSection() {
  const ref = useRef(null);
  const isDesktop = useIsDesktop();

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen w-full flex items-center pt-28 pb-16 overflow-hidden"
      style={{ background: "#F7F8FB" }}
      data-testid="section-hero"
    >
      {isDesktop && (
        <div
          className="absolute z-0 pointer-events-none"
          data-testid="hero-pulse-bg"
          style={{
            width: "78%",
            aspectRatio: "1536 / 1024",
            left: "-11.2%",
            top: "3.2%",
            backgroundImage: "url(/pulse-ring.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
          }}
        />
      )}

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

        {/* Right: urban orbit + static ecosystem factors */}
        <div className="relative flex flex-col items-center z-10">
          <OrbitRings
            outer={HERO_ORBIT.outer}
            inner={HERO_ORBIT.inner}
            theme="navy"
            diameter={isDesktop ? 401 : 240}
            animate={isDesktop}
            testid="hero-orbit"
          >
            <UrbanScene className="w-full h-full" />
          </OrbitRings>
          <EcosystemFactors factors={URBAN_FACTORS} theme="navy" testid="urban-ecosystem-factors" />
        </div>
      </div>
    </section>
  );
}
