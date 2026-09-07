/**
 * The editor behind five website sections.
 *
 * Managing Team, Nominee Directors and Advisors are lists of people; Partners
 * and Lenders are lists of logos. The difference is only which fields a card
 * shows, so one editor covers both rather than five near-identical pages.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Linkedin,
  Loader2,
  Plus,
  Trash2,
  User,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, errorMessage } from "@/admin/api";
import ConfirmDialog from "@/admin/ConfirmDialog";
import {
  ActionButton,
  Card,
  EmptyState,
  ErrorState,
  PageHeader,
  Pill,
  Spinner,
} from "@/admin/ui";

const ACCEPT = "image/jpeg,image/png,image/gif,image/webp";
const MAX_MB = 8;

const fieldCls =
  "mt-1.5 h-10 rounded-xl bg-white border-[#142984]/15 text-[#142984] focus-visible:ring-[#142984]/25";

/** Catches the obvious problems in the browser; the server re-checks the bytes. */
function rejectBadFile(file) {
  if (file.size > MAX_MB * 1024 * 1024) {
    return `${file.name} is over ${MAX_MB}MB. Please choose a smaller image.`;
  }
  if (file.type && !ACCEPT.includes(file.type)) {
    return `${file.name} is not a JPEG, PNG, GIF or WEBP image.`;
  }
  return "";
}

function Thumb({ item, kind }) {
  if (item.image_url) {
    return (
      <img
        src={item.image_url}
        alt={item.name}
        loading="lazy"
        className={
          kind === "people"
            ? "h-16 w-16 shrink-0 rounded-2xl bg-[#142984]/5 object-cover object-top"
            : "h-16 w-24 shrink-0 rounded-xl bg-white object-contain p-1.5 ring-1 ring-[#142984]/10"
        }
      />
    );
  }
  return (
    <span
      className={[
        "grid shrink-0 place-items-center bg-[#142984]/5 text-[#142984]/35",
        kind === "people" ? "h-16 w-16 rounded-2xl" : "h-16 w-24 rounded-xl",
      ].join(" ")}
    >
      {kind === "people" ? <User className="h-6 w-6" /> : <ImagePlus className="h-5 w-5" />}
    </span>
  );
}

