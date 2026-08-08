import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Coins, Cpu, TrendingUp, Mic, Database, ChevronLeft, ChevronRight } from "lucide-react";
import { SOLUTION_CAPTIONS, SERVICES_TAGLINE, SERVICES_BANNER, PRAGATI_CARDS, LENDING_CARDS } from "@/data/site";
import { useIsDesktop } from "@/hooks/useResponsive";
import { FEATURE_ICONS } from "@/components/site/LogoFeatureIcons";

const ICONS = { Store, Coins, Cpu, TrendingUp, Mic, Database };
const slug = (s) => s.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

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
  const firedRef = useRef(false);
  const [glow, setGlow] = useState(false);

  // Yellow logo bloom fires when River 2 (rural -> logo) reaches the hub.
  useEffect(() => {
    if (!isDesktop) return;
    const onArrive = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      setGlow(true);
      setTimeout(() => setGlow(false), 3000);
    };
    window.addEventListener("river-logo-arrived", onArrive);
    return () => window.removeEventListener("river-logo-arrived", onArrive);
  }, [isDesktop]);

  if (!isDesktop) {
    return (
      <div className="flex flex-col items-center gap-6" data-testid="solution-logo-static">
        <img src="/brain-logo-composite-transparent.png" alt="cGreen" className="w-72 h-auto" />
        <div className="flex flex-wrap justify-center gap-3 max-w-md">
          {SOLUTION_CAPTIONS.map((c) => {
            const Icon = FEATURE_ICONS[c];
            return (
              <div key={c} className="flex flex-col items-center text-center w-24" data-testid={`feature-${slug(c)}`}>
                {Icon && Icon(36)}
                <div className="mt-1" style={{ fontFamily: "'Courier New', monospace", fontSize: "11px", fontWeight: 800, lineHeight: 1.1, color: "#0F1F4B" }}>
                  {c}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const SIZE = 740;
  const CX = SIZE / 2 + 42; // shift the whole hub slightly to the right
  const CY = SIZE / 2;
  // Radii scaled down to match the smaller composite (600 -> 470).
  const radiusX = 232;
  const radiusY = 150;
  const total = SOLUTION_CAPTIONS.length;

  // Per-icon nudges so the 3 icons nearest the wide wordmark clear it (scaled to the smaller graphic).
  const OFFSETS = {
    "Financial Inclusion": { dx: 47, dy: 0 },
    "Customer Place Verification": { dx: 59, dy: 27 },
    "Voice Transcription": { dx: -35, dy: 0 },
  };

  const nodes = SOLUTION_CAPTIONS.map((c, i) => {
    const a = (Math.PI * 2 * i) / total - Math.PI / 2;
    const o = OFFSETS[c] || { dx: 0, dy: 0 };
    return { c, a, x: CX + Math.cos(a) * radiusX + o.dx, y: CY + Math.sin(a) * radiusY + o.dy };
  });

  return (
    <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }} data-testid="solution-logo">
      {/* yellow bloom / halo behind the composite (arrival feedback) */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0"
        style={{
          left: CX,
          top: CY,
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(252,221,21,0.85) 0%, rgba(252,221,21,0.4) 45%, rgba(252,221,21,0) 72%)",
          filter: "blur(10px)",
          opacity: glow ? 1 : 0,
          transition: "opacity 0.9s ease",
        }}
      />

      {/* brain + cGreen logo composite — river terminates here (keeps hub testid) */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
        data-testid="solution-logo-hub"
        style={{
          left: CX,
          top: CY,
          filter: glow ? "drop-shadow(0 0 26px rgba(252,221,21,0.95))" : "none",
          transition: "filter 0.9s ease",
        }}
      >
        <img src="/brain-logo-composite-transparent.png" alt="cGreen — Customer • Collect • Credit" className="w-[470px] max-w-none h-auto select-none" draggable="false" />
      </div>

      {/* icon + label feature nodes */}
      {nodes.map((n) => {
        const Icon = FEATURE_ICONS[n.c];
        return (
          <div
            key={n.c}
            className="absolute flex flex-col items-center text-center"
            style={{ left: n.x, top: n.y, transform: "translate(-50%, -50%)", width: 140, zIndex: 20 }}
            data-testid={`feature-${slug(n.c)}`}
          >
            {Icon && Icon(46)}
            <div className="mt-1" style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: "14px", fontWeight: 600, lineHeight: 1.15, color: "#0F1F4B" }}>
              {n.c}
            </div>
          </div>
        );
      })}
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
        className={`glass rounded-3xl px-4 py-3 text-sm font-head font-bold leading-tight flex-1 text-center transition-all ${
          active ? "glass-yellow text-[#142984]" : `glass-navy ${inactiveText}`
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <section id="solution" className="relative w-full pt-24 pb-6 overflow-hidden scroll-mt-24" data-testid="section-scaling">
      {/* Full-width heading / tagline / banner block */}
      <div id="services" className="max-w-7xl mx-auto px-6 text-center relative z-10 scroll-mt-24 mb-6" data-testid="section-services">
        <h2 className="font-head text-3xl lg:text-5xl text-[#142984]">OUR SERVICES</h2>
        <div className="mt-4 flex justify-center">
          <span className="inline-block text-center px-5 py-2.5 rounded-full text-sm font-body font-bold leading-snug glass glass-yellow text-[#142984]">
            {SERVICES_TAGLINE}
          </span>
        </div>
        <p className="font-body font-light text-base md:text-lg text-[#142984]/80 mt-6 leading-relaxed">
          {SERVICES_BANNER}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[minmax(0,520px)_1fr] gap-14 items-start relative z-10 lg:-mt-16">
        {/* Left column: toggle tabs + service carousel */}
        <div className="lg:mt-[140px]">
          <div className="flex flex-wrap lg:flex-nowrap items-stretch gap-3 mb-7">
            <TabButton id="pragati" label="For Pragati Kendra Partners" inactiveText="text-[#142984]/70 hover:text-[#142984]" />
            <TabButton id="lending" label="For Lending Institutions" inactiveText="text-[#FCDD15]" />
          </div>

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
            <button onClick={prev} aria-label="Previous service" data-testid="services-prev" className="glass glass-navy w-11 h-11 rounded-full flex items-center justify-center text-[#142984] transition-transform hover:scale-105">
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2" data-testid="services-indicator">
              {cards.map((c, i) => (
                <button key={c.title} onClick={() => setIdx(i)} aria-label={`Go to service ${i + 1}`} data-testid={`services-dot-${i}`} className={`h-2.5 rounded-full transition-all ${i === idx ? "w-6 bg-[#142984]" : "w-2.5 bg-[#142984]/30"}`} />
              ))}
              <span className="ml-2 font-body text-sm text-[#142984]/70 tabular-nums">{idx + 1} of {cards.length}</span>
            </div>
            <button onClick={next} aria-label="Next service" data-testid="services-next" className="glass glass-navy w-11 h-11 rounded-full flex items-center justify-center text-[#142984] transition-transform hover:scale-105">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Right column: logo circuit diagram */}
        <div className="flex justify-center">
          <LogoSolution isDesktop={isDesktop} />
        </div>
      </div>
    </section>
  );
}
