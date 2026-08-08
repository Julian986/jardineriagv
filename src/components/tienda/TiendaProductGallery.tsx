"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TiendaProductGalleryProps = {
  nombre: string;
  imagenes: string[];
  categoriaLabel: string;
  /** Índice controlado (ej. al elegir un color). */
  activeIndex?: number;
};

export function TiendaProductGallery({
  nombre,
  imagenes,
  categoriaLabel,
  activeIndex,
}: TiendaProductGalleryProps) {
  const gallery = imagenes.filter(Boolean);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (typeof activeIndex !== "number") return;
    if (activeIndex < 0 || activeIndex >= gallery.length) return;
    setActive(activeIndex);
  }, [activeIndex, gallery.length]);

  const current = gallery[active] ?? gallery[0];
  if (!current) return null;

  const hasMany = gallery.length > 1;

  function go(delta: number) {
    if (!hasMany) return;
    setActive((prev) => (prev + delta + gallery.length) % gallery.length);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-md border border-[#e8e8e8] bg-white">
        <div className="bg-[#2d4a22] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-white sm:text-xs">
          {categoriaLabel} <span aria-hidden>&gt;&gt;&gt;</span>
        </div>
        <div className="relative aspect-square bg-[#f7f7f7] sm:aspect-[4/5] lg:aspect-square">
          <Image
            key={current}
            src={current}
            alt={nombre}
            fill
            priority
            className="object-cover animate-[tiendaFade_280ms_ease-out]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#c4933f]/85"
            aria-hidden
          />

          {hasMany ? (
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 flex-col gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Imagen anterior"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#e5e5e5] bg-white/95 text-[#333] shadow-sm hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Imagen siguiente"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#e5e5e5] bg-white/95 text-[#333] shadow-sm hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {hasMany ? (
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="list"
          aria-label="Miniaturas del producto"
        >
          {gallery.map((src, index) => {
            const selected = index === active;
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                role="listitem"
                onClick={() => setActive(index)}
                aria-label={`Ver imagen ${index + 1}`}
                aria-current={selected}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-[#f7f7f7] transition-all sm:h-[4.5rem] sm:w-[4.5rem] ${
                  selected
                    ? "border-[#2d4a22] ring-1 ring-[#2d4a22]"
                    : "border-[#e5e5e5] hover:border-[#2d4a22]/50"
                }`}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="72px" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
