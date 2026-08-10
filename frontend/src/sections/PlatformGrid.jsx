import React, { useState } from "react";
import { useIsDesktop } from "@/hooks/useResponsive";
import {
  Landmark, Users, Headset, Store,
  FileText, History, Database, MousePointerClick, Phone, MapPin,
  RefreshCw, AudioLines, GitBranch, Brain, Workflow, Webhook, ShieldCheck,
  Smartphone, Footprints, ClipboardCheck, Network,
  ListChecks, Target, Gauge, TrendingUp, TrendingDown, Smile,
  Cloud, Boxes, Zap, Lock, ClipboardList,
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

const STRIP = [
  { label: "Cloud Native", Icon: Cloud },
  { label: "Microservices", Icon: Boxes },
  { label: "Real-Time Processing", Icon: Zap },
  { label: "Bank-Grade Security", Icon: Lock },
  { label: "Audit Trails", Icon: ClipboardList },
];

const YELLOW_GLASS = {
  background: "rgba(252,221,21,0.38)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(252,221,21,0.65)",
  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.45), 0 12px 40px rgba(20,41,132,0.10)",
};

// Static right-pointing connector arrow that lives inside a 24px grid gap.
function Arrow({ side }) {
  const pos = side === "right" ? { right: -24 } : { left: -24 };
  return (
    <span
      aria-hidden="true"
      data-testid={`platform-arrow-${side}`}
      style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", width: 24, height: 14, display: "flex", alignItems: "center", zIndex: 5, pointerEvents: "none", ...pos }}
    >
      <span style={{ flex: 1, height: 2, background: "#FCDD15" }} />
      <span style={{ width: 0, height: 0, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderLeft: "14px solid #FCDD15" }} />
    </span>
  );
}

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
        ...(highlighted ? YELLOW_GLASS : { background: "#FFFCFA", border: "1px solid rgba(20,41,132,0.14)" }),
      }}
    >
      <span className="shrink-0 flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: 9999, background: "rgba(20,41,132,0.08)", border: "1px solid rgba(20,41,132,0.2)" }}>
        <item.Icon size={22} strokeWidth={1.8} color="#142984" />
      </span>
      <span style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 500, fontSize: 17, lineHeight: 1.25, color: "#142984" }}>
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
      <span className="shrink-0 flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: 9999, background: "rgba(252,221,21,0.15)", border: "1px solid #FCDD15" }}>
        <item.Icon size={22} strokeWidth={1.8} color="#FCDD15" />
      </span>
      <span style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 500, fontSize: 17, lineHeight: 1.25, color: "#FFFCFA" }}>
        {item.label}
      </span>
    </div>
  );
}

// Standard column (Stakeholders / Inputs / Execution / Outputs). Box + section hover.
function StdGroup({ group, isDesktop, arrows }) {
  const [hi, setHi] = useState({ kind: "none", id: null });
  const sectionOn = hi.kind === "group";

  const groupEnter = () => isDesktop && setHi({ kind: "group" });
  const groupLeave = () => isDesktop && setHi({ kind: "none" });
  const cardEnter = (id) => isDesktop && setHi({ kind: "card", id });
  const cardLeave = () => isDesktop && setHi({ kind: "group" });

  const tapGroup = (e) => {
    if (isDesktop) return;
    if (e.target !== e.currentTarget) return;
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
      className="relative flex flex-col transition-all duration-200"
      style={{
        borderRadius: 24,
        padding: 28,
        ...(sectionOn ? YELLOW_GLASS : { background: "rgba(20,41,132,0.05)", border: "1px solid rgba(20,41,132,0.18)" }),
      }}
    >
      {arrows?.left && isDesktop && <Arrow side="left" />}
      {arrows?.right && isDesktop && <Arrow side="right" />}
      <h4 onClick={tapGroup} className="text-center mb-6" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: 2, textTransform: "uppercase", color: "#142984" }}>
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

