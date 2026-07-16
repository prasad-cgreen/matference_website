import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Constellation of factor dots around a circular illustration.
 * - Resting: dim, unlabeled glowing dots on two orbit rings, gently twinkling.
 * - Reveal: hovering within proximity (desktop), focusing (keyboard) or tapping
 *   (mobile) brightens the dot and slides in a connector + label tooltip.
 * - Positions are updated each frame; on desktop the rings slowly rotate.
 */

const DUR = 60; // seconds per full rotation (slow, calm)
const slug = (s) => s.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

function ringRadii(box, diameter) {
  const half = box / 2;
  const circleR = diameter / 2;
  const band = Math.max(28, half - circleR);
  return {
    rInner: circleR + band * 0.42,
    rOuter: circleR + band * 0.82,
  };
}

function Constellation({ items, box, diameter, animate, theme, testid }) {
  const hostRef = useRef(null);
  const wrapRefs = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999, inside: false });
  const focusSet = useRef(new Set());
  const tapSet = useRef(new Set());

  useEffect(() => {
    let raf;
    const start = performance.now();
    const loop = (now) => {
      const half = box / 2;
      const { rInner, rOuter } = ringRadii(box, diameter);
      const t = animate ? (((now - start) / 1000) / DUR) * 2 * Math.PI : 0;
      const TH2 = 36 * 36;
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        const r = it.ring === "outer" ? rOuter : rInner;
        const dir = it.ring === "outer" ? 1 : -1;
        const a = it.base + dir * t;
        const x = half + r * Math.cos(a);
        const y = half + r * Math.sin(a);
        const el = wrapRefs.current[i];
        if (!el) continue;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.dataset.side = x >= half ? "right" : "left";
        let active = focusSet.current.has(i) || tapSet.current.has(i);
        if (!active && mouseRef.current.inside) {
          const dx = x - mouseRef.current.x;
          const dy = y - mouseRef.current.y;
          active = dx * dx + dy * dy <= TH2;
        }
        el.classList.toggle("is-active", active);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [items, box, diameter, animate]);

  const onMove = (e) => {
    const host = hostRef.current;
    if (!host) return;
    const r = host.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top, inside: true };
  };
  const onLeave = () => {
    mouseRef.current.inside = false;
  };
  const toggleTap = (i) => {
    if (tapSet.current.has(i)) tapSet.current.delete(i);
    else tapSet.current.add(i);
  };
  const onHostClick = (e) => {
    if (e.target === hostRef.current) tapSet.current.clear();
  };

  return (
    <div
      ref={hostRef}
      className="absolute inset-0"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onHostClick}
      data-testid={`${testid}-constellation`}
    >
      {items.map((it, i) => (
        <button
          key={it.label}
          type="button"
          ref={(el) => (wrapRefs.current[i] = el)}
          className={`orbit-dot orbit-dot-${theme} absolute`}
          style={{ transform: "translate(-50%, -50%)" }}
          data-testid={`orbit-dot-${slug(it.label)}`}
          aria-label={it.label}
          onClick={() => toggleTap(i)}
          onFocus={() => focusSet.current.add(i)}
          onBlur={() => focusSet.current.delete(i)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleTap(i);
            }
          }}
        >
          <span className="orbit-dot-core" style={{ animationDelay: `${((i * 0.73) % 4).toFixed(2)}s` }} />
          <span className="orbit-connector" />
          <span className="orbit-tooltip font-body">{it.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function OrbitRings({
  children,
  outer = [],
  inner = [],
  theme = "navy",
  diameter = 200,
  animate = true,
  testid = "orbit",
}) {
  const boxRef = useRef(null);
  const [box, setBox] = useState(0);

  useEffect(() => {
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
  }, []);

  const items = useMemo(() => {
    const o = outer.map((label, i) => ({ label, ring: "outer", base: (2 * Math.PI * i) / Math.max(1, outer.length) }));
    const n = inner.map((label, i) => ({ label, ring: "inner", base: (2 * Math.PI * i) / Math.max(1, inner.length) + 0.6 }));
    return [...o, ...n];
  }, [outer, inner]);

  const { rInner, rOuter } = box > 0 ? ringRadii(box, diameter) : { rInner: 0, rOuter: 0 };

  return (
    <div data-testid={testid} className="relative mx-auto w-full" style={{ maxWidth: diameter + 240 }}>
      <div ref={boxRef} className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
        {/* orbit ring guides */}
        {box > 0 &&
          [rInner, rOuter].map((rr) => (
            <div
              key={rr}
              className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
              style={{
                width: rr * 2,
                height: rr * 2,
                transform: "translate(-50%,-50%)",
                border: `1px dashed ${theme === "yellow" ? "rgba(252,221,21,0.28)" : "rgba(20,41,132,0.16)"}`,
              }}
            />
          ))}

        {/* central illustration circle */}
        <div
          className="absolute left-1/2 top-1/2 rounded-full overflow-hidden shadow-2xl z-10"
          style={{ width: diameter, height: diameter, transform: "translate(-50%,-50%)" }}
        >
          {children}
        </div>

        {box > 0 && (
          <Constellation items={items} box={box} diameter={diameter} animate={animate} theme={theme} testid={testid} />
        )}
      </div>
    </div>
  );
}
