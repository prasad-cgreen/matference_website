import React, { useState, useEffect, useRef } from "react";
import {
  Building2, Users, Cog, AlertTriangle, HandCoins, MapPin, TrendingUp,
  FileText, TrendingDown, GraduationCap, UserMinus, Clock, ArrowUpRight,
} from "lucide-react";

const TABS = [
  { id: "lending-institution", label: "Lending Institution", Icon: Building2 },
  { id: "pragati-kendra", label: "Pragati Kendra Partner", Icon: Users },
  { id: "internal-ops", label: "Internal Ops", Icon: Cog },
];

// Illustrative preview content per persona (not live/operational data).
const DATA = {
  "lending-institution": {
    gaugeTitle: "AI RISK SCORE", pct: 72, riskLabel: "Low Risk", riskColor: "#34D399",
    metrics: [{ v: "-2.4%", l: "Risk trend", c: "#34D399" }, { v: "8.9%", l: "Default rate", c: "#fff" }],
    liveTitle: "LIVE VOICE AI", liveMeta: "Live Call · 00:01:24",
    rows: [
      { t: "00:04", who: "Agent", text: "Namaste, this is Rahul from cGreen. How are you today?", tag: "Positive" },
      { t: "00:09", who: "Customer", text: "Namaste Rahul ji, I'm doing fine, thank you for calling.", tag: "Positive" },
      { t: "00:17", who: "Agent", text: "I see there is an overdue of ₹5,210. Can we discuss a payment plan?", tag: "At Risk" },
      { t: "00:29", who: "Customer", text: "I'm facing some financial constraints this month.", tag: "At Risk" },
      { t: "00:37", who: "Agent", text: "No worries, we can help you with a suitable plan.", tag: "Positive" },
    ],
    bottom: "waveform", footerTag: "Sentiment: At Risk",
    alerts: [
      { Icon: AlertTriangle, color: "#F87171", title: "High Risk Alert", desc: "12 customers moved to higher risk category", time: "2m ago" },
      { Icon: HandCoins, color: "#FCDD15", title: "Payment Promise", desc: "28 payment promises due today", time: "5m ago" },
      { Icon: MapPin, color: "#60A5FA", title: "Field Action", desc: "15 field visits recommended", time: "10m ago" },
    ],
    stats: [
      { label: "Collection Rate", value: "76.4%", trend: "5.6% vs last month" },
      { label: "Active Cases", value: "18,642", trend: "12.3% vs last week" },
      { label: "Portfolio Health", value: "Good", trend: "Improved" },
      { label: "Amount Collected", value: "₹3.62 Cr", trend: "8.7% vs last month" },
    ],
  },
  "pragati-kendra": {
    gaugeTitle: "FRANCHISE HEALTH SCORE", pct: 88, riskLabel: "Excellent", riskColor: "#34D399",
    metrics: [{ v: "+4.2%", l: "MoM growth", c: "#34D399" }, { v: "12", l: "Active franchises", c: "#fff" }],
    liveTitle: "LIVE FIELD ACTIVITY", liveMeta: "Field feed · Live",
    rows: [
      { t: "2m", who: "Agent Priya", text: "checked in at Village Rampur — Collection successful", tag: "Positive" },
      { t: "6m", who: "Agent Arjun", text: "checked in at Village Kalanpur — Follow-up scheduled", tag: "Follow-up Needed" },
      { t: "11m", who: "Agent Meera", text: "checked in at Village Sundarpur — Collection successful", tag: "Positive" },
    ],
    bottom: "chart",
    chart: { caption: "Collections by village · last 7 days", labels: ["Rampur", "Kalanpur", "Sundarpur", "Bela", "Mahua", "Piprai"], data: [82, 61, 74, 45, 68, 90] },
    alerts: [
      { Icon: FileText, color: "#FCDD15", title: "New Franchise Application", desc: "3 applications pending review", time: "15m ago" },
      { Icon: TrendingDown, color: "#F87171", title: "Local Default Spike", desc: "Village Rampur showing increased defaults", time: "2h ago" },
      { Icon: GraduationCap, color: "#60A5FA", title: "Training Reminder", desc: "Module 4 certification due this week", time: "1d ago" },
    ],
    stats: [
      { label: "Active Villages", value: "312", trend: "9.4% vs last month" },
      { label: "Local Collection Rate", value: "81.2%", trend: "3.1% vs last week" },
      { label: "Customer Satisfaction", value: "4.6/5", trend: "Improved" },
      { label: "Monthly Disbursement", value: "₹1.18 Cr", trend: "6.5% vs last month" },
    ],
  },
  "internal-ops": {
    gaugeTitle: "TEAM EFFICIENCY SCORE", pct: 91, riskLabel: "High", riskColor: "#34D399",
    metrics: [{ v: "+3.0%", l: "Efficiency trend", c: "#34D399" }, { v: "1.8m", l: "Avg wait", c: "#fff" }],
    liveTitle: "LIVE AGENT QUEUE", liveMeta: "Queue · Live",
    rows: [
      { t: "now", who: "Agent Rahul", text: "On Call — 00:03:12", tag: "Active" },
      { t: "now", who: "Agent Simran", text: "Available", tag: null },
      { t: "now", who: "Agent Dev", text: "On Call — 00:01:47", tag: "Active" },
    ],
    bottom: "chart",
    chart: { caption: "Call volume by hour · today", labels: ["9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p"], data: [24, 38, 52, 41, 30, 47, 63, 55] },
    alerts: [
      { Icon: UserMinus, color: "#FCDD15", title: "Staffing Alert", desc: "2 agents on leave today", time: "30m ago" },
      { Icon: Clock, color: "#F87171", title: "SLA Breach Warning", desc: "4 cases nearing deadline", time: "1h ago" },
      { Icon: ArrowUpRight, color: "#60A5FA", title: "Escalation Required", desc: "1 case flagged for supervisor review", time: "3h ago" },
    ],
    stats: [
      { label: "Active Agents", value: "142", trend: "4 more than yesterday" },
      { label: "Avg Handle Time", value: "4m 12s", trend: "8s faster this week" },
      { label: "Cases Resolved Today", value: "1,284", trend: "10.2% vs yesterday" },
      { label: "SLA Compliance", value: "96.3%", trend: "Improved" },
    ],
  },
};

