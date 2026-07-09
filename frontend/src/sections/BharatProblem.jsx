import React, { useRef } from "react";
import { motion } from "framer-motion";
import OrbitRings from "@/components/site/OrbitRings";
import DataRiver from "@/components/site/DataRiver";
import RuralScene from "@/illustrations/RuralScene";
import { RURAL_ORBIT, BHARAT_COPY } from "@/data/site";
import { useIsDesktop } from "@/hooks/useResponsive";

export default function BharatProblem() {
  const ref = useRef(null);
  const isDesktop = useIsDesktop();

  // Entry river: travels IN from the top-left and ends exactly at the circle edge (225°).
  const entryRiver = (
    <DataRiver
      d="M 0 0 C 70 40 40 120 120 160 C 200 200 240 230 300 300"
      viewW={300}
      viewH={300}
      target={ref}
      offset={["start end", "center center"]}
      style={{ width: "20vw", height: "34vh", display: "block" }}
      className="pointer-events-none"
    />
  );

  // Exit river: starts exactly at the circle edge (45°) and flows OUT toward the next section.
  const exitRiver = (
    <DataRiver
      d="M 0 0 C 60 70 20 150 100 200 C 180 250 260 280 320 360"
      viewW={320}
      viewH={360}
      target={ref}
      offset={["center center", "end start"]}
      style={{ width: "22vw", height: "40vh", display: "block" }}
      className="pointer-events-none"
    />
  );

  return (
    <section
      id="about"
      ref={ref}
      className="relative w-full py-24 overflow-hidden"
      data-testid="section-bharat"
    >
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center relative z-10">
        {/* Left: rural orbit with rivers anchored to the circle edge */}
        <div className="flex justify-center lg:justify-start">
          <OrbitRings
            outer={RURAL_ORBIT.outer}
            inner={RURAL_ORBIT.inner}
            theme="yellow"
            diameter={isDesktop ? 300 : 260}
            animate={isDesktop}
            testid="rural-orbit"
            edgeNodes={
              isDesktop
                ? [
                    { angle: 225, anchor: "br", node: entryRiver },
                    { angle: 45, anchor: "tl", node: exitRiver },
                  ]
                : []
            }
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
