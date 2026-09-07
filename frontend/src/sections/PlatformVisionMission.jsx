import React from "react";
import { motion } from "framer-motion";
import { Eye, Target, Landmark, Users, Store, Network } from "lucide-react";
import { VISION, MISSION } from "@/data/site";
import { useSection } from "@/hooks/useSiteContent";

const AUDIENCE_BOXES = [
  { id: "lenders", hex: "#7C97D6", Icon: Landmark, heading: "For Lenders", body: "Deeper district-level reach without having to create a separate physical operating infrastructure for every service." },
  { id: "customers", hex: "#5568AD", Icon: Users, heading: "For Customers", body: "A nearby, technology-enabled point for communication, verification, payment assistance and responsible resolution." },
  { id: "entrepreneurs", hex: "#2C3D8F", Icon: Store, heading: "For Local Entrepreneurs", body: "A structured opportunity connected to institutional work, technology, training and measurable operating standards." },
  { id: "cgreen", hex: "#142984", Icon: Network, heading: "For CGreen", body: "A collections-first operating network that can support a wider range of lender and customer services over time." },
];

const FADE_UP = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 } };
const VISION_T = { duration: 0.7 };
const MISSION_T = { duration: 0.7, delay: 0.15 };

const VM_FALLBACK = {
  heading: "VISION AND MISSION",
  vision_title: "VISION",
  vision_body: VISION,
  mission_title: "MISSION",
  mission_body: MISSION,
};

export default function PlatformVisionMission() {
  const copy = useSection("vision_mission", VM_FALLBACK);
  return (
    <section
      className="relative w-full pt-12 pb-8 overflow-hidden bg-[#FFFCFA]"
      data-testid="section-platform-vision"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header + minimal line–dot–line divider */}
        <div className="text-center mb-14">
          <h2 className="font-head text-4xl lg:text-5xl text-[#142984]">{copy.heading}</h2>
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
            {...FADE_UP}
            transition={VISION_T}
            className="relative z-10 md:w-[58%] rounded-[28px] p-8 lg:p-10"
            style={{ background: "#142984", boxShadow: "0 22px 45px -20px rgba(20,41,132,0.45)" }}
            data-testid="card-vision"
          >
            <div className="flex items-center gap-4 mb-5">
              <span className="shrink-0 w-14 h-14 rounded-full border-2 border-[#FCDD15] flex items-center justify-center">
                <Eye size={26} strokeWidth={2} className="text-[#FCDD15]" />
              </span>
              <h3 className="font-head text-2xl lg:text-3xl text-[#FCDD15]">{copy.vision_title}</h3>
            </div>
            <p className="font-body text-base lg:text-lg leading-relaxed text-white">{copy.vision_body}</p>

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
            {...FADE_UP}
            transition={MISSION_T}
            className="relative z-20 md:w-[52%] md:ml-auto mt-8 md:-mt-10 rounded-[28px] p-8 lg:p-10"
            style={{ background: "#FCDD15", boxShadow: "0 22px 45px -20px rgba(20,41,132,0.35)" }}
            data-testid="card-mission"
          >
            <div className="flex items-center gap-4 mb-5">
              <span className="shrink-0 w-14 h-14 rounded-full border-2 border-[#142984] flex items-center justify-center">
                <Target size={26} strokeWidth={2} className="text-[#142984]" />
              </span>
              <h3 className="font-head text-2xl lg:text-3xl text-[#142984]">{copy.mission_title}</h3>
            </div>
            <p className="font-body text-base lg:text-lg leading-relaxed text-[#142984]">{copy.mission_body}</p>
          </motion.div>
        </div>

        {/* Branching connector (copies Vision→Mission elbow style) + four audience boxes */}
        <div className="max-w-6xl mx-auto relative z-0 mt-8 md:-mt-[26px]">
          <svg className="hidden md:block w-full h-auto" viewBox="0 0 1000 130" fill="none" aria-hidden="true" data-testid="vm-branch-connector">
            <path d="M 740 6 V 55" stroke="#FCDD15" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 125 55 H 875" stroke="#FCDD15" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 125 55 V 122" stroke="#FCDD15" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 375 55 V 122" stroke="#FCDD15" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 625 55 V 122" stroke="#FCDD15" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 875 55 V 122" stroke="#FCDD15" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="740" cy="6" r="5" fill="#FCDD15" stroke="#142984" strokeWidth="1.5" />
            <circle cx="125" cy="122" r="5" fill="#FCDD15" stroke="#142984" strokeWidth="1.5" />
            <circle cx="375" cy="122" r="5" fill="#FCDD15" stroke="#142984" strokeWidth="1.5" />
            <circle cx="625" cy="122" r="5" fill="#FCDD15" stroke="#142984" strokeWidth="1.5" />
            <circle cx="875" cy="122" r="5" fill="#FCDD15" stroke="#142984" strokeWidth="1.5" />
          </svg>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 md:mt-1" data-testid="vm-audience-boxes">
            {AUDIENCE_BOXES.map((b) => (
              <div key={b.id} className="rounded-2xl p-6 flex flex-col" style={{ background: b.hex }} data-testid={`vm-box-${b.id}`}>
                <span className="w-12 h-12 rounded-full border-2 border-[#FCDD15] flex items-center justify-center mb-4">
                  <b.Icon size={22} strokeWidth={2} className="text-[#FCDD15]" />
                </span>
                <h4 className="font-head text-lg text-[#FCDD15] mb-2">{b.heading}</h4>
                <p className="font-body text-sm leading-relaxed text-[#FFFCFA]/90">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
