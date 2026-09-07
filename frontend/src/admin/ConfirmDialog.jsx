import React, { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Blocking confirmation for actions that cannot be undone.
 *
 * Deleting a photo removes the file from storage as well as the database row,
 * so there is nothing to restore afterwards. Every destructive action in the
 * panel goes through this.
 */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  busy = false,
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    // Escape must always be a way out, but not mid-delete.
    const onKey = (e) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    window.addEventListener("keydown", onKey);
    confirmRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      data-testid="confirm-dialog"
    >
      <div
        className="absolute inset-0 bg-[#142984]/40 backdrop-blur-sm"
        onClick={() => !busy && onCancel()}
      />
      <div className="relative w-full max-w-md rounded-[26px] bg-[#FFFCFA] border border-[#142984]/12 shadow-2xl p-7">
        <div className="flex items-start gap-4">
          <span className="grid place-items-center h-11 w-11 shrink-0 rounded-full bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </span>
          <div className="min-w-0">
            <h2 id="confirm-title" className="font-head text-xl text-[#142984]">
              {title}
            </h2>
            <p className="font-body text-sm text-[#142984]/70 mt-2 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-7">
          <Button
            type="button"
            onClick={onCancel}
            disabled={busy}
            data-testid="confirm-cancel"
            className="rounded-full px-6 bg-transparent border border-[#142984]/20 text-[#142984] hover:bg-[#142984]/6"
          >
            Cancel
          </Button>
          <Button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={busy}
            data-testid="confirm-accept"
            className="rounded-full px-6 bg-red-600 text-white font-head font-bold hover:bg-red-700 disabled:opacity-70"
          >
            {busy ? "Deleting…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
