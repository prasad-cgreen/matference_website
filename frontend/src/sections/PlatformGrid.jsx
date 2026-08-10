import React, { useState } from "react";
import { useIsDesktop } from "@/hooks/useResponsive";
import {
  Landmark, Users, Headset, Store,
  FileText, History, Database, MousePointerClick, Phone, MapPin,
  RefreshCw, AudioLines, GitBranch, Brain, Workflow, Webhook, ShieldCheck,
  Smartphone, Footprints, ClipboardCheck, Network,
  ListChecks, Target, Gauge, TrendingUp, TrendingDown, Smile,
} from "lucide-react";

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const GROUPS = [
  {
    key: "stakeholders", title: "STAKEHOLDERS",
    items: [
      { label: "Lenders", Icon: Landmark },
      { label: "Customers", Icon: Users },
      { label: "Remote Teams", Icon: Headset },
      { label: "Pragati Kendras", Icon: Store },
    ],
  },
  {
    key: "inputs", title: "INPUTS",
    items: [
      { label: "Loan & Allocation Data", Icon: FileText },
      { label: "Payment History", Icon: History },
      { label: "Bureau & Customer Data", Icon: Database },
      { label: "Digital Reactions", Icon: MousePointerClick },
      { label: "Voice Calls", Icon: Phone },
      { label: "Field Visits & CPV", Icon: MapPin },
    ],
  },
  {
    key: "intelligence", title: "CGREEN INTELLIGENCE LAYER", hero: true,
    items: [
      { label: "Customer 360", Icon: RefreshCw },
      { label: "Voice AI", Icon: AudioLines },
      { label: "Rules Engine", Icon: GitBranch },
      { label: "ML Scoring", Icon: Brain },
      { label: "Workflow Orchestration", Icon: Workflow },
      { label: "API Integrations", Icon: Webhook },
      { label: "Secure Cloud Infrastructure", Icon: ShieldCheck },
    ],
  },
  {
    key: "execution", title: "EXECUTION",
    items: [
      { label: "Digital Collections", Icon: Smartphone },
      { label: "Remote Collections", Icon: Headset },
      { label: "Field Collections", Icon: Footprints },
      { label: "CPV", Icon: ClipboardCheck },
      { label: "Pragati Kendra Network", Icon: Network },
    ],
  },
  {
    key: "outputs", title: "OUTPUTS",
    items: [
      { label: "Prioritised Worklists", Icon: ListChecks },
      { label: "Next Best Action", Icon: Target },
      { label: "Intent & Ability Signals", Icon: Gauge },
      { label: "Higher Collections", Icon: TrendingUp },
      { label: "Lower Roll Rates", Icon: TrendingDown },
      { label: "Better Customer Experience", Icon: Smile },
    ],
  },
];

const YELLOW_GLASS = {
  background: "rgba(252,221,21,0.38)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(252,221,21,0.65)",
  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.45), 0 12px 40px rgba(20,41,132,0.10)",
};

