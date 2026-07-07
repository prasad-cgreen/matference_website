import React from "react";
import Navbar from "@/components/site/Navbar";
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
  return (
    <div className="relative w-full bg-[#FFFCFA]" data-testid="cgreen-landing">
      <Navbar />
      <HeroSection />
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
