import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

// Part A: place the pre-rendered glowing light-stream PNG statically between the
// two circles. Blue end (top-right of source) -> urban circle; purple end
// (bottom-left of source) -> rural circle. No animation yet (Part B adds motion).

const IMG_W = 1672;
const IMG_H = 941;
const ASPECT = IMG_W / IMG_H;
// bright tips of the stream, as fractions of the source image
const BLUE = { fx: 0.97, fy: 0.16 }; // -> urban
const PURPLE = { fx: 0.04, fy: 0.87 }; // -> rural
// vector (blue - purple) in a unit-width image, used for base angle/length
const VDX = (BLUE.fx - PURPLE.fx); // 0.93
const VDY = (BLUE.fy - PURPLE.fy) / ASPECT; // in display units per unit width
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

      // anchor points slightly INSIDE each circle (underlap → circle covers the excess)
      const Tu = { x: U.x - U.R * 0.12, y: U.y + U.R * 0.28 }; // blue → urban lower-interior
      const Tr = { x: R.x - R.R * 0.05, y: R.y - R.R * 0.12 }; // purple → rural upper-left interior

      const Vx = Tu.x - Tr.x;
      const Vy = Tu.y - Tr.y;
      const dist = Math.hypot(Vx, Vy);
      const Wd = dist / VLEN;
      const Hd = Wd / ASPECT;
      const angTgt = (Math.atan2(Vy, Vx) * 180) / Math.PI;
      const theta = angTgt - VANG;
      const p0x = PURPLE.fx * Wd;
      const p0y = PURPLE.fy * Hd;
      const tx = Tr.x - p0x;
      const ty = Tr.y - p0y;

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
      src="/river-stream.png"
      alt=""
      aria-hidden="true"
      draggable="false"
      data-testid="data-river-overlay"
      className="absolute top-0 left-0 pointer-events-none select-none"
      style={{ zIndex: 5, ...(style || { opacity: 0 }) }}
    />
  );
}
