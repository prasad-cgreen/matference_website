/**
 * The two sections that are one block of copy rather than a list.
 *
 * Both follow the same shape: load the current values, edit them in a form
 * that mirrors the live layout, and save the whole section at once. The Save
 * button stays disabled until something actually changes, so it is always
 * obvious whether there is unsaved work.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Eye, ImagePlus, Loader2, RotateCcw, Save, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, errorMessage } from "@/admin/api";
import { ActionButton, Card, ErrorState, PageHeader, Pill, Spinner } from "@/admin/ui";

const ACCEPT = "image/jpeg,image/png,image/gif,image/webp";
const MAX_MB = 8;

const fieldCls =
  "mt-1.5 h-10 rounded-xl bg-white border-[#142984]/15 text-[#142984] focus-visible:ring-[#142984]/25";
const areaCls =
  "mt-1.5 w-full rounded-xl border border-[#142984]/15 bg-white px-3.5 py-2.5 font-body text-sm leading-relaxed text-[#142984] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#142984]/25";

function Field({ label, hint, children }) {
  return (
    <div>
      <Label className="font-body text-sm text-[#142984]">{label}</Label>
      {children}
      {hint && <p className="mt-1 font-body text-[11px] text-[#142984]/40">{hint}</p>}
    </div>
  );
}

/**
 * Shared plumbing for a single-block section.
 *
 * `render` gets the working copy and a setter; everything about loading,
 * dirty-tracking, saving and resetting is handled here.
 */
function useSection(key) {
  const [saved, setSaved] = useState(null);
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setError("");
      const content = await api.content();
      setSaved(content.singletons[key]);
      setDraft(content.singletons[key]);
    } catch (e) {
      setError(errorMessage(e, "Could not load this section."));
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    load();
  }, [load]);

  const dirty = useMemo(
    () => Boolean(draft && saved) && JSON.stringify(draft) !== JSON.stringify(saved),
    [draft, saved],
  );

  const save = async () => {
    setSaving(true);
    try {
      const stored = await api.saveSection(key, draft);
      setSaved(stored);
      setDraft(stored);
      toast.success("Saved. The website is updated.");
    } catch (e) {
      toast.error(errorMessage(e, "Could not save this section."));
    } finally {
      setSaving(false);
    }
  };

  return { draft, setDraft, dirty, loading, error, saving, save, reset: () => setDraft(saved), load };
}

function SectionShell({ title, description, section, children }) {
  const { dirty, loading, error, saving, save, reset, load } = section;

  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description}>
        {dirty && <Pill tone="brand">Unsaved changes</Pill>}
        <ActionButton variant="secondary" onClick={reset} disabled={!dirty || saving}>
          <RotateCcw className="h-4 w-4" />
          Discard
        </ActionButton>
        <ActionButton onClick={save} disabled={!dirty || saving} data-testid="section-save">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </ActionButton>
      </PageHeader>

      {loading ? (
        <Card>
          <Spinner label="Loading section" />
        </Card>
      ) : error ? (
        <Card>
          <ErrorState message={error} onRetry={load} />
        </Card>
      ) : (
        children
      )}
    </div>
  );
}

