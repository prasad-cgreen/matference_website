import React, { useRef } from "react";
import { motion } from "framer-motion";
import OrbitRings from "@/components/site/OrbitRings";
import DataRiver from "@/components/site/DataRiver";
import UrbanScene from "@/illustrations/UrbanScene";
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
      data-testid="section-hero"
    >
      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-10 items-center">
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

        {/* Right: urban orbit */}
        <div className="relative flex justify-center lg:justify-end">
          <OrbitRings
            outer={HERO_ORBIT.outer}
            inner={HERO_ORBIT.inner}
            theme="navy"
            diameter={isDesktop ? 320 : 260}
            animate={isDesktop}
            testid="hero-orbit"
          >
            <UrbanScene className="w-full h-full" />
          </OrbitRings>
        </div>
      </div>

      {/* River emerging from bottom, weaving downward (scroll-tied) */}
      {isDesktop && (
        <DataRiver
          d="M 360 0 C 380 60 300 110 340 180 C 380 250 300 300 360 380"
          viewW={500}
          viewH={380}
          target={ref}
          offset={["start start", "end start"]}
          className="pointer-events-none absolute right-[6%] bottom-0 h-[45vh] w-[40vw]"
        />
      )}
    </section>
  );
}
