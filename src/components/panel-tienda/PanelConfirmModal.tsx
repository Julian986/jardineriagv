"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

type PanelConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function PanelConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  busy = false,
  onConfirm,
  onCancel,
}: PanelConfirmModalProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !busy) onCancel();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center" role="presentation">
      <button
        type="button"
        aria-label="Cerrar"
        disabled={busy}
        onClick={onCancel}
        className="absolute inset-0 bg-[#1a1f18]/45 backdrop-blur-[2px]"
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="panel-confirm-title"
        aria-describedby="panel-confirm-desc"
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-[#e4e7e1] bg-white shadow-[0_20px_50px_rgba(26,31,24,0.22)]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[#edf0eb] px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff1f1] text-[#b44545]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 id="panel-confirm-title" className="text-base font-bold text-[#20231f]">
                {title}
              </h2>
              <p id="panel-confirm-desc" className="mt-1 text-sm leading-relaxed text-[#6f756c]">
                {description}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Cerrar diálogo"
            disabled={busy}
            onClick={onCancel}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#7a8177] hover:bg-[#f3f4f2] disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col-reverse gap-2 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="h-11 rounded-xl border border-[#dce1da] px-4 text-sm font-bold text-[#3e453c] hover:bg-[#f5f6f4] disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className="h-11 rounded-xl bg-[#b44545] px-4 text-sm font-bold text-white hover:bg-[#9d3a3a] disabled:opacity-50"
          >
            {busy ? "Eliminando…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
