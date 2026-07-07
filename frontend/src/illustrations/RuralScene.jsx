import React from "react";

// Flat-vector dusk Tier-3 village street, contained in a circle.
// The natural blue river is the one deliberate blue element (morph target from the data-river).

export default function RuralScene({ className = "" }) {
  return (
    <svg viewBox="0 0 500 500" className={className} role="img" aria-label="Rural village street at dusk with a natural river">
      <defs>
        <clipPath id="ruralCircle">
          <circle cx="250" cy="250" r="248" />
        </clipPath>
        <linearGradient id="rSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A3568" />
          <stop offset="55%" stopColor="#6B5C86" />
          <stop offset="100%" stopColor="#C9A57E" />
        </linearGradient>
        <linearGradient id="rRiver" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5AA0D6" />
          <stop offset="100%" stopColor="#2E6FA8" />
        </linearGradient>
      </defs>

      <g clipPath="url(#ruralCircle)">
        <rect x="0" y="0" width="500" height="500" fill="url(#rSky)" />

        {/* Temple spire far background */}
        <g transform="translate(250,60)" fill="#8A6E8F" opacity="0.7">
          <path d="M0 60 L-14 60 L-7 20 L0 4 L7 20 L14 60 Z" />
          <circle cx="0" cy="2" r="3" fill="#E0B15E" />
        </g>

        {/* Stone railway arch bridge (background) */}
        <g transform="translate(0,120)">
          <rect x="60" y="0" width="380" height="46" fill="#6C5A66" />
          {[100, 180, 260, 340].map((x) => (
            <path key={x} d={`M${x} 46 Q${x + 30} 6 ${x + 60} 46 Z`} fill="#3A3568" />
          ))}
          {/* train silhouette on bridge */}
          <g transform="translate(150,-16)">
            <rect x="0" y="0" width="130" height="16" rx="5" fill="#4A4270" />
            {[6, 26, 46, 66, 86, 106].map((x) => (
              <rect key={x} x={x} y="4" width="12" height="8" rx="1.5" fill="#E7C98A" opacity="0.85" />
            ))}
          </g>
        </g>

        {/* Left row of shops */}
        {[
          { x: 40, y: 250, w: 74, h: 120, c: "#C97B4A", roof: "#8A4E2E", sign: "#3A6B2E", label: "KIRANA" },
          { x: 118, y: 235, w: 70, h: 135, c: "#D89A5B", roof: "#A76A38", sign: "#7A3B5C", label: "MEDICAL" },
        ].map((b) => (
          <g key={b.x}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={b.c} />
            <rect x={b.x - 4} y={b.y - 12} width={b.w + 8} height={14} fill={b.roof} />
            <rect x={b.x + 8} y={b.y + 16} width={b.w - 16} height={12} rx="2" fill={b.sign} />
            <rect x={b.x + b.w / 2 - 10} y={b.y + b.h - 34} width="20" height="34" fill="#5A3722" />
            <rect x={b.x + 10} y={b.y + 40} width="16" height="16" fill="#F2E3C7" opacity="0.85" />
            <rect x={b.x + b.w - 26} y={b.y + 40} width="16" height="16" fill="#F2E3C7" opacity="0.85" />
          </g>
        ))}

        {/* Right row of shops */}
        {[
          { x: 312, y: 240, w: 72, h: 130, c: "#B5613A", roof: "#7E3E22", sign: "#2E5A7A", label: "BANK" },
          { x: 388, y: 252, w: 72, h: 118, c: "#D8A45B", roof: "#A87838", sign: "#6B4B2E", label: "REPAIR" },
        ].map((b) => (
          <g key={b.x}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={b.c} />
            <rect x={b.x - 4} y={b.y - 12} width={b.w + 8} height={14} fill={b.roof} />
            <rect x={b.x + 8} y={b.y + 16} width={b.w - 16} height={12} rx="2" fill={b.sign} />
            <rect x={b.x + b.w / 2 - 10} y={b.y + b.h - 34} width="20" height="34" fill="#5A3722" />
            <rect x={b.x + 10} y={b.y + 42} width="15" height="15" fill="#F2E3C7" opacity="0.85" />
            <rect x={b.x + b.w - 25} y={b.y + 42} width="15" height="15" fill="#F2E3C7" opacity="0.85" />
          </g>
        ))}

        {/* ATM kiosk */}
        <g transform="translate(196,300)">
          <rect x="0" y="0" width="30" height="52" fill="#C2C9C4" />
          <rect x="5" y="6" width="20" height="14" rx="2" fill="#2E5A7A" />
          <text x="15" y="34" textAnchor="middle" fill="#3A3568" fontSize="7" fontFamily="Montserrat, sans-serif" fontWeight="800">ATM</text>
        </g>

        {/* Natural blue river through the middle */}
        <path d="M -20 470 C 120 440 150 380 250 372 C 350 380 380 440 520 470 L 520 500 L -20 500 Z" fill="url(#rRiver)" />
        <path d="M 40 458 C 140 436 200 402 250 398" fill="none" stroke="#BFE0F5" strokeWidth="2" opacity="0.6" />
        <path d="M 250 402 C 320 408 380 438 460 458" fill="none" stroke="#BFE0F5" strokeWidth="2" opacity="0.5" />

        {/* Wooden footbridge over the river */}
        <g transform="translate(210,356)">
          <path d="M0 16 Q40 -6 80 16" fill="none" stroke="#7A4E2E" strokeWidth="6" />
          <rect x="0" y="16" width="4" height="16" fill="#5A3722" />
          <rect x="76" y="16" width="4" height="16" fill="#5A3722" />
        </g>

        {/* Wooden power poles with lines */}
        {[70, 250, 430].map((x, i) => (
          <g key={x}>
            <rect x={x} y="200" width="4" height="70" fill="#5A3722" />
            <rect x={x - 8} y="206" width="20" height="4" fill="#5A3722" />
            {i < 2 && <line x1={x + 2} y1="208" x2={[250, 430][i] + 2} y2="208" stroke="#2A2540" strokeWidth="1" opacity="0.6" />}
          </g>
        ))}

        {/* Cows near riverbank */}
        {[130, 340].map((x) => (
          <g key={x} transform={`translate(${x},400)`} fill="#E7DCC8">
            <ellipse cx="0" cy="0" rx="18" ry="9" />
            <rect x="-16" y="6" width="4" height="12" />
            <rect x="12" y="6" width="4" height="12" />
            <circle cx="-20" cy="-4" r="6" />
            <path d="M-24 -8 l-3 -5 M-16 -8 l3 -5" stroke="#B5613A" strokeWidth="1.5" />
          </g>
        ))}

        {/* Vegetable / street-food cart with vendor */}
        <g transform="translate(160,420)">
          <rect x="0" y="0" width="40" height="16" rx="2" fill="#B5613A" />
          <rect x="2" y="-8" width="36" height="8" fill="#3A6B2E" />
          <circle cx="8" cy="20" r="5" fill="#5A3722" />
          <circle cx="32" cy="20" r="5" fill="#5A3722" />
          <g transform="translate(-14,-2)" fill="#4A3A2E">
            <circle cx="0" cy="-4" r="3.5" />
            <rect x="-3" y="0" width="6" height="14" rx="2" />
          </g>
        </g>

        {/* Scooter */}
        <g transform="translate(300,430)" stroke="#4A4270" strokeWidth="2.5" fill="none">
          <circle cx="0" cy="12" r="6" />
          <circle cx="26" cy="12" r="6" />
          <path d="M0 12 L14 12 L20 4 M14 12 L18 6" />
          <g stroke="none" fill="#4A4270">
            <circle cx="19" cy="-2" r="3" />
          </g>
        </g>

        {/* Bicycle */}
        <g transform="translate(400,432)" stroke="#5A3722" strokeWidth="2" fill="none">
          <circle cx="0" cy="12" r="7" />
          <circle cx="22" cy="12" r="7" />
          <path d="M0 12 L11 4 L22 12 M11 4 L11 -1" />
        </g>

        {/* Pedestrians in traditional attire (iconographic) */}
        {[
          { x: 90, c: "#C0396B" },
          { x: 240, c: "#E0B15E" },
          { x: 360, c: "#3A6B7A" },
        ].map((p) => (
          <g key={p.x} transform={`translate(${p.x},436)`}>
            <circle cx="0" cy="0" r="4" fill="#4A3A2E" />
            <path d="M-5 4 L5 4 L7 22 L-7 22 Z" fill={p.c} />
          </g>
        ))}

        {/* Local cinema poster board */}
        <g transform="translate(232,280)">
          <rect x="0" y="0" width="26" height="20" rx="2" fill="#7A3B5C" />
          <rect x="3" y="3" width="20" height="14" fill="#E0B15E" />
        </g>
      </g>
    </svg>
  );
}
