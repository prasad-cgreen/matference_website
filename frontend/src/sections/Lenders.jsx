import React from "react";
import { LENDERS } from "@/data/site";
import { useLogos } from "@/hooks/useSiteContent";

export default function Lenders() {
  const lenders = useLogos("lenders", LENDERS);
  // Doubled so the marquee can loop without a visible seam.
  const row = [...lenders, ...lenders];
  return (
    <section className="relative w-full py-16 overflow-hidden" data-testid="section-lenders">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <h2 className="font-head text-2xl lg:text-3xl text-[#142984]">Trusted by Lenders</h2>
      </div>
      <div className="relative w-full overflow-hidden">
        <div className="marquee-track gap-5">
          {row.map((l, i) => (
            <div
              key={`${l.alt}-${i}`}
              className="bg-white border border-[#142984]/10 rounded-2xl h-20 min-w-[220px] flex items-center justify-center px-8 shadow-sm"
              data-testid={`lender-${i}`}
            >
              <img
                src={l.src}
                alt={l.alt}
                className="max-h-12 max-w-[150px] w-auto h-auto object-contain"
                loading="lazy"
                draggable="false"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
