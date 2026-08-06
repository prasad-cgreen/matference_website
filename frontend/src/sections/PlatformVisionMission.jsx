import React from "react";
import { motion } from "framer-motion";
import { Eye, Target } from "lucide-react";
import { VISION, MISSION } from "@/data/site";
import PlatformDiagram from "@/sections/PlatformDiagram";

export default function PlatformVisionMission() {
  return (
    <section
      className="relative w-full pt-12 pb-24 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #FFFDF7 0%, #FAF0CE 55%, #F4E5A2 100%)" }}
      data-testid="section-platform-vision"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header + minimal line–dot–line divider */}
        <div className="text-center mb-14">
          <h2 className="font-head text-4xl lg:text-5xl text-[#142984]">VISION AND MISSION</h2>
          <div className="flex items-center justify-center gap-3 mt-5">
            <span className="h-px w-40 bg-[#142984]/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FCDD15]" />
            <span className="h-px w-40 bg-[#142984]/40" />
          </div>
        </div>

        {/* Staggered cascade: Vision upper-left (larger), Mission lower-right (smaller) */}
        <div className="relative max-w-6xl mx-auto">
          {/* VISION — solid navy */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="relative z-10 md:w-[58%] rounded-[28px] p-8 lg:p-10"
            style={{ background: "#142984", boxShadow: "0 22px 45px -20px rgba(20,41,132,0.45)" }}
            data-testid="card-vision"
          >
            <div className="flex items-center gap-4 mb-5">
              <span className="shrink-0 w-14 h-14 rounded-full border-2 border-[#FCDD15] flex items-center justify-center">
                <Eye size={26} strokeWidth={2} className="text-[#FCDD15]" />
              </span>
              <h3 className="font-head text-2xl lg:text-3xl text-[#FCDD15]">VISION</h3>
            </div>
            <p className="font-body text-base lg:text-lg leading-relaxed text-white">{VISION}</p>

            {/* Elbow connector to Mission (desktop only) */}
            <div className="hidden md:block absolute z-30" style={{ left: "52%", top: "100%" }}>
              <svg width="230" height="90" viewBox="0 0 230 90" fill="none">
                <circle cx="8" cy="8" r="5" fill="#FCDD15" stroke="#142984" strokeWidth="1.5" />
                <path d="M8 8 V50 Q8 62 20 62 H200" stroke="#FCDD15" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <circle cx="206" cy="62" r="5" fill="#FCDD15" stroke="#142984" strokeWidth="1.5" />
              </svg>
            </div>
          </motion.div>

          {/* MISSION — solid yellow, offset down-right, overlapping */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative z-20 md:w-[52%] md:ml-auto mt-8 md:-mt-10 rounded-[28px] p-8 lg:p-10"
            style={{ background: "#FCDD15", boxShadow: "0 22px 45px -20px rgba(20,41,132,0.35)" }}
            data-testid="card-mission"
          >
            <div className="flex items-center gap-4 mb-5">
              <span className="shrink-0 w-14 h-14 rounded-full border-2 border-[#142984] flex items-center justify-center">
                <Target size={26} strokeWidth={2} className="text-[#142984]" />
              </span>
              <h3 className="font-head text-2xl lg:text-3xl text-[#142984]">MISSION</h3>
            </div>
            <p className="font-body text-base lg:text-lg leading-relaxed text-[#142984]">{MISSION}</p>
          </motion.div>
        </div>

        {/* Platform subsection */}
        <div id="platform" className="mt-20 scroll-mt-28" data-testid="platform-subsection">
          <h3 className="font-head text-2xl lg:text-3xl text-[#142984] mb-6">PLATFORM</h3>
          {/* Interactive capability diagram: orbiting nodes + glass hub + side panels */}
          <PlatformDiagram />
        </div>
      </div>
    </section>
  );
}
