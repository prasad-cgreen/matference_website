import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Constellation of factor dots around a circular illustration.
 * - Resting: dim, unlabeled glowing dots on two orbit rings, gently twinkling.
 * - Reveal: proximity hover (desktop), focus (keyboard) or tap (mobile), OR an
 *   externally-forced label (from a synced list chip) brightens the dot and
 *   slides in a connector + label tooltip.
 * - Reports its single "primary" locally-active factor up via onActive so the
 *   companion static list can mirror the highlight.
 */

const DUR = 60; // seconds per full rotation (slow, calm)
const slug = (s) => s.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

function ringRadii(box, diameter) {
  const half = box / 2;
  const circleR = diameter / 2;
  const band = Math.max(24, half - circleR);
  return {
    rInner: circleR + band * 0.42,
    rOuter: circleR + band * 0.82,
  };
}

function Constellation({ items, box, diameter, animate, theme, testid, onActive, forcedActive }) {
  const hostRef = useRef(null);
  const wrapRefs = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999, inside: false });
  const focusSet = useRef(new Set());
  const tapSet = useRef(new Set());
  const onActiveRef = useRef(onActive);
  const forcedRef = useRef(forcedActive);
  const lastPrimary = useRef(null);
  onActiveRef.current = onActive;
  forcedRef.current = forcedActive;

  useEffect(() => {
    let raf;
    const start = performance.now();
    const loop = (now) => {
      const half = box / 2;
      const { rInner, rOuter } = ringRadii(box, diameter);
      const t = animate ? (((now - start) / 1000) / DUR) * 2 * Math.PI : 0;
      const TH2 = 36 * 36;
      let primary = null;
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
        let local = focusSet.current.has(i) || tapSet.current.has(i);
        if (!local && mouseRef.current.inside) {
          const dx = x - mouseRef.current.x;
          const dy = y - mouseRef.current.y;
          local = dx * dx + dy * dy <= TH2;
        }
        if (local && primary === null) primary = it.label;
        const visible = local || forcedRef.current === it.label;
        el.classList.toggle("is-active", visible);
      }
      if (primary !== lastPrimary.current) {
        lastPrimary.current = primary;
        onActiveRef.current?.(primary);
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
  onActive = null,
  forcedActive = null,
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
    <div data-testid={testid} className="relative mx-auto w-full" style={{ maxWidth: diameter + 150 }}>
      <div ref={boxRef} className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
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

        <div
          className="absolute left-1/2 top-1/2 rounded-full overflow-hidden shadow-2xl z-10"
          style={{ width: diameter, height: diameter, transform: "translate(-50%,-50%)" }}
        >
          {children}
        </div>

        {box > 0 && (
          <Constellation
            items={items}
            box={box}
            diameter={diameter}
            animate={animate}
            theme={theme}
            testid={testid}
            onActive={onActive}
            forcedActive={forcedActive}
          />
        )}
      </div>
    </div>
  );
}
