import React from "react";

// Raster illustration: financial-district skyline (Aurum Capital, Nexus Finance,
// Apex Solutions, Bluestone Bank, Orion Trust) with elevated train + street.
export default function UrbanScene({ className = "" }) {
  return (
    <img
      src="/urban-scene-v3.png"
      alt="Financial district skyline at dusk"
      className={`${className} object-cover select-none`}
      draggable="false"
      data-testid="urban-scene-img"
    />
  );
}
