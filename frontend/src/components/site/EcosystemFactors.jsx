import React from "react";
import {
  Landmark,
  BadgePercent,
  Headset,
  Folder,
  Handshake,
  BookOpen,
  RadioTower,
  Smartphone,
  MapPin,
  TrendingDown,
  HeartCrack,
  Frown,
  Layers,
  BookX,
  Building2,
} from "lucide-react";

// Canonical factor -> icon mapping. Reused anywhere a factor is shown (static
// list here + orbit tooltips) so the same factor always carries the same icon.
export const URBAN_FACTORS = [
  { label: "Bank", Icon: Landmark },
  { label: "NBFC", Icon: BadgePercent },
  { label: "Call Centres", Icon: Headset },
  { label: "Collection Agencies", Icon: Folder },
  { label: "Higher Trust", Icon: Handshake },
  { label: "Financial Literacy", Icon: BookOpen },
  { label: "Digital Infrastructure", Icon: RadioTower },
  { label: "High Phone Connectivity", Icon: Smartphone },
  { label: "Locatable Addresses", Icon: MapPin },
];

export const RURAL_FACTORS = [
  { label: "High Delinquency", Icon: TrendingDown },
  { label: "Broken Trust", Icon: HeartCrack },
  { label: "No Empathy", Icon: Frown },
  { label: "Lender Overload", Icon: Layers },
  { label: "Financial Illiteracy", Icon: BookX },
  { label: "Lack of Banks & NBFC", Icon: Building2 },
];

const slug = (s) => s.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

// Permanently visible reference list of ecosystem factors, sits beneath a circle.
// Chips are two-way synced with the orbit dots via activeLabel + onHover.
export default function EcosystemFactors({ factors, theme = "navy", activeLabel = null, onHover, testid }) {
  const navy = theme === "navy";
  const lineCls = navy ? "bg-[#142984]/25" : "bg-[#FCDD15]/70";
  const restCls = navy
    ? "border-[#142984]/30 bg-white/70 text-[#142984]"
    : "border-[#FCDD15] bg-[#FCDD15]/25 text-[#142984]";
  const activeCls = navy
    ? "border-[#142984] bg-[#142984] text-white"
    : "border-[#FCDD15] bg-[#FCDD15] text-[#142984]";
  const set = (v) => onHover && onHover(v);

  return (
    <div className="w-full max-w-lg mx-auto mt-6" data-testid={testid}>
      <div className="flex items-center gap-4 mb-4">
        <span className={`h-px flex-1 ${lineCls}`} />
        <span className="text-xs font-body font-semibold tracking-[0.28em] uppercase text-[#142984] whitespace-nowrap">
          Ecosystem Factors
        </span>
        <span className={`h-px flex-1 ${lineCls}`} />
      </div>
      <div className="flex flex-wrap justify-center gap-2.5">
        {factors.map(({ label, Icon }) => {
          const active = activeLabel === label;
          return (
            <button
              key={label}
              type="button"
              data-testid={`factor-chip-${slug(label)}`}
              aria-pressed={active}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-body font-medium transition-colors duration-200 ${active ? activeCls : restCls}`}
              onMouseEnter={() => set(label)}
              onMouseLeave={() => set(null)}
              onFocus={() => set(label)}
              onBlur={() => set(null)}
              onClick={() => set(active ? null : label)}
            >
              <Icon size={14} strokeWidth={1.75} className="shrink-0" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
