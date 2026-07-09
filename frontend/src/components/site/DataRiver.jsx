import React, { useId, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// A scroll-tied segment of the two-lane bit-complement data river.
// - Reveal (path length) is tied to scroll progress over `target`.
// - Digits flow continuously (SMIL) regardless of scroll.
// - Reversible: scrolling up retracts the river exactly in reverse.
export default function DataRiver({
  d,
  viewW = 500,
  viewH = 700,
  target,
  offset = ["start end", "end start"],
  progressRange = [0, 1],
  bodyWidth = 34,
  className = "",
  style = {},
  stopAtEnd = false, // if true, once fully drawn it holds (no retract) — used sparingly
}) {
  const uid = useId().replace(/:/g, "");
  const { scrollYProgress } = useScroll({ target, offset });
  const pathLength = useTransform(scrollYProgress, progressRange, [0, 1], { clamp: true });
  const groupOpacity = useTransform(pathLength, [0, 0.03, 1], [0, 1, 1]);

  // bit lanes: lane2 is the exact bitwise complement of lane1
  const { lane1, lane2 } = useMemo(() => {
    let a = "";
    for (let i = 0; i < 260; i++) a += Math.random() > 0.5 ? "1" : "0";
    const b = a
      .split("")
      .map((c) => (c === "1" ? "0" : "1"))
      .join("");
    return { lane1: a, lane2: b };
  }, []);

  const laneWidth = bodyWidth + 22;

  return (
    <svg
      viewBox={`0 0 ${viewW} ${viewH}`}
      preserveAspectRatio="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <filter id={`blur-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.2" />
        </filter>
        <path id={`path-${uid}`} d={d} fill="none" />
        <mask id={`mask-${uid}`} maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width={viewW} height={viewH} fill="black" />
          <motion.path
            d={d}
            stroke="white"
            strokeWidth={laneWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength }}
          />
        </mask>
      </defs>

      <motion.g style={{ opacity: groupOpacity }}>
      {/* soft blurred outline */}
      <motion.path
        d={d}
        stroke="#0A0A12"
        strokeWidth={bodyWidth + 12}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.45"
        filter={`url(#blur-${uid})`}
        style={{ pathLength }}
      />
      {/* river body */}
      <motion.path
        d={d}
        stroke="#0B0B14"
        strokeWidth={bodyWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength }}
      />

      {/* digit lanes, revealed via mask */}
      <g mask={`url(#mask-${uid})`}>
        <text
          className="river-digits"
          fontSize="13"
          fill="#3E6B47"
          dy={-6}
          opacity="0.95"
        >
          <textPath href={`#path-${uid}`} startOffset="0">
            {lane1}
            <animate attributeName="startOffset" from="0" to="-160" dur="6s" repeatCount="indefinite" />
          </textPath>
        </text>
        <text
          className="river-digits"
          fontSize="13"
          fill="#2C5236"
          dy={12}
          opacity="0.95"
        >
          <textPath href={`#path-${uid}`} startOffset="0">
            {lane2}
            <animate attributeName="startOffset" from="0" to="-160" dur="6s" repeatCount="indefinite" />
          </textPath>
        </text>
      </g>
      </motion.g>
    </svg>
  );
}
