/**
 * The admin panel's shared visual language.
 *
 * Every page is built from these few pieces, so spacing, radii and the loading
 * / empty / error states stay identical across sections instead of each page
 * inventing its own.
 */
import React from "react";
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";

export const NAVY = "#142984";
export const YELLOW = "#FCDD15";
export const CREAM = "#FFFCFA";

/**
 * The marketing site renders inside `zoom: 0.85` (see App.js), which suits a
 * full-bleed landing page but makes a dense admin screen hard to read. Nested
 * zooms multiply, so this cancels it out for the admin without touching a
 * single pixel of the public pages.
 */
export const UNZOOM = { zoom: 1 / 0.85 };

/** Surface used for every panel in the admin. */
export function Card({ as: Tag = "div", className = "", children, ...rest }) {
  return (
    <Tag
      className={`rounded-2xl border border-[#142984]/10 bg-white shadow-[0_1px_2px_rgba(20,41,132,0.04),0_8px_24px_-12px_rgba(20,41,132,0.10)] ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Page title, one line of context, and an optional actions cluster. */
export function PageHeader({ title, description, children, testid }) {
  return (
    <header
      className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      data-testid={testid}
    >
      <div className="min-w-0">
        <h1 className="font-head text-[26px] leading-tight sm:text-3xl text-[#142984]">{title}</h1>
        {description && (
          <p className="font-body text-sm text-[#142984]/55 mt-1.5">{description}</p>
        )}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2.5">{children}</div>}
    </header>
  );
}

/**
 * A single headline number.
 *
 * `tone` marks a figure that needs attention (unread mail, a failing service)
 * so the eye lands on it before reading any labels.
 */
export function StatTile({ icon: Icon, value, label, hint, tone = "default", onClick, testid }) {
  const tones = {
    default: "bg-[#142984]/5 text-[#142984]/70",
    alert: "bg-[#FCDD15]/25 text-[#142984]",
    danger: "bg-red-50 text-red-600",
  };
  const interactive = Boolean(onClick);
  const Tag = onClick ? "button" : "div";

  return (
    <Card
      as={Tag}
      type={onClick ? "button" : undefined}
      onClick={onClick}
      data-testid={testid}
      className={`p-5 text-left w-full ${
        interactive ? "transition-shadow hover:shadow-[0_2px_4px_rgba(20,41,132,0.06),0_12px_32px_-12px_rgba(20,41,132,0.18)]" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`grid place-items-center h-9 w-9 rounded-xl ${tones[tone]}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="font-head text-[28px] leading-none text-[#142984] mt-4 tabular-nums">{value}</p>
      <p className="font-body text-sm text-[#142984]/55 mt-1.5">{label}</p>
      {hint && <p className="font-body text-xs text-[#142984]/40 mt-1">{hint}</p>}
    </Card>
  );
}

export function Spinner({ label = "Loading…" }) {
  return (
    <div className="grid place-items-center py-16" role="status" aria-live="polite">
      <Loader2 className="h-5 w-5 animate-spin text-[#142984]/35" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <div className="text-center py-14 px-6" data-testid="empty-state">
      <span className="grid place-items-center h-12 w-12 mx-auto rounded-2xl bg-[#142984]/5">
        <Icon className="h-5 w-5 text-[#142984]/35" />
      </span>
      <h3 className="font-head text-base text-[#142984] mt-4">{title}</h3>
      {children && (
        <div className="font-body text-sm text-[#142984]/55 mt-2 max-w-sm mx-auto leading-relaxed">
          {children}
        </div>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/**
 * A failed fetch, with the way out.
 *
 * Retry is always offered: the most common cause here is a backend that is not
 * running yet, which fixes itself without a reload.
 */
export function ErrorState({ message, onRetry, testid = "error-state" }) {
  return (
    <div className="py-12 px-6 text-center" data-testid={testid}>
      <span className="grid place-items-center h-12 w-12 mx-auto rounded-2xl bg-red-50">
        <AlertTriangle className="h-5 w-5 text-red-500" />
      </span>
      <p className="font-body text-sm text-[#142984] mt-4 max-w-md mx-auto leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          data-testid="retry"
          className="inline-flex items-center gap-2 mt-5 rounded-full border border-[#142984]/15 px-4 py-2 font-body text-sm text-[#142984] hover:bg-[#142984]/5 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      )}
    </div>
  );
}

/** Small status pill. */
export function Pill({ tone = "neutral", children, className = "" }) {
  const tones = {
    neutral: "bg-[#142984]/6 text-[#142984]/70",
    good: "bg-emerald-50 text-emerald-700",
    warn: "bg-amber-50 text-amber-700",
    bad: "bg-red-50 text-red-700",
    brand: "bg-[#FCDD15] text-[#142984]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-body text-[11px] font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Primary action. Kept as one component so every page's main button matches. */
export function ActionButton({
  as: Tag = "button",
  variant = "primary",
  className = "",
  children,
  ...rest
}) {
  const variants = {
    primary: "bg-[#142984] text-[#FFFCFA] hover:bg-[#FCDD15] hover:text-[#142984]",
    secondary: "border border-[#142984]/15 text-[#142984] hover:bg-[#142984]/5",
    danger: "border border-red-200 text-red-600 hover:bg-red-50",
  };
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 rounded-full h-10 px-4 font-body text-sm font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#142984]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFCFA] ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** "3 minutes ago" for fresh rows, an absolute date once that stops helping. */
export function relativeTime(iso) {
  if (!iso) return "";
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return "";
  const seconds = Math.round((Date.now() - then.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return then.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export function fullTimestamp(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
