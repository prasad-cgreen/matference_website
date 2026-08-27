import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

// Reusable data-river between two circles — CONTINUOUS AUTOPLAY (Round 17).
// - The full river image is shown immediately; there is NO scroll-tied reveal.
// - Highlight sweep, particles and endpoint glows loop continuously while the
//   river's own span is within the viewport, and pause when it scrolls fully out.
// - Scroll position ONLY decides play vs. pause (in view or not) — nothing reads
//   scroll to clip/mask the path anymore.
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
  onArrive,
  flowReverse = false,
  testid = "data-river-overlay",
}) {
  const media = useMedia();
  const { reduced, mobile, tablet } = media;
  const [geo, setGeo] = useState(null);
  const [inView, setInView] = useState(false);

  const geoRef = useRef(null);
  const inViewRef = useRef(false);
  const arrivedRef = useRef(false);
  const ticking = useRef(false);

  const ASPECT = imgW / imgH;
  const VDX = blue.fx - purple.fx;
  const VDY = (blue.fy - purple.fy) / ASPECT;
  const VLEN = Math.hypot(VDX, VDY);
  const VANG = (Math.atan2(VDY, VDX) * 180) / Math.PI;

  // scroll -> play/pause only (in view vs not). No path clipping.
  const evalInView = () => {
    const g = geoRef.current;
    const wrap = containerRef.current;
    if (!g || !wrap) return;
    const wr = wrap.getBoundingClientRect();
    const Z = wrap.offsetWidth ? wr.width / wrap.offsetWidth : 1;
    const vh = window.innerHeight;
    const top = wr.top + Math.min(g.Tu.y, g.Tr.y) * Z;
    const bot = wr.top + Math.max(g.Tu.y, g.Tr.y) * Z;
    const vis = bot > vh * 0.04 && top < vh * 0.96;
    if (vis !== inViewRef.current) {
      inViewRef.current = vis;
      setInView(vis);
      if (vis && onArrive && !arrivedRef.current) {
        arrivedRef.current = true;
        onArrive();
      }
    }
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
      // CSS `zoom` scales getBoundingClientRect() but NOT the px lengths we set
      // on children — detect the zoom factor and divide measured deltas by it so
      // the trail renders at the correct visual length/endpoints under zoom:0.85.
      const Z = wrap.offsetWidth ? wr.width / wrap.offsetWidth : 1;
      const S = { x: (sr.left - wr.left + sr.width / 2) / Z, y: (sr.top - wr.top + sr.height / 2) / Z, R: (sr.width / 2) / Z };
      const D = { x: (dr.left - wr.left + dr.width / 2) / Z, y: (dr.top - wr.top + dr.height / 2) / Z, R: (Math.min(dr.width, dr.height) / 2) / Z };
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
      const path = `path("M ${Tu.x} ${Tu.y} C ${Tu.x + dx * 0.12} ${Tu.y + dy * 0.5}, ${Tu.x + dx * 0.58} ${Tu.y + dy * 0.52}, ${Tr.x} ${Tr.y}")`;

      const g = { imgStyle, path, Tu, Tr };
      geoRef.current = g;
      setGeo(g);
      evalInView();
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
        evalInView();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", evalInView);
    evalInView();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", evalInView);
    };
    // eslint-disable-next-line
  }, [containerRef]);

  if (!geo) return <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }} data-testid={testid} />;

  let pCount = 15;
  if (mobile) pCount = 5;
  else if (tablet) pCount = 9;
  const colors = ["#CFE4FF", "#9CC2FF", "#E7DEFF", "#C9B9F5", "#DCEBFF"];
  const play = inView ? "running" : "paused";

  const glowStyle = (col, size, dur) => ({
    width: size,
    height: size,
    transform: "translate(-50%, -50%)",
    background: col,
    opacity: reduced ? (inView ? 0.7 : 0) : undefined,
    animation: reduced || !inView ? "none" : `river-glow-pulse ${dur}s ease-in-out infinite`,
  });

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }} data-testid={testid}>
      <div className="absolute inset-0">
        {/* full river image — always visible, no reveal mask */}
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
              animationDirection: flowReverse ? "reverse" : "normal",
              animationPlayState: play,
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
                key={`river-particle-${i}`}
                className="absolute top-0 left-0 rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  background: `radial-gradient(circle, ${col} 0%, ${col}cc 35%, transparent 70%)`,
                  offsetPath: geo.path,
                  WebkitOffsetPath: geo.path,
                  offsetRotate: "0deg",
                  animation: `river-particle ${dur}s linear ${delay}s infinite`,
                  animationPlayState: play,
                }}
              />
            );
          })}
      </div>

      <div
        className="absolute rounded-full"
        style={{
          left: geo.Tu.x,
          top: geo.Tu.y,
          ...glowStyle(
            "radial-gradient(circle, rgba(220,235,255,0.9) 0%, rgba(77,166,255,0.5) 40%, rgba(77,166,255,0) 72%)",
            mobile ? 90 : 150,
            3
          ),
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          left: geo.Tr.x,
          top: geo.Tr.y,
          ...glowStyle(
            "radial-gradient(circle, rgba(242,236,255,0.9) 0%, rgba(185,167,240,0.5) 40%, rgba(185,167,240,0) 72%)",
            mobile ? 80 : 130,
            2.7
          ),
        }}
      />
    </div>
  );
}
