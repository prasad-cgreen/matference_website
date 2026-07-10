import React, { useRef } from "react";
import { motion } from "framer-motion";
import OrbitRings from "@/components/site/OrbitRings";
import RuralScene from "@/illustrations/RuralScene";
import { RURAL_ORBIT, BHARAT_COPY } from "@/data/site";
import { useIsDesktop } from "@/hooks/useResponsive";

export default function BharatProblem() {
  const ref = useRef(null);
  const isDesktop = useIsDesktop();

  return (
    <section
      id="about"
      ref={ref}
      className="relative w-full py-24 overflow-hidden"
      data-testid="section-bharat"
    >
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center relative z-10">
        {/* Left: rural orbit — the one river enters/exits this circle's edge */}
        <div className="flex justify-center lg:justify-start">
          <OrbitRings
            outer={RURAL_ORBIT.outer}
            inner={RURAL_ORBIT.inner}
            theme="yellow"
            diameter={isDesktop ? 280 : 260}
            animate={isDesktop}
            testid="rural-orbit"
            circleId="rural"
          >
            <RuralScene className="w-full h-full" />
          </OrbitRings>
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
          <p className="font-body text-base lg:text-lg leading-relaxed text-[#142984]/90">
            {BHARAT_COPY}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
