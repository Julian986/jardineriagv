"use client";

import Image from "next/image";
import { useState } from "react";

type TiendaProductGalleryProps = {
  nombre: string;
  imagenes: string[];
  categoriaLabel: string;
};

export function TiendaProductGallery({
  nombre,
  imagenes,
  categoriaLabel,
}: TiendaProductGalleryProps) {
  const gallery = imagenes.length > 0 ? imagenes : [];
  const [active, setActive] = useState(0);
  const current = gallery[active] ?? gallery[0];

  if (!current) return null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
      {gallery.length > 1 ? (
        <div
          className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:w-20 sm:flex-col sm:overflow-visible"
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
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-[#f7f7f7] transition-all sm:h-20 sm:w-20 ${
                  selected
                    ? "border-[#2d4a22] ring-1 ring-[#2d4a22]"
                    : "border-[#e5e5e5] hover:border-[#2d4a22]/50"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="order-1 min-w-0 flex-1 sm:order-2">
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
          </div>
        </div>
      </div>
    </div>
  );
}
