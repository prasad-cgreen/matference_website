import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { VISION, MISSION } from "@/data/site";
import { useIsDesktop } from "@/hooks/useResponsive";

function Circuit({ target }) {
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "center center"] });
  const len = useTransform(scrollYProgress, [0, 1], [0, 1], { clamp: true });

  const branches = [
    "M 500 0 C 500 60 300 70 300 150 C 300 220 200 230 200 320",
    "M 500 0 C 500 60 700 70 700 150 C 700 220 800 230 800 320",
    "M 500 0 L 500 120 C 500 200 420 240 420 330",
    "M 500 0 L 500 120 C 500 200 580 240 580 330",
    "M 500 30 C 350 90 360 180 260 260",
    "M 500 30 C 650 90 640 180 740 260",
  ];

  return (
    <svg viewBox="0 0 1000 340" preserveAspectRatio="none" className="absolute -top-4 left-0 w-full h-40 pointer-events-none" aria-hidden="true">
      <defs>
        <linearGradient id="circuitGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E4A73" />
          <stop offset="100%" stopColor="#7C8CA6" />
        </linearGradient>
      </defs>
      {branches.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke="url(#circuitGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ pathLength: len }}
        />
      ))}
      {/* connector nodes */}
      {[[200, 320], [800, 320], [420, 330], [580, 330], [260, 260], [740, 260]].map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r="5"
          fill="#3A5680"
          stroke="#B9C6DA"
          strokeWidth="1.5"
          style={{ opacity: len }}
        />
      ))}
    </svg>
  );
}

export default function PlatformVisionMission() {
  const ref = useRef(null);
  const isDesktop = useIsDesktop();

  return (
    <section
      ref={ref}
      className="relative w-full py-24"
      style={{ background: "#FCDD15" }}
      data-testid="section-platform-vision"
    >
      {isDesktop && <Circuit target={ref} />}

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-14">
          <h2 className="font-head text-4xl lg:text-5xl text-[#142984]">Platform Vision &amp; Mission</h2>
        </div>

        {/* Vision / Mission cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { h: "VISION", body: VISION },
            { h: "MISSION", body: MISSION },
          ].map((c, i) => (
            <motion.div
              key={c.h}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="glass glass-navy rounded-[28px] p-8 lg:p-10"
              data-testid={`card-${c.h.toLowerCase()}`}
            >
              <h3 className="font-head text-2xl text-center text-[#FCDD15] mb-5">{c.h}</h3>
              <p className="font-body text-base lg:text-lg leading-relaxed text-white">{c.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Platform subsection */}
        <div id="platform" className="mt-20 scroll-mt-28" data-testid="platform-subsection">
          <h3 className="font-head text-2xl lg:text-3xl text-[#142984] mb-6">PLATFORM</h3>
          {/* Purple-gradient glass box with empty 16:9 video placeholder (intentional one-off color) */}
          <div className="glass glass-purple rounded-[24px] p-3">
            <div className="w-full rounded-2xl" style={{ aspectRatio: "16 / 9" }} data-testid="video-placeholder">
              {/* empty framed video placeholder — no play button, no thumbnail, no text */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
