import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Orbit ring around a circular illustration.
 * - Captions sit on a single ring at one radius so every connector line is the
 *   SAME length and originates exactly at the circle's edge (clean radial burst).
 * - Captions reveal one-by-one (fast), stay permanent, then rotation slows.
 * - `circleId` marks the circle element so the single page-level river can anchor to it.
 * - On non-desktop (animate=false) shows static illustration + caption chips.
 */
export default function OrbitRings({
  children,
  outer = [],
  inner = [],
  theme = "navy",
  diameter = 300,
  animate = true,
  testid = "orbit",
  circleId = null,
  onAllRevealed = null,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const items = [...outer, ...inner];
  const total = items.length;
  const [revealed, setRevealed] = useState(0);
  const allRevealed = revealed >= total;

  useEffect(() => {
    if (!animate || !inView) return;
    const id = setInterval(() => {
      setRevealed((r) => {
        const next = Math.min(total, r + 1);
        if (next >= total) clearInterval(id);
        return next;
      });
    }, 320);
    return () => clearInterval(id);
  }, [animate, inView, total]);

  // Notify once all captions have revealed (gates the page river).
  useEffect(() => {
    if (allRevealed && onAllRevealed) onAllRevealed();
  }, [allRevealed, onAllRevealed]);

  // If not animated (mobile), consider captions "revealed" immediately for gating.
  useEffect(() => {
    if (!animate && onAllRevealed) onAllRevealed();
  }, [animate, onAllRevealed]);

  // Static (mobile) fallback: everything visible, no orbit.
  if (!animate) {
    return (
      <div ref={ref} data-testid={`${testid}-static`} className="flex flex-col items-center gap-6">
        <div
          className="rounded-full overflow-hidden border border-white/40 shadow-xl"
          style={{ width: Math.min(diameter, 300), height: Math.min(diameter, 300) }}
        >
          {children}
        </div>
        <div className="flex flex-wrap justify-center gap-2 max-w-md">
          {items.map((c) => (
            <CaptionPill key={c} text={c} theme={theme} />
          ))}
        </div>
      </div>
    );
  }

  const L = 48; // connector length — identical for every caption
  const pad = 96; // room for pills beyond the caption radius
  const Redge = diameter / 2;
  const R = Redge + L; // caption radius (single ring)
  const container = diameter + 2 * (L + pad);
  const dur = allRevealed ? 90 : 26;

  return (
    <div
      ref={ref}
      data-testid={testid}
      className="relative mx-auto"
      style={{ width: container, height: container, maxWidth: "100%" }}
    >
      {/* faint ring guide at the caption radius */}
      <div
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: R * 2,
          height: R * 2,
          transform: "translate(-50%,-50%)",
          border: `1px dashed ${theme === "yellow" ? "rgba(252,221,21,0.28)" : "rgba(20,41,132,0.18)"}`,
        }}
      />

      {/* central illustration circle (anchor for the single page-level river) */}
      <div
        {...(circleId ? { "data-river-anchor": circleId } : {})}
        className="absolute left-1/2 top-1/2 rounded-full overflow-hidden shadow-2xl border border-white/50 z-10"
        style={{ width: diameter, height: diameter, transform: "translate(-50%,-50%)" }}
      >
        {children}
      </div>

      {/* single rotating ring of captions */}
      <div
        className="absolute left-1/2 top-1/2 z-20"
        style={{ width: 0, height: 0, animation: `orbit-cw ${dur}s linear infinite` }}
      >
        {items.map((text, i) => {
          const angle = (360 / total) * i;
          const show = i < revealed;
          return (
            <div
              key={text}
              className="absolute"
              style={{ left: 0, top: 0, transform: `rotate(${angle}deg) translateY(-${R}px)` }}
            >
              {/* connector: from circle edge (bottom end) out to the caption — length L for all */}
              <div
                className="absolute left-1/2"
                style={{
                  width: "2px",
                  height: L,
                  top: 0,
                  transform: "translateX(-50%)",
                  background:
                    theme === "yellow"
                      ? "linear-gradient(to bottom, rgba(252,221,21,0), rgba(252,221,21,0.95))"
                      : "linear-gradient(to bottom, rgba(20,41,132,0), rgba(20,41,132,0.85))",
                  opacity: show ? 1 : 0,
                  transition: "opacity 0.5s ease",
                }}
              />
              {/* keep the pill upright while it orbits */}
              <div style={{ transform: `rotate(${-angle}deg)` }}>
                <div style={{ animation: `orbit-cw-rev ${dur}s linear infinite` }}>
                  <div
                    style={{
                      transform: "translate(-50%, -50%)",
                      opacity: show ? 1 : 0,
                      scale: show ? "1" : "0.6",
                      transition: "opacity 0.5s ease, scale 0.5s ease",
                    }}
                  >
                    <CaptionPill text={text} theme={theme} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CaptionPill({ text, theme }) {
  const isYellow = theme === "yellow";
  return (
    <span
      className="glass whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-body font-medium shadow-md"
      style={{
        background: isYellow ? "rgba(252,221,21,0.5)" : "rgba(255,252,250,0.7)",
        color: "#142984",
        border: isYellow ? "1px solid rgba(252,221,21,0.7)" : "1px solid rgba(20,41,132,0.3)",
      }}
    >
      {text}
    </span>
  );
}
