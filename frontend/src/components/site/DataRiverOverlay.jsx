import React, { useEffect, useLayoutEffect, useState } from "react";

// Part B: motion layer built on the static Part A image.
// Architecture (item 1): ONE shared parent holds base image + brightened
// highlight + particles, and the scroll-tied reveal mask is applied to that
// parent only, so highlight + particles are auto-clipped to the revealed part.
// Endpoint glows are separate (not clipped), gated by reveal progress.

const IMG_W = 1847;
const IMG_H = 852;
const ASPECT = IMG_W / IMG_H;
const BLUE = { fx: 0.96, fy: 0.2 };
const PURPLE = { fx: 0.025, fy: 0.88 };
const VDX = BLUE.fx - PURPLE.fx;
const VDY = (BLUE.fy - PURPLE.fy) / ASPECT;
const VLEN = Math.hypot(VDX, VDY);
const VANG = (Math.atan2(VDY, VDX) * 180) / Math.PI;

function useMedia() {
  const [m, setM] = useState(() => read());
  function read() {
    return {
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      mobile: window.innerWidth < 768,
      tablet: window.innerWidth >= 768 && window.innerWidth < 1100,
    };
  }
  useEffect(() => {
    const on = () => setM(read());
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

  useLayoutEffect(() => {
    const compute = () => {
      const wrap = containerRef.current;
      const u = document.querySelector('[data-testid="urban-scene-img"]');
      const r = document.querySelector('[data-testid="rural-scene-img"]');
      if (!wrap || !u || !r) return;
      const wr = wrap.getBoundingClientRect();
      const ur = u.getBoundingClientRect();
      const rr = r.getBoundingClientRect();
      const W = wr.width;
      const H = wr.height;
      const U = { x: ur.left - wr.left + ur.width / 2, y: ur.top - wr.top + ur.height / 2, R: ur.width / 2 };
      const R = { x: rr.left - wr.left + rr.width / 2, y: rr.top - wr.top + rr.height / 2, R: rr.width / 2 };
      const Tu = { x: U.x - U.R * 0.08, y: U.y + U.R * 0.34 };
      const Tr = { x: R.x - R.R * 0.28, y: R.y };

      // similarity transform: purple->Tr, blue->Tu
      const Vx = Tu.x - Tr.x;
      const Vy = Tu.y - Tr.y;
      const dist = Math.hypot(Vx, Vy);
      const Wd = dist / VLEN;
      const Hd = Wd / ASPECT;
      const angTgt = (Math.atan2(Vy, Vx) * 180) / Math.PI;
      const theta = angTgt - VANG;
      const tx = Tr.x - PURPLE.fx * Wd;
      const ty = Tr.y - PURPLE.fy * Hd;
      const imgStyle = {
        width: `${Wd}px`,
        height: `${Hd}px`,
        transformOrigin: `${PURPLE.fx * 100}% ${PURPLE.fy * 100}%`,
        transform: `translate(${tx}px, ${ty}px) rotate(${theta}deg)`,
      };

      // reveal-mask geometry (Tu -> Tr direction, aligned to river diagonal)
      const dx = Tr.x - Tu.x;
      const dy = Tr.y - Tu.y;
      const maskAngle = (Math.atan2(dx, -dy) * 180) / Math.PI; // CSS gradient angle
      const rad = (maskAngle * Math.PI) / 180;
      const gradLen = Math.abs(W * Math.sin(rad)) + Math.abs(H * Math.cos(rad));
      const dir = { x: dx / dist2(dx, dy), y: dy / dist2(dx, dy) };
      const cx = W / 2;
      const cy = H / 2;
      const Bu = 0.5 + ((Tu.x - cx) * dir.x + (Tu.y - cy) * dir.y) / gradLen;
      const Br = 0.5 + ((Tr.x - cx) * dir.x + (Tr.y - cy) * dir.y) / gradLen;

      // particle motion path (approx river curve, wrapper coords)
      const pdx = Tr.x - Tu.x;
      const pdy = Tr.y - Tu.y;
      const path = `path("M ${Tu.x} ${Tu.y} C ${Tu.x + pdx * 0.12} ${Tu.y + pdy * 0.5}, ${Tu.x + pdx * 0.58} ${Tu.y + pdy * 0.52}, ${Tr.x} ${Tr.y}")`;

      setGeo({ imgStyle, maskAngle, Bu, Br, path, Tu, Tr, W, H });
    };
    compute();
    const t1 = setTimeout(compute, 300);
    const t2 = setTimeout(compute, 1000);
    window.addEventListener("resize", compute);
    const ro = new ResizeObserver(compute);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", compute);
      ro.disconnect();
    };
  }, [containerRef]);

  useEffect(() => {
    const onScroll = () => {
      const wrap = containerRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.55;
      const total = rect.height - vh * 0.5;
      const p = Math.min(1, Math.max(0, (start - rect.top) / Math.max(1, total)));
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

  if (!geo) return <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }} data-testid="data-river-overlay" />;

  const B = geo.Bu + progress * (geo.Br - geo.Bu);
  const pct = Math.max(0, Math.min(100, B * 100));
  const revealMask = `linear-gradient(${geo.maskAngle}deg, #000 0%, #000 ${pct}%, transparent ${Math.min(100, pct + 6)}%, transparent 100%)`;

  const started = progress > 0.02;
  const urbanOn = progress > 0.03;
  const ruralOn = progress > 0.9;
  const pCount = mobile ? 5 : tablet ? 10 : 18;
  const colors = ["#CFE4FF", "#9CC2FF", "#E7DEFF", "#C9B9F5", "#DCEBFF"];

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }} data-testid="data-river-overlay">
      {/* SHARED MASKED PARENT (item 1): reveal mask applied here only */}
      <div
        className="absolute inset-0"
        style={{
          maskImage: revealMask,
          WebkitMaskImage: revealMask,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
        data-testid="river-masked-parent"
      >
        {/* base static river */}
        <img
          src="/river-stream-v3.png"
          alt=""
          aria-hidden="true"
          draggable="false"
          className="absolute top-0 left-0 select-none"
          style={geo.imgStyle}
        />

        {/* traveling highlight (item 3): brightened duplicate + moving band mask, screen blend */}
        {!reduced && started && (
          <img
            src="/river-stream-v3.png"
            alt=""
            aria-hidden="true"
            draggable="false"
            className="absolute top-0 left-0 select-none"
            style={{
              ...geo.imgStyle,
              filter: "brightness(2.1) contrast(1.15) saturate(1.2)",
              mixBlendMode: "screen",
              maskImage: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.9) 22%, #000 50%, rgba(0,0,0,0.9) 78%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.9) 22%, #000 50%, rgba(0,0,0,0.9) 78%, transparent 100%)",
              maskSize: "55% 100%",
              WebkitMaskSize: "55% 100%",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              animation: "river-hl-sweep 5.5s linear infinite",
            }}
          />
        )}

        {/* particles (item 4) */}
        {!reduced &&
          started &&
          Array.from({ length: pCount }).map((_, i) => {
            const size = 4 + (i % 4) * 2.5;
            const dur = 5 + ((i * 1.37) % 4); // 5-9s
            const delay = -((i * 0.9) % dur);
            const col = colors[i % colors.length];
            return (
              <div
                key={i}
                className="absolute top-0 left-0 rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  background: `radial-gradient(circle, ${col} 0%, ${col}cc 35%, transparent 70%)`,
                  offsetPath: geo.path,
                  WebkitOffsetPath: geo.path,
                  offsetRotate: "0deg",
                  animation: `river-particle ${dur}s linear ${delay}s infinite`,
                }}
              />
            );
          })}
      </div>

      {/* ENDPOINT GLOWS (item 5): NOT masked; gated by reveal reaching each end */}
      <div
        className="absolute rounded-full"
        style={{
          left: geo.Tu.x,
          top: geo.Tu.y,
          width: mobile ? 90 : 150,
          height: mobile ? 90 : 150,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(220,235,255,0.9) 0%, rgba(77,166,255,0.5) 40%, rgba(77,166,255,0) 72%)",
          opacity: urbanOn ? 1 : 0,
          transition: "opacity 0.5s ease",
          animation: !reduced && urbanOn ? "river-glow-pulse 3s ease-in-out infinite" : "none",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          left: geo.Tr.x,
          top: geo.Tr.y,
          width: mobile ? 80 : 130,
          height: mobile ? 80 : 130,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(242,236,255,0.9) 0%, rgba(185,167,240,0.5) 40%, rgba(185,167,240,0) 72%)",
          opacity: ruralOn ? 1 : 0,
          transition: "opacity 0.6s ease",
          animation: !reduced && ruralOn ? "river-glow-pulse 2.7s ease-in-out infinite" : "none",
        }}
      />
    </div>
  );
}

function dist2(x, y) {
  return Math.max(1, Math.hypot(x, y));
}
