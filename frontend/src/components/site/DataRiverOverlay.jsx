import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

// Part B: motion layer on top of the static Part A image.
// - Base REVEAL is scroll-LINKED (scrubbed): the mask boundary is a direct
//   function of scroll offset within the shared wrapper, applied imperatively
//   on each scroll tick via rAF. No timeline / @keyframes / autoplay drives it,
//   so it freezes the instant scrolling stops and retracts in lockstep.
// - Highlight / particles / endpoint glows keep their own ambient loops.

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
  const read = () => ({
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    mobile: window.innerWidth < 768,
    tablet: window.innerWidth >= 768 && window.innerWidth < 1100,
  });
  const [m, setM] = useState(read);
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

function maskFor(g, p) {
  const B = g.Bu + p * (g.Br - g.Bu);
  const pct = Math.max(0, Math.min(100, B * 100));
  return `linear-gradient(${g.maskAngle}deg, #000 0%, #000 ${pct}%, transparent ${Math.min(100, pct + 6)}%, transparent 100%)`;
}

export default function DataRiverOverlay({ containerRef }) {
  const media = useMedia();
  const { reduced, mobile, tablet } = media;
  const [geo, setGeo] = useState(null);

  const geoRef = useRef(null);
  const mediaRef = useRef(media);
  const maskRef = useRef(null);
  const uGlowRef = useRef(null);
  const rGlowRef = useRef(null);
  const ticking = useRef(false);

  mediaRef.current = media;

  // scroll-linked reveal, applied imperatively (no timeline / autoplay)
  const applyReveal = () => {
    const g = geoRef.current;
    const wrap = containerRef.current;
    if (!g || !wrap || !maskRef.current) return;
    const rect = wrap.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh * 0.55;
    const total = rect.height - vh * 0.5;
    const p = Math.min(1, Math.max(0, (start - rect.top) / Math.max(1, total)));
    const m = maskFor(g, p);
    maskRef.current.style.maskImage = m;
    maskRef.current.style.webkitMaskImage = m;
    const red = mediaRef.current.reduced;
    setGlow(uGlowRef.current, p > 0.03, red, 3);
    setGlow(rGlowRef.current, p > 0.9, red, 2.7);
  };

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

      const Vx = Tu.x - Tr.x;
      const Vy = Tu.y - Tr.y;
      const dist = Math.hypot(Vx, Vy);
      const Wd = dist / VLEN;
      const Hd = Wd / ASPECT;
      const theta = (Math.atan2(Vy, Vx) * 180) / Math.PI - VANG;
      const imgStyle = {
        width: `${Wd}px`,
        height: `${Hd}px`,
        transformOrigin: `${PURPLE.fx * 100}% ${PURPLE.fy * 100}%`,
        transform: `translate(${Tr.x - PURPLE.fx * Wd}px, ${Tr.y - PURPLE.fy * Hd}px) rotate(${theta}deg)`,
      };

      const dx = Tr.x - Tu.x;
      const dy = Tr.y - Tu.y;
      const maskAngle = (Math.atan2(dx, -dy) * 180) / Math.PI;
      const rad = (maskAngle * Math.PI) / 180;
      const gradLen = Math.abs(W * Math.sin(rad)) + Math.abs(H * Math.cos(rad));
      const dl = Math.max(1, Math.hypot(dx, dy));
      const dir = { x: dx / dl, y: dy / dl };
      const cx = W / 2;
      const cy = H / 2;
      const Bu = 0.5 + ((Tu.x - cx) * dir.x + (Tu.y - cy) * dir.y) / gradLen;
      const Br = 0.5 + ((Tr.x - cx) * dir.x + (Tr.y - cy) * dir.y) / gradLen;
      const path = `path("M ${Tu.x} ${Tu.y} C ${Tu.x + dx * 0.12} ${Tu.y + dy * 0.5}, ${Tu.x + dx * 0.58} ${Tu.y + dy * 0.52}, ${Tr.x} ${Tr.y}")`;

      const g = { imgStyle, maskAngle, Bu, Br, path, Tu, Tr, W, H };
      geoRef.current = g;
      setGeo(g);
      applyReveal();
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
    // eslint-disable-next-line
  }, [containerRef]);

  // scroll → rAF-synced imperative reveal (fires only on scroll, freezes when idle)
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        ticking.current = false;
        applyReveal();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", applyReveal);
    applyReveal();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", applyReveal);
    };
    // eslint-disable-next-line
  }, [containerRef]);

  // re-apply glow gating when motion preference changes
  useEffect(() => {
    applyReveal();
    // eslint-disable-next-line
  }, [reduced]);

  if (!geo) return <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }} data-testid="data-river-overlay" />;

  const initialMask = maskFor(geo, 0);
  const pCount = mobile ? 5 : tablet ? 10 : 18;
  const colors = ["#CFE4FF", "#9CC2FF", "#E7DEFF", "#C9B9F5", "#DCEBFF"];

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }} data-testid="data-river-overlay">
      {/* SHARED MASKED PARENT — scroll-scrubbed reveal set imperatively on maskRef */}
      <div
        ref={maskRef}
        className="absolute inset-0"
        style={{
          maskImage: initialMask,
          WebkitMaskImage: initialMask,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
        data-testid="river-masked-parent"
      >
        <img
          src="/river-stream-v3.png"
          alt=""
          aria-hidden="true"
          draggable="false"
          className="absolute top-0 left-0 select-none"
          style={geo.imgStyle}
        />

        {/* traveling highlight (ambient loop, allowed) */}
        {!reduced && (
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

        {/* particles (ambient loops, allowed) */}
        {!reduced &&
          Array.from({ length: pCount }).map((_, i) => {
            const size = 4 + (i % 4) * 2.5;
            const dur = 5 + ((i * 1.37) % 4);
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

      {/* ENDPOINT GLOWS — not masked; gated + pulsed imperatively via refs */}
      <div
        ref={uGlowRef}
        className="absolute rounded-full"
        style={{
          left: geo.Tu.x,
          top: geo.Tu.y,
          width: mobile ? 90 : 150,
          height: mobile ? 90 : 150,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(220,235,255,0.9) 0%, rgba(77,166,255,0.5) 40%, rgba(77,166,255,0) 72%)",
          opacity: 0,
        }}
      />
      <div
        ref={rGlowRef}
        className="absolute rounded-full"
        style={{
          left: geo.Tr.x,
          top: geo.Tr.y,
          width: mobile ? 80 : 130,
          height: mobile ? 80 : 130,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(242,236,255,0.9) 0%, rgba(185,167,240,0.5) 40%, rgba(185,167,240,0) 72%)",
          opacity: 0,
        }}
      />
    </div>
  );
}

// Gate + pulse an endpoint glow. Pulse is a looping CSS keyframe (allowed for
// glows); gating (whether the reveal has reached this end) is scroll-linked.
function setGlow(el, on, reduced, dur) {
  if (!el) return;
  if (!on) {
    el.style.animation = "none";
    el.style.opacity = "0";
    return;
  }
  if (reduced) {
    el.style.animation = "none";
    el.style.opacity = "0.7";
  } else {
    el.style.animation = `river-glow-pulse ${dur}s ease-in-out infinite`;
    el.style.opacity = "";
  }
}
