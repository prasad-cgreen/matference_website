import React, { useState } from "react";
import {
  LineChart,
  Users,
  Share2,
  Bell,
  AudioLines,
  RefreshCw,
  Database,
  Leaf,
  Globe,
  Phone,
} from "lucide-react";

// Hub center + orbit radius as fractions of the (aspect-locked) container.
const CX = 47.2;
const CY = 45.55;
const RING_H = 55.4; // ring square side as % of container height (= 2R)

const NODES = [
  { id: "performance-dashboard", label: "Performance Dashboard", angle: -90, Icon: LineChart, desc: "Real-time KPIs and recovery metrics at a glance." },
  { id: "micro-segmentation", label: "Micro-Segmentation", angle: -50, Icon: Users, desc: "Group borrowers by behaviour for sharper targeting." },
  { id: "omni-channel-outreach", label: "Omni-Channel Outreach", angle: -0.9, Icon: Share2, desc: "Reach borrowers across every channel, seamlessly." },
  { id: "alerts", label: "Alerts", angle: 51.9, Icon: Bell, desc: "Timely nudges on risk, dues and follow-ups." },
  { id: "voice-engagement", label: "Voice Engagement", angle: 90, Icon: AudioLines, desc: "AI-assisted voice conversations that feel human." },
  { id: "customer-360", label: "360° Customer View", angle: 129.7, Icon: RefreshCw, desc: "A complete, unified profile of every borrower." },
];

const LEFT_CARDS = [
  { id: "lender-data", label: "Lender Data", Icon: Database },
  { id: "socio-economic", label: "Socio Economic Insights", Icon: Users },
  { id: "environment", label: "Environment", Icon: Leaf },
];

// Branch stub y-positions (SVG units) matching each Data-Sources card.
const BRANCHES = [
  { id: "lender-data", y: 307 },
  { id: "socio-economic", y: 465 },
  { id: "environment", y: 603 },
];

const RIGHT_CARDS = [
  { id: "digital-connect", label: "Digital Connect", Icon: Globe },
  { id: "remote-connect", label: "Remote Connect", Icon: Phone },
  { id: "smart-connect", label: "Smart Collect", Icon: Share2 },
];

function OrbitNode({ node, onHover, hovered }) {
  const { Icon } = node;
  const left = 50 + 50 * Math.cos((node.angle * Math.PI) / 180);
  const top = 50 + 50 * Math.sin((node.angle * Math.PI) / 180);
  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: `${left}%`, top: `${top}%`, transform: "translate(-50%, -50%)" }}
    >
      {/* counter-rotates so the node stays upright while it revolves */}
      <div className="plat-upright relative flex flex-col items-center pointer-events-auto">
        <button
          type="button"
          data-testid={`platform-node-${node.id}`}
          onMouseEnter={() => onHover(node.id)}
          onMouseLeave={() => onHover(null)}
          onFocus={() => onHover(node.id)}
          onBlur={() => onHover(null)}
          className="glass glass-navy rounded-full flex items-center justify-center transition-transform duration-200"
          style={{
            width: 74,
            height: 74,
            transform: hovered ? "scale(1.12)" : "scale(1)",
            boxShadow: hovered ? "0 0 0 2px #FCDD15, 0 0 26px rgba(252,221,21,0.75)" : undefined,
          }}
        >
          {/* icon rotates to follow the orbit curve */}
          <span className="plat-icon flex">
            <Icon size={30} strokeWidth={1.9} className="text-[#142984]" />
          </span>
        </button>

        <span className="mt-2 font-head text-[11px] leading-tight text-center uppercase tracking-wide text-[#142984] w-28">
          {node.label}
        </span>

        {hovered && (
          <span
            role="tooltip"
            data-testid={`platform-tooltip-${node.id}`}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-30 w-44 glass glass-navy rounded-xl px-3 py-2 text-[11px] font-body font-medium leading-snug text-white text-center"
          >
            {node.desc}
          </span>
        )}
      </div>
    </div>
  );
}

