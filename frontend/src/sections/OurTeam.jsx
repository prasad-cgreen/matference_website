import React from "react";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import { TEAM } from "@/data/site";

const initials = (name) =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

export default function OurTeam() {
  return (
    <section id="team" className="relative w-full py-24 scroll-mt-24" data-testid="section-team">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-head text-4xl lg:text-5xl text-[#142984] mb-3">Our Team</h2>
        <p className="font-body text-base lg:text-lg text-[#142984]/70 mb-12 max-w-2xl">
          Operators and builders who have scaled rural distribution, collections, and technology across India's leading financial institutions.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="glass glass-yellow rounded-[24px] p-6"
              data-testid={`team-card-${i}`}
            >
              <div className="flex items-center gap-4 mb-4">
                {/* photo placeholder */}
                <div className="w-16 h-16 rounded-2xl bg-[#142984] text-[#FCDD15] font-head text-xl flex items-center justify-center shrink-0">
                  {initials(m.name)}
                </div>
                <div>
                  <h3 className="font-head text-lg text-[#142984] leading-tight">{m.name}</h3>
                  <p className="font-body text-sm text-[#142984]/70">{m.title}</p>
                </div>
              </div>
              <p className="font-body text-sm text-[#142984]/80 mb-4">{m.bio}</p>
              {/* LinkedIn placeholder (links added later) */}
              <span
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#142984]/10 text-[#142984] cursor-not-allowed"
                title="LinkedIn (coming soon)"
                data-testid={`team-linkedin-${i}`}
              >
                <Linkedin size={18} />
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