function StdCard({ item, highlighted, onEnter, onLeave, onClick }) {
  return (
    <button
      type="button"
      data-testid={`platform-item-${slug(item.label)}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="w-full flex items-center gap-4 text-left transition-all duration-200"
      style={{
        borderRadius: 14,
        padding: "16px 20px",
        ...(highlighted
          ? YELLOW_GLASS
          : { background: "#FFFCFA", border: "1px solid rgba(20,41,132,0.14)" }),
      }}
    >
      <span
        className="shrink-0 flex items-center justify-center"
        style={{ width: 44, height: 44, borderRadius: 9999, background: "rgba(20,41,132,0.08)", border: "1px solid rgba(20,41,132,0.2)" }}
      >
        <item.Icon size={22} strokeWidth={1.8} color="#142984" />
      </span>
      <span style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 500, fontSize: 17, color: "#142984" }}>
        {item.label}
      </span>
    </button>
  );
}

function HeroCard({ item, hot }) {
  return (
    <div
      data-testid={`platform-item-${slug(item.label)}`}
      className="w-full flex items-center gap-4 transition-all duration-200"
      style={{
        borderRadius: 14,
        padding: "16px 20px",
        background: hot ? "rgba(255,252,250,0.14)" : "rgba(255,252,250,0.08)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: hot ? "1px solid rgba(252,221,21,0.7)" : "1px solid rgba(252,221,21,0.35)",
      }}
    >
      <span
        className="shrink-0 flex items-center justify-center"
        style={{ width: 44, height: 44, borderRadius: 9999, background: "rgba(252,221,21,0.15)", border: "1px solid #FCDD15" }}
      >
        <item.Icon size={22} strokeWidth={1.8} color="#FCDD15" />
      </span>
      <span style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 500, fontSize: 17, color: "#FFFCFA" }}>
        {item.label}
      </span>
    </div>
  );
}

// Standard group (Stakeholders / Inputs / Execution / Outputs) with box + section hover.
function StdGroup({ group, isDesktop }) {
  const [hi, setHi] = useState({ kind: "none", id: null });
  const sectionOn = hi.kind === "group";

  const groupEnter = () => isDesktop && setHi({ kind: "group" });
  const groupLeave = () => isDesktop && setHi({ kind: "none" });
  const cardEnter = (id) => isDesktop && setHi({ kind: "card", id });
  const cardLeave = () => isDesktop && setHi({ kind: "group" });

  // Touch: tap-to-toggle
  const tapGroup = (e) => {
    if (isDesktop) return;
    if (e.target !== e.currentTarget) return; // only bare padding/header taps
    setHi((p) => (p.kind === "group" ? { kind: "none" } : { kind: "group" }));
  };
  const tapCard = (id) => (e) => {
    e.stopPropagation();
    if (isDesktop) return;
    setHi((p) => (p.kind === "card" && p.id === id ? { kind: "none" } : { kind: "card", id }));
  };

  return (
    <div
      data-testid={`platform-group-${group.key}`}
      onMouseEnter={groupEnter}
      onMouseLeave={groupLeave}
      onClick={tapGroup}
      className="flex-1 min-w-0 self-start transition-all duration-200"
      style={{
        borderRadius: 24,
        padding: 28,
        ...(sectionOn ? YELLOW_GLASS : { background: "rgba(20,41,132,0.05)", border: "1px solid rgba(20,41,132,0.18)" }),
      }}
    >
      <h4
        onClick={tapGroup}
        className="text-center mb-6"
        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: 2, textTransform: "uppercase", color: "#142984" }}
      >
        {group.title}
      </h4>
      <div className="flex flex-col gap-4">
        {group.items.map((it) => (
          <StdCard
            key={it.label}
            item={it}
            highlighted={hi.kind === "card" && hi.id === it.label}
            onEnter={() => cardEnter(it.label)}
            onLeave={cardLeave}
            onClick={tapCard(it.label)}
          />
        ))}
      </div>
    </div>
  );
}

// Intelligence Layer — permanent navy hero styling; single hover zone for whole column.
function HeroGroup({ group, hot, onEnter, onLeave, onClick, isDesktop }) {
  return (
    <div
      data-testid={`platform-group-${group.key}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="self-start transition-all duration-200"
      style={{
        flex: isDesktop ? "1.15 1 0" : "1 1 auto",
        minWidth: 0,
        borderRadius: 28,
        padding: 28,
        paddingBottom: isDesktop ? 60 : 28, // 32px overhang below the other groups (desktop)
        background: "#142984",
        border: hot ? "2px solid #FFE96B" : "2px solid #FCDD15",
      }}
    >
      <h4
        className="text-center mb-6"
        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: 2, textTransform: "uppercase", color: "#FCDD15" }}
      >
        {group.title}
      </h4>
      <div className="flex flex-col gap-4">
        {group.items.map((it) => (
          <HeroCard key={it.label} item={it} hot={hot} />
        ))}
      </div>
    </div>
  );
}

function LoopVideo({ visible, style, testid }) {
  return (
    <video
      data-testid={testid}
      src="/infinity_loop.webm"
      autoPlay
      muted
      loop
      playsInline
      style={{ opacity: visible ? 1 : 0, transition: "opacity 150ms ease", ...style }}
      aria-hidden="true"
    />
  );
}

export default function PlatformGrid() {
  const isDesktop = useIsDesktop(900);
  const [heroHot, setHeroHot] = useState(false);

  const heroGroup = GROUPS.find((g) => g.hero);
  const stdGroups = GROUPS.filter((g) => !g.hero); // stakeholders, inputs, execution, outputs

  const heroEnter = () => isDesktop && setHeroHot(true);
  const heroLeave = () => isDesktop && setHeroHot(false);
  const heroTap = () => { if (!isDesktop) setHeroHot((v) => !v); };

  const hero = (
    <HeroGroup
      group={heroGroup}
      hot={heroHot}
      isDesktop={isDesktop}
      onEnter={heroEnter}
      onLeave={heroLeave}
      onClick={heroTap}
    />
  );

  if (isDesktop) {
    // Row: G1 G2 [Intelligence] [150px gutter+loop] G4 G5
    return (
      <div className="flex flex-row items-start gap-5" data-testid="platform-grid">
        <StdGroup group={stdGroups[0]} isDesktop={isDesktop} />
        <StdGroup group={stdGroups[1]} isDesktop={isDesktop} />
        {hero}
        {/* fixed 150px gutter, always present; loop fades in on hero hover */}
        <div className="shrink-0 flex items-center justify-center relative" style={{ width: 150, alignSelf: "stretch" }} data-testid="platform-loop-gutter">
          <LoopVideo visible={heroHot} testid="platform-loop-video" style={{ height: 130, width: "auto" }} />
        </div>
        <StdGroup group={stdGroups[2]} isDesktop={isDesktop} />
        <StdGroup group={stdGroups[3]} isDesktop={isDesktop} />
      </div>
    );
  }

  // Mobile: stack vertically, full width, 20px gap; loop gutter sits below Intelligence Layer.
  return (
    <div className="flex flex-col" style={{ gap: 20 }} data-testid="platform-grid">
      <StdGroup group={stdGroups[0]} isDesktop={isDesktop} />
      <StdGroup group={stdGroups[1]} isDesktop={isDesktop} />
      {hero}
      <div className="w-full flex items-center justify-center" data-testid="platform-loop-gutter">
        <LoopVideo visible={heroHot} testid="platform-loop-video" style={{ height: 130, width: "auto", maxWidth: "100%" }} />
      </div>
      <StdGroup group={stdGroups[2]} isDesktop={isDesktop} />
      <StdGroup group={stdGroups[3]} isDesktop={isDesktop} />
    </div>
  );
}
