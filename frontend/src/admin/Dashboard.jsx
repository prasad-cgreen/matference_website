import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  FolderOpen,
  Images,
  Inbox,
  Mail,
  RefreshCw,
  ServerCog,
} from "lucide-react";
import { api, errorMessage } from "@/admin/api";
import { useAuth } from "@/admin/AuthContext";
import {
  ActionButton,
  Card,
  EmptyState,
  PageHeader,
  Pill,
  Spinner,
  StatTile,
  relativeTime,
} from "@/admin/ui";

const fullName = (item) => [item.first_name, item.last_name].filter(Boolean).join(" ") || "Unknown";

/**
 * Warnings drawn from the system check, phrased as consequences.
 *
 * "Database unreachable" means nothing to the person who just wants to add
 * photos; "photos and enquiries cannot load" does.
 */
function healthWarnings(system) {
  if (!system) return [];
  const warnings = [];
  if (!system.database.connected) {
    warnings.push({
      tone: "bad",
      text: "The database is unreachable, so photos and enquiries cannot load.",
    });
  }
  // Notifications being off is the intended setup: enquiries are read in the
  // Inbox. Only a transport switched on with nothing behind it is a problem.
  if (system.email.notifications_enabled && !system.email.configured) {
    warnings.push({
      tone: "warn",
      text: "Email notifications are switched on but no mail transport is usable, so they will fail silently.",
    });
  }
  if (!system.session.jwt_secret_set) {
    warnings.push({
      tone: "warn",
      text: "ADMIN_JWT_SECRET is not set, so restarting the backend signs you out.",
    });
  }
  return warnings;
}

