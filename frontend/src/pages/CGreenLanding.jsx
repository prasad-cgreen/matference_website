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

// Fired when River 2 reaches the logo; ScalingWithPurpose listens for this.
const notifyLogoArrival = () => window.dispatchEvent(new CustomEvent("river-logo-arrived"));

export default function CGreenLanding() {
  const riverWrapRef = useRef(null);

  return (
    <div className="relative w-full bg-[#FFFCFA]" data-testid="cgreen-landing">
      <Navbar />

      {/* Shared container spanning S1 (urban), S2 (rural) & S3 (logo) so both
          data-rivers share one coordinate space. `isolate` traps all river /
          section stacking below the fixed nav (z-50). */}
      <div ref={riverWrapRef} className="relative isolate" data-testid="river-wrap">
        {/* River 1: urban circle -> rural circle */}
        <DataRiverOverlay
          containerRef={riverWrapRef}
          src="/river-stream-v3.png"
          imgW={1847}
          imgH={852}
          blue={{ fx: 0.96, fy: 0.2 }}
          purple={{ fx: 0.025, fy: 0.88 }}
          srcSel="urban-scene-img"
          dstSel="rural-scene-img"
          srcAnchor={(S) => ({ x: S.x - S.R * 0.08, y: S.y + S.R * 0.34 })}
          dstAnchor={(D) => ({ x: D.x - D.R * 0.28, y: D.y })}
          testid="data-river-overlay"
        />

        {/* River 2: rural circle (4-5 o'clock, underlapping) -> logo (left edge, underlapping) */}
        <DataRiverOverlay
          containerRef={riverWrapRef}
          src="/river_asset_rural_to_logo.png"
          imgW={1847}
          imgH={852}
          blue={{ fx: 0.02, fy: 0.17 }}
          purple={{ fx: 0.97, fy: 0.81 }}
          srcSel="rural-scene-img"
          dstSel="solution-logo-hub"
          srcAnchor={(S) => ({ x: S.x + S.R * 0.62, y: S.y + S.R * 0.62 })}
          dstAnchor={(D) => ({ x: D.x - D.R * 2.0, y: D.y })}
          onArrive={notifyLogoArrival}
          flowReverse
          testid="data-river-overlay-2"
        />

        <HeroSection />
        <BharatProblem />
        <ScalingWithPurpose />
      </div>

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
