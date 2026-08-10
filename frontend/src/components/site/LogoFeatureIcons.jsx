import React from "react";

// Gold line-art feature icons for the cGreen logo circuit diagram.
const GOLD = "#FCDD15";

const p = (s) => ({
  width: s,
  height: s,
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: GOLD,
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

function GearRing({ r = 12, teeth = 8, tl = 4, cx = 24, cy = 24 }) {
  const lines = [];
  for (let k = 0; k < teeth; k++) {
    const a = (Math.PI * 2 * k) / teeth;
    lines.push(
      <line
        key={k}
        x1={cx + Math.cos(a) * r}
        y1={cy + Math.sin(a) * r}
        x2={cx + Math.cos(a) * (r + tl)}
        y2={cy + Math.sin(a) * (r + tl)}
      />
    );
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} />
      {lines}
    </g>
  );
}

const RiskScoring = (s) => (
  <svg {...p(s)}>
    <GearRing r={12} teeth={8} tl={4} />
    <rect x={20} y={20} width={8} height={8} rx={1.2} />
    <line x1={22.5} y1={18} x2={22.5} y2={20} />
    <line x1={25.5} y1={18} x2={25.5} y2={20} />
    <line x1={22.5} y1={28} x2={22.5} y2={30} />
    <line x1={25.5} y1={28} x2={25.5} y2={30} />
    <line x1={18} y1={22.5} x2={20} y2={22.5} />
    <line x1={28} y1={25.5} x2={30} y2={25.5} />
  </svg>
);

const Socioeconomic = (s) => (
  <svg {...p(s)}>
    <GearRing r={12} teeth={8} tl={4} />
    <circle cx={21} cy={21.5} r={2.1} />
    <circle cx={27} cy={21.5} r={2.1} />
    <path d="M18 28.5 a3 3 0 0 1 6 0" />
    <path d="M24 28.5 a3 3 0 0 1 6 0" />
  </svg>
);

const IntentAbility = (s) => (
  <svg {...p(s)}>
    <rect x={14} y={14} width={20} height={20} rx={3} />
    <line x1={19} y1={10} x2={19} y2={14} />
    <line x1={24} y1={10} x2={24} y2={14} />
    <line x1={29} y1={10} x2={29} y2={14} />
    <line x1={19} y1={34} x2={19} y2={38} />
    <line x1={24} y1={34} x2={24} y2={38} />
    <line x1={29} y1={34} x2={29} y2={38} />
    <line x1={10} y1={20} x2={14} y2={20} />
    <line x1={10} y1={28} x2={14} y2={28} />
    <line x1={34} y1={20} x2={38} y2={20} />
    <line x1={34} y1={28} x2={38} y2={28} />
    <polyline points="19,24 22.5,28 30,19" />
  </svg>
);

const FinancialInclusion = (s) => (
  <svg {...p(s)}>
    <polyline points="12,19 24,11 36,19" />
    <line x1={14} y1={19} x2={14} y2={31} />
    <line x1={20} y1={19} x2={20} y2={31} />
    <line x1={28} y1={19} x2={28} y2={31} />
    <line x1={34} y1={19} x2={34} y2={31} />
    <line x1={11} y1={35} x2={37} y2={35} />
    <path d="M20.5 26 a4 3 0 0 0 7 0" />
  </svg>
);

const CustomerPlace = (s) => (
  <svg {...p(s)}>
    <path d="M24 11 a7.5 7.5 0 0 1 7.5 7.5 C31.5 24 24 32 24 32 C24 32 16.5 24 16.5 18.5 A7.5 7.5 0 0 1 24 11 Z" />
    <circle cx={24} cy={18.5} r={2.6} />
    <line x1={24} y1={33} x2={24} y2={37} />
    <line x1={17} y1={37} x2={31} y2={37} />
    <circle cx={15} cy={37} r={1.4} />
    <circle cx={33} cy={37} r={1.4} />
  </svg>
);

const VoiceTranscription = (s) => (
  <svg {...p(s)}>
    <rect x={20} y={10} width={8} height={14} rx={4} />
    <path d="M16 22 a8 8 0 0 0 16 0" />
    <line x1={24} y1={30} x2={24} y2={34} />
    <line x1={20} y1={34} x2={28} y2={34} />
    <path d="M34 18 a3.5 4 0 0 1 0 8" />
    <path d="M37 15 a5.5 7 0 0 1 0 14" />
  </svg>
);

const PragatiKendra = (s) => (
  <svg {...p(s)}>
    <GearRing r={12} teeth={8} tl={4} />
    <circle cx={24} cy={21} r={2.6} />
    <path d="M19 29 a5 4 0 0 1 10 0" />
  </svg>
);

const RuralInfra = (s) => (
  <svg {...p(s)}>
    <polyline points="14,14 24,14 22,20 16,20 14,14" />
    <line x1={16.5} y1={20} x2={15} y2={33} />
    <line x1={21.5} y1={20} x2={23} y2={33} />
    <line x1={15.7} y1={27} x2={22.3} y2={27} />
    <line x1={13} y1={33} x2={25} y2={33} />
    <polyline points="28,25 32,21 36,25" />
    <rect x={29} y={25} width={6} height={8} />
    <circle cx={38} cy={34} r={2.4} />
  </svg>
);

const DigitalConnect = (s) => (
  <svg {...p(s)}>
    <rect x={14} y={14} width={20} height={20} rx={3} />
    <line x1={19} y1={10} x2={19} y2={14} />
    <line x1={24} y1={10} x2={24} y2={14} />
    <line x1={29} y1={10} x2={29} y2={14} />
    <line x1={19} y1={34} x2={19} y2={38} />
    <line x1={24} y1={34} x2={24} y2={38} />
    <line x1={29} y1={34} x2={29} y2={38} />
    <line x1={10} y1={20} x2={14} y2={20} />
    <line x1={10} y1={28} x2={14} y2={28} />
    <line x1={34} y1={20} x2={38} y2={20} />
    <line x1={34} y1={28} x2={38} y2={28} />
    <path d="M18 24 a8 8 0 0 1 12 0" />
    <path d="M20.5 27.5 a4.5 4.5 0 0 1 7 0" />
    <circle cx={24} cy={30} r={1.2} fill={GOLD} stroke="none" />
  </svg>
);

export const FEATURE_ICONS = {
  "Risk Scoring": RiskScoring,
  "Socioeconomic & Demographic Validation": Socioeconomic,
  "Intent & Ability Verification": IntentAbility,
  "Financial Inclusion": FinancialInclusion,
  "Customer Place Verification": CustomerPlace,
  "Voice Transcription": VoiceTranscription,
  "Pragati Kendra": PragatiKendra,
  "Rural Infra": RuralInfra,
  "Digital Connect": DigitalConnect,
};
