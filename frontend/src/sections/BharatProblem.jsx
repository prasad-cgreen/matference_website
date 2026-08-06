import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import OrbitRings from "@/components/site/OrbitRings";
import RuralScene from "@/illustrations/RuralScene";
import EcosystemFactors, { RURAL_FACTORS } from "@/components/site/EcosystemFactors";
import { RURAL_ORBIT, BHARAT_COPY } from "@/data/site";
import { useIsDesktop } from "@/hooks/useResponsive";

export default function BharatProblem() {
  const ref = useRef(null);
  const isDesktop = useIsDesktop();
  const [dotActive, setDotActive] = useState(null);
  const [chipActive, setChipActive] = useState(null);
  const active = chipActive || dotActive;

  return (
    <section
      id="about"
      ref={ref}
      className="relative w-full py-24 overflow-hidden"
      data-testid="section-bharat"
    >
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center relative z-10">
        {/* Left: rural orbit + static ecosystem factors */}
        <div className="flex flex-col items-center">
          <OrbitRings
            outer={RURAL_ORBIT.outer}
            inner={RURAL_ORBIT.inner}
            theme="yellow"
            diameter={isDesktop ? 300 : 240}
            animate={isDesktop}
            testid="rural-orbit"
            onActive={setDotActive}
            forcedActive={chipActive}
          >
            <RuralScene className="w-full h-full" />
          </OrbitRings>
          <EcosystemFactors
            factors={RURAL_FACTORS}
            theme="yellow"
            activeLabel={active}
            onHover={setChipActive}
            testid="rural-ecosystem-factors"
          />
        </div>

        {/* Right: content card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="glass glass-yellow rounded-[28px] p-8 lg:p-10"
          data-testid="bharat-card"
        >
          <h2 className="font-head text-3xl lg:text-4xl text-[#142984] mb-5">
            THE BHARAT PROBLEM
          </h2>
          {BHARAT_COPY.map((para, i) => (
            <p key={i} className={`font-body text-base lg:text-lg leading-relaxed text-[#142984]/90${i > 0 ? " mt-4" : ""}`}>
              {para}
            </p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
