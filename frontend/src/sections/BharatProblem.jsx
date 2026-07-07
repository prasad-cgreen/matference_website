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

  return (
    <section
      id="about"
      ref={ref}
      className="relative w-full py-24 overflow-hidden"
      data-testid="section-bharat"
    >
      {/* River entering diagonally from top-left toward rural circle */}
      {isDesktop && (
        <DataRiver
          d="M 0 20 C 120 40 180 140 260 210 C 320 260 360 320 380 420"
          viewW={500}
          viewH={460}
          target={ref}
          offset={["start end", "center center"]}
          className="pointer-events-none absolute left-0 top-0 h-[60vh] w-[45vw]"
        />
      )}

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center relative z-10">
        {/* Left: rural orbit */}
        <div className="flex justify-center lg:justify-start">
          <OrbitRings
            outer={RURAL_ORBIT.outer}
            inner={RURAL_ORBIT.inner}
            theme="yellow"
            diameter={isDesktop ? 320 : 260}
            animate={isDesktop}
            testid="rural-orbit"
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
          <p className="font-body text-base lg:text-lg leading-relaxed text-[#142984]/85">
            {BHARAT_COPY}
          </p>
        </motion.div>
      </div>

      {/* River exiting diagonally toward next section */}
      {isDesktop && (
        <DataRiver
          d="M 140 0 C 180 90 120 160 200 240 C 280 320 360 340 500 420"
          viewW={500}
          viewH={460}
          target={ref}
          offset={["center center", "end start"]}
          className="pointer-events-none absolute right-0 bottom-[-6%] h-[60vh] w-[45vw]"
        />
      )}
    </section>
  );
}
