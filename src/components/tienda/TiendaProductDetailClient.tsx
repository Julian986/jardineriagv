"use client";

import { useMemo, useState } from "react";
import { TiendaProductBuyBox } from "@/components/tienda/TiendaProductBuyBox";
import { TiendaProductGallery } from "@/components/tienda/TiendaProductGallery";
import {
  buildTiendaColorOptions,
  galleryFromColorOptions,
} from "@/lib/tienda/product-colors";
import type { TiendaProducto } from "@/lib/tienda/types";

type TiendaProductDetailClientProps = {
  producto: TiendaProducto;
  categoriaNombre?: string | null;
};

export function TiendaProductDetailClient({
  producto,
  categoriaNombre,
}: TiendaProductDetailClientProps) {
  const colorOptions = useMemo(() => buildTiendaColorOptions(producto), [producto]);
  const gallery = useMemo(
    () => galleryFromColorOptions(colorOptions),
    [colorOptions],
  );

  const [colorId, setColorId] = useState<string | null>(
    colorOptions[0]?.id ?? null,
  );

  const activeIndex = useMemo(() => {
    const index = colorOptions.findIndex((o) => o.id === colorId);
    if (index < 0) return 0;
    return Math.min(index, Math.max(gallery.length - 1, 0));
  }, [colorOptions, colorId, gallery.length]);

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
      <TiendaProductGallery
        nombre={producto.nombre}
        imagenes={gallery}
        categoriaLabel={producto.categoriaLabel}
        activeIndex={activeIndex}
      />

      <div className="lg:pt-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#2d4a22]">
          {categoriaNombre ?? producto.categoriaLabel}
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold leading-snug text-[#1a1a1a] sm:text-3xl lg:text-[2rem]">
          {producto.nombre}
        </h1>
        <div className="mt-6">
          <TiendaProductBuyBox
            producto={producto}
            colorOptions={colorOptions}
            onColorChange={setColorId}
          />
        </div>
      </div>
    </div>
  );
}
