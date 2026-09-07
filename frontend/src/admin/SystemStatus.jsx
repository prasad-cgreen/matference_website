import React, { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Database,
  HardDrive,
  KeyRound,
  RefreshCw,
  Send,
  XCircle,
} from "lucide-react";
import { api, errorMessage } from "@/admin/api";
import { ActionButton, Card, ErrorState, PageHeader, Pill, Spinner } from "@/admin/ui";

/**
 * A service and what to do when it is unhealthy.
 *
 * The remedy line matters more than the status dot: the person reading this is
 * usually here because something already stopped working.
 */
function ServiceCard({ icon: Icon, title, ok, statusLabel, rows, remedy }) {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <span
          className={[
            "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
            ok ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500",
          ].join(" ")}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-head text-base text-[#142984]">{title}</h2>
            <Pill tone={ok ? "good" : "bad"}>
              {ok ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              {statusLabel}
            </Pill>
          </div>

          <dl className="mt-3.5 space-y-2">
            {rows.map(({ label, value, mono }) => (
              <div key={label} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <dt className="w-32 shrink-0 font-body text-xs text-[#142984]/45">{label}</dt>
                <dd
                  className={[
                    "min-w-0 flex-1 break-all font-body text-[13px] text-[#142984]/85",
                    mono ? "font-mono text-[12px]" : "",
                  ].join(" ")}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          {!ok && remedy && (
            <p className="mt-3.5 rounded-xl bg-red-50 px-3.5 py-2.5 font-body text-[13px] leading-relaxed text-red-800">
              {remedy}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function SystemStatus() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setError("");
      setInfo(await api.system());
    } catch (e) {
      setError(errorMessage(e, "Could not read the system status."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="space-y-6" data-testid="system-page">
      <PageHeader
        title="System"
        description="What this site is connected to, and whether each part is working."
      >
        <ActionButton variant="secondary" onClick={refresh} disabled={loading} data-testid="system-refresh">
          <RefreshCw className={"h-4 w-4 " + (loading ? "animate-spin" : "")} />
          Refresh
        </ActionButton>
      </PageHeader>

      {loading && !info ? (
        <Card>
          <Spinner label="Checking services" />
        </Card>
      ) : error ? (
        <Card>
          <ErrorState message={error} onRetry={refresh} />
        </Card>
      ) : info ? (
        <div className="grid gap-5 lg:grid-cols-2">
          <ServiceCard
            icon={Database}
            title="Database"
            ok={info.database.connected}
            statusLabel={info.database.connected ? "Connected" : "Unreachable"}
            rows={[
              { label: "Database name", value: info.database.name || "—" },
              info.database.error
                ? { label: "Error", value: info.database.error, mono: true }
                : null,
            ].filter(Boolean)}
            remedy="Photos and enquiries both live in MongoDB, so neither section can load while this is down. Start MongoDB locally, or point MONGO_URL in backend/.env at a reachable server."
          />

          <ServiceCard
            icon={Send}
            title="Contact-form notifications"
            // Off is the intended setting: enquiries are worked from the Inbox.
            // Only a transport that is switched on but unusable is a fault.
            ok={!info.email.notifications_enabled || info.email.configured}
            statusLabel={
              !info.email.notifications_enabled
                ? "Email off — Inbox only"
                : info.email.configured
                  ? "Via " + info.email.transport
                  : "Enabled but unusable"
            }
            rows={[
              {
                label: "Where leads go",
                value: info.email.notifications_enabled
                  ? "The Inbox, and by email"
                  : "The Inbox in this panel",
              },
              { label: "Transport", value: info.email.configured ? info.email.transport : "none" },
              { label: "Notify address", value: (info.email.notify || []).join(", ") || "—" },
            ]}
            remedy="CONTACT_EMAIL_ENABLED is on but no transport is usable, so notification email will silently fail. Set SMTP_HOST / SMTP_USER / SMTP_PASSWORD (or RESEND_API_KEY), or turn the flag off to work enquiries from the Inbox alone."
          />

          <ServiceCard
            icon={HardDrive}
            title="Photo storage"
            ok
            statusLabel="Ready"
            rows={[
              { label: "Backend", value: info.storage.backend },
              { label: "Location", value: info.storage.upload_dir, mono: true },
              { label: "Max per photo", value: info.storage.max_upload_mb + " MB" },
            ]}
          />

          <ServiceCard
            icon={KeyRound}
            title="Admin session"
            ok={info.session.jwt_secret_set}
            statusLabel={info.session.jwt_secret_set ? "Persistent" : "Ephemeral"}
            rows={[
              { label: "Signed in as", value: info.session.admin_email },
              {
                label: "Session length",
                value: info.session.token_ttl_hours + " hours",
              },
            ]}
            remedy="ADMIN_JWT_SECRET is not set, so the signing key is regenerated on every restart and you are signed out each time the server restarts. Set it in backend/.env before deploying."
          />
        </div>
      ) : null}

      <Card className="p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#142984]/5 text-[#142984]/60">
            <Clock className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-head text-base text-[#142984]">Changing your password</h2>
            <p className="mt-2 max-w-2xl font-body text-[13px] leading-relaxed text-[#142984]/65">
              The administrator account is seeded from environment variables, so a password
              change happens in <span className="font-mono text-xs">backend/.env</span> rather
              than here. Generate a new hash with{" "}
              <span className="font-mono text-xs">python make_admin_password.py</span>, paste the
              line it prints into{" "}
              <span className="font-mono text-xs">ADMIN_PASSWORD_HASH</span>, and restart the
              backend.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
