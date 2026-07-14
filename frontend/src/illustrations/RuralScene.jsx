import React from "react";

// Raster illustration: village street at dusk (General Store, Mobile Repair,
// Tea Stall, Pharmacy, Sahakari Bank) with arch railway bridge, footbridge,
// cows and a river running through the foreground.
export default function RuralScene({ className = "" }) {
  return (
    <img
      src="/rural-scene-v2.png"
      alt="Village street at dusk with a river"
      className={`${className} object-cover select-none`}
      draggable="false"
      data-testid="rural-scene-img"
    />
  );
}
