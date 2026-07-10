import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Coins, Cpu, TrendingUp, Mic, Database } from "lucide-react";
import { SERVICES_INTRO, PRAGATI_CARDS, LENDING_CARDS } from "@/data/site";

const ICONS = { Store, Coins, Cpu, TrendingUp, Mic, Database };

function ServiceCard({ card, i }) {
  const Icon = ICONS[card.icon];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: i * 0.08 }}
      className="glass glass-navy rounded-[24px] p-7 flex flex-col"
      data-testid={`service-card-${i}`}
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border border-white/40 bg-white/15">
        <Icon className="text-white" size={24} />
      </div>
      <p className="font-head text-sm text-white/90 uppercase tracking-wide mb-2">{card.value}</p>
      <h3 className="font-head text-lg text-[#FCDD15] mb-3">{card.title}</h3>
      <p className="font-body text-sm leading-relaxed text-white/90">{card.body}</p>
    </motion.div>
  );
}

export default function OurServices() {
  const [tab, setTab] = useState("pragati");

  useEffect(() => {
    const handler = (e) => {
      if (e.detail === "pragati" || e.detail === "lending") setTab(e.detail);
    };
    window.addEventListener("cgreen:services-tab", handler);
    return () => window.removeEventListener("cgreen:services-tab", handler);
  }, []);

  const cards = tab === "pragati" ? PRAGATI_CARDS : LENDING_CARDS;

  const TabButton = ({ id, label }) => {
    const active = tab === id;
    return (
      <button
        onClick={() => setTab(id)}
        data-testid={`services-tab-${id}`}
        className={`glass rounded-full px-6 py-3 text-sm font-head font-bold transition-all ${
          active ? "glass-yellow text-[#142984]" : "glass-navy text-[#142984]/70 hover:text-[#142984]"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <section id="services" className="relative w-full py-24 scroll-mt-24" data-testid="section-services">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-head text-4xl lg:text-5xl text-[#142984] mb-6">Our Services</h2>
        <p className="font-body text-base lg:text-lg text-[#142984]/80 max-w-4xl mb-10">{SERVICES_INTRO}</p>

        <div className="flex flex-wrap gap-3 mb-10">
          <TabButton id="pragati" label="For Pragati Kendra Partners" />
          <TabButton id="lending" label="For Lending Institutions" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {cards.map((card, i) => (
              <ServiceCard key={card.title} card={card} i={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
