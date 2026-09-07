import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  FolderPlus,
  ImagePlus,
  Images,
  Loader2,
  Pencil,
  Search,
  Star,
  Trash2,
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

const cardCls =
  "rounded-2xl border border-[#142984]/10 bg-white shadow-[0_1px_2px_rgba(20,41,132,0.04),0_8px_24px_-12px_rgba(20,41,132,0.10)]";

function formatBytes(bytes) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function PhotoCard({ photo, onRetitle, onSetCover, onDelete, busy }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(photo.title || "");

  useEffect(() => setDraft(photo.title || ""), [photo.title]);

  const commit = async () => {
    setEditing(false);
    if (draft.trim() === (photo.title || "")) return;
    await onRetitle(photo, draft.trim());
  };

  return (
    <div
      className="group relative rounded-2xl overflow-hidden border border-[#142984]/10 bg-white"
      data-testid={`photo-${photo.id}`}
    >
      <div className="aspect-[4/3] bg-[#142984]/5">
        <img
          src={photo.url}
          alt={photo.title || "Gallery photo"}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      {photo.is_cover && (
        <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-[#FCDD15] px-2.5 py-1 font-body text-[11px] font-semibold text-[#142984]">
          <Star className="h-3 w-3 fill-current" />
          Cover
        </span>
      )}

      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        {!photo.is_cover && (
          <button
            type="button"
            onClick={() => onSetCover(photo)}
            disabled={busy}
            title="Make this the album cover"
            aria-label="Make this the album cover"
            data-testid={`photo-cover-${photo.id}`}
            className="grid place-items-center h-8 w-8 rounded-full bg-white/95 text-[#142984] hover:bg-[#FCDD15] transition-colors shadow-sm"
          >
            <Star className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(photo)}
          disabled={busy}
          title="Delete photo"
          aria-label="Delete photo"
          data-testid={`photo-delete-${photo.id}`}
          className="grid place-items-center h-8 w-8 rounded-full bg-white/95 text-red-600 hover:bg-red-600 hover:text-white transition-colors shadow-sm"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="p-2.5">
        {editing ? (
          <Input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") {
                setDraft(photo.title || "");
                setEditing(false);
              }
            }}
            maxLength={200}
            placeholder="Add a caption"
            data-testid={`photo-title-input-${photo.id}`}
            className="h-8 text-xs bg-white border-[#142984]/20 text-[#142984]"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            data-testid={`photo-title-${photo.id}`}
            className="w-full flex items-center gap-1.5 text-left font-body text-xs text-[#142984]/75 hover:text-[#142984] transition-colors"
          >
            <Pencil className="h-3 w-3 shrink-0 opacity-50" />
            <span className="truncate">{photo.title || "Add a caption"}</span>
          </button>
        )}
        <p className="font-body text-[10px] text-[#142984]/40 mt-1 pl-[18px]">
          {formatBytes(photo.size)}
        </p>
      </div>
    </div>
  );
}

