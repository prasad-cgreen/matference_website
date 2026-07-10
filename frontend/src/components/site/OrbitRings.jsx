import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Orbit rings around a circular illustration.
 * - Pills are positioned by exact polar coordinates each frame (constant radius, no drift).
 * - NO connector lines. Radii are large enough that pills never touch/overlap the circle.
 * - Outer captions at a larger fixed radius, inner captions at a smaller fixed radius.
 * - Constant rotation speed. Captions reveal one-by-one and stay permanent.
 */
export default function OrbitRings({
  children,
  outer = [],
  inner = [],
  theme = "navy",
  diameter = 200,
  animate = true,
  testid = "orbit",
  circleId = null,
  onAllRevealed = null,
}) {
  const ref = useRef(null);
  const boxRef = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const total = outer.length + inner.length;
  const [revealed, setRevealed] = useState(0);
  const [box, setBox] = useState(0);
  const allRevealed = revealed >= total;

  useLayoutEffect(() => {
    if (!animate) return;
    const measure = () => {
      if (boxRef.current) setBox(boxRef.current.clientWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (boxRef.current) ro.observe(boxRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [animate]);

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
          style={{ width: Math.min(diameter, 280), height: Math.min(diameter, 280) }}
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

  // Radii chosen so pills (nowrap) always clear the circle at every angle.
  const rInner = diameter / 2 + 92;
  const rOuter = diameter / 2 + 150;

  return (
    <div ref={ref} data-testid={testid} className="relative mx-auto w-full" style={{ maxWidth: rOuter * 2 + 180 }}>
      <div ref={boxRef} className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
        {/* fixed-radius ring guides */}
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

        {box > 0 && (
          <>
            <Ring items={outer} radius={rOuter} center={box / 2} dir="cw" theme={theme} revealed={revealed} offset={0} />
            <Ring items={inner} radius={rInner} center={box / 2} dir="ccw" theme={theme} revealed={revealed} offset={outer.length} />
          </>
        )}
      </div>
    </div>
  );
}

const DUR = 42; // seconds per full rotation (constant)

function Ring({ items, radius, center, dir, theme, revealed, offset }) {
  const pillRefs = useRef([]);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const sign = dir === "cw" ? 1 : -1;
    const base = items.map((_, i) => (2 * Math.PI * i) / items.length + (dir === "ccw" ? 0.6 : 0));
    const loop = (now) => {
      const theta = sign * (((now - start) / 1000) / DUR) * 2 * Math.PI;
      for (let i = 0; i < items.length; i++) {
        const a = base[i] + theta;
        const p = pillRefs.current[i];
        if (p) {
          p.style.left = center + radius * Math.cos(a) + "px";
          p.style.top = center + radius * Math.sin(a) + "px";
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [items, radius, center, dir]);

  return (
    <>
      {items.map((text, i) => (
        <div
          key={text}
          ref={(el) => (pillRefs.current[i] = el)}
          className="absolute"
          style={{
            transform: "translate(-50%, -50%)",
            opacity: offset + i < revealed ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          <CaptionPill text={text} theme={theme} />
        </div>
      ))}
    </>
  );
}

function CaptionPill({ text, theme }) {
  const isYellow = theme === "yellow";
  return (
    <span
      className="glass whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-body font-medium shadow-md"
      style={{
        background: isYellow ? "rgba(252,221,21,0.5)" : "rgba(20,41,132,0.35)",
        color: "#142984",
        border: isYellow ? "1px solid rgba(252,221,21,0.7)" : "1px solid rgba(20,41,132,0.5)",
      }}
    >
      {text}
    </span>
  );
}
