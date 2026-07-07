import React from "react";
import { motion } from "framer-motion";
import { PARTNERS } from "@/data/site";

export default function PartnersInImpact() {
  return (
    <section id="partners" className="relative w-full py-24 scroll-mt-24" data-testid="section-partners">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-head text-4xl lg:text-5xl text-[#142984] mb-3">Partners in Impact</h2>
        <p className="font-body text-base lg:text-lg text-[#142984]/70 mb-12 max-w-2xl">
          Institutions, incubators, and ecosystems backing cGreen's mission across Bharat.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
          {PARTNERS.map((p, i) => (
            <motion.div
              key={p}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: (i % 5) * 0.06 }}
              className="glass glass-navy rounded-2xl h-24 flex items-center justify-center"
              data-testid={`partner-${i}`}
            >
              {/* logo placeholder slot */}
              <span className="font-head text-lg text-[#142984]/80">{p}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