/** Add / edit form. The same fields the public card renders, in the same order. */
function ItemDialog({ open, kind, initial, busy, onSave, onCancel }) {
  const [draft, setDraft] = useState(initial);

  useEffect(() => setDraft(initial), [initial]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && !busy && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, onCancel]);

  if (!open) return null;

  const set = (field) => (e) => setDraft((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = (event) => {
    event.preventDefault();
    if (!draft.name.trim()) return toast.error("A name is required.");
    onSave({ ...draft, name: draft.name.trim() });
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[#142984]/40 backdrop-blur-sm p-0 sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
      data-testid="item-dialog"
    >
      <form
        onSubmit={submit}
        className="w-full max-w-lg rounded-t-3xl bg-[#FFFCFA] p-5 shadow-xl sm:rounded-3xl sm:p-6 max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-head text-lg text-[#142984]">
            {initial.id ? "Edit entry" : "Add entry"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            aria-label="Close"
            className="rounded-lg p-1.5 text-[#142984]/45 hover:bg-[#142984]/5 hover:text-[#142984]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3.5">
          <div>
            <Label className="font-body text-sm text-[#142984]">
              {kind === "people" ? "Name" : "Organisation name"}
            </Label>
            <Input
              autoFocus
              value={draft.name}
              onChange={set("name")}
              maxLength={120}
              placeholder={kind === "people" ? "Full name" : "Shown as the logo's alt text"}
              data-testid="item-name"
              className={fieldCls}
            />
          </div>

          {kind === "people" && (
            <>
              <div>
                <Label className="font-body text-sm text-[#142984]">Role</Label>
                <Input
                  value={draft.title}
                  onChange={set("title")}
                  maxLength={160}
                  placeholder="Co-Founder & COO"
                  data-testid="item-title"
                  className={fieldCls}
                />
              </div>
              <div>
                <Label className="font-body text-sm text-[#142984]">Short bio</Label>
                <textarea
                  value={draft.bio}
                  onChange={set("bio")}
                  maxLength={1200}
                  rows={4}
                  placeholder="One or two sentences, shown on the card."
                  data-testid="item-bio"
                  className="mt-1.5 w-full rounded-xl border border-[#142984]/15 bg-white px-3 py-2 font-body text-sm text-[#142984] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#142984]/25"
                />
                <p className="mt-1 font-body text-[11px] text-[#142984]/40">
                  {(draft.bio || "").length}/1200
                </p>
              </div>
              <div>
                <Label className="font-body text-sm text-[#142984]">LinkedIn URL</Label>
                <Input
                  value={draft.link}
                  onChange={set("link")}
                  maxLength={500}
                  placeholder="https://www.linkedin.com/in/…"
                  data-testid="item-link"
                  className={fieldCls}
                />
                <p className="mt-1 font-body text-[11px] text-[#142984]/40">
                  Leave blank to show the greyed-out icon the site uses today.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <ActionButton type="button" variant="secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </ActionButton>
          <ActionButton type="submit" disabled={busy} data-testid="item-save">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {initial.id ? "Save changes" : "Add"}
          </ActionButton>
        </div>
      </form>
    </div>
  );
}

function ItemCard({ item, kind, index, total, busy, onEdit, onDelete, onMove, onUpload }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const pick = async (fileList) => {
    const file = (fileList || [])[0];
    if (!file) return;
    const problem = rejectBadFile(file);
    if (problem) return toast.error(problem);
    setUploading(true);
    try {
      await onUpload(item, file);
      toast.success(`Image updated for ${item.name}.`);
    } catch (error) {
      toast.error(errorMessage(error, "Could not upload that image."));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Card className="p-4" data-testid={`item-${item.id}`}>
      <div className="flex gap-4">
        <div className="relative">
          <Thumb item={item} kind={kind} />
          {uploading && (
            <span className="absolute inset-0 grid place-items-center rounded-2xl bg-white/75">
              <Loader2 className="h-4 w-4 animate-spin text-[#142984]" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-head text-[15px] text-[#142984]">{item.name}</p>
          {kind === "people" && item.title && (
            <p className="truncate font-body text-[13px] text-[#142984]/60">{item.title}</p>
          )}
          {kind === "people" && item.bio && (
            <p className="mt-1 line-clamp-2 font-body text-xs leading-relaxed text-[#142984]/50">
              {item.bio}
            </p>
          )}
          {kind === "people" && (
            <div className="mt-1.5">
              {item.link ? (
                <Pill tone="good">
                  <Linkedin className="h-3 w-3" />
                  LinkedIn
                </Pill>
              ) : (
                <Pill>No LinkedIn</Pill>
              )}
            </div>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        hidden
        data-testid={`item-file-${item.id}`}
        onChange={(e) => pick(e.target.files)}
      />

      <div className="mt-3.5 flex flex-wrap items-center gap-1.5 border-t border-[#142984]/[0.07] pt-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || busy}
          data-testid={`item-image-${item.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-body text-xs text-[#142984]/75 hover:bg-[#142984]/5 hover:text-[#142984] disabled:opacity-50"
        >
          <ImagePlus className="h-3.5 w-3.5" />
          {item.image_url ? "Replace image" : "Add image"}
        </button>
        <button
          type="button"
          onClick={() => onEdit(item)}
          disabled={busy}
          data-testid={`item-edit-${item.id}`}
          className="rounded-lg px-2.5 py-1.5 font-body text-xs text-[#142984]/75 hover:bg-[#142984]/5 hover:text-[#142984] disabled:opacity-50"
        >
          Edit
        </button>

        <div className="ml-auto flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => onMove(index, -1)}
            disabled={index === 0 || busy}
            aria-label={`Move ${item.name} earlier`}
            data-testid={`item-up-${item.id}`}
            className="grid h-7 w-7 place-items-center rounded-lg text-[#142984]/50 hover:bg-[#142984]/5 hover:text-[#142984] disabled:opacity-25 disabled:hover:bg-transparent"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, 1)}
            disabled={index === total - 1 || busy}
            aria-label={`Move ${item.name} later`}
            data-testid={`item-down-${item.id}`}
            className="grid h-7 w-7 place-items-center rounded-lg text-[#142984]/50 hover:bg-[#142984]/5 hover:text-[#142984] disabled:opacity-25 disabled:hover:bg-transparent"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            disabled={busy}
            aria-label={`Delete ${item.name}`}
            data-testid={`item-delete-${item.id}`}
            className="grid h-7 w-7 place-items-center rounded-lg text-[#142984]/45 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </Card>
  );
}

const BLANK = { name: "", title: "", bio: "", link: "" };

export default function ItemsEditor({ group, kind, title, description, addLabel, emptyHint }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setError("");
      setItems(await api.listItems(group));
    } catch (e) {
      setError(errorMessage(e, "Could not load this section."));
    } finally {
      setLoading(false);
    }
  }, [group]);

  // Switching sections reuses this component, so reset before refetching.
  useEffect(() => {
    setLoading(true);
    setItems([]);
    refresh();
  }, [refresh]);

  const save = async (draft) => {
    setSaving(true);
    try {
      if (draft.id) {
        await api.updateItem(draft.id, {
          name: draft.name,
          title: draft.title,
          bio: draft.bio,
          link: draft.link,
        });
        toast.success("Entry updated.");
      } else {
        await api.createItem(group, {
          name: draft.name,
          title: draft.title || "",
          bio: draft.bio || "",
          link: draft.link || "",
        });
        toast.success("Entry added. Use “Add image” to give it a picture.");
      }
      setEditing(null);
      await refresh();
    } catch (e) {
      toast.error(errorMessage(e, "Could not save that entry."));
    } finally {
      setSaving(false);
    }
  };

  const upload = async (item, file) => {
    await api.uploadItemImage(item.id, file);
    await refresh();
  };

  /**
   * Reorder locally first so the cards move the instant the button is pressed,
   * then persist. A failed save refetches, putting the old order back.
   */
  const move = async (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    setBusy(true);
    try {
      await api.reorderItems(group, next.map((item) => item.id));
    } catch (e) {
      toast.error(errorMessage(e, "Could not save the new order."));
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const runDelete = async () => {
    if (!confirming) return;
    setConfirmBusy(true);
    try {
      await api.deleteItem(confirming.item.id);
      toast.success(`${confirming.item.name} removed.`);
      setConfirming(null);
      await refresh();
    } catch (e) {
      toast.error(errorMessage(e, "Could not delete that entry."));
    } finally {
      setConfirmBusy(false);
    }
  };

  return (
    <div className="space-y-6" data-testid={`section-${group}`}>
      <PageHeader title={title} description={description}>
        {items.length > 0 && <Pill>{items.length} shown</Pill>}
        <ActionButton onClick={() => setEditing(BLANK)} data-testid="item-add">
          <Plus className="h-4 w-4" />
          {addLabel}
        </ActionButton>
      </PageHeader>

      {loading ? (
        <Card>
          <Spinner label="Loading section" />
        </Card>
      ) : error ? (
        <Card>
          <ErrorState message={error} onRetry={refresh} />
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            icon={kind === "people" ? User : ImagePlus}
            title="Nothing here yet"
            action={
              <ActionButton onClick={() => setEditing(BLANK)}>
                <Plus className="h-4 w-4" />
                {addLabel}
              </ActionButton>
            }
          >
            {emptyHint}
          </EmptyState>
        </Card>
      ) : (
        <div
          className={
            kind === "people"
              ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
              : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {items.map((item, index) => (
            <ItemCard
              key={item.id}
              item={item}
              kind={kind}
              index={index}
              total={items.length}
              busy={busy}
              onEdit={(row) => setEditing(row)}
              onDelete={(row) => setConfirming({ item: row })}
              onMove={move}
              onUpload={upload}
            />
          ))}
        </div>
      )}

      <ItemDialog
        open={Boolean(editing)}
        kind={kind}
        initial={editing || BLANK}
        busy={saving}
        onSave={save}
        onCancel={() => !saving && setEditing(null)}
      />

      <ConfirmDialog
        open={Boolean(confirming)}
        title={confirming ? `Remove ${confirming.item.name}?` : ""}
        description="This entry disappears from the website immediately. Any image uploaded here is deleted too. This cannot be undone."
        busy={confirmBusy}
        onConfirm={runDelete}
        onCancel={() => !confirmBusy && setConfirming(null)}
      />
    </div>
  );
}
