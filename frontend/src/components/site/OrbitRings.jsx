import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Orbit rings around a circular illustration.
 * - Outer captions ride a fixed outer radius; inner captions a fixed smaller radius.
 * - Constant rotation speed (no speed changes) so radius never drifts and pills never wobble.
 * - Captions reveal one-by-one and stay permanent.
 * - `circleId` marks the circle element so the single page-level river can anchor to it.
 */
export default function OrbitRings({
  children,
  outer = [],
  inner = [],
  theme = "navy",
  diameter = 280,
  animate = true,
  testid = "orbit",
  circleId = null,
  onAllRevealed = null,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const total = outer.length + inner.length;
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

  useEffect(() => {
    if (allRevealed && onAllRevealed) onAllRevealed();
  }, [allRevealed, onAllRevealed]);

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
          {[...outer, ...inner].map((c) => (
            <CaptionPill key={c} text={c} theme={theme} />
          ))}
        </div>
      </div>
    );
  }

  const Redge = diameter / 2;
  const rInner = Redge + 36; // fixed inner radius
  const rOuter = Redge + 84; // fixed outer radius
  const pad = 94; // room for pills beyond the outer radius
  const container = diameter + 2 * (rOuter - Redge + pad);
  const DUR = 42; // constant rotation period (seconds) — never changes

  // One ring at a constant radius. Captions + connectors stay at that exact radius.
  const renderRing = (items, radius, dir, offset) => {
    const revDir = dir === "cw" ? "cw-rev" : "ccw-rev";
    return (
      <div
        className="absolute left-1/2 top-1/2"
        style={{ width: 0, height: 0, animation: `orbit-${dir} ${DUR}s linear infinite` }}
      >
        {items.map((text, i) => {
          const angle = (360 / items.length) * i + (dir === "ccw" ? 40 : 0);
          const show = offset + i < revealed;
          return (
            <div
              key={text}
              className="absolute"
              style={{ left: 0, top: 0, transform: `rotate(${angle}deg) translateY(-${radius}px)` }}
            >
              {/* connector: circle edge -> caption (starts exactly at the circumference) */}
              <div
                className="absolute left-1/2"
                style={{
                  width: "2px",
                  height: radius - Redge,
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
              {/* keep pill upright while orbiting (counter-spin, same constant period) */}
              <div style={{ transform: `rotate(${-angle}deg)` }}>
                <div style={{ animation: `orbit-${revDir} ${DUR}s linear infinite` }}>
                  <div
                    style={{
                      transform: "translate(-50%, -50%)",
                      opacity: show ? 1 : 0,
                      transition: "opacity 0.5s ease",
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
    );
  };

  return (
    <div
      ref={ref}
      data-testid={testid}
      className="relative mx-auto"
      style={{ width: container, height: container, maxWidth: "100%" }}
    >
      {/* faint fixed-radius ring guides */}
      {[rInner, rOuter].map((rr) => (
        <div
          key={rr}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: rr * 2,
            height: rr * 2,
            transform: "translate(-50%,-50%)",
            border: `1px dashed ${theme === "yellow" ? "rgba(252,221,21,0.25)" : "rgba(20,41,132,0.16)"}`,
          }}
        />
      ))}

      {/* central illustration circle (anchor for the single page-level river) */}
      <div
        {...(circleId ? { "data-river-anchor": circleId } : {})}
        className="absolute left-1/2 top-1/2 rounded-full overflow-hidden shadow-2xl border border-white/50 z-10"
        style={{ width: diameter, height: diameter, transform: "translate(-50%,-50%)" }}
      >
        {children}
      </div>

      {renderRing(outer, rOuter, "cw", 0)}
      {renderRing(inner, rInner, "ccw", outer.length)}
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
