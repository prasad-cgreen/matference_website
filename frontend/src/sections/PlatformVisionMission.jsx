import React from "react";
import { motion } from "framer-motion";
import { VISION, MISSION } from "@/data/site";

export default function PlatformVisionMission() {
  return (
    <section
      className="relative w-full py-24"
      style={{ background: "#FFF4C2" }}
      data-testid="section-platform-vision"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-head text-4xl lg:text-5xl text-[#142984]">VISION AND MISSION</h2>
        </div>

        {/* Vision / Mission cards — navy blue glassmorphism */}
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { h: "VISION", body: VISION },
            { h: "MISSION", body: MISSION },
          ].map((c, i) => (
            <motion.div
              key={c.h}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="glass glass-navy rounded-[28px] p-8 lg:p-10"
              data-testid={`card-${c.h.toLowerCase()}`}
            >
              <h3 className="font-head text-2xl text-center text-[#FCDD15] mb-5">{c.h}</h3>
              <p className="font-body text-base lg:text-lg leading-relaxed text-white">{c.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Platform subsection */}
        <div id="platform" className="mt-20 scroll-mt-28" data-testid="platform-subsection">
          <h3 className="font-head text-2xl lg:text-3xl text-[#142984] mb-6">PLATFORM</h3>
          {/* Purple-gradient glass box with empty 16:9 video placeholder (intentional one-off color) */}
          <div className="glass glass-purple rounded-[24px] p-3">
            <div className="w-full rounded-2xl" style={{ aspectRatio: "16 / 9" }} data-testid="video-placeholder">
              {/* empty framed video placeholder — no play button, no thumbnail, no text */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
