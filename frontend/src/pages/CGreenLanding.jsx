import React, { useRef } from "react";
import Navbar from "@/components/site/Navbar";
import DataRiverOverlay from "@/components/site/DataRiverOverlay";
import HeroSection from "@/sections/HeroSection";
import BharatProblem from "@/sections/BharatProblem";
import ScalingWithPurpose from "@/sections/ScalingWithPurpose";
import PlatformVisionMission from "@/sections/PlatformVisionMission";
import OurServices from "@/sections/OurServices";
import OurTeam from "@/sections/OurTeam";
import PartnersInImpact from "@/sections/PartnersInImpact";
import Lenders from "@/sections/Lenders";
import ContactUs from "@/sections/ContactUs";
import Footer from "@/sections/Footer";

export default function CGreenLanding() {
  const riverWrapRef = useRef(null);

  return (
    <div className="relative w-full bg-[#FFFCFA]" data-testid="cgreen-landing">
      <Navbar />

      {/* Shared container: the data-river connects the urban (S1) & rural (S2) circles.
          `isolate` traps all river/section stacking below the fixed nav (z-50). */}
      <div ref={riverWrapRef} className="relative isolate" data-testid="river-wrap">
        <DataRiverOverlay containerRef={riverWrapRef} />
        <HeroSection />
        <BharatProblem />
      </div>

      <ScalingWithPurpose />
      <PlatformVisionMission />
      <OurServices />
      <OurTeam />
      <PartnersInImpact />
      <Lenders />
      <ContactUs />
      <Footer />
    </div>
  );
}
