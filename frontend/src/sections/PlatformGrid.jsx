import React from "react";
import { Cloud, Boxes, Zap, Lock, ClipboardList } from "lucide-react";

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const STRIP = [
  { label: "Cloud Native", Icon: Cloud },
  { label: "Microservices", Icon: Boxes },
  { label: "Real-Time Processing", Icon: Zap },
  { label: "Bank-Grade Security", Icon: Lock },
  { label: "Audit Trails", Icon: ClipboardList },
];

function BottomStrip() {
  return (
    <div
      data-testid="platform-bottom-strip"
      style={{ marginTop: 32, borderRadius: 24, border: "1px solid rgba(20,41,132,0.18)", background: "rgba(20,41,132,0.05)", padding: 16 }}
      className="flex flex-col sm:flex-row sm:items-stretch"
    >
      {STRIP.map((it, i) => (
        <div
          key={it.label}
          data-testid={`platform-strip-${slug(it.label)}`}
          className="flex-1 flex items-center justify-center gap-3 py-3 sm:py-0"
          style={i > 0 ? { borderLeft: "1px solid rgba(20,41,132,0.15)" } : undefined}
        >
          <it.Icon size={24} strokeWidth={1.8} color="#142984" />
          <span style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 500, fontSize: 14, color: "#142984" }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function PlatformGrid() {
  return (
    <>
      {/* Full-bleed: break out of the section's max-w container to span edge-to-edge */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen max-w-none">
        <video
          data-testid="platform-video"
          src="/957K_1.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-auto block"
        />
      </div>
      <BottomStrip />
    </>
  );
}
