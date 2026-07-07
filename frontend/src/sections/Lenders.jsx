import React from "react";
import { LENDERS } from "@/data/site";

export default function Lenders() {
  const row = [...LENDERS, ...LENDERS];
  return (
    <section className="relative w-full py-16 overflow-hidden" data-testid="section-lenders">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <h2 className="font-head text-2xl lg:text-3xl text-[#142984]">Trusted by Lenders</h2>
      </div>
      <div className="relative w-full overflow-hidden">
        <div className="marquee-track gap-5">
          {row.map((l, i) => (
            <div
              key={i}
              className="glass glass-yellow rounded-2xl h-20 min-w-[220px] flex items-center justify-center px-8"
              data-testid={`lender-${i}`}
            >
              {/* lender logo placeholder */}
              <span className="font-head text-base text-[#142984] whitespace-nowrap">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
