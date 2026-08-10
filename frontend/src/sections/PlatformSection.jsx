import React from "react";
import PlatformGrid from "@/sections/PlatformGrid";

export default function PlatformSection() {
  return (
    <section
      id="platform"
      className="relative w-full pt-12 pb-8 overflow-hidden bg-[#FFFCFA] scroll-mt-28"
      data-testid="section-platform"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <h3 className="font-head text-2xl lg:text-3xl text-[#142984] mb-6">PLATFORM</h3>
        <PlatformGrid />
      </div>
    </section>
  );
}
