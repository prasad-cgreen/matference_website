import React, { useState } from "react";
import Navbar from "@/components/site/Navbar";
import GlobalRiver from "@/components/site/GlobalRiver";
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
import { useIsDesktop } from "@/hooks/useResponsive";

export default function CGreenLanding() {
  const [heroCaptionsDone, setHeroCaptionsDone] = useState(false);
  const isDesktop = useIsDesktop();

  return (
    <div className="relative w-full bg-[#FFFCFA]" data-testid="cgreen-landing">
      <Navbar />

      {/* THE ONE continuous river — single instance for the whole page */}
      {isDesktop && <GlobalRiver ready={heroCaptionsDone} />}

      <HeroSection onCaptionsDone={() => setHeroCaptionsDone(true)} />
      <BharatProblem />
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
