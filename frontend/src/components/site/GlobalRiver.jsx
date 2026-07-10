import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

/**
 * THE ONE river. A single continuous SVG path element for the whole page.
 * It anchors to the real DOM positions of the urban circle (origin), the rural
 * circle (morph zone), and the cGreen logo (termination). There is never more
 * than one river instance on the page.
 *
 * - Reveal (path length) is tied to scroll between origin and logo.
 * - Digits animate continuously (SMIL) regardless of scroll.
 * - Inside the rural circle the green path is masked out so the illustration's
 *   natural blue river shows through (morph); it reappears exactly at the edge.
 * - `ready` gates the river until the hero orbit captions have finished revealing.
 */
export default function GlobalRiver({ ready }) {
  const [geo, setGeo] = useState(null);
  const progress = useMotionValue(0);
  const rafRef = useRef();

  // Measure anchor elements in absolute page coordinates (scroll-invariant).
  useEffect(() => {
    const measure = () => {
      const u = document.querySelector('[data-river-anchor="urban"]');
      const r = document.querySelector('[data-river-anchor="rural"]');
      const l = document.querySelector('[data-river-anchor="logo"]');
      if (!u || !r || !l) {
        setGeo(null);
        return;
      }
      const sx = window.scrollX;
      const sy = window.scrollY;
      const ur = u.getBoundingClientRect();
      const rr = r.getBoundingClientRect();
      const lr = l.getBoundingClientRect();
      const origin = { x: ur.left + sx + ur.width / 2, y: ur.top + sy + ur.height };
      const rural = {
        x: rr.left + sx + rr.width / 2,
        y: rr.top + sy + rr.height / 2,
        R: rr.width / 2,
      };
      const logo = { x: lr.left + sx + lr.width / 2, y: lr.top + sy + lr.height / 2 };
      const docW = document.documentElement.scrollWidth;
      setGeo({ origin, rural, logo, docW, height: logo.y + 120 });
    };
    const schedule = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(measure);
    };
    measure();
    const t1 = setTimeout(measure, 400);
    const t2 = setTimeout(measure, 1200);
    window.addEventListener("resize", schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("resize", schedule);
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Scroll → path progress between origin and logo.
  useEffect(() => {
    const onScroll = () => {
      if (!geo || !ready) {
        progress.set(0);
        return;
      }
      const vh = window.innerHeight;
      const startY = geo.origin.y - vh * 0.8;
      const endY = geo.logo.y - vh * 0.45;
      const p = (window.scrollY - startY) / Math.max(1, endY - startY);
      progress.set(Math.min(1, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [geo, ready, progress]);

  // Two lanes: lane2 is the exact bitwise complement of lane1.
  const { lane1, lane2 } = useMemo(() => {
    let a = "";
    for (let i = 0; i < 600; i++) a += Math.random() > 0.5 ? "1" : "0";
    const b = a.split("").map((c) => (c === "1" ? "0" : "1")).join("");
    return { lane1: a, lane2: b };
  }, []);

  const d = useMemo(() => {
    if (!geo) return "";
    const { origin: o, rural: r, logo: l } = geo;
    const k = r.R * 0.707;
    const entry = { x: r.x - k, y: r.y - k }; // top-left edge of rural circle
    const exit = { x: r.x + k, y: r.y + k }; // bottom-right edge of rural circle
    const m1x = (o.x + entry.x) / 2;
    const m1y = (o.y + entry.y) / 2;
    const m2x = (exit.x + l.x) / 2;
    const m2y = (exit.y + l.y) / 2;
    return [
      `M ${o.x} ${o.y}`,
      `C ${o.x - 60} ${o.y + 90}, ${m1x + 90} ${m1y - 60}, ${m1x} ${m1y}`,
      `S ${entry.x - 50} ${entry.y - 30}, ${entry.x} ${entry.y}`,
      `L ${r.x} ${r.y}`,
      `L ${exit.x} ${exit.y}`,
      `C ${exit.x + 70} ${exit.y + 70}, ${m2x - 90} ${m2y - 50}, ${m2x} ${m2y}`,
      `S ${l.x + 60} ${l.y - 80}, ${l.x} ${l.y}`,
    ].join(" ");
  }, [geo]);

  if (!geo || !d) return null;

  const bodyWidth = 30;
  const laneWidth = bodyWidth + 22;

  return (
    <svg
      width={geo.docW}
      height={geo.height}
      viewBox={`0 0 ${geo.docW} ${geo.height}`}
      className="absolute left-0 top-0 pointer-events-none"
      style={{ zIndex: 5 }}
      aria-hidden="true"
      data-testid="global-river"
    >
      <defs>
        <filter id="river-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.2" />
        </filter>
        <path id="river-path" d={d} fill="none" />
        <mask id="river-mask" maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width={geo.docW} height={geo.height} fill="black" />
          {/* reveal by scroll progress */}
          <motion.path
            d={d}
            stroke="white"
            strokeWidth={laneWidth}
            fill="none"
            strokeLinecap="butt"
            strokeLinejoin="round"
            style={{ pathLength: progress }}
          />
          {/* hole: hide the path inside the rural circle so the blue village river shows (morph) */}
          <circle cx={geo.rural.x} cy={geo.rural.y} r={geo.rural.R} fill="black" />
        </mask>
      </defs>

      <g mask="url(#river-mask)">
        {/* soft-blurred outline */}
        <path
          d={d}
          stroke="#0A0A12"
          strokeWidth={bodyWidth + 12}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.4"
          filter="url(#river-blur)"
        />
        {/* river body */}
        <path
          d={d}
          stroke="#0B0B14"
          strokeWidth={bodyWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Lane 1 (forward) */}
        <text className="river-digits" fontSize="13" fill="#4C7E5B" dy={-6} opacity="0.98">
          <textPath href="#river-path" startOffset="0">
            {lane1}
            <animate attributeName="startOffset" from="0" to="-160" dur="6s" repeatCount="indefinite" />
          </textPath>
        </text>
        {/* Lane 2 (bitwise complement of Lane 1) */}
        <text className="river-digits" fontSize="13" fill="#3C6A4B" dy={12} opacity="0.98">
          <textPath href="#river-path" startOffset="0">
            {lane2}
            <animate attributeName="startOffset" from="0" to="-160" dur="6s" repeatCount="indefinite" />
          </textPath>
        </text>
      </g>
    </svg>
  );
}
