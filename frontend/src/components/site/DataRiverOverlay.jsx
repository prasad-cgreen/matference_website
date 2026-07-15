import React, { useLayoutEffect, useRef, useState } from "react";

// Part A: place the final approved glowing light-stream PNG statically between
// the two circles. Blue end (top-right of source) -> INSIDE urban circle;
// purple end (bottom-left of source) -> enters rural circle from its LEFT side.
// No animation yet (Part B adds scroll-reveal + motion).

const IMG_W = 1847;
const IMG_H = 852;
const ASPECT = IMG_W / IMG_H;
// bright concentrated tips of the stream, as fractions of the source image
const BLUE = { fx: 0.96, fy: 0.2 }; // -> urban
const PURPLE = { fx: 0.025, fy: 0.88 }; // -> rural
const VDX = BLUE.fx - PURPLE.fx;
const VDY = (BLUE.fy - PURPLE.fy) / ASPECT;
const VLEN = Math.hypot(VDX, VDY);
const VANG = (Math.atan2(VDY, VDX) * 180) / Math.PI;

export default function DataRiverOverlay({ containerRef }) {
  const [style, setStyle] = useState(null);

  useLayoutEffect(() => {
    const compute = () => {
      const wrap = containerRef.current;
      const u = document.querySelector('[data-testid="urban-scene-img"]');
      const r = document.querySelector('[data-testid="rural-scene-img"]');
      if (!wrap || !u || !r) return;
      const wr = wrap.getBoundingClientRect();
      const ur = u.getBoundingClientRect();
      const rr = r.getBoundingClientRect();
      const U = { x: ur.left - wr.left + ur.width / 2, y: ur.top - wr.top + ur.height / 2, R: ur.width / 2 };
      const R = { x: rr.left - wr.left + rr.width / 2, y: rr.top - wr.top + rr.height / 2, R: rr.width / 2 };

      // blue -> deep inside urban lower-interior (underlaps, circle covers excess)
      const Tu = { x: U.x - U.R * 0.08, y: U.y + U.R * 0.34 };
      // purple -> crosses rural's LEFT edge (~9 o'clock, centre height), slightly interior
      const Tr = { x: R.x - R.R * 0.82, y: R.y };

      const Vx = Tu.x - Tr.x;
      const Vy = Tu.y - Tr.y;
      const dist = Math.hypot(Vx, Vy);
      const Wd = dist / VLEN;
      const Hd = Wd / ASPECT;
      const angTgt = (Math.atan2(Vy, Vx) * 180) / Math.PI;
      const theta = angTgt - VANG;
      const tx = Tr.x - PURPLE.fx * Wd;
      const ty = Tr.y - PURPLE.fy * Hd;

      setStyle({
        width: `${Wd}px`,
        height: `${Hd}px`,
        transformOrigin: `${PURPLE.fx * 100}% ${PURPLE.fy * 100}%`,
        transform: `translate(${tx}px, ${ty}px) rotate(${theta}deg)`,
      });
    };
    compute();
    const t1 = setTimeout(compute, 300);
    const t2 = setTimeout(compute, 1000);
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, { passive: true });
    const ro = new ResizeObserver(compute);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute);
      ro.disconnect();
    };
  }, [containerRef]);

  return (
    <img
      src="/river-stream-v2.png"
      alt=""
      aria-hidden="true"
      draggable="false"
      data-testid="data-river-overlay"
      className="absolute top-0 left-0 pointer-events-none select-none"
      style={{ zIndex: 5, ...(style || { opacity: 0 }) }}
    />
  );
}