function SidePanelCard({ card, onHover }) {
  const { Icon } = card;
  const [hot, setHot] = useState(false);
  return (
    <div
      data-testid={`platform-card-${card.id}`}
      onMouseEnter={() => { setHot(true); onHover && onHover(true); }}
      onMouseLeave={() => { setHot(false); onHover && onHover(false); }}
      className="glass rounded-2xl flex items-center gap-3 px-4 py-3 transition-colors duration-200"
      style={
        hot
          ? { background: "rgba(252,221,21,0.30)", border: "1px solid #FCDD15" }
          : { background: "rgba(20,41,132,0.10)", border: "1px solid rgba(20,41,132,0.18)" }
      }
    >
      <span className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-white/70 border border-[#142984]/15">
        <Icon size={18} strokeWidth={1.9} className="text-[#142984]" />
      </span>
      <span className="font-body text-sm font-semibold text-[#142984] leading-tight">{card.label}</span>
    </div>
  );
}

export default function PlatformDiagram() {
  const [hoverNode, setHoverNode] = useState(null);
  const [hotSource, setHotSource] = useState(null);

  const omniHot = hoverNode === "omni-channel-outreach";

  return (
    <div
      className="relative w-full max-w-[1100px] mx-auto"
      style={{ aspectRatio: "1512 / 1058" }}
      data-testid="platform-diagram"
    >
      {/* SVG: concentric circles + static Data-Sources connectors to hub */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1512 1058" fill="none">
        {/* metallic-blue sheen gradient for connector lines */}
        <defs>
          <linearGradient id="metalBlue" gradientUnits="userSpaceOnUse" x1="316" y1="470" x2="1173" y2="494">
            <stop offset="0%" stopColor="#1B347F" />
            <stop offset="38%" stopColor="#4E71C9" />
            <stop offset="50%" stopColor="#A9C3F4" />
            <stop offset="62%" stopColor="#4E71C9" />
            <stop offset="100%" stopColor="#1B347F" />
          </linearGradient>
        </defs>

        {/* shared trunk: vertical bracket bar + bar→hub + right connector */}
        <g stroke="url(#metalBlue)" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.6">
          <path d="M 372 307 V 603" />
          <path d="M 372 465 H 470 Q 490 465 490 482 V 482" />
          <path d="M 470 465 H 545" />
          {/* right connector: hub → Omni-Channel Sub Channels panel */}
          <path d="M 886 482 H 1173" />
        </g>
        {/* three Data-Sources branch stubs — each brightens yellow when its card is hovered */}
        {BRANCHES.map((b) => {
          const on = hotSource === b.id;
          return (
            <g key={b.id} data-testid={`platform-branch-${b.id}`}>
              <path
                d={`M 316 ${b.y} H 372`}
                fill="none"
                strokeLinecap="round"
                stroke={on ? "#FCDD15" : "url(#metalBlue)"}
                strokeWidth={on ? 3.2 : 2.2}
                opacity={on ? 1 : 0.6}
              />
              <circle cx="316" cy={b.y} r="4.5" fill={on ? "#FCDD15" : "#3A5BBF"} opacity={on ? 1 : 0.6} />
            </g>
          );
        })}
        <g opacity="0.6">
          <circle cx="545" cy="465" r="4.5" fill="#3A5BBF" />
          <circle cx="886" cy="482" r="4.5" fill="#3A5BBF" />
          <circle cx="1173" cy="482" r="4.5" fill="#3A5BBF" />
        </g>

        {/* outer boundary circle (nodes orbit along it) */}
        <circle cx="713.7" cy="482" r="293" stroke="#142984" strokeOpacity="0.55" strokeWidth="1.6" strokeDasharray="2 7" />
        {/* inner hub circle */}
        <circle cx="713.7" cy="482" r="172" stroke="#142984" strokeWidth="2" />
      </svg>

      {/* Hub: logo + tagline, centered */}
      <div
        className="absolute flex flex-col items-center justify-center text-center pointer-events-none"
        style={{ left: `${CX}%`, top: `${CY}%`, transform: "translate(-50%, -50%)", width: "22%" }}
        data-testid="platform-hub"
      >
        <img src="/cgreen-logo.png" alt="cGreen" className="w-full h-auto max-w-[190px]" draggable="false" />
      </div>

      {/* Orbit ring with 6 continuously revolving nodes */}
      <div
        className="plat-ring absolute pointer-events-none"
        style={{ left: `${CX}%`, top: `${CY}%`, height: `${RING_H}%`, aspectRatio: "1 / 1" }}
        data-testid="platform-orbit-ring"
      >
        {NODES.map((n) => (
          <OrbitNode key={n.id} node={n} hovered={hoverNode === n.id} onHover={setHoverNode} />
        ))}
      </div>

      {/* Left panel: Data Sources */}
      <div
        className="plat-ambient glass-no-shine absolute rounded-3xl glass p-4 flex flex-col"
        style={{ position: "absolute", left: "3%", top: "16.3%", width: "17.9%", height: "48.9%", background: "rgba(255,255,255,0.55)", border: "1.5px solid #FCDD15" }}
        data-testid="platform-panel-data-sources"
      >
        <h4 className="font-head text-xs lg:text-sm text-[#142984] mb-3 tracking-wide">DATA SOURCES</h4>
        <div className="flex flex-col gap-3 flex-1 justify-center">
          {LEFT_CARDS.map((c) => (
            <SidePanelCard
              key={c.id}
              card={c}
              onHover={(v) => setHotSource(v ? c.id : null)}
            />
          ))}
        </div>
      </div>

      {/* Right panel: Omni-Channel Sub Channels — mirrors Data Sources height */}
      <div
        className={`plat-ambient absolute rounded-3xl glass p-4 flex flex-col ${omniHot ? "plat-panel-hot" : ""}`}
        style={{
          position: "absolute",
          left: "77.6%",
          top: "21.1%",
          width: "18.9%",
          height: "48.9%",
          background: omniHot ? "rgba(252,221,21,0.18)" : "rgba(255,255,255,0.55)",
          border: "1.5px solid #FCDD15",
        }}
        data-testid="platform-panel-omni"
      >
        <h4 className="font-head text-xs lg:text-sm text-[#142984] mb-3 tracking-wide leading-tight">OMNI-CHANNEL SUB CHANNELS</h4>
        <div className="flex flex-col gap-3 flex-1 justify-center">
          {RIGHT_CARDS.map((c) => (
            <SidePanelCard key={c.id} card={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
