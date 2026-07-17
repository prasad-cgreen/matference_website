import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Coins, Cpu, TrendingUp, Mic, Database, ChevronLeft, ChevronRight } from "lucide-react";
import { SOLUTION_CAPTIONS, SERVICES_INTRO, PRAGATI_CARDS, LENDING_CARDS } from "@/data/site";
import { useIsDesktop } from "@/hooks/useResponsive";

const ICONS = { Store, Coins, Cpu, TrendingUp, Mic, Database };

function ServiceCard({ card }) {
  const Icon = ICONS[card.icon];
  return (
    <div
      className="glass rounded-[24px] p-7 flex flex-col"
      style={{ background: "rgba(20,41,132,0.45)" }}
      data-testid="service-card"
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border border-[#142984]/20 bg-[#FCDD15]">
        <Icon className="text-[#142984]" size={24} />
      </div>
      <span className="self-start glass glass-navy rounded-full px-3.5 py-1.5 text-xs font-head font-semibold uppercase tracking-wide text-white mb-3">
        {card.value}
      </span>
      <h3 className="font-head text-lg text-[#FCDD15] mb-3">{card.title}</h3>
      <p className="font-body text-sm leading-relaxed text-white/90">{card.body}</p>
    </div>
  );
}

function LogoSolution({ isDesktop }) {
  const ref = useRef(null);
  const firedRef = useRef(false);
  const [fired, setFired] = useState(false);
  const [glow, setGlow] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const total = SOLUTION_CAPTIONS.length;

  // Fires when River 2 (rural -> logo) reaches the hub. Captions stay permanent.
  useEffect(() => {
    if (!isDesktop) return;
    const onArrive = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      setFired(true);
      setGlow(true);
      setTimeout(() => setGlow(false), 3000); // glow holds 3s then fades (cosmetic only)
    };
    window.addEventListener("river-logo-arrived", onArrive);
    return () => window.removeEventListener("river-logo-arrived", onArrive);
  }, [isDesktop]);

  // Paced caption reveal after firing (self-clearing interval).
  useEffect(() => {
    if (!fired) return;
    const id = setInterval(() => {
      setRevealed((r) => {
        const next = Math.min(total, r + 1);
        if (next >= total) clearInterval(id);
        return next;
      });
    }, 160);
    return () => clearInterval(id);
  }, [fired, total]);

  if (!isDesktop) {
    return (
      <div ref={ref} className="flex flex-col items-center gap-6" data-testid="solution-logo-static">
        <img src="/cgreen-logo.png" alt="cGreen" className="w-56 h-auto" />
        <div className="flex flex-wrap justify-center gap-2 max-w-md">
          {SOLUTION_CAPTIONS.map((c) => (
            <span key={c} className="glass glass-navy rounded-full px-3 py-1.5 text-xs font-body text-[#142984] border border-[#142984]/25">
              {c}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const SIZE = 600;
  const center = SIZE / 2;
  const R = 238;
  return (
    <div ref={ref} className="relative mx-auto" style={{ width: SIZE, height: SIZE, maxWidth: "100%" }} data-testid="solution-logo">
      {/* yellow bloom / halo behind the logo */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0"
        style={{
          width: 380,
          height: 380,
          background:
            "radial-gradient(circle, rgba(252,221,21,0.95) 0%, rgba(252,221,21,0.5) 42%, rgba(252,221,21,0) 72%)",
          filter: "blur(8px)",
          opacity: glow ? 1 : 0,
          transition: "opacity 0.9s ease",
        }}
      />

      {/* logo — large focal point; river terminates here */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFFCFA] px-10 py-8 border border-[#142984]/10 z-10"
        data-testid="solution-logo-hub"
        style={{
          animation: glow ? "logo-pulse 1.2s ease-in-out infinite" : "none",
          boxShadow: glow
            ? "0 0 90px 26px rgba(252,221,21,0.9), 0 0 30px 6px rgba(252,221,21,1)"
            : "0 12px 34px rgba(20,41,132,0.18)",
          transition: "box-shadow 0.9s ease",
        }}
      >
        <img src="/cgreen-logo.png" alt="cGreen" className="w-[260px] h-auto" />
      </div>

      {/* "code condensation" captions — no pill, no border, no connector line */}
      {SOLUTION_CAPTIONS.map((c, i) => {
        const a = (Math.PI * 2 * i) / total - Math.PI / 2;
        const x = center + Math.cos(a) * R;
        const y = center + Math.sin(a) * R;
        return (
          <div
            key={c}
            className="absolute z-20"
            style={{ left: x, top: y, transform: "translate(-50%, -50%)", width: 180 }}
          >
            <CodeLabel text={c} active={i < revealed} />
          </div>
        );
      })}
    </div>
  );
}

const randBits = (n) => Array.from({ length: n }, () => (Math.random() > 0.5 ? "1" : "0")).join("");

// A single "decoded out of the data stream" caption: binary cycles then freezes, label resolves.
function CodeLabel({ text, active }) {
  const [line1, setLine1] = useState(() => randBits(5));
  const [line2, setLine2] = useState(() => randBits(4));
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (!active) return;
    const cycle = setInterval(() => {
      setLine1(randBits(5));
      setLine2(randBits(4));
    }, 55);
    const stop = setTimeout(() => {
      clearInterval(cycle);
      setLine1(randBits(5));
      setLine2(randBits(4));
      setResolved(true);
    }, 560);
    return () => {
      clearInterval(cycle);
      clearTimeout(stop);
    };
  }, [active]);

  return (
    <div className="flex flex-col items-center text-center select-none" style={{ fontFamily: "'Courier New', monospace" }}>
      <div
        className="leading-[1.05] tracking-[0.15em]"
        style={{ fontSize: "12px", color: "#0F1F4B", opacity: active ? 0.4 : 0 }}
      >
        <div>{line1}</div>
        <div>{line2}</div>
      </div>
      <div
        className="mt-1"
        style={{
          fontSize: "17px",
          fontWeight: 800,
          lineHeight: 1.15,
          color: "#0F1F4B",
          opacity: resolved ? 1 : 0,
          transform: resolved ? "translateY(0)" : "translateY(2px)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
        }}
      >
        {text}
      </div>
    </div>
  );
}

export default function ScalingWithPurpose() {
  const isDesktop = useIsDesktop();
  const [tab, setTab] = useState("pragati");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const handler = (e) => {
      if (e.detail === "pragati" || e.detail === "lending") setTab(e.detail);
    };
    window.addEventListener("cgreen:services-tab", handler);
    return () => window.removeEventListener("cgreen:services-tab", handler);
  }, []);

  // Switching tabs resets the carousel to its first card.
  useEffect(() => setIdx(0), [tab]);

  const cards = tab === "pragati" ? PRAGATI_CARDS : LENDING_CARDS;
  const card = cards[idx];
  const prev = () => setIdx((i) => (i - 1 + cards.length) % cards.length);
  const next = () => setIdx((i) => (i + 1) % cards.length);

  const TabButton = ({ id, label, inactiveText }) => {
    const active = tab === id;
    return (
      <button
        onClick={() => setTab(id)}
        data-testid={`services-tab-${id}`}
        className={`glass rounded-full px-6 py-3 text-sm font-head font-bold transition-all ${
          active ? "glass-yellow text-[#142984]" : `glass-navy ${inactiveText}`
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <section id="solution" className="relative w-full py-24 overflow-hidden scroll-mt-24" data-testid="section-scaling">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-start relative z-10">
        {/* Left column: Our Services (merged in) */}
        <div id="services" className="scroll-mt-24" data-testid="section-services">
          <h2 className="font-head text-3xl lg:text-4xl text-[#142984]">OUR SERVICES</h2>
          <p className="font-body text-base lg:text-lg text-[#142984]/70 mt-1">THE CGREEN APPROACH</p>
          <p className="font-body text-base text-[#142984]/80 mt-5 leading-relaxed">{SERVICES_INTRO}</p>

          <div className="flex flex-wrap gap-3 mt-7 mb-7">
            <TabButton id="pragati" label="For Pragati Kendra Partners" inactiveText="text-[#142984]/70 hover:text-[#142984]" />
            <TabButton id="lending" label="For Lending Institutions" inactiveText="text-[#FCDD15]" />
          </div>

          {/* One-at-a-time carousel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${tab}-${idx}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              <ServiceCard card={card} />
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-6" data-testid="services-carousel-controls">
            <button
              onClick={prev}
              aria-label="Previous service"
              data-testid="services-prev"
              className="glass glass-navy w-11 h-11 rounded-full flex items-center justify-center text-[#142984] transition-transform hover:scale-105"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2" data-testid="services-indicator">
              {cards.map((c, i) => (
                <button
                  key={c.title}
                  onClick={() => setIdx(i)}
                  aria-label={`Go to service ${i + 1}`}
                  data-testid={`services-dot-${i}`}
                  className={`h-2.5 rounded-full transition-all ${i === idx ? "w-6 bg-[#142984]" : "w-2.5 bg-[#142984]/30"}`}
                />
              ))}
              <span className="ml-2 font-body text-sm text-[#142984]/70 tabular-nums">
                {idx + 1} of {cards.length}
              </span>
            </div>

            <button
              onClick={next}
              aria-label="Next service"
              data-testid="services-next"
              className="glass glass-navy w-11 h-11 rounded-full flex items-center justify-center text-[#142984] transition-transform hover:scale-105"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Right column: logo sequence (unchanged) */}
        <div className="flex justify-center">
          <LogoSolution isDesktop={isDesktop} />
        </div>
      </div>
    </section>
  );
}
