import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Orbit rings around a circular illustration.
 * - Two rings rotate in opposite directions.
 * - Captions reveal one-by-one (fast), stay permanent, then rotation slows.
 * - On non-desktop (animate=false) shows static illustration + caption chips.
 */
export default function OrbitRings({
  children,
  outer = [],
  inner = [],
  theme = "navy", // caption pill accent
  diameter = 340,
  animate = true,
  testid = "orbit",
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

  const container = diameter + 280;
  const center = container / 2;
  const rInner = diameter / 2 + 40;
  const rOuter = diameter / 2 + 108;
  const dur = allRevealed ? 90 : 26;

  const renderRing = (items, radius, dir, offset) => (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        width: 0,
        height: 0,
        animation: `orbit-${dir} ${dur}s linear infinite`,
      }}
    >
      {items.map((text, i) => {
        const globalIndex = offset + i;
        const angle = (360 / items.length) * i + (dir === "ccw" ? 30 : 0);
        const show = globalIndex < revealed;
        const revDir = dir === "cw" ? "cw-rev" : "ccw-rev";
        return (
          <div
            key={text}
            className="absolute"
            style={{
              left: 0,
              top: 0,
              transform: `rotate(${angle}deg) translateY(-${radius}px)`,
            }}
          >
            {/* connector line back to center */}
            <div
              className="absolute left-1/2"
              style={{
                width: "1.5px",
                height: radius,
                top: 0,
                transform: "translateX(-50%)",
                background:
                  theme === "yellow"
                    ? "linear-gradient(to bottom, rgba(252,221,21,0.9), rgba(252,221,21,0))"
                    : "linear-gradient(to bottom, rgba(20,41,132,0.7), rgba(20,41,132,0))",
                opacity: show ? 1 : 0,
                transition: "opacity 0.5s ease",
              }}
            />
            {/* counter-rotate to keep upright */}
            <div style={{ transform: `rotate(${-angle}deg)` }}>
              <div style={{ animation: `orbit-${revDir} ${dur}s linear infinite` }}>
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
  );

  return (
    <div
      ref={ref}
      data-testid={testid}
      className="relative mx-auto"
      style={{ width: container, height: container, maxWidth: "100%" }}
    >
      {/* faint ring guides */}
      <div
        className="absolute left-1/2 top-1/2 rounded-full border border-current/10"
        style={{
          width: rInner * 2,
          height: rInner * 2,
          transform: "translate(-50%,-50%)",
          borderColor: theme === "yellow" ? "rgba(252,221,21,0.25)" : "rgba(20,41,132,0.18)",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: rOuter * 2,
          height: rOuter * 2,
          transform: "translate(-50%,-50%)",
          border: `1px dashed ${theme === "yellow" ? "rgba(252,221,21,0.22)" : "rgba(20,41,132,0.15)"}`,
        }}
      />

      {/* central illustration circle */}
      <div
        className="absolute left-1/2 top-1/2 rounded-full overflow-hidden shadow-2xl border border-white/50"
        style={{ width: diameter, height: diameter, transform: "translate(-50%,-50%)" }}
      >
        {children}
      </div>

      {renderRing(inner, rInner, "ccw", 0)}
      {renderRing(outer, rOuter, "cw", inner.length)}
    </div>
  );
}

function CaptionPill({ text, theme }) {
  const isYellow = theme === "yellow";
  return (
    <span
      className="glass whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-body font-medium shadow-md"
      style={{
        background: isYellow ? "rgba(252,221,21,0.22)" : "rgba(255,252,250,0.55)",
        color: "#142984",
        border: isYellow ? "1px solid rgba(252,221,21,0.6)" : "1px solid rgba(20,41,132,0.25)",
      }}
    >
      {text}
    </span>
  );
}
