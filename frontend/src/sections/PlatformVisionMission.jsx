import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { VISION, MISSION } from "@/data/site";
import { useIsDesktop } from "@/hooks/useResponsive";

// Pale grey-blue shades for inactive bars; one saturated blue for the "active" bar.
const SHADES = ["#C2CBDA", "#AEB9CC", "#9FB0C6", "#B7C1D2", "#A6B2C8"];
const BRANCH = "#7C8CA6";
const ACTIVE = "#2E6BB8";

function Bars({ cx, baseY, heights, active }) {
  const w = 4;
  const gap = 7;
  const totalW = heights.length * w + (heights.length - 1) * gap;
  let x = cx - totalW / 2;
  return (
    <g>
      {heights.map((h, i) => {
        const rect = (
          <rect
            key={i}
            x={x}
            y={baseY - h}
            width={w}
            height={h}
            rx={2}
            fill={i === active ? ACTIVE : SHADES[i % SHADES.length]}
            className={i === active ? "eq-active" : ""}
          />
        );
        x += w + gap;
        return rect;
      })}
    </g>
  );
}

// Equalizer-style signal that fans/branches from the logo down into both cards.
function EqualizerCircuit({ target }) {
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "center center"] });
  const len = useTransform(scrollYProgress, [0, 1], [0, 1], { clamp: true });

  // Branch lines fanning from the origin (top-center) to each card top-center.
  const branches = [
    "M 500 8 C 500 60 250 70 250 130 C 250 165 250 175 250 198",
    "M 500 8 C 500 60 750 70 750 130 C 750 165 750 175 750 198",
    "M 500 8 C 480 60 360 90 300 150 C 275 178 262 188 250 198",
    "M 500 8 C 520 60 640 90 700 150 C 725 178 738 188 750 198",
  ];

  return (
    <svg
      viewBox="0 0 1000 210"
      preserveAspectRatio="none"
      className="absolute left-0 top-0 w-full h-[190px] pointer-events-none"
      aria-hidden="true"
    >
      {/* faint concentric dotted arcs radiating from the origin */}
      <motion.g style={{ opacity: len }}>
        {[70, 120, 170, 220, 270].map((r) => (
          <circle
            key={r}
            cx="500"
            cy="0"
            r={r}
            fill="none"
            stroke="#AEB9CC"
            strokeWidth="1"
            strokeDasharray="2 9"
            opacity="0.45"
          />
        ))}
      </motion.g>

      {/* branch lines */}
      {branches.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke={BRANCH}
          strokeWidth={i < 2 ? 2 : 1.4}
          strokeLinecap="round"
          opacity={i < 2 ? 0.9 : 0.5}
          style={{ pathLength: len }}
        />
      ))}

      {/* equalizer bar clusters along the signal path */}
      <motion.g style={{ opacity: len }}>
        <Bars cx={500} baseY={54} heights={[12, 22, 34, 46, 34, 22, 12]} active={3} />
        <Bars cx={360} baseY={120} heights={[10, 18, 28, 20, 12]} active={2} />
        <Bars cx={640} baseY={120} heights={[10, 18, 28, 20, 12]} active={2} />
        <Bars cx={250} baseY={196} heights={[14, 24, 36, 24, 14]} active={2} />
        <Bars cx={750} baseY={196} heights={[14, 24, 36, 24, 14]} active={2} />
      </motion.g>

      {/* plug nodes where the signal terminates at each card */}
      <motion.g style={{ opacity: len }}>
        {[250, 750].map((x) => (
          <g key={x}>
            <circle cx={x} cy="202" r="6" fill={ACTIVE} />
            <circle cx={x} cy="202" r="10" fill="none" stroke={ACTIVE} strokeWidth="1.5" opacity="0.5" />
          </g>
        ))}
      </motion.g>
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
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-8">
          <h2 className="font-head text-4xl lg:text-5xl text-[#142984]">Platform Vision &amp; Mission</h2>
        </div>

        {/* Circuit + cards wrapper: circuit terminates at the two card tops */}
        <div className="relative pt-0 md:pt-[190px]">
          {isDesktop && <EqualizerCircuit target={ref} />}

          <div className="grid md:grid-cols-2 gap-8 relative z-10">
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
