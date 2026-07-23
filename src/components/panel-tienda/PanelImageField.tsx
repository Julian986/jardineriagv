"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { ImagePlus, Pencil, Trash2, Upload } from "lucide-react";
import { PanelImageCropModal } from "@/components/panel-tienda/PanelImageCropModal";

type PanelImageFieldProps = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helper?: string;
  required?: boolean;
};

function isPreviewable(url: string) {
  return url.startsWith("/") || /^https?:\/\/.+/i.test(url);
}

export function PanelImageField({
  value,
  onChange,
  label = "Foto del producto",
  helper = "Elegí una foto de la galería y ajustala al recuadro.",
  required = false,
}: PanelImageFieldProps) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function openPicker() {
    setError("");
    fileRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Elegí un archivo de imagen.");
      return;
    }
    setPendingFile(file);
    setCropOpen(true);
  }

  async function uploadCropped(blob: Blob) {
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", new File([blob], "producto.webp", { type: "image/webp" }));
      const res = await fetch("/api/tienda/upload", { method: "POST", body: form });
      const data = (await res.json()) as { ok?: boolean; url?: string; error?: string };
      if (!res.ok || !data.ok || !data.url) {
        setError(data.error ?? "No se pudo subir la imagen.");
        return;
      }
      onChange(data.url);
      setCropOpen(false);
      setPendingFile(null);
    } catch {
      setError("Error de conexión al subir la imagen.");
    } finally {
      setUploading(false);
    }
  }

  const hasImage = Boolean(value) && isPreviewable(value);

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#343833]">
            {label}
            {required ? <span className="text-[#a53c3c]"> *</span> : null}
          </p>
          <p className="mt-1 text-xs text-[#777d74]">{helper}</p>
        </div>
      </div>

      <input
        ref={fileRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        className="sr-only"
        onChange={onFileChange}
      />

      <div className="mt-4">
        {hasImage ? (
          <div className="flex items-center gap-3 rounded-2xl border border-[#e0e4dd] bg-[#fafbf9] p-3">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-[#e0e4dd] bg-white">
              <Image src={value} alt="" fill className="object-cover" sizes="96px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#20231f]">Foto lista</p>
              <p className="mt-0.5 truncate text-[11px] text-[#858b82]">{value}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={openPicker}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#41613a] px-3 text-xs font-bold text-white hover:bg-[#35532f]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Cambiar
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e4c4c4] px-3 text-xs font-bold text-[#a64b4b] hover:bg-[#fff1f1]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Quitar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={openPicker}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#c5cec0] bg-[#f7f9f5] px-4 py-10 text-center transition-colors hover:border-[#8aa582] hover:bg-[#f1f6ee]"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#41613a] shadow-sm">
              <ImagePlus className="h-6 w-6" />
            </span>
            <span className="text-sm font-bold text-[#35532f]">Subir imagen</span>
            <span className="inline-flex items-center gap-1 text-xs text-[#747a71]">
              <Upload className="h-3.5 w-3.5" />
              Abrí la galería del celular
            </span>
          </button>
        )}
      </div>

      {error ? (
        <p className="mt-2 rounded-lg border border-[#f0caca] bg-[#fff5f5] px-3 py-2 text-sm text-[#a53c3c]">
          {error}
        </p>
      ) : null}

      <PanelImageCropModal
        open={cropOpen}
        file={pendingFile}
        busy={uploading}
        onCancel={() => {
          if (uploading) return;
          setCropOpen(false);
          setPendingFile(null);
        }}
        onConfirm={(blob) => void uploadCropped(blob)}
      />
    </div>
  );
}