function AlbumSection({ album, onUpload, onRetitle, onSetCover, onDeletePhoto, onDeleteAlbum, onRename, busyId }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [labelDraft, setLabelDraft] = useState(album.label);

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    // Catch the obvious problems in the browser; the server re-checks the bytes.
    const tooBig = files.filter((f) => f.size > MAX_MB * 1024 * 1024);
    if (tooBig.length) {
      toast.error(`${tooBig[0].name} is over ${MAX_MB}MB. Please choose a smaller image.`);
      return;
    }
    const wrongType = files.filter((f) => f.type && !ACCEPT.includes(f.type));
    if (wrongType.length) {
      toast.error(`${wrongType[0].name} is not a JPEG, PNG, GIF or WEBP image.`);
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      await onUpload(album, files, setProgress);
      toast.success(`${files.length} photo${files.length > 1 ? "s" : ""} added to ${album.label}.`);
    } catch (error) {
      toast.error(errorMessage(error, "Upload failed. Please try again."));
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const commitRename = async () => {
    setRenaming(false);
    const next = labelDraft.trim();
    if (!next || next === album.label) {
      setLabelDraft(album.label);
      return;
    }
    await onRename(album, next);
  };

  return (
    <section className={`${cardCls} overflow-hidden`} data-testid={`album-${album.id}`}>
      <header className="flex flex-wrap items-center gap-3 px-5 sm:px-6 py-4 border-b border-[#142984]/10">
        <span className="inline-flex items-center rounded-full bg-[#142984] px-3 py-1 font-head text-xs font-bold text-[#FFFCFA]">
          {album.year}
        </span>

        {renaming ? (
          <Input
            autoFocus
            value={labelDraft}
            onChange={(e) => setLabelDraft(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") {
                setLabelDraft(album.label);
                setRenaming(false);
              }
            }}
            maxLength={80}
            data-testid={`album-rename-input-${album.id}`}
            className="h-8 w-48 bg-white border-[#142984]/20 text-[#142984]"
          />
        ) : (
          <button
            type="button"
            onClick={() => setRenaming(true)}
            data-testid={`album-rename-${album.id}`}
            className="group flex items-center gap-1.5 font-head text-lg text-[#142984]"
          >
            {album.label}
            <Pencil className="h-3.5 w-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />
          </button>
        )}

        <span className="font-body text-xs text-[#142984]/50">
          {album.photos.length} photo{album.photos.length === 1 ? "" : "s"}
        </span>

        <div className="ml-auto flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            multiple
            hidden
            data-testid={`album-file-input-${album.id}`}
            onChange={(e) => handleFiles(e.target.files)}
          />
          <ActionButton
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            data-testid={`album-upload-${album.id}`}
            className="h-9"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="h-4 w-4" />
            )}
            {uploading ? `${progress}%` : "Add photos"}
          </ActionButton>
          <button
            type="button"
            onClick={() => onDeleteAlbum(album)}
            title="Delete album"
            aria-label={`Delete album ${album.label}`}
            data-testid={`album-delete-${album.id}`}
            className="grid place-items-center h-9 w-9 rounded-full text-[#142984]/50 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`p-5 sm:p-6 transition-colors ${dragging ? "bg-[#FCDD15]/15" : ""}`}
      >
        {uploading && (
          <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-[#142984]/10">
            <div
              className="h-full bg-[#142984] transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {album.photos.length === 0 ? (
          <EmptyState icon={ImagePlus} title="No photos yet">
            Drag images here, or use <strong>Add photos</strong>. JPEG, PNG, GIF or WEBP,
            up to {MAX_MB}MB each.
          </EmptyState>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {album.photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                busy={busyId === photo.id}
                onRetitle={onRetitle}
                onSetCover={onSetCover}
                onDelete={onDeletePhoto}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function GalleryManager() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newAlbum, setNewAlbum] = useState({ year: String(new Date().getFullYear()), label: "" });

  const refresh = useCallback(async () => {
    try {
      setLoadError("");
      setAlbums(await api.listAlbums());
    } catch (error) {
      setLoadError(errorMessage(error, "Could not load the gallery."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return albums;
    return albums.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.year.includes(q) ||
        a.photos.some((p) => (p.title || "").toLowerCase().includes(q)),
    );
  }, [albums, query]);

  const createAlbum = async (event) => {
    event.preventDefault();
    const label = newAlbum.label.trim();
    if (!label) return toast.error("Give the album a name.");
    if (!/^\d{4}$/.test(newAlbum.year)) return toast.error("Year must be four digits, e.g. 2026.");
    setCreating(true);
    try {
      await api.createAlbum({ year: newAlbum.year, label, sort_order: 0 });
      toast.success(`Album "${label}" created.`);
      setNewAlbum({ year: String(new Date().getFullYear()), label: "" });
      await refresh();
    } catch (error) {
      toast.error(errorMessage(error, "Could not create the album."));
    } finally {
      setCreating(false);
    }
  };

  const uploadPhotos = async (album, files, onProgress) => {
    await api.uploadPhotos(album.id, files, onProgress);
    await refresh();
  };

  const retitlePhoto = async (photo, title) => {
    setBusyId(photo.id);
    try {
      await api.updatePhoto(photo.id, { title });
      await refresh();
    } catch (error) {
      toast.error(errorMessage(error, "Could not save the caption."));
    } finally {
      setBusyId(null);
    }
  };

  const setCover = async (photo) => {
    setBusyId(photo.id);
    try {
      await api.updatePhoto(photo.id, { is_cover: true });
      toast.success("Cover updated.");
      await refresh();
    } catch (error) {
      toast.error(errorMessage(error, "Could not set the cover."));
    } finally {
      setBusyId(null);
    }
  };

  const renameAlbum = async (album, label) => {
    try {
      await api.updateAlbum(album.id, { label });
      toast.success("Album renamed.");
      await refresh();
    } catch (error) {
      toast.error(errorMessage(error, "Could not rename the album."));
    }
  };

  const runConfirmed = async () => {
    if (!confirm) return;
    setConfirmBusy(true);
    try {
      await confirm.run();
      toast.success(confirm.successMessage);
      await refresh();
      setConfirm(null);
    } catch (error) {
      toast.error(errorMessage(error, "Could not delete that."));
    } finally {
      setConfirmBusy(false);
    }
  };

  const askDeletePhoto = (photo) =>
    setConfirm({
      title: "Delete this photo?",
      description:
        "The image file is removed from storage as well as the website. This cannot be undone.",
      successMessage: "Photo deleted.",
      run: () => api.deletePhoto(photo.id),
    });

  const askDeleteAlbum = (album) =>
    setConfirm({
      title: `Delete "${album.label}"?`,
      description: `This album and its ${album.photos.length} photo${
        album.photos.length === 1 ? "" : "s"
      } will be permanently removed from the website. This cannot be undone.`,
      successMessage: "Album deleted.",
      run: () => api.deleteAlbum(album.id),
    });

  return (
    <div className="space-y-7" data-testid="gallery-manager">
      <PageHeader
        title="Photos"
        description="Albums shown on the Life at CGreen page, newest year first."
      >
        {albums.length > 0 && (
          <Pill>
            {albums.length} album{albums.length === 1 ? "" : "s"}
          </Pill>
        )}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#142984]/35" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search albums…"
            data-testid="gallery-search"
            className="h-10 pl-10 w-full sm:w-64 rounded-xl bg-white border-[#142984]/15 text-[#142984]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#142984]/40 hover:text-[#142984]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </PageHeader>

      <form onSubmit={createAlbum} className={`${cardCls} p-5 sm:p-6`} data-testid="create-album-form">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-28">
            <Label className="font-body text-[#142984] text-sm">Year</Label>
            <Input
              value={newAlbum.year}
              onChange={(e) => setNewAlbum((p) => ({ ...p, year: e.target.value }))}
              inputMode="numeric"
              maxLength={4}
              data-testid="new-album-year"
              className="mt-1.5 h-10 rounded-xl bg-white border-[#142984]/15 text-[#142984]"
            />
          </div>
          <div className="flex-1 min-w-[12rem]">
            <Label className="font-body text-[#142984] text-sm">Album name</Label>
            <Input
              value={newAlbum.label}
              onChange={(e) => setNewAlbum((p) => ({ ...p, label: e.target.value }))}
              placeholder="Picnic, Diwali, Team Photos…"
              maxLength={80}
              data-testid="new-album-label"
              className="mt-1.5 h-10 rounded-xl bg-white border-[#142984]/15 text-[#142984]"
            />
          </div>
          <ActionButton type="submit" disabled={creating} data-testid="create-album-submit">
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FolderPlus className="h-4 w-4" />
            )}
            New album
          </ActionButton>
        </div>
      </form>

      {loading ? (
        <Card data-testid="gallery-loading">
          <Spinner label="Loading albums" />
        </Card>
      ) : loadError ? (
        <Card>
          <ErrorState message={loadError} onRetry={refresh} />
        </Card>
      ) : visible.length === 0 ? (
        <div className={cardCls}>
          {albums.length === 0 ? (
            <EmptyState icon={Images} title="No albums yet">
              Create your first album above. Until you add photos here, the Life at CGreen
              page keeps showing the pictures already built into the site.
            </EmptyState>
          ) : (
            <EmptyState icon={Search} title="No matches">
              Nothing matches “{query}”. Try a different album name or year.
            </EmptyState>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {visible.map((album) => (
            <AlbumSection
              key={album.id}
              album={album}
              busyId={busyId}
              onUpload={uploadPhotos}
              onRetitle={retitlePhoto}
              onSetCover={setCover}
              onRename={renameAlbum}
              onDeletePhoto={askDeletePhoto}
              onDeleteAlbum={askDeleteAlbum}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.title || ""}
        description={confirm?.description || ""}
        busy={confirmBusy}
        onConfirm={runConfirmed}
        onCancel={() => !confirmBusy && setConfirm(null)}
      />
    </div>
  );
}
