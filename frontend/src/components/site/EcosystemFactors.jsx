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

// Canonical factor -> icon + one-line explanation. Reused wherever a factor is
// shown so the same factor always carries the same icon and copy.
export const URBAN_FACTORS = [
  { label: "Bank", Icon: Landmark, desc: "Banks give the city direct access to formal credit and financial stability." },
  { label: "NBFC", Icon: BadgePercent, desc: "NBFCs reach borrowers that traditional banks often turn away." },
  { label: "Call Centres", Icon: Headset, desc: "Call centres create skilled local jobs and keep borrowers just a call away." },
  { label: "Collection Agencies", Icon: Folder, desc: "Collection agencies step in early, resolving overdue accounts before they turn into losses." },
  { label: "Higher Trust", Icon: Handshake, desc: "Years of financial history here mean lenders can extend credit with far less risk." },
  { label: "Financial Literacy", Icon: BookOpen, desc: "Borrowers already understand their terms, so repayments come with fewer surprises or defaults." },
  { label: "Digital Infrastructure", Icon: RadioTower, desc: "Strong digital infrastructure lets lenders verify and approve loans in real time instead of days." },
  { label: "High Phone Connectivity", Icon: Smartphone, desc: "Agents can follow up quickly by phone instead of chasing borrowers in person." },
  { label: "Locatable Addresses", Icon: MapPin, desc: "Clear addresses let lenders verify identity and follow up without costly field visits." },
];

export const RURAL_FACTORS = [
  { label: "High Delinquency", Icon: TrendingDown, desc: "Missed payments pile up here, eroding lenders' willingness to extend future credit to the region." },
  { label: "Broken Trust", Icon: HeartCrack, desc: "When trust breaks down, borrowers avoid lenders altogether, cutting off future credit access." },
  { label: "No Empathy", Icon: Frown, desc: "Without empathy in these conversations, borrowers hide financial trouble instead of asking for help early." },
  { label: "Lender Overload", Icon: Layers, desc: "Lenders are stretched too thin, so each borrower gets less time and follow-up than they need." },
  { label: "Financial Illiteracy", Icon: BookX, desc: "Loan terms go unexplained, so borrowers often take on debt without realizing the real cost of repayment." },
  { label: "Lack of Banks & NBFC", Icon: Building2, desc: "With no formal lender nearby, people get pushed toward costlier informal credit instead." },
];

const slug = (s) => s.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

// Permanently visible reference list of ecosystem factors, sits beneath a circle.
// Chips are two-way synced with the orbit dots via activeLabel + onHover.
export default function EcosystemFactors({ factors, theme = "navy", activeLabel = null, onHover, testid }) {
  const navy = theme === "navy";
  const title = navy ? "Ecosystem Advantages" : "Ecosystem Disadvantages";
  const placeholder = navy
    ? "Hover a factor to see why it strengthens urban lending."
    : "Hover a factor to see why it weakens rural lending.";
  const lineCls = navy ? "bg-[#142984]/25" : "bg-[#FCDD15]/70";
  const restCls = navy
    ? "border-[#142984]/30 bg-white/70 text-[#142984]"
    : "border-[#FCDD15] bg-[#FCDD15]/25 text-[#142984]";
  const activeCls = navy
    ? "border-[#142984] bg-[#142984] text-white"
    : "border-[#FCDD15] bg-[#FCDD15] text-[#142984]";
  const set = (v) => onHover && onHover(v);

  const activeFactor = factors.find((f) => f.label === activeLabel);
  const desc = activeFactor?.desc;

  return (
    <div className="w-full max-w-lg mx-auto mt-3" data-testid={testid}>
      <div className="flex items-center gap-4 mb-2.5">
        <span className={`h-px flex-1 ${lineCls}`} />
        <span className="text-xs font-body font-semibold tracking-[0.28em] uppercase text-[#142984] whitespace-nowrap">
          {title}
        </span>
        <span className={`h-px flex-1 ${lineCls}`} />
      </div>

      {/* Shared, synced explanation line — bold text inside a per-section pill */}
      <div className="min-h-[3.5rem] mb-3 flex items-center justify-center">
        <span
          data-testid={`${testid}-desc`}
          aria-live="polite"
          className={`inline-block text-center px-5 py-2.5 rounded-full text-sm font-body font-bold leading-snug ${
            navy ? "glass glass-yellow text-[#142984]" : "border border-[#142984] text-[#FCDD15]"
          }`}
          style={navy ? undefined : { background: "rgba(20,41,132,0.92)" }}
        >
          {desc || placeholder}
        </span>
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
