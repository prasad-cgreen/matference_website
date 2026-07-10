import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Orbit rings around a circular illustration.
 * - Pills are positioned by exact polar coordinates (cx + r·cosθ, cy + r·sinθ) each
 *   frame via requestAnimationFrame, so every pill holds a CONSTANT radius (no drift).
 * - The container is forced square and pills orbit its true center = the illustration center.
 * - Outer captions at a larger fixed radius, inner captions at a smaller fixed radius.
 * - Constant rotation speed. Captions reveal one-by-one and stay permanent.
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
  const boxRef = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const total = outer.length + inner.length;
  const [revealed, setRevealed] = useState(0);
  const [box, setBox] = useState(0);
  const allRevealed = revealed >= total;

  // Measure the square box size (its own rendered width) so the orbit center = illustration center.
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
  const rInner = Redge + 40;
  const rOuter = Redge + 96;

  return (
    <div ref={ref} data-testid={testid} className="relative mx-auto w-full" style={{ maxWidth: rOuter * 2 + 200 }}>
      {/* square box: height follows width so the true center == illustration center */}
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
            <Ring
              items={outer}
              radius={rOuter}
              redge={Redge}
              center={box / 2}
              box={box}
              dir="cw"
              theme={theme}
              revealed={revealed}
              offset={0}
            />
            <Ring
              items={inner}
              radius={rInner}
              redge={Redge}
              center={box / 2}
              box={box}
              dir="ccw"
              theme={theme}
              revealed={revealed}
              offset={outer.length}
            />
          </>
        )}
      </div>
    </div>
  );
}

const DUR = 42; // seconds per full rotation (constant)

function Ring({ items, radius, redge, center, box, dir, theme, revealed, offset }) {
  const pillRefs = useRef([]);
  const lineRefs = useRef([]);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const sign = dir === "cw" ? 1 : -1;
    const base = items.map((_, i) => (2 * Math.PI * i) / items.length + (dir === "ccw" ? 0.6 : 0));
    const loop = (now) => {
      const theta = sign * (((now - start) / 1000) / DUR) * 2 * Math.PI;
      for (let i = 0; i < items.length; i++) {
        const a = base[i] + theta;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const p = pillRefs.current[i];
        if (p) {
          p.style.left = center + radius * cos + "px";
          p.style.top = center + radius * sin + "px";
        }
        const l = lineRefs.current[i];
        if (l) {
          l.setAttribute("x1", center + redge * cos);
          l.setAttribute("y1", center + redge * sin);
          l.setAttribute("x2", center + radius * cos);
          l.setAttribute("y2", center + radius * sin);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [items, radius, redge, center, dir]);

  const lineColor = theme === "yellow" ? "rgba(252,221,21,0.9)" : "rgba(20,41,132,0.8)";

  return (
    <>
      <svg
        className="absolute left-0 top-0 pointer-events-none"
        width={box}
        height={box}
        viewBox={`0 0 ${box} ${box}`}
      >
        {items.map((_, i) => (
          <line
            key={i}
            ref={(el) => (lineRefs.current[i] = el)}
            stroke={lineColor}
            strokeWidth="2"
            style={{
              opacity: offset + i < revealed ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
          />
        ))}
      </svg>
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
        background: isYellow ? "rgba(252,221,21,0.5)" : "rgba(255,252,250,0.7)",
        color: "#142984",
        border: isYellow ? "1px solid rgba(252,221,21,0.7)" : "1px solid rgba(20,41,132,0.3)",
      }}
    >
      {text}
    </span>
  );
}
