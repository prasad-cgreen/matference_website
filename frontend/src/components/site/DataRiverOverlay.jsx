import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

const BLUE = "#4DA6FF";
const LAV = "#B9A7F0";

function useMedia() {
  const [m, setM] = useState(() => ({
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    mobile: window.innerWidth < 768,
    tablet: window.innerWidth >= 768 && window.innerWidth < 1100,
  }));
  useEffect(() => {
    const on = () =>
      setM({
        reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        mobile: window.innerWidth < 768,
        tablet: window.innerWidth >= 768 && window.innerWidth < 1100,
      });
    window.addEventListener("resize", on);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener?.("change", on);
    return () => {
      window.removeEventListener("resize", on);
      mq.removeEventListener?.("change", on);
    };
  }, []);
  return m;
}

export default function DataRiverOverlay({ containerRef }) {
  const { reduced, mobile, tablet } = useMedia();
  const [geo, setGeo] = useState(null);
  const [progress, setProgress] = useState(0);
  const svgRef = useRef(null);
  const baseRef = useRef(null); // measurement path (getTotalLength / motionPath)
  const [len, setLen] = useState(0);
  const particlesRef = useRef([]);
  const rafRef = useRef();

  // Measure the shared container + both circles → build path geometry in px.
  useLayoutEffect(() => {
    const measure = () => {
      const wrap = containerRef.current;
      const u = document.querySelector('[data-testid="urban-scene-img"]');
      const r = document.querySelector('[data-testid="rural-scene-img"]');
      if (!wrap || !u || !r) return;
      const wr = wrap.getBoundingClientRect();
      const ur = u.getBoundingClientRect();
      const rr = r.getBoundingClientRect();
      const U = { x: ur.left - wr.left + ur.width / 2, y: ur.top - wr.top + ur.height / 2, R: ur.width / 2 };
      const R = { x: rr.left - wr.left + rr.width / 2, y: rr.top - wr.top + rr.height / 2, R: rr.width / 2 };
      setGeo({ W: wr.width, H: wr.height, U, R, mobile });
    };
    measure();
    const t1 = setTimeout(measure, 300);
    const t2 = setTimeout(measure, 1000);
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [containerRef, mobile]);

  // Scroll-tied progress across the shared container.
  useEffect(() => {
    const onScroll = () => {
      const wrap = containerRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.55; // begin drawing once container is ~half in view
      const total = rect.height - vh * 0.5;
      const scrolled = start - rect.top;
      const p = Math.min(1, Math.max(0, scrolled / Math.max(1, total)));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [containerRef]);

  // Build the river path string.
  const d = geo ? buildPath(geo) : "";

  // Measure total length once the path exists.
  useEffect(() => {
    if (baseRef.current) {
      try {
        setLen(baseRef.current.getTotalLength());
      } catch (e) {}
    }
  }, [d]);

  const source = geo ? sourcePoint(geo) : null;
  const arrival = geo ? arrivalPoint(geo) : null;

  // Particle animation via GSAP MotionPath, masked to the revealed portion.
  useEffect(() => {
    if (reduced || !baseRef.current || !d) return;
    const count = mobile ? 8 : tablet ? 13 : 22;
    const tweens = [];
    const nodes = particlesRef.current.slice(0, count);
    nodes.forEach((node, i) => {
      if (!node) return;
      const dur = gsap.utils.random(5.5, 9);
      const delay = gsap.utils.random(0, dur);
      const tw = gsap.to(node, {
        duration: dur,
        delay,
        repeat: -1,
        ease: "none",
        motionPath: { path: baseRef.current, align: baseRef.current, alignOrigin: [0.5, 0.5] },
        onUpdate: function () {
          const p = this.progress();
          // color blue-white → lavender-white
          node.setAttribute("fill", lerpColor(BLUE, LAV, p));
          // fade out shortly after entering rural end
          node.style.opacity = p < 0.05 ? p / 0.05 : p > 0.9 ? Math.max(0, (1 - p) / 0.1) : 0.95;
        },
      });
      tweens.push(tw);
    });
    return () => tweens.forEach((t) => t.kill());
  }, [reduced, d, mobile, tablet]);

  if (!geo || !d) {
    return (
      <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }} aria-hidden="true" data-testid="data-river-overlay" />
    );
  }

  const dashOffset = len * (1 - progress);
  const particleCount = mobile ? 8 : tablet ? 13 : 22;
  const mainW = mobile ? 4 : 7;

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${geo.W} ${geo.H}`}
      preserveAspectRatio="none"
      style={{ zIndex: 5 }}
      aria-hidden="true"
      data-testid="data-river-overlay"
    >
      <defs>
        <linearGradient id="riverGrad" gradientUnits="userSpaceOnUse" x1={geo.U.x} y1={geo.U.y} x2={geo.R.x} y2={geo.R.y}>
          <stop offset="0%" stopColor={BLUE} />
          <stop offset="55%" stopColor="#8FA8F5" />
          <stop offset="100%" stopColor={LAV} />
        </linearGradient>
        <filter id="riverSoft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={mobile ? 3 : 6} />
        </filter>
        <filter id="riverGlowSoft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <radialGradient id="srcGlow">
          <stop offset="0%" stopColor="#DCEBFF" stopOpacity="0.95" />
          <stop offset="45%" stopColor={BLUE} stopOpacity="0.5" />
          <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="arrGlow">
          <stop offset="0%" stopColor="#F2ECFF" stopOpacity="0.95" />
          <stop offset="45%" stopColor={LAV} stopOpacity="0.5" />
          <stop offset="100%" stopColor={LAV} stopOpacity="0" />
        </radialGradient>
        {/* reveal mask: only the scroll-revealed portion is white */}
        <mask id="riverReveal" maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width={geo.W} height={geo.H} fill="black" />
          <path
            d={d}
            stroke="white"
            strokeWidth={mobile ? 34 : 60}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={len}
            strokeDashoffset={dashOffset}
          />
        </mask>
      </defs>

      {/* hidden measurement path (also used by GSAP MotionPath) */}
      <path ref={baseRef} d={d} fill="none" stroke="none" />

      {/* ---- BASE STRANDS (scroll-revealed via dashoffset) ---- */}
      {/* outer glow underlay */}
      <path
        d={d}
        fill="none"
        stroke="url(#riverGrad)"
        strokeWidth={mainW + 14}
        strokeLinecap="round"
        opacity="0.35"
        filter="url(#riverGlowSoft)"
        strokeDasharray={len}
        strokeDashoffset={dashOffset}
      />
      {/* thin dim wisps */}
      {[-9, 11].map((off, i) => (
        <path
          key={off}
          d={d}
          fill="none"
          stroke="url(#riverGrad)"
          strokeWidth={mobile ? 1.5 : 2.4}
          strokeLinecap="round"
          opacity={0.45}
          filter="url(#riverSoft)"
          transform={`translate(0 ${off})`}
          strokeDasharray={len}
          strokeDashoffset={dashOffset}
        />
      ))}
      {/* bright central strand */}
      <path
        d={d}
        fill="none"
        stroke="url(#riverGrad)"
        strokeWidth={mainW}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={dashOffset}
      />

      {/* ---- FLOWING + PARTICLE LAYERS, clipped to revealed portion ---- */}
      <g mask="url(#riverReveal)">
        {!reduced &&
          [{ w: mainW * 0.5, dash: "2 26", dur: 6 }, { w: mainW * 0.32, dash: "2 40", dur: 7.5 }].map((s, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={s.w}
              strokeLinecap="round"
              opacity="0.85"
              style={{
                strokeDasharray: s.dash,
                animation: `river-flow-move ${s.dur}s linear infinite`,
              }}
            />
          ))}

        {/* particles */}
        {!reduced &&
          Array.from({ length: particleCount }).map((_, i) => {
            const kind = i % 5;
            const r = gsap.utils ? 1.4 + (i % 3) * 0.9 : 2;
            if (kind === 3) {
              // short light dash
              return (
                <rect
                  key={i}
                  ref={(el) => (particlesRef.current[i] = el)}
                  width={7}
                  height={2}
                  rx={1}
                  fill={BLUE}
                  opacity="0"
                />
              );
            }
            if (kind === 4) {
              // four-point sparkle
              return (
                <path
                  key={i}
                  ref={(el) => (particlesRef.current[i] = el)}
                  d="M0,-5 L1.1,-1.1 L5,0 L1.1,1.1 L0,5 L-1.1,1.1 L-5,0 L-1.1,-1.1 Z"
                  fill="#FFFFFF"
                  opacity="0"
                />
              );
            }
            return (
              <circle
                key={i}
                ref={(el) => (particlesRef.current[i] = el)}
                r={r}
                fill={BLUE}
                opacity="0"
              />
            );
          })}
      </g>

      {/* ---- ENDPOINT GLOWS ---- */}
      {source && (
        <circle
          cx={source.x}
          cy={source.y}
          r={mobile ? 26 : 46}
          fill="url(#srcGlow)"
          style={{
            opacity: progress > 0.02 ? 1 : 0,
            transition: "opacity 0.5s ease",
            transformOrigin: `${source.x}px ${source.y}px`,
            animation: reduced ? "none" : "river-pulse-src 3s ease-in-out infinite",
          }}
        />
      )}
      {arrival && (
        <circle
          cx={arrival.x}
          cy={arrival.y}
          r={mobile ? 24 : 42}
          fill="url(#arrGlow)"
          style={{
            opacity: progress > 0.85 ? 1 : 0,
            transition: "opacity 0.6s ease",
            transformOrigin: `${arrival.x}px ${arrival.y}px`,
            animation: reduced ? "none" : "river-pulse-arr 3s ease-in-out infinite",
          }}
        />
      )}
    </svg>
  );
}

/* ---------- geometry helpers ---------- */
function sourcePoint({ U }) {
  return { x: U.x - U.R * 0.32, y: U.y + U.R * 0.34 };
}
function arrivalPoint({ R }) {
  return { x: R.x - R.R * 0.05, y: R.y - R.R * 0.08 };
}
function buildPath(geo) {
  if (geo.mobile) {
    // simple vertical connector down the shared gap
    const S = sourcePoint(geo);
    const E = arrivalPoint(geo);
    const midY = (S.y + E.y) / 2;
    return `M ${S.x} ${S.y} C ${S.x - 30} ${midY - 40}, ${E.x + 30} ${midY + 40}, ${E.x} ${E.y}`;
  }
  const S = sourcePoint(geo);
  const E = arrivalPoint(geo);
  const dx = S.x - E.x; // >0 urban is right of rural
  const dy = E.y - S.y; // >0 rural below
  // pronounced leftward sweep that bows out past the rural x before curving in
  const M = { x: Math.min(S.x - dx * 0.72, E.x - geo.R.R * 0.35), y: S.y + dy * 0.5 };
  const cp1 = { x: S.x - dx * 0.30, y: S.y + dy * 0.04 };
  const cp2 = { x: M.x + dx * 0.22, y: M.y - dy * 0.22 };
  const cp3 = { x: M.x - dx * 0.06, y: M.y + dy * 0.2 };
  const cp4 = { x: E.x - geo.R.R * 0.7, y: E.y + dy * 0.02 };
  return `M ${S.x} ${S.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${M.x} ${M.y} C ${cp3.x} ${cp3.y}, ${cp4.x} ${cp4.y}, ${E.x} ${E.y}`;
}

function lerpColor(a, b, t) {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  // blend toward white for the glowing look
  const w = c.map((v) => Math.round(v + (255 - v) * 0.35));
  return `rgb(${w[0]},${w[1]},${w[2]})`;
}
