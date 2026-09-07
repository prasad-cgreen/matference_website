import React, { useCallback, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Building2,
  ExternalLink,
  Handshake,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  Map,
  Menu,
  ServerCog,
  Target,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/admin/AuthContext";
import { api } from "@/admin/api";
import { UNZOOM } from "@/admin/ui";

/**
 * Grouped rather than a flat list: with four sections the administrator should
 * be able to tell "things the public sees" from "things only I see" at a glance.
 */
const NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    label: "Home page",
    items: [
      { to: "/admin/vision-mission", label: "Vision & Mission", icon: Target, end: false },
      { to: "/admin/our-reach", label: "Our Reach", icon: Map, end: false },
    ],
  },
  {
    label: "People",
    items: [
      { to: "/admin/team", label: "Managing Team", icon: Users, end: false },
      { to: "/admin/nominee-directors", label: "Nominee Directors", icon: UserCheck, end: false },
      { to: "/admin/advisors", label: "Advisors", icon: UserCheck, end: false },
    ],
  },
  {
    label: "Logos & photos",
    items: [
      { to: "/admin/partners", label: "Partners in Impact", icon: Handshake, end: false },
      { to: "/admin/lenders", label: "Trusted by Lenders", icon: Building2, end: false },
      { to: "/admin/gallery", label: "Photos", icon: Images, end: false },
    ],
  },
  {
    label: "Enquiries",
    items: [{ to: "/admin/enquiries", label: "Inbox", icon: Mail, end: false, badge: "unread" }],
  },
  {
    label: "Settings",
    items: [{ to: "/admin/system", label: "System", icon: ServerCog, end: false }],
  },
];

const slug = (label) =>
  label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const PAGE_TITLES = {
  "/admin": "Dashboard",
  "/admin/vision-mission": "Vision & Mission",
  "/admin/our-reach": "Our Reach",
  "/admin/team": "Managing Team",
  "/admin/nominee-directors": "Nominee Directors",
  "/admin/advisors": "Advisors",
  "/admin/partners": "Partners in Impact",
  "/admin/lenders": "Trusted by Lenders",
  "/admin/gallery": "Photos",
  "/admin/enquiries": "Inbox",
  "/admin/system": "System",
};

/** Other pages announce a change so the sidebar badge does not go stale. */
export const ENQUIRIES_CHANGED = "admin:enquiries-changed";
export const notifyEnquiriesChanged = () =>
  window.dispatchEvent(new CustomEvent(ENQUIRIES_CHANGED));

function useUnreadCount() {
  const [unread, setUnread] = useState(0);
  const location = useLocation();

  const refresh = useCallback(() => {
    // A failure here is silent on purpose: the badge is a convenience, and the
    // page the administrator is actually on will report the real error.
    api
      .listEnquiries({ limit: 1 })
      .then((data) => setUnread(data.unread || 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh, location.pathname]);

  useEffect(() => {
    window.addEventListener(ENQUIRIES_CHANGED, refresh);
    return () => window.removeEventListener(ENQUIRIES_CHANGED, refresh);
  }, [refresh]);

  return unread;
}

function SidebarContent({ onNavigate, email, signOut, unread }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-6 pb-5">
        <Link to="/" className="block" title="Back to the website">
          <img src="/cgreen-logo-transparent.png" alt="CGreen" className="h-8 w-auto" />
        </Link>
        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-[#142984]/40 mt-3">
          Admin Panel
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-5" aria-label="Admin sections">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-[#142984]/35">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ to, label, icon: Icon, end, badge }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onNavigate}
                  data-testid={"admin-nav-" + slug(label)}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm transition-colors",
                      isActive
                        ? "bg-[#142984] text-[#FFFCFA] font-semibold"
                        : "text-[#142984]/70 hover:bg-[#142984]/6 hover:text-[#142984]",
                    ].join(" ")
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate">{label}</span>
                  {badge === "unread" && unread > 0 && (
                    <span
                      data-testid="nav-unread-badge"
                      className="min-w-[20px] rounded-full bg-[#FCDD15] px-1.5 py-0.5 text-center font-body text-[11px] font-bold tabular-nums text-[#142984]"
                    >
                      {unread > 99 ? "99+" : unread}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-[#142984]/10 p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm text-[#142984]/65 hover:bg-[#142984]/6 hover:text-[#142984] transition-colors"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          View website
        </a>

        <div className="mt-2 flex items-center gap-2.5 rounded-xl bg-[#142984]/[0.04] px-3 py-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#142984] font-head text-xs uppercase text-[#FFFCFA]">
            {(email || "?").slice(0, 1)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-body text-[10px] uppercase tracking-wider text-[#142984]/40">
              Signed in
            </p>
            <p className="font-body text-xs text-[#142984] truncate" title={email || ""}>
              {email}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={signOut}
          data-testid="admin-signout"
          className="mt-1 w-full flex items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm text-[#142984]/65 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { email, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const unread = useUnreadCount();
  const title = PAGE_TITLES[location.pathname] || "Dashboard";

  // A drawer left open across a route change would cover the page it opened.
  useEffect(() => setMobileOpen(false), [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKey = (event) => event.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-[#FFFCFA] text-[#142984]" style={UNZOOM}>
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[248px] flex-col border-r border-[#142984]/10 bg-white">
        <SidebarContent email={email} signOut={signOut} unread={unread} />
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-[#142984]/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-[270px] max-w-[84%] bg-white border-r border-[#142984]/10">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-2.5 top-4 p-2 text-[#142984]/50 hover:text-[#142984]"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent
              email={email}
              signOut={signOut}
              unread={unread}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 border-b border-[#142984]/10 bg-[#FFFCFA]/90 backdrop-blur-md">
          <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-9 h-14">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              data-testid="admin-menu-open"
              className="lg:hidden relative p-2 -ml-2 text-[#142984]/70 hover:text-[#142984]"
            >
              <Menu className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#FCDD15] ring-2 ring-[#FFFCFA]" />
              )}
            </button>

            <nav aria-label="Breadcrumb" className="min-w-0 font-body text-sm">
              <span className="text-[#142984]/45">Admin</span>
              <span className="mx-2 text-[#142984]/25">/</span>
              <span className="font-semibold text-[#142984]">{title}</span>
            </nav>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#142984]/12 px-3 py-1.5 font-body text-xs text-[#142984]/70 hover:bg-[#142984]/5 hover:text-[#142984] transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View website
            </a>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-9 py-6 lg:py-8 max-w-[1180px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
