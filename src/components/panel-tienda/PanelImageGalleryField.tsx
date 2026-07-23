"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { PanelImageCropModal } from "@/components/panel-tienda/PanelImageCropModal";

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
};

export function PanelImageGalleryField({ value, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Elegí un archivo de imagen.");
      return;
    }
    setError("");
    setPendingFile(file);
    setCropOpen(true);
  }

  async function uploadCropped(blob: Blob) {
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", new File([blob], "galeria.webp", { type: "image/webp" }));
      const res = await fetch("/api/tienda/upload", { method: "POST", body: form });
      const data = (await res.json()) as { ok?: boolean; url?: string; error?: string };
      if (!res.ok || !data.ok || !data.url) {
        setError(data.error ?? "No se pudo subir la imagen.");
        return;
      }
      onChange([...value, data.url]);
      setCropOpen(false);
      setPendingFile(null);
    } catch {
      setError("Error de conexión al subir la imagen.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <p className="text-sm font-semibold text-[#343833]">Fotos extra (opcional)</p>
      <p className="mt-1 text-xs text-[#777d74]">
        Se muestran en la ficha del producto. Podés agregar varias.
      </p>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        className="sr-only"
        onChange={onFileChange}
      />

      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative aspect-square overflow-hidden rounded-xl border border-[#e0e4dd] bg-[#f7f8f6]"
          >
            <Image src={url} alt="" fill className="object-cover" sizes="120px" />
            <button
              type="button"
              aria-label="Quitar foto"
              onClick={() => onChange(value.filter((item) => item !== url))}
              className="absolute top-1.5 right-1.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/95 text-[#a64b4b] shadow-sm"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#c5cec0] bg-[#f7f9f5] text-[#41613a] hover:border-[#8aa582]"
        >
          <ImagePlus className="h-5 w-5" />
          <span className="text-[11px] font-bold">Agregar</span>
        </button>
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
