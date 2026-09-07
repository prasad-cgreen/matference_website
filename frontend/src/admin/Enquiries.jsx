import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Inbox,
  Mail,
  MailOpen,
  Reply,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { api, errorMessage } from "@/admin/api";
import ConfirmDialog from "@/admin/ConfirmDialog";
import { notifyEnquiriesChanged } from "@/admin/AdminLayout";
import {
  ActionButton,
  Card,
  EmptyState,
  ErrorState,
  PageHeader,
  Pill,
  Spinner,
  fullTimestamp,
  relativeTime,
} from "@/admin/ui";

const PAGE_SIZE = 25;

const fullName = (item) => [item.first_name, item.last_name].filter(Boolean).join(" ") || "Unknown";

/**
 * One CSV cell. Everything is quoted and inner quotes are doubled, so a comma
 * or a line break inside a message cannot shift the remaining columns.
 */
function csvCell(value) {
  return '"' + String(value ?? "").replace(/"/g, '""') + '"';
}

function toCsv(items) {
  const header = ["Received", "First name", "Last name", "Email", "Subject", "Message", "Read"];
  const rows = items.map((item) => [
    item.created_at,
    item.first_name,
    item.last_name,
    item.email,
    item.subject,
    item.message,
    item.read_at ? "yes" : "no",
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

function downloadCsv(items) {
  // A BOM keeps Excel from mangling non-ASCII names in the export.
  const blob = new Blob(["﻿" + toCsv(items)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "cgreen-enquiries-" + new Date().toISOString().slice(0, 10) + ".csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function ListRow({ item, active, onSelect }) {
  const unread = !item.read_at;
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      data-testid={"enquiry-row-" + item.id}
      className={[
        "w-full text-left px-4 py-3.5 border-l-2 transition-colors",
        active
          ? "border-l-[#142984] bg-[#142984]/[0.05]"
          : "border-l-transparent hover:bg-[#142984]/[0.03]",
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        {unread && (
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FCDD15] ring-1 ring-[#142984]/20"
            aria-label="Unread"
          />
        )}
        <span
          className={[
            "min-w-0 flex-1 truncate font-body text-sm",
            unread ? "font-semibold text-[#142984]" : "text-[#142984]/75",
          ].join(" ")}
        >
          {fullName(item)}
        </span>
        <span className="shrink-0 font-body text-[11px] text-[#142984]/40">
          {relativeTime(item.created_at)}
        </span>
      </div>
      <p className="mt-1 truncate font-body text-[13px] text-[#142984]/70">{item.subject}</p>
      <p className="mt-0.5 truncate font-body text-xs text-[#142984]/40">{item.message}</p>
    </button>
  );
}

function Detail({ item, onClose, onToggleRead, onDelete, busy }) {
  const mailto =
    "mailto:" +
    encodeURIComponent(item.email) +
    "?subject=" +
    encodeURIComponent("Re: " + item.subject);

  return (
    <div className="flex h-full flex-col" data-testid="enquiry-detail">
      <div className="flex items-start gap-3 border-b border-[#142984]/10 p-5">
        <div className="min-w-0 flex-1">
          <h2 className="font-head text-lg text-[#142984] break-words">{item.subject}</h2>
          <p className="mt-1.5 font-body text-sm text-[#142984]/70 break-words">
            {fullName(item)}{" "}
            <a
              href={"mailto:" + item.email}
              className="underline decoration-[#FCDD15] decoration-2 underline-offset-2 hover:text-[#142984]"
            >
              {item.email}
            </a>
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <Pill>{fullTimestamp(item.created_at)}</Pill>
            {item.accepted_terms && <Pill tone="good">Terms accepted</Pill>}
            {!item.read_at && <Pill tone="brand">Unread</Pill>}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close enquiry"
          data-testid="enquiry-close"
          className="shrink-0 rounded-lg p-1.5 text-[#142984]/45 hover:bg-[#142984]/5 hover:text-[#142984] lg:hidden"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <p className="whitespace-pre-wrap break-words font-body text-sm leading-relaxed text-[#142984]/85">
          {item.message}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-[#142984]/10 p-4">
        <ActionButton as="a" href={mailto} data-testid="enquiry-reply">
          <Reply className="h-4 w-4" />
          Reply by email
        </ActionButton>
        <ActionButton
          variant="secondary"
          onClick={() => onToggleRead(item)}
          disabled={busy}
          data-testid="enquiry-toggle-read"
        >
          {item.read_at ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
          Mark {item.read_at ? "unread" : "read"}
        </ActionButton>
        <ActionButton
          variant="danger"
          onClick={() => onDelete(item)}
          disabled={busy}
          data-testid="enquiry-delete"
          className="sm:ml-auto"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </ActionButton>
      </div>
    </div>
  );
}

export default function Enquiries() {
  const [data, setData] = useState({ items: [], total: 0, unread: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rawQuery, setRawQuery] = useState("");
  const [query, setQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(null);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const firstLoad = useRef(true);

  // Typing should not fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(rawQuery.trim());
      setOffset(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [rawQuery]);

  const refresh = useCallback(async () => {
    try {
      setError("");
      setData(await api.listEnquiries({ q: query, limit: PAGE_SIZE, offset }));
    } catch (e) {
      setError(errorMessage(e, "Could not load enquiries."));
    } finally {
      setLoading(false);
      firstLoad.current = false;
    }
  }, [query, offset]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const selected = useMemo(
    () => data.items.find((item) => item.id === selectedId) || null,
    [data.items, selectedId],
  );

  // Opening an enquiry marks it read, the way any mail client behaves.
  const select = async (item) => {
    setSelectedId(item.id);
    if (item.read_at) return;
    try {
      await api.markEnquiryRead(item.id, true);
      notifyEnquiriesChanged();
      await refresh();
    } catch {
      // Reading still worked; only the flag failed to save.
    }
  };

  const toggleRead = async (item) => {
    setBusy(true);
    try {
      await api.markEnquiryRead(item.id, !item.read_at);
      notifyEnquiriesChanged();
      await refresh();
    } catch (e) {
      toast.error(errorMessage(e, "Could not update this enquiry."));
    } finally {
      setBusy(false);
    }
  };

  const askDelete = (item) =>
    setConfirming({
      title: "Delete this enquiry?",
      description:
        "The message from " +
        fullName(item) +
        " will be permanently removed. The original notification email in your inbox is not affected.",
      run: () => api.deleteEnquiry(item.id),
    });

  const runDelete = async () => {
    if (!confirming) return;
    setConfirmBusy(true);
    try {
      await confirming.run();
      toast.success("Enquiry deleted.");
      setSelectedId(null);
      setConfirming(null);
      notifyEnquiriesChanged();
      await refresh();
    } catch (e) {
      toast.error(errorMessage(e, "Could not delete this enquiry."));
    } finally {
      setConfirmBusy(false);
    }
  };

  const exportCsv = () => {
    if (!data.items.length) return toast.error("There is nothing to export.");
    downloadCsv(data.items);
    toast.success("Exported " + data.items.length + " enquir" + (data.items.length === 1 ? "y" : "ies") + ".");
  };

  const pageStart = data.total === 0 ? 0 : offset + 1;
  const pageEnd = Math.min(offset + PAGE_SIZE, data.total);

  return (
    <div className="space-y-6" data-testid="enquiries-page">
      <PageHeader
        title="Inbox"
        description="Messages sent through the contact form on the website."
      >
        <ActionButton variant="secondary" onClick={exportCsv} data-testid="enquiries-export">
          <Download className="h-4 w-4" />
          Export CSV
        </ActionButton>
      </PageHeader>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#142984]/35" />
          <Input
            value={rawQuery}
            onChange={(e) => setRawQuery(e.target.value)}
            placeholder="Search name, email, subject or message…"
            data-testid="enquiries-search"
            className="h-10 rounded-xl border-[#142984]/15 bg-white pl-10 text-[#142984]"
          />
          {rawQuery && (
            <button
              type="button"
              onClick={() => setRawQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#142984]/40 hover:text-[#142984]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {data.unread > 0 && <Pill tone="brand">{data.unread} unread</Pill>}
          <Pill>
            {data.total} total{query ? " matching" : ""}
          </Pill>
        </div>
      </div>

      {loading && firstLoad.current ? (
        <Card>
          <Spinner label="Loading enquiries" />
        </Card>
      ) : error ? (
        <Card>
          <ErrorState message={error} onRetry={refresh} />
        </Card>
      ) : data.total === 0 ? (
        <Card>
          {query ? (
            <EmptyState icon={Search} title="No matches">
              Nothing matches “{query}”. Try a name, an email address or a word from the message.
            </EmptyState>
          ) : (
            <EmptyState icon={Inbox} title="No enquiries yet">
              Messages sent through the contact form on the website will appear here, newest
              first. Each one is also emailed to your notification address.
            </EmptyState>
          )}
        </Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <Card className="overflow-hidden">
            <div className="max-h-[min(60vh,560px)] divide-y divide-[#142984]/[0.07] overflow-y-auto lg:max-h-[calc(100vh-19rem)]">
              {data.items.map((item) => (
                <ListRow
                  key={item.id}
                  item={item}
                  active={item.id === selectedId}
                  onSelect={select}
                />
              ))}
            </div>

            {data.total > PAGE_SIZE && (
              <div className="flex items-center justify-between gap-2 border-t border-[#142984]/10 px-3 py-2.5">
                <button
                  type="button"
                  disabled={offset === 0}
                  onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
                  data-testid="enquiries-prev"
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-body text-xs text-[#142984]/70 hover:bg-[#142984]/5 disabled:opacity-35 disabled:hover:bg-transparent"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Newer
                </button>
                <span className="font-body text-[11px] tabular-nums text-[#142984]/45">
                  {pageStart}–{pageEnd} of {data.total}
                </span>
                <button
                  type="button"
                  disabled={pageEnd >= data.total}
                  onClick={() => setOffset(offset + PAGE_SIZE)}
                  data-testid="enquiries-next"
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-body text-xs text-[#142984]/70 hover:bg-[#142984]/5 disabled:opacity-35 disabled:hover:bg-transparent"
                >
                  Older
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </Card>

          {/* Desktop keeps the reading pane beside the list; on small screens it
              takes over the screen so the message is not squeezed into a column. */}
          <Card className="hidden lg:flex overflow-hidden">
            {selected ? (
              <Detail
                item={selected}
                busy={busy}
                onClose={() => setSelectedId(null)}
                onToggleRead={toggleRead}
                onDelete={askDelete}
              />
            ) : (
              <div className="grid w-full place-items-center">
                <EmptyState icon={MailOpen} title="Nothing selected">
                  Choose an enquiry from the list to read it here.
                </EmptyState>
              </div>
            )}
          </Card>

          {selected && (
            <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-[#FFFCFA]">
              <Detail
                item={selected}
                busy={busy}
                onClose={() => setSelectedId(null)}
                onToggleRead={toggleRead}
                onDelete={askDelete}
              />
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirming)}
        title={confirming?.title || ""}
        description={confirming?.description || ""}
        busy={confirmBusy}
        onConfirm={runDelete}
        onCancel={() => !confirmBusy && setConfirming(null)}
      />
    </div>
  );
}