export function VisionMissionEditor() {
  const section = useSection("vision_mission");
  const { draft, setDraft } = section;
  const set = (field) => (e) => setDraft((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <SectionShell
      title="Vision & Mission"
      description="The two cards on the home page, below the platform section."
      section={section}
    >
      {draft && (
        <div className="grid gap-5 xl:grid-cols-2" data-testid="vision-mission-editor">
          <Card className="p-5 sm:p-6 space-y-4">
            <Field label="Section heading">
              <Input
                value={draft.heading}
                onChange={set("heading")}
                maxLength={120}
                data-testid="vm-heading"
                className={fieldCls}
              />
            </Field>

            <div className="rounded-2xl bg-[#142984]/[0.04] p-4 space-y-3.5">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-[#142984]/60" />
                <span className="font-head text-sm text-[#142984]">Vision card</span>
              </div>
              <Field label="Card title">
                <Input
                  value={draft.vision_title}
                  onChange={set("vision_title")}
                  maxLength={60}
                  data-testid="vm-vision-title"
                  className={fieldCls}
                />
              </Field>
              <Field label="Vision text" hint={`${(draft.vision_body || "").length}/4000`}>
                <textarea
                  value={draft.vision_body}
                  onChange={set("vision_body")}
                  maxLength={4000}
                  rows={8}
                  data-testid="vm-vision-body"
                  className={areaCls}
                />
              </Field>
            </div>

            <div className="rounded-2xl bg-[#FCDD15]/15 p-4 space-y-3.5">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-[#142984]/60" />
                <span className="font-head text-sm text-[#142984]">Mission card</span>
              </div>
              <Field label="Card title">
                <Input
                  value={draft.mission_title}
                  onChange={set("mission_title")}
                  maxLength={60}
                  data-testid="vm-mission-title"
                  className={fieldCls}
                />
              </Field>
              <Field label="Mission text" hint={`${(draft.mission_body || "").length}/4000`}>
                <textarea
                  value={draft.mission_body}
                  onChange={set("mission_body")}
                  maxLength={4000}
                  rows={8}
                  data-testid="vm-mission-body"
                  className={areaCls}
                />
              </Field>
            </div>
          </Card>

          {/* Same colours and type scale as the live section, so the effect of
              an edit is visible without leaving the page. */}
          <div className="space-y-4">
            <p className="font-body text-xs uppercase tracking-[0.14em] text-[#142984]/40">
              Preview
            </p>
            <div className="rounded-[24px] bg-[#142984] p-6">
              <h3 className="font-head text-xl text-[#FCDD15]">{draft.vision_title}</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-white">
                {draft.vision_body}
              </p>
            </div>
            <div className="rounded-[24px] bg-[#FCDD15] p-6">
              <h3 className="font-head text-xl text-[#142984]">{draft.mission_title}</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-[#142984]">
                {draft.mission_body}
              </p>
            </div>
          </div>
        </div>
      )}
    </SectionShell>
  );
}

export function OurReachEditor() {
  const section = useSection("our_reach");
  const { draft, setDraft } = section;
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const set = (field) => (e) => setDraft((prev) => ({ ...prev, [field]: e.target.value }));

  const setStat = (index, field) => (e) =>
    setDraft((prev) => {
      const stats = prev.stats.map((stat, i) =>
        i === index ? { ...stat, [field]: e.target.value } : stat,
      );
      return { ...prev, stats };
    });

  const addStat = () =>
    setDraft((prev) => ({ ...prev, stats: [...prev.stats, { value: "", label: "" }] }));

  const removeStat = (index) =>
    setDraft((prev) => ({ ...prev, stats: prev.stats.filter((_, i) => i !== index) }));

  const uploadMap = async (fileList) => {
    const file = (fileList || [])[0];
    if (!file) return;
    if (file.size > MAX_MB * 1024 * 1024) {
      return toast.error(`${file.name} is over ${MAX_MB}MB.`);
    }
    setUploading(true);
    try {
      const { url } = await api.uploadImage(file);
      setDraft((prev) => ({ ...prev, map_image: url }));
      toast.success("Map uploaded. Save the section to publish it.");
    } catch (e) {
      toast.error(errorMessage(e, "Could not upload that image."));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <SectionShell
      title="Our Reach"
      description="The footprint heading, the counters, and the India map on the home page."
      section={section}
    >
      {draft && (
        <div className="grid gap-5 xl:grid-cols-2" data-testid="our-reach-editor">
          <Card className="p-5 sm:p-6 space-y-4">
            <Field label="Section heading">
              <Input
                value={draft.heading}
                onChange={set("heading")}
                maxLength={120}
                data-testid="reach-heading"
                className={fieldCls}
              />
            </Field>
            <Field label="Pill text" hint="The small yellow pill under the heading.">
              <Input
                value={draft.subheading}
                onChange={set("subheading")}
                maxLength={120}
                data-testid="reach-subheading"
                className={fieldCls}
              />
            </Field>

            <div>
              <div className="flex items-center justify-between gap-3">
                <Label className="font-body text-sm text-[#142984]">Counters</Label>
                <button
                  type="button"
                  onClick={addStat}
                  disabled={draft.stats.length >= 8}
                  data-testid="reach-add-stat"
                  className="rounded-lg px-2 py-1 font-body text-xs text-[#142984]/70 hover:bg-[#142984]/5 hover:text-[#142984] disabled:opacity-40"
                >
                  + Add counter
                </button>
              </div>
              <p className="mt-1 font-body text-[11px] text-[#142984]/40">
                The number counts up when a visitor scrolls to it. Keep any suffix in the
                value, for example <span className="font-mono">957K+</span>.
              </p>

              <div className="mt-2.5 space-y-2">
                {draft.stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={stat.value}
                      onChange={setStat(index, "value")}
                      maxLength={20}
                      placeholder="957K+"
                      aria-label={`Counter ${index + 1} value`}
                      data-testid={`reach-stat-value-${index}`}
                      className={`${fieldCls} mt-0 w-28`}
                    />
                    <Input
                      value={stat.label}
                      onChange={setStat(index, "label")}
                      maxLength={40}
                      placeholder="Villages"
                      aria-label={`Counter ${index + 1} label`}
                      data-testid={`reach-stat-label-${index}`}
                      className={`${fieldCls} mt-0 flex-1`}
                    />
                    <button
                      type="button"
                      onClick={() => removeStat(index)}
                      aria-label={`Remove counter ${index + 1}`}
                      data-testid={`reach-remove-stat-${index}`}
                      className="shrink-0 rounded-lg px-2 py-1.5 font-body text-xs text-[#142984]/45 hover:bg-red-50 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {draft.stats.length === 0 && (
                  <p className="font-body text-xs text-[#142984]/45">
                    No counters — the left column will show only the heading.
                  </p>
                )}
              </div>
            </div>

            <Field label="Map image" hint="JPEG, PNG, GIF or WEBP, up to 8MB.">
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPT}
                  hidden
                  data-testid="reach-map-file"
                  onChange={(e) => uploadMap(e.target.files)}
                />
                <ActionButton
                  type="button"
                  variant="secondary"
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                  data-testid="reach-map-upload"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImagePlus className="h-4 w-4" />
                  )}
                  Replace map
                </ActionButton>
                <span className="font-mono text-[11px] text-[#142984]/45 break-all">
                  {draft.map_image || "none"}
                </span>
              </div>
            </Field>
          </Card>

          <div className="space-y-4">
            <p className="font-body text-xs uppercase tracking-[0.14em] text-[#142984]/40">
              Preview
            </p>
            <Card className="p-6">
              <h3 className="font-head text-2xl text-[#142984]">{draft.heading}</h3>
              {draft.subheading && (
                <span className="mt-3 inline-block rounded-full bg-[#FCDD15] px-4 py-2 font-body text-xs font-bold text-[#142984]">
                  {draft.subheading}
                </span>
              )}
              <div className="mt-5 space-y-2.5">
                {draft.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center gap-4 rounded-2xl bg-[#142984] px-5 py-3 text-center"
                  >
                    <span className="font-head text-2xl tabular-nums text-white">
                      {stat.value || "—"}
                    </span>
                    <span className="font-head text-sm text-white/85">{stat.label}</span>
                  </div>
                ))}
              </div>
              {draft.map_image && (
                <img
                  src={draft.map_image}
                  alt="Reach map"
                  className="mt-5 w-full rounded-xl"
                  loading="lazy"
                />
              )}
            </Card>
          </div>
        </div>
      )}
    </SectionShell>
  );
}