const WAVE = Array.from({ length: 46 }, (_, i) => 20 + Math.round(28 * Math.abs(Math.sin(i * 0.7)) + (i % 3) * 6));

const TAG_STYLES = {
  Positive: { c: "#34D399", b: "rgba(52,211,153,0.14)", br: "rgba(52,211,153,0.4)" },
  Active: { c: "#34D399", b: "rgba(52,211,153,0.14)", br: "rgba(52,211,153,0.4)" },
  "At Risk": { c: "#FBBF24", b: "rgba(251,191,36,0.16)", br: "rgba(251,191,36,0.45)" },
  "Follow-up Needed": { c: "#60A5FA", b: "rgba(96,165,250,0.16)", br: "rgba(96,165,250,0.45)" },
};

// Count a numeric value from 0 -> target over `duration` ms (ease-out).
function useCountUp(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf, start;
    const step = (ts) => {
      if (start == null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
      else setVal(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function TagPill({ tag }) {
  if (!tag) return null;
  const s = TAG_STYLES[tag] || TAG_STYLES.Positive;
  return (
    <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: s.c, background: s.b, border: `1px solid ${s.br}` }}>
      {tag}
    </span>
  );
}

function RiskGauge({ pct, label, color }) {
  const r = 62, c = 2 * Math.PI * r;
  const anim = useCountUp(pct, 1300);
  const dash = (anim / 100) * c;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 168, height: 168 }}>
      <svg width="168" height="168" viewBox="0 0 168 168" className="-rotate-90">
        <circle cx="84" cy="84" r={r} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="12" />
        <circle cx="84" cy="84" r={r} fill="none" stroke="#FCDD15" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${dash} ${c - dash}`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-head text-4xl text-white leading-none">{Math.round(anim)}%</span>
        <span className="mt-1 text-xs font-semibold" style={{ color }}>{label}</span>
      </div>
    </div>
  );
}

// Animate the numeric portion of a stat string (preserves prefix/suffix, commas, decimals).
function AnimatedStatValue({ value }) {
  const m = String(value).match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  const numStr = m ? m[2] : "0";
  const target = parseFloat(numStr.replace(/,/g, ""));
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  const anim = useCountUp(target, 1200);
  if (!m) return <>{value}</>;
  const shown = anim.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return <>{m[1]}{shown}{m[3]}</>;
}

function BarChart({ chart }) {
  const max = Math.max(...chart.data);
  return (
    <div className="mt-3" data-testid="ai-infographic">
      <div className="flex items-end justify-between gap-2" style={{ height: 96 }}>
        {chart.data.map((v, i) => (
          <div key={i} className="flex-1 flex items-end justify-center h-full">
            <div className="w-full max-w-[26px] rounded-t-md ai-bar-grow" style={{ height: `${18 + (v / max) * 78}%`, background: "linear-gradient(180deg,#FCDD15,#e9c400)", animationDelay: `${i * 90}ms` }} />
          </div>
        ))}
      </div>
      <div className="flex justify-between gap-2 mt-1.5">
        {chart.labels.map((l, i) => (<span key={i} className="flex-1 text-center text-[9px] text-white/50">{l}</span>))}
      </div>
      <div className="text-[10px] text-white/40 text-center mt-1">{chart.caption}</div>
    </div>
  );
}

const panel = "rounded-2xl border border-white/10 bg-white/[0.04]";

// Reveals rows one-by-one every `interval` ms, then loops from empty.
function useLiveFeed(count, interval = 2000) {
  const [visible, setVisible] = useState(1);
  useEffect(() => {
    setVisible(1);
    const id = setInterval(() => {
      setVisible((v) => (v >= count ? 1 : v + 1));
    }, interval);
    return () => clearInterval(id);
  }, [count, interval]);
  return visible;
}

// Extracted body — remounts on tab change via `key`, restarting all animations.
function DashboardBody({ d }) {
  const visibleRows = useLiveFeed(d.rows.length, 2200);

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-5" data-testid="ai-dashboard-body">
      <div className="grid grid-cols-1 xl:grid-cols-[220px_1fr_260px] gap-5">
        {/* Gauge */}
        <div className={`${panel} p-5 flex flex-col items-center`} data-testid="ai-risk-score">
          <div className="w-full flex items-center justify-between mb-3">
            <span className="font-head text-[11px] tracking-wider text-white/80 leading-tight">{d.gaugeTitle}</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: "#34D399" }} />
              <span className="w-2 h-2 rounded-full" style={{ background: "#FCDD15" }} />
              <span className="w-2 h-2 rounded-full" style={{ background: "#F87171" }} />
            </span>
          </div>
          <RiskGauge pct={d.pct} label={d.riskLabel} color={d.riskColor} />
          <div className="grid grid-cols-2 gap-2 w-full mt-4">
            {d.metrics.map((m, i) => (
              <div key={i} className="rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2 text-center">
                <div className="text-[15px] font-head" style={{ color: m.c }}>{m.v}</div>
                <div className="text-[10px] text-white/50">{m.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live panel */}
        <div className={`${panel} p-5 min-w-0`} data-testid="ai-live-panel">
          <div className="flex items-center justify-between mb-4">
            <span className="font-head text-sm tracking-wider flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: "#F87171" }} />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: "#F87171" }} />
              </span>
              {d.liveTitle}
            </span>
            <span className="text-[11px] text-white/60">{d.liveMeta}</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {d.rows.slice(0, visibleRows).map((l, i) => (
              <div key={`${visibleRows}-${i}`} className="flex items-start gap-2.5 ai-line-in" data-testid={`ai-row-${i}`}>
                <span className="text-[10px] text-white/40 font-mono pt-1 w-9 shrink-0">{l.t}</span>
                <div className="flex-1 min-w-0">
                  {l.who && <span className={`text-[11px] font-semibold ${l.who.startsWith("Customer") ? "text-[#60A5FA]" : "text-[#FCDD15]"}`}>{l.who} </span>}
                  <span className="text-[12px] text-white/85">{l.text}</span>
                </div>
                <TagPill tag={l.tag} />
              </div>
            ))}
          </div>

          {d.bottom === "waveform" ? (
            <>
              <div className="flex items-center justify-center gap-[3px] h-12 mt-4" data-testid="ai-waveform">
                {WAVE.map((h, i) => (<span key={i} className="w-[3px] rounded-full" style={{ height: h, background: "rgba(252,221,21,0.7)" }} />))}
              </div>
              <div className="mt-3 flex justify-end">
                <span className="text-[11px] font-semibold px-3 py-1 rounded-full" style={{ color: "#FBBF24", background: "rgba(251,191,36,0.16)", border: "1px solid rgba(251,191,36,0.45)" }}>{d.footerTag}</span>
              </div>
            </>
          ) : (
            <BarChart chart={d.chart} />
          )}
        </div>

        {/* Alerts */}
        <div className="flex flex-col gap-3" data-testid="ai-alerts">
          {d.alerts.map((a, i) => (
            <div key={i} className={`${panel} p-4 flex gap-3 ai-hover-card ai-alert-pulse`} style={{ "--pulse-color": `${a.color}80`, animationDelay: `${i * 0.7}s` }} data-testid={`ai-alert-${i}`}>
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

      {/* Bottom stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="ai-stat-cards">
        {d.stats.map((s, i) => (
          <div key={i} className={`${panel} p-4 ai-hover-card`} data-testid={`ai-stat-${i}`}>
            <div className="text-[11px] text-white/55 tracking-wide">{s.label}</div>
            <div className="font-head text-2xl mt-1"><AnimatedStatValue value={s.value} /></div>
            <div className="flex items-center gap-1 mt-1 text-[11px]" style={{ color: "#34D399" }}>
              <TrendingUp size={13} /><span>{s.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AICommandCenter() {
  const [active, setActive] = useState("lending-institution");
  const d = DATA[active];

  return (
    <section id="ai-command-center" className="relative w-full pt-10 pb-24 bg-[#FFFCFA] scroll-mt-24" data-testid="section-ai-command-center">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-head text-3xl lg:text-4xl text-[#142984] text-center mb-2" data-testid="ai-coming-soon-header">COMING SOON</h2>
        <p className="font-body text-sm text-[#142984]/70 text-center mb-10">A preview of the cGreen AI Command Center</p>

        <div className="rounded-3xl p-5 lg:p-7 border border-[#FCDD15]/40 text-white overflow-hidden"
          style={{ background: "radial-gradient(1200px 500px at 30% -10%, #16276e 0%, #0a1240 55%, #070d2e 100%)" }}
          data-testid="ai-dashboard-container">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h3 className="font-head text-xl lg:text-2xl tracking-wide">AI COMMAND CENTER</h3>
              <p className="font-body text-xs lg:text-sm text-white/60 mt-1">Intelligence that senses, acts, and impacts what matters.</p>
            </div>
            <span data-testid="ai-coming-soon-badge" className="shrink-0 font-head text-[11px] tracking-wider px-4 py-2 rounded-full text-[#142984]" style={{ background: "#FCDD15", boxShadow: "0 0 20px rgba(252,221,21,0.4)" }}>COMING SOON</span>
          </div>

          <div className="flex gap-5">
            {/* Sidebar */}
            <div className="w-52 shrink-0 flex flex-col gap-3" data-testid="ai-sidebar">
              {TABS.map((t) => {
                const on = active === t.id;
                return (
                  <button key={t.id} type="button" data-testid={`ai-tab-${t.id}`} onClick={() => setActive(t.id)} aria-pressed={on}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-colors"
                    style={on ? { background: "#FCDD15", color: "#142984", fontWeight: 700 } : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <t.Icon size={18} strokeWidth={2} />
                    <span className="font-body text-sm leading-tight">{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Main content — key forces full remount per tab, restarting all animations */}
            <div className="flex-1 min-w-0" data-testid={`ai-content-${active}`}>
              <DashboardBody key={active} d={d} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