export default function Dashboard() {
  const { email } = useAuth();
  const [state, setState] = useState({ albums: null, enquiries: null, system: null });
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    // Independent requests: the database being down must not also hide the
    // system panel that explains why.
    const [albums, enquiries, system] = await Promise.allSettled([
      api.listAlbums(),
      api.listEnquiries({ limit: 5 }),
      api.system(),
    ]);
    setState({
      albums: albums.status === "fulfilled" ? albums.value : null,
      enquiries: enquiries.status === "fulfilled" ? enquiries.value : null,
      system: system.status === "fulfilled" ? system.value : null,
    });
    const firstFailure = [albums, enquiries, system].find((r) => r.status === "rejected");
    setFailure(
      firstFailure && system.status === "rejected"
        ? errorMessage(firstFailure.reason, "Could not reach the backend.")
        : "",
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const albums = state.albums || [];
  const photoCount = albums.reduce((total, album) => total + album.photos.length, 0);
  const warnings = healthWarnings(state.system);
  const unread = state.enquiries?.unread ?? 0;

  if (loading && !state.system && !state.albums) {
    return (
      <Card>
        <Spinner label="Loading dashboard" />
      </Card>
    );
  }

  return (
    <div className="space-y-6" data-testid="admin-dashboard">
      <PageHeader title="Dashboard" description={"Signed in as " + email + "."}>
        <ActionButton variant="secondary" onClick={refresh} disabled={loading} data-testid="dashboard-refresh">
          <RefreshCw className={"h-4 w-4 " + (loading ? "animate-spin" : "")} />
          Refresh
        </ActionButton>
      </PageHeader>

      {failure && (
        <Card className="border-red-200 bg-red-50/60 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-500" />
            <div>
              <p className="font-body text-sm font-semibold text-red-800">{failure}</p>
              <p className="mt-1 font-body text-[13px] text-red-700/85">
                Start it with <span className="font-mono text-xs">npm run dev</span> from the
                project folder, then refresh this page.
              </p>
            </div>
          </div>
        </Card>
      )}

      {warnings.length > 0 && (
        <Card className="divide-y divide-[#142984]/[0.07]" data-testid="health-warnings">
          {warnings.map((warning) => (
            <div key={warning.text} className="flex items-start gap-3 p-4">
              <AlertTriangle
                className={[
                  "mt-0.5 h-4 w-4 shrink-0",
                  warning.tone === "bad" ? "text-red-500" : "text-amber-500",
                ].join(" ")}
              />
              <p className="flex-1 font-body text-[13px] leading-relaxed text-[#142984]/80">
                {warning.text}
              </p>
              <Link
                to="/admin/system"
                className="shrink-0 font-body text-[13px] font-semibold text-[#142984] underline decoration-[#FCDD15] decoration-2 underline-offset-2"
              >
                Details
              </Link>
            </div>
          ))}
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={Mail}
          value={unread}
          label="Unread enquiries"
          hint={(state.enquiries?.total ?? 0) + " received in total"}
          tone={unread > 0 ? "alert" : "default"}
          testid="stat-unread"
        />
        <StatTile
          icon={FolderOpen}
          value={state.albums ? albums.length : "—"}
          label="Photo albums"
          hint={state.albums ? "On the Life at CGreen page" : "Unavailable"}
          testid="stat-albums"
        />
        <StatTile
          icon={Images}
          value={state.albums ? photoCount : "—"}
          label="Photos published"
          hint={state.albums ? "Across all albums" : "Unavailable"}
          testid="stat-photos"
        />
        <StatTile
          icon={ServerCog}
          value={state.system ? (warnings.length === 0 ? "All good" : warnings.length) : "—"}
          label={warnings.length === 1 ? "Issue to review" : "Issues to review"}
          hint={state.system ? "Database, email, storage" : "Unavailable"}
          tone={warnings.some((w) => w.tone === "bad") ? "danger" : "default"}
          testid="stat-health"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-[#142984]/10 px-5 py-3.5">
            <h2 className="font-head text-base text-[#142984]">Latest enquiries</h2>
            <Link
              to="/admin/enquiries"
              data-testid="dashboard-go-enquiries"
              className="inline-flex items-center gap-1 font-body text-[13px] font-semibold text-[#142984] hover:gap-1.5 transition-all"
            >
              Open inbox
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {!state.enquiries ? (
            <EmptyState icon={Inbox} title="Enquiries unavailable">
              The inbox could not be loaded. Check the System page for what is wrong.
            </EmptyState>
          ) : state.enquiries.items.length === 0 ? (
            <EmptyState icon={Inbox} title="No enquiries yet">
              Messages from the website contact form will show up here.
            </EmptyState>
          ) : (
            <ul className="divide-y divide-[#142984]/[0.07]">
              {state.enquiries.items.map((item) => (
                <li key={item.id}>
                  <Link
                    to="/admin/enquiries"
                    className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[#142984]/[0.03]"
                  >
                    {!item.read_at && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FCDD15] ring-1 ring-[#142984]/20" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p
                        className={[
                          "truncate font-body text-sm",
                          item.read_at ? "text-[#142984]/75" : "font-semibold text-[#142984]",
                        ].join(" ")}
                      >
                        {fullName(item)}
                      </p>
                      <p className="truncate font-body text-xs text-[#142984]/50">{item.subject}</p>
                    </div>
                    <span className="shrink-0 font-body text-[11px] text-[#142984]/40">
                      {relativeTime(item.created_at)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="font-head text-base text-[#142984]">Manage the website</h2>
          <p className="mt-2 font-body text-[13px] leading-relaxed text-[#142984]/60">
            Albums you create appear on the{" "}
            <a
              href="/life-at-cgreen"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-[#FCDD15] decoration-2 underline-offset-2 hover:text-[#142984]"
            >
              Life at CGreen
            </a>{" "}
            page, grouped by year. Until one exists, that page keeps showing the photos built
            into the site, so it never looks empty to a visitor.
          </p>

          <div className="mt-4 space-y-2">
            <ActionButton as={Link} to="/admin/gallery" className="w-full" data-testid="dashboard-go-gallery">
              <Images className="h-4 w-4" />
              Photos
            </ActionButton>
            <ActionButton as={Link} to="/admin/enquiries" variant="secondary" className="w-full">
              <Mail className="h-4 w-4" />
              Inbox
              {unread > 0 && <Pill tone="brand">{unread}</Pill>}
            </ActionButton>
            <ActionButton as={Link} to="/admin/system" variant="secondary" className="w-full">
              <ServerCog className="h-4 w-4" />
              System
            </ActionButton>
          </div>
        </Card>
      </div>
    </div>
  );
}
