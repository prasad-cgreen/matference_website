import React from "react";
import { motion } from "framer-motion";
import { Linkedin, User } from "lucide-react";
import { TEAM, NOMINEE_DIRECTORS } from "@/data/site";

const cardCls = "glass glass-yellow rounded-[24px] p-6";

function Avatar({ member }) {
  if (member.photo) {
    return (
      <img
        src={member.photo}
        alt={member.name}
        className="w-16 h-16 rounded-2xl object-cover object-top bg-[#142984] shrink-0"
        loading="lazy"
      />
    );
  }
  return (
    <div className="w-16 h-16 rounded-2xl bg-[#142984] text-[#FCDD15] flex items-center justify-center shrink-0">
      <User size={30} strokeWidth={1.8} />
    </div>
  );
}

function TeamCard({ member, index, testidPrefix }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      className={cardCls}
      data-testid={`${testidPrefix}-card-${index}`}
    >
      <div className="flex items-center gap-4 mb-4">
        <Avatar member={member} />
        <div>
          <h3 className="font-head text-lg text-[#142984] leading-tight">{member.name}</h3>
          <p className="font-body text-sm text-[#142984]/70">{member.title}</p>
        </div>
      </div>
      {member.bio ? (
        <p className="font-body text-sm text-[#142984]/80 mb-4">{member.bio}</p>
      ) : null}
      <span
        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#142984]/10 text-[#142984] cursor-not-allowed"
        title="LinkedIn (coming soon)"
        data-testid={`${testidPrefix}-linkedin-${index}`}
      >
        <Linkedin size={18} />
      </span>
    </motion.div>
  );
}

const subHeading = "font-head text-lg lg:text-xl tracking-[0.18em] uppercase text-[#142984] mb-6";

export default function OurTeam() {
  return (
    <section id="team" className="relative w-full py-24 scroll-mt-24" data-testid="section-team">
      <div className="max-w-7xl mx-auto px-6">
        {/* Our Team */}
        <h2 className="font-head text-4xl lg:text-5xl text-[#142984] mb-3" data-testid="team-heading">OUR TEAM</h2>
        <p className="font-body text-base lg:text-lg text-[#142984]/70 mb-12 max-w-2xl">
          Operators and builders who have scaled rural distribution, collections, and technology across India's leading financial institutions.
        </p>

        <h3 className={subHeading} data-testid="managing-team-heading">Managing Team</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM.map((m, i) => (
            <TeamCard key={m.name} member={m} index={i} testidPrefix="team" />
          ))}
        </div>

        {/* Nominee Directors On Board */}
        <h3 className={`${subHeading} mt-20`} data-testid="nominee-heading">Nominee Directors On Board</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {NOMINEE_DIRECTORS.map((m, i) => (
            <TeamCard key={m.name} member={m} index={i} testidPrefix="nominee" />
          ))}
        </div>

        {/* Advisors To The Board */}
        <h3 className={`${subHeading} mt-20`} data-testid="advisors-heading">Advisors To The Board</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className={`${cardCls} flex items-center justify-center min-h-[140px]`} data-testid="advisors-coming-soon">
            <span className="font-head text-2xl text-[#142984]/80">Coming Soon</span>
          </div>
        </div>
      </div>
    </section>
  );
}