// Intelligence Layer — permanent navy hero. Single hover zone for the whole column.
// NOTE: no position/transform/overflow on this container (preserves card backdrop-filter).
function HeroGroup({ group, hot, onEnter, onLeave, onClick }) {
  return (
    <div
      data-testid={`platform-group-${group.key}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="flex flex-col transition-all duration-200"
      style={{
        borderRadius: 28,
        padding: 28,
        paddingBottom: 60, // +32px extension below the standard columns
        background: "#142984",
        border: hot ? "2px solid #FFE96B" : "2px solid #FCDD15",
      }}
    >
      <h4 className="text-center mb-6" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: 2, textTransform: "uppercase", color: "#FCDD15" }}>
        {group.title}
      </h4>
      <div className="flex flex-col gap-4">
        {group.items.map((it) => (<HeroCard key={it.label} item={it} hot={hot} />))}
      </div>
    </div>
  );
}

function LoopVideo({ visible, style }) {
  return (
    <video
      data-testid="platform-loop-video"
      src="/infinity_loop.webm"
      autoPlay muted loop playsInline
      aria-hidden="true"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 150ms ease", pointerEvents: "none", ...style }}
    />
  );
}

function BottomStrip() {
  return (
    <div
      data-testid="platform-bottom-strip"
      style={{ marginTop: 48, borderRadius: 24, border: "1px solid rgba(20,41,132,0.18)", background: "rgba(20,41,132,0.05)", padding: 24 }}
      className="flex flex-col sm:flex-row sm:items-stretch"
    >
      {STRIP.map((it, i) => (
        <div
          key={it.label}
          data-testid={`platform-strip-${slug(it.label)}`}
          className="flex-1 flex items-center justify-center gap-3 py-3 sm:py-0"
          style={i > 0 ? { borderLeft: "1px solid rgba(20,41,132,0.15)" } : undefined}
        >
          <it.Icon size={26} strokeWidth={1.8} color="#142984" />
          <span style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 500, fontSize: 16, color: "#142984" }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function PlatformGrid() {
  const isDesktop = useIsDesktop(900);
  const [heroHot, setHeroHot] = useState(false);

  const g = Object.fromEntries(GROUPS.map((x) => [x.key, x]));
  const heroEnter = () => isDesktop && setHeroHot(true);
  const heroLeave = () => isDesktop && setHeroHot(false);
  const heroTap = () => { if (!isDesktop) setHeroHot((v) => !v); };

  const hero = (
    <HeroGroup group={g.intelligence} hot={heroHot} onEnter={heroEnter} onLeave={heroLeave} onClick={heroTap} />
  );

  if (isDesktop) {
    return (
      <>
        <div
          data-testid="platform-grid"
          style={{ position: "relative", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) minmax(0,1.15fr) minmax(0,1fr) minmax(0,1fr)", gap: 24, alignItems: "stretch" }}
        >
          <StdGroup group={g.stakeholders} isDesktop arrows={{ right: true }} />
          <StdGroup group={g.inputs} isDesktop arrows={{ right: true }} />
          {hero}
          <StdGroup group={g.execution} isDesktop arrows={{ left: true, right: true }} />
          <StdGroup group={g.outputs} isDesktop />
          {/* Loop video: sibling anchored to the grid wrapper (outside the Intelligence column),
              sitting just right of column 3, vertically near the ML Scoring row. */}
          <LoopVideo visible={heroHot} style={{ position: "absolute", left: "60.5%", top: "50%", transform: "translateY(-50%)", width: 150, height: 130 }} />
        </div>
        <BottomStrip />
      </>
    );
  }

  // Mobile (<900px): single column stack, 20px gap, no arrows, loop below Intelligence column.
  return (
    <>
      <div data-testid="platform-grid" className="flex flex-col" style={{ gap: 20 }}>
        <StdGroup group={g.stakeholders} isDesktop={false} />
        <StdGroup group={g.inputs} isDesktop={false} />
        {hero}
        <div className="w-full flex items-center justify-center">
          <LoopVideo visible={heroHot} style={{ width: "auto", height: 130, maxWidth: "100%" }} />
        </div>
        <StdGroup group={g.execution} isDesktop={false} />
        <StdGroup group={g.outputs} isDesktop={false} />
      </div>
      <BottomStrip />
    </>
  );
}
