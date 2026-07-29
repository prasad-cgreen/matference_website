import React from "react";
import {
  Building2,
  Users,
  Cog,
  AlertTriangle,
  HandCoins,
  MapPin,
  TrendingUp,
} from "lucide-react";

const TABS = [
  { id: "lending-institution", label: "Lending Institution", Icon: Building2, active: true },
  { id: "pragati-kendra", label: "Pragati Kendra Partner", Icon: Users, active: false },
  { id: "internal-ops", label: "Internal Ops", Icon: Cog, active: false },
];

const TRANSCRIPT = [
  { t: "00:04", who: "Agent", text: "Namaste, this is Rahul from cGreen. How are you today?", tag: "Positive" },
  { t: "00:09", who: "Customer", text: "Namaste Rahul ji, I'm doing fine, thank you for calling.", tag: "Positive" },
  { t: "00:17", who: "Agent", text: "I see there is an overdue of ₹5,210. Can we discuss a payment plan?", tag: "At Risk" },
  { t: "00:29", who: "Customer", text: "I'm facing some financial constraints this month.", tag: "At Risk" },
  { t: "00:37", who: "Agent", text: "No worries, we can help you with a suitable plan.", tag: "Positive" },
];

const ALERTS = [
  { Icon: AlertTriangle, color: "#F87171", title: "High Risk Alert", desc: "12 customers moved to higher risk category", time: "2m ago" },
  { Icon: HandCoins, color: "#FCDD15", title: "Payment Promise", desc: "28 payment promises due today", time: "5m ago" },
  { Icon: MapPin, color: "#60A5FA", title: "Field Action", desc: "15 field visits recommended", time: "10m ago" },
];

const STATS = [
  { label: "Collection Rate", value: "76.4%", trend: "5.6% vs last month" },
  { label: "Active Cases", value: "18,642", trend: "12.3% vs last week" },
  { label: "Portfolio Health", value: "Good", trend: "Improved" },
  { label: "Amount Collected", value: "₹3.62 Cr", trend: "8.7% vs last month" },
];

const WAVE = Array.from({ length: 46 }, (_, i) => 20 + Math.round(28 * Math.abs(Math.sin(i * 0.7)) + (i % 3) * 6));

function TagPill({ tag }) {
  const positive = tag === "Positive";
  return (
    <span
      className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{
        color: positive ? "#34D399" : "#FBBF24",
        background: positive ? "rgba(52,211,153,0.14)" : "rgba(251,191,36,0.16)",
        border: `1px solid ${positive ? "rgba(52,211,153,0.4)" : "rgba(251,191,36,0.45)"}`,
      }}
    >
      {tag}
    </span>
  );
}

function RiskGauge() {
  const r = 62;
  const c = 2 * Math.PI * r;
  const pct = 72;
  const dash = (pct / 100) * c;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 168, height: 168 }}>
      <svg width="168" height="168" viewBox="0 0 168 168" className="-rotate-90">
        <circle cx="84" cy="84" r={r} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="12" />
        <circle
          cx="84" cy="84" r={r} fill="none" stroke="#FCDD15" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-head text-4xl text-white leading-none">72%</span>
        <span className="mt-1 text-xs font-semibold" style={{ color: "#34D399" }}>Low Risk</span>
      </div>
    </div>
  );
}

const panel = "rounded-2xl border border-white/10 bg-white/[0.04]";

