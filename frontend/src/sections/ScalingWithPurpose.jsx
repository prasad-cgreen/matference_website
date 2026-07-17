import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Coins, Cpu, TrendingUp, Mic, Database, ChevronLeft, ChevronRight } from "lucide-react";
import { SOLUTION_CAPTIONS, SERVICES_INTRO, PRAGATI_CARDS, LENDING_CARDS } from "@/data/site";
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
        <img src="/cgreen-logo.png" alt="cGreen" className="w-56 h-auto" />
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

  const SIZE = 600;
  const C = SIZE / 2;
  const iconR = 236;
  const total = SOLUTION_CAPTIONS.length;

  const nodes = SOLUTION_CAPTIONS.map((c, i) => {
    const a = (Math.PI * 2 * i) / total - Math.PI / 2;
    return { c, a, x: C + Math.cos(a) * iconR, y: C + Math.sin(a) * iconR };
  });

  // Orthogonal PCB trace: icon -> short stub -> 2 right-angle bends -> its own
  // distinct endpoint on the logo capsule edge (no diagonals, no shared spine).
  const traceOf = (a, i) => {
    const A = [C + Math.cos(a) * (iconR - 30), C + Math.sin(a) * (iconR - 30)];
    const hw = 168;
    const hh = 74;
    const t = 1 / Math.max(Math.abs(Math.cos(a)) / hw, Math.abs(Math.sin(a)) / hh);
    let E = [C + Math.cos(a) * t, C + Math.sin(a) * t];
    const vertical = Math.abs(Math.sin(a)) >= Math.abs(Math.cos(a));
    const lane = ((i % 3) - 1) * 24; // -24, 0, 24 -> distinct jog per trace
    const stub = 26;
    if (vertical) {
      E = [E[0] + lane, E[1]];
      const s = Math.sign(E[1] - A[1]) || 1;
      const p1 = [A[0], A[1] + s * stub];
      const p2 = [E[0], p1[1]];
      return [A, p1, p2, E];
    }
    E = [E[0], E[1] + lane];
    const s = Math.sign(E[0] - A[0]) || 1;
    const p1 = [A[0] + s * stub, A[1]];
    const p2 = [p1[0], E[1]];
    return [A, p1, p2, E];
  };

  return (
    <div className="relative mx-auto" style={{ width: SIZE, height: SIZE, maxWidth: "100%" }} data-testid="solution-logo">
      {/* Circuit-trace network (navy), tucked under the logo capsule */}
      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 6 }} width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} fill="none">
        {nodes.map((n, i) => {
          const pts = traceOf(n.a, i);
          const d = "M " + pts.map((pt) => pt.join(" ")).join(" L ");
          return (
            <g key={n.c}>
              <path d={d} stroke="#142984" strokeWidth={1.6} fill="none" strokeLinejoin="round" strokeLinecap="round" />
              {pts.slice(0, 3).map((pt, k) => (
                <circle key={k} cx={pt[0]} cy={pt[1]} r={3.6} fill="#FFFCFA" stroke="#142984" strokeWidth={1.3} />
              ))}
            </g>
          );
        })}
      </svg>

      {/* yellow bloom / halo behind the logo */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0"
        style={{
          width: 380,
          height: 380,
          background: "radial-gradient(circle, rgba(252,221,21,0.95) 0%, rgba(252,221,21,0.5) 42%, rgba(252,221,21,0) 72%)",
          filter: "blur(8px)",
          opacity: glow ? 1 : 0,
          transition: "opacity 0.9s ease",
        }}
      />

      {/* logo — central white capsule; river terminates here */}
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

      {/* icon + label feature nodes */}
      {nodes.map((n) => {
        const Icon = FEATURE_ICONS[n.c];
        return (
          <div
            key={n.c}
            className="absolute flex flex-col items-center text-center"
            style={{ left: n.x, top: n.y, transform: "translate(-50%, -50%)", width: 160, zIndex: 20 }}
            data-testid={`feature-${slug(n.c)}`}
          >
            {Icon && Icon(46)}
            <div className="mt-1" style={{ fontFamily: "'Courier New', monospace", fontSize: "14px", fontWeight: 800, lineHeight: 1.15, color: "#0F1F4B" }}>
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
