import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

// Reusable scroll-scrubbed glowing river between two circles.
// - Base REVEAL is scroll-LINKED (imperative, rAF on scroll): freezes on stop,
//   retracts in lockstep. No timeline / @keyframes / autoplay drives it.
// - Highlight / particles / endpoint glows keep independent ambient loops.
// Blue end -> source circle, purple end -> destination circle.

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

export default function DataRiverOverlay({
  containerRef,
  src,
  imgW,
  imgH,
  blue,
  purple,
  srcSel,
  dstSel,
  srcAnchor,
  dstAnchor,
  testid = "data-river-overlay",
}) {
  const media = useMedia();
  const { reduced, mobile, tablet } = media;
  const [geo, setGeo] = useState(null);

  const geoRef = useRef(null);
  const mediaRef = useRef(media);
  const maskRef = useRef(null);
  const sGlowRef = useRef(null);
  const dGlowRef = useRef(null);
  const ticking = useRef(false);
  mediaRef.current = media;

  const ASPECT = imgW / imgH;
  const VDX = blue.fx - purple.fx;
  const VDY = (blue.fy - purple.fy) / ASPECT;
  const VLEN = Math.hypot(VDX, VDY);
  const VANG = (Math.atan2(VDY, VDX) * 180) / Math.PI;

  const applyReveal = () => {
    const g = geoRef.current;
    const wrap = containerRef.current;
    if (!g || !wrap || !maskRef.current) return;
    const dst = document.querySelector(`[data-testid="${dstSel}"]`);
    if (!dst) return;
    const dr = dst.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, (vh * 0.62 - dr.top) / (vh * 0.42)));
    const m = maskFor(g, p);
    maskRef.current.style.maskImage = m;
    maskRef.current.style.webkitMaskImage = m;
    const red = mediaRef.current.reduced;
    setGlow(sGlowRef.current, p > 0.04, red, 3);
    setGlow(dGlowRef.current, p > 0.9, red, 2.7);
  };

  useLayoutEffect(() => {
    const compute = () => {
      const wrap = containerRef.current;
      const s = document.querySelector(`[data-testid="${srcSel}"]`);
      const d = document.querySelector(`[data-testid="${dstSel}"]`);
      if (!wrap || !s || !d) return;
      const wr = wrap.getBoundingClientRect();
      const sr = s.getBoundingClientRect();
      const dr = d.getBoundingClientRect();
      const W = wr.width;
      const H = wr.height;
      const S = { x: sr.left - wr.left + sr.width / 2, y: sr.top - wr.top + sr.height / 2, R: sr.width / 2 };
      const D = { x: dr.left - wr.left + dr.width / 2, y: dr.top - wr.top + dr.height / 2, R: Math.min(dr.width, dr.height) / 2 };
      const Tu = srcAnchor(S); // blue end
      const Tr = dstAnchor(D); // purple end

      const Vx = Tu.x - Tr.x;
      const Vy = Tu.y - Tr.y;
      const dist = Math.hypot(Vx, Vy);
      const Wd = dist / VLEN;
      const Hd = Wd / ASPECT;
      const theta = (Math.atan2(Vy, Vx) * 180) / Math.PI - VANG;
      const imgStyle = {
        width: `${Wd}px`,
        height: `${Hd}px`,
        transformOrigin: `${purple.fx * 100}% ${purple.fy * 100}%`,
        transform: `translate(${Tr.x - purple.fx * Wd}px, ${Tr.y - purple.fy * Hd}px) rotate(${theta}deg)`,
      };

      const dx = Tr.x - Tu.x;
      const dy = Tr.y - Tu.y;
      const maskAngle = (Math.atan2(dx, -dy) * 180) / Math.PI;
      const rad = (maskAngle * Math.PI) / 180;
      const gradLen = Math.abs(W * Math.sin(rad)) + Math.abs(H * Math.cos(rad));
      const dl = Math.max(1, Math.hypot(dx, dy));
      const dir = { x: dx / dl, y: dy / dl };
      const Bu = 0.5 + ((Tu.x - W / 2) * dir.x + (Tu.y - H / 2) * dir.y) / gradLen;
      const Br = 0.5 + ((Tr.x - W / 2) * dir.x + (Tr.y - H / 2) * dir.y) / gradLen;
      const path = `path("M ${Tu.x} ${Tu.y} C ${Tu.x + dx * 0.12} ${Tu.y + dy * 0.5}, ${Tu.x + dx * 0.58} ${Tu.y + dy * 0.52}, ${Tr.x} ${Tr.y}")`;

      const g = { imgStyle, maskAngle, Bu, Br, path, Tu, Tr };
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
  }, [containerRef, src, srcSel, dstSel]);

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
  }, [containerRef, dstSel]);

  useEffect(() => {
    applyReveal();
    // eslint-disable-next-line
  }, [reduced]);

  if (!geo) return <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }} data-testid={testid} />;

  const initialMask = maskFor(geo, 0);
  const pCount = mobile ? 5 : tablet ? 9 : 15;
  const colors = ["#CFE4FF", "#9CC2FF", "#E7DEFF", "#C9B9F5", "#DCEBFF"];

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }} data-testid={testid}>
      <div
        ref={maskRef}
        className="absolute inset-0"
        style={{ maskImage: initialMask, WebkitMaskImage: initialMask, maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat" }}
      >
        <img src={src} alt="" aria-hidden="true" draggable="false" className="absolute top-0 left-0 select-none" style={geo.imgStyle} />

        {!reduced && (
          <img
            src={src}
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

      <div
        ref={sGlowRef}
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
        ref={dGlowRef}
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