export default function AICommandCenter() {
  return (
    <section id="ai-command-center" className="relative w-full py-24 bg-[#FFFCFA] scroll-mt-24" data-testid="section-ai-command-center">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-head text-3xl lg:text-4xl text-[#142984] text-center mb-2" data-testid="ai-coming-soon-header">
          COMING SOON
        </h2>
        <p className="font-body text-sm text-[#142984]/70 text-center mb-10">
          A preview of the cGreen AI Command Center
        </p>

        {/* Bordered dashboard container */}
        <div
          className="rounded-3xl p-5 lg:p-7 border border-[#FCDD15]/40 text-white overflow-hidden"
          style={{ background: "radial-gradient(1200px 500px at 30% -10%, #16276e 0%, #0a1240 55%, #070d2e 100%)" }}
          data-testid="ai-dashboard-container"
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h3 className="font-head text-xl lg:text-2xl tracking-wide">AI COMMAND CENTER</h3>
              <p className="font-body text-xs lg:text-sm text-white/60 mt-1">Intelligence that senses, acts, and impacts what matters.</p>
            </div>
            <span
              data-testid="ai-coming-soon-badge"
              className="shrink-0 font-head text-[11px] tracking-wider px-4 py-2 rounded-full text-[#142984]"
              style={{ background: "#FCDD15", boxShadow: "0 0 20px rgba(252,221,21,0.4)" }}
            >
              COMING SOON
            </span>
          </div>

          <div className="flex gap-5">
            {/* Sidebar */}
            <div className="w-52 shrink-0 flex flex-col gap-3" data-testid="ai-sidebar">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  data-testid={`ai-tab-${t.id}`}
                  aria-disabled={!t.active}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-colors"
                  style={
                    t.active
                      ? { background: "#FCDD15", color: "#142984", fontWeight: 700 }
                      : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.08)" }
                  }
                >
                  <t.Icon size={18} strokeWidth={2} />
                  <span className="font-body text-sm leading-tight">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">
              {/* Top row: Risk + Live Voice AI + Alerts */}
              <div className="grid grid-cols-1 xl:grid-cols-[220px_1fr_260px] gap-5">
                {/* AI Risk Score */}
                <div className={`${panel} p-5 flex flex-col items-center`} data-testid="ai-risk-score">
                  <div className="w-full flex items-center justify-between mb-3">
                    <span className="font-head text-xs tracking-wider text-white/80">AI RISK SCORE</span>
                    <span className="flex items-center gap-1 text-[10px] text-white/50">
                      <span className="w-2 h-2 rounded-full" style={{ background: "#34D399" }} />
                      <span className="w-2 h-2 rounded-full" style={{ background: "#FCDD15" }} />
                      <span className="w-2 h-2 rounded-full" style={{ background: "#F87171" }} />
                    </span>
                  </div>
                  <RiskGauge />
                  <div className="grid grid-cols-2 gap-2 w-full mt-4">
                    <div className="rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2 text-center">
                      <div className="text-[15px] font-head text-[#34D399]">-2.4%</div>
                      <div className="text-[10px] text-white/50">Risk trend</div>
                    </div>
                    <div className="rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2 text-center">
                      <div className="text-[15px] font-head text-white">8.9%</div>
                      <div className="text-[10px] text-white/50">Default rate</div>
                    </div>
                  </div>
                </div>

                {/* Live Voice AI */}
                <div className={`${panel} p-5 min-w-0`} data-testid="ai-live-voice">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-head text-sm tracking-wider flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: "#F87171" }} />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: "#F87171" }} />
                      </span>
                      LIVE VOICE AI
                    </span>
                    <span className="text-[11px] text-white/60">Live Call · 00:01:24</span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {TRANSCRIPT.map((l, i) => (
                      <div key={i} className="flex items-start gap-2.5" data-testid={`ai-transcript-line-${i}`}>
                        <span className="text-[10px] text-white/40 font-mono pt-1 w-9 shrink-0">{l.t}</span>
                        <div className="flex-1 min-w-0">
                          <span className={`text-[11px] font-semibold ${l.who === "Agent" ? "text-[#FCDD15]" : "text-[#60A5FA]"}`}>{l.who}: </span>
                          <span className="text-[12px] text-white/85">{l.text}</span>
                        </div>
                        <TagPill tag={l.tag} />
                      </div>
                    ))}
                  </div>

                  {/* Waveform */}
                  <div className="flex items-center justify-center gap-[3px] h-12 mt-4" data-testid="ai-waveform">
                    {WAVE.map((h, i) => (
                      <span key={i} className="w-[3px] rounded-full" style={{ height: h, background: "rgba(252,221,21,0.7)" }} />
                    ))}
                  </div>

                  <div className="mt-3 flex justify-end">
                    <span className="text-[11px] font-semibold px-3 py-1 rounded-full" style={{ color: "#FBBF24", background: "rgba(251,191,36,0.16)", border: "1px solid rgba(251,191,36,0.45)" }}>
                      Sentiment: At Risk
                    </span>
                  </div>
                </div>

                {/* Alert cards */}
                <div className="flex flex-col gap-3" data-testid="ai-alerts">
                  {ALERTS.map((a, i) => (
                    <div key={i} className={`${panel} p-4 flex gap-3`} data-testid={`ai-alert-${i}`}>
                      <span className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${a.color}22`, border: `1px solid ${a.color}66` }}>
                        <a.Icon size={16} style={{ color: a.color }} />
                      </span>
                      <div className="min-w-0">
                        <div className="text-[13px] font-head">{a.title}</div>
                        <div className="text-[11px] text-white/60 leading-snug">{a.desc}</div>
                        <div className="text-[10px] text-white/35 mt-1">{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="ai-stat-cards">
                {STATS.map((s, i) => (
                  <div key={i} className={`${panel} p-4`} data-testid={`ai-stat-${i}`}>
                    <div className="text-[11px] text-white/55 tracking-wide">{s.label}</div>
                    <div className="font-head text-2xl mt-1">{s.value}</div>
                    <div className="flex items-center gap-1 mt-1 text-[11px]" style={{ color: "#34D399" }}>
                      <TrendingUp size={13} />
                      <span>{s.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
