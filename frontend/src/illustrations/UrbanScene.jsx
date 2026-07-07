import React from "react";

// Flat-vector dusk financial-district skyline, contained in a circle.
// Palette: cool navy/teal buildings & sky, warm amber/cream lit windows, yellow accents.

const windows = (x, y, cols, rows, gap = 11, w = 6, h = 8, lit = "#F4C77A") => {
  const out = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const on = (r + c) % 3 !== 0;
      out.push(
        <rect
          key={`${x}-${y}-${r}-${c}`}
          x={x + c * gap}
          y={y + r * gap}
          width={w}
          height={h}
          rx="1"
          fill={on ? lit : "#0C1740"}
          opacity={on ? 0.92 : 0.5}
        />
      );
    }
  }
  return out;
};

export default function UrbanScene({ className = "" }) {
  return (
    <svg viewBox="0 0 500 500" className={className} role="img" aria-label="Urban financial district at dusk">
      <defs>
        <clipPath id="urbanCircle">
          <circle cx="250" cy="250" r="248" />
        </clipPath>
        <linearGradient id="uSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0C1B57" />
          <stop offset="52%" stopColor="#1C3E74" />
          <stop offset="78%" stopColor="#3A5C82" />
          <stop offset="100%" stopColor="#E7A24C" />
        </linearGradient>
        <radialGradient id="uGlow" cx="50%" cy="86%" r="55%">
          <stop offset="0%" stopColor="#F6C978" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F6C978" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g clipPath="url(#urbanCircle)">
        <rect x="0" y="0" width="500" height="500" fill="url(#uSky)" />
        <ellipse cx="250" cy="430" rx="320" ry="120" fill="url(#uGlow)" />

        {/* Background skyline silhouette */}
        <g fill="#0E1E52" opacity="0.85">
          <rect x="10" y="150" width="34" height="270" />
          <rect x="48" y="118" width="26" height="302" />
          <rect x="78" y="180" width="30" height="240" />
          <rect x="420" y="140" width="30" height="280" />
          <rect x="452" y="176" width="26" height="244" />
          <rect x="392" y="200" width="24" height="220" />
          <rect x="360" y="120" width="24" height="300" />
        </g>

        {/* Midground finance buildings */}
        {/* Building 1 - national bank */}
        <g>
          <rect x="70" y="205" width="70" height="215" fill="#16285C" />
          {windows(80, 224, 4, 15)}
          <rect x="78" y="188" width="54" height="18" rx="3" fill="#0B1740" />
          <text x="105" y="201" textAnchor="middle" fill="#FCDD15" fontSize="9" fontFamily="Montserrat, sans-serif" fontWeight="800">BHARAT BANK</text>
        </g>

        {/* Building 2 - investment corp with chart icon */}
        <g>
          <rect x="150" y="150" width="78" height="270" fill="#1B3168" />
          {windows(160, 170, 5, 20)}
          <rect x="158" y="132" width="62" height="18" rx="3" fill="#0B1740" />
          <text x="182" y="145" textAnchor="middle" fill="#FFE9C2" fontSize="8" fontFamily="Montserrat, sans-serif" fontWeight="800">VERTEX INVEST</text>
          {/* small upward bar chart icon */}
          <g transform="translate(206,135)">
            <rect x="0" y="6" width="3" height="6" fill="#FCDD15" />
            <rect x="4" y="3" width="3" height="9" fill="#FCDD15" />
            <rect x="8" y="0" width="3" height="12" fill="#FCDD15" />
          </g>
        </g>

        {/* Building 3 - trust & finance (tallest) */}
        <g>
          <rect x="238" y="112" width="66" height="308" fill="#13245A" />
          {windows(247, 132, 4, 24)}
          <rect x="246" y="94" width="50" height="18" rx="3" fill="#0B1740" />
          <text x="271" y="107" textAnchor="middle" fill="#FCDD15" fontSize="8" fontFamily="Montserrat, sans-serif" fontWeight="800">TRUST & CO</text>
          {/* ticker screen */}
          <g transform="translate(246,150)">
            <rect x="0" y="0" width="50" height="26" rx="3" fill="#08122F" stroke="#2B4C87" />
            <polyline points="4,20 12,14 20,17 28,8 36,11 46,3" fill="none" stroke="#FCDD15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="46" cy="3" r="2" fill="#FCDD15" />
            <text x="4" y="24.5" fill="#7FE3A6" fontSize="4.5" fontFamily="monospace">MARKETS OPEN</text>
          </g>
        </g>

        {/* Building 4 - credit union */}
        <g>
          <rect x="314" y="185" width="60" height="235" fill="#1A2E63" />
          {windows(323, 205, 4, 17)}
          <rect x="320" y="168" width="48" height="17" rx="3" fill="#0B1740" />
          <text x="344" y="180" textAnchor="middle" fill="#FFE9C2" fontSize="7.5" fontFamily="Montserrat, sans-serif" fontWeight="800">CREDIT UNION</text>
        </g>

        {/* Building 5 - regional bank */}
        <g>
          <rect x="384" y="230" width="52" height="190" fill="#16285C" />
          {windows(392, 250, 3, 14)}
          <rect x="388" y="214" width="44" height="16" rx="3" fill="#0B1740" />
          <text x="410" y="225" textAnchor="middle" fill="#FCDD15" fontSize="7" fontFamily="Montserrat, sans-serif" fontWeight="800">REGIO BANK</text>
        </g>

        {/* Elevated metro line */}
        <g>
          <rect x="0" y="352" width="500" height="9" fill="#0C1A45" />
          {[30, 100, 170, 240, 310, 380, 450].map((x) => (
            <rect key={x} x={x} y="361" width="9" height="58" fill="#0C1A45" />
          ))}
          {/* train silhouette */}
          <g transform="translate(120,332)">
            <rect x="0" y="0" width="150" height="20" rx="7" fill="#22407C" />
            {[8, 30, 52, 74, 96, 118].map((x) => (
              <rect key={x} x={x} y="5" width="14" height="10" rx="2" fill="#F4C77A" opacity="0.9" />
            ))}
          </g>
        </g>

        {/* Street */}
        <rect x="0" y="420" width="500" height="80" fill="#0A1338" />
        <rect x="0" y="440" width="500" height="4" fill="#28407A" opacity="0.6" strokeDasharray="14 12" />

        {/* Bus shelter */}
        <g transform="translate(24,404)">
          <rect x="0" y="0" width="40" height="16" rx="2" fill="#16285C" />
          <rect x="0" y="16" width="4" height="16" fill="#16285C" />
          <rect x="36" y="16" width="4" height="16" fill="#16285C" />
        </g>

        {/* Street trees */}
        {[/* x */ 96, 300, 470].map((x) => (
          <g key={x} transform={`translate(${x},404)`}>
            <rect x="4" y="16" width="4" height="20" fill="#0C1A45" />
            <circle cx="6" cy="12" r="12" fill="#173A44" />
          </g>
        ))}

        {/* Taxis (flat yellow) */}
        {[140, 360].map((x) => (
          <g key={x} transform={`translate(${x},452)`}>
            <rect x="0" y="6" width="46" height="16" rx="5" fill="#FCDD15" />
            <rect x="9" y="0" width="26" height="10" rx="4" fill="#FCDD15" />
            <circle cx="12" cy="24" r="5" fill="#0A1338" stroke="#3A5C82" />
            <circle cx="34" cy="24" r="5" fill="#0A1338" stroke="#3A5C82" />
          </g>
        ))}
        {/* Sedan */}
        <g transform="translate(230,458)">
          <rect x="0" y="5" width="42" height="14" rx="5" fill="#2C4E88" />
          <rect x="9" y="0" width="24" height="9" rx="4" fill="#2C4E88" />
          <circle cx="11" cy="21" r="4.5" fill="#0A1338" stroke="#3A5C82" />
          <circle cx="31" cy="21" r="4.5" fill="#0A1338" stroke="#3A5C82" />
        </g>

        {/* Cyclist */}
        <g transform="translate(310,462)" stroke="#8FA9CF" strokeWidth="2" fill="none">
          <circle cx="0" cy="14" r="6" />
          <circle cx="20" cy="14" r="6" />
          <path d="M0 14 L10 6 L20 14 M10 6 L10 0" />
          <circle cx="10" cy="-4" r="3" fill="#8FA9CF" />
        </g>

        {/* Pedestrians (business attire, iconographic) */}
        {[60, 200, 275, 420].map((x, i) => (
          <g key={x} transform={`translate(${x},468)`} fill="#B9CBE6">
            <circle cx="0" cy="0" r="3.5" />
            <rect x="-3" y="4" width="6" height="14" rx="2" />
            <rect x={i % 2 ? 3 : -8} y="9" width="5" height="7" rx="1" fill="#8FA9CF" />
          </g>
        ))}
      </g>
    </svg>
  );
}
